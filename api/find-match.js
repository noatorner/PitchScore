// Vercel serverless function: GET /api/find-match
//
// Consulta los partidos en vivo de free-api-live-football-data (RapidAPI),
// filtra los del Mundial y devuelve su match_id real y los equipos, para que
// Kancha sepa qué partido está en juego sin intervención manual.

const { rapid, extractList, isWorldCup, teamName, teamCode } = require("./_rapid.js");

module.exports = async (req, res) => {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) return res.status(500).json({ error: "RAPIDAPI_KEY no configurada" });

  try {
    const data = await rapid("/football-get-all-live-matches", key);
    const all = extractList(data, ["live", "matches", "liveMatches", "events"]);

    const matches = all.filter(isWorldCup).map((m) => {
      const homeName = teamName(m.home || m.homeTeam);
      const awayName = teamName(m.away || m.awayTeam);
      const st = m.status || {};
      return {
        matchId: m.id || m.matchId || m.eventId || null,
        home: teamCode(homeName), homeName,
        away: teamCode(awayName), awayName,
        minute: (st.liveTime && (st.liveTime.short || st.liveTime.long)) || null,
        score: st.scoreStr || (m.homeScore != null ? `${m.homeScore} - ${m.awayScore}` : null),
        league: String(m.leagueName || m.league || ""),
      };
    }).filter((m) => m.matchId != null);

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ count: matches.length, matches });
  } catch (err) {
    return res.status(502).json({ error: "No se pudieron consultar los partidos en vivo", detail: String((err && err.message) || err) });
  }
};
