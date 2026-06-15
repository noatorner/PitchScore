// Vercel serverless function: GET /api/live-events?match_id=XXX&since=MM&home=GER
//
// Devuelve los eventos de un partido en formato Kancha.
// match_id puede ser:
//   - ID numérico de api-football (ej. "123456") → llamada directa a la API
//   - ID de Kancha (ej. "m13") → busca api_match_id en Supabase; si no hay,
//     lee de la tabla agent_events como fallback
//
// Parámetros:
//   match_id : fixture ID de api-football o ID Kancha
//   since    : último minuto ya procesado (solo devuelve eventos posteriores)
//   home     : código de equipo local (ej. "GER")

const SB_URL = process.env.SUPABASE_URL || "https://hmjyfdcbmqtoddnprtlq.supabase.co";
const SB_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtanlmZGNibXF0b2RkbnBydGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5ODQ3MjQsImV4cCI6MjA5NjU2MDcyNH0.ZkdAX_lDk1t89mbEUWIznRuiAbVQagp--1pXas2yrso";

const ZONE_NAME = {
  box6_izq:    "Área pequeña izquierda",
  box6_der:    "Área pequeña derecha",
  boxF_izq:    "Frontal del área izquierda",
  boxF_der:    "Frontal del área derecha",
  boxN_izq:    "Área grande izq. · flanco sup.",
  boxN_der:    "Área grande der. · flanco sup.",
  boxS_izq:    "Área grande izq. · flanco inf.",
  boxS_der:    "Área grande der. · flanco inf.",
  penspot_izq: "Punto de penalti izquierdo",
  penspot_der: "Punto de penalti derecho",
  med_0: "Mediocampo · sector 1",
  med_1: "Mediocampo · sector 2",
  med_2: "Mediocampo · sector 3",
  med_3: "Mediocampo · sector 4",
};

// Local ataca hacia la derecha (der), visitante hacia la izquierda (izq)
const sideFor = (isHome) => (isHome ? "der" : "izq");

// Mapea un evento de api-football al formato Kancha
function mapEvent(ev, homeTeamId) {
  const type   = String(ev.type   || "").toLowerCase();
  const detail = String(ev.detail || "").toLowerCase();
  const min    = Number((ev.time && ev.time.elapsed) || 0) || 0;
  const teamId = ev.team && ev.team.id;

  const isHome   = homeTeamId ? teamId === homeTeamId : false;
  const side     = sideFor(isHome);
  const teamName = (ev.team && ev.team.name) || "";

  let zoneId, pts, icon, action, creditHome = isHome;

  if (type === "goal" && /own goal/.test(detail)) {
    zoneId = `box6_${sideFor(!isHome)}`; pts = 40; icon = "⚽"; action = "Gol en propia"; creditHome = !isHome;
  } else if (type === "goal" && /penalty/.test(detail)) {
    zoneId = `penspot_${side}`; pts = 40; icon = "⚽"; action = "Gol (penalti)";
  } else if (type === "goal") {
    zoneId = `box6_${side}`; pts = 40; icon = "⚽"; action = "Gol";
  } else if (type === "card" && /red/.test(detail)) {
    zoneId = `med_${min % 4}`; pts = 10; icon = "🟥"; action = "Tarjeta roja";
  } else if (type === "card") {
    zoneId = `med_${min % 4}`; pts = 5; icon = "🟨"; action = "Tarjeta amarilla";
  } else if (type === "var" && /goal cancelled/.test(detail)) {
    zoneId = `box6_${side}`; pts = 0; icon = "📺"; action = "Gol anulado (VAR)";
  } else {
    return null;
  }

  return {
    min,
    type:  "act",
    icon,
    action,
    side:  creditHome ? "home" : "away",
    teamName,
    zoneId,
    zone:  ZONE_NAME[zoneId] || zoneId,
    pts,
  };
}

// Infiere side desde zone_id para eventos de agent_events (que no almacenan side)
function sideFromZone(zoneId) {
  if (!zoneId) return "home";
  if (zoneId.endsWith("_der"))  return "home";
  if (zoneId.endsWith("_izq"))  return "away";
  return "home"; // med_*, wing_*, corner_* → home por defecto
}

module.exports = async (req, res) => {
  const key       = process.env.APISPORTS_KEY || process.env.RAPIDAPI_KEY;
  const rawId     = String(req.query.match_id || "");
  const since     = Number(req.query.since || 0) || 0;
  const homeCode  = String(req.query.home || "").toUpperCase();

  res.setHeader("Cache-Control", "no-store");

  // ─── Determinar si es ID numérico (api-football) o ID Kancha ──────────────
  const isNumeric = /^\d+$/.test(rawId);
  let apiFixtureId = isNumeric ? rawId : null;
  const kanchaId  = isNumeric ? null : rawId;

  // ─── Si es ID Kancha, buscar api_match_id en Supabase ─────────────────────
  if (kanchaId) {
    try {
      const r = await fetch(
        `${SB_URL}/rest/v1/matches?id=eq.${encodeURIComponent(kanchaId)}&select=api_match_id&limit=1`,
        { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
      );
      if (r.ok) {
        const rows = await r.json();
        if (rows?.[0]?.api_match_id) apiFixtureId = String(rows[0].api_match_id);
      }
    } catch (e) { /* sin Supabase: seguir */ }
  }

  // ─── Intentar api-football si tenemos fixture ID numérico y API key ────────
  let events = [];
  if (key && apiFixtureId) {
    try {
      // 1. Obtener fixture para saber el team id del local
      let homeTeamId = null;
      const fx = await fetch(
        `https://v3.football.api-sports.io/fixtures?id=${encodeURIComponent(apiFixtureId)}`,
        { headers: { "x-apisports-key": key } }
      );
      if (fx.ok) {
        const fxData = await fx.json();
        homeTeamId = fxData?.response?.[0]?.teams?.home?.id || null;
      }

      // 2. Obtener eventos
      const evRes = await fetch(
        `https://v3.football.api-sports.io/fixtures/events?fixture=${encodeURIComponent(apiFixtureId)}`,
        { headers: { "x-apisports-key": key } }
      );
      if (evRes.ok) {
        const evData = await evRes.json();
        events = (evData?.response || [])
          .map((ev) => mapEvent(ev, homeTeamId))
          .filter(Boolean)
          .filter((e) => e.min > since);
      }
    } catch (e) { /* API caída: fallback a agent_events */ }
  }

  // ─── Fallback: leer de agent_events si api-football no devolvió nada ───────
  if (!events.length) {
    const lookupId = kanchaId || rawId; // usar ID Kancha preferentemente
    try {
      const r = await fetch(
        `${SB_URL}/rest/v1/agent_events?match_id=eq.${encodeURIComponent(lookupId)}&minute=gt.${since}&order=minute.asc&limit=500&select=minute,event_type,zone_id,pts_value,icon,label`,
        { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
      );
      if (r.ok) {
        const rows = await r.json();
        events = (rows || []).filter(Boolean).map((e) => ({
          min:      e.minute,
          type:     "act",
          icon:     e.icon || "⚡",
          action:   e.label || e.event_type || "Evento",
          side:     sideFromZone(e.zone_id),
          teamName: "",
          zoneId:   e.zone_id,
          zone:     ZONE_NAME[e.zone_id] || e.zone_id,
          pts:      e.pts_value,
        }));
      }
    } catch (e) { /* sin Supabase */ }
  }

  events.sort((a, b) => a.min - b.min);
  const lastMinute = events.length ? events[events.length - 1].min : since;

  return res.status(200).json({
    matchId: rawId,
    since,
    lastMinute,
    events,
  });
};
