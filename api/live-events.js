// Vercel serverless function: GET /api/live-events?match_id=XXX&since=MM
//
// Consulta free-api-live-football-data (RapidAPI) para el partido indicado y
// mapea sus eventos al formato de eventos de Kancha. Devuelve solo los
// eventos posteriores al minuto `since` (el último minuto ya consultado por
// el cliente), para que el polling solo añada novedades.
//
// La key vive en process.env.RAPIDAPI_KEY (variable de entorno en Vercel).

const API_HOST = "free-api-live-football-data.p.rapidapi.com";

const ZONE_NAME = {
  box6_izq: "Área pequeña izquierda",
  box6_der: "Área pequeña derecha",
  boxF_izq: "Frontal del área izquierda",
  boxF_der: "Frontal del área derecha",
  penspot_izq: "Punto de penalti izquierdo",
  penspot_der: "Punto de penalti derecho",
  med_1: "Mediocampo · sector 2",
};

// Convención de Kancha (la misma que el simulador histórico): el equipo
// local ataca de izquierda a derecha, así que sus acciones ofensivas caen en
// el lado derecho del campo y las del visitante en el izquierdo.
const sideFor = (isHome) => (isHome ? "der" : "izq");

// Mapea un evento crudo de la API a un evento Kancha. Devuelve null para los
// tipos que no puntúan (sustituciones, VAR, etc.).
function mapEvent(ev, homeName) {
  const t = String(ev.type || ev.eventType || ev.incidentType || ev.event || "").toLowerCase();
  const isHome =
    ev.isHome != null ? !!ev.isHome :
    ev.side != null ? String(ev.side).toLowerCase() === "home" :
    String(ev.team || ev.teamName || "") === homeName;
  const side = sideFor(isHome);
  const min = Number(ev.time || ev.minute || ev.min || 0) || 0;

  let zoneId, pts, icon, action, creditHome = isHome;
  if (/own.?goal/.test(t)) {
    // El balón entra en la portería que defiende el equipo del evento; el gol
    // se acredita al rival en el marcador.
    zoneId = `box6_${sideFor(!isHome)}`; pts = 40; icon = "⚽"; action = "Gol (p.p.)"; creditHome = !isHome;
  }
  else if (/goal/.test(t) && /pen/.test(t)) { zoneId = `penspot_${side}`; pts = 40; icon = "⚽"; action = "Gol (penalti)"; }
  else if (/goal/.test(t))             { zoneId = `box6_${side}`; pts = 40; icon = "⚽"; action = "Gol"; }
  else if (/pen/.test(t))              { zoneId = `penspot_${side}`; pts = 50; icon = "🎯"; action = "Penalti señalado"; }
  else if (/shot|attempt/.test(t))     { zoneId = `boxF_${side}`; pts = 25; icon = "🥅"; action = "Tiro a puerta"; }
  else if (/red.?card/.test(t))         { zoneId = `med_${(min%4)+1}`; pts = 10; icon = "🟥"; action = "Tarjeta roja"; }
  else if (/card|yellow/.test(t))       { zoneId = `med_${(min%4)+1}`; pts = 5;  icon = "🟨"; action = "Tarjeta amarilla"; }
  else return null;

  return {
    min,
    type: "act",
    icon,
    action,
    side: creditHome ? "home" : "away",
    teamName: String(ev.team || ev.teamName || (isHome ? homeName : "")) || undefined,
    zoneId,
    zone: ZONE_NAME[zoneId],
    pts,
  };
}

async function rapid(path, key) {
  const res = await fetch(`https://${API_HOST}${path}`, {
    headers: { "x-rapidapi-key": key, "x-rapidapi-host": API_HOST },
  });
  if (!res.ok) throw new Error(`RapidAPI ${res.status} en ${path}`);
  return res.json();
}

// La API devuelve estructuras distintas según el endpoint: buscamos la
// primera lista de eventos reconocible.
function extractEvents(data) {
  const r = (data && data.response) || data || {};
  const cands = [r.events, r.matchEvents, r.incidents, data && data.events];
  for (const c of cands) {
    if (Array.isArray(c)) return c;
    if (c && Array.isArray(c.events)) return c.events;
  }
  return [];
}

function extractHomeName(data) {
  const r = (data && data.response) || data || {};
  const g = r.general || r.match || r.detail || r;
  const home = (g.homeTeam && (g.homeTeam.name || g.homeTeam.teamName)) || g.homeTeamName || g.home || "";
  return String(home);
}

module.exports = async (req, res) => {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) return res.status(500).json({ error: "RAPIDAPI_KEY no configurada" });

  const matchId = req.query.match_id;
  const since = Number(req.query.since || 0) || 0;
  if (!matchId) return res.status(400).json({ error: "Falta el parámetro match_id" });

  try {
    let data;
    try {
      data = await rapid(`/football-get-match-event?eventid=${encodeURIComponent(matchId)}`, key);
    } catch (e) {
      // fallback: el detalle del partido también incluye los eventos
      data = await rapid(`/football-get-match-detail?eventid=${encodeURIComponent(matchId)}`, key);
    }

    const homeName = extractHomeName(data);
    const events = extractEvents(data)
      .map((ev) => mapEvent(ev, homeName))
      .filter(Boolean)
      .filter((e) => e.min > since)
      .sort((a, b) => a.min - b.min);

    const lastMinute = events.length ? events[events.length - 1].min : since;
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ matchId, since, lastMinute, events });
  } catch (err) {
    return res.status(502).json({ error: "No se pudo consultar la API de fútbol en vivo", detail: String((err && err.message) || err) });
  }
};
