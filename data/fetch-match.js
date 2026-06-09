#!/usr/bin/env node
// Descarga los eventos de un partido de StatsBomb open-data y guarda solo
// los relevantes para Kancha en data/events/<match_id>.json
//
// Uso: node fetch-match.js <match_id>
// Ej. (final Mundial 2022, Argentina - Francia): node fetch-match.js 3869685

const fs = require("fs");
const path = require("path");

const BASE_URL = "https://raw.githubusercontent.com/statsbomb/open-data/master/data/events";
const OUT_DIR = path.join(__dirname, "events");

// Eventos que puntúan en Kancha:
//  - Shot (incluye goles: outcome "Goal")
//  - Pass solo si es pase clave (shot_assist) o asistencia (goal_assist)
//  - Ball Recovery (descartando las recuperaciones fallidas)
//  - Foul Won solo si señala penalti
function isRelevant(ev) {
  const t = ev.type && ev.type.name;
  if (t === "Shot") return true;
  if (t === "Pass") return !!(ev.pass && (ev.pass.shot_assist || ev.pass.goal_assist));
  if (t === "Ball Recovery") return !(ev.ball_recovery && ev.ball_recovery.recovery_failure);
  if (t === "Foul Won") return !!(ev.foul_won && ev.foul_won.penalty);
  return false;
}

function slim(ev) {
  const out = {
    id: ev.id,
    index: ev.index,
    period: ev.period,
    minute: ev.minute,
    second: ev.second,
    type: ev.type.name,
    team: ev.team && ev.team.name,
    player: ev.player && ev.player.name,
    location: ev.location || null,
  };
  if (ev.shot) out.shot = { outcome: ev.shot.outcome && ev.shot.outcome.name, type: ev.shot.type && ev.shot.type.name };
  if (ev.pass) out.pass = { shot_assist: !!ev.pass.shot_assist, goal_assist: !!ev.pass.goal_assist };
  if (ev.foul_won) out.foul_won = { penalty: !!ev.foul_won.penalty };
  return out;
}

async function main() {
  const matchId = process.argv[2];
  if (!matchId || !/^\d+$/.test(matchId)) {
    console.error("Uso: node fetch-match.js <match_id>");
    process.exit(1);
  }

  const url = `${BASE_URL}/${matchId}.json`;
  console.log(`Descargando ${url} ...`);
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Error ${res.status} descargando el partido ${matchId}. ¿Existe en open-data?`);
    process.exit(1);
  }
  const events = await res.json();

  // Orden de aparición de los equipos (Starting XI): el primero ataca de
  // izquierda a derecha en el campo de Kancha; al segundo se le invierten
  // las coordenadas en el simulador.
  const teams = [];
  for (const ev of events) {
    const name = ev.team && ev.team.name;
    if (name && !teams.includes(name)) teams.push(name);
    if (teams.length === 2) break;
  }

  const kept = events.filter(isRelevant).map(slim);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outFile = path.join(OUT_DIR, `${matchId}.json`);
  fs.writeFileSync(outFile, JSON.stringify({
    meta: { matchId: Number(matchId), teams, totalEvents: events.length, keptEvents: kept.length, fetchedAt: new Date().toISOString() },
    events: kept,
  }, null, 2));

  console.log(`${teams.join(" vs ")} — ${kept.length} eventos relevantes de ${events.length} guardados en ${path.relative(process.cwd(), outFile)}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
