const zones = [
  {
    id: "goal",
    name: "Porteria",
    entryCost: 120,
    weight: 10,
    eventScores: { goal: 30, save: 18, shotOnTarget: 10 },
    note: "Zona premium: goles, paradas y tiros claros generan mucho valor."
  },
  {
    id: "small-box",
    name: "Area pequena",
    entryCost: 95,
    weight: 8,
    eventScores: { touchInBox: 12, rebound: 15, finish: 20 },
    note: "Muy caliente para remates, rechaces y segundas jugadas."
  },
  {
    id: "penalty-spot",
    name: "Punto de penalti",
    entryCost: 140,
    weight: 12,
    eventScores: { penalty: 35, finish: 24, foulWon: 14 },
    note: "La pieza mas valiosa del sistema inicial."
  },
  {
    id: "penalty-arc",
    name: "Circulo del area",
    entryCost: 80,
    weight: 7,
    eventScores: { longShot: 16, foul: 10, recovery: 8 },
    note: "Ideal para disparos frontales y faltas peligrosas."
  },
  {
    id: "half-space-left",
    name: "Zona amplia 1",
    entryCost: 60,
    weight: 5,
    eventScores: { progressiveCarry: 9, cross: 12, duelWon: 7 },
    note: "Carriles amplios donde nacen centros y conducciones."
  },
  {
    id: "center-circle",
    name: "Circulo central",
    entryCost: 40,
    weight: 3,
    eventScores: { kickoff: 5, recovery: 7, throughBall: 10 },
    note: "Menor coste, pero puede sumar por recuperaciones e inicio de juego."
  },
  {
    id: "half-space-right",
    name: "Zona amplia 2",
    entryCost: 60,
    weight: 5,
    eventScores: { progressiveCarry: 9, cross: 12, duelWon: 7 },
    note: "Simetrica a la anterior para abrir juego y atacar."
  },
  {
    id: "box",
    name: "Area",
    entryCost: 100,
    weight: 9,
    eventScores: { finish: 18, tackle: 11, touchInBox: 10 },
    note: "Zona de alto impacto para remates y acciones defensivas."
  },
  {
    id: "corner-left",
    name: "Corner izq",
    entryCost: 75,
    weight: 6,
    eventScores: { cornerKick: 16, cross: 11, assistChance: 14 },
    note: "Corners y centros con buena recompensa."
  },
  {
    id: "corner-right",
    name: "Corner der",
    entryCost: 75,
    weight: 6,
    eventScores: { cornerKick: 16, cross: 11, assistChance: 14 },
    note: "Mismo valor que el lado izquierdo."
  }
];

const eventCatalog = {
  goal: "Gol",
  save: "Parada",
  shotOnTarget: "Tiro a puerta",
  touchInBox: "Toque en area",
  rebound: "Rechace",
  finish: "Remate",
  penalty: "Penalti",
  foulWon: "Falta recibida",
  longShot: "Disparo lejano",
  foul: "Falta",
  recovery: "Recuperacion",
  progressiveCarry: "Conduccion",
  cross: "Centro",
  duelWon: "Duelo ganado",
  kickoff: "Saque inicial",
  throughBall: "Pase filtrado",
  tackle: "Entrada",
  cornerKick: "Saque de esquina",
  assistChance: "Ocasion creada"
};

const state = {
  selectedZoneId: null,
  reservations: {},
  events: []
};

const pitchGrid = document.querySelector("#pitch-grid");
const zoneDetail = document.querySelector("#zone-detail");
const selectedZoneInput = document.querySelector("#selected-zone");
const ownerNameInput = document.querySelector("#owner-name");
const eventZoneSelect = document.querySelector("#event-zone");
const eventTypeSelect = document.querySelector("#event-type");
const eventMinuteInput = document.querySelector("#event-minute");
const eventsList = document.querySelector("#events-list");
const scoreboard = document.querySelector("#scoreboard");

function formatEventScoreEntries(zone) {
  return Object.entries(zone.eventScores)
    .map(([eventType, score]) => `<span class="tag">${eventCatalog[eventType]}: +${score}</span>`)
    .join("");
}

function renderPitch() {
  pitchGrid.innerHTML = "";

  zones.forEach((zone) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pitch-zone";
    if (zone.id === state.selectedZoneId) button.classList.add("selected");
    if (state.reservations[zone.id]) button.classList.add("owned");

    const owner = state.reservations[zone.id];
    button.innerHTML = `
      <strong>${zone.name}</strong>
      <span>${zone.entryCost} creditos</span>
      <span>Peso ${zone.weight}/12</span>
      <small>${owner ? `Reservada por ${owner}` : "Libre para reservar"}</small>
    `;

    button.addEventListener("click", () => {
      state.selectedZoneId = zone.id;
      selectedZoneInput.value = zone.name;
      renderPitch();
      renderZoneDetail();
    });

    pitchGrid.appendChild(button);
  });
}

function renderZoneDetail() {
  if (!state.selectedZoneId) {
    zoneDetail.innerHTML = `
      <h3>Selecciona una zona</h3>
      <p>Veras aqui su valor de reserva, eventos puntuables y estado actual.</p>
    `;
    return;
  }

  const zone = zones.find(({ id }) => id === state.selectedZoneId);
  const owner = state.reservations[zone.id];

  zoneDetail.innerHTML = `
    <h3>${zone.name}</h3>
    <p>${zone.note}</p>
    <div class="detail-tags">
      <span><strong>Valor de entrada:</strong> ${zone.entryCost} creditos</span>
      <span><strong>Reserva actual:</strong> ${owner ?? "Sin propietario"}</span>
      <span><strong>Intensidad:</strong> ${zone.weight}/12</span>
    </div>
    <div class="tag-list">${formatEventScoreEntries(zone)}</div>
  `;
}

function populateEventSelectors() {
  eventZoneSelect.innerHTML = zones
    .map((zone) => `<option value="${zone.id}">${zone.name}</option>`)
    .join("");

  const allEventTypes = [...new Set(zones.flatMap((zone) => Object.keys(zone.eventScores)))];
  eventTypeSelect.innerHTML = allEventTypes
    .map((eventType) => `<option value="${eventType}">${eventCatalog[eventType]}</option>`)
    .join("");
}

function computeScores() {
  const scores = {};

  for (const zone of zones) {
    const owner = state.reservations[zone.id];
    if (!owner) continue;

    if (!scores[owner]) {
      scores[owner] = { owner, points: 0, reservedZones: 0, investment: 0, hits: 0 };
    }

    scores[owner].reservedZones += 1;
    scores[owner].investment += zone.entryCost;
    scores[owner].points -= Math.round(zone.entryCost / 10);
  }

  for (const event of state.events) {
    const zone = zones.find(({ id }) => id === event.zoneId);
    const owner = state.reservations[event.zoneId];
    if (!zone || !owner) continue;

    const score = zone.eventScores[event.eventType] ?? 0;
    if (!scores[owner]) continue;

    scores[owner].points += score;
    scores[owner].hits += 1;
  }

  return Object.values(scores).sort((a, b) => b.points - a.points);
}

function renderEvents() {
  if (!state.events.length) {
    eventsList.className = "events-list empty-state";
    eventsList.textContent = "Todavia no hay acciones registradas.";
    return;
  }

  eventsList.className = "events-list";
  eventsList.innerHTML = state.events
    .map((event) => {
      const zone = zones.find(({ id }) => id === event.zoneId);
      const owner = state.reservations[event.zoneId] ?? "sin propietario";
      const score = zone.eventScores[event.eventType] ?? 0;

      return `
        <article class="event-row">
          <div class="event-main">
            <strong>${eventCatalog[event.eventType]}</strong>
            <span>Min ${event.minute}</span>
          </div>
          <small>${zone.name} · Propietario actual: ${owner}</small>
          <small>Valor del acto en esta zona: +${score} puntos</small>
        </article>
      `;
    })
    .join("");
}

function renderScoreboard() {
  const scores = computeScores();

  if (!scores.length) {
    scoreboard.className = "scoreboard empty-state";
    scoreboard.textContent = "Reserva alguna zona y anade eventos para calcular resultados.";
    return;
  }

  scoreboard.className = "scoreboard";
  scoreboard.innerHTML = scores
    .map(
      (row, index) => `
        <article class="score-row">
          <div class="score-main">
            <strong>#${index + 1} ${row.owner}</strong>
            <span class="score-points">${row.points}</span>
          </div>
          <div class="score-meta">
            Zonas: ${row.reservedZones} · Inversion: ${row.investment} · Acciones puntuadas: ${row.hits}
          </div>
        </article>
      `
    )
    .join("");
}

function refreshAll() {
  renderPitch();
  renderZoneDetail();
  renderEvents();
  renderScoreboard();
}

document.querySelector("#reservation-form").addEventListener("submit", (event) => {
  event.preventDefault();

  if (!state.selectedZoneId) {
    alert("Selecciona primero una zona del campo.");
    return;
  }

  const owner = ownerNameInput.value.trim();
  if (!owner) {
    alert("Escribe el nombre del jugador o usuario.");
    return;
  }

  state.reservations[state.selectedZoneId] = owner;
  ownerNameInput.value = "";
  refreshAll();
});

document.querySelector("#event-form").addEventListener("submit", (event) => {
  event.preventDefault();

  state.events.unshift({
    zoneId: eventZoneSelect.value,
    eventType: eventTypeSelect.value,
    minute: Number(eventMinuteInput.value) || 1
  });

  renderEvents();
  renderScoreboard();
});

document.querySelector("#clear-reservations").addEventListener("click", () => {
  state.reservations = {};
  state.events = [];
  refreshAll();
});

document.querySelector("#seed-events").addEventListener("click", () => {
  state.reservations = {
    "penalty-spot": "Ana",
    "goal": "Luis",
    "corner-left": "Marta",
    "center-circle": "Javi",
    "small-box": "Ana"
  };

  state.events = [
    { zoneId: "center-circle", eventType: "throughBall", minute: 4 },
    { zoneId: "corner-left", eventType: "cornerKick", minute: 11 },
    { zoneId: "small-box", eventType: "finish", minute: 12 },
    { zoneId: "goal", eventType: "save", minute: 24 },
    { zoneId: "penalty-spot", eventType: "penalty", minute: 67 }
  ];

  refreshAll();
});

populateEventSelectors();
refreshAll();
