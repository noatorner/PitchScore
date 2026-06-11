// Vercel serverless function: GET /api/sync-fixture[?date=YYYYMMDD]
//
// Consulta los partidos del Mundial del día (hoy en UTC por defecto) en
// free-api-live-football-data (RapidAPI) y los mapea al formato FIXTURE de
// Kancha (home, away, date, time, venue, group, status) incluyendo el
// apiMatchId real, que el cliente usa para el polling de /api/live-events.

const { rapid, extractList, isWorldCup, teamName, teamCode } = require("./_rapid.js");

const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
const FINISHED_MS = 115 * 60 * 1000; // un partido se da por terminado 115 min tras el kickoff

function todayUTC() {
  const d = new Date();
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
}

function mapMatch(m, i) {
  const homeName = teamName(m.home || m.homeTeam);
  const awayName = teamName(m.away || m.awayTeam);
  const st = m.status || {};
  const utc = st.utcTime || m.time || m.utcTime || null;
  const d = utc ? new Date(utc) : null;
  const valid = d && !isNaN(d.getTime());

  const stage = String(m.tournamentStage || m.stage || m.group || "");
  const groupMatch = stage.match(/group\s+([a-l])/i);

  // FINALIZADO también por reloj: aunque la API no marque finished todavía,
  // si la hora UTC actual supera kickoff + 115 min el partido ha terminado.
  const finishedByClock = valid && Date.now() - d.getTime() > FINISHED_MS;
  const status =
    st.cancelled ? "CANCELADO" :
    st.finished || finishedByClock ? "FINALIZADO" :
    st.started ? "EN VIVO" :
    i === 0 ? "ABIERTO" : "PROXIMO";

  return {
    id: `wc-${m.id || m.matchId || m.eventId || i}`,
    apiMatchId: m.id || m.matchId || m.eventId || null,
    home: teamCode(homeName), homeName,
    away: teamCode(awayName), awayName,
    date: valid ? `${d.getUTCDate()} ${MESES[d.getUTCMonth()]}` : "",
    time: valid ? `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}` : "",
    venue: String(m.venue || m.stadium || "Por confirmar"),
    group: groupMatch ? groupMatch[1].toUpperCase() : "",
    status,
  };
}

module.exports = async (req, res) => {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) return res.status(500).json({ error: "RAPIDAPI_KEY no configurada" });

  const date = String(req.query.date || todayUTC());
  if (!/^\d{8}$/.test(date)) return res.status(400).json({ error: "date debe ser YYYYMMDD" });

  try {
    const data = await rapid(`/football-get-matches-by-date?date=${date}`, key);
    const all = extractList(data, ["matches", "events", "fixtures"]);
    const fixture = all.filter(isWorldCup).map(mapMatch).filter((m) => m.apiMatchId != null);

    // El partido EN VIVO (si lo hay) es el activo; si no, el primero del día
    const active = fixture.find((m) => m.status === "EN VIVO") || fixture[0] || null;

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ date, count: fixture.length, active, fixture });
  } catch (err) {
    return res.status(502).json({ error: "No se pudo sincronizar el fixture", detail: String((err && err.message) || err) });
  }
};
