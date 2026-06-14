// api/admin-events.js
// API interna para el panel de administración del agente.
//
// GET  /api/admin-events              → estado del agente + eventos recientes
// POST /api/admin-events              → inyectar evento manual
// POST /api/admin-events?action=sync  → lanzar sync inmediato
//
// Protegida por AGENT_SECRET (cabecera X-Agent-Secret).

const { sb, SB_URL } = require('./_db.js');

function makeSbService(key) {
  return async (path, opts = {}) => {
    const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
      ...opts,
      headers: {
        apikey: key, Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: opts.method && opts.method !== 'GET'
          ? (opts.headers?.Prefer || 'return=minimal') : 'count=none',
        ...(opts.headers || {}),
      },
    });
    if (!r.ok) {
      const t = await r.text().catch(() => '');
      throw new Error(`SB ${r.status}: ${t.slice(0, 200)}`);
    }
    return r.status === 204 ? null : r.json();
  };
}

function authCheck(req, res) {
  const secret = process.env.AGENT_SECRET;
  if (secret && req.headers['x-agent-secret'] !== secret) {
    res.status(401).json({ error: 'Unauthorized — falta X-Agent-Secret' });
    return false;
  }
  return true;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Agent-Secret');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!authCheck(req, res)) return;

  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const sbSvc = serviceKey ? makeSbService(serviceKey) : sb;

  // ── GET: resumen del agente ──────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const [matches, events] = await Promise.all([
        sb('matches?select=*&order=kickoff_utc.asc'),
        sbSvc('agent_events?select=*&order=created_at.desc&limit=100').catch(() => []),
      ]);

      return res.status(200).json({
        ok: true,
        ts: new Date().toISOString(),
        matches: matches || [],
        events: events || [],
      });
    } catch (e) {
      return res.status(500).json({ error: String(e?.message || e) });
    }
  }

  // ── POST ?action=sync: lanzar sync ahora ─────────────────────────────────
  if (req.method === 'POST' && req.query.action === 'sync') {
    try {
      const proto = req.headers['x-forwarded-proto'] || 'https';
      const host  = req.headers.host;
      const url   = `${proto}://${host}/api/agent-sync?force=1`;
      const r = await fetch(url, {
        headers: {
          'X-Agent-Secret': process.env.AGENT_SECRET || '',
        },
      });
      const data = await r.json().catch(() => ({}));
      return res.status(r.status).json(data);
    } catch (e) {
      return res.status(500).json({ error: String(e?.message || e) });
    }
  }

  // ── POST: inyectar evento manual ──────────────────────────────────────────
  if (req.method === 'POST') {
    let body = req.body;
    if (!body || typeof body === 'string') {
      try { body = JSON.parse(body || '{}'); } catch { body = {}; }
    }

    const { match_id, zone_id, pts_value, icon, label, minute, is_home, player_name } = body;
    if (!match_id || !zone_id) {
      return res.status(400).json({ error: 'Faltan match_id y zone_id' });
    }

    try {
      const pts = Number(pts_value) || 0;

      // Insertar en agent_events con sofascore_id = 'manual-{timestamp}'
      await sbSvc('agent_events', {
        method: 'POST',
        body: JSON.stringify({
          match_id,
          sofascore_id:   `manual-${Date.now()}`,
          minute:         Number(minute) || 0,
          event_type:     'manual',
          incident_class: 'manual',
          zone_id,
          pts_value:      pts,
          icon:           icon || '⚽',
          label:          label || 'Evento manual',
          is_home:        is_home ?? null,
          player_name:    player_name || null,
          raw:            body,
          scored:         false,
        }),
      });

      // Otorgar puntos si pts > 0
      let awarded = 0;
      if (pts > 0) {
        const reservations = await sbSvc(
          `reservations?match_id=eq.${encodeURIComponent(match_id)}&zone_id=eq.${encodeURIComponent(zone_id)}&select=user_id`
        );
        for (const r of (reservations || [])) {
          const scoreRows = await sbSvc(`scores?user_id=eq.${r.user_id}&select=budget,total_points`);
          const curr = (scoreRows || [])[0] || {};
          await sbSvc(`scores?user_id=eq.${r.user_id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              budget:       (curr.budget       || 0) + pts,
              total_points: (curr.total_points || 0) + pts,
            }),
          });
          awarded++;
        }
      }

      return res.status(201).json({ ok: true, match_id, zone_id, pts, awarded });
    } catch (e) {
      return res.status(500).json({ error: String(e?.message || e) });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
