// Vercel Cron: GET /api/cron-sync (1x/día en Vercel Hobby).
// También lo llama cron-job.org cada 5 min para cobertura real.
// Sincroniza el fixture durante la ventana de partidos del Mundial
// (14:00–04:00 UTC, cubre kickoffs desde las 16h UTC).

const { runSync } = require("./_sync.js");

module.exports = async (req, res) => {
  const hour = new Date().getUTCHours();
  const inWindow = hour >= 14 || hour < 4;
  if (!inWindow) {
    return res.status(200).json({ skipped: true, reason: "fuera de la ventana de partidos (14:00–04:00 UTC)", hour });
  }
  try {
    const r = await runSync();
    return res.status(200).json({ ok: true, matches: r.count, updates: r.updates, active: r.active ? r.active.id : null });
  } catch (err) {
    return res.status(500).json({ error: String((err && err.message) || err) });
  }
};
