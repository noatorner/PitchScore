// Vercel serverless function: GET /api/sync-fixture
//
// Lee los partidos de la ventana actual desde Supabase (tabla matches),
// actualiza status/score con la API externa de fútbol (free-api-live-
// football-data, key en RAPIDAPI_KEY), persiste los cambios en Supabase y
// devuelve el fixture actualizado en formato Kancha, con `active` apuntando
// al partido EN VIVO si lo hay.

const { runSync } = require("./_sync.js");

module.exports = async (req, res) => {
  try {
    const result = await runSync();
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(result);
  } catch (err) {
    return res.status(502).json({ error: "No se pudo sincronizar el fixture", detail: String((err && err.message) || err) });
  }
};
