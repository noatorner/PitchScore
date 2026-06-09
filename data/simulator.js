#!/usr/bin/env node
// Reproduce un partido descargado con fetch-match.js: mapea cada evento
// StatsBomb a una zona de Kancha y lo emite en orden cronológico.
//
// Uso CLI: node simulator.js <match_id> [intervalo_ms]   (por defecto 3000 ms)
//
// Como módulo:
//   const { MatchSimulator } = require("./simulator");
//   const sim = new MatchSimulator(3869685, { intervalMs: 3000 });
//   sim.on("event", (ev) => ...);   // ev tiene la forma de MATCH_EVENTS de la app
//   sim.on("end", () => ...);
//   sim.start();

const fs = require("fs");
const path = require("path");
const { EventEmitter } = require("events");
const { locateZone } = require("./kancha-zones");

const EVENTS_DIR = path.join(__dirname, "events");

// Misma tabla que ACTIONS en pitchscore.js
const ACTION_META = {
  "Gol":              { icon: "⚽", pts: 40 },
  "Tiro a puerta":    { icon: "🥅", pts: 25 },
  "Penalti señalado": { icon: "🎯", pts: 50 },
  "Asistencia":       { icon: "👟", pts: 15 },
  "Pase clave":       { icon: "🪡", pts: 10 },
  "Recuperación":     { icon: "🛡", pts: 5 },
};

function classify(ev) {
  switch (ev.type) {
    case "Shot":             return ev.shot && ev.shot.outcome === "Goal" ? "Gol" : "Tiro a puerta";
    case "Own Goal Against": return "Gol";
    case "Pass":             return ev.pass && ev.pass.goal_assist ? "Asistencia" : "Pase clave";
    case "Ball Recovery":    return "Recuperación";
    case "Foul Won":         return "Penalti señalado";
    default:                 return null;
  }
}

// StatsBomb codifica cada evento con el equipo en posesión atacando de
// izquierda a derecha. Para situar a los dos equipos en el campo fijo de
// Kancha, al segundo equipo se le invierten las coordenadas.
// En un gol en propia (Own Goal Against) el evento es del equipo que se
// marca: la zona usa sus coordenadas pero el gol se acredita al rival.
function toKanchaEvent(ev, teams) {
  const action = classify(ev);
  if (!action || !ev.location) return null;
  let [x, y] = ev.location;
  if (ev.team === teams[1]) { x = 120 - x; y = 80 - y; }
  const zone = locateZone(x, y);
  const meta = ACTION_META[action];
  const isOG = ev.type === "Own Goal Against";
  return {
    min: ev.minute,
    period: ev.period,
    type: "act",
    icon: meta.icon,
    action,
    team: isOG ? (ev.team === teams[0] ? teams[1] : teams[0]) : ev.team,
    player: ev.player,
    zoneId: zone ? zone.id : null,
    zone: zone ? zone.name : "Fuera del campo",
    pts: meta.pts,
  };
}

class MatchSimulator extends EventEmitter {
  constructor(matchId, { intervalMs = 3000 } = {}) {
    super();
    this.intervalMs = intervalMs;
    const file = path.join(EVENTS_DIR, `${matchId}.json`);
    if (!fs.existsSync(file)) {
      throw new Error(`No existe ${file}. Descárgalo antes con: node fetch-match.js ${matchId}`);
    }
    const { meta, events } = JSON.parse(fs.readFileSync(file, "utf8"));
    this.meta = meta;
    this.events = events
      .slice()
      .sort((a, b) => a.period - b.period || a.minute - b.minute || a.second - b.second || a.index - b.index)
      .map((ev) => toKanchaEvent(ev, meta.teams))
      .filter(Boolean);
  }

  start() {
    let i = 0;
    this.emit("start", this.meta);
    this._timer = setInterval(() => {
      if (i >= this.events.length) { this.stop(); this.emit("end"); return; }
      this.emit("event", this.events[i++]);
    }, this.intervalMs);
    return this;
  }

  stop() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    return this;
  }
}

module.exports = { MatchSimulator, toKanchaEvent };

if (require.main === module) {
  const matchId = process.argv[2];
  const intervalMs = Number(process.argv[3]) || 3000;
  if (!matchId) {
    console.error("Uso: node simulator.js <match_id> [intervalo_ms]");
    process.exit(1);
  }
  const sim = new MatchSimulator(matchId, { intervalMs });
  sim.on("start", (meta) => console.log(`⚽ ${meta.teams.join(" vs ")} — ${sim.events.length} eventos, 1 cada ${intervalMs / 1000}s\n`));
  sim.on("event", (ev) => {
    const min = String(ev.min).padStart(2, "0");
    console.log(`${min}' ${ev.icon} ${ev.action.padEnd(16)} ${ev.team.padEnd(14)} → ${ev.zone} (${ev.zoneId}) [+${ev.pts}]`);
  });
  sim.on("end", () => console.log("\n🏁 Final del partido"));
  sim.start();
}
