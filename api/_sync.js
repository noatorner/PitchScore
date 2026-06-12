// Sincronización del fixture: lee los partidos de la ventana actual desde
// Supabase (tabla matches), refresca status/score/api_match_id con la API
// externa de fútbol, persiste los cambios y devuelve el fixture actualizado.
// Compartido por /api/sync-fixture (a demanda) y /api/cron-sync (cada 5 min).

const { rapid, extractList, isWorldCup, teamName, teamCode } = require("./_rapid.js");
const { sb } = require("./_db.js");

const FINISHED_MS = 115 * 60 * 1000; // un partido se da por terminado 115 min tras el kickoff
const OPEN_MS = 24 * 3600 * 1000;    // reservas abiertas 24h antes

function rowToKancha(r, status, score, apiId) {
  return {
    id: r.id, home: r.home, away: r.away, utc: r.kickoff_utc,
    venue: r.venue || "", group: r.group_name || "",
    status, score: score || null, apiMatchId: apiId || null,
  };
}

async function runSync() {
  const now = Date.now();
  const from = new Date(now - 6 * 3600 * 1000).toISOString();
  const to = new Date(now + 30 * 3600 * 1000).toISOString();

  const rows = (await sb(`matches?select=*&kickoff_utc=gte.${from}&kickoff_utc=lte.${to}&order=kickoff_utc.asc`)) || [];

  // Datos frescos de la API externa para las fechas de la ventana
  const apiMatches = [];
  if (process.env.RAPIDAPI_KEY && rows.length) {
    const dates = [...new Set(rows.map((r) => String(r.kickoff_utc).slice(0, 10).replace(/-/g, "")))];
    for (const d of dates) {
      try {
        const data = await rapid(`/football-get-matches-by-date?date=${d}`, process.env.RAPIDAPI_KEY);
        apiMatches.push(...extractList(data, ["matches", "events", "fixtures"]).filter(isWorldCup));
      } catch (e) { /* API caída: seguimos con el estado por reloj */ }
    }
  }

  const fixture = [];
  let updates = 0;
  for (const r of rows) {
    const ko = Date.parse(r.kickoff_utc);
    const ext = apiMatches.find((m) => {
      if (r.api_match_id && String(m.id || m.matchId) === String(r.api_match_id)) return true;
      return teamCode(teamName(m.home || m.homeTeam)) === r.home && teamCode(teamName(m.away || m.awayTeam)) === r.away;
    });

    let status = r.status, score = r.score, apiId = r.api_match_id;
    const st = (ext && ext.status) || {};
    if (ext) {
      apiId = String(ext.id || ext.matchId || apiId || "") || apiId;
      if (st.scoreStr) score = String(st.scoreStr).replace(/\s/g, "");
      else if (ext.homeScore != null) score = `${ext.homeScore}-${ext.awayScore}`;
      if (st.cancelled) status = "CANCELADO";
      else if (st.finished) status = "FINALIZADO";
      else if (st.started) status = "EN VIVO";
    }

    // Reloj UTC: estados base + FINALIZADO a kickoff+115min aunque la API
    // aún no lo haya marcado.
    if (status !== "CANCELADO") {
      const apiFinished = status === "FINALIZADO";
      if (apiFinished || now - ko > FINISHED_MS) status = "FINALIZADO";
      else if (now >= ko) status = "EN VIVO";
      else if (ko - now <= OPEN_MS) status = "ABIERTO";
      else status = "PROXIMO";
    }

    if (status !== r.status || score !== r.score || String(apiId || "") !== String(r.api_match_id || "")) {
      try {
        await sb(`matches?id=eq.${encodeURIComponent(r.id)}`, {
          method: "PATCH",
          body: JSON.stringify({ status, score, api_match_id: apiId }),
        });
        updates++;
      } catch (e) { /* el cliente seguirá calculando por reloj */ }
    }
    fixture.push(rowToKancha(r, status, score, apiId));
  }

  // Partidos de la API que aún no están en la tabla (autocompleta los 104
  // reales conforme avanza el torneo)
  const inserted = new Set();
  for (const m of apiMatches) {
    const apiId = String(m.id || m.matchId || "");
    if (!apiId || inserted.has(apiId) || rows.some((r) => String(r.api_match_id) === apiId)) continue;
    inserted.add(apiId);
    const home = teamCode(teamName(m.home || m.homeTeam));
    const away = teamCode(teamName(m.away || m.awayTeam));
    if (rows.some((r) => r.home === home && r.away === away)) continue;
    const utc = (m.status && m.status.utcTime) || m.time || null;
    if (!utc) continue;
    const stage = String(m.tournamentStage || m.stage || "");
    const g = stage.match(/group\s+([a-l])/i);
    try {
      await sb("matches", {
        method: "POST",
        body: JSON.stringify({
          id: `wc-${apiId}`, home, away, kickoff_utc: new Date(utc).toISOString(),
          venue: String(m.venue || m.stadium || ""), group_name: g ? g[1].toUpperCase() : "",
          status: "PROXIMO", api_match_id: apiId,
        }),
        headers: { Prefer: "return=minimal,resolution=ignore-duplicates" },
      });
    } catch (e) { /* duplicado o tabla sin policy de insert */ }
  }

  const active = fixture.find((m) => m.status === "EN VIVO") || null;
  return { count: fixture.length, updates, active, fixture };
}

module.exports = { runSync };
