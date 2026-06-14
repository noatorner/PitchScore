// Endpoint temporal de debug — borrar después de testear
// GET /api/debug-api
module.exports = async (req, res) => {
  const key = process.env.APISPORTS_KEY;
  if (!key) return res.status(500).json({ error: "Sin clave" });

  const results = {};

  // 1. Status de la cuenta
  try {
    const r = await fetch("https://v3.football.api-sports.io/status", {
      headers: { "x-apisports-key": key },
    });
    results.status = await r.json();
  } catch (e) { results.status = { error: String(e.message) }; }

  // 2. Buscar World Cup 2026 por nombre
  try {
    const r = await fetch("https://v3.football.api-sports.io/leagues?name=World+Cup&season=2026", {
      headers: { "x-apisports-key": key },
    });
    const d = await r.json();
    results.leagues_wc = d.response ? d.response.slice(0, 5) : d;
  } catch (e) { results.leagues_wc = { error: String(e.message) }; }

  // 3. Fixtures de hoy, league=1
  try {
    const today = new Date().toISOString().slice(0, 10);
    const r = await fetch(`https://v3.football.api-sports.io/fixtures?league=1&season=2026&date=${today}`, {
      headers: { "x-apisports-key": key },
    });
    const d = await r.json();
    results.fixtures_today_l1 = {
      errors: d.errors,
      total: d.results,
      sample: d.response ? d.response.slice(0, 2) : [],
    };
  } catch (e) { results.fixtures_today_l1 = { error: String(e.message) }; }

  // 4. Fixtures de hoy sin filtro de liga (solo fecha)
  try {
    const today = new Date().toISOString().slice(0, 10);
    const r = await fetch(`https://v3.football.api-sports.io/fixtures?date=${today}`, {
      headers: { "x-apisports-key": key },
    });
    const d = await r.json();
    const wc = (d.response || []).filter(m => {
      const name = String((m.league && m.league.name) || "").toLowerCase();
      return name.includes("world cup") || name.includes("mundial");
    });
    results.fixtures_today_all = {
      total: d.results,
      wc_matches: wc.length,
      wc_sample: wc.slice(0, 3).map(m => ({
        id: m.fixture && m.fixture.id,
        league: m.league && { id: m.league.id, name: m.league.name },
        home: m.teams && m.teams.home && m.teams.home.name,
        away: m.teams && m.teams.away && m.teams.away.name,
        date: m.fixture && m.fixture.date,
        status: m.fixture && m.fixture.status,
      })),
    };
  } catch (e) { results.fixtures_today_all = { error: String(e.message) }; }

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json(results);
};
