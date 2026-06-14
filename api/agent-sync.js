// api/agent-sync.js
// Agente autónomo de sincronización de eventos en vivo del Mundial 2026.
// Fuente: SofaScore API pública (sin API key requerida).
// Llamado cada 60s por cron externo (cron-job.org o similar).
//
// Variables Vercel necesarias:
//   SUPABASE_SERVICE_KEY  — service role key de Supabase (bypasea RLS)
//   AGENT_SECRET          — (opcional) cabecera X-Agent-Secret para proteger el endpoint

const { SB_URL } = require('./_db.js');

// ─── SofaScore ─────────────────────────────────────────────────────────────

const SS_BASE = 'https://api.sofascore.com/api/v1';
const SS_HEADS = {
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0',
  'Accept': 'application/json, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.sofascore.com/',
  'Origin': 'https://www.sofascore.com',
  'Cache-Control': 'no-cache',
};

async function ssGet(path) {
  const r = await fetch(`${SS_BASE}${path}`, { headers: SS_HEADS });
  if (!r.ok) throw new Error(`SofaScore ${r.status} en ${path}`);
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

// ─── Correspondencia código Kancha ↔ nombre SofaScore ─────────────────────

const TEAM_PATTERNS = {
  MEX: ['mexico','méxico'],    RSA: ['south africa'],
  KOR: ['south korea','korea republic'],  CAN: ['canada'],
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

function teamMatches(ssName, kCode) {
  const n = (ssName || '').toLowerCase();
  return (TEAM_PATTERNS[kCode] || [kCode.toLowerCase()]).some(p => n.includes(p));
}

// ─── Mapeo incidente SofaScore → zona Kancha ──────────────────────────────

function mapIncident(inc) {
  const { incidentType, incidentClass, time, isHome, id } = inc;
  const min    = time || 0;
  const side   = isHome ? 'der' : 'izq';   // local ataca a la derecha
  const oppSide = isHome ? 'izq' : 'der';

  switch (incidentType) {
    case 'goal':
      if (incidentClass === 'ownGoal')
        return { zone: `box6_${oppSide}`, pts: 80,  icon: '⚽', label: 'Autogol',        min };
      if (incidentClass === 'penaltyGoal')
        return { zone: `penspot_${side}`, pts: 220, icon: '⚽', label: 'Gol (penalti)',   min };
      return   { zone: `box6_${side}`,   pts: 180, icon: '⚽', label: 'Gol',             min };

    case 'card':
      if (incidentClass === 'red' || incidentClass === 'yellowRed')
        return { zone: `med_${(min % 4) || 1}`, pts: 10, icon: '🟥', label: 'Tarjeta roja', min };
      return null; // amarillas no puntúan

    case 'varDecision':
      if (incidentClass === 'penaltyConfirmed')
        return { zone: `penspot_${side}`,  pts: 100, icon: '🥅', label: 'Penalti (VAR)',    min };
      if (['goalCancelled','goalDisallowed'].includes(incidentClass))
        return { zone: `box6_${side}`,     pts: 0,   icon: '📺', label: 'Gol anulado (VAR)', min };
      return null;

    case 'cornerKick': {
      const flag = (Number(id) || min) % 2 === 0 ? 'izq' : 'der';
      return { zone: `corner_${isHome ? 'n' : 's'}_${flag}`, pts: 60, icon: '🚩', label: 'Córner', min };
    }

    default:
      return null;
  }
}

// ─── Búsqueda del partido en SofaScore ────────────────────────────────────

async function findSsEvent(homeCode, awayCode, kickoffUtc) {
  const date = kickoffUtc.slice(0, 10);
  const data  = await ssGet(`/sport/football/scheduled-events/${date}`);
  const events = data.events || [];

  // Intentamos primero filtrar por nombre de torneo
  const wcEvents = events.filter(e => {
    const t = ((e.tournament?.name || '') + ' ' + (e.tournament?.uniqueTournament?.name || '')).toLowerCase();
    return t.includes('world cup') || t.includes('mundial') || t.includes('fifa world');
  });

  const pool = wcEvents.length ? wcEvents : events;
  return pool.find(e =>
    teamMatches(e.homeTeam?.name, homeCode) && teamMatches(e.awayTeam?.name, awayCode)
  ) || null;
}

// ─── Lógica principal por partido ─────────────────────────────────────────

async function processMatch(match, sbSvc) {
  const { id: matchId, home, away, kickoff_utc } = match;

  // 1. Buscar en SofaScore
  let ssEvent;
  try {
    ssEvent = await findSsEvent(home, away, kickoff_utc);
  } catch (e) {
    return { matchId, error: `SofaScore búsqueda: ${e.message}` };
  }
  if (!ssEvent) return { matchId, home, away, error: 'No encontrado en SofaScore' };

  const ssId = ssEvent.id;

  // 2. Obtener incidents
  let incidents;
  try {
    const d = await ssGet(`/event/${ssId}/incidents`);
    incidents = d.incidents || [];
  } catch (e) {
    return { matchId, ssId, error: `Incidents: ${e.message}` };
  }

  // 3. IDs ya procesados
  let processed = new Set();
  try {
    const rows = await sbSvc(
      `agent_events?match_id=eq.${encodeURIComponent(matchId)}&select=sofascore_id`
    );
    processed = new Set((rows || []).map(r => String(r.sofascore_id)));
  } catch (e) { /* tabla puede no existir aún */ }

  // 4. Procesar nuevos incidents
  const newEvents = [];
  for (const inc of incidents) {
    const incId = String(inc.id || '');
    if (!incId || processed.has(incId)) continue;

    const mapped = mapIncident(inc);
    if (!mapped) continue;

    // Insertar en agent_events
    try {
      await sbSvc('agent_events', {
        method: 'POST',
        body: JSON.stringify({
          match_id:       matchId,
          sofascore_id:   incId,
          minute:         mapped.min,
          event_type:     inc.incidentType,
          incident_class: inc.incidentClass || null,
          zone_id:        mapped.zone,
          pts_value:      mapped.pts,
          icon:           mapped.icon,
          label:          mapped.label,
          is_home:        inc.isHome ?? null,
          player_name:    inc.player?.name || null,
          raw:            inc,
          scored:         false,
        }),
        headers: { Prefer: 'return=minimal,resolution=ignore-duplicates' },
      });
    } catch (e) {
      continue; // duplicado o error de DB, saltamos
    }

    // Otorgar puntos
    const awarded = await awardPointsForZone(matchId, mapped.zone, mapped.pts, sbSvc);

    // Marcar como puntuado
    if (awarded > 0) {
      await sbSvc(
        `agent_events?match_id=eq.${encodeURIComponent(matchId)}&sofascore_id=eq.${incId}`,
        { method: 'PATCH', body: JSON.stringify({ scored: true, scored_count: awarded }) }
      ).catch(() => {});
    }

    newEvents.push({ ...mapped, incId, awarded });
    processed.add(incId);
  }

  return { matchId, home, away, ssId, totalIncidents: incidents.length, newEvents: newEvents.length, events: newEvents };
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
      // Leer presupuesto actual
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

  // Protección opcional por cabecera secreta
  const agentSecret = process.env.AGENT_SECRET;
  if (agentSecret && req.headers['x-agent-secret'] !== agentSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

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
