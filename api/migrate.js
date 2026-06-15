// GET /api/migrate — añade columna predicted_team a reservations si no existe.
// Protegido con AGENT_SECRET para evitar ejecución accidental.
// Uso: curl https://pitch-score.vercel.app/api/migrate?secret=TU_SECRET

module.exports = async (req, res) => {
  const secret = process.env.AGENT_SECRET || "";
  if (!secret || req.query.secret !== secret) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const SB_URL = process.env.SUPABASE_URL || "https://hmjyfdcbmqtoddnprtlq.supabase.co";
  const SB_SERVICE = process.env.SUPABASE_SERVICE_KEY;
  if (!SB_SERVICE) {
    return res.status(500).json({ error: "SUPABASE_SERVICE_KEY no configurada" });
  }

  // Ejecuta SQL via Supabase Management API (POST /rest/v1/rpc o SQL endpoint)
  // Supabase expone pg_catalog via REST; usamos el endpoint /rest/v1/ con service_role
  // para hacer un SELECT que detecte si la columna ya existe.
  try {
    // Comprobamos si la columna ya existe
    const checkRes = await fetch(
      `${SB_URL}/rest/v1/reservations?select=predicted_team&limit=1`,
      {
        headers: {
          apikey: SB_SERVICE,
          Authorization: `Bearer ${SB_SERVICE}`,
        },
      }
    );

    if (checkRes.ok) {
      return res.status(200).json({ ok: true, message: "Columna predicted_team ya existe" });
    }

    // La columna no existe → ejecutar ALTER TABLE via SQL API
    const sqlRes = await fetch(`${SB_URL}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        apikey: SB_SERVICE,
        Authorization: `Bearer ${SB_SERVICE}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: "ALTER TABLE reservations ADD COLUMN IF NOT EXISTS predicted_team TEXT;",
      }),
    });

    if (!sqlRes.ok) {
      const detail = await sqlRes.text().catch(() => "");
      // Si exec_sql no existe, intentamos vía pg endpoint de Supabase
      // La forma más simple es via Supabase Dashboard o psql directo.
      return res.status(502).json({
        error: "No se pudo ejecutar ALTER TABLE automáticamente",
        detail: detail.slice(0, 500),
        manual: "Ejecuta en Supabase SQL Editor: ALTER TABLE reservations ADD COLUMN IF NOT EXISTS predicted_team TEXT;",
      });
    }

    return res.status(200).json({ ok: true, message: "Columna predicted_team añadida correctamente" });
  } catch (err) {
    return res.status(500).json({
      error: String(err && err.message ? err.message : err),
      manual: "Ejecuta en Supabase SQL Editor: ALTER TABLE reservations ADD COLUMN IF NOT EXISTS predicted_team TEXT;",
    });
  }
};
