// Sincronización del fixture: lee los partidos de la ventana actual desde
// Supabase (tabla matches), refresca status/score/api_match_id con la API
// externa de fútbol (api-football v3), persiste los cambios y devuelve el
// fixture actualizado. Compartido por /api/sync-fixture y /api/cron-sync.

const { rapid, extractList, isWorldCup, teamName, teamCode, normalizeFixture } = require("./_rapid.js");
const { sb } = require("./_db.js");

const FINISHED_MS = 115 * 60 * 1000;
const OPEN_MS = 24 * 3600 * 1000;

function rowToKancha(r, status, score, apiId) {
  return {
    id: r.id, home: r.home, away: r.away, utc: r.kickoff_utc,
    venue: r.venue || "", group: r.group_name || "",
    status, score: score || null, apiMatchId: apiId || null,
  };
}

async function runSync() {
  const key = process.env.APISPORTS_KEY || process.env.RAPIDAPI_KEY;
  const now = Date.now();
  const from = now - 48 * 3600 * 1000;
  const to   = now + 30 * 3600 * 1000;

  // Sin filtro de fecha: leemos TODOS los partidos para evitar límites de rows en Supabase.
  // Filtramos la ventana en memoria para las llamadas a la API externa.
  const allRows = (await sb(`matches?select=*&order=kickoff_utc.asc&limit=1000`)) || [];
  const rows = allRows; // procesamos todos; el bloque de API solo pide los recientes

  // Datos frescos de api-football solo para la ventana activa (última 48h + próximas 30h)
  const windowRows = allRows.filter(r => {
    const ko = Date.parse(r.kickoff_utc);
    return ko >= from && ko <= to;
  });
  const apiMatches = [];
  if (key && windowRows.length) {
    const dates = [...new Set(windowRows.map((r) => String(r.kickoff_utc).slice(0, 10)))];
    for (const d of dates) {
      try {
        const data = await rapid(`/fixtures?league=1&date=${d}`, key);
        const list = extractList(data).filter(isWorldCup).map(normalizeFixture);
        apiMatches.push(...list);
      } catch (e) { /* API caída */ }
    }
  }

  const fixture = [];
  let updates = 0;
  for (const r of rows) {
    const ko = Date.parse(r.kickoff_utc);
    const ext = apiMatches.find((m) => {
      if (r.api_match_id && String(m.id) === String(r.api_match_id)) return true;
      return teamCode(teamName(m.home)) === r.home && teamCode(teamName(m.away)) === r.away;
    });

    let status = r.status, score = r.score, apiId = r.api_match_id;
    if (ext) {
      apiId = String(ext.id || apiId || "") || apiId;
      if (ext.status.scoreStr) score = ext.status.scoreStr;
      else if (ext.homeScore != null) score = `${ext.homeScore}-${ext.awayScore}`;
      if      (ext.status.cancelled) status = "CANCELADO";
      else if (ext.status.finished)  status = "FINALIZADO";
      else if (ext.status.started)   status = "EN VIVO";
    }

    if (status !== "CANCELADO") {
      const apiFinished = status === "FINALIZADO";
      if (apiFinished || now - ko > FINISHED_MS) status = "FINALIZADO";
      else if (now >= ko)               status = "EN VIVO";
      else if (ko - now <= OPEN_MS)     status = "ABIERTO";
      else                              status = "PROXIMO";
    }

    if (status !== r.status || score !== r.score || String(apiId || "") !== String(r.api_match_id || "")) {
      try {
        await sb(`matches?id=eq.${encodeURIComponent(r.id)}`, {
          method: "PATCH",
          body: JSON.stringify({ status, score, api_match_id: apiId }),
        });
        updates++;
      } catch (e) {}
    }
    fixture.push(rowToKancha(r, status, score, apiId));
  }

  // Partidos de la API no registrados aún en Supabase
  const inserted = new Set();
  for (const m of apiMatches) {
    const apiId = String(m.id || "");
    if (!apiId || inserted.has(apiId) || rows.some((r) => String(r.api_match_id) === apiId)) continue;
    inserted.add(apiId);
    const home = teamCode(teamName(m.home));
    const away = teamCode(teamName(m.away));
    if (rows.some((r) => r.home === home && r.away === away)) continue;
    const utc = m.time || null;
    if (!utc) continue;
    const stage = String(m.tournamentStage || "");
    const g = stage.match(/group\s+([a-l])/i);
    try {
      await sb("matches", {
        method: "POST",
        body: JSON.stringify({
          id: `wc-${apiId}`, home, away, kickoff_utc: new Date(utc).toISOString(),
          venue: String(m.venue || ""), group_name: g ? g[1].toUpperCase() : "",
          status: "PROXIMO", api_match_id: apiId,
        }),
        headers: { Prefer: "return=minimal,resolution=ignore-duplicates" },
      });
    } catch (e) {}
  }

  const active = fixture.find((m) => m.status === "EN VIVO") || null;
  return { count: fixture.length, updates, active, fixture };
}

module.exports = { runSync };
