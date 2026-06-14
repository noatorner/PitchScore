// Vercel serverless function: GET /api/live-events?match_id=XXX&since=MM&home=GER
//
// Consulta api-football (v3.football.api-sports.io) para el partido indicado
// y mapea sus eventos al formato de eventos de Kancha.
// - match_id: fixture ID de api-football (api_match_id en Supabase)
// - since: último minuto ya procesado (solo devuelve eventos posteriores)
// - home: código de equipo local (ej. "GER") para asignar lado correcto

const ZONE_NAME = {
  box6_izq: "Área pequeña izquierda",
  box6_der: "Área pequeña derecha",
  boxF_izq: "Frontal del área izquierda",
  boxF_der: "Frontal del área derecha",
  boxN_izq: "Área grande izq. · flanco sup.",
  boxN_der: "Área grande der. · flanco sup.",
  boxS_izq: "Área grande izq. · flanco inf.",
  boxS_der: "Área grande der. · flanco inf.",
  penspot_izq: "Punto de penalti izquierdo",
  penspot_der: "Punto de penalti derecho",
  med_1: "Mediocampo · sector 1",
  med_2: "Mediocampo · sector 2",
  med_3: "Mediocampo · sector 3",
  med_4: "Mediocampo · sector 4",
};

// Local ataca hacia la derecha (der), visitante hacia la izquierda (izq)
const sideFor = (isHome) => (isHome ? "der" : "izq");

// Mapea un evento de api-football al formato Kancha
// homeTeamId: team.id del equipo local (para detectar isHome sin nombre)
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
  } else if (type === "goal" && /normal|header|free.?kick/.test(detail)) {
    zoneId = `box6_${side}`; pts = 40; icon = "⚽"; action = "Gol";
  } else if (type === "goal") {
    zoneId = `box6_${side}`; pts = 40; icon = "⚽"; action = "Gol";
  } else if (type === "card" && /red/.test(detail)) {
    zoneId = `med_${min % 4}`; pts = 10; icon = "🟥"; action = "Tarjeta roja";
  } else if (type === "card") {
    zoneId = `med_${min % 4}`; pts = 5; icon = "🟨"; action = "Tarjeta amarilla";
  } else if (type === "var" && /goal cancelled/.test(detail)) {
    zoneId = `box6_${side}`; pts = 0; icon = "📺"; action = "Gol anulado (VAR)";
  } else {
    return null; // sustituciones y otros eventos no puntúan
  }

  return {
    min,
    type: "act",
    icon,
    action,
    side: creditHome ? "home" : "away",
    teamName,
    zoneId,
    zone: ZONE_NAME[zoneId] || zoneId,
    pts,
  };
}

module.exports = async (req, res) => {
  const key = process.env.APISPORTS_KEY || process.env.RAPIDAPI_KEY;
  if (!key) return res.status(500).json({ error: "APISPORTS_KEY no configurada" });

  const matchId  = req.query.match_id;
  const since    = Number(req.query.since || 0) || 0;
  const homeCode = String(req.query.home || "").toUpperCase(); // e.g. "GER"
  if (!matchId) return res.status(400).json({ error: "Falta match_id" });

  try {
    // 1. Obtener fixture para saber el team id del local
    let homeTeamId = null;
    try {
      const fx = await fetch(`https://v3.football.api-sports.io/fixtures?id=${encodeURIComponent(matchId)}`, {
        headers: { "x-apisports-key": key },
      });
      if (fx.ok) {
        const fxData = await fx.json();
        const fixture = fxData && fxData.response && fxData.response[0];
        homeTeamId = fixture && fixture.teams && fixture.teams.home && fixture.teams.home.id;
      }
    } catch (e) { /* sin fixture: usamos homeCode como fallback */ }

    // 2. Obtener eventos
    const evRes = await fetch(
      `https://v3.football.api-sports.io/fixtures/events?fixture=${encodeURIComponent(matchId)}`,
      { headers: { "x-apisports-key": key } }
    );
    if (!evRes.ok) throw new Error(`API-Football ${evRes.status}`);
    const evData = await evRes.json();
    const rawEvents = (evData && evData.response) || [];

    const events = rawEvents
      .map((ev) => mapEvent(ev, homeTeamId))
      .filter(Boolean)
      .filter((e) => e.min > since)
      .sort((a, b) => a.min - b.min);

    const lastMinute = events.length ? events[events.length - 1].min : since;
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ matchId, since, lastMinute, events });
  } catch (err) {
    return res.status(502).json({
      error: "No se pudo consultar la API de fútbol en vivo",
      detail: String((err && err.message) || err),
    });
  }
};
