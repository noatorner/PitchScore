// Vercel Cron: GET /api/cron-sync (programado cada 5 min en vercel.json).
// Sincroniza el fixture solo durante la ventana de partidos del Mundial
// (18:00–03:00 UTC); fuera de ella responde sin tocar nada.

const { runSync } = require("./_sync.js");

module.exports = async (req, res) => {
  const hour = new Date().getUTCHours();
  const inWindow = hour >= 18 || hour < 3;
  if (!inWindow) {
    return res.status(200).json({ skipped: true, reason: "fuera de la ventana de partidos (18:00–03:00 UTC)", hour });
  }
  try {
    const r = await runSync();
    return res.status(200).json({ ok: true, matches: r.count, updates: r.updates, active: r.active ? r.active.id : null });
  } catch (err) {
    return res.status(500).json({ error: String((err && err.message) || err) });
  }
};
