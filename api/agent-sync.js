// api/agent-sync.js
// Agente autónomo de sincronización de eventos en vivo del Mundial 2026.
// Fuente: ESPN public API (no API key, no bloqueo desde servidores).
// Llamado cada 60s por cron externo (cron-job.org).
//
// Variables Vercel necesarias:
//   SUPABASE_SERVICE_KEY  — service role key de Supabase (bypasea RLS)

const { SB_URL } = require('./_db.js');

// ─── ESPN API ──────────────────────────────────────────────────────────────

const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world';

async function espnGet(path) {
  const r = await fetch(`${ESPN_BASE}${path}`);
  if (!r.ok) throw new Error(`ESPN ${r.status} en ${path}`);
  return r.json();
}

// ─── Supabase con service key (bypasea RLS) ────────────────────────────────

function makeSbService(serviceKey) {
  return async function sbSvc(path, opts = {}) {
    const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
      ...opts,
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: opts.method && opts.method !== 'GET'
          ? (opts.headers?.Prefer || 'return=minimal')
          : 'count=none',
        ...(opts.headers || {}),
      },
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      throw new Error(`Supabase ${r.status} ${path.split('?')[0]}: ${txt.slice(0, 200)}`);
    }
    if (r.status === 204) return null;
    return r.json();
  };
}

// ─── Correspondencia nombre ESPN ↔ código Kancha ──────────────────────────

const TEAM_PATTERNS = {
  MEX: ['mexico','méxico'],    RSA: ['south africa'],
  KOR: ['south korea','korea republic','korea rep'],  CAN: ['canada'],
  USA: ['united states','usa'], PAR: ['paraguay'],  HAI: ['haiti'],
  SCO: ['scotland'],  BRA: ['brazil','brasil'],  MAR: ['morocco','maroc'],
  AUS: ['australia'], TUR: ['turkey','türkiye'], QAT: ['qatar'],
  SUI: ['switzerland'], GER: ['germany','deutschland'],
  CUR: ['curaçao','curacao'],  CIV: ["ivory coast","côte d'ivoire","cote d'ivoire"],
  ECU: ['ecuador'],  NED: ['netherlands','holland'], JPN: ['japan'],
  TUN: ['tunisia'],  BEL: ['belgium'],  EGY: ['egypt'],  IRN: ['iran'],
  NZL: ['new zealand'], ESP: ['spain','españa'],  CPV: ['cape verde'],
  KSA: ['saudi arabia'],  URU: ['uruguay'],  FRA: ['france'],
  SEN: ['senegal'],  NOR: ['norway'],  ARG: ['argentina'],
  ALG: ['algeria','algérie'], AUT: ['austria'],  POR: ['portugal'],
  COL: ['colombia'],  UZB: ['uzbekistan'],  ENG: ['england'],
  CRO: ['croatia'],  GHA: ['ghana'],  PAN: ['panama'],
};

function teamMatches(espnName, kCode) {
  const n = (espnName || '').toLowerCase();
  return (TEAM_PATTERNS[kCode] || [kCode.toLowerCase()]).some(p => n.includes(p));
}

// ─── Mapeo evento ESPN → zona Kancha ─────────────────────────────────────
// ESPN event type.type values:
//   goal, goal---header, goal---own-goal   → gol
//   penalty---scored                        → penalti gol
//   yellow-card                             → ignorar
//   red-card, red-card---second-yellow      → tarjeta roja
//   corner                                  → córner
//   var-goal-confirmed, var-penalty-awarded → VAR

function mapEspnEvent(evt, isHome) {
  const typeType = evt.type?.type || '';
  const min = parseInt(evt.clock?.displayValue) || 0;
  const side    = isHome ? 'der' : 'izq';
  const oppSide = isHome ? 'izq' : 'der';

  switch (typeType) {
    case 'goal':
    case 'goal---header':
      return { zone: `box6_${side}`, pts: 180, icon: '⚽', label: evt.shortText || 'Gol', min };

    case 'goal---own-goal':
      return { zone: `box6_${oppSide}`, pts: 80, icon: '⚽', label: 'Autogol', min };

    case 'penalty---scored':
      return { zone: `penspot_${side}`, pts: 220, icon: '⚽', label: 'Gol (penalti)', min };

    case 'red-card':
    case 'red-card---second-yellow':
      return { zone: `med_${(min % 4) || 1}`, pts: 10, icon: '🟥', label: 'Tarjeta roja', min };

    case 'var-goal-confirmed':
      return { zone: `box6_${side}`, pts: 0, icon: '📺', label: 'Gol confirmado VAR', min };

    case 'var-penalty-awarded':
      return { zone: `penspot_${side}`, pts: 100, icon: '🥅', label: 'Penalti (VAR)', min };

    case 'corner':
    case 'corner-kick': {
      const flag = (Number(evt.id) || min) % 2 === 0 ? 'izq' : 'der';
      return { zone: `corner_${isHome ? 'n' : 's'}_${flag}`, pts: 60, icon: '🚩', label: 'Córner', min };
    }

    case 'yellow-card':
    default:
      return null;
  }
}

// ─── Buscar partido en ESPN scoreboard ────────────────────────────────────

async function findEspnEvent(homeCode, awayCode) {
  const data = await espnGet('/scoreboard');
  const events = data.events || [];

  return events.find(e => {
    const comp = e.competitions?.[0];
    if (!comp) return false;
    const home = comp.competitors.find(c => c.homeAway === 'home');
    const away = comp.competitors.find(c => c.homeAway === 'away');
    return teamMatches(home?.team?.displayName, homeCode) &&
           teamMatches(away?.team?.displayName, awayCode);
  }) || null;
}

// ─── Lógica principal por partido ─────────────────────────────────────────

async function processMatch(match, sbSvc) {
  const { id: matchId, home, away } = match;

  // 1. Buscar en ESPN
  let espnEvent;
  try {
    espnEvent = await findEspnEvent(home, away);
  } catch (e) {
    return { matchId, error: `ESPN búsqueda: ${e.message}` };
  }
  if (!espnEvent) return { matchId, home, away, error: 'No encontrado en ESPN scoreboard' };

  const espnId = espnEvent.id;
  const comp = espnEvent.competitions?.[0];
  const homeTeam = comp?.competitors?.find(c => c.homeAway === 'home')?.team?.displayName;

  // 2. Obtener keyEvents del summary
  let keyEvents;
  try {
    const d = await espnGet(`/summary?event=${espnId}`);
    keyEvents = d.keyEvents || [];
  } catch (e) {
    return { matchId, espnId, error: `Summary: ${e.message}` };
  }

  // 3. IDs ya procesados
  let processed = new Set();
  try {
    const rows = await sbSvc(
      `agent_events?match_id=eq.${encodeURIComponent(matchId)}&select=sofascore_id`
    );
    processed = new Set((rows || []).map(r => String(r.sofascore_id)));
  } catch (e) { /* tabla puede no existir aún */ }

  // 4. Procesar nuevos eventos
  const newEvents = [];
  for (const evt of keyEvents) {
    const evtId = String(evt.id || '');
    if (!evtId || processed.has(evtId)) continue;

    // Determinar si es del equipo local
    const evtTeam = evt.team?.displayName || '';
    const isHome = evtTeam ? teamMatches(evtTeam, home) : null;

    const mapped = isHome !== null ? mapEspnEvent(evt, isHome) : null;
    if (!mapped) continue;

    // Insertar en agent_events
    try {
      await sbSvc('agent_events', {
        method: 'POST',
        body: JSON.stringify({
          match_id:       matchId,
          sofascore_id:   evtId,           // reutilizamos el campo para el ID de ESPN
          minute:         mapped.min,
          event_type:     evt.type?.type || 'unknown',
          incident_class: evt.type?.text || null,
          zone_id:        mapped.zone,
          pts_value:      mapped.pts,
          icon:           mapped.icon,
          label:          mapped.label,
          is_home:        isHome,
          player_name:    evt.participants?.[0]?.athlete?.displayName || null,
          raw:            evt,
          scored:         false,
        }),
        headers: { Prefer: 'return=minimal,resolution=ignore-duplicates' },
      });
    } catch (e) {
      continue;
    }

    // Otorgar puntos
    const awarded = await awardPointsForZone(matchId, mapped.zone, mapped.pts, sbSvc);

    if (awarded > 0) {
      await sbSvc(
        `agent_events?match_id=eq.${encodeURIComponent(matchId)}&sofascore_id=eq.${evtId}`,
        { method: 'PATCH', body: JSON.stringify({ scored: true, scored_count: awarded }) }
      ).catch(() => {});
    }

    newEvents.push({ ...mapped, evtId, awarded });
    processed.add(evtId);
  }

  return { matchId, home, away, espnId, totalEvents: keyEvents.length, newEvents: newEvents.length, events: newEvents };
}

// ─── Otorgar puntos a reservations de una zona ────────────────────────────

async function awardPointsForZone(matchId, zoneId, pts, sbSvc) {
  if (!pts || pts <= 0) return 0;

  let reservations;
  try {
    reservations = await sbSvc(
      `reservations?match_id=eq.${encodeURIComponent(matchId)}&zone_id=eq.${encodeURIComponent(zoneId)}&select=user_id`
    );
  } catch (e) { return 0; }

  if (!reservations?.length) return 0;

  let count = 0;
  for (const r of reservations) {
    try {
      const scoreRows = await sbSvc(`scores?user_id=eq.${r.user_id}&select=budget,total_points`);
      const curr = (scoreRows || [])[0] || { budget: 0, total_points: 0 };
      await sbSvc(`scores?user_id=eq.${r.user_id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          budget:       (curr.budget       || 0) + pts,
          total_points: (curr.total_points || 0) + pts,
        }),
      });
      count++;
    } catch (e) { /* skip */ }
  }
  return count;
}

// ─── Handler Vercel ───────────────────────────────────────────────────────

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  // agent-sync es llamado por cron externo (cron-job.org) — no requiere secreto.
  // La protección por AGENT_SECRET la usa admin-events.js.

  // Service key obligatoria
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    return res.status(500).json({
      error: 'Falta SUPABASE_SERVICE_KEY en variables de entorno de Vercel',
    });
  }
  const sbSvc = makeSbService(serviceKey);

  try {
    // Ventana de partidos: 15:00–05:00 UTC (Mundial en USA/MEX/CAN)
    const hour = new Date().getUTCHours();
    const inWindow = hour >= 15 || hour < 5;
    if (!inWindow && !req.query.force) {
      return res.status(200).json({ ok: true, skipped: true, reason: 'Fuera de ventana', hour });
    }

    // Obtener partidos EN VIVO de Supabase
    const matches = await sbSvc('matches?status=eq.EN VIVO&select=*');
    if (!matches?.length) {
      return res.status(200).json({ ok: true, skipped: true, reason: 'No hay partidos EN VIVO' });
    }

    const results = [];
    for (const match of matches) {
      const r = await processMatch(match, sbSvc);
      results.push(r);
    }

    return res.status(200).json({
      ok: true,
      ts: new Date().toISOString(),
      liveMatches: matches.length,
      results,
    });
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) });
  }
};
