// api/agent-sync.js
// Agente autónomo de sincronización de eventos en vivo del Mundial 2026.
// Fuente: ESPN public API — commentary endpoint (coordenadas XY + tipo estructurado).
// Cubre: goles, penaltis, tiros, faltas, córners, fueras de juego, manos, tarjetas.
// Llamado cada 60s por cron-job.org.
//
// Variable Vercel necesaria:
//   SUPABASE_SERVICE_KEY  — service role key (bypasea RLS)

const { SB_URL } = require('./_db.js');

// ─── ESPN API ──────────────────────────────────────────────────────────────

const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world';

async function espnGet(path) {
  const r = await fetch(`${ESPN_BASE}${path}`);
  if (!r.ok) throw new Error(`ESPN ${r.status} en ${path}`);
  return r.json();
}

// ─── Supabase con service key ──────────────────────────────────────────────

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
  CZE: ['czech republic','czechia'], BIH: ['bosnia','herzegovina'],
};

function teamMatches(espnName, kCode) {
  const n = (espnName || '').toLowerCase();
  return (TEAM_PATTERNS[kCode] || [kCode.toLowerCase()]).some(p => n.includes(p));
}

// ─── Mapeo posicional XY → zona Kancha ────────────────────────────────────
//
// Coordenadas ESPN:
//   X: 0 = portería equipo local, 100 = portería equipo visitante
//   Y: 0 = norte (arriba), 100 = sur (abajo)
//
// Zonas Kancha:
//   _der = local ataca a la derecha (high X)
//   _izq = visitante ataca a la izquierda (low X)

function getZoneFromXY(x, y) {
  // Zona local (der): X > 65
  if (x >= 84) {
    // Área de penalti del visitante
    if (y >= 20 && y <= 80) return 'boxF_der';
    return y < 50 ? 'boxN_der' : 'boxS_der';
  }
  if (x >= 65) {
    return y < 50 ? 'boxN_der' : 'boxS_der';
  }

  // Mediocampo: X 35–65
  if (x >= 50) return y < 50 ? 'med_1' : 'med_2';
  if (x >= 35) return y < 50 ? 'med_3' : 'med_4';

  // Zona visitante (izq): X < 35
  if (x <= 16) {
    if (y >= 20 && y <= 80) return 'boxF_izq';
    return y < 50 ? 'boxN_izq' : 'boxS_izq';
  }
  return y < 50 ? 'boxN_izq' : 'boxS_izq';
}

// ─── Mapeo evento ESPN → zona + puntos Kancha ─────────────────────────────

function mapCommentaryPlay(play, isHome) {
  const type = play.type?.type || '';
  const x    = play.fieldPositionX ?? 50;
  const y    = play.fieldPositionY ?? 50;
  const min  = parseInt(play.clock?.displayValue) || 0;
  const side    = isHome ? 'der' : 'izq';
  const oppSide = isHome ? 'izq' : 'der';

  switch (type) {
    // ── Goles ──────────────────────────────────────────────────────────────
    case 'goal':
    case 'goal---header':
      return { zone: `box6_${side}`,     pts: 180, icon: '⚽', label: play.shortText || 'Gol' };

    case 'goal---own-goal':
      return { zone: `box6_${oppSide}`,  pts: 80,  icon: '⚽', label: 'Autogol' };

    case 'penalty---scored':
      return { zone: `penspot_${side}`,  pts: 220, icon: '⚽', label: 'Gol (penalti)' };

    // ── Tiros ─────────────────────────────────────────────────────────────
    case 'shot-on-target':
      return { zone: getZoneFromXY(x, y), pts: 60, icon: '🎯', label: play.shortText || 'Tiro a puerta' };

    case 'shot-blocked':
      return { zone: getZoneFromXY(x, y), pts: 40, icon: '🛡️', label: play.shortText || 'Tiro bloqueado' };

    case 'shot-off-target':
      return { zone: getZoneFromXY(x, y), pts: 20, icon: '💨', label: play.shortText || 'Tiro desviado' };

    // ── Faltas y posesión ─────────────────────────────────────────────────
    case 'foul':
      return { zone: getZoneFromXY(x, y), pts: 15, icon: '⚠️', label: play.shortText || 'Falta' };

    case 'handball':
      return { zone: getZoneFromXY(x, y), pts: 15, icon: '🤚', label: 'Mano' };

    case 'offside':
      return { zone: getZoneFromXY(x, y), pts: 10, icon: '🚫', label: 'Fuera de juego' };

    // ── Córners ───────────────────────────────────────────────────────────
    case 'corner-awarded': {
      const ns = y < 50 ? 'n' : 's';
      return { zone: `corner_${ns}_${side}`, pts: 60, icon: '🚩', label: 'Córner' };
    }

    // ── Tarjetas ──────────────────────────────────────────────────────────
    case 'yellow-card':
      return { zone: `med_${(min % 4) || 1}`, pts: 5,  icon: '🟨', label: 'Tarjeta amarilla' };

    case 'red-card':
    case 'red-card---second-yellow':
      return { zone: `med_${(min % 4) || 1}`, pts: 10, icon: '🟥', label: 'Tarjeta roja' };

    // ── VAR ───────────────────────────────────────────────────────────────
    case 'var-goal-cancelled':
    case 'var-goal-disallowed':
      return { zone: `box6_${side}`, pts: 0, icon: '📺', label: 'Gol anulado (VAR)' };

    case 'var-penalty-awarded':
      return { zone: `penspot_${side}`, pts: 100, icon: '🥅', label: 'Penalti (VAR)' };

    default:
      return null;
  }
}

// ─── Buscar partido en ESPN ────────────────────────────────────────────────

async function findEspnEvent(homeCode, awayCode) {
  const data = await espnGet('/scoreboard');
  const events = data.events || [];
  return events.find(e => {
    const comp = e.competitions?.[0];
    const home = comp?.competitors?.find(c => c.homeAway === 'home');
    const away = comp?.competitors?.find(c => c.homeAway === 'away');
    return teamMatches(home?.team?.displayName, homeCode) &&
           teamMatches(away?.team?.displayName, awayCode);
  }) || null;
}

// ─── Lógica principal por partido (batch-optimized para no hacer timeout) ──

async function processMatch(match, sbSvc) {
  const { id: matchId, home, away } = match;

  // 1. Buscar en ESPN scoreboard
  let espnEvent;
  try {
    espnEvent = await findEspnEvent(home, away);
  } catch (e) {
    return { matchId, error: `ESPN búsqueda: ${e.message}` };
  }
  if (!espnEvent) return { matchId, home, away, error: 'No encontrado en ESPN scoreboard' };

  const espnId = espnEvent.id;

  // 2. Obtener commentary del summary
  let commentary;
  try {
    const d = await espnGet(`/summary?event=${espnId}`);
    commentary = d.commentary || [];
  } catch (e) {
    return { matchId, espnId, error: `Summary: ${e.message}` };
  }

  // Extraer plays únicos con posición
  const playsSeen = new Set();
  const plays = [];
  for (const item of commentary) {
    const p = item.play;
    if (!p || p.fieldPositionX === undefined) continue;
    if (playsSeen.has(p.id)) continue;
    playsSeen.add(p.id);
    plays.push(p);
  }

  // 3. IDs ya procesados — 1 sola query
  const existingRows = await sbSvc(
    `agent_events?match_id=eq.${encodeURIComponent(matchId)}&select=sofascore_id`
  ).catch(() => []);
  const processed = new Set((existingRows || []).map(r => String(r.sofascore_id)));

  // 4. Reservations del partido — 1 sola query
  const reservationRows = await sbSvc(
    `reservations?match_id=eq.${encodeURIComponent(matchId)}&select=user_id,zone_id`
  ).catch(() => []);

  // Mapa zona → [user_id]
  const zoneUsers = {};
  for (const r of (reservationRows || [])) {
    if (!zoneUsers[r.zone_id]) zoneUsers[r.zone_id] = [];
    zoneUsers[r.zone_id].push(r.user_id);
  }

  // 5. Mapear nuevos plays
  const toInsert = [];    // filas para batch INSERT
  const toScore  = [];    // { playId, zone, pts } para otorgar puntos

  for (const play of plays) {
    const playId = String(play.id || '');
    if (!playId || processed.has(playId)) continue;

    const teamName = play.team?.displayName || '';
    const isHome = teamName ? teamMatches(teamName, home) : null;
    if (isHome === null) continue;

    const mapped = mapCommentaryPlay(play, isHome);
    if (!mapped) continue;

    toInsert.push({
      match_id:   matchId,
      sofascore_id: playId,
      minute:     parseInt(play.clock?.displayValue) || 0,
      event_type: play.type?.type || 'unknown',
      zone_id:    mapped.zone,
      pts_value:  mapped.pts,
      icon:       mapped.icon,
      label:      mapped.label,
      scored:     false,
    });
    toScore.push({ playId, zone: mapped.zone, pts: mapped.pts });
  }

  // 6. Batch INSERT de todos los eventos nuevos — 1 sola query
  if (toInsert.length > 0) {
    await sbSvc('agent_events', {
      method: 'POST',
      body: JSON.stringify(toInsert),
      headers: { Prefer: 'return=minimal,resolution=ignore-duplicates' },
    }).catch(() => {});
  }

  // 7. Acumular puntos por usuario (evita múltiples writes por usuario)
  const userPointsMap = {}; // userId → pts totales
  const scoredIds = [];

  for (const ev of toScore) {
    const users = zoneUsers[ev.zone] || [];
    if (!users.length || ev.pts <= 0) continue;
    for (const uid of users) {
      userPointsMap[uid] = (userPointsMap[uid] || 0) + ev.pts;
    }
    scoredIds.push(ev.playId);
  }

  // 8. Escribir puntos — 2 queries por usuario (read + write)
  for (const [userId, totalPts] of Object.entries(userPointsMap)) {
    try {
      const rows = await sbSvc(`scores?user_id=eq.${userId}&select=budget,total_points`);
      const curr = (rows || [])[0] || { budget: 0, total_points: 0 };
      await sbSvc(`scores?user_id=eq.${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          budget:       (curr.budget       || 0) + totalPts,
          total_points: (curr.total_points || 0) + totalPts,
        }),
      });
    } catch (e) { /* skip */ }
  }

  // 9. Marcar como scored — 1 sola query con filtro IN
  if (scoredIds.length > 0) {
    const idList = scoredIds.join(',');
    await sbSvc(
      `agent_events?match_id=eq.${encodeURIComponent(matchId)}&sofascore_id=in.(${idList})`,
      { method: 'PATCH', body: JSON.stringify({ scored: true, scored_count: 1 }) }
    ).catch(() => {});
  }

  // 10. Reintentar scored:false — 1 query + 2 queries por usuario
  let retried = 0;
  try {
    const unscored = await sbSvc(
      `agent_events?match_id=eq.${encodeURIComponent(matchId)}&scored=eq.false&pts_value=gt.0&select=sofascore_id,zone_id,pts_value`
    );
    const retryUserPts = {};
    const retryIds = [];
    for (const ev of (unscored || [])) {
      const users = zoneUsers[ev.zone_id] || [];
      if (!users.length) continue;
      for (const uid of users) {
        retryUserPts[uid] = (retryUserPts[uid] || 0) + ev.pts_value;
      }
      retryIds.push(ev.sofascore_id);
    }
    for (const [userId, totalPts] of Object.entries(retryUserPts)) {
      const rows = await sbSvc(`scores?user_id=eq.${userId}&select=budget,total_points`).catch(() => []);
      const curr = (rows || [])[0] || { budget: 0, total_points: 0 };
      await sbSvc(`scores?user_id=eq.${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          budget:       (curr.budget       || 0) + totalPts,
          total_points: (curr.total_points || 0) + totalPts,
        }),
      }).catch(() => {});
      retried++;
    }
    if (retryIds.length > 0) {
      await sbSvc(
        `agent_events?match_id=eq.${encodeURIComponent(matchId)}&sofascore_id=in.(${retryIds.join(',')})`,
        { method: 'PATCH', body: JSON.stringify({ scored: true, scored_count: 1 }) }
      ).catch(() => {});
    }
  } catch (e) { /* ignorar */ }

  return {
    matchId, home, away, espnId,
    totalPlays: plays.length,
    newEvents:  toInsert.length,
    scored:     scoredIds.length,
    usersAwarded: Object.keys(userPointsMap).length,
    retried,
  };
}

// ─── Handler Vercel ───────────────────────────────────────────────────────

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    return res.status(500).json({ error: 'Falta SUPABASE_SERVICE_KEY' });
  }
  const sbSvc = makeSbService(serviceKey);

  try {
    // Ventana de partidos: 15:00–05:00 UTC
    const hour = new Date().getUTCHours();
    const inWindow = hour >= 15 || hour < 5;
    if (!inWindow && !req.query.force) {
      return res.status(200).json({ ok: true, skipped: true, reason: 'Fuera de ventana', hour });
    }

    const matches = await sbSvc('matches?status=eq.EN VIVO&select=*');
    if (!matches?.length) {
      return res.status(200).json({ ok: true, skipped: true, reason: 'No hay partidos EN VIVO' });
    }

    const results = [];
    for (const match of matches) {
      results.push(await processMatch(match, sbSvc));
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
