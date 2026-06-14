// Helpers compartidos por las funciones serverless que consultan
// free-api-live-football-data (RapidAPI). El prefijo "_" evita que Vercel
// exponga este fichero como endpoint.

const API_HOST = "free-api-live-football-data.p.rapidapi.com";

async function rapid(path, key) {
  const res = await fetch(`https://${API_HOST}${path}`, {
    headers: { "x-rapidapi-key": key, "x-rapidapi-host": API_HOST },
  });
  if (!res.ok) throw new Error(`RapidAPI ${res.status} en ${path}`);
  return res.json();
}

// La API devuelve listas bajo claves distintas según endpoint.
function extractList(data, keys) {
  const r = (data && data.response) || data || {};
  for (const k of keys) {
    if (Array.isArray(r[k])) return r[k];
    if (r[k] && Array.isArray(r[k].matches)) return r[k].matches;
  }
  if (Array.isArray(r)) return r;
  return [];
}

// Mundial masculino: id de liga 77 en FotMob (fuente de esta API) o nombre
// con "World Cup", excluyendo femenino y categorías inferiores.
function isWorldCup(m) {
  const league = String(m.leagueName || m.league || m.tournament || m.ccode || "");
  const id = Number(m.leagueId || m.league_id || (m.league && m.league.id) || 0);
  if (/women|u-?\d+|youth|femen/i.test(league)) return false;
  return id === 77 || /world cup|mundial/i.test(league);
}

function teamName(t) {
  if (!t) return "";
  if (typeof t === "string") return t;
  return String(t.longName || t.name || t.teamName || "");
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

module.exports = { API_HOST, rapid, extractList, isWorldCup, teamName, teamCode };
