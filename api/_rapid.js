// API-Football (v3.football.api-sports.io) — reemplaza RapidAPI/FotMob.
// Mundial 2026: league=1, season=2026.
// Header de autenticación: x-apisports-key (distinto de RapidAPI).

const API_HOST = "v3.football.api-sports.io";

async function rapid(path, key) {
  const res = await fetch(`https://${API_HOST}${path}`, {
    headers: { "x-apisports-key": key },
  });
  if (!res.ok) throw new Error(`API-Football ${res.status} en ${path}`);
  const json = await res.json();
  // La API devuelve { errors: {} } cuando algo falla aunque el HTTP sea 200
  const errs = json && json.errors;
  if (errs && (Array.isArray(errs) ? errs.length : Object.keys(errs).length)) {
    throw new Error(`API-Football errors: ${JSON.stringify(errs)}`);
  }
  return json;
}

// Todos los endpoints de api-football devuelven { response: [...] }
function extractList(data) {
  if (data && Array.isArray(data.response)) return data.response;
  return [];
}

// Mundial masculino: league.id === 1 en api-football
function isWorldCup(m) {
  const id = m && m.league && m.league.id;
  const name = String((m && m.league && m.league.name) || "");
  if (/women|u-?\d+|youth|femen/i.test(name)) return false;
  return id === 1 || /world cup|mundial/i.test(name);
}

// Extrae el nombre de equipo de un objeto de api-football o de una cadena
function teamName(t) {
  if (!t) return "";
  if (typeof t === "string") return t;
  return String(t.name || t.longName || "");
}

// Nombre de equipo (inglés, como lo da la API) → código de bandera de Kancha
const TEAM_CODE = {
  "mexico": "MEX", "south africa": "RSA", "south korea": "KOR", "korea republic": "KOR",
  "czech republic": "CZE", "czechia": "CZE", "canada": "CAN", "bosnia and herzegovina": "BIH",
  "usa": "USA", "united states": "USA", "paraguay": "PAR", "haiti": "HAI", "scotland": "SCO",
  "brazil": "BRA", "argentina": "ARG", "spain": "ESP", "france": "FRA", "germany": "GER",
  "italy": "ITA", "portugal": "POR", "netherlands": "NED", "england": "ENG", "belgium": "BEL",
  "uruguay": "URU", "colombia": "COL", "japan": "JPN", "australia": "AUS", "costa rica": "CRC",
  "panama": "PAN", "norway": "NOR", "switzerland": "SUI", "croatia": "CRO", "morocco": "MAR",
  "turkey": "TUR", "türkiye": "TUR", "qatar": "QAT", "ivory coast": "CIV", "côte d'ivoire": "CIV",
  "cote d'ivoire": "CIV", "ecuador": "ECU", "curacao": "CUR", "curaçao": "CUR", "egypt": "EGY",
};

function teamCode(name) {
  const n = String(name || "").toLowerCase().trim();
  return TEAM_CODE[n] || n.slice(0, 3).toUpperCase();
}

// Convierte un fixture de api-football al formato interno que usa _sync.js
// (equivalente al formato FotMob anterior pero con datos reales).
function normalizeFixture(m) {
  const fs = (m.fixture && m.fixture.status && m.fixture.status.short) || "";
  const finished  = ["FT","AET","PEN"].includes(fs);
  const started   = ["1H","HT","2H","ET","P","BT"].includes(fs);
  const cancelled = ["CANC","PST","ABD","AWD","WO"].includes(fs);
  const goals = m.goals || {};
  const scoreStr = (goals.home != null && goals.away != null) ? `${goals.home}-${goals.away}` : null;
  return {
    id:      m.fixture && m.fixture.id,
    matchId: m.fixture && m.fixture.id,
    home:    m.teams && m.teams.home,   // { id, name, logo }
    away:    m.teams && m.teams.away,
    homeScore: goals.home,
    awayScore: goals.away,
    league:  m.league,
    time:    m.fixture && m.fixture.date,
    venue:   m.fixture && m.fixture.venue && m.fixture.venue.name,
    tournamentStage: m.league && m.league.round,
    status:  { finished, started, cancelled, scoreStr },
  };
}

module.exports = { API_HOST, rapid, extractList, isWorldCup, teamName, teamCode, normalizeFixture };
