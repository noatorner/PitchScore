// Endpoint temporal de debug — muestra scores + reservas en Supabase
// GET /api/debug-scores
const { sb } = require("./_db.js");

module.exports = async (req, res) => {
  try {
    const [scores, reservations, matches] = await Promise.all([
      sb("scores?select=*&order=total_points.desc&limit=20"),
      sb("reservations?select=*&order=created_at.desc&limit=50"),
      sb("matches?select=*&order=kickoff_utc.asc"),
    ]);

    const matchMap = {};
    (matches || []).forEach(m => { matchMap[m.id] = m; });

    const enriched = (reservations || []).map(r => ({
      user_id: r.user_id,
      match: r.match_id,
      match_status: matchMap[r.match_id]?.status,
      api_match_id: matchMap[r.match_id]?.api_match_id,
      zones: r.zone_ids,
      spent: r.zone_ids ? r.zone_ids.length * 10 : 0,
      created_at: r.created_at,
    }));

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      scores: scores || [],
      matches: (matches || []).map(m => ({
        id: m.id, home: m.home, away: m.away,
        status: m.status, score: m.score,
        api_match_id: m.api_match_id,
        kickoff_utc: m.kickoff_utc,
      })),
      reservations: enriched,
    });
  } catch (e) {
    return res.status(500).json({ error: String(e.message) });
  }
};
