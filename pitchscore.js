// ===== DATA =====
const FLAGS = {
  MEX:"🇲🇽",RSA:"🇿🇦",KOR:"🇰🇷",CZE:"🇨🇿",CAN:"🇨🇦",BIH:"🇧🇦",
  USA:"🇺🇸",PAR:"🇵🇾",HAI:"🇭🇹",SCO:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",BRA:"🇧🇷",ARG:"🇦🇷",MAR:"🇲🇦",
  ESP:"🇪🇸",FRA:"🇫🇷",GER:"🇩🇪",ITA:"🇮🇹",POR:"🇵🇹",NED:"🇳🇱",
  ENG:"🇬🇧",BEL:"🇧🇪",URU:"🇺🇾",COL:"🇨🇴",JPN:"🇯🇵",AUS:"🇦🇺",
  CRC:"🇨🇷",PAN:"🇵🇦",NOR:"🇳🇴",SUI:"🇨🇭",CRO:"🇭🇷",
  TUR:"🇹🇷",QAT:"🇶🇦",CIV:"🇨🇮",ECU:"🇪🇨",CUR:"🇨🇼",EGY:"🇪🇬",
};
const COUNTRY_NAME = {
  MEX:"México",RSA:"Sudáfrica",KOR:"Corea del Sur",CZE:"Rep. Checa",
  CAN:"Canadá",BIH:"Bosnia y Herz.",USA:"EE.UU.",PAR:"Paraguay",
  HAI:"Haití",SCO:"Escocia",BRA:"Brasil",ARG:"Argentina",
  ESP:"España",FRA:"Francia",GER:"Alemania",ITA:"Italia",
  POR:"Portugal",NED:"Países Bajos",ENG:"Inglaterra",BEL:"Bélgica",
  URU:"Uruguay",COL:"Colombia",JPN:"Japón",AUS:"Australia",
  CRC:"Costa Rica",PAN:"Panamá",NOR:"Noruega",SUI:"Suiza",CRO:"Croacia",MAR:"Marruecos",
  TUR:"Turquía",QAT:"Qatar",CIV:"Costa de Marfil",ECU:"Ecuador",CUR:"Curaçao",EGY:"Egipto",
  FCB:"Barcelona",RMA:"Real Madrid",MUN:"Man. United",JUV:"Juventus",
  LIV:"Liverpool",BAY:"Bayern Munich",BVB:"B. Dortmund",TOT:"Tottenham",
  ATM:"Atlético Madrid",ACM:"AC Milan",INT:"Inter Milan",
};
// Escudos de club (crests.football-data.org) para los partidos históricos de clubes
const CLUB_CREST = { FCB:81, RMA:86, MUN:66, JUV:109, LIV:64, BAY:5, BVB:4, TOT:73, ATM:78, ACM:98, INT:108 };
const FLAG_ISO = {
  MEX:"mx",RSA:"za",KOR:"kr",CZE:"cz",CAN:"ca",BIH:"ba",
  USA:"us",PAR:"py",HAI:"ht",SCO:"gb-sct",BRA:"br",ARG:"ar",
  ESP:"es",FRA:"fr",GER:"de",ITA:"it",POR:"pt",NED:"nl",MAR:"ma",
  ENG:"gb-eng",BEL:"be",URU:"uy",COL:"co",JPN:"jp",AUS:"au",
  CRC:"cr",PAN:"pa",NOR:"no",SUI:"ch",CRO:"hr",
  TUR:"tr",QAT:"qa",CIV:"ci",ECU:"ec",CUR:"cw",EGY:"eg",
};

const KANCHA_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ4AAAATCAYAAABhq7R9AAAACXBIWXMAAAsSAAALEgHS3X78AAAFDklEQVRogc2az3HjNhTGf87sMTNyKrB8Ym6rsAHJDXC1FSxdQZwKLFewTgVSKojNBkwXsFz5Zp4iVRB7JnfngAcvBAIiCZKyvxnNLLHgx2fiw/sHHr28vPDeUBbZGHiK4uSpB57UGLpuy+ngWEVxsvHMnQNzYAJ8dEx5BtbADXCzhycFxvo6ipNFG5uFw7wnj+Ikb8vh4Bz7bG6LD2WR5cBUD0RxctTEANTLM1/uAzDrQSwTIAc2ZZF15RsDl8b1PIDT5siBjTmhLLILYAGMarhGqHc9Bb6WRXYPpI7FTDHWRLjb4tK6zgM4XiGbYVkW2XkUJ6suXAA/BRgwQe3aIUU3Ev68LLLjLpwWeuUsi+y4LLI18JV60bkwBf6RRX230KKTy2Uf9rYSniUMjSFEpzGU+NbyvGCITTnVkLoF/gQ+A79JBPkFOAPOgVsHXS+LOQQs0Wl0tvdDCwMOLToNLb7OzzFwYnCuAzkWVEX3RxQn1/ZEsTuXy5WkKtfAJ2PasiyyTR+5WF/wiE5jWRYZoWG3kcd7A9H9JfwafXm+Z+PfI+Fs7flEOL9bw2cu0bkQxckmipM56u80sWhry1DwiM62N9jz1QrvLUQXxUkKzOhffKnFqcWXBvCYuArxVPJ3bo2hac9pRRA8ojsXe8+t8SDx7Q21e7zRxcCiI4qTp7LIZuzmUV3D7hNK0Ct+hLkR7cPGzLpuep8L16jiRKPigeU9HAR7RLcCiOJkVRYZ1pzWYbcivLLI9jX2XoXRBXWi0xhCfHLPvCyyFfDF+K/QnGXbpbcl4XknRMvCmrgL5W+DOtFp9CG+NlXt9pCi0xChzOg57MrzXDnLoiVVXwXPm6Kp6DRkPDjsthHeSVlknRa7reg0BhbflTV8Kd6wKVwnFI0hvcCZ8Tt4jtdWdBpdxFcJtebJhUMoUwLD3J6WyUT48hqKCWAvSudWSxQni7LINuy++C8SNlLPbRuMk4WyyNIO3fwFuxXymcPG2tMkGzUpkzkvxd0ymZRFdrzvvcomGTv+qzbsHj1+u83Zc2S2p6pNm/bAavp0JucN1aOdGaqKPKm5tyI+yQ/N/OjMJ3DPAtyiCoe/TQ7UBjDHtsAkcDN+N4aeozg5DjnGdHCbwrtynffW9OlAtZ/0mmyM8TFqXebsX1Ov16wNtSKuCe4wV9sD84ju1uLTnJcooZi/S6qiu/fY0yXsrlBhw+z1fcJRsUZxcsNuG0Q3pMdNn2cUTSYa9QH7QMM+3QhVgC3ZXZOljNuia9zna5TjSdU2w90Dm/nu25PTzaM4maDyq2fXvR5sUbto5rCnL/HNqDaaXZhb1x9R564r34aUfG4uHu2OahQ5iPBq+nSnqI3dBveo48GUhjlf4+LCSPBNVY+AOxdxk0JC3P+YH2eYphfR2MozP0dxMjb6SUMVHGuq4vPNs18yKE/wvSyyFynG9G8D/IsK0VPrnl4a8k3QoE+3kY19inIMPhHeo86kT6M4eT16bFpw1OZ4HuNX7PbAdowPrV5D4Dmsf0CJZ0LDHM/BO0HlN3aY3+GQeSvCq9srrO8Eh8rxQqvXENQ9q/VnUeBtQyyNMJNzANGJLV7PB/zcgdeV2zrnSdrg+/LEhQfU+zuN4mTxHjxd36jzfEeP325TAr92LdUXt3Y+8x+7C/7U9PC8C8TzXVjDj8CvxrX36+EWvLUcsvmO2T1a28hvXSe0coAvkKke862lSBoUHo1c/w+ZJkA4KukbKQAAAABJRU5ErkJggg==";

function Flag({ code, h = 16, round = false, fill = false, className = "", style = {} }) {
  const cls = "ps-flagimg" + (round ? " ps-flagimg-round" : "") + (className ? " " + className : "");
  const st = fill ? { width:"100%", height:"100%", ...style } : { height: h + "px", width:"auto", ...style };
  if (CLUB_CREST[code]) {
    return <img className={cls + " ps-flagimg-crest"} src={`https://crests.football-data.org/${CLUB_CREST[code]}.png`} alt={COUNTRY_NAME[code]||code} style={st} loading="lazy" />;
  }
  const iso = FLAG_ISO[code] || "xx";
  const bucket = h <= 18 ? 40 : h <= 30 ? 80 : 160;
  return <img className={cls} src={`https://flagcdn.com/w${bucket}/${iso}.png`} srcSet={`https://flagcdn.com/w${bucket*2}/${iso}.png 2x`} alt={COUNTRY_NAME[code]||code} style={st} loading="lazy" />;
}

// ===== FIXTURE DINÁMICO =====
// El fixture vive en Supabase (tabla matches, ver supabase/matches.sql) y lo
// mantiene actualizado /api/cron-sync. Este fallback embebido solo se usa si
// la tabla aún no responde: sin estados ni marcadores hardcodeados — el
// status se calcula por reloj UTC y el score llega siempre de Supabase.
// Fixture real del Mundial 2026 — sincronizado con Supabase en tiempo real,
// este fallback se usa si Supabase no responde. Equipos y horarios oficiales FIFA.
const FALLBACK_FIXTURE = [
  // Jornada 1 (11–12 jun) — FINALIZADO
  { id:"m1",  home:"MEX", away:"RSA",  utc:"2026-06-11T19:00:00Z", venue:"Estadio Azteca · México",           group:"A", dbStatus:"FINALIZADO", score:"2-0" },
  { id:"m2",  home:"KOR", away:"CZE",  utc:"2026-06-12T02:00:00Z", venue:"Estadio Akron · Guadalajara",       group:"A", dbStatus:"FINALIZADO", score:"2-1" },
  { id:"m3",  home:"CAN", away:"BIH",  utc:"2026-06-12T19:00:00Z", venue:"BMO Field · Toronto",               group:"B", dbStatus:"FINALIZADO", score:"1-1" },
  { id:"m4",  home:"USA", away:"PAR",  utc:"2026-06-13T01:00:00Z", venue:"SoFi Stadium · Los Ángeles",        group:"D", dbStatus:"FINALIZADO", score:"4-1" },
  // Jornada 2 (13–14 jun) — FINALIZADO
  { id:"m5",  home:"HAI", away:"SCO",  utc:"2026-06-14T01:00:00Z", venue:"Gillette Stadium · Boston",         group:"C", dbStatus:"FINALIZADO", score:"0-1" },
  { id:"m6",  home:"BRA", away:"MAR",  utc:"2026-06-13T22:00:00Z", venue:"MetLife Stadium · Nueva York",      group:"C", dbStatus:"FINALIZADO", score:"1-1" },
  { id:"m7",  home:"AUS", away:"TUR",  utc:"2026-06-14T04:00:00Z", venue:"BC Place · Vancouver",              group:"D", dbStatus:"FINALIZADO", score:"2-0" },
  { id:"m8",  home:"QAT", away:"SUI",  utc:"2026-06-13T19:00:00Z", venue:"Levi's Stadium · San Francisco",    group:"B", dbStatus:"FINALIZADO", score:"1-1" },
  // Jornada 3 (14–15 jun) — HOY
  { id:"m9",  home:"GER", away:"CUR",  utc:"2026-06-14T17:00:00Z", venue:"NRG Stadium · Houston",             group:"E", dbStatus:"FINALIZADO", score:"7-1" },
  { id:"m10", home:"NED", away:"JPN",  utc:"2026-06-14T20:00:00Z", venue:"AT&T Stadium · Dallas",             group:"F" },
  { id:"m11", home:"CIV", away:"ECU",  utc:"2026-06-14T23:00:00Z", venue:"Lincoln Financial Field · Filadelfia", group:"E" },
  { id:"m12", home:"BEL", away:"EGY",  utc:"2026-06-15T19:00:00Z", venue:"Lumen Field · Seattle",            group:"G" },
];
const FIXTURE = []; // misma referencia siempre; se rellena con setFixture()

// Estado según el reloj UTC (idéntico para todos los usuarios):
//   ABIERTO ≤24h antes · PROXIMO antes · EN VIVO durante · FINALIZADO después
const MATCH_MS = 115 * 60 * 1000; // un partido se da por terminado 115 min tras el kickoff
const RESERVE_CLOSE_MS = 15 * 60 * 1000; // las reservas cierran 15 min antes del kickoff
const MESES = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
function kickoffDate(m) { return new Date(m.utc); }
function fixtureStatus(m, now = Date.now()) {
  const diff = kickoffDate(m) - now;
  if (diff <= -MATCH_MS) return "FINALIZADO";
  if (diff <= 0) return "EN VIVO";
  if (diff <= 24 * 3600 * 1000) return "ABIERTO";
  return "PROXIMO";
}
// Número de jornada dinámico (agrupa por día UTC, ordinal 1-N)
function matchRound(m) {
  const day = m.utc ? m.utc.slice(0,10) : "";
  const days = [...new Set(FIXTURE.map(x=>x.utc?x.utc.slice(0,10):""))].sort().filter(Boolean);
  const n = days.indexOf(day);
  return n >= 0 ? n + 1 : 1;
}
// Label corto de fecha: "14 JUN"
function matchDateLabel(m) {
  if(!m.utc) return "";
  const d = new Date(m.utc);
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]}`;
}

// date = calendario de la sede (aprox. huso central americano, UTC-5: válido
// para sedes UTC-4..-7 con kickoffs diurnos); time = hora local del usuario.
// FINALIZADO/CANCELADO de Supabase son autoritativos; el resto, por reloj.
function decorateFixture() {
  FIXTURE.forEach((m) => {
    m.time = new Date(m.utc).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    const vd = new Date(Date.parse(m.utc) - 5 * 3600 * 1000);
    m.date = `${vd.getUTCDate()} ${MESES[vd.getUTCMonth()]}`;
    m.status = (m.dbStatus === "FINALIZADO" || m.dbStatus === "CANCELADO") ? m.dbStatus : fixtureStatus(m);
  });
  FIXTURE.sort((a, b) => kickoffDate(a) - kickoffDate(b));
  FIXTURE.forEach((m) => { delete m.featured; });
  const feat = FIXTURE.find((m) => m.status === "EN VIVO") || FIXTURE.find((m) => m.status === "ABIERTO") || FIXTURE.find((m) => m.status === "PROXIMO") || FIXTURE[0];
  if (feat) feat.featured = true;
}
function setFixture(list) {
  FIXTURE.length = 0;
  list.forEach((m) => FIXTURE.push(m));
  decorateFixture();
}
setFixture(FALLBACK_FIXTURE.map((m) => ({ ...m })));

// Carga el fixture real desde Supabase; devuelve false si no hay datos
// (la app sigue con el fallback embebido).
// También parchea en background cualquier fila de Supabase cuyo equipo,
// horario o resultado no coincida con FALLBACK_FIXTURE (migración de datos del seed antiguo).
async function loadFixture() {
  const db = window.supabaseClient;
  if (!db) return false;
  try {
    const { data, error } = await db.from('matches').select('*').order('kickoff_utc', { ascending: true });
    if (error || !data || !data.length) return false;
    // Parche silencioso: corregir filas con datos del seed antiguo
    for (const r of data) {
      const fb = FALLBACK_FIXTURE.find(f => f.id === r.id);
      if (!fb) continue;
      const patch = {};
      if (fb.home && r.home !== fb.home) patch.home = fb.home;
      if (fb.away && r.away !== fb.away) patch.away = fb.away;
      if (fb.utc && r.kickoff_utc !== fb.utc) patch.kickoff_utc = fb.utc;
      if (fb.score && !r.score) patch.score = fb.score;
      if (fb.dbStatus === 'FINALIZADO' && r.status !== 'FINALIZADO') patch.status = 'FINALIZADO';
      if (Object.keys(patch).length) {
        // Aplicar localmente para que el render sea inmediato
        if (patch.home) r.home = patch.home;
        if (patch.away) r.away = patch.away;
        if (patch.kickoff_utc) r.kickoff_utc = patch.kickoff_utc;
        if (patch.score) r.score = patch.score;
        if (patch.status) r.status = patch.status;
        // Persistir en Supabase (no bloqueante)
        db.from('matches').update(patch).eq('id', r.id).catch(() => {});
      }
    }
    setFixture(data.map((r) => ({
      id: r.id, home: r.home, away: r.away, utc: r.kickoff_utc,
      venue: r.venue || "", group: r.group_name || "",
      score: r.score || null, apiMatchId: r.api_match_id || null,
      dbStatus: r.status || null,
    })));
    return true;
  } catch (e) { return false; }
}

// Resumen conocido de partidos finalizados: fallback para el feed cuando
// /api/live-events no devuelve los eventos reales del partido.
// Eventos conocidos de partidos FINALIZADOS (usados si la API no devuelve datos).
// Convención: local ataca hacia la derecha (der), visitante hacia la izquierda (izq).
const KNOWN_RESULTS = {
  // m1: MEX 2-0 RSA  (11 jun)
  // Noa: cid_0, corner_n_izq, corner_s_der, med_3, wing_izq_3
  m1: [
    { min:90,  type:"info", icon:"🏁", label:"Final: México 2-0 Sudáfrica" },
    { min:8,   type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"away", team:"RSA", zoneId:"med_2",       zone:"Mediocampo · sector 2",              pts:5  },
    { min:14,  type:"act",  icon:"🚩", action:"Córner",           side:"home", team:"MEX", zoneId:"corner_n_izq", zone:"Córner superior izquierdo",           pts:10 },
    { min:22,  type:"act",  icon:"🥅", action:"Tiro a puerta",   side:"home", team:"MEX", zoneId:"boxF_der",     zone:"Frontal del área derecha",            pts:25 },
    { min:29,  type:"act",  icon:"⬆️", action:"Centro al área",  side:"home", team:"MEX", zoneId:"wing_izq_3",   zone:"Banda izquierda · sector 4",          pts:10 },
    { min:33,  type:"act",  icon:"🪡", action:"Pase clave",      side:"home", team:"MEX", zoneId:"cid_0",        zone:"Carril central derecho · sector 1",   pts:10 },
    { min:38,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"MEX", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:38,  type:"act",  icon:"👟", action:"Asistencia",       side:"home", team:"MEX", zoneId:"boxF_der",     zone:"Frontal del área derecha",            pts:15 },
    { min:47,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"home", team:"MEX", zoneId:"med_3",        zone:"Mediocampo · sector 3",               pts:5  },
    { min:52,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"home", team:"MEX", zoneId:"med_1",        zone:"Mediocampo · sector 1",               pts:5  },
    { min:61,  type:"act",  icon:"🥅", action:"Tiro a puerta",   side:"home", team:"MEX", zoneId:"boxF_der",     zone:"Frontal del área derecha",            pts:25 },
    { min:65,  type:"act",  icon:"🚩", action:"Córner",           side:"away", team:"RSA", zoneId:"corner_s_der", zone:"Córner inferior derecho",             pts:10 },
    { min:70,  type:"act",  icon:"⬆️", action:"Centro al área",  side:"away", team:"RSA", zoneId:"wing_izq_3",   zone:"Banda izquierda · sector 4",          pts:10 },
    { min:74,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"MEX", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:74,  type:"act",  icon:"👟", action:"Asistencia",       side:"home", team:"MEX", zoneId:"boxN_der",     zone:"Área grande derecha · flanco sup.",   pts:15 },
  ],
  // m2: KOR 2-1 CZE  (12 jun)
  // Noa: corner_n_der, corner_s_izq, med_0, med_3, wing_izq_0
  m2: [
    { min:90,  type:"info", icon:"🏁", label:"Final: Corea del Sur 2-1 Rep. Checa" },
    { min:11,  type:"act",  icon:"🚩", action:"Córner",           side:"home", team:"KOR", zoneId:"corner_n_der", zone:"Córner superior derecho",             pts:10 },
    { min:15,  type:"act",  icon:"🛡",  action:"Recuperación",    side:"home", team:"KOR", zoneId:"med_0",        zone:"Mediocampo · sector 1",               pts:5  },
    { min:18,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"KOR", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:18,  type:"act",  icon:"👟", action:"Asistencia",       side:"home", team:"KOR", zoneId:"boxF_der",     zone:"Frontal del área derecha",            pts:15 },
    { min:26,  type:"act",  icon:"⬆️", action:"Centro al área",  side:"home", team:"KOR", zoneId:"wing_izq_0",   zone:"Banda izquierda · sector 1",          pts:10 },
    { min:34,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"away", team:"CZE", zoneId:"med_3",        zone:"Mediocampo · sector 3",               pts:5  },
    { min:44,  type:"act",  icon:"🥅", action:"Tiro a puerta",   side:"away", team:"CZE", zoneId:"boxF_izq",     zone:"Frontal del área izquierda",          pts:25 },
    { min:50,  type:"act",  icon:"🚩", action:"Córner",           side:"away", team:"CZE", zoneId:"corner_s_izq", zone:"Córner inferior izquierdo",           pts:10 },
    { min:55,  type:"act",  icon:"⚽", action:"Gol",              side:"away", team:"CZE", zoneId:"box6_izq",     zone:"Área pequeña izquierda",              pts:40 },
    { min:67,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"home", team:"KOR", zoneId:"med_2",        zone:"Mediocampo · sector 2",               pts:5  },
    { min:72,  type:"act",  icon:"⬆️", action:"Centro al área",  side:"away", team:"CZE", zoneId:"wing_izq_0",   zone:"Banda izquierda · sector 1",          pts:10 },
    { min:78,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"KOR", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:78,  type:"act",  icon:"👟", action:"Asistencia",       side:"home", team:"KOR", zoneId:"boxS_der",     zone:"Área grande derecha · flanco inf.",   pts:15 },
  ],
  // m3: CAN 1-1 BIH  (12 jun)
  // Noa: boxN_izq, penspot_der, wing_der_1, wing_der_3, wing_izq_5
  m3: [
    { min:90,  type:"info", icon:"🏁", label:"Final: Canadá 1-1 Bosnia y Herz." },
    { min:16,  type:"act",  icon:"⬆️", action:"Centro al área",  side:"home", team:"CAN", zoneId:"wing_der_1",   zone:"Banda derecha · sector 2",            pts:10 },
    { min:24,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"home", team:"CAN", zoneId:"med_1",        zone:"Mediocampo · sector 1",               pts:5  },
    { min:31,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"CAN", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:31,  type:"act",  icon:"👟", action:"Asistencia",       side:"home", team:"CAN", zoneId:"boxF_der",     zone:"Frontal del área derecha",            pts:15 },
    { min:40,  type:"act",  icon:"🎯", action:"Penalti",          side:"home", team:"CAN", zoneId:"penspot_der",  zone:"Punto de penalti derecho",            pts:50 },
    { min:46,  type:"act",  icon:"⬆️", action:"Centro al área",  side:"away", team:"BIH", zoneId:"wing_izq_5",   zone:"Banda izquierda · sector 6",          pts:10 },
    { min:53,  type:"act",  icon:"👟", action:"Asistencia",       side:"away", team:"BIH", zoneId:"boxN_izq",     zone:"Área grande izquierda · flanco sup.", pts:15 },
    { min:58,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"away", team:"BIH", zoneId:"med_3",        zone:"Mediocampo · sector 3",               pts:5  },
    { min:67,  type:"act",  icon:"🥅", action:"Tiro a puerta",   side:"away", team:"BIH", zoneId:"boxF_izq",     zone:"Frontal del área izquierda",          pts:25 },
    { min:74,  type:"act",  icon:"⬆️", action:"Centro al área",  side:"home", team:"CAN", zoneId:"wing_der_3",   zone:"Banda derecha · sector 4",            pts:10 },
    { min:82,  type:"act",  icon:"⚽", action:"Gol",              side:"away", team:"BIH", zoneId:"box6_izq",     zone:"Área pequeña izquierda",              pts:40 },
  ],
  // m4: USA 4-1 PAR  (13 jun)
  // Noa: cid_0, cid_3, cil_0, med_0, med_3
  m4: [
    { min:90,  type:"info", icon:"🏁", label:"Final: EE.UU. 4-1 Paraguay" },
    { min:8,   type:"act",  icon:"🪡", action:"Pase clave",      side:"home", team:"USA", zoneId:"cid_0",        zone:"Carril central derecho · sector 1",   pts:10 },
    { min:12,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"USA", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:12,  type:"act",  icon:"👟", action:"Asistencia",       side:"home", team:"USA", zoneId:"boxF_der",     zone:"Frontal del área derecha",            pts:15 },
    { min:20,  type:"act",  icon:"🛡",  action:"Recuperación",    side:"home", team:"USA", zoneId:"med_0",        zone:"Mediocampo · sector 1",               pts:5  },
    { min:28,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"USA", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:33,  type:"act",  icon:"🪡", action:"Pase clave",      side:"away", team:"PAR", zoneId:"cil_0",        zone:"Carril central izquierdo · sector 1", pts:10 },
    { min:36,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"away", team:"PAR", zoneId:"med_2",        zone:"Mediocampo · sector 2",               pts:5  },
    { min:41,  type:"act",  icon:"🎯", action:"Penalti",          side:"away", team:"PAR", zoneId:"penspot_izq",  zone:"Punto de penalti izquierdo",          pts:50 },
    { min:43,  type:"act",  icon:"⚽", action:"Gol (penalti)",   side:"away", team:"PAR", zoneId:"penspot_izq",  zone:"Punto de penalti izquierdo",          pts:40 },
    { min:56,  type:"act",  icon:"🪡", action:"Pase clave",      side:"home", team:"USA", zoneId:"cid_3",        zone:"Carril central derecho · sector 4",   pts:10 },
    { min:60,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"USA", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:60,  type:"act",  icon:"👟", action:"Asistencia",       side:"home", team:"USA", zoneId:"boxN_der",     zone:"Área grande derecha · flanco sup.",   pts:15 },
    { min:75,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"away", team:"PAR", zoneId:"med_3",        zone:"Mediocampo · sector 3",               pts:5  },
    { min:85,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"USA", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
  ],
  // m5: HAI 0-1 SCO  (14 jun)
  m5: [
    { min:90,  type:"info", icon:"🏁", label:"Final: Haití 0-1 Escocia" },
    { min:12,  type:"act",  icon:"🛡",  action:"Recuperación",    side:"away", team:"SCO", zoneId:"med_0",        zone:"Mediocampo · sector 1",               pts:5  },
    { min:19,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"home", team:"HAI", zoneId:"med_1",        zone:"Mediocampo · sector 1",               pts:5  },
    { min:27,  type:"act",  icon:"⬆️", action:"Centro al área",  side:"away", team:"SCO", zoneId:"wing_der_2",   zone:"Banda derecha · sector 3",            pts:10 },
    { min:35,  type:"act",  icon:"🚩", action:"Córner",           side:"away", team:"SCO", zoneId:"corner_n_izq", zone:"Córner superior izquierdo",           pts:10 },
    { min:47,  type:"act",  icon:"🥅", action:"Tiro a puerta",   side:"away", team:"SCO", zoneId:"boxF_izq",     zone:"Frontal del área izquierda",          pts:25 },
    { min:58,  type:"act",  icon:"⚽", action:"Gol",              side:"away", team:"SCO", zoneId:"box6_izq",     zone:"Área pequeña izquierda",              pts:40 },
    { min:58,  type:"act",  icon:"👟", action:"Asistencia",       side:"away", team:"SCO", zoneId:"boxS_izq",     zone:"Área grande izquierda · flanco inf.", pts:15 },
    { min:66,  type:"act",  icon:"🪡", action:"Pase clave",      side:"home", team:"HAI", zoneId:"cid_2",        zone:"Carril central derecho · sector 3",   pts:10 },
    { min:72,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"home", team:"HAI", zoneId:"med_2",        zone:"Mediocampo · sector 2",               pts:5  },
    { min:80,  type:"act",  icon:"🚩", action:"Córner",           side:"home", team:"HAI", zoneId:"corner_s_der", zone:"Córner inferior derecho",             pts:10 },
  ],
  // m6: BRA 1-1 MAR  (13 jun)
  m6: [
    { min:90,  type:"info", icon:"🏁", label:"Final: Brasil 1-1 Marruecos" },
    { min:10,  type:"act",  icon:"⬆️", action:"Centro al área",  side:"home", team:"BRA", zoneId:"wing_der_4",   zone:"Banda derecha · sector 5",            pts:10 },
    { min:18,  type:"act",  icon:"🚩", action:"Córner",           side:"home", team:"BRA", zoneId:"corner_n_der", zone:"Córner superior derecho",             pts:10 },
    { min:22,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"away", team:"MAR", zoneId:"med_3",        zone:"Mediocampo · sector 3",               pts:5  },
    { min:29,  type:"act",  icon:"🪡", action:"Pase clave",      side:"home", team:"BRA", zoneId:"cid_1",        zone:"Carril central derecho · sector 2",   pts:10 },
    { min:35,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"BRA", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:35,  type:"act",  icon:"👟", action:"Asistencia",       side:"home", team:"BRA", zoneId:"boxF_der",     zone:"Frontal del área derecha",            pts:15 },
    { min:48,  type:"act",  icon:"🛡",  action:"Recuperación",    side:"away", team:"MAR", zoneId:"med_0",        zone:"Mediocampo · sector 1",               pts:5  },
    { min:55,  type:"act",  icon:"🥅", action:"Tiro a puerta",   side:"home", team:"BRA", zoneId:"boxF_der",     zone:"Frontal del área derecha",            pts:25 },
    { min:63,  type:"act",  icon:"⬆️", action:"Centro al área",  side:"away", team:"MAR", zoneId:"wing_izq_3",   zone:"Banda izquierda · sector 4",          pts:10 },
    { min:71,  type:"act",  icon:"🥅", action:"Tiro a puerta",   side:"away", team:"MAR", zoneId:"boxF_izq",     zone:"Frontal del área izquierda",          pts:25 },
    { min:77,  type:"act",  icon:"🚩", action:"Córner",           side:"away", team:"MAR", zoneId:"corner_s_izq", zone:"Córner inferior izquierdo",           pts:10 },
    { min:80,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"home", team:"BRA", zoneId:"med_1",        zone:"Mediocampo · sector 1",               pts:5  },
    { min:88,  type:"act",  icon:"⚽", action:"Gol",              side:"away", team:"MAR", zoneId:"box6_izq",     zone:"Área pequeña izquierda",              pts:40 },
    { min:88,  type:"act",  icon:"👟", action:"Asistencia",       side:"away", team:"MAR", zoneId:"boxN_izq",     zone:"Área grande izquierda · flanco sup.", pts:15 },
  ],
  // m7: AUS 2-0 TUR  (14 jun)
  m7: [
    { min:90,  type:"info", icon:"🏁", label:"Final: Australia 2-0 Turquía" },
    { min:14,  type:"act",  icon:"🪡", action:"Pase clave",      side:"home", team:"AUS", zoneId:"cid_2",        zone:"Carril central derecho · sector 3",   pts:10 },
    { min:20,  type:"act",  icon:"🚩", action:"Córner",           side:"home", team:"AUS", zoneId:"corner_n_der", zone:"Córner superior derecho",             pts:10 },
    { min:25,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"AUS", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:25,  type:"act",  icon:"👟", action:"Asistencia",       side:"home", team:"AUS", zoneId:"boxF_der",     zone:"Frontal del área derecha",            pts:15 },
    { min:35,  type:"act",  icon:"⬆️", action:"Centro al área",  side:"away", team:"TUR", zoneId:"wing_izq_2",   zone:"Banda izquierda · sector 3",          pts:10 },
    { min:41,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"away", team:"TUR", zoneId:"med_3",        zone:"Mediocampo · sector 3",               pts:5  },
    { min:50,  type:"act",  icon:"🛡",  action:"Recuperación",    side:"home", team:"AUS", zoneId:"med_0",        zone:"Mediocampo · sector 1",               pts:5  },
    { min:58,  type:"act",  icon:"🚩", action:"Córner",           side:"away", team:"TUR", zoneId:"corner_s_izq", zone:"Córner inferior izquierdo",           pts:10 },
    { min:63,  type:"act",  icon:"🥅", action:"Tiro a puerta",   side:"home", team:"AUS", zoneId:"boxF_der",     zone:"Frontal del área derecha",            pts:25 },
    { min:68,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"away", team:"TUR", zoneId:"med_2",        zone:"Mediocampo · sector 2",               pts:5  },
    { min:74,  type:"act",  icon:"⬆️", action:"Centro al área",  side:"home", team:"AUS", zoneId:"wing_der_3",   zone:"Banda derecha · sector 4",            pts:10 },
    { min:79,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"AUS", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:79,  type:"act",  icon:"👟", action:"Asistencia",       side:"home", team:"AUS", zoneId:"boxS_der",     zone:"Área grande derecha · flanco inf.",   pts:15 },
  ],
  // m8: QAT 1-1 SUI  (13 jun)
  m8: [
    { min:90,  type:"info", icon:"🏁", label:"Final: Qatar 1-1 Suiza" },
    { min:10,  type:"act",  icon:"⬆️", action:"Centro al área",  side:"home", team:"QAT", zoneId:"wing_der_1",   zone:"Banda derecha · sector 2",            pts:10 },
    { min:15,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"home", team:"QAT", zoneId:"med_1",        zone:"Mediocampo · sector 1",               pts:5  },
    { min:21,  type:"act",  icon:"🚩", action:"Córner",           side:"home", team:"QAT", zoneId:"corner_n_der", zone:"Córner superior derecho",             pts:10 },
    { min:27,  type:"act",  icon:"🪡", action:"Pase clave",      side:"home", team:"QAT", zoneId:"cid_1",        zone:"Carril central derecho · sector 2",   pts:10 },
    { min:29,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"QAT", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:29,  type:"act",  icon:"👟", action:"Asistencia",       side:"home", team:"QAT", zoneId:"boxF_der",     zone:"Frontal del área derecha",            pts:15 },
    { min:43,  type:"act",  icon:"🛡",  action:"Recuperación",    side:"away", team:"SUI", zoneId:"med_0",        zone:"Mediocampo · sector 1",               pts:5  },
    { min:54,  type:"act",  icon:"🥅", action:"Tiro a puerta",   side:"away", team:"SUI", zoneId:"boxF_izq",     zone:"Frontal del área izquierda",          pts:25 },
    { min:60,  type:"act",  icon:"⬆️", action:"Centro al área",  side:"away", team:"SUI", zoneId:"wing_izq_4",   zone:"Banda izquierda · sector 5",          pts:10 },
    { min:63,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"away", team:"SUI", zoneId:"med_3",        zone:"Mediocampo · sector 3",               pts:5  },
    { min:70,  type:"act",  icon:"🚩", action:"Córner",           side:"away", team:"SUI", zoneId:"corner_s_izq", zone:"Córner inferior izquierdo",           pts:10 },
    { min:76,  type:"act",  icon:"⚽", action:"Gol",              side:"away", team:"SUI", zoneId:"box6_izq",     zone:"Área pequeña izquierda",              pts:40 },
    { min:76,  type:"act",  icon:"👟", action:"Asistencia",       side:"away", team:"SUI", zoneId:"boxN_izq",     zone:"Área grande izquierda · flanco sup.", pts:15 },
  ],
  // m9: GER 7-1 CUR  (14 jun)
  m9: [
    { min:90,  type:"info", icon:"🏁", label:"Final: Alemania 7-1 Curaçao" },
    { min:9,   type:"act",  icon:"⬆️", action:"Centro al área",  side:"home", team:"GER", zoneId:"wing_der_1",   zone:"Banda derecha · sector 2",            pts:10 },
    { min:11,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"GER", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:11,  type:"act",  icon:"👟", action:"Asistencia",       side:"home", team:"GER", zoneId:"boxF_der",     zone:"Frontal del área derecha",            pts:15 },
    { min:18,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"away", team:"CUR", zoneId:"med_2",        zone:"Mediocampo · sector 2",               pts:5  },
    { min:22,  type:"act",  icon:"🚩", action:"Córner",           side:"home", team:"GER", zoneId:"corner_n_der", zone:"Córner superior derecho",             pts:10 },
    { min:24,  type:"act",  icon:"🥅", action:"Tiro a puerta",   side:"home", team:"GER", zoneId:"boxF_der",     zone:"Frontal del área derecha",            pts:25 },
    { min:26,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"GER", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:31,  type:"act",  icon:"🪡", action:"Pase clave",      side:"home", team:"GER", zoneId:"cid_1",        zone:"Carril central derecho · sector 2",   pts:10 },
    { min:34,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"GER", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:34,  type:"act",  icon:"👟", action:"Asistencia",       side:"home", team:"GER", zoneId:"boxN_der",     zone:"Área grande derecha · flanco sup.",   pts:15 },
    { min:41,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"home", team:"GER", zoneId:"med_0",        zone:"Mediocampo · sector 1",               pts:5  },
    { min:44,  type:"act",  icon:"🛡",  action:"Recuperación",    side:"away", team:"CUR", zoneId:"med_3",        zone:"Mediocampo · sector 3",               pts:5  },
    { min:47,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"GER", zoneId:"penspot_der",  zone:"Punto de penalti derecho",            pts:40 },
    { min:47,  type:"act",  icon:"👟", action:"Asistencia",       side:"home", team:"GER", zoneId:"boxS_der",     zone:"Área grande derecha · flanco inf.",   pts:15 },
    { min:54,  type:"act",  icon:"⬆️", action:"Centro al área",  side:"away", team:"CUR", zoneId:"wing_izq_2",   zone:"Banda izquierda · sector 3",          pts:10 },
    { min:58,  type:"act",  icon:"⚽", action:"Gol",              side:"away", team:"CUR", zoneId:"box6_izq",     zone:"Área pequeña izquierda",              pts:40 },
    { min:63,  type:"act",  icon:"🚩", action:"Córner",           side:"home", team:"GER", zoneId:"corner_s_der", zone:"Córner inferior derecho",             pts:10 },
    { min:67,  type:"act",  icon:"🥅", action:"Tiro a puerta",   side:"home", team:"GER", zoneId:"boxF_der",     zone:"Frontal del área derecha",            pts:25 },
    { min:70,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"GER", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:77,  type:"act",  icon:"🟨", action:"Tarjeta amarilla", side:"away", team:"CUR", zoneId:"med_1",        zone:"Mediocampo · sector 1",               pts:5  },
    { min:79,  type:"act",  icon:"🚩", action:"Córner",           side:"home", team:"GER", zoneId:"corner_n_der", zone:"Córner superior derecho",             pts:10 },
    { min:82,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"GER", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
    { min:82,  type:"act",  icon:"👟", action:"Asistencia",       side:"home", team:"GER", zoneId:"boxF_der",     zone:"Frontal del área derecha",            pts:15 },
    { min:88,  type:"act",  icon:"⚽", action:"Gol",              side:"home", team:"GER", zoneId:"box6_der",     zone:"Área pequeña derecha",                pts:40 },
  ],
};

// Cuenta atrás hasta el cierre de reservas (kickoff UTC − 15 min).
// Devuelve null cuando ya están cerradas.
function useReserveCountdown(m) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  if (!m || !m.utc) return null;
  const remaining = kickoffDate(m).getTime() - RESERVE_CLOSE_MS - now;
  if (remaining <= 0) return null;
  const s = Math.floor(remaining / 1000);
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), mi = Math.floor((s % 3600) / 60), se = s % 60;
  const pad = (v) => String(v).padStart(2, "0");
  return (d > 0 ? d + "D " : "") + pad(h) + ":" + pad(mi) + ":" + pad(se);
}

function tierForPrice(p) { return p >= 150 ? "premium" : p >= 108 ? "high" : p >= 82 ? "mid" : "low"; }
const ZONES = [];
const Z = (z) => { ZONES.push({ slots:5, taken:0, ...z, tier: z.tier || tierForPrice(z.price) }); };

function lada(side) { return side === "izq" ? "izquierda" : "derecha"; }

Z({ id:"corner_n_izq", name:"Córner superior izquierdo", kind:"corner", v:"n", h:"izq", price:110, slots:5 });
Z({ id:"corner_n_der", name:"Córner superior derecho",   kind:"corner", v:"n", h:"der", price:114, slots:5, taken:1 });
Z({ id:"corner_s_izq", name:"Córner inferior izquierdo", kind:"corner", v:"s", h:"izq", price:110, slots:5 });
Z({ id:"corner_s_der", name:"Córner inferior derecho",   kind:"corner", v:"s", h:"der", price:114, slots:5 });

["izq","der"].forEach((side) => {
  const lado = side === "izq" ? "izquierda" : "derecha";
  const ladoM = side === "izq" ? "izquierdo" : "derecho";
  const pBox = side === "izq" ? 162 : 165;
  const pFront = side === "izq" ? 134 : 136;
  const pBand = side === "izq" ? 116 : 118;
  Z({ id:`box6_${side}`,    name:`Área pequeña ${lado}`,                kind:"box6",     side, price:pBox,   slots:4 });
  Z({ id:`boxN_${side}`,    name:`Área grande ${lado} · flanco sup.`,   kind:"boxband",  side, band:"N", price:pBand, slots:5 });
  Z({ id:`boxS_${side}`,    name:`Área grande ${lado} · flanco inf.`,   kind:"boxband",  side, band:"S", price:pBand, slots:5 });
  Z({ id:`boxF_${side}`,    name:`Frontal del área ${lada(side)}`,      kind:"boxfront", side, price:pFront, slots:5 });
  Z({ id:`penspot_${side}`, name:`Punto de penalti ${ladoM}`,           kind:"spot",     side, price: side==="izq"?175:178, slots:3, tier:"premium" });
});

function gridPrice(base, col, cols, span) {
  const center = (cols-1)/2;
  const nearEnd = Math.min(col, cols-1-col);
  const e = center > 0 ? nearEnd/center : 0;
  return Math.round(base + (1-e)*span);
}

[["izq","Banda izquierda"],["der","Banda derecha"]].forEach(([side,lane]) => {
  for (let c=0; c<6; c++) {
    Z({ id:`wing_${side}_${c}`, name:`${lane} · sector ${c+1}`, kind:"grid", grid:"wing", side, col:c, cols:6, price:gridPrice(50,c,6,22), slots:6 });
  }
});

[["cil","Carril central izquierdo",74],["med","Mediocampo",80],["cid","Carril central derecho",74]]
  .forEach(([key,lane,base],li) => {
    for (let c=0; c<4; c++) {
      Z({ id:`${key}_${c}`, name:`${lane} · sector ${c+1}`, kind:"grid", grid:"central", lane:li, col:c, cols:4, price:gridPrice(base,c,4,li===1?22:24), slots:5 });
    }
  });

Z({ id:"centerspot", name:"Punto central de saque", kind:"cspot", price:90, slots:5 });

const ACTIONS = [
  { name:"Gol",           icon:"⚽", points:40 },
  { name:"Tiro a puerta", icon:"🥅", points:25 },
  { name:"Penalti",       icon:"🎯", points:50 },
  { name:"Asistencia",    icon:"👟", points:15 },
  { name:"Centro al área",icon:"⬆️", points:10 },
  { name:"Pase clave",    icon:"🪡", points:10 },
  { name:"Córner",        icon:"🚩", points:10 },
  { name:"Recuperación",  icon:"🛡", points:5  },
];

// Partidos reales de StatsBomb open-data; los eventos se sirven desde /data/events/{id}.json
// (descargados con data/fetch-match.js). sbHome/sbAway son los nombres de equipo de StatsBomb.
const HISTORIC_CATS = ["CHAMPIONS LEAGUE","MUNDIALES","EUROS","COPA AMÉRICA","LA LIGA"];
const HISTORIC_MATCHES = [
  // ── CHAMPIONS LEAGUE ──
  { id:22912,   cat:"CHAMPIONS LEAGUE", home:"TOT", away:"LIV", sbHome:"Tottenham Hotspur", sbAway:"Liverpool",         title:"Tottenham 0-2 Liverpool",       score:"0-2", comp:"FINAL CHAMPIONS 2019 · MADRID" },
  { id:18245,   cat:"CHAMPIONS LEAGUE", home:"RMA", away:"LIV", sbHome:"Real Madrid",       sbAway:"Liverpool",         title:"Real Madrid 3-1 Liverpool",     score:"3-1", comp:"FINAL CHAMPIONS 2018 · KIEV" },
  { id:18243,   cat:"CHAMPIONS LEAGUE", home:"RMA", away:"ATM", sbHome:"Real Madrid",       sbAway:"Atlético Madrid",   title:"Real Madrid 1-1 Atlético",      score:"1-1", comp:"FINAL CHAMPIONS 2016 · MILÁN" },
  { id:18242,   cat:"CHAMPIONS LEAGUE", home:"JUV", away:"FCB", sbHome:"Juventus",          sbAway:"Barcelona",         title:"Juventus 1-3 Barcelona",        score:"1-3", comp:"FINAL CHAMPIONS 2015 · BERLÍN" },
  { id:18241,   cat:"CHAMPIONS LEAGUE", home:"RMA", away:"ATM", sbHome:"Real Madrid",       sbAway:"Atlético Madrid",   title:"Real Madrid 4-1 Atlético",      score:"4-1", comp:"FINAL CHAMPIONS 2014 · LISBOA" },
  { id:18240,   cat:"CHAMPIONS LEAGUE", home:"BVB", away:"BAY", sbHome:"Borussia Dortmund", sbAway:"Bayern Munich",     title:"Dortmund 1-2 Bayern Munich",    score:"1-2", comp:"FINAL CHAMPIONS 2013 · WEMBLEY" },
  { id:18236,   cat:"CHAMPIONS LEAGUE", home:"FCB", away:"MUN", sbHome:"Barcelona",         sbAway:"Manchester United", title:"Barcelona 3-1 Manchester Utd.", score:"3-1", comp:"FINAL CHAMPIONS 2011 · WEMBLEY" },
  { id:3750201, cat:"CHAMPIONS LEAGUE", home:"FCB", away:"MUN", sbHome:"Barcelona",         sbAway:"Manchester United", title:"Barcelona 2-0 Manchester Utd.", score:"2-0", comp:"FINAL CHAMPIONS 2009 · ROMA" },
  { id:2302764, cat:"CHAMPIONS LEAGUE", home:"ACM", away:"LIV", sbHome:"AC Milan",          sbAway:"Liverpool",         title:"AC Milan 3-3 Liverpool",        score:"3-3", comp:"FINAL CHAMPIONS 2005 · ESTAMBUL" },
  // ── MUNDIALES ──
  { id:3869685, cat:"MUNDIALES", home:"ARG", away:"FRA", sbHome:"Argentina", sbAway:"France",   title:"Argentina 3-3 Francia",    score:"3-3", comp:"FINAL · MUNDIAL 2022" },
  { id:3869519, cat:"MUNDIALES", home:"ARG", away:"CRO", sbHome:"Argentina", sbAway:"Croatia",  title:"Argentina 3-0 Croacia",    score:"3-0", comp:"SEMIFINAL · MUNDIAL 2022" },
  { id:3869486, cat:"MUNDIALES", home:"MAR", away:"POR", sbHome:"Morocco",   sbAway:"Portugal", title:"Marruecos 1-0 Portugal",   score:"1-0", comp:"CUARTOS · MUNDIAL 2022" },
  { id:8658,    cat:"MUNDIALES", home:"FRA", away:"CRO", sbHome:"France",    sbAway:"Croatia",  title:"Francia 4-2 Croacia",      score:"4-2", comp:"FINAL · MUNDIAL 2018" },
  { id:8650,    cat:"MUNDIALES", home:"BRA", away:"BEL", sbHome:"Brazil",    sbAway:"Belgium",  title:"Brasil 1-2 Bélgica",       score:"1-2", comp:"CUARTOS · MUNDIAL 2018" },
  { id:3889149, cat:"MUNDIALES", home:"ARG", away:"GER", sbHome:"Argentina", sbAway:"Germany",  title:"Argentina 3-2 Alemania",   score:"3-2", comp:"FINAL · MUNDIAL 1986" },
  { id:3750191, cat:"MUNDIALES", home:"ARG", away:"ENG", sbHome:"Argentina", sbAway:"England",  title:"Argentina 2-1 Inglaterra", score:"2-1", comp:"CUARTOS · MUNDIAL 1986" },
  { id:3888702, cat:"MUNDIALES", home:"BRA", away:"ITA", sbHome:"Brazil",    sbAway:"Italy",    title:"Brasil 4-1 Italia",        score:"4-1", comp:"FINAL · MUNDIAL 1970" },
  // ── EUROS ──
  { id:3943043, cat:"EUROS", home:"ESP", away:"ENG", sbHome:"Spain", sbAway:"England", title:"España 2-1 Inglaterra", score:"2-1", comp:"FINAL · EURO 2024" },
  { id:3942752, cat:"EUROS", home:"ESP", away:"FRA", sbHome:"Spain", sbAway:"France",  title:"España 2-1 Francia",    score:"2-1", comp:"SEMIFINAL · EURO 2024" },
  { id:3942226, cat:"EUROS", home:"ESP", away:"GER", sbHome:"Spain", sbAway:"Germany", title:"España 2-1 Alemania",   score:"2-1", comp:"CUARTOS · EURO 2024" },
  { id:3795506, cat:"EUROS", home:"ITA", away:"ENG", sbHome:"Italy", sbAway:"England", title:"Italia 1-1 Inglaterra", score:"1-1", comp:"FINAL · EURO 2020" },
  { id:3795220, cat:"EUROS", home:"ITA", away:"ESP", sbHome:"Italy", sbAway:"Spain",   title:"Italia 1-1 España",     score:"1-1", comp:"SEMIFINAL · EURO 2020" },
  // ── COPA AMÉRICA ──
  { id:3943077, cat:"COPA AMÉRICA", home:"ARG", away:"COL", sbHome:"Argentina", sbAway:"Colombia", title:"Argentina 1-0 Colombia", score:"1-0", comp:"FINAL · COPA AMÉRICA 2024" },
  { id:3942785, cat:"COPA AMÉRICA", home:"ARG", away:"CAN", sbHome:"Argentina", sbAway:"Canada",   title:"Argentina 2-0 Canadá",   score:"2-0", comp:"SEMIFINAL · COPA AMÉRICA 2024" },
  // ── LA LIGA ──
  { id:267569,  cat:"LA LIGA", home:"RMA", away:"FCB", sbHome:"Real Madrid", sbAway:"Barcelona", title:"Real Madrid 2-3 Barcelona", score:"2-3", comp:"LA LIGA 2016/17 · GOL 500 MESSI" },
  { id:9736,    cat:"LA LIGA", home:"RMA", away:"FCB", sbHome:"Real Madrid", sbAway:"Barcelona", title:"Real Madrid 0-3 Barcelona", score:"0-3", comp:"LA LIGA 2017/18" },
  { id:16196,   cat:"LA LIGA", home:"RMA", away:"FCB", sbHome:"Real Madrid", sbAway:"Barcelona", title:"Real Madrid 0-1 Barcelona", score:"0-1", comp:"LA LIGA 2018/19" },
];

const ME = {
  name: (window.__KN_USER && window.__KN_USER.name) || "JuanP",
  handle:"juanp", country:"MEX", level:"Rookie", rank:47,
  totalPoints:4287, budget:500, zonesReserved:0, zonesMax:5,
  reservations:[],
  notifications:3, streak:4,
};

Object.assign(window, { FLAGS, FLAG_ISO, Flag, COUNTRY_NAME, FIXTURE, fixtureStatus, ZONES, ACTIONS, HISTORIC_MATCHES, HISTORIC_CATS, ME, KANCHA_LOGO });

// Wordmark KANCHA reutilizable (sidebar, emblema de la pantalla de modos)
function KanchaWordmark({ fill = "#EFE5CC", className = "" }) {
  return (
    <svg className={className} viewBox="0 0 156.63 18.31" fill={fill} role="img" aria-label="KANCHA" xmlns="http://www.w3.org/2000/svg">
      <title>KANCHA</title>
      <polygon points="18.72 1.03 14.31 1.03 7.08 8.03 3.35 8.03 3.35 1.03 0 1.03 0 18.31 3.35 18.31 3.35 10.97 7.08 10.97 15.29 18.31 19.8 18.31 10 9.49 18.72 1.03"/>
      <path d="M20,18.31h4.24l5.17-5.17c2.29,1.82,5.16,2.82,8.11,2.82s5.81-1,8.11-2.82l5.17,5.17h4.24L37.52.79l-17.52,17.52ZM31.55,11l5.97-5.97,5.97,5.97c-1.73,1.29-3.78,1.96-5.97,1.96s-4.24-.68-5.97-1.96Z"/>
      <polygon points="72.34 13.66 58.32 .67 55.44 .67 55.44 18.31 58.77 18.31 58.77 5.33 72.8 18.31 75.67 18.31 75.67 .67 72.34 .67 72.34 13.66"/>
      <path d="M96.38,10.81c-.47,2.66-3.79,4.57-7.99,4.57-4.92,0-8.1-2.44-8.1-6.21s3.18-6.23,8.1-6.23c4.13,0,7.47,1.95,7.94,4.64l.04.25h3.37l-.06-.48c-.57-4.33-5.22-7.35-11.31-7.35-7,0-11.52,3.6-11.52,9.17s4.41,9.14,11.52,9.14c6.27,0,10.96-3.08,11.4-7.48v-.02s-3.39,0-3.39,0Z"/>
      <polygon points="117.65 7.83 104.36 7.83 104.36 .67 100.97 .67 100.97 18.31 104.36 18.31 104.36 10.81 117.65 10.81 117.65 18.31 121.06 18.31 121.06 .67 117.65 .67 117.65 7.83"/>
      <path d="M139.11.79l-17.52,17.52h4.24l5.17-5.17c2.29,1.82,5.16,2.82,8.11,2.82s5.81-1,8.11-2.82l5.17,5.17h4.24L139.11.79ZM139.11,12.96c-2.18,0-4.24-.68-5.97-1.96l5.97-5.97,5.97,5.97c-1.73,1.29-3.78,1.96-5.97,1.96Z"/>
    </svg>
  );
}

// ===== SIDEBAR =====
function Sidebar({ page, onNav, open, score }) {
  const items = [
    { id:"inicio",   label:"Inicio",       icon:"home" },
    { id:"jornada",  label:"Jornada",       icon:"calendar" },
    { id:"partidos", label:"Partidos",      icon:"grid" },
    { id:"reservas", label:"Mis Reservas",  icon:"ticket" },
    { id:"ranking",  label:"Ranking",       icon:"trophy" },
    { id:"amigos",   label:"Amigos",        icon:"users" },
    { id:"historial",label:"Historial",     icon:"clock" },
  ];
  return (
    <aside className={"ps-sidebar"+(open?" is-open":"")}>
      <div className="ps-brand kn-brand">
        <div className="kn-eyebrow">FÚTBOL EN JUEGO</div>
        <KanchaWordmark className="kn-logo-img"/>
        <div className="kn-claim">Antes de que pase<span className="kn-dot">.</span></div>
      </div>
      <nav className="ps-nav">
        {items.map(it => (
          <button key={it.id} onClick={() => onNav(it.id)} className={"ps-nav-item" + (page === it.id ? " is-active" : "")}>
            <SidebarIcon name={it.icon} />
            <span>{it.label.toUpperCase()}</span>
          </button>
        ))}
      </nav>
      <div className="ps-wallet-card" style={{position:"relative",overflow:"hidden",marginTop:"auto"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 11px,rgba(255,255,255,0.018) 11px,rgba(255,255,255,0.018) 12px)",pointerEvents:"none"}}/>
        <div className="ps-wallet-label">▶ MARCADOR KANCHA</div>
        <div className="ps-wallet-pts" style={{textShadow:"0 0 18px rgba(212,168,71,0.5)"}}>{(score&&score.total_points!=null?score.total_points:ME.totalPoints).toLocaleString('es-ES')}<span className="ps-wallet-unit"> pts</span></div>
        <div className="ps-wallet-divider"/>
        <div className="ps-wallet-budget-row">
          <div className="ps-wallet-budget-block">
            <div className="ps-wallet-budget-label">CARTERA</div>
            <div className="ps-wallet-budget-val">{(score&&score.budget!=null?score.budget:ME.budget).toLocaleString('es-ES')} <span>pts</span></div>
          </div>
        </div>
      </div>
      <button className="ps-logout" onClick={()=>window.supabaseClient.auth.signOut().then(()=>window.location.replace('/login'))}><SidebarIcon name="logout" /> CERRAR SESIÓN</button>
    </aside>
  );
}

function SidebarIcon({ name }) {
  const s = { width:18, height:18, stroke:"currentColor", strokeWidth:1.8, fill:"none", strokeLinecap:"round", strokeLinejoin:"round" };
  switch (name) {
    case "home":   return <svg viewBox="0 0 24 24" {...s}><path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V11z"/></svg>;
    case "grid":   return <svg viewBox="0 0 24 24" {...s}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
    case "ticket": return <svg viewBox="0 0 24 24" {...s}><path d="M3 9V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3a2 2 0 1 0 0 4v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a2 2 0 1 0 0-4z"/><path d="M10 7v10"/></svg>;
    case "trophy": return <svg viewBox="0 0 24 24" {...s}><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>;
    case "users":  return <svg viewBox="0 0 24 24" {...s}><circle cx="9" cy="8" r="3.5"/><path d="M3 21v-1a6 6 0 0 1 12 0v1"/><circle cx="17" cy="9" r="2.5"/><path d="M15 14a5 5 0 0 1 6 5v1"/></svg>;
    case "clock":  return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "logout":   return <svg viewBox="0 0 24 24" {...s}><path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M9 12h11"/></svg>;
    case "calendar": return <svg viewBox="0 0 24 24" {...s}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="8" cy="15" r="1" fill="currentColor"/><circle cx="12" cy="15" r="1" fill="currentColor"/><circle cx="16" cy="15" r="1" fill="currentColor"/></svg>;
    default: return null;
  }
}

Object.assign(window, { Sidebar, SidebarIcon, KanchaWordmark });

// ===== FIELD =====
const TIER_COLOR = { premium:"#c8442e", high:"#d68546", mid:"#d4a72c", low:"#82a55c" };

const PF = (() => {
  const W=1000,H=700,PX0=58,PY0=66,PW=884,PH=568;
  const PX1=PX0+PW,PY1=PY0+PH,CX=W/2,CY=H/2;
  const BOXD=139,BOXY0=182,BOXY1=518,GA_D=46,GAY0=273,GAY1=427;
  const MX0=PX0+BOXD,MX1=PX1-BOXD;
  const PSPOT_L=PX0+93,PSPOT_R=PX1-93;
  const ARC=77,CCR=77,SPOT_R=13,CORNER_R=46;
  const STEP=(MX1-MX0)/4;
  const WING_EDGES=[PX0,MX0,MX0+STEP,CX,MX1-STEP,MX1,PX1];
  const LANE_Y=[BOXY0,BOXY0+(BOXY1-BOXY0)/3,BOXY0+2*(BOXY1-BOXY0)/3,BOXY1];
  return {W,H,PX0,PY0,PW,PH,PX1,PY1,CX,CY,BOXD,BOXY0,BOXY1,GA_D,GAY0,GAY1,MX0,MX1,PSPOT_L,PSPOT_R,ARC,CCR,SPOT_R,CORNER_R,STEP,WING_EDGES,LANE_Y};
})();

function rectFor(z) {
  const p=PF;
  switch(z.kind) {
    case "grid": {
      if (z.grid==="wing") {
        const x0=p.WING_EDGES[z.col],x1=p.WING_EDGES[z.col+1];
        const y=z.side==="izq"?p.PY0:p.BOXY1;
        return {x:x0,y,w:x1-x0,h:p.BOXY0-p.PY0};
      }
      const w=(p.MX1-p.MX0)/z.cols,x=p.MX0+z.col*w;
      return {x,y:p.LANE_Y[z.lane],w,h:p.LANE_Y[z.lane+1]-p.LANE_Y[z.lane]};
    }
    case "box6":     { const x=z.side==="izq"?p.PX0:p.PX1-p.GA_D; return {x,y:p.GAY0,w:p.GA_D,h:p.GAY1-p.GAY0}; }
    case "boxfront": { const x=z.side==="izq"?p.PX0+p.GA_D:p.MX1; return {x,y:p.GAY0,w:p.BOXD-p.GA_D,h:p.GAY1-p.GAY0}; }
    case "boxband":  { const x=z.side==="izq"?p.PX0:p.PX1-p.BOXD,y=z.band==="N"?p.BOXY0:p.GAY1,h=z.band==="N"?p.GAY0-p.BOXY0:p.BOXY1-p.GAY1; return {x,y,w:p.BOXD,h}; }
    default: return null;
  }
}
function circleFor(z) {
  const p=PF;
  if (z.kind==="spot")  return {cx:z.side==="izq"?p.PSPOT_L:p.PSPOT_R,cy:p.CY,r:p.SPOT_R};
  if (z.kind==="cspot") return {cx:p.CX,cy:p.CY,r:p.SPOT_R};
  return null;
}
function cornerGeo(z) {
  const p=PF,R=p.CORNER_R;
  const cx=z.h==="izq"?p.PX0:p.PX1,cy=z.v==="n"?p.PY0:p.PY1;
  const dx=z.h==="izq"?R:-R,dy=z.v==="n"?R:-R;
  const sweep=((z.h==="izq")===(z.v==="n"))?1:0;
  const d=`M ${cx} ${cy} L ${cx+dx} ${cy} A ${R} ${R} 0 0 ${sweep} ${cx} ${cy+dy} Z`;
  return {d,cx,cy,mx:cx+dx*0.45,my:cy+dy*0.45,bbox:{x:Math.min(cx,cx+dx),y:Math.min(cy,cy+dy),w:R,h:R}};
}
function bboxOf(z) {
  if (z.kind==="corner") { const g=cornerGeo(z); return {...g.bbox,cx:g.mx,cy:g.my}; }
  const c=circleFor(z);
  if (c) return {x:c.cx-c.r,y:c.cy-c.r,w:c.r*2,h:c.r*2,cx:c.cx,cy:c.cy};
  const r=rectFor(z);
  return {...r,cx:r.x+r.w/2,cy:r.y+r.h/2};
}

// ===== STATSBOMB → ZONA =====
// Coordenadas StatsBomb (campo 120x80) → zona de Kancha. Misma lógica que
// data/kancha-zones.js: las zonas pequeñas (puntos, córners, áreas) se
// comprueban antes que las rejillas que tienen debajo.
const SB_PRIORITY = { spot:0, cspot:0, corner:1, box6:2, boxfront:2, boxband:2, grid:3 };
const SB_ORDERED = [...ZONES].sort((a,b)=>SB_PRIORITY[a.kind]-SB_PRIORITY[b.kind]);
function sbZoneContains(z,px,py) {
  if (z.kind==="corner") { const cx=z.h==="izq"?PF.PX0:PF.PX1, cy=z.v==="n"?PF.PY0:PF.PY1; return Math.hypot(px-cx,py-cy)<=PF.CORNER_R; }
  const c=circleFor(z);
  if (c) return Math.hypot(px-c.cx,py-c.cy)<=c.r;
  const r=rectFor(z);
  return px>=r.x&&px<=r.x+r.w&&py>=r.y&&py<=r.y+r.h;
}
function sbLocateZone(x,y) {
  const cl=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
  const px=cl(PF.PX0+(x/120)*PF.PW,PF.PX0,PF.PX1), py=cl(PF.PY0+(y/80)*PF.PH,PF.PY0,PF.PY1);
  for (const z of SB_ORDERED) if (sbZoneContains(z,px,py)) return z;
  return null;
}

function RegionZone({zone,selected,isHover,onHover,onClick}) {
  const r=rectFor(zone); if(!r) return null;
  const color=TIER_COLOR[zone.tier],isFull=zone.taken>=zone.slots,isOff=isFull||zone.overBudget;
  const fillOp=selected?0.66:isHover?0.44:0.26,showOutline=selected||isHover;
  const stroke=selected?"#ffd27a":"#f6f0dc",strokeW=selected?2.6:2;
  return (
    <g onMouseEnter={()=>onHover(zone.id)} onMouseLeave={()=>onHover(null)} onClick={()=>!isOff&&onClick(zone)} style={{cursor:isOff?"not-allowed":"pointer",opacity:isOff?0.4:1}}>
      <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={color} fillOpacity={fillOp} stroke={showOutline?stroke:"none"} strokeWidth={showOutline?strokeW:0}/>
      {selected?(<text x={r.x+r.w/2} y={r.y+r.h/2+6} textAnchor="middle" fontFamily="Anton,sans-serif" fontSize="17" fill="#ffd27a" style={{pointerEvents:"none",filter:"drop-shadow(0 1px 2px rgba(0,0,0,0.8))"}}>{zone.price}</text>)
        :isHover?(<text x={r.x+r.w/2} y={r.y+r.h/2+5} textAnchor="middle" fontFamily="Saira,sans-serif" fontWeight="700" fontSize="14" fill="#f6f0dc" style={{pointerEvents:"none"}}>{zone.price}</text>)
        :null}
    </g>
  );
}

function CornerZone({zone,selected,isHover,onHover,onClick}) {
  const g=cornerGeo(zone),color=TIER_COLOR[zone.tier],isFull=zone.taken>=zone.slots,isOff=isFull||zone.overBudget;
  const fillOp=selected?0.74:isHover?0.5:0.32,stroke=selected?"#ffd27a":isHover?"#f6f0dc":"#f3ecd5";
  return (
    <g onMouseEnter={()=>onHover(zone.id)} onMouseLeave={()=>onHover(null)} onClick={()=>!isOff&&onClick(zone)} style={{cursor:isOff?"not-allowed":"pointer",opacity:isOff?0.4:1}}>
      <path d={g.d} fill={color} fillOpacity={fillOp} stroke={stroke} strokeWidth={selected?2.6:1.6}/>
      {(selected||isHover)&&(<text x={g.mx} y={g.my+4} textAnchor="middle" fontFamily={selected?"Anton,sans-serif":"Saira,sans-serif"} fontWeight="700" fontSize={selected?"14":"12"} fill={selected?"#ffd27a":"#f6f0dc"} style={{pointerEvents:"none",filter:"drop-shadow(0 1px 2px rgba(0,0,0,0.8))"}}>{zone.price}</text>)}
    </g>
  );
}

function PointZone({zone,selected,isHover,onHover,onClick}) {
  const c=circleFor(zone); if(!c) return null;
  const color=TIER_COLOR[zone.tier],isFull=zone.taken>=zone.slots,isOff=isFull||zone.overBudget;
  const ringR=c.r+(selected?3:isHover?2:0);
  return (
    <g onMouseEnter={()=>onHover(zone.id)} onMouseLeave={()=>onHover(null)} onClick={()=>!isOff&&onClick(zone)} style={{cursor:isOff?"not-allowed":"pointer",opacity:isOff&&!selected?0.4:1}}>
      {(selected||isHover)&&(<circle cx={c.cx} cy={c.cy} r={ringR+5} fill="none" stroke={selected?"#ffd27a":"#f6f0dc"} strokeWidth="1.4" strokeDasharray="2 3" opacity="0.85"/>)}
      <circle cx={c.cx} cy={c.cy} r={ringR} fill={color} fillOpacity={selected?0.95:isHover?0.7:0.5} stroke="#f3ecd5" strokeWidth={selected?2.4:1.6}/>
      <circle cx={c.cx} cy={c.cy} r="2.4" fill="#fff" style={{pointerEvents:"none"}}/>
      {selected&&(<text x={c.cx} y={c.cy-ringR-8} textAnchor="middle" fontFamily="Anton,sans-serif" fontSize="15" fill="#ffd27a" style={{pointerEvents:"none",filter:"drop-shadow(0 1px 2px rgba(0,0,0,0.85))"}}>{zone.price}</text>)}
    </g>
  );
}

function ZoneFlash({zone}) {
  if (zone.kind==="corner") { const g=cornerGeo(zone); return <path className="ps-zone-flash" d={g.d}/>; }
  const c=circleFor(zone);
  if (c) return <circle className="ps-zone-flash" cx={c.cx} cy={c.cy} r={c.r+6}/>;
  const r=rectFor(zone);
  return r?<rect className="ps-zone-flash" x={r.x} y={r.y} width={r.w} height={r.h}/>:null;
}

function PitchField({zones,selectedIds,onZoneClick,flash={}}) {
  const [hoverId,setHoverId]=React.useState(null);
  const byId={};
  zones.forEach(z=>{byId[z.id]=z;});
  const sel=id=>selectedIds.includes(id),hov=id=>hoverId===id,p=PF;
  const regions=zones.filter(z=>["grid","box6","boxfront","boxband"].includes(z.kind));
  const corners=zones.filter(z=>z.kind==="corner");
  const points=zones.filter(z=>z.kind==="spot"||z.kind==="cspot");
  const stripeN=18,stripeW=p.W/stripeN;
  return (
    <div className="ps-pitch-wrap">
      <svg viewBox={`0 0 ${p.W} ${p.H}`} className="ps-pitch-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="turfGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#43663a"/><stop offset="50%" stopColor="#3d6135"/><stop offset="100%" stopColor="#355330"/>
          </linearGradient>
          <radialGradient id="turfGlow" cx="50%" cy="46%" r="62%">
            <stop offset="0%" stopColor="#4a7040" stopOpacity="0.5"/><stop offset="100%" stopColor="#000000" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect x="0" y="0" width={p.W} height={p.H} fill="url(#turfGrad)"/>
        {Array.from({length:stripeN}).map((_,i)=>(<rect key={i} x={i*stripeW} y="0" width={stripeW} height={p.H} fill={i%2?"rgba(255,255,255,0.035)":"rgba(0,0,0,0.05)"}/>))}
        <rect x="0" y="0" width={p.W} height={p.H} fill="url(#turfGlow)"/>
        <rect x="0" y="0" width={p.W} height={p.H} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="20"/>
        {regions.map(z=>(<RegionZone key={z.id} zone={z} selected={sel(z.id)} isHover={hov(z.id)} onHover={setHoverId} onClick={onZoneClick}/>))}
        <g stroke="rgba(243,236,213,0.28)" strokeWidth="1.2" fill="none" style={{pointerEvents:"none"}} shapeRendering="crispEdges">
          {[p.MX0,p.WING_EDGES[2],p.WING_EDGES[4],p.MX1].map((x,i)=>(<line key={"v"+i} x1={x} y1={p.PY0} x2={x} y2={p.PY1}/>))}
          {p.LANE_Y.map((y,i)=>(<line key={"h"+i} x1={p.MX0} y1={y} x2={p.MX1} y2={y}/>))}
          <line x1={p.PX0+p.GA_D} y1={p.GAY0} x2={p.MX0} y2={p.GAY0}/>
          <line x1={p.PX0+p.GA_D} y1={p.GAY1} x2={p.MX0} y2={p.GAY1}/>
          <line x1={p.MX1} y1={p.GAY0} x2={p.PX1-p.GA_D} y2={p.GAY0}/>
          <line x1={p.MX1} y1={p.GAY1} x2={p.PX1-p.GA_D} y2={p.GAY1}/>
        </g>
        <g stroke="#f3ecd5" strokeWidth="2.4" fill="none" style={{pointerEvents:"none"}} opacity="0.92">
          <rect x={p.PX0} y={p.PY0} width={p.PW} height={p.PH}/>
          <line x1={p.CX} y1={p.PY0} x2={p.CX} y2={p.PY1}/>
          <circle cx={p.CX} cy={p.CY} r={p.CCR}/>
          <rect x={p.PX0} y={p.BOXY0} width={p.BOXD} height={p.BOXY1-p.BOXY0}/>
          <rect x={p.PX1-p.BOXD} y={p.BOXY0} width={p.BOXD} height={p.BOXY1-p.BOXY0}/>
          <rect x={p.PX0} y={p.GAY0} width={p.GA_D} height={p.GAY1-p.GAY0}/>
          <rect x={p.PX1-p.GA_D} y={p.GAY0} width={p.GA_D} height={p.GAY1-p.GAY0}/>
          <path d={`M ${p.PX0+p.BOXD} ${p.CY-58} A ${p.ARC} ${p.ARC} 0 0 1 ${p.PX0+p.BOXD} ${p.CY+58}`}/>
          <path d={`M ${p.PX1-p.BOXD} ${p.CY-58} A ${p.ARC} ${p.ARC} 0 0 0 ${p.PX1-p.BOXD} ${p.CY+58}`}/>
          <path d={`M ${p.PX0} ${p.PY0+16} A 16 16 0 0 0 ${p.PX0+16} ${p.PY0}`}/>
          <path d={`M ${p.PX1-16} ${p.PY0} A 16 16 0 0 0 ${p.PX1} ${p.PY0+16}`}/>
          <path d={`M ${p.PX0} ${p.PY1-16} A 16 16 0 0 1 ${p.PX0+16} ${p.PY1}`}/>
          <path d={`M ${p.PX1-16} ${p.PY1} A 16 16 0 0 1 ${p.PX1} ${p.PY1-16}`}/>
        </g>
        <g fill="rgba(255,255,255,0.06)" stroke="#f3ecd5" strokeWidth="2" style={{pointerEvents:"none"}}>
          <rect x={p.PX0-16} y={p.CY-31} width={16} height={62}/>
          <rect x={p.PX1} y={p.CY-31} width={16} height={62}/>
        </g>
        {corners.map(z=>(<CornerZone key={z.id} zone={z} selected={sel(z.id)} isHover={hov(z.id)} onHover={setHoverId} onClick={onZoneClick}/>))}
        {points.map(z=>(<PointZone key={z.id} zone={z} selected={sel(z.id)} isHover={hov(z.id)} onHover={setHoverId} onClick={onZoneClick}/>))}
        {Object.entries(flash).map(([id,ts])=>byId[id]&&<ZoneFlash key={id+"-"+ts} zone={byId[id]}/>)}
        {hoverId&&byId[hoverId]&&<ZoneTip zone={byId[hoverId]} box={bboxOf(byId[hoverId])} W={p.W}/>}
      </svg>
    </div>
  );
}

function ZoneTip({zone,box,W}) {
  const name=zone.name,sub=`${zone.price} pts · ${zone.taken}/${zone.slots} plazas`;
  const tw=Math.max(name.length*6.7,sub.length*5.8,110)+22,th=38;
  let x=Math.min(Math.max(box.cx-tw/2,8),W-tw-8),y=box.y-th-8;
  if(y<8) y=box.y+box.h+8;
  return (
    <g className="ps-zone-tip" style={{pointerEvents:"none",filter:"drop-shadow(0 5px 10px rgba(0,0,0,0.55))"}}>
      <rect x={x} y={y} width={tw} height={th} rx={6} fill="#181b18" stroke="#4a6b3a" strokeWidth="1.3"/>
      <rect x={x} y={y} width={4} height={th} rx={2} fill="#ffd27a"/>
      <text x={x+tw/2} y={y+16} textAnchor="middle" fontFamily="Saira,sans-serif" fontWeight="700" fontSize="12.5" letterSpacing="0.3" fill="#f3ecd5">{name}</text>
      <text x={x+tw/2} y={y+30} textAnchor="middle" fontFamily="Saira,sans-serif" fontWeight="600" fontSize="10.5" letterSpacing="0.3" fill="#ffd27a">{sub}</text>
    </g>
  );
}

function PitchLegend() {
  const dots=["#56823c","#7a9a3a","#a6a635","#d4a72c","#d68546","#c8442e","#a02d20"];
  return (
    <div className="ps-price-legend">
      <span className="ps-pl-label">MENOR PRECIO</span>
      <div className="ps-pl-dots">{dots.map((c,i)=><span key={i} className="ps-pl-dot" style={{background:c}}></span>)}</div>
      <span className="ps-pl-label">MAYOR PRECIO</span>
    </div>
  );
}

Object.assign(window, { PitchField, PitchLegend });

// ===== SIMULADOR DE PARTIDOS HISTÓRICOS =====
const SIM_SPEEDS = [ {label:"1x",ms:3000}, {label:"3x",ms:1000}, {label:"10x",ms:300} ];
const SIM_PERIOD_LABEL = { 1:"1ª PARTE", 2:"2ª PARTE", 3:"PRÓRROGA", 4:"PRÓRROGA", 5:"PENALTIS" };
const SIM_ACTION_META = {
  "Gol":{icon:"⚽",pts:40}, "Tiro a puerta":{icon:"🥅",pts:25}, "Penalti señalado":{icon:"🎯",pts:50},
  "Asistencia":{icon:"👟",pts:15}, "Pase clave":{icon:"🪡",pts:10}, "Recuperación":{icon:"🛡",pts:5},
};

function sbClassify(ev) {
  switch (ev.type) {
    case "Shot":             return ev.shot&&ev.shot.outcome==="Goal"?"Gol":"Tiro a puerta";
    case "Own Goal Against": return "Gol";
    case "Pass":             return ev.pass&&ev.pass.goal_assist?"Asistencia":"Pase clave";
    case "Ball Recovery":    return "Recuperación";
    case "Foul Won":         return "Penalti señalado";
    default:                 return null;
  }
}

// StatsBomb codifica cada evento con el equipo en posesión atacando de
// izquierda a derecha: al visitante se le invierten las coordenadas para
// fijarlo en el campo. En un gol en propia el evento es del equipo que se
// marca: la zona usa sus coordenadas pero el gol se acredita al rival.
function sbToKanchaEvent(ev,hm) {
  const action=sbClassify(ev);
  if (!action||!ev.location) return null;
  let [x,y]=ev.location;
  if (ev.team===hm.sbAway) { x=120-x; y=80-y; }
  const zone=sbLocateZone(x,y), meta=SIM_ACTION_META[action];
  const evHome=ev.team===hm.sbHome, isOG=ev.type==="Own Goal Against";
  return { min:ev.minute, period:ev.period, type:"act", icon:meta.icon, action,
    team:(evHome!==isOG)?hm.home:hm.away, zoneId:zone?zone.id:null, zone:zone?zone.name:"", pts:meta.pts };
}

function useHistoricSim(onActEvent) {
  const [sim,setSim]=React.useState({status:"idle",match:null,events:[],minute:0,period:1,progress:0,total:0});
  const ref=React.useRef({queue:[],idx:0,timer:null});

  const clear=()=>{ if(ref.current.timer){clearInterval(ref.current.timer);ref.current.timer=null;} };
  React.useEffect(()=>clear,[]);

  const run=(ms)=>{
    clear();
    ref.current.timer=setInterval(()=>{
      const r=ref.current;
      if (r.idx>=r.queue.length) {
        clear();
        setSim(s=>({...s,status:"done",events:[{type:"info",icon:"🏁",label:"Final del partido",min:s.minute},...s.events]}));
        return;
      }
      const ev=r.queue[r.idx++];
      if (ev.zoneId&&onActEvent) onActEvent(ev);
      setSim(s=>({...s,events:[ev,...s.events],minute:ev.min,period:ev.period,progress:r.idx}));
    },ms);
  };

  async function start(hm,ms) {
    clear();
    setSim({status:"loading",match:hm,events:[],minute:0,period:1,progress:0,total:0});
    try {
      const res=await fetch(`/data/events/${hm.id}.json`);
      if (!res.ok) throw new Error("HTTP "+res.status);
      const {events}=await res.json();
      const queue=events.slice()
        .sort((a,b)=>a.period-b.period||a.minute-b.minute||a.second-b.second||a.index-b.index)
        .map(e=>sbToKanchaEvent(e,hm)).filter(Boolean);
      ref.current={queue,idx:0,timer:null};
      setSim({status:"running",match:hm,events:[{type:"info",icon:"🟢",label:"¡Comienza el partido!",min:0}],minute:0,period:1,progress:0,total:queue.length});
      run(ms);
    } catch(e) {
      setSim({status:"error",match:hm,events:[],minute:0,period:1,progress:0,total:0});
    }
  }

  function setSpeed(ms){ if(ref.current.timer) run(ms); }
  function stop(){ clear(); setSim({status:"idle",match:null,events:[],minute:0,period:1,progress:0,total:0}); }

  return {sim,start,setSpeed,stop};
}

// Hero del partido histórico seleccionado: equipos reales, resultado real, competición y año
function HistoricHero({ m }) {
  return (
    <div className="ps-hero">
      <div className="ps-hero-inner">
        <div className="ps-hero-top">
          <span className="ps-hero-trophy">🏟</span>
          <span className="ps-hero-group">{m.comp}</span>
          <span className="ps-hero-stars">★ ★ ★</span>
          <span className="ps-hero-tag">PARTIDO HISTÓRICO</span>
        </div>
        <div className="ps-hero-teams">
          <div className="ps-hero-team-h"><Flag code={m.home} h={26} className="ps-hero-flag"/><span className="ps-hero-name">{COUNTRY_NAME[m.home].toUpperCase()}</span></div>
          <span className="ps-hhero-score">{m.score}</span>
          <div className="ps-hero-team-a"><span className="ps-hero-name">{COUNTRY_NAME[m.away].toUpperCase()}</span><Flag code={m.away} h={26} className="ps-hero-flag"/></div>
        </div>
        <div className="ps-hero-bottom">
          <div className="ps-hero-meta-item"><span className="ps-hero-meta-l">RESULTADO REAL</span><span className="ps-hero-meta-v">{m.score}</span></div>
          <div className="ps-hero-meta-sep"></div>
          <div className="ps-hero-meta-item"><span className="ps-hero-meta-l">EVENTOS</span><span className="ps-hero-meta-v">DATOS REALES · STATSBOMB</span></div>
          <div className="ps-hero-meta-sep"></div>
          <div className="ps-hero-meta-item"><span className="ps-hero-meta-l">PUNTÚA</span><span className="ps-hero-meta-v">CON TUS ZONAS RESERVADAS</span></div>
        </div>
      </div>
    </div>
  );
}

function HistoricInfoCard({ m }) {
  return (
    <div className="ps-card">
      <div className="ps-card-head"><span>PARTIDO HISTÓRICO</span><span className="ps-chev">▾</span></div>
      <div className="ps-card-body">
        <div className="ps-match-mini">
          <div className="ps-team-row"><Flag code={m.home} h={22}/><span className="ps-team">{COUNTRY_NAME[m.home]}</span></div>
          <div className="ps-vs">vs</div>
          <div className="ps-team-row"><Flag code={m.away} h={22}/><span className="ps-team">{COUNTRY_NAME[m.away]}</span></div>
          <div className="ps-mini-meta">{m.comp}<br/>Resultado real: <strong>{m.score}</strong></div>
          <div className="ps-tag ps-tag-pre">DATOS REALES</div>
        </div>
      </div>
    </div>
  );
}

// Panel de control de la simulación: velocidad 1x/3x/10x, estado y botón principal
function SimPanel({ sim, countdown, speedIdx, onSpeed, onSimulate, onStop }) {
  const busy=sim.status==="running"||sim.status==="loading";
  const status=
    countdown!=null?`EMPIEZA EN ${countdown}…`:
    sim.status==="loading"?"Cargando eventos reales…":
    sim.status==="running"?`Evento ${sim.progress}/${sim.total} · min ${sim.minute}'`:
    sim.status==="done"?"Partido finalizado":
    sim.status==="error"?"No se pudieron cargar los eventos":
    "Reserva tus zonas y pulsa simular";
  return (
    <div className="ps-card ps-simpanel">
      <div className="ps-card-head"><span>SIMULACIÓN</span><span className="ps-lm-tag">STATSBOMB</span></div>
      <div className="ps-card-body">
        <div className="ps-simpanel-speed-l">VELOCIDAD</div>
        <div className="ps-seg ps-simpanel-speed">
          {SIM_SPEEDS.map((s,i)=>(<button key={s.label} className={i===speedIdx?"is-on":""} onClick={()=>onSpeed(i)}>{s.label}</button>))}
        </div>
        <div className={"ps-simpanel-status"+(sim.status==="error"?" is-error":"")}>{status}</div>
        {busy?(
          <button className="ps-btn ps-btn-dark ps-simpanel-btn" onClick={onStop}>⏸ DETENER</button>
        ):(
          <button className="ps-btn ps-btn-primary ps-simpanel-btn" disabled={countdown!=null} onClick={onSimulate}>{sim.status==="done"?"↻ REPETIR PARTIDO":"▶ SIMULAR PARTIDO"}</button>
        )}
      </div>
    </div>
  );
}

function CountdownOverlay({ n }) {
  return (
    <div className="ps-countdown-overlay">
      <div className="ps-countdown-num" key={n}>{n}</div>
    </div>
  );
}

Object.assign(window, { useHistoricSim, HistoricHero, SimPanel, CountdownOverlay, sbLocateZone, sbToKanchaEvent });

// ===== PAGE INICIO =====
function PageInicio({ onNav, onScoreUpdate }) {
  const [mode,setMode]=React.useState("mundial"); // home | mundial | historic | browse
  const [historicMatch,setHistoricMatch]=React.useState(null);
  // Partido del Mundial activo en la pantalla de juego (clicable desde el fixture)
  const [mundialMatch,setMundialMatch]=React.useState(FIXTURE.find(m=>m.featured)||FIXTURE[0]);
  const [selectedZones,setSelectedZones]=React.useState([]);
  // Zonas confirmadas en DB — para saber si el botón debe decir "EDITAR" o "CONFIRMAR"
  const [savedZones,setSavedZones]=React.useState(null); // null = todavía cargando
  // Presupuesto permanente del usuario (scores.budget); 500 por defecto
  const [budget,setBudget]=React.useState(ME.budget);
  // Sub-presupuesto asignado a este partido en PageJornada (null = sin asignación → usa budget global)
  const [matchAlloc,setMatchAlloc]=React.useState(null);
  const [view,setView]=React.useState("mapa");
  const [focusZone,setFocusZone]=React.useState("penspot_izq");
  const focused=ZONES.find(z=>z.id===focusZone);

  // --- Simulación de partidos históricos ---
  const [speedIdx,setSpeedIdx]=React.useState(0);
  const [flash,setFlash]=React.useState({});
  const selectedRef=React.useRef([]);
  React.useEffect(()=>{ selectedRef.current=selectedZones; },[selectedZones]);
  const flashTimers=React.useRef({});
  React.useEffect(()=>()=>{ Object.values(flashTimers.current).forEach(clearTimeout); },[]);
  const handleSimEvent=React.useCallback((ev)=>{
    if (!selectedRef.current.includes(ev.zoneId)) return;
    setFlash(f=>({...f,[ev.zoneId]:Date.now()}));
    clearTimeout(flashTimers.current[ev.zoneId]);
    flashTimers.current[ev.zoneId]=setTimeout(()=>{
      setFlash(f=>{ const n={...f}; delete n[ev.zoneId]; return n; });
    },1600);
  },[]);
  const {sim,start:startSim,setSpeed:setSimSpeed,stop:stopSim}=useHistoricSim(handleSimEvent);

  // --- Countdown de 3 segundos antes de arrancar la simulación ---
  const [countdown,setCountdown]=React.useState(null);
  const countdownRef=React.useRef(null);
  const speedRef=React.useRef(0);
  React.useEffect(()=>{ speedRef.current=speedIdx; },[speedIdx]);
  React.useEffect(()=>()=>clearInterval(countdownRef.current),[]);
  function beginSimulation(){
    if(!historicMatch||countdown!=null||sim.status==="running"||sim.status==="loading") return;
    let n=3; setCountdown(n);
    countdownRef.current=setInterval(()=>{
      n--;
      if(n<=0){
        clearInterval(countdownRef.current); countdownRef.current=null;
        setCountdown(null);
        startSim(historicMatch,SIM_SPEEDS[speedRef.current].ms);
      } else setCountdown(n);
    },1000);
  }
  function openHistoric(m){ stopSim(); setHistoricMatch(m); setMode("historic"); }
  function backToBrowse(){
    clearInterval(countdownRef.current); countdownRef.current=null;
    setCountdown(null); stopSim(); setHistoricMatch(null); setMode("browse");
  }

  // Partido histórico solicitado desde PagePartidos (botón JUGAR)
  React.useEffect(()=>{
    const reqId=window.__KN_HISTORIC_REQUEST;
    if (!reqId) return;
    window.__KN_HISTORIC_REQUEST=null;
    const m=HISTORIC_MATCHES.find(x=>x.id===reqId);
    if (m) { setHistoricMatch(m); setMode("historic"); }
  },[]);

  // Partido del Mundial solicitado desde el fixture o Mis Reservas:
  // entra directo a la pantalla de juego de ese partido
  React.useEffect(()=>{
    const reqId=window.__KN_MUNDIAL_REQUEST;
    if (!reqId) return;
    window.__KN_MUNDIAL_REQUEST=null;
    const m=FIXTURE.find(x=>x.id===reqId);
    if (m) { setMundialMatch(m); setMode("mundial"); }
  },[]);

  // Scroll al hero al entrar en modo mundial (transición desde browse/historic/home)
  const heroRef=React.useRef(null);
  const skipFirstScroll=React.useRef(true);
  React.useEffect(()=>{
    if (mode!=="mundial") return;
    if (skipFirstScroll.current) { skipFirstScroll.current=false; return; }
    setTimeout(()=>{
      if (heroRef.current) heroRef.current.scrollIntoView({behavior:"smooth",block:"start"});
      else window.scrollTo({top:0,behavior:"smooth"});
    },80);
  },[mode]);

  const simOn=sim.match&&(sim.status==="running"||sim.status==="done"||sim.status==="loading");
  const simReservations=selectedZones.map(id=>{ const z=ZONES.find(zz=>zz.id===id); return {zoneId:id,name:z?z.name:id,price:z?z.price:0}; });

  // Al arrancar la simulación, baja hasta el marcador en vivo
  const lmRef=React.useRef(null);
  React.useEffect(()=>{ if(sim.status==="running"&&lmRef.current) lmRef.current.scrollIntoView({behavior:"smooth",block:"start"}); },[sim.status]);

  // Liquidación de partido real: cuando el partido está FINALIZADO y hay eventos
  // cargados, acredita los puntos al usuario una sola vez (localStorage flag).
  // NOTA: liveSettledRef y su useEffect se mueven DESPUÉS de la declaración
  // de liveEvents (líneas ~856) para evitar temporal dead zone en el array
  // de dependencias. Ver bloque "Liquidación de partido real" más abajo.

  // Liquidación al terminar un partido: los puntos ganados en las zonas del
  // usuario se suman a su presupuesto permanente (scores.budget) y a su
  // total_points del ranking. Una sola liquidación por simulación.
  const settledRef=React.useRef(false);
  React.useEffect(()=>{
    if (sim.status==="running") { settledRef.current=false; return; }
    if (sim.status!=="done"||settledRef.current) return;
    settledRef.current=true;
    const earned=sim.events.filter(e=>e.type==="act"&&selectedRef.current.includes(e.zoneId)).reduce((s,e)=>s+(e.pts||0),0);
    if (!earned) return;
    const db=window.supabaseClient;
    if (!db) return;
    (async()=>{
      try{
        const{data:{user}}=await db.auth.getUser();
        if(!user)return;
        const{data:row,error:readErr}=await db.from('scores').select('budget,total_points').eq('user_id',user.id).maybeSingle();
        if(readErr)return; // columna budget aún no creada: no se liquida
        const newBudget=((row&&row.budget!=null)?row.budget:ME.budget)+earned;
        const newTotal=((row&&row.total_points)||0)+earned;
        const{error}=await db.from('scores').update({budget:newBudget,total_points:newTotal}).eq('user_id',user.id);
        if(!error){ ME.budget=newBudget; ME.totalPoints=newTotal; setBudget(newBudget); if(onScoreUpdate) onScoreUpdate({budget:newBudget,total_points:newTotal}); }
      }catch(e){/* sin conexión: el presupuesto local no cambia */}
    })();
  },[sim.status]);

  // --- Eventos en vivo del Mundial 2026 ---
  // Al entrar en modo Mundial, /api/sync-fixture resuelve el partido activo
  // real y su apiMatchId; con ese id se hace polling de /api/live-events
  // cada 60s. liveMatch guarda los códigos de equipo del partido real para
  // banderas y marcador (si el sync falla, se usa el fixture mock).
  const [liveEvents,setLiveEvents]=React.useState([]);

  // Liquidación de partido real: acredita puntos al usuario cuando el partido
  // está FINALIZADO y hay eventos cargados. Declarado AQUÍ (después de liveEvents)
  // para evitar temporal dead zone en el array de dependencias.
  const liveSettledRef=React.useRef(false);
  // Reset del ref al cambiar de partido — crítico: sin esto, el primer partido
  // que se liquida bloquea todos los demás (el ref queda true para siempre).
  React.useEffect(()=>{ liveSettledRef.current=false; },[mundialMatch.id]);
  React.useEffect(()=>{
    if(!liveEvents.length||!selectedZones.length) return;
    if(fixtureStatus(mundialMatch)!=="FINALIZADO") return;
    if(liveSettledRef.current) return;
    const key=`kn_settled_${mundialMatch.id}`;
    if(typeof localStorage!=="undefined"&&parseInt(localStorage.getItem(key)||"0")>0) return;
    liveSettledRef.current=true;
    const actionPts=Object.fromEntries(ACTIONS.map(a=>[a.name,a.points]));
    const earned=liveEvents.filter(e=>e.type==="act"&&e.zoneId&&selectedZones.includes(e.zoneId)).reduce((s,e)=>s+(e.pts||actionPts[e.action]||0),0);
    if(typeof localStorage!=="undefined") localStorage.setItem(key,earned.toString());
    if(!earned) return;
    const db=window.supabaseClient;
    if(!db) return;
    (async()=>{
      try{
        const{data:{user}}=await db.auth.getUser();
        if(!user) return;
        const{data:row}=await db.from('scores').select('total_points,matches_played,budget').eq('user_id',user.id).maybeSingle();
        const newTotal=((row?.total_points)||0)+earned;
        const newPlayed=((row?.matches_played)||0)+1;
        const newBudget=((row?.budget)||ME.budget)+earned;
        await db.from('scores').upsert({user_id:user.id,total_points:newTotal,matches_played:newPlayed,budget:newBudget},{onConflict:'user_id'});
        ME.budget=newBudget; ME.totalPoints=newTotal;
        setBudget(newBudget);
        if(onScoreUpdate) onScoreUpdate({budget:newBudget,total_points:newTotal});
      }catch(e){/* sin conexión */}
    })();
  },[liveEvents.length,mundialMatch.id,selectedZones.length]);
  const [liveFixture,setLiveFixture]=React.useState(null);
  const [liveMinute,setLiveMinute]=React.useState(0);
  const liveLastMin=React.useRef(0);
  const liveMatchRef=React.useRef(null);
  React.useEffect(()=>{
    if (mode!=="mundial") return;
    let active=true, timer=null;
    async function poll(){
      const lm=liveMatchRef.current;
      const matchId=(lm&&lm.apiMatchId)||mundialMatch.id;
      try{
        const homeCode=(lm&&lm.home)||mundialMatch.home;
        const res=await fetch(`/api/live-events?match_id=${encodeURIComponent(matchId)}&since=${liveLastMin.current}&home=${encodeURIComponent(homeCode)}`);
        if (!res.ok) return;
        const data=await res.json();
        if (!active||!data.events||!data.events.length) return;
        liveLastMin.current=Math.max(liveLastMin.current,...data.events.map(e=>e.min||0));
        setLiveMinute(liveLastMin.current);
        // side ("home"/"away") → código de equipo, para banderas y marcador
        const home=(lm&&lm.home)||mundialMatch.home, away=(lm&&lm.away)||mundialMatch.away;
        const mapped=data.events.map(e=>({...e,team:e.side==="home"?home:away}));
        setLiveEvents(prev=>[...mapped.slice().reverse(),...prev]);
        mapped.forEach(ev=>handleSimEvent(ev)); // ilumina las zonas reservadas que reciben el evento
      }catch(e){ /* API caída o sin red: se reintenta en el siguiente tick */ }
    }
    (async()=>{
      let dayFixture=[];
      try{
        const res=await fetch("/api/sync-fixture");
        if (res.ok) {
          const data=await res.json();
          dayFixture=data.fixture||[];
          if (data.active&&data.active.apiMatchId&&fixtureStatus(mundialMatch)!=="FINALIZADO") {
            liveMatchRef.current=data.active;
            // El marcador solo muestra el partido real si conocemos ambas banderas
            if (COUNTRY_NAME[data.active.home]&&COUNTRY_NAME[data.active.away]) setLiveFixture(data.active);
          }
        }
      }catch(e){ /* sin sync: polling con el fixture mock */ }
      if (!active) return;

      // Partido ya FINALIZADO: carga única de los eventos reales para el
      // resumen del feed; si la API no devuelve nada, goles conocidos.
      if (fixtureStatus(mundialMatch)==="FINALIZADO") {
        let events=[];
        const mine=dayFixture.find(f=>f.home===mundialMatch.home&&f.away===mundialMatch.away);
        if (mine&&mine.apiMatchId) {
          try{
            const res=await fetch(`/api/live-events?match_id=${encodeURIComponent(mine.apiMatchId)}&since=0&home=${encodeURIComponent(mundialMatch.home)}`);
            if (res.ok) {
              const d=await res.json();
              events=(d.events||[]).map(e=>({...e,team:e.side==="home"?mundialMatch.home:mundialMatch.away})).reverse();
            }
          }catch(e){/* API caída: cae al resumen conocido */}
        }
        if (!events.length) events=KNOWN_RESULTS[mundialMatch.id]||[];
        if (active) setLiveEvents(events);
        return; // sin polling: el partido ya terminó
      }

      poll();
      timer=setInterval(poll,60000);
    })();
    return ()=>{ active=false; clearInterval(timer); };
  },[mode,mundialMatch.id]);

  // Carga las reservas guardadas del usuario autenticado actual para el
  // partido en pantalla. Se recarga al cambiar de partido y al cambiar la
  // sesión (otro usuario o sign-out), descartando el estado anterior.
  React.useEffect(()=>{
    const db=window.supabaseClient;
    if(!db){setSelectedZones([]);return;}
    let cancelled=false;
    async function load(){
      try{
        const{data:{user}}=await db.auth.getUser();
        if(cancelled)return;
        if(!user){setSelectedZones([]);return;}
        const{data}=await db.from('reservations').select('zone_id')
          .eq('user_id',user.id).eq('match_id',mundialMatch.id);
        const zones=data&&data.length?data.map(r=>r.zone_id).slice(0,ME.zonesMax):[];
        if(!cancelled){ setSelectedZones(zones); setSavedZones(zones); }
        // presupuesto permanente del usuario (si la columna aún no existe, queda el 500 por defecto)
        const{data:scoreRow,error:scoreErr}=await db.from('scores').select('budget')
          .eq('user_id',user.id).maybeSingle();
        if(!cancelled&&!scoreErr&&scoreRow&&scoreRow.budget!=null){ ME.budget=scoreRow.budget; setBudget(scoreRow.budget); }
        // sub-presupuesto: override de Jornada (window global) o desde Supabase
        const _allocData = window.__KN_ALLOC_PTS;
        const _allocOverride = (_allocData && _allocData.matchId === mundialMatch.id && typeof _allocData.pts === "number") ? _allocData.pts : null;
        if (_allocOverride != null) window.__KN_ALLOC_PTS = null;
        try{
          const{data:allocRow}=await db.from('match_allocations').select('allocated_pts')
            .eq('user_id',user.id).eq('match_id',mundialMatch.id).maybeSingle();
          const _saved = allocRow&&allocRow.allocated_pts!=null ? allocRow.allocated_pts : null;
          if(!cancelled) setMatchAlloc(_allocOverride !== null ? _allocOverride : _saved);
          // Guardar override en Supabase si aún no está persistido
          if(_allocOverride != null && _allocOverride !== _saved){
            db.from('match_allocations').upsert(
              [{user_id:user.id, match_id:mundialMatch.id, allocated_pts:_allocOverride}],
              {onConflict:'user_id,match_id'}
            ).catch(()=>{});
          }
        }catch(e){ if(!cancelled) setMatchAlloc(_allocOverride); }
      }catch(e){if(!cancelled)setSelectedZones([]);}
    }
    load();
    const{data:authSub}=db.auth.onAuthStateChange(()=>{ setSelectedZones([]); load(); });
    return ()=>{ cancelled=true; if(authSub&&authSub.subscription)authSub.subscription.unsubscribe(); };
  },[mundialMatch.id]);

  async function confirmReservations(){
    const db=window.supabaseClient;
    if(!db||!selectedZones.length)return false;
    try{
      const{data:{user}}=await db.auth.getUser();
      if(!user)return false;
      const match_id=mundialMatch.id;
      const rows=selectedZones.map(zone_id=>{
        const z=ZONES.find(z=>z.id===zone_id);
        return{user_id:user.id,match_id,zone_id,price:z?z.price:0};
      });
      // Reemplaza la reserva completa del partido: borra las zonas anteriores
      // del usuario para este match_id y guarda la selección actual.
      const{error:delError}=await db.from('reservations').delete()
        .eq('user_id',user.id).eq('match_id',match_id);
      if(delError){console.error('[Kancha] delete reservations error:',delError);return false;}
      const{error}=await db.from('reservations').insert(rows);
      if(error){console.error('[Kancha] insert reservations error:',error);return false;}
      // Alta del usuario en scores (ranking + presupuesto permanente).
      // ignoreDuplicates: el insert solo ocurre la primera vez, con budget=500;
      // nunca machaca el presupuesto de un usuario existente.
      const userName=(window.__KN_USER&&window.__KN_USER.name)||user.email.split('@')[0];
      const{error:regErr}=await db.from('scores').upsert(
        {user_id:user.id,name:userName,budget:500,total_points:0,matches_played:0},
        {onConflict:'user_id',ignoreDuplicates:true}
      );
      if(regErr){
        await db.from('scores').upsert({user_id:user.id,name:userName},{onConflict:'user_id',ignoreDuplicates:true});
      }
      setSavedZones([...selectedZones]);
      return true;
    }catch(e){return false;}
  }
  // Límite efectivo: sub-presupuesto asignado si existe, presupuesto global si no
  const effectiveBudget = matchAlloc !== null ? matchAlloc : budget;
  function toggleZone(z) {
    if(z.taken>=z.slots) return;
    setFocusZone(z.id);
    setSelectedZones(prev=>{
      if(prev.includes(z.id)) return prev.filter(id=>id!==z.id);
      if(prev.length>=ME.zonesMax) return prev;
      const spent=prev.reduce((s,id)=>{const zz=ZONES.find(z=>z.id===id);return s+(zz?zz.price:0);},0);
      if(z.price>effectiveBudget-spent) return prev; // not enough budget
      return [...prev,z.id];
    });
  }
  const totalCost=selectedZones.reduce((sum,id)=>{const z=ZONES.find(zz=>zz.id===id);return sum+(z?z.price:0);},0);
  const remainingBudget=effectiveBudget-totalCost;

  const fieldBlock=(
    <>
      <div className="ps-field-toolbar">
        <div className="ps-seg">
          <button className={view==="mapa"?"is-on":""} onClick={()=>setView("mapa")}>MAPA DEL CAMPO</button>
          <button className={view==="lista"?"is-on":""} onClick={()=>setView("lista")}>LISTA DE ZONAS</button>
        </div>
        <div className="ps-field-cap"><span className="ps-cap-num">{selectedZones.length}</span> / {ME.zonesMax} ZONAS</div>
      </div>
      {view==="mapa"?(
        <>
          <PitchField zones={ZONES.map(z=>({...z,taken:selectedZones.includes(z.id)?Math.min(z.slots,z.taken+1):z.taken,overBudget:!selectedZones.includes(z.id)&&(z.price>remainingBudget||selectedZones.length>=ME.zonesMax)}))} selectedIds={selectedZones} onZoneClick={toggleZone} flash={flash}/>
          <PitchLegend/>
        </>
      ):(
        <ZoneList zones={ZONES.map(z=>({...z,overBudget:!selectedZones.includes(z.id)&&(z.price>remainingBudget||selectedZones.length>=ME.zonesMax)}))} selectedIds={selectedZones} onPick={toggleZone}/>
      )}
    </>
  );

  // ── MODO HOME: pantalla de selección de modo (split diagonal) ──
  if (mode==="home") {
    return (
      <div className="ps-inicio">
        <ModeSelect onEnterMundial={()=>setMode("mundial")} onChooseHistoric={()=>setMode("browse")}/>
      </div>
    );
  }

  // ── MODO BROWSE: los 27 partidos históricos por categoría ──
  if (mode==="browse") {
    return (
      <div className="ps-inicio">
        <div className="ps-home">
          <button className="ps-back" onClick={()=>setMode("mundial")}>← VOLVER AL CAMPO</button>
          <HomeHistoricBlock onPlay={openHistoric}/>
        </div>
      </div>
    );
  }

  // ── MODO HISTÓRICO: hero del partido real + campo + panel de simulación ──
  if (mode==="historic"&&historicMatch) {
    return (
      <div className="ps-inicio">
        <div className="ps-inicio-screen">
          <aside className="ps-col-left">
            <button className="ps-back" onClick={backToBrowse}>← ELEGIR OTRO PARTIDO</button>
            <HistoricInfoCard m={historicMatch}/>
          </aside>
          <main className="ps-col-center">
            <HistoricHero m={historicMatch}/>
            {fieldBlock}
          </main>
          <aside className="ps-col-right">
            <BudgetCard selectedCount={selectedZones.length} remaining={remainingBudget} total={effectiveBudget} globalBudget={matchAlloc!==null?budget:null}/>
            <SimPanel sim={sim} countdown={countdown} speedIdx={speedIdx}
              onSpeed={(i)=>{ setSpeedIdx(i); setSimSpeed(SIM_SPEEDS[i].ms); }}
              onSimulate={beginSimulation} onStop={stopSim}/>
            <CartCard selectedIds={selectedZones} onRemove={(id)=>setSelectedZones(prev=>prev.filter(x=>x!==id))} onClear={()=>setSelectedZones([])}/>
          </aside>
        </div>
        {simOn&&(
          <div ref={lmRef}>
            <LiveMatch
              match={{home:sim.match.home,away:sim.match.away}}
              events={sim.events}
              reservations={simReservations}
              minute={sim.minute}
              half={sim.status==="done"?"FINAL":(SIM_PERIOD_LABEL[sim.period]||"1ª PARTE")}
              tag={sim.status==="loading"?"CARGANDO":"SIMULACIÓN"}
            />
          </div>
        )}
        {countdown!=null&&<CountdownOverlay n={countdown}/>}
      </div>
    );
  }

  // ── MODO MUNDIAL: la pantalla de reservas del Mundial 2026 de siempre ──
  return (
    <div className="ps-inicio">
      <div className="ps-inicio-screen">
        <aside className="ps-col-left">
          <button className="ps-back" onClick={()=>setMode("browse")}>★ HISTÓRICO</button>
          <PartidoActualCard match={mundialMatch}/>
          <ProximosCard onNav={onNav} excludeId={mundialMatch.id} onSelect={(m)=>{ setMundialMatch(m); setMode("mundial"); window.scrollTo({top:0,behavior:"smooth"}); }}/>
        </aside>
        <main ref={heroRef} className="ps-col-center">
          <MatchHero match={mundialMatch}/>
          {fieldBlock}
        </main>
        <aside className="ps-col-right">
          <BudgetCard selectedCount={selectedZones.length} remaining={remainingBudget} total={effectiveBudget} globalBudget={matchAlloc!==null?budget:null}/>
          <ZoneDetail zone={focused} selected={selectedZones.includes(focusZone)} atMax={selectedZones.length>=ME.zonesMax} onAdd={()=>toggleZone(focused)} totalCost={totalCost} remainingBudget={remainingBudget}/>
          <CartCard selectedIds={selectedZones} savedIds={savedZones} onRemove={(id)=>setSelectedZones(prev=>prev.filter(x=>x!==id))} onClear={()=>setSelectedZones([])} onConfirm={mundialMatch.status!=="FINALIZADO"?confirmReservations:null} matchStatus={mundialMatch.status}/>
        </aside>
      </div>
      <LiveMatch match={liveFixture?{home:liveFixture.home,away:liveFixture.away}:mundialMatch}
        events={liveEvents}
        reservations={simReservations}
        minute={mundialMatch.status==="FINALIZADO"?90:liveMinute}
        half={mundialMatch.status==="FINALIZADO"?"FINAL":(liveEvents.length?"EN JUEGO":"SIN COMENZAR")}
        tag={mundialMatch.status==="FINALIZADO"?"FINALIZADO":"EN DIRECTO"}/>
    </div>
  );
}

// ── PANTALLA DE SELECCIÓN DE MODO (split diagonal) ──
// Arte decorativo de césped para el panel EN VIVO
function MsPitchArt() {
  return (
    <svg viewBox="0 0 1000 620" className="ms-pitch-art" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="msTurf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#43663a"/><stop offset="50%" stopColor="#3d6135"/><stop offset="100%" stopColor="#2f5029"/>
        </linearGradient>
        <radialGradient id="msGlow" cx="50%" cy="44%" r="62%">
          <stop offset="0%" stopColor="#4f7644" stopOpacity="0.55"/><stop offset="100%" stopColor="#000" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1000" height="620" fill="url(#msTurf)"/>
      {Array.from({length:16}).map((_,i)=>(<rect key={i} x={i*62.5} y="0" width="62.5" height="620" fill={i%2?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.055)"}/>))}
      <rect width="1000" height="620" fill="url(#msGlow)"/>
      <g stroke="#f3ecd5" strokeWidth="2.4" fill="none" opacity="0.9">
        <rect x="40" y="40" width="920" height="540"/>
        <line x1="500" y1="40" x2="500" y2="580"/>
        <circle cx="500" cy="310" r="74"/>
        <rect x="40" y="170" width="120" height="280"/>
        <rect x="840" y="170" width="120" height="280"/>
        <rect x="40" y="240" width="44" height="140"/>
        <rect x="916" y="240" width="44" height="140"/>
        <path d="M 160 256 A 74 74 0 0 1 160 364"/>
        <path d="M 840 256 A 74 74 0 0 0 840 364"/>
      </g>
      <circle cx="500" cy="310" r="3.5" fill="#f3ecd5" opacity="0.9"/>
      <circle cx="120" cy="310" r="3.5" fill="#f3ecd5" opacity="0.9"/>
      <circle cx="880" cy="310" r="3.5" fill="#f3ecd5" opacity="0.9"/>
    </svg>
  );
}

// Logos reales donde existen (crests.football-data.org); el resto, solo texto
const MS_CAT_META = {
  "CHAMPIONS LEAGUE": { logo:"https://crests.football-data.org/CL.png",   sub:"Finales europeas · 2005–2019" },
  "MUNDIALES":        { sub:"Clásicos mundialistas · 1970–2022" },
  "EUROS":            { logo:"https://crests.football-data.org/2018.png", sub:"Eliminatorias · 2020 y 2024" },
  "COPA AMÉRICA":     { sub:"Argentina campeona · 2024" },
  "LA LIGA":          { sub:"Clásicos en el Bernabéu" },
};

function ModeSelect({ onEnterMundial, onChooseHistoric }) {
  const featured=FIXTURE.find(m=>m.featured)||FIXTURE[0];
  const cd=useReserveCountdown(featured);
  return (
    <div className="ms-screen">
      <div className="msa">
        <div className="msa-pane msa-live">
          <div className="msa-live-bg"><MsPitchArt/></div>
          <div className="msa-pad msa-pad-r">
            <div className="msa-eyebrow"><span className="ms-live-dot"></span>EN VIVO</div>
            <div className="msa-kicker">JÚGALO MIENTRAS PASA</div>
            <h2 className="msa-title">MUNDIAL<span className="msa-num">2026</span></h2>
            <p className="msa-sub">Reserva tus zonas del campo antes del pitido inicial y suma puntos con cada jugada, en directo.</p>
            <div className="msa-match" style={{cursor:"pointer"}} onClick={onEnterMundial}>
              <div className="msa-match-top"><span>GRUPO {featured.group} · {matchDateLabel(featured)}</span><span className="msa-match-open">● {featured.status==="ABIERTO"?"RESERVAS ABIERTAS":featured.status}</span></div>
              <div className="msa-match-teams">
                <Flag code={featured.home} h={24} className="ms-flag"/>
                <span className="msa-match-name">{COUNTRY_NAME[featured.home].toUpperCase()}</span>
                <span className="msa-match-vs">{featured.status==="FINALIZADO"&&featured.score?featured.score:"VS"}</span>
                <span className="msa-match-name">{COUNTRY_NAME[featured.away].toUpperCase()}</span>
                <Flag code={featured.away} h={24} className="ms-flag"/>
              </div>
              <div className="msa-match-top"><span>{featured.date} · {featured.venue.toUpperCase()}</span><span className="msa-match-cd">{cd?"CIERRA EN "+cd:"KICKOFF "+featured.time}</span></div>
            </div>
            <div className="msa-foot">
              <div className="msa-stats">
                <div><div className="msa-stat-l">SELECCIONES</div><div className="msa-stat-v">48</div></div>
                <div><div className="msa-stat-l">PARTIDOS</div><div className="msa-stat-v">104</div></div>
                <div><div className="msa-stat-l">EN DIRECTO</div><div className="msa-stat-v">HOY</div></div>
              </div>
              <button className="ms-cta ms-cta-red" onClick={onEnterMundial}>ENTRAR AL CAMPO <span className="ms-arrow">→</span></button>
            </div>
          </div>
        </div>
        <div className="msa-pane msa-hist">
          <div className="msa-pad msa-pad-l">
            <div className="msa-eyebrow is-hist">HISTÓRICOS<span className="ms-stamp">REAL · STATSBOMB</span></div>
            <div className="msa-kicker is-hist">REVIVE LO QUE YA FUE LEYENDA</div>
            <h2 className="msa-title is-hist">{HISTORIC_MATCHES.length} PARTIDOS<span className="msa-num">MÍTICOS</span></h2>
            <div className="msa-comp-list">
              {HISTORIC_CATS.map(cat=>{
                const meta=MS_CAT_META[cat]||{sub:""};
                const n=HISTORIC_MATCHES.filter(m=>m.cat===cat).length;
                if(!n) return null;
                return (
                  <div className={"msa-comp-row"+(meta.logo?"":" no-logo")} key={cat}>
                    {meta.logo&&<span className="ms-logoslot"><img src={meta.logo} alt={cat} loading="lazy"/></span>}
                    <div className="msa-comp-info">
                      <div className="msa-comp-name">{cat}</div>
                      <div className="msa-comp-sub">{meta.sub}</div>
                    </div>
                    <div className="msa-comp-count"><b>{n}</b><span>PARTIDOS</span></div>
                  </div>
                );
              })}
            </div>
            <div className="msa-foot">
              <div className="msa-stats">
                <div><div className="msa-stat-l is-hist">PARTIDOS</div><div className="msa-stat-v is-hist">{HISTORIC_MATCHES.length}</div></div>
                <div><div className="msa-stat-l is-hist">DATOS REALES</div><div className="msa-stat-v is-hist">100%</div></div>
              </div>
              <button className="ms-cta ms-cta-ink" onClick={onChooseHistoric}>ELEGIR PARTIDO <span className="ms-arrow">→</span></button>
            </div>
          </div>
        </div>
        <div className="msa-seam"></div>
        <div className="msa-toplabel">ELIGE TU MODO DE JUEGO</div>
      </div>
    </div>
  );
}

function HomeHistoricBlock({ onPlay }) {
  return (
    <section className="ps-home-sec">
      <div className="ps-home-sec-head">
        <div className="ps-home-sec-title is-hist">⚡ JUGAR UN PARTIDO HISTÓRICO</div>
        <span className="ps-home-sec-sub">{HISTORIC_MATCHES.length} PARTIDOS REALES · STATSBOMB OPEN-DATA</span>
      </div>
      {HISTORIC_CATS.map(cat=>{
        const list=HISTORIC_MATCHES.filter(m=>m.cat===cat);
        if(!list.length) return null;
        return (
          <div key={cat} className="ps-home-cat">
            <div className="ps-home-cat-head"><span className="ps-home-cat-name">{cat}</span><span className="ps-day-count">{list.length} {list.length===1?"partido":"partidos"}</span></div>
            <div className="ps-day-list">{list.map(m=><HistoricMatchCard key={m.id} m={m} onPlay={onPlay}/>)}</div>
          </div>
        );
      })}
    </section>
  );
}

function PartidoActualCard({ match }) {
  return (
    <div className="ps-card">
      <div className="ps-card-head"><span>PARTIDO ACTUAL</span><span className="ps-chev">▾</span></div>
      <div className="ps-card-body">
        <div className="ps-match-mini">
          <div className="ps-team-row"><Flag code={match.home} h={22}/><span className="ps-team">{COUNTRY_NAME[match.home]}</span></div>
          <div className="ps-vs">{match.status==="FINALIZADO"&&match.score?match.score:"vs"}</div>
          <div className="ps-team-row"><Flag code={match.away} h={22}/><span className="ps-team">{COUNTRY_NAME[match.away]}</span></div>
          <div className="ps-mini-meta">{match.date} · {match.status==="FINALIZADO"&&match.score?"FINAL "+match.score:match.time}<br/>{match.venue}</div>
          <div className={"ps-tag "+(match.status==="ABIERTO"||match.status==="EN VIVO"?"ps-tag-open":"ps-tag-next")}>{match.status}</div>
        </div>
      </div>
    </div>
  );
}

function ProximosCard({ onNav, excludeId, onSelect }) {
  // Colapsado por defecto en mobile (≤860px), abierto en desktop
  const [open, setOpen] = React.useState(typeof window!=="undefined" ? window.innerWidth > 860 : true);
  const upcoming = FIXTURE.filter(m=>m.id!==excludeId&&(m.status==="ABIERTO"||m.status==="PROXIMO")).slice(0,4);
  return (
    <div className="ps-card">
      <button className="ps-card-head" style={{width:"100%",textAlign:"left",cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
        <span>PRÓXIMOS PARTIDOS</span><span className="ps-chev">{open?"▴":"▾"}</span>
      </button>
      {open && (
        <div className="ps-card-body ps-mini-list">
          {upcoming.map(m=>{
            const isOpen=m.status==="ABIERTO"||m.status==="EN VIVO";
            return (
              <div className={"ps-mini-match"+(isOpen?" is-open":"")} key={m.id}
                style={isOpen?{cursor:"pointer"}:{}}
                onClick={()=>{ if(!isOpen) return; if(onSelect){ onSelect(m); } else { window.__KN_MUNDIAL_REQUEST=m.id; onNav("inicio"); } }}>
                <div className="ps-mini-teams">
                  <div className="ps-team-row"><Flag code={m.home} h={18}/><span className="ps-team-sm">{COUNTRY_NAME[m.home]}</span></div>
                  <div className="ps-vs-sm">{m.status==="FINALIZADO"&&m.score?m.score:"vs"}</div>
                  <div className="ps-team-row"><Flag code={m.away} h={18}/><span className="ps-team-sm">{COUNTRY_NAME[m.away]}</span></div>
                </div>
                <div className="ps-mini-bot">
                  <div className="ps-mini-meta-sm">{m.date} · {m.status==="FINALIZADO"&&m.score?"FINAL "+m.score:m.time}<br/>{m.venue}</div>
                  <div className={"ps-tag "+(isOpen?"ps-tag-open":"ps-tag-next")}>{m.status}</div>
                </div>
              </div>
            );
          })}
          <button className="ps-fixture-all" onClick={()=>onNav("partidos")}>VER TODO EL FIXTURE <span style={{marginLeft:6}}>▾</span></button>
        </div>
      )}
    </div>
  );
}

function MatchHero({ match }) {
  const cd=useReserveCountdown(match);
  return (
    <div className="ps-hero">
      <div className="ps-hero-inner">
        <div className="ps-hero-top">
          <span className="ps-hero-trophy">🏆</span>
          <span className="ps-hero-group">GRUPO {match.group} · {matchDateLabel(match)}</span>
          <span className="ps-hero-stars">★ ★ ★</span>
          <span className="ps-hero-tag">JORNADA {matchRound(match)}</span>
        </div>
        <div className="ps-hero-teams">
          <div className="ps-hero-team-h"><Flag code={match.home} h={26} className="ps-hero-flag"/><span className="ps-hero-name">{COUNTRY_NAME[match.home].toUpperCase()}</span></div>
          <span className="ps-hero-vs">{match.status==="FINALIZADO"&&match.score?match.score:"VS"}</span>
          <div className="ps-hero-team-a"><span className="ps-hero-name">{COUNTRY_NAME[match.away].toUpperCase()}</span><Flag code={match.away} h={26} className="ps-hero-flag"/></div>
        </div>
        <div className="ps-hero-bottom">
          <div className="ps-hero-meta-item"><span className="ps-hero-meta-l">FECHA</span><span className="ps-hero-meta-v">{match.date.replace("JUN","JUN 2026")} · {match.time}</span></div>
          <div className="ps-hero-meta-sep"></div>
          <div className="ps-hero-meta-item"><span className="ps-hero-meta-l">SEDE</span><span className="ps-hero-meta-v">{match.venue.toUpperCase()}</span></div>
          <div className="ps-hero-meta-sep"></div>
          {match.status!=="FINALIZADO"&&(
          <div className="ps-hero-countdown">
            <span className="ps-hero-cd-label">{cd?"RESERVAS CIERRAN EN":match.status==="EN VIVO"?"EN JUEGO":"RESERVAS CERRADAS"}</span>
            <span className="ps-hero-cd-time">{cd||match.time}</span>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

function BudgetCard({ selectedCount, remaining, total=ME.budget, globalBudget=null }) {
  const pct=Math.max(0,Math.round((remaining/Math.max(1,total))*100));
  const color=pct>50?"#3d7a3a":pct>20?"#c8a73f":"#b94234";
  return (
    <div className="ps-budget-row">
      <div className="ps-stat-box">
        <div className="ps-stat-label">{globalBudget!=null?"ASIGNADO A ESTE PARTIDO":"PRESUPUESTO RESTANTE"}</div>
        <div className="ps-stat-num" style={{color}}>{remaining}</div>
        <div className="ps-stat-unit">DE {total} PTS{globalBudget!=null?<span style={{opacity:.6}}> · TOTAL {globalBudget}</span>:""}</div>
      </div>
      <div className="ps-stat-box"><div className="ps-stat-label">ZONAS RESERVADAS</div><div className="ps-stat-num">{selectedCount} / {ME.zonesMax}</div></div>
    </div>
  );
}

function ZoneDetail({ zone, selected, atMax, onAdd, totalCost, remainingBudget }) {
  // Empieza colapsado para no ocupar media columna: el cabecero hace de toggle
  const [open,setOpen]=React.useState(false);
  if(!zone) return null;
  const isFull=zone.taken>=zone.slots;
  const noFunds=!selected&&zone.price>remainingBudget;
  const atLimit=!selected&&atMax;
  const disabled=isFull||noFunds||atLimit;
  const potential=zone.tier==="premium"?"MUY ALTO":zone.tier==="high"?"ALTO":zone.tier==="mid"?"MEDIO":"BAJO";
  return (
    <div className="ps-card ps-detail">
      <button className="ps-detail-head ps-panel-toggle" onClick={()=>setOpen(o=>!o)} aria-expanded={open}>
        <span className={`ps-dot ps-dot-${zone.tier}`}></span><span className="ps-detail-name">{zone.name.toUpperCase()}</span>
        <span className="ps-toggle-chev">{open?"▴":"▾"}</span>
      </button>
      {open&&(<>
      <div className="ps-detail-desc">{zone.tier==="premium"?"Zona premium. Muy alta probabilidad de acciones decisivas.":zone.tier==="high"?"Zona caliente. Frecuentes jugadas de gol.":zone.tier==="mid"?"Zona equilibrada. Buen balance riesgo/recompensa.":"Zona amplia. Mucha capacidad y acción frecuente."}</div>
      <div className="ps-detail-stats">
        <div><div className="ps-detail-stat-l">PRECIO</div><div className="ps-detail-stat-v">{zone.price} <span>pts</span></div></div>
        <div><div className="ps-detail-stat-l">POTENCIAL</div><div className="ps-detail-stat-v ps-detail-stat-warn">{potential}</div></div>
        <div><div className="ps-detail-stat-l">PLAZAS</div><div className="ps-detail-stat-v">{zone.taken}/{zone.slots}</div></div>
      </div>
      <div className="ps-detail-actions-label">ACCIONES QUE SUMAN</div>
      <div className="ps-actions-row">{ACTIONS.map(a=>(<div className="ps-action" key={a.name}><div className="ps-action-icon">{a.icon}</div><div className="ps-action-name">{a.name.toUpperCase()}</div><div className="ps-action-pts">+{a.points}</div></div>))}</div>
      <button className="ps-btn ps-btn-primary" disabled={disabled} onClick={onAdd}>{selected?"QUITAR DE LA SELECCIÓN":isFull?"ZONA AGOTADA":noFunds?"PRESUPUESTO INSUFICIENTE":atLimit?"LÍMITE DE ZONAS":"RESERVAR ESTA ZONA"}</button>
      <div className="ps-detail-cost">Te costará <strong>{zone.price} puntos</strong></div>
      </>)}
    </div>
  );
}

function CartCard({ selectedIds, savedIds, onRemove, onClear, onConfirm }) {
  const [saveState,setSaveState]=React.useState("idle"); // idle | saving | error
  const items=selectedIds.map(id=>ZONES.find(z=>z.id===id)).filter(Boolean);
  const total=items.reduce((s,z)=>s+z.price,0);

  // ¿Las zonas seleccionadas coinciden exactamente con las guardadas en DB?
  const isConfirmed=savedIds!==null&&
    selectedIds.length===savedIds.length&&
    [...selectedIds].sort().join()===([...savedIds]).sort().join();

  async function handleConfirm(){
    if(!items.length)return;
    setSaveState("saving");
    const ok=await onConfirm();
    setSaveState(ok?"idle":"error");
  }

  const btnLabel=saveState==="saving"?"GUARDANDO…":saveState==="error"?"ERROR — REINTENTAR":isConfirmed?"✓ EDITAR ZONAS":"CONFIRMAR RESERVAS";

  return (
    <div className="ps-card ps-cart">
      <div className="ps-cart-head"><span>MIS ZONAS ({items.length}/{ME.zonesMax})</span><button className="ps-clear" onClick={onClear}>LIMPIAR</button></div>
      <div className="ps-cart-list">
        {items.map(z=>(<div className="ps-cart-row" key={z.id}><span className={`ps-dot ps-dot-${z.tier}`}></span><span className="ps-cart-name">{z.name}</span><span className="ps-cart-price">{z.price} pts</span><button className="ps-cart-x" onClick={()=>onRemove(z.id)}>✕</button></div>))}
        {items.length===0&&<div className="ps-empty">Aún no has seleccionado zonas.</div>}
      </div>
      <div className="ps-cart-total"><span>TOTAL</span><span className="ps-cart-total-num">{total} PUNTOS</span></div>
      {onConfirm&&(
        <button
          className={"ps-btn "+(saveState==="saved"?"ps-btn-primary":saveState==="error"?"ps-btn-ghost":"ps-btn-dark")}
          onClick={handleConfirm}
          disabled={saveState==="saving"||!items.length}
        >{btnLabel}</button>
      )}
    </div>
  );
}

function ZoneList({ zones, selectedIds, onPick }) {
  return (
    <div className="ps-zone-list">
      {zones.map(z=>(<button key={z.id} className={"ps-zone-row"+(selectedIds.includes(z.id)?" is-on":"")+(z.taken>=z.slots||z.overBudget?" is-full":"")} onClick={()=>!(z.taken>=z.slots||z.overBudget)&&onPick(z)}><span className={`ps-dot ps-dot-${z.tier}`}></span><span className="ps-zl-name">{z.name}</span><span className="ps-zl-tier">{z.tier.toUpperCase()}</span><span className="ps-zl-slots">{z.taken}/{z.slots}</span><span className="ps-zl-price">{z.price} pts</span></button>))}
    </div>
  );
}

/* ── Mini animaciones para el modal ── */
function MiniFieldAnim() {
  const zones = [
    {x:72,y:28,r:9,delay:"0s",label:"⬡"},
    {x:28,y:28,r:9,delay:"0.6s",label:"⬡"},
    {x:50,y:50,r:11,delay:"1.2s",label:"⬡"},
    {x:72,y:72,r:9,delay:"1.8s",label:"⬡"},
    {x:28,y:72,r:9,delay:"2.4s",label:"⬡"},
  ];
  return (
    <svg viewBox="0 0 100 100" className="ps-hw-field-svg">
      {/* Campo */}
      <rect x="0" y="0" width="100" height="100" fill="#2a6428" rx="4"/>
      <rect x="2" y="2" width="96" height="96" fill="none" stroke="#3a7a38" strokeWidth="0.8" rx="3"/>
      <line x1="50" y1="2" x2="50" y2="98" stroke="#3a7a38" strokeWidth="0.6"/>
      <circle cx="50" cy="50" r="15" fill="none" stroke="#3a7a38" strokeWidth="0.6"/>
      <circle cx="50" cy="50" r="1.2" fill="#3a7a38"/>
      {/* Área grande izq */}
      <rect x="2" y="28" width="22" height="44" fill="none" stroke="#3a7a38" strokeWidth="0.6"/>
      {/* Área grande der */}
      <rect x="76" y="28" width="22" height="44" fill="none" stroke="#3a7a38" strokeWidth="0.6"/>
      {/* Zonas animadas */}
      {zones.map((z,i)=>(
        <circle key={i} cx={z.x} cy={z.y} r={z.r} fill="#ffd27a" opacity="0"
          style={{animation:`ps-zone-pulse 3s ${z.delay} infinite`}}/>
      ))}
      {/* Pelota animada */}
      <circle cx="50" cy="50" r="3" fill="#fff" style={{animation:"ps-ball-move 3s 0s infinite ease-in-out"}}/>
    </svg>
  );
}

function MiniFeedAnim() {
  const events = [
    {icon:"⚽",text:"GOL en Área Norte",pts:"+180 pts",color:"#f4a535",delay:"0s"},
    {icon:"🚩",text:"CÓRNER Banda Der.",pts:"+60 pts",color:"#5a9e4a",delay:"1.2s"},
    {icon:"🥅",text:"PENALTI Área Sur",pts:"+220 pts",color:"#b94234",delay:"2.4s"},
  ];
  return (
    <div className="ps-hw-feed">
      {events.map((e,i)=>(
        <div key={i} className="ps-hw-feed-row" style={{animationDelay:e.delay, "--feed-color": e.color}}>
          <span className="ps-hw-feed-icon">{e.icon}</span>
          <span className="ps-hw-feed-text">{e.text}</span>
          <span className="ps-hw-feed-pts">{e.pts}</span>
        </div>
      ))}
    </div>
  );
}

function MiniRankAnim() {
  const rows = [
    {pos:1, name:"Marcos R.", pts:"2.840", you:false},
    {pos:2, name:"Tú",        pts:"2.510", you:true},
    {pos:3, name:"Julia M.",  pts:"1.990", you:false},
  ];
  return (
    <div className="ps-hw-rank">
      <div className="ps-hw-rank-label">RANKING</div>
      {rows.map(r=>(
        <div key={r.pos} className={"ps-hw-rank-row"+(r.you?" ps-hw-rank-you":"")}
          style={r.you?{animation:"ps-rank-up 2s 0.8s ease-out both"}:{}}>
          <span className="ps-hw-rank-pos">{r.pos}</span>
          <span className="ps-hw-rank-name">{r.name}</span>
          <span className="ps-hw-rank-pts">{r.pts}</span>
        </div>
      ))}
      <div className="ps-hw-rank-arrow" style={{animation:"ps-rank-arrow 2s 0.6s ease-out both"}}>▲ Subiendo</div>
    </div>
  );
}

function HowItWorks() {
  const pts = ME.budget;
  return (
    <div className="ps-how3">
      {/* HERO */}
      <div className="ps-how3-hero">
        <div className="ps-how3-hero-kicker">KANCHA · CÓMO SE JUEGA</div>
        <div className="ps-how3-hero-title">¿Cuántas veces lo viste venir<br/>y nadie te creyó?</div>
        <div className="ps-how3-hero-sub">Ahora cada partido es tu oportunidad de demostrarlo. Tu conocimiento del fútbol tiene valor — ponle puntos.</div>
      </div>

      {/* PASO 1 */}
      <div className="ps-how3-block ps-how3-block--dark">
        <div className="ps-how3-block-demo">
          <MiniFieldAnim/>
        </div>
        <div className="ps-how3-block-body">
          <div className="ps-how3-n">01</div>
          <div className="ps-how3-block-title">Marca tus zonas antes del pitido</div>
          <div className="ps-how3-block-desc">Cada jornada recibes <strong>500 puntos</strong>. Distribúyelos en las zonas del campo donde <em>tú sabes</em> que va a ocurrir la acción: el área donde ataca el rival, la banda del mejor extremo, el córner que siempre acaba en peligro…</div>
          <div className="ps-how3-pill">500 PTS · POR JORNADA · SE ACUMULAN</div>
        </div>
      </div>

      {/* PASO 2 */}
      <div className="ps-how3-block ps-how3-block--mid">
        <div className="ps-how3-block-body">
          <div className="ps-how3-n">02</div>
          <div className="ps-how3-block-title">Sientes cada jugada en tiempo real</div>
          <div className="ps-how3-block-desc">Gol en tu zona. Córner en tu banda. Penalti en tu área. Cada acción que ocurre donde tú apostaste <strong>suma puntos automáticamente</strong>. El fútbol que siempre viste con rabia ahora te da la razón.</div>
          <div className="ps-how3-pill">GOL · CÓRNER · PENALTI · OCASIÓN</div>
        </div>
        <div className="ps-how3-block-demo">
          <MiniFeedAnim/>
        </div>
      </div>

      {/* PASO 3 */}
      <div className="ps-how3-block ps-how3-block--dark">
        <div className="ps-how3-block-demo">
          <MiniRankAnim/>
        </div>
        <div className="ps-how3-block-body">
          <div className="ps-how3-n">03</div>
          <div className="ps-how3-block-title">Demuestra que sabes más que nadie</div>
          <div className="ps-how3-block-desc">El ranking no miente. Los que realmente entienden el juego suben arriba temporada tras temporada. No es suerte — es <strong>ojo de experto</strong>, instinto y pasión por el fútbol. ¿Llegas al podio?</div>
          <div className="ps-how3-pill">RANKING GLOBAL · TEMPORADA · PODIO</div>
        </div>
      </div>

      {/* CTA */}
      <div className="ps-how3-cta">
        <div className="ps-how3-cta-main">Tienes <strong>{pts.toLocaleString('es-ES')} pts</strong> listos para jugar ahora mismo</div>
        <div className="ps-how3-cta-sub">Entra en JORNADA · Elige tu partido · Marca tus zonas</div>
      </div>
    </div>
  );
}

Object.assign(window, { PageInicio, ModeSelect, HowItWorks });

// ===== LIVE MATCH =====
const ZONE_TIER=(()=>{const m={};ZONES.forEach(z=>{m[z.id]=z.tier;});return m;})();

function useCountUp(target,ms=900) {
  const [v,setV]=React.useState(0);
  React.useEffect(()=>{
    let raf,start;
    const tick=(t)=>{if(!start)start=t;const p=Math.min(1,(t-start)/ms);const eased=1-Math.pow(1-p,3);setV(Math.round(target*eased));if(p<1)raf=requestAnimationFrame(tick);};
    raf=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(raf);
  },[target,ms]);
  return v;
}

function LiveMatch({ match, events=[], reservations=[], minute=0, half="SIN COMENZAR", tag="EN DIRECTO" }) {
  const myZones=reservations.map(r=>r.zoneId);
  // Los goles de una tanda de penaltis (period 5) no cuentan en el marcador
  const goals=events.filter(e=>e.type==="act"&&e.action==="Gol"&&(e.period==null||e.period<5));
  const homeGoals=goals.filter(e=>e.team===match.home).length;
  const awayGoals=goals.filter(e=>e.team===match.away).length;
  const zoneStats=reservations.map(r=>{
    const evs=events.filter(e=>e.type==="act"&&e.zoneId===r.zoneId);
    const pts=evs.reduce((s,e)=>s+e.pts,0),lastMin=evs.length?Math.max(...evs.map(e=>e.min)):null;
    return {...r,tier:ZONE_TIER[r.zoneId]||"mid",pts,count:evs.length,lastMin};
  }).sort((a,b)=>b.pts-a.pts);
  const liveTotal=zoneStats.reduce((s,z)=>s+z.pts,0);
  const maxZone=Math.max(1,...zoneStats.map(z=>z.pts));
  const liveCount=events.filter(e=>e.type==="act"&&myZones.includes(e.zoneId)).length;
  const animTotal=useCountUp(liveTotal);
  return (
    <section className="ps-lm">
      <LiveScoreboard match={match} home={homeGoals} away={awayGoals} total={animTotal} liveCount={liveCount} minute={minute} half={half} tag={tag}/>
      <div className="ps-lm-grid">
        <LiveFeed events={events} myZones={myZones}/>
        <LiveZones zoneStats={zoneStats} total={liveTotal} max={maxZone}/>
        <ScoringPanel zoneStats={zoneStats} myZones={myZones}/>
      </div>
    </section>
  );
}

function LiveScoreboard({ match, home, away, total, liveCount, minute=0, half="SIN COMENZAR", tag="EN DIRECTO" }) {
  return (
    <div className="ps-lm-board">
      <div className="ps-lm-board-tag"><span className="ps-live-pulse"></span>{tag}</div>
      <div className="ps-lm-score">
        <div className="ps-lm-team ps-lm-team-h"><span className="ps-lm-team-name">{COUNTRY_NAME[match.home].toUpperCase()}</span><Flag code={match.home} h={26}/></div>
        <div className="ps-lm-nums"><span>{home}</span><i>—</i><span>{away}</span></div>
        <div className="ps-lm-team ps-lm-team-a"><Flag code={match.away} h={26}/><span className="ps-lm-team-name">{COUNTRY_NAME[match.away].toUpperCase()}</span></div>
      </div>
      <div className="ps-lm-clock"><span className="ps-lm-min">{minute}'</span><span className="ps-lm-half">{half}</span></div>
      <div className="ps-lm-mypts">
        <div className="ps-lm-mypts-l">TUS PUNTOS EN VIVO</div>
        <div className="ps-lm-mypts-v">+{total}</div>
        <div className="ps-lm-mypts-s">{liveCount} acciones en tus zonas</div>
      </div>
    </div>
  );
}

function LiveFeed({ events, myZones }) {
  return (
    <div className="ps-card ps-lm-feed">
      <div className="ps-lm-panel-head"><span className="ps-lm-panel-title">FEED DEL PARTIDO</span><span className="ps-lm-panel-sub">EN TIEMPO REAL</span></div>
      <div className="ps-lm-feed-list">
        {events.length===0&&<div className="ps-empty">Sin eventos todavía. El feed se activará cuando el partido esté en vivo.</div>}
        {events.map((e,i)=>{
          if(e.type==="info") return (<div className="ps-lm-info" key={i}><span className="ps-lm-info-min">{e.min}'</span><span className="ps-lm-info-ic">{e.icon}</span><span className="ps-lm-info-lab">{e.label}</span></div>);
          const mine=myZones.includes(e.zoneId);
          return (
            <div className={"ps-lm-ev"+(mine?" is-mine":"")} key={i}>
              <span className="ps-lm-ev-min">{e.min}'</span>
              <span className="ps-lm-ev-ic">{e.icon}</span>
              <div className="ps-lm-ev-body">
                <div className="ps-lm-ev-top"><span className="ps-lm-ev-act">{e.action}</span><Flag code={e.team} h={12}/>{mine&&<span className="ps-lm-tag">TU ZONA</span>}</div>
                <div className="ps-lm-ev-zone">{e.zone}</div>
              </div>
              <span className={"ps-lm-ev-pts"+(mine?" is-mine":"")}>+{e.pts}<span className="ps-lm-ev-pts-u">pts</span></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LiveZones({ zoneStats, total, max }) {
  return (
    <div className="ps-card ps-lm-zones">
      <div className="ps-lm-panel-head"><span className="ps-lm-panel-title">TUS ZONAS EN JUEGO</span><span className="ps-lm-panel-sub">{zoneStats.length} RESERVADAS</span></div>
      <div className="ps-lm-zones-list">
        {zoneStats.map(z=>(<div className={"ps-lm-zone"+(z.pts>0?" is-hot":" is-cold")} key={z.zoneId}><div className="ps-lm-zone-top"><span className={`ps-dot ps-dot-${z.tier}`}></span><span className="ps-lm-zone-name">{z.name}</span><span className="ps-lm-zone-pts">+{z.pts}</span></div><div className="ps-lm-zone-bar"><div className="ps-lm-zone-fill" style={{width:(z.pts/max*100)+"%"}}></div></div><div className="ps-lm-zone-meta"><span>{z.count} {z.count===1?"acción":"acciones"}</span><span>{z.lastMin!=null?"últ. "+z.lastMin+"'":"sin acción aún"}</span></div></div>))}
      </div>
      <div className="ps-lm-zones-total"><span>TOTAL EN VIVO</span><span className="ps-lm-zones-total-v">+{total} pts</span></div>
    </div>
  );
}

function ScoringPanel({ zoneStats, myZones }) {
  const chances=[
    {ic:"🚩",label:"Córner a favor — MEX",zoneId:"corner_s_der",pot:10},
    {ic:"🎯",label:"Falta peligrosa al borde",zoneId:"boxF_izq",pot:25},
    {ic:"👟",label:"Contraataque por el centro",zoneId:"med_2",pot:15},
    {ic:"🥅",label:"Remate desde el área",zoneId:"box6_der",pot:25},
  ];
  // Empieza colapsado: el cabecero hace de toggle para expandir las reglas
  const [open,setOpen]=React.useState(false);
  return (
    <div className="ps-card ps-lm-rules">
      <button className={"ps-lm-panel-head ps-panel-toggle"+(open?"":" is-closed")} onClick={()=>setOpen(o=>!o)} aria-expanded={open}>
        <span className="ps-lm-panel-title">CÓMO SUMAN PUNTOS</span>
        <span className="ps-lm-panel-sub">VALOR POR ACCIÓN <span className="ps-toggle-chev">{open?"▴":"▾"}</span></span>
      </button>
      {open&&(<>
      <div className="ps-lm-rules-grid">{ACTIONS.map(a=>(<div className="ps-lm-rule" key={a.name}><span className="ps-lm-rule-ic">{a.icon}</span><span className="ps-lm-rule-name">{a.name}</span><span className="ps-lm-rule-pts">+{a.points}</span></div>))}</div>
      <div className="ps-lm-rule-note">Solo las acciones que ocurren <strong>dentro de una zona que tienes reservada</strong> suman a tu marcador.</div>
      <div className="ps-lm-poss-head">POSIBILIDADES ACTIVAS</div>
      <div className="ps-lm-poss-list">
        {chances.map((c,i)=>{const mine=myZones.includes(c.zoneId);return(<div className={"ps-lm-poss"+(mine?" is-mine":"")} key={i}><span className="ps-lm-poss-ic">{c.ic}</span><span className="ps-lm-poss-lab">{c.label}</span>{mine&&<span className="ps-lm-tag">TU ZONA</span>}<span className="ps-lm-poss-pot">+{c.pot}</span></div>);})}
      </div>
      </>)}
    </div>
  );
}

Object.assign(window, { LiveMatch });

// ===== OTHER PAGES =====
function PagePartidos({ onNav }) {
  const [tab,setTab]=React.useState("fixture");
  const [filter,setFilter]=React.useState("todos");
  const [search,setSearch]=React.useState("");
  const groups=["A","B","C","D","E","F","G","H"];
  const filtered=FIXTURE.filter(m=>{
    if(filter==="abiertos"&&m.status!=="ABIERTO") return false;
    if(filter!=="todos"&&filter!=="abiertos"&&m.group!==filter) return false;
    if(search){const s=search.toLowerCase();return COUNTRY_NAME[m.home].toLowerCase().includes(s)||COUNTRY_NAME[m.away].toLowerCase().includes(s)||m.venue.toLowerCase().includes(s);}
    return true;
  });
  const byDate=filtered.reduce((acc,m)=>{(acc[m.date]=acc[m.date]||[]).push(m);return acc;},{});
  return (
    <div className="ps-page">
      <div className="ps-page-head">
        {tab==="fixture"?(
          <div><div className="ps-page-eyebrow">FIXTURE COMPLETO</div><div className="ps-page-title">PARTIDOS DEL MUNDIAL</div><div className="ps-page-sub">104 partidos · 48 selecciones · 16 sedes</div></div>
        ):(
          <div><div className="ps-page-eyebrow">SIMULACIONES</div><div className="ps-page-title">PARTIDOS HISTÓRICOS</div><div className="ps-page-sub">{HISTORIC_MATCHES.length} partidos reales · datos StatsBomb open-data</div></div>
        )}
        {tab==="fixture"&&<div className="ps-page-search"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar selección o estadio…"/></div>}
      </div>
      <div className="ps-tabs">
        <button className={"ps-tab"+(tab==="fixture"?" is-on":"")} onClick={()=>setTab("fixture")}>MUNDIAL 2026</button>
        <button className={"ps-tab"+(tab==="historicos"?" is-on":"")} onClick={()=>setTab("historicos")}>HISTÓRICOS</button>
      </div>
      {tab==="fixture"?(
        <>
          <div className="ps-filter-row">
            <button className={"ps-chip"+(filter==="todos"?" is-on":"")} onClick={()=>setFilter("todos")}>TODOS</button>
            <button className={"ps-chip"+(filter==="abiertos"?" is-on":"")} onClick={()=>setFilter("abiertos")}>RESERVAS ABIERTAS</button>
            <div className="ps-chip-sep">GRUPOS</div>
            {groups.map(g=>(<button key={g} className={"ps-chip ps-chip-mini"+(filter===g?" is-on":"")} onClick={()=>setFilter(g)}>{g}</button>))}
          </div>
          <div className="ps-partidos-grid">
            {Object.entries(byDate).map(([date,list])=>(<div key={date} className="ps-day-block"><div className="ps-day-head"><span className="ps-day-num">{date.split(" ")[0]}</span><span className="ps-day-mon">{date.split(" ")[1]}</span><span className="ps-day-count">{list.length} partidos</span></div><div className="ps-day-list">{list.map(m=><MatchCard key={m.id} m={m} onNav={onNav}/>)}</div></div>))}
          </div>
        </>
      ):(
        <div className="ps-partidos-grid">
          {HISTORIC_CATS.map(cat=>{
            const list=HISTORIC_MATCHES.filter(m=>m.cat===cat);
            if(!list.length) return null;
            return (
              <div key={cat} className="ps-day-block">
                <div className="ps-day-head"><span className="ps-day-num">{cat}</span><span className="ps-day-count">{list.length} {list.length===1?"partido":"partidos"}</span></div>
                <div className="ps-day-list">{list.map(m=><HistoricMatchCard key={m.id} m={m} onPlay={(mm)=>{ window.__KN_HISTORIC_REQUEST=mm.id; onNav("inicio"); }}/>)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function HistoricMatchCard({ m, onPlay }) {
  return (
    <div className="ps-match-card ps-hist-card">
      <div className="ps-mc-top"><div className="ps-mc-group">{m.comp}</div><div className="ps-tag ps-tag-pre">REAL</div></div>
      <div className="ps-mc-teams">
        <div className="ps-mc-team"><div className="ps-mc-flag"><Flag code={m.home} h={30}/></div><div className="ps-mc-name">{COUNTRY_NAME[m.home]}</div></div>
        <div className="ps-mc-score">{m.score}</div>
        <div className="ps-mc-team"><div className="ps-mc-flag"><Flag code={m.away} h={30}/></div><div className="ps-mc-name">{COUNTRY_NAME[m.away]}</div></div>
      </div>
      <button className="ps-btn ps-btn-primary ps-btn-sm ps-hist-play" onClick={()=>onPlay(m)}>▶ JUGAR</button>
    </div>
  );
}

function MatchCard({ m, onNav }) {
  const status=(m.dbStatus==="FINALIZADO"||m.dbStatus==="CANCELADO")?m.dbStatus:fixtureStatus(m);
  const isOpen=status==="ABIERTO"||status==="EN VIVO";
  const isFinal=status==="FINALIZADO";
  const isViewable=isOpen||isFinal;
  return (
    <button className={"ps-match-card"+(isOpen?" is-open":isFinal?" is-past":"")} onClick={()=>{ if(!isViewable)return; window.__KN_MUNDIAL_REQUEST=m.id; onNav("inicio"); }}>
      <div className="ps-mc-top"><div className="ps-mc-group">GRUPO {m.group}</div><div className={"ps-tag "+(isOpen?"ps-tag-open":isFinal?"ps-tag-pre":"ps-tag-next")}>{status}</div></div>
      <div className="ps-mc-teams">
        <div className="ps-mc-team"><div className="ps-mc-flag"><Flag code={m.home} h={30}/></div><div className="ps-mc-name">{COUNTRY_NAME[m.home]}</div></div>
        <div className="ps-mc-vs">{isFinal&&m.score?m.score:"VS"}</div>
        <div className="ps-mc-team"><div className="ps-mc-flag"><Flag code={m.away} h={30}/></div><div className="ps-mc-name">{COUNTRY_NAME[m.away]}</div></div>
      </div>
      <div className="ps-mc-bot"><div className="ps-mc-time">{isFinal&&m.score?"FINAL "+m.score:m.time}</div><div className="ps-mc-venue">{m.venue}</div></div>
      {isOpen&&<div className="ps-mc-cta">RESERVAR ZONAS →</div>}
      {isFinal&&<div className="ps-mc-cta ps-mc-cta-past">VER RESULTADO →</div>}
    </button>
  );
}

function PageReservas({ onNav }) {
  const [tab,setTab]=React.useState("activas");
  const [resData,setResData]=React.useState(null);
  const [openMatches,setOpenMatches]=React.useState(new Set());
  function toggleMatch(mid){ setOpenMatches(s=>{ const n=new Set(s); n.has(mid)?n.delete(mid):n.add(mid); return n; }); }

  // Consulta siempre las reservas del usuario autenticado actual; si la
  // sesión cambia (otro usuario o sign-out), descarta el estado y recarga.
  React.useEffect(()=>{
    const db=window.supabaseClient;
    if(!db){setResData([]);return;}
    let cancelled=false;
    async function load(){
      setResData(null);
      try{
        const{data:{user}}=await db.auth.getUser();
        if(cancelled)return;
        if(!user){setResData([]);return;}
        const{data}=await db.from('reservations')
          .select('match_id,zone_id,price')
          .eq('user_id',user.id)
          .order('match_id');
        if(!cancelled)setResData(data||[]);
      }catch(e){if(!cancelled)setResData([]);}
    }
    load();
    const{data:authSub}=db.auth.onAuthStateChange(()=>{ load(); });
    return ()=>{ cancelled=true; if(authSub&&authSub.subscription)authSub.subscription.unsubscribe(); };
  },[]);

  async function removeZone(mid,zoneId){
    const db=window.supabaseClient;
    if(!db)return;
    try{
      const{data:{user}}=await db.auth.getUser();
      if(!user)return;
      const{error}=await db.from('reservations').delete()
        .eq('user_id',user.id).eq('match_id',mid).eq('zone_id',zoneId);
      if(!error)setResData(prev=>prev.filter(r=>!(r.match_id===mid&&r.zone_id===zoneId)));
    }catch(e){/* sin conexión: la zona sigue visible */}
  }

  if(resData===null) return (
    <div className="ps-page"><div className="ps-empty-state"><div className="ps-empty-t">Cargando reservas…</div></div></div>
  );

  // Activas = reservas de cualquier partido con reservas abiertas o en juego
  // (no solo FIXTURE[0]); el resto son pasadas.
  const isActiveMatch=(mid)=>{ const m=FIXTURE.find(x=>x.id===mid); if(!m)return false; const st=fixtureStatus(m); return st==="ABIERTO"||st==="EN VIVO"; };
  const activeRes=resData.filter(r=>isActiveMatch(r.match_id));
  const past=resData.filter(r=>!isActiveMatch(r.match_id));
  const activeByMatch=activeRes.reduce((acc,r)=>{(acc[r.match_id]=acc[r.match_id]||[]).push(r);return acc;},{});
  const activeIds=Object.keys(activeByMatch).sort((a,b)=>kickoffDate(FIXTURE.find(m=>m.id===a))-kickoffDate(FIXTURE.find(m=>m.id===b)));
  const byMatch=past.reduce((acc,r)=>{(acc[r.match_id]=acc[r.match_id]||[]).push(r);return acc;},{});
  const pastIds=Object.keys(byMatch);
  const openMatch=FIXTURE.find(m=>{const st=fixtureStatus(m);return st==="ABIERTO"||st==="EN VIVO";})||FIXTURE[0];

  return (
    <div className="ps-page">
      <div className="ps-page-head">
        <div><div className="ps-page-eyebrow">TUS JUGADAS DE ZONA</div><div className="ps-page-title">MIS RESERVAS</div><div className="ps-page-sub">Gestiona tus reservas activas y revisa las pasadas.</div></div>
        <div className="ps-page-stats">
          <div className="ps-mini-stat"><div className="ps-mini-stat-l">PARTIDOS ACTIVOS</div><div className="ps-mini-stat-v">{activeIds.length}</div></div>
          <div className="ps-mini-stat"><div className="ps-mini-stat-l">PARTIDOS PASADOS</div><div className="ps-mini-stat-v">{pastIds.length}</div></div>
          <div className="ps-mini-stat"><div className="ps-mini-stat-l">ZONAS TOTALES</div><div className="ps-mini-stat-v">{resData.length}</div></div>
        </div>
      </div>
      <div className="ps-tabs">
        <button className={"ps-tab"+(tab==="activas"?" is-on":"")} onClick={()=>setTab("activas")}>ACTIVAS · {activeIds.length}</button>
        <button className={"ps-tab"+(tab==="pendientes"?" is-on":"")} onClick={()=>setTab("pendientes")}>PENDIENTES · 0</button>
        <button className={"ps-tab"+(tab==="pasadas"?" is-on":"")} onClick={()=>setTab("pasadas")}>PASADAS · {pastIds.length}</button>
      </div>

      {tab==="activas"&&(
        activeRes.length===0
          ?(<div className="ps-empty-state"><div className="ps-empty-icon">🏟️</div><div className="ps-empty-t">Sin zonas reservadas</div><div className="ps-empty-d">Selecciona y confirma zonas en el partido activo.</div><button className="ps-btn ps-btn-primary" onClick={()=>{ window.__KN_MUNDIAL_REQUEST=openMatch.id; onNav("inicio"); }}>IR AL CAMPO</button></div>)
          :activeIds.map(mid=>{
            const match=FIXTURE.find(m=>m.id===mid);
            const zones=activeByMatch[mid];
            const totalCost=zones.reduce((s,r)=>s+(r.price||0),0);
            const isOpen=openMatches.has(mid);
            const diffMs=kickoffDate(match)-Date.now();
            const canEdit=diffMs>RESERVE_CLOSE_MS&&match.dbStatus!=="CANCELADO"&&match.dbStatus!=="FINALIZADO";
            return(
              <div className="ps-res-active" key={mid}>
                <div className="ps-res-banner" style={{cursor:"pointer"}} onClick={()=>toggleMatch(mid)}>
                  <div className="ps-res-banner-l">
                    <div className="ps-res-banner-eb">RESERVA ACTIVA · {mStatus} {isOpen?"▴":"▾"}</div>
                    <div className="ps-res-banner-teams"><span><Flag code={match.home} h={24}/> {COUNTRY_NAME[match.home].toUpperCase()}</span><span className="ps-res-banner-vs">VS</span><span>{COUNTRY_NAME[match.away].toUpperCase()} <Flag code={match.away} h={24}/></span></div>
                    <div className="ps-res-banner-meta">{match.date} · {match.time} · {zones.length} zonas · {totalCost} pts</div>
                  </div>
                  <div className="ps-res-banner-r"><button className="ps-btn ps-btn-dark ps-btn-sm" onClick={(e)=>{ e.stopPropagation(); window.__KN_MUNDIAL_REQUEST=mid; onNav("inicio"); }}>{canEdit?"EDITAR":"VER →"}</button></div>
                </div>
                {isOpen&&<div className="ps-res-zones-grid">
                  {zones.map(r=>{
                    const z=ZONES.find(zz=>zz.id===r.zone_id);
                    if(!z)return null;
                    return(
                      <div className="ps-res-zone-card" key={r.zone_id}>
                        <div className={`ps-rz-band ps-rz-band-${z.tier}`}></div>
                        <div className="ps-rz-body">
                          <div className="ps-rz-name">{z.name}</div>
                          <div className="ps-rz-tier">{z.tier.toUpperCase()} · {z.slots} PLAZAS</div>
                          <div className="ps-rz-pts-row"><div><div className="ps-rz-l">COSTE</div><div className="ps-rz-v">{r.price||z.price} pts</div></div><div><div className="ps-rz-l">POTENCIAL</div><div className="ps-rz-v">{z.tier==="premium"?"Muy alto":z.tier==="high"?"Alto":z.tier==="mid"?"Medio":"Bajo"}</div></div></div>
                          <div className="ps-rz-actions">{ACTIONS.map(a=><span className="ps-rz-action" key={a.name}>{a.icon} +{a.points}</span>)}</div>
                          <button className="ps-rz-remove" onClick={()=>removeZone(mid,r.zone_id)}>✕ QUITAR ZONA</button>
                        </div>
                      </div>
                    );
                  })}
                </div>}
              </div>
            );
          })
      )}

      {tab==="pasadas"&&(
        pastIds.length===0
          ?(<div className="ps-empty-state"><div className="ps-empty-icon">📭</div><div className="ps-empty-t">Sin reservas pasadas</div><div className="ps-empty-d">Aquí aparecerán tus reservas de partidos anteriores.</div></div>)
          :(<div className="ps-past-grid">
              {pastIds.map(mid=>{
                const match=FIXTURE.find(m=>m.id===mid);
                const zones=byMatch[mid];
                const spent=zones.reduce((s,r)=>s+(r.price||0),0);
                const earned=typeof localStorage!=="undefined"?parseInt(localStorage.getItem(`kn_settled_${mid}`)||"0")||0:0;
                return(
                  <div className="ps-pvc" key={mid}>
                    <div className="ps-pvc-head">
                      <span className="ps-pvc-group">{match?`GRUPO ${match.group}`:"—"}</span>
                      <span className="ps-pvc-date">{match?match.date:"—"}</span>
                    </div>
                    <div className="ps-pvc-match">
                      <div className="ps-pvc-team"><Flag code={match?.home} h={22}/><span>{COUNTRY_NAME[match?.home]||"—"}</span></div>
                      <div className="ps-pvc-score">{match?.score||"VS"}</div>
                      <div className="ps-pvc-team ps-pvc-team-r"><span>{COUNTRY_NAME[match?.away]||"—"}</span><Flag code={match?.away} h={22}/></div>
                    </div>
                    <div className="ps-pvc-sep"/>
                    <div className="ps-pvc-zones">
                      {zones.map(r=>{const z=ZONES.find(z=>z.id===r.zone_id);return(<span key={r.zone_id} className="ps-pvc-zone-pill">{z?z.name:r.zone_id}</span>);})}
                    </div>
                    <div className="ps-pvc-sep"/>
                    <div className="ps-pvc-stats">
                      <div className="ps-pvc-stat"><div className="ps-pvc-stat-l">INVERTIDO</div><div className="ps-pvc-stat-v">{spent} <span className="ps-pvc-stat-unit">pts</span></div></div>
                      <div className="ps-pvc-stat"><div className="ps-pvc-stat-l">GANADOS</div><div className={"ps-pvc-stat-v"+(earned>0?" is-win":"")}>{earned>0?"+"+earned:<span style={{color:"#8a7d62"}}>—</span>} {earned>0&&<span className="ps-pvc-stat-unit">pts</span>}</div></div>
                      <div className="ps-pvc-stat"><div className="ps-pvc-stat-l">ZONAS</div><div className="ps-pvc-stat-v">{zones.length}</div></div>
                    </div>
                    <button className="ps-btn ps-btn-dark ps-btn-sm ps-pvc-btn" onClick={()=>{ window.__KN_MUNDIAL_REQUEST=mid; onNav("inicio"); }}>VER PARTIDO →</button>
                  </div>
                );
              })}
            </div>)
      )}

      {tab==="pendientes"&&(<div className="ps-empty-state"><div className="ps-empty-icon">📭</div><div className="ps-empty-t">Sin reservas pendientes</div><div className="ps-empty-d">Cuando inicies una reserva sin confirmar, aparecerá aquí.</div><button className="ps-btn ps-btn-primary" onClick={()=>onNav("partidos")}>VER PARTIDOS</button></div>)}
    </div>
  );
}

function levelFromPts(p){return p>=10000?"Maestro":p>=5000?"Veterano":p>=1000?"Rookie":"Novato";}

function PageRanking() {
  const [rankData,setRankData]=React.useState(null); // null=loading

  React.useEffect(()=>{
    const db=window.supabaseClient;
    if(!db){setRankData({scores:[],myId:null});return;}
    (async()=>{
      const[{data:scores},{data:{user}}]=await Promise.all([
        db.from('scores').select('user_id,name,total_points,matches_played')
          .order('total_points',{ascending:false}).limit(50),
        db.auth.getUser()
      ]);
      setRankData({scores:scores||[],myId:user?.id});
    })();
  },[]);

  if(rankData===null) return (
    <div className="ps-page"><div className="ps-empty-state"><div className="ps-empty-t">Cargando ranking…</div></div></div>
  );

  const {scores,myId}=rankData;
  const medals=["🥇","🥈","🥉"];
  const podiumOrder=[1,0,2]; // 2nd · 1st · 3rd visually
  const podiumHeights=[180,220,150];
  const showPodium=scores.length>=3;

  return (
    <div className="ps-page">
      <div className="ps-page-head">
        <div><div className="ps-page-eyebrow">MUNDIAL 2026 · LEADERBOARD</div><div className="ps-page-title">RANKING GLOBAL</div><div className="ps-page-sub">Jugadores reales ordenados por puntos acumulados.</div></div>
      </div>

      {scores.length===0&&(
        <div className="ps-empty-state">
          <div className="ps-empty-icon">🏆</div>
          <div className="ps-empty-t">Sé el primero en el ranking</div>
          <div className="ps-empty-d">Confirma reservas en un partido para aparecer aquí.</div>
        </div>
      )}

      {showPodium&&(
        <div className="ps-podium">
          {podiumOrder.map((idx,pos)=>{
            const r=scores[idx];if(!r)return null;
            return(
              <div className={"ps-podium-col ps-podium-"+(idx+1)} key={r.user_id}>
                <div className="ps-podium-card">
                  <div className="ps-podium-medal">{medals[idx]}</div>
                  <div className="ps-podium-name">{r.name}</div>
                  <div className="ps-podium-pts">{(r.total_points||0).toLocaleString()}</div>
                  <div className="ps-podium-pts-l">PUNTOS</div>
                </div>
                <div className="ps-podium-step" style={{height:podiumHeights[pos]}}>
                  <span className="ps-podium-step-num">{idx+1}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {scores.length>0&&(
        <div className="ps-rank-table">
          <div className="ps-rank-head"><span>PUESTO</span><span>JUGADOR</span><span>NIVEL</span><span>PARTIDOS</span><span>PUNTOS</span></div>
          {scores.map((r,i)=>{
            const isMe=r.user_id===myId;
            return(
              <div className={"ps-rank-row"+(isMe?" is-me":"")} key={r.user_id}>
                <span className="ps-rr-rank">{i+1}</span>
                <span className="ps-rr-player"><span><div className="ps-rr-name">{r.name}{isMe?" 👤":""}</div></span></span>
                <span className="ps-rr-level">{levelFromPts(r.total_points||0).toUpperCase()}</span>
                <span className="ps-rr-trend">{r.matches_played||0}</span>
                <span className="ps-rr-pts">{(r.total_points||0).toLocaleString()}<span>pts</span></span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PageAmigos() {
  const [email,setEmail]=React.useState("");
  const [copied,setCopied]=React.useState(false);
  const inviteUrl=(typeof window!=="undefined"?window.location.origin:"https://pitch-score.vercel.app")+"/login";

  function sendInvite(e){
    e.preventDefault();
    const subj=encodeURIComponent("Te invito a jugar Kancha — Mundial 2026");
    const body=encodeURIComponent(`¡Hola!\n\nTe invito a jugar Kancha: el juego del Mundial 2026 donde reservas zonas del campo y ganas puntos con cada jugada.\n\nEntra gratis aquí: ${inviteUrl}\n\n¡Hasta el pitido final!`);
    window.open(`mailto:${email}?subject=${subj}&body=${body}`);
    setEmail("");
  }
  function copyLink(){
    navigator.clipboard.writeText(inviteUrl).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2500); }).catch(()=>{});
  }
  return (
    <div className="ps-page">
      <div className="ps-page-head">
        <div><div className="ps-page-eyebrow">TU EQUIPO</div><div className="ps-page-title">AMIGOS</div><div className="ps-page-sub">Invita a tus amigos a jugar el Mundial 2026.</div></div>
      </div>
      <div className="ps-invite-card">
        <div className="ps-invite-icon">👥</div>
        <div className="ps-invite-title">INVITA A TUS AMIGOS</div>
        <div className="ps-invite-desc">Introduce el email de tu amigo y le mandamos una invitación. También puedes copiar el enlace y compartirlo como quieras.</div>
        <form className="ps-invite-form" onSubmit={sendInvite}>
          <input className="ps-invite-input" type="email" placeholder="email@ejemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <button className="ps-btn ps-btn-primary" type="submit">ENVIAR INVITACIÓN</button>
        </form>
        <div className="ps-invite-sep">— o comparte el enlace directo —</div>
        <div className="ps-invite-link-row">
          <span className="ps-invite-link-url">{inviteUrl}</span>
          <button className="ps-btn ps-btn-dark ps-btn-sm" onClick={copyLink}>{copied?"✓ COPIADO":"COPIAR ENLACE"}</button>
        </div>
      </div>
      <div className="ps-empty-state" style={{marginTop:24}}>
        <div className="ps-empty-icon">📭</div>
        <div className="ps-empty-t">Aún no tienes amigos en Kancha</div>
        <div className="ps-empty-d">Cuando tus amigos se registren con tu enlace, aparecerán aquí para comparar puntuaciones.</div>
      </div>
    </div>
  );
}

function PageHistorial() {
  const [resData,setResData]=React.useState(null); // null=loading

  // Igual que en Mis Reservas: usuario autenticado actual, con recarga al
  // cambiar la sesión.
  React.useEffect(()=>{
    const db=window.supabaseClient;
    if(!db){setResData([]);return;}
    let cancelled=false;
    async function load(){
      setResData(null);
      try{
        const{data:{user}}=await db.auth.getUser();
        if(cancelled)return;
        if(!user){setResData([]);return;}
        const{data}=await db.from('reservations')
          .select('match_id,zone_id,price')
          .eq('user_id',user.id)
          .order('match_id');
        if(!cancelled)setResData(data||[]);
      }catch(e){if(!cancelled)setResData([]);}
    }
    load();
    const{data:authSub}=db.auth.onAuthStateChange(()=>{ load(); });
    return ()=>{ cancelled=true; if(authSub&&authSub.subscription)authSub.subscription.unsubscribe(); };
  },[]);

  if(resData===null) return (
    <div className="ps-page"><div className="ps-empty-state"><div className="ps-empty-t">Cargando historial…</div></div></div>
  );

  // Group by match_id
  const byMatch=resData.reduce((acc,r)=>{
    (acc[r.match_id]=acc[r.match_id]||[]).push(r);return acc;
  },{});
  const matchIds=Object.keys(byMatch);
  const totalZones=resData.length;
  const totalSpent=resData.reduce((s,r)=>s+(r.price||0),0);

  return (
    <div className="ps-page">
      <div className="ps-page-head">
        <div><div className="ps-page-eyebrow">TU CAMINO EN EL MUNDIAL</div><div className="ps-page-title">HISTORIAL</div><div className="ps-page-sub">Tus zonas reservadas por partido.</div></div>
        <div className="ps-stats-grid">
          <div className="ps-big-stat"><div className="ps-bs-l">PARTIDOS</div><div className="ps-bs-v">{matchIds.length}</div></div>
          <div className="ps-big-stat"><div className="ps-bs-l">ZONAS TOTALES</div><div className="ps-bs-v">{totalZones}</div></div>
          <div className="ps-big-stat"><div className="ps-bs-l">PUNTOS INVERTIDOS</div><div className="ps-bs-v">{totalSpent.toLocaleString()}</div></div>
        </div>
      </div>

      {matchIds.length===0&&(
        <div className="ps-empty-state">
          <div className="ps-empty-icon">🏟️</div>
          <div className="ps-empty-t">Sin reservas aún</div>
          <div className="ps-empty-d">Confirma tus primeras zonas en el partido activo para verlas aquí.</div>
        </div>
      )}

      {matchIds.length>0&&(
        <div className="ps-hist-timeline">
          <div className="ps-hist-timeline-title">RESERVAS POR PARTIDO</div>
          {matchIds.map((mid,i)=>{
            const match=FIXTURE.find(m=>m.id===mid);
            const zones=byMatch[mid];
            const spent=zones.reduce((s,r)=>s+(r.price||0),0);
            return(
              <div className="ps-timeline-row" key={mid}>
                <div className="ps-tl-dot-col">
                  <div className="ps-tl-dot is-win"></div>
                  {i<matchIds.length-1&&<div className="ps-tl-line"></div>}
                </div>
                <div className="ps-tl-card">
                  <div className="ps-tl-head">
                    <div className="ps-tl-date">{match?match.date:"—"}</div>
                    <div className="ps-tl-match">
                      {match
                        ?<><span><Flag code={match.home} h={18}/> {COUNTRY_NAME[match.home]}</span><span className="ps-tl-score">VS</span><span>{COUNTRY_NAME[match.away]} <Flag code={match.away} h={18}/></span></>
                        :<span>{mid}</span>}
                    </div>
                    <div className="ps-tl-badge is-win">ACTIVA</div>
                  </div>
                  <div className="ps-tl-body">
                    <div className="ps-tl-zones">
                      <div className="ps-tl-zones-l">ZONAS RESERVADAS</div>
                      <div className="ps-tl-zones-list">
                        {zones.map(r=>{
                          const z=ZONES.find(z=>z.id===r.zone_id);
                          return <span className="ps-tl-zone-pill" key={r.zone_id}>{z?z.name:r.zone_id}</span>;
                        })}
                      </div>
                    </div>
                    <div className="ps-tl-result">
                      <div><div className="ps-tl-stat-l">INVERTIDO</div><div className="ps-tl-stat-v">{spent}</div></div>
                      <div><div className="ps-tl-stat-l">ZONAS</div><div className="ps-tl-stat-v">{zones.length}</div></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===== PAGE JORNADA =====
// Distribuye el presupuesto diario entre los partidos ABIERTOS de hoy.
// Guarda en match_allocations (user_id, match_id, allocated_pts).
// ─── Arcade Score Hero ─────────────────────────────────────────────────────
function ArcadeScore({ score, budget }) {
  const [displayed, setDisplayed] = React.useState(score);
  const [flash, setFlash]         = React.useState(false);
  const prevRef = React.useRef(score);

  React.useEffect(() => {
    if (score === prevRef.current) return;
    const diff  = score - prevRef.current;
    const steps = Math.min(Math.abs(diff), 24);
    const step  = diff / steps;
    let cur = prevRef.current;
    let i   = 0;
    setFlash(true);
    const iv = setInterval(() => {
      i++; cur += step;
      setDisplayed(Math.round(cur));
      if (i >= steps) { setDisplayed(score); clearInterval(iv); setTimeout(()=>setFlash(false),700); }
    }, 35);
    prevRef.current = score;
    return () => clearInterval(iv);
  }, [score]);

  return (
    <div style={{
      background:"var(--sidebar-bg)", border:"2px solid var(--gold)",
      borderRadius:"4px", padding:"14px 18px", marginBottom:"14px", position:"relative", overflow:"hidden",
    }}>
      <div style={{position:"absolute",inset:0,
        backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 9px,rgba(255,255,255,0.018) 9px,rgba(255,255,255,0.018) 10px),repeating-linear-gradient(90deg,transparent,transparent 9px,rgba(255,255,255,0.018) 9px,rgba(255,255,255,0.018) 10px)",
        pointerEvents:"none"}}/>
      <div style={{fontSize:"9px",letterSpacing:"3px",color:"var(--gold)",opacity:.65,marginBottom:"4px"}}>▶ MARCADOR KANCHA</div>
      <div style={{
        fontSize:"52px", fontWeight:700, letterSpacing:"2px", lineHeight:1,
        color: flash ? "#fff" : "var(--gold-light)",
        textShadow: flash ? "0 0 24px var(--gold-light),0 0 6px var(--gold)" : "none",
        transition:"color .08s, text-shadow .08s",
      }}>
        {displayed.toLocaleString('es-ES')}
        <span style={{fontSize:"16px",marginLeft:"8px",color:"var(--gold)",opacity:.8,letterSpacing:"1px"}}>PTS</span>
      </div>
      <div style={{fontSize:"11px",color:"var(--sidebar-text)",marginTop:"6px",letterSpacing:".5px"}}>
        Cartera disponible: <strong style={{color:"var(--gold)"}}>{budget.toLocaleString('es-ES')} pts</strong>
      </div>
    </div>
  );
}

// ─── Replay de un partido pasado ───────────────────────────────────────────
function MatchReplay({ match, onBack }) {
  const [events,   setEvents]  = React.useState([]);
  const [myZones,  setMyZones] = React.useState(new Set());
  const [earned,   setEarned]  = React.useState(0);
  const [loading,  setLoading] = React.useState(true);

  React.useEffect(() => {
    const db = window.supabaseClient;
    if (!db) { setLoading(false); return; }
    async function load() {
      try {
        const { data:{ user } } = await db.auth.getUser();
        if (!user) { setLoading(false); return; }
        const [{ data:evs }, { data:res }] = await Promise.all([
          db.from('agent_events').select('*').eq('match_id', match.id).order('minute', { ascending:true }),
          db.from('reservations').select('zone_id').eq('match_id', match.id).eq('user_id', user.id),
        ]);
        const zSet = new Set((res||[]).map(r => r.zone_id));
        setMyZones(zSet);
        setEvents(evs||[]);
        setEarned((evs||[]).filter(e=>zSet.has(e.zone_id)).reduce((s,e)=>s+(e.pts_value||0),0));
      } catch(e) {}
      setLoading(false);
    }
    load();
  }, [match.id]);

  const hits = events.filter(e => myZones.has(e.zone_id));

  return (
    <div className="ps-page">
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"11px",letterSpacing:"2px",color:"var(--ink-muted)",marginBottom:"14px",padding:"4px 0",background:"none",border:"none",cursor:"pointer"}}>
        ← VOLVER
      </button>

      {/* cabecera partido */}
      <div style={{background:"var(--sidebar-bg)",border:"2px solid var(--gold)",borderRadius:"4px",padding:"14px 16px",marginBottom:"14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <Flag code={match.home} h={20}/>
            <span style={{fontSize:"16px",fontWeight:700,color:"#fff"}}>{match.home}</span>
            <span style={{fontSize:"20px",fontWeight:700,color:"var(--gold)",margin:"0 4px"}}>{match.score||"?"}</span>
            <span style={{fontSize:"16px",fontWeight:700,color:"#fff"}}>{match.away}</span>
            <Flag code={match.away} h={20}/>
          </div>
          <span style={{fontSize:"9px",letterSpacing:"2px",color:"var(--gold)",background:"rgba(212,168,71,0.15)",padding:"3px 8px",borderRadius:"2px"}}>FINALIZADO</span>
        </div>
        {myZones.size > 0 && (
          <div style={{display:"flex",gap:"20px",marginTop:"12px",paddingTop:"10px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
            {[["PTS GANADOS",earned,"var(--gold-light)"],["ACIERTOS",hits.length,"#5ab870"],["MIS ZONAS",myZones.size,"var(--sidebar-text)"]].map(([label,val,col])=>(
              <div key={label} style={{textAlign:"center"}}>
                <div style={{fontSize:"24px",fontWeight:700,color:col,lineHeight:1}}>{val}</div>
                <div style={{fontSize:"8px",letterSpacing:"2px",color:"var(--sidebar-muted)",marginTop:"2px"}}>{label}</div>
              </div>
            ))}
          </div>
        )}
        {myZones.size === 0 && !loading && (
          <div style={{fontSize:"11px",color:"var(--sidebar-muted)",marginTop:"8px"}}>No tenías zonas reservadas en este partido.</div>
        )}
      </div>

      {loading ? (
        <div className="ps-empty-state"><div className="ps-empty-t">Cargando replay…</div></div>
      ) : events.length === 0 ? (
        <div className="ps-empty-state">
          <div className="ps-empty-icon">📭</div>
          <div className="ps-empty-t">Sin eventos registrados</div>
          <div className="ps-empty-d">Este partido no tiene datos de juego guardados aún.</div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
          {events.map((ev,i) => {
            const hit = myZones.has(ev.zone_id);
            return (
              <div key={ev.id||i} style={{
                display:"flex", alignItems:"center", gap:"10px",
                padding:"9px 12px",
                background: hit ? "rgba(90,184,112,0.10)" : "var(--cream-mid)",
                border: hit ? "1px solid rgba(90,184,112,0.35)" : "1px solid var(--cream-dark)",
                borderRadius:"3px",
              }}>
                <span style={{fontSize:"10px",fontWeight:700,color:"var(--ink-muted)",minWidth:"26px",flexShrink:0}}>{ev.minute}'</span>
                <span style={{fontSize:"18px",minWidth:"22px",flexShrink:0}}>{ev.icon||'⚽'}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:"12px",fontWeight:700,color:"var(--ink)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.label}</div>
                  <div style={{fontSize:"10px",color:"var(--ink-muted)",marginTop:"1px",fontFamily:"monospace"}}>{ev.zone_id}</div>
                </div>
                {hit ? (
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:"13px",fontWeight:700,color:"#5ab870"}}>+{ev.pts_value} pts</div>
                    <div style={{fontSize:"8px",letterSpacing:"1.5px",color:"#5ab870",marginTop:"1px"}}>ACIERTO ✓</div>
                  </div>
                ) : (
                  <div style={{fontSize:"11px",color:"var(--ink-light)",flexShrink:0}}>—</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Historial de partidos pasados ─────────────────────────────────────────
function JornadaHistorial({ onReplay }) {
  const past = FIXTURE.filter(m => m.dbStatus === 'FINALIZADO');

  if (past.length === 0) return (
    <div className="ps-empty-state" style={{marginTop:"16px"}}>
      <div className="ps-empty-icon">🏟️</div>
      <div className="ps-empty-t">Sin partidos finalizados aún</div>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"8px",marginTop:"4px"}}>
      {past.map(m => (
        <div key={m.id} style={{
          display:"flex", alignItems:"center", gap:"12px",
          padding:"12px 14px",
          background:"var(--cream-mid)", border:"1px solid var(--cream-dark)",
          borderRadius:"4px", cursor:"pointer",
        }} onClick={() => onReplay(m)}>
          <Flag code={m.home} h={20}/>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:"13px",fontWeight:700,color:"var(--ink)"}}>
              {COUNTRY_NAME[m.home]||m.home} <span style={{color:"var(--red)",fontWeight:700}}>{m.score||"?"}</span> {COUNTRY_NAME[m.away]||m.away}
            </div>
            <div style={{fontSize:"10px",color:"var(--ink-muted)",marginTop:"2px"}}>{m.venue||m.group}</div>
          </div>
          <Flag code={m.away} h={20}/>
          <span style={{fontSize:"10px",letterSpacing:"1.5px",color:"var(--gold)",background:"rgba(212,168,71,0.15)",padding:"3px 8px",borderRadius:"2px",flexShrink:0}}>VER REPLAY →</span>
        </div>
      ))}
    </div>
  );
}

// ─── Jornada principal ─────────────────────────────────────────────────────
function PageJornada({ onNav, score, onScoreUpdate }) {
  const [tab,        setTab]    = React.useState("hoy");
  const [replay,     setReplay] = React.useState(null);
  const [allocs,     setAllocs] = React.useState({});
  const [savedAllocs,setSaved]  = React.useState({});
  const [budget,     setBudget] = React.useState(ME.budget);
  const budgetRef = React.useRef(ME.budget);
  React.useEffect(() => { budgetRef.current = budget; }, [budget]);
  const [totalPts,   setTotalPts]= React.useState(ME.totalPoints);
  const [saving,     setSaving]     = React.useState(false);
  const [saveOk,     setSaveOk]     = React.useState(false);
  const [cardSave,   setCardSave]   = React.useState({}); // {mid: "idle"|"saving"|"ok"|"err"}
  const [err,        setErr]        = React.useState(null);
  const [loading,    setLoading]= React.useState(true);

  const todayMatches = FIXTURE.filter(m => {
    const diff = kickoffDate(m) - Date.now();
    return fixtureStatus(m) === "ABIERTO" && diff > RESERVE_CLOSE_MS;
  });

  React.useEffect(() => {
    const db = window.supabaseClient;
    if (!db) { setLoading(false); return; }
    let cancelled = false;
    async function load() {
      try {
        const { data:{ user } } = await db.auth.getUser();
        if (cancelled || !user) { setLoading(false); return; }
        const { data:scoreRow } = await db.from('scores').select('budget,total_points').eq('user_id', user.id).maybeSingle();
        if (!cancelled && scoreRow) {
          if (scoreRow.budget != null)       { ME.budget = scoreRow.budget; setBudget(scoreRow.budget); }
          if (scoreRow.total_points != null) { ME.totalPoints = scoreRow.total_points; setTotalPts(scoreRow.total_points); }
        }
        if (todayMatches.length > 0) {
          const ids = todayMatches.map(m => m.id);
          const { data } = await db.from('match_allocations').select('match_id,allocated_pts').eq('user_id', user.id).in('match_id', ids);
          if (!cancelled && data) {
            const map = {};
            data.forEach(r => { map[r.match_id] = r.allocated_pts; });
            setSaved(map);
            setAllocs(Object.fromEntries(ids.map(id => [id, map[id] != null ? String(map[id]) : ""])));
          } else if (!cancelled) {
            setAllocs(Object.fromEntries(todayMatches.map(m => [m.id, ""])));
          }
        }
      } catch(e) { /* sin conexión */ }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const totalAlloc = todayMatches.reduce((s, m) => s + (parseInt(allocs[m.id] || 0) || 0), 0);
  const remaining  = budget - totalAlloc;
  const isValid    = remaining >= 0;

  function handleChange(mid, val) {
    setAllocs(prev => ({ ...prev, [mid]: val.replace(/[^0-9]/g, "") }));
    setSaveOk(false); setErr(null);
  }
  function step(mid, delta) {
    setAllocs(prev => {
      const cur = parseInt(prev[mid] || 0) || 0;
      return { ...prev, [mid]: String(Math.max(0, Math.min(budget, cur + delta))) };
    });
    setSaveOk(false);
  }
  function autoSplit() {
    if (!todayMatches.length) return;
    const per = Math.floor(budget / todayMatches.length);
    const map = {};
    todayMatches.forEach((m, i) => {
      map[m.id] = i === todayMatches.length - 1 ? String(budget - per * (todayMatches.length - 1)) : String(per);
    });
    setAllocs(map); setSaveOk(false);
  }
  async function saveMatch(mid, pts) {
    const db = window.supabaseClient;
    if (!db) return false;
    setCardSave(p => ({ ...p, [mid]: "saving" }));
    try {
      const { data:{ user } } = await db.auth.getUser();
      if (!user) { setCardSave(p => ({ ...p, [mid]: "err" })); return false; }
      const { error } = await db.from('match_allocations').upsert(
        [{ user_id: user.id, match_id: mid, allocated_pts: pts }],
        { onConflict: 'user_id,match_id' }
      );
      if (error) { setCardSave(p => ({ ...p, [mid]: "err" })); return false; }
      setSaved(p => {
        const next = { ...p, [mid]: pts };
        // Recalcular budget restante y notificar al sidebar
        const totalSaved = Object.values(next).reduce((s, v) => s + (v || 0), 0);
        const newBudget = budgetRef.current - totalSaved;
        if (onScoreUpdate) onScoreUpdate(prev => ({ ...prev, budget: newBudget }));
        return next;
      });
      setCardSave(p => ({ ...p, [mid]: "ok" }));
      setTimeout(() => setCardSave(p => ({ ...p, [mid]: "idle" })), 2000);
      return true;
    } catch(e) { setCardSave(p => ({ ...p, [mid]: "err" })); return false; }
  }
  async function save() {
    if (!isValid || saving) return;
    setSaving(true); setErr(null);
    try {
      await Promise.all(todayMatches.map(m => saveMatch(m.id, parseInt(allocs[m.id]||0)||0)));
      setSaveOk(true);
    } catch(e) { setErr(String(e)); }
    setSaving(false);
  }

  if (loading) return <div className="ps-page"><div className="ps-empty-state"><div className="ps-empty-t">Cargando…</div></div></div>;
  if (replay)  return <MatchReplay match={replay} onBack={() => setReplay(null)} />;

  const displayTotal = (score && score.total_points != null) ? score.total_points : totalPts;
  const allocPct = budget > 0 ? Math.min(100, Math.round(totalAlloc / budget * 100)) : 0;

  return (
    <div className="ps-page">

      {/* ── WALLET HERO ── */}
      <div className="ps-jk-hero">
        <div className="ps-jk-hero-grid">
          <div className="ps-jk-hero-block">
            <div className="ps-jk-hero-label">MARCADOR</div>
            <div className="ps-jk-hero-big">{displayTotal.toLocaleString('es-ES')}<span className="ps-jk-hero-unit">pts</span></div>
          </div>
          <div className="ps-jk-hero-sep"/>
          <div className="ps-jk-hero-block">
            <div className="ps-jk-hero-label">CARTERA</div>
            <div className="ps-jk-hero-big">{budget.toLocaleString('es-ES')}<span className="ps-jk-hero-unit">pts</span></div>
          </div>
          <div className="ps-jk-hero-sep"/>
          <div className="ps-jk-hero-block">
            <div className="ps-jk-hero-label">ASIGNADO</div>
            <div className={"ps-jk-hero-big"+(totalAlloc>0?" ps-jk-hero-alloc":"ps-jk-hero-zero")} style={!isValid?{color:"#d9534f"}:{}}>
              {totalAlloc > 0 ? totalAlloc.toLocaleString('es-ES') : "—"}<span className="ps-jk-hero-unit">{totalAlloc>0?"pts":""}</span>
            </div>
          </div>
        </div>
        {totalAlloc > 0 && (
          <div className="ps-jk-hero-bar-wrap">
            <div className="ps-jk-hero-bar">
              <div className="ps-jk-hero-bar-fill" style={{width:`${allocPct}%`, background: !isValid?"#d9534f":"#4e8c3a"}}/>
            </div>
            <span className="ps-jk-hero-bar-pct" style={!isValid?{color:"#d9534f"}:{}}>{allocPct}% comprometido</span>
          </div>
        )}
      </div>

      {/* ── TABS ── */}
      <div className="ps-jk-tabs">
        <button className={"ps-jk-tab"+(tab==="hoy"?" is-on":"")} onClick={()=>setTab("hoy")}>HOY</button>
        <button className={"ps-jk-tab"+(tab==="historial"?" is-on":"")} onClick={()=>setTab("historial")}>HISTORIAL</button>
      </div>

      {tab==="historial" && <JornadaHistorial onReplay={setReplay}/>}

      {tab==="hoy" && (todayMatches.length === 0 ? (
        <div className="ps-empty-state" style={{marginTop:"8px"}}>
          <div className="ps-empty-icon">🗓️</div>
          <div className="ps-empty-t">Sin partidos abiertos hoy</div>
          <div className="ps-empty-d">Las reservas abren 24h antes del partido.</div>
          <button className="ps-btn ps-btn-primary" style={{marginTop:"10px"}} onClick={()=>onNav("partidos")}>VER FIXTURE</button>
        </div>
      ) : (
        <>
          {/* Acciones rápidas */}
          <div className="ps-jk-quick">
            <button className="ps-btn ps-btn-dark ps-btn-sm" onClick={autoSplit}>⚡ REPARTIR IGUAL</button>
            <button className="ps-btn ps-btn-ghost ps-btn-sm" onClick={()=>{ setAllocs(Object.fromEntries(todayMatches.map(m=>[m.id,""]))); setSaveOk(false); }}>✕ LIMPIAR</button>
          </div>

          {/* Tarjetas de partidos */}
          <div className="ps-jk-cards">
            {todayMatches.map(m => {
              const val      = allocs[m.id] || "";
              const pts      = parseInt(val || 0) || 0;
              const isSaved  = savedAllocs[m.id] != null;
              const diffMs   = kickoffDate(m) - Date.now();
              const minsLeft = Math.max(0, Math.round((diffMs - RESERVE_CLOSE_MS) / 60000));
              const timeLabel= minsLeft > 90 ? `${Math.floor(minsLeft/60)}h ${minsLeft%60}m` : minsLeft > 0 ? `${minsLeft} min` : "CIERRA PRONTO";
              const pct      = budget > 0 ? Math.round(pts / budget * 100) : 0;
              const potencial= pts > 0 ? Math.round(pts * 0.8) : null;
              return (
                <div key={m.id} className="ps-jk-card">
                  {/* Cabecera oscura */}
                  <div className="ps-jk-card-top">
                    <div className="ps-jk-card-eyebrow">
                      <span>GRUPO {m.group} · {m.date}</span>
                      <span className={"ps-jk-countdown"+(minsLeft<=15?" is-urgent":"")}>{timeLabel}</span>
                    </div>
                    <div className="ps-jk-card-teams">
                      <div className="ps-jk-card-team">
                        <Flag code={m.home} h={32}/>
                        <span>{(COUNTRY_NAME[m.home]||m.home).toUpperCase()}</span>
                      </div>
                      <div className="ps-jk-card-vs">VS</div>
                      <div className="ps-jk-card-team ps-jk-card-team-r">
                        <Flag code={m.away} h={32}/>
                        <span>{(COUNTRY_NAME[m.away]||m.away).toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="ps-jk-card-venue">{m.venue}</div>
                    {isSaved && <div className="ps-jk-saved">✓ {savedAllocs[m.id]} pts guardados</div>}
                  </div>
                  {/* Cuerpo claro — inversión */}
                  <div className="ps-jk-card-bot">
                    <div className="ps-jk-stake-label">PUNTOS A INVERTIR EN ESTE PARTIDO</div>
                    <div className="ps-jk-stepper">
                      <button className="ps-jk-step" onClick={()=>step(m.id,-50)} disabled={pts<=0}>−</button>
                      <div className="ps-jk-step-mid">
                        <input type="number" min="0" max={budget} value={val}
                          onChange={e=>handleChange(m.id,e.target.value)}
                          placeholder="0" className="ps-jk-input"/>
                        <span className="ps-jk-step-unit">pts</span>
                      </div>
                      <button className="ps-jk-step" onClick={()=>step(m.id,50)}>+</button>
                    </div>
                    {pts>0&&budget>0&&(
                      <div className="ps-jk-bar-row">
                        <div className="ps-jk-bar"><div className="ps-jk-bar-fill" style={{width:`${Math.min(100,pct)}%`}}/></div>
                        <span className="ps-jk-bar-pct">{pct}% de cartera</span>
                      </div>
                    )}
                    {pts>0&&(
                      <div className="ps-jk-potential">
                        POTENCIAL SI ACIERTAS ZONAS <span>+{potencial} pts</span>
                      </div>
                    )}
                    <div className="ps-jk-card-actions">
                      {(()=>{
                        const cs=cardSave[m.id]||"idle";
                        return(
                          <button className="ps-jk-save-btn" disabled={cs==="saving"||pts===0}
                            onClick={()=>saveMatch(m.id,pts)}>
                            {cs==="saving"?"…":cs==="ok"?"✓ GUARDADO":cs==="err"?"ERROR — REINTENTAR":"GUARDAR JUGADA"}
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                  <button className="ps-jk-go" onClick={async()=>{ await saveMatch(m.id,pts); window.__KN_MUNDIAL_REQUEST=m.id; window.__KN_ALLOC_PTS=pts>0?{matchId:m.id,pts}:null; onNav("inicio"); }}>
                    ESCOGER ZONAS →
                  </button>
                </div>
              );
            })}
          </div>

          {!isValid&&<div className="ps-jk-error">⚠ Total ({totalAlloc} pts) supera tu cartera ({budget} pts)</div>}
          {err&&<div className="ps-jk-error">{err}</div>}
        </>
      ))}
    </div>
  );
}

Object.assign(window, { PagePartidos, PageReservas, PageRanking, PageAmigos, PageHistorial, PageJornada });

// ===== APP =====
function App() {
  const [page,setPage]=React.useState("inicio");
  const [showHow,setShowHow]=React.useState(false);
  const [navOpen,setNavOpen]=React.useState(false);
  const [fixtureReady,setFixtureReady]=React.useState(false);
  // Marcador global: se carga una vez y se actualiza cuando PageInicio gana puntos
  const [globalScore,setGlobalScore]=React.useState({budget:ME.budget,total_points:ME.totalPoints});
  React.useEffect(()=>{ let on=true; loadFixture().finally(()=>{ if(on) setFixtureReady(true); }); return ()=>{ on=false; }; },[]);
  React.useEffect(()=>{
    const db=window.supabaseClient; if(!db) return;
    db.auth.getUser().then(({data:{user}})=>{
      if(!user) return;
      db.from('scores').select('budget,total_points').eq('user_id',user.id).maybeSingle()
        .then(({data})=>{ if(data){ ME.budget=data.budget??ME.budget; ME.totalPoints=data.total_points??ME.totalPoints; setGlobalScore({budget:data.budget??ME.budget,total_points:data.total_points??ME.totalPoints}); } });
    });
  },[]);
  React.useEffect(()=>{const hash=window.location.hash.replace("#","");if(hash&&["inicio","jornada","partidos","reservas","ranking","amigos","historial"].includes(hash))setPage(hash);},[]);
  function nav(p){setPage(p);setNavOpen(false);window.location.hash=p;window.scrollTo({top:0,behavior:"smooth"});}
  const pageTitles={inicio:{eb:"MUNDIAL 2026",title:"INICIO"},jornada:{eb:"HOY",title:"JORNADA"},partidos:{eb:"FIXTURE",title:"PARTIDOS"},reservas:{eb:"TUS JUGADAS",title:"MIS RESERVAS"},ranking:{eb:"LEADERBOARD",title:"RANKING"},amigos:{eb:"TU EQUIPO",title:"AMIGOS"},historial:{eb:"TU CAMINO",title:"HISTORIAL"}};
  const pt=pageTitles[page]||pageTitles.inicio;
  if(!fixtureReady) return <FixtureSkeleton/>;
  return (
    <div className="ps-app">
      <button className="ps-menu-btn" onClick={()=>setNavOpen(o=>!o)} aria-label="Menú">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none">
          {navOpen?<path d="M6 6l12 12M18 6L6 18"/>:<path d="M4 7h16M4 12h16M4 17h16"/>}
        </svg>
      </button>
      {navOpen&&<div className="ps-nav-backdrop" onClick={()=>setNavOpen(false)}></div>}
      <Sidebar page={page} onNav={nav} open={navOpen} score={globalScore}/>
      <div className="ps-content" data-screen-label={page}>
        <PageTopbar eyebrow={pt.eb} title={pt.title} onHelp={()=>setShowHow(true)} score={globalScore}/>
        <div className="ps-content-body">
          {page==="inicio"&&<PageInicio onNav={nav} onScoreUpdate={setGlobalScore}/>}
          {page==="jornada"&&<PageJornada onNav={nav} score={globalScore} onScoreUpdate={setGlobalScore}/>}
          {page==="partidos"&&<PagePartidos onNav={nav}/>}
          {page==="reservas"&&<PageReservas onNav={nav}/>}
          {page==="ranking"&&<PageRanking/>}
          {page==="amigos"&&<PageAmigos/>}
          {page==="historial"&&<PageHistorial/>}
        </div>
        <AppFooter/>
      </div>
      {showHow&&<HowModal onClose={()=>setShowHow(false)}/>}
    </div>
  );
}

// Skeleton a pantalla completa mientras el fixture llega de Supabase
function FixtureSkeleton() {
  return (
    <div className="ps-skel">
      <KanchaWordmark className="ps-skel-logo"/>
      <div className="ps-skel-bars"><span></span><span></span><span></span></div>
      <div className="ps-skel-label">CARGANDO FIXTURE…</div>
    </div>
  );
}

// Footer mínimo, consistente con el de la landing
function AppFooter() {
  return (
    <footer className="ps-footer">
      <div className="ps-footer-l">
        <KanchaWordmark className="ps-footer-logo"/>
        <span className="ps-footer-claim">Antes de que pase<span className="kn-dot">.</span></span>
      </div>
      <span className="ps-footer-copy">© 2026 KANCHA · FÚTBOL EN JUEGO</span>
    </footer>
  );
}

function HowModal({ onClose }) {
  React.useEffect(()=>{const onKey=e=>{if(e.key==="Escape")onClose();};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey);},[onClose]);
  return (
    <div className="ps-modal-overlay" onClick={onClose}>
      <div className="ps-modal" onClick={e=>e.stopPropagation()}>
        <button className="ps-modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <HowItWorks/>
      </div>
    </div>
  );
}

function PageTopbar({ eyebrow, title, onHelp, score }) {
  const pts = score&&score.budget!=null ? score.budget : ME.budget;
  return (
    <div className="ps-topbar-row">
      <div className="ps-topbar-l"><span className="ps-topbar-eb">{eyebrow}</span><span className="ps-topbar-divider">/</span><span className="ps-topbar-title">{title}</span></div>
      <div className="ps-topbar-r">
        <button className="ps-help" onClick={onHelp}>¿CÓMO JUGAR?</button>
        <div className="ps-score-chip" title="Puntos disponibles">
          <span className="ps-score-chip-icon">💰</span>
          <span className="ps-score-chip-pts">{pts.toLocaleString('es-ES')}</span>
          <span className="ps-score-chip-label">pts</span>
        </div>
        <div className="ps-avatar">
          <div className="ps-avatar-img"><svg viewBox="0 0 40 40" width="40" height="40"><circle cx="20" cy="20" r="20" fill="#3a5732"/><circle cx="20" cy="16" r="6" fill="#e8dcc0"/><path d="M6,40 Q6,28 20,28 Q34,28 34,40 Z" fill="#e8dcc0"/></svg></div>
          <div className="ps-avatar-meta"><div className="ps-avatar-name">{ME.name}</div><div className="ps-avatar-level">{ME.level}</div></div>
          <span className="ps-avatar-chev">▾</span>
        </div>
      </div>
    </div>
  );
}

if (!window.__SKIP_APP_RENDER) {
  ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
}
