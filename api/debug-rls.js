// Test de RLS en tabla reservations — temporal
// GET /api/debug-rls
const { sb, sbRaw } = require("./_db.js");

module.exports = async (req, res) => {
  const results = {};

  // 1. Descripción de columnas de reservations
  try {
    const r = await sb("reservations?select=*&limit=1");
    results.reservations_read = { ok: true, sample: r };
  } catch (e) {
    results.reservations_read = { ok: false, error: String(e.message) };
  }

  // 2. Test de insert con service role (bypasa RLS)
  const testRow = {
    user_id: "00000000-0000-0000-0000-000000000001",
    match_id: "test-rls",
    zone_id:  "box6_der",
    price:    10,
  };
  try {
    const r = await sb("reservations", {
      method: "POST",
      body: JSON.stringify(testRow),
      headers: { Prefer: "return=minimal" },
    });
    results.service_role_insert = { ok: true };
    // Limpia el test
    await sb("reservations?match_id=eq.test-rls&user_id=eq.00000000-0000-0000-0000-000000000001", {
      method: "DELETE",
    });
    results.cleanup = "ok";
  } catch (e) {
    results.service_role_insert = { ok: false, error: String(e.message) };
  }

  // 3. Estructura de la tabla (via information_schema si disponible)
  try {
    const r = await sb("reservations?select=user_id,match_id,zone_id,price&limit=0");
    results.columns_exist = "user_id,match_id,zone_id,price all accessible";
  } catch (e) {
    results.columns_exist = { error: String(e.message) };
  }

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json(results);
};
