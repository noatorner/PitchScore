const STORAGE_KEY = "pitchscore-state-v6";

const PITCH_LENGTH = 120;
const PITCH_WIDTH = 80;
const GRID_COLS = 30;
const GRID_ROWS = 20;
const CELL_LENGTH = PITCH_LENGTH / GRID_COLS;
const CELL_WIDTH = PITCH_WIDTH / GRID_ROWS;

const macroZones = {
  corner: {
    label: "Corner",
    short: "CO",
    tier: "alta",
    entryCost: 84,
    weight: 6,
    note: "Activo de 4 celdas en la esquina del campo.",
    eventScores: { cornerKick: 16, cross: 12, assistChance: 14, duelWon: 7 }
  },
  wing: {
    label: "Banda",
    short: "BA",
    tier: "media",
    entryCost: 58,
    weight: 4,
    note: "Banda abierta para progresion, desborde y centro.",
    eventScores: { progressiveCarry: 10, cross: 12, duelWon: 7, recovery: 6 }
  },
  halfspace: {
    label: "Half-space",
    short: "HS",
    tier: "media-alta",
    entryCost: 72,
    weight: 5,
    note: "Carril interior para diagonales, ultimo pase y recepciones.",
    eventScores: { throughBall: 12, progressiveCarry: 9, touchInBox: 9, duelWon: 8 }
  },
  hotzone: {
    label: "Zona caliente frontal",
    short: "ZH",
    tier: "alta",
    entryCost: 94,
    weight: 7,
    note: "Frente del area y arco. Ideal para faltas peligrosas y disparos.",
    eventScores: { longShot: 16, foulWon: 13, throughBall: 11, shotOnTarget: 12 }
  },
  box: {
    label: "Area",
    short: "AR",
    tier: "premium",
    entryCost: 108,
    weight: 8,
    note: "Area grande, solo celdas claramente dentro del area.",
    eventScores: { finish: 18, touchInBox: 11, foulWon: 10, duelWon: 8 }
  },
  sixyard: {
    label: "Area pequena",
    short: "AP",
    tier: "premium",
    entryCost: 126,
    weight: 9,
    note: "Area pequena para rebotes, remates y tiros de maximo peligro.",
    eventScores: { finish: 22, rebound: 16, touchInBox: 12, shotOnTarget: 12 }
  },
  goalmouth: {
    label: "Porteria",
    short: "PO",
    tier: "legendaria",
    entryCost: 142,
    weight: 10,
    note: "Activo de 4 celdas centrado en la porteria.",
    eventScores: { goal: 32, save: 18, shotOnTarget: 12, rebound: 10 }
  },
  penaltyspot: {
    label: "Punto de penalti",
    short: "PP",
    tier: "legendaria",
    entryCost: 164,
    weight: 12,
    note: "Activo de 4 celdas centrado en el punto de penalti.",
    eventScores: { penalty: 35, finish: 24, foulWon: 15, shotOnTarget: 14 }
  },
  kickoffspot: {
    label: "Punto de saque",
    short: "PS",
    tier: "alta",
    entryCost: 88,
    weight: 6,
    note: "Activo de 4 celdas centrado en el punto de saque.",
    eventScores: { kickoff: 8, throughBall: 10, progressiveCarry: 8, duelWon: 6 }
  },
  centercircle: {
    label: "Circulo central",
    short: "CC",
    tier: "base",
    entryCost: 46,
    weight: 3,
    note: "Corona del circulo central alrededor del punto de saque.",
    eventScores: { kickoff: 5, recovery: 7, throughBall: 10, progressiveCarry: 8 }
  },
  central: {
    label: "Carril central",
    short: "CE",
    tier: "base",
    entryCost: 52,
    weight: 4,
    note: "Canal central intermedio para progresion y recuperacion.",
    eventScores: { recovery: 8, throughBall: 9, progressiveCarry: 8, duelWon: 6 }
  },
  buildup: {
    label: "Salida",
    short: "SA",
    tier: "base",
    entryCost: 48,
    weight: 3,
    note: "Zona base de salida y circulacion temprana.",
    eventScores: { recovery: 7, progressiveCarry: 8, throughBall: 8, duelWon: 6 }
  }
};

const matches = [
  { id: "wc26-001", label: "Mexico vs South Africa", stage: "Grupo A", home: "Mexico", away: "South Africa", venue: "Mexico City Stadium", date: "2026-06-11" },
  { id: "wc26-002", label: "Korea Republic vs Czechia", stage: "Grupo A", home: "Korea Republic", away: "Czechia", venue: "Estadio Guadalajara", date: "2026-06-11" },
  { id: "wc26-003", label: "Canada vs Bosnia and Herzegovina", stage: "Grupo B", home: "Canada", away: "Bosnia and Herzegovina", venue: "Toronto Stadium", date: "2026-06-12" },
  { id: "wc26-004", label: "USA vs Paraguay", stage: "Grupo D", home: "USA", away: "Paraguay", venue: "Los Angeles Stadium", date: "2026-06-12" },
  { id: "wc26-005", label: "Haiti vs Scotland", stage: "Grupo C", home: "Haiti", away: "Scotland", venue: "Boston Stadium", date: "2026-06-13" },
  { id: "wc26-006", label: "Australia vs Turkiye", stage: "Grupo D", home: "Australia", away: "Turkiye", venue: "BC Place Vancouver", date: "2026-06-13" },
  { id: "wc26-007", label: "Brazil vs Morocco", stage: "Grupo C", home: "Brazil", away: "Morocco", venue: "New York New Jersey Stadium", date: "2026-06-13" },
  { id: "wc26-008", label: "Qatar vs Switzerland", stage: "Grupo B", home: "Qatar", away: "Switzerland", venue: "San Francisco Bay Area Stadium", date: "2026-06-13" },
  { id: "wc26-009", label: "Cote d'Ivoire vs Ecuador", stage: "Grupo E", home: "Cote d'Ivoire", away: "Ecuador", venue: "Philadelphia Stadium", date: "2026-06-14" },
  { id: "wc26-010", label: "Germany vs Curacao", stage: "Grupo E", home: "Germany", away: "Curacao", venue: "Houston Stadium", date: "2026-06-14" },
  { id: "wc26-011", label: "Netherlands vs Japan", stage: "Grupo F", home: "Netherlands", away: "Japan", venue: "Dallas Stadium", date: "2026-06-14" },
  { id: "wc26-012", label: "Sweden vs Tunisia", stage: "Grupo F", home: "Sweden", away: "Tunisia", venue: "Estadio Monterrey", date: "2026-06-14" },
  { id: "wc26-013", label: "Saudi Arabia vs Uruguay", stage: "Grupo H", home: "Saudi Arabia", away: "Uruguay", venue: "Miami Stadium", date: "2026-06-15" },
  { id: "wc26-014", label: "Spain vs Cabo Verde", stage: "Grupo H", home: "Spain", away: "Cabo Verde", venue: "Atlanta Stadium", date: "2026-06-15" },
  { id: "wc26-015", label: "IR Iran vs New Zealand", stage: "Grupo G", home: "IR Iran", away: "New Zealand", venue: "Los Angeles Stadium", date: "2026-06-15" },
  { id: "wc26-016", label: "Belgium vs Egypt", stage: "Grupo G", home: "Belgium", away: "Egypt", venue: "Seattle Stadium", date: "2026-06-15" },
  { id: "wc26-017", label: "France vs Senegal", stage: "Grupo I", home: "France", away: "Senegal", venue: "New York New Jersey Stadium", date: "2026-06-16" },
  { id: "wc26-018", label: "Iraq vs Norway", stage: "Grupo I", home: "Iraq", away: "Norway", venue: "Boston Stadium", date: "2026-06-16" },
  { id: "wc26-019", label: "Argentina vs Algeria", stage: "Grupo J", home: "Argentina", away: "Algeria", venue: "Kansas City Stadium", date: "2026-06-16" },
  { id: "wc26-020", label: "Austria vs Jordan", stage: "Grupo J", home: "Austria", away: "Jordan", venue: "San Francisco Bay Area Stadium", date: "2026-06-16" },
  { id: "wc26-021", label: "Ghana vs Panama", stage: "Grupo L", home: "Ghana", away: "Panama", venue: "Toronto Stadium", date: "2026-06-17" },
  { id: "wc26-022", label: "England vs Croatia", stage: "Grupo L", home: "England", away: "Croatia", venue: "Dallas Stadium", date: "2026-06-17" },
  { id: "wc26-023", label: "Portugal vs Congo DR", stage: "Grupo K", home: "Portugal", away: "Congo DR", venue: "Houston Stadium", date: "2026-06-17" },
  { id: "wc26-024", label: "Uzbekistan vs Colombia", stage: "Grupo K", home: "Uzbekistan", away: "Colombia", venue: "Mexico City Stadium", date: "2026-06-17" },
  { id: "wc26-025", label: "Czechia vs South Africa", stage: "Grupo A", home: "Czechia", away: "South Africa", venue: "Atlanta Stadium", date: "2026-06-18" },
  { id: "wc26-026", label: "Switzerland vs Bosnia and Herzegovina", stage: "Grupo B", home: "Switzerland", away: "Bosnia and Herzegovina", venue: "Los Angeles Stadium", date: "2026-06-18" },
  { id: "wc26-027", label: "Canada vs Qatar", stage: "Grupo B", home: "Canada", away: "Qatar", venue: "BC Place Vancouver", date: "2026-06-18" },
  { id: "wc26-028", label: "Mexico vs Korea Republic", stage: "Grupo A", home: "Mexico", away: "Korea Republic", venue: "Estadio Guadalajara", date: "2026-06-18" }
];

const eventCatalog = {
  goal: "Gol",
  save: "Parada",
  shotOnTarget: "Tiro a puerta",
  rebound: "Rebote",
  finish: "Remate",
  touchInBox: "Toque en area",
  foulWon: "Falta recibida",
  penalty: "Penalti",
  cross: "Centro",
  duelWon: "Duelo ganado",
  longShot: "Disparo lejano",
  recovery: "Recuperacion",
  foul: "Falta",
  throughBall: "Pase filtrado",
  cornerKick: "Saque de esquina",
  assistChance: "Ocasion creada",
  progressiveCarry: "Conduccion",
  kickoff: "Saque inicial"
};

const defaultState = {
  config: {
    budget: 420,
    currentMatchId: "wc26-014"
  },
  selectedCellId: null,
  activePlayerId: null,
  players: [],
  reservations: {},
  events: []
};

function distance(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function cellFullyInside(cell, minX, maxX, minY, maxY) {
  return cell.minX >= minX && cell.maxX <= maxX && cell.minY >= minY && cell.maxY <= maxY;
}

function buildCell(row, col, sequence) {
  const minX = col * CELL_LENGTH;
  const maxX = minX + CELL_LENGTH;
  const minY = row * CELL_WIDTH;
  const maxY = minY + CELL_WIDTH;
  const centerX = minX + CELL_LENGTH / 2;
  const centerY = minY + CELL_WIDTH / 2;
  const code = `${String.fromCharCode(65 + row)}${String(col + 1).padStart(2, "0")}`;

  return {
    id: `cell-${sequence}`,
    code,
    row,
    col,
    minX,
    maxX,
    minY,
    maxY,
    centerX,
    centerY
  };
}

function getSpecialAsset(cell) {
  const row = cell.row;
  const col = cell.col;

  if (row <= 1 && col <= 1) return { assetId: "corner-nw", macroZoneId: "corner" };
  if (row <= 1 && col >= 28) return { assetId: "corner-ne", macroZoneId: "corner" };
  if (row >= 18 && col <= 1) return { assetId: "corner-sw", macroZoneId: "corner" };
  if (row >= 18 && col >= 28) return { assetId: "corner-se", macroZoneId: "corner" };

  if (row >= 9 && row <= 10 && col <= 1) return { assetId: "goal-left", macroZoneId: "goalmouth" };
  if (row >= 9 && row <= 10 && col >= 28) return { assetId: "goal-right", macroZoneId: "goalmouth" };

  if (row >= 9 && row <= 10 && col >= 2 && col <= 3) return { assetId: "penalty-left", macroZoneId: "penaltyspot" };
  if (row >= 9 && row <= 10 && col >= 26 && col <= 27) return { assetId: "penalty-right", macroZoneId: "penaltyspot" };

  if (row >= 9 && row <= 10 && col >= 14 && col <= 15) return { assetId: "kickoff-center", macroZoneId: "kickoffspot" };

  return null;
}

function detectMacroZone(cell) {
  const special = getSpecialAsset(cell);
  if (special) return special;

  if (cellFullyInside(cell, 0, 8, 32, 48) || cellFullyInside(cell, 112, 120, 32, 48)) {
    return { assetId: `sixyard-${cell.code}`, macroZoneId: "sixyard" };
  }

  if (cellFullyInside(cell, 0, 20, 16, 64) || cellFullyInside(cell, 100, 120, 16, 64)) {
    return { assetId: `box-${cell.code}`, macroZoneId: "box" };
  }

  const leftArc = cell.centerX >= 20 && cell.centerX <= 32 && distance(cell.centerX, cell.centerY, 12, 40) >= 8 && distance(cell.centerX, cell.centerY, 12, 40) <= 11;
  const rightArc = cell.centerX >= 88 && cell.centerX <= 100 && distance(cell.centerX, cell.centerY, 108, 40) >= 8 && distance(cell.centerX, cell.centerY, 108, 40) <= 11;
  const leftFrontal = cellFullyInside(cell, 20, 32, 24, 56);
  const rightFrontal = cellFullyInside(cell, 88, 100, 24, 56);
  if (leftArc || rightArc || leftFrontal || rightFrontal) {
    return { assetId: `hot-${cell.code}`, macroZoneId: "hotzone" };
  }

  const withinCenterCircle = distance(cell.centerX, cell.centerY, 60, 40) <= 10;
  if (withinCenterCircle) {
    return { assetId: `cc-${cell.code}`, macroZoneId: "centercircle" };
  }

  if (cell.maxY <= 16 || cell.minY >= 64) {
    return { assetId: `wing-${cell.code}`, macroZoneId: "wing" };
  }

  if ((cell.minY >= 16 && cell.maxY <= 24) || (cell.minY >= 56 && cell.maxY <= 64)) {
    return { assetId: `hs-${cell.code}`, macroZoneId: "halfspace" };
  }

  if (cell.minX >= 44 && cell.maxX <= 76) {
    return { assetId: `ce-${cell.code}`, macroZoneId: "central" };
  }

  return { assetId: `sa-${cell.code}`, macroZoneId: "buildup" };
}

function buildCells() {
  const cells = [];
  let sequence = 1;

  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < GRID_COLS; col += 1) {
      const cell = buildCell(row, col, sequence);
      const { assetId, macroZoneId } = detectMacroZone(cell);
      cells.push({
        ...cell,
        assetId,
        macroZoneId,
        macroZone: macroZones[macroZoneId],
        label: `${macroZones[macroZoneId].label} ${cell.code}`
      });
      sequence += 1;
    }
  }

  return cells;
}

const cells = buildCells();
const state = loadState();

const heroStats = document.querySelector("#hero-stats");
const matchSelect = document.querySelector("#match-select");
const budgetInput = document.querySelector("#budget-input");
const playerForm = document.querySelector("#player-form");
const playerNameInput = document.querySelector("#player-name");
const playersList = document.querySelector("#players-list");
const sessionForm = document.querySelector("#session-form");
const activePlayerSelect = document.querySelector("#active-player");
const sessionCard = document.querySelector("#session-card");
const selectionOverlay = document.querySelector("#selection-overlay");
const pitchGrid = document.querySelector("#pitch-grid");
const zoneCatalog = document.querySelector("#zone-catalog");
const eventForm = document.querySelector("#event-form");
const eventZoneSelect = document.querySelector("#event-zone");
const eventTypeSelect = document.querySelector("#event-type");
const eventMinuteInput = document.querySelector("#event-minute");
const eventTeamSelect = document.querySelector("#event-team");
const eventsList = document.querySelector("#events-list");
const scoreboard = document.querySelector("#scoreboard");
const breakdownPanel = document.querySelector("#breakdown-panel");
const loadDemoMatchButton = document.querySelector("#load-demo-match");
const resetAllButton = document.querySelector("#reset-all");

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(defaultState);

  try {
    const parsed = JSON.parse(raw);
    return {
      config: {
        budget: parsed.config?.budget ?? defaultState.config.budget,
        currentMatchId: parsed.config?.currentMatchId ?? defaultState.config.currentMatchId
      },
      selectedCellId: parsed.selectedCellId ?? null,
      activePlayerId: parsed.activePlayerId ?? null,
      players: Array.isArray(parsed.players) ? parsed.players : [],
      reservations: parsed.reservations ?? {},
      events: Array.isArray(parsed.events) ? parsed.events : []
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCell(cellId) {
  return cells.find((cell) => cell.id === cellId);
}

function getAssetCells(assetId) {
  return cells.filter((cell) => cell.assetId === assetId);
}

function getPlayer(playerId) {
  return state.players.find((player) => player.id === playerId);
}

function getCurrentMatch() {
  return matches.find((match) => match.id === state.config.currentMatchId) ?? matches[0];
}

function getReservationOwnerByAsset(assetId) {
  const playerId = state.reservations[assetId];
  return playerId ? getPlayer(playerId) : null;
}

function getReservationOwnerByCell(cell) {
  return getReservationOwnerByAsset(cell.assetId);
}

function formatMatchDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function computePlayerLedger(playerId) {
  const ownedAssetIds = Object.entries(state.reservations)
    .filter(([, ownerId]) => ownerId === playerId)
    .map(([assetId]) => assetId);

  const ownedAssets = ownedAssetIds.map((assetId) => {
    const assetCells = getAssetCells(assetId);
    const sample = assetCells[0];
    return {
      assetId,
      assetCells,
      sample,
      macroZone: sample.macroZone
    };
  });

  const invested = ownedAssets.reduce((sum, asset) => sum + asset.macroZone.entryCost, 0);
  const eventRows = state.events
    .filter((event) => event.matchId === state.config.currentMatchId && state.reservations[event.assetId] === playerId)
    .map((event) => {
      const cell = getCell(event.cellId);
      return { ...event, cell, points: cell.macroZone.eventScores[event.eventType] ?? 0 };
    });

  const grossPoints = eventRows.reduce((sum, row) => sum + row.points, 0);
  const reservationPenalty = ownedAssets.reduce((sum, asset) => sum + Math.round(asset.macroZone.entryCost / 10), 0);

  return {
    ownedAssets,
    invested,
    eventRows,
    grossPoints,
    reservationPenalty,
    netPoints: grossPoints - reservationPenalty,
    remainingBudget: state.config.budget - invested
  };
}

function computeRanking() {
  return state.players
    .map((player) => ({ player, ...computePlayerLedger(player.id) }))
    .sort((a, b) => b.netPoints - a.netPoints);
}

function getMarketSummary() {
  const reservedCount = Object.keys(state.reservations).length;
  const totalInvestment = Object.keys(state.reservations)
    .map((assetId) => getAssetCells(assetId)[0])
    .filter(Boolean)
    .reduce((sum, cell) => sum + cell.macroZone.entryCost, 0);

  return {
    players: state.players.length,
    reservedCount,
    freeCount: new Set(cells.map((cell) => cell.assetId)).size - reservedCount,
    totalInvestment
  };
}

function renderHeroStats() {
  const currentMatch = getCurrentMatch();
  const summary = getMarketSummary();

  heroStats.innerHTML = `
    <article class="hero-stat">
      <div class="hero-stat-value">${summary.players}</div>
      <div class="hero-stat-label">jugadores activos</div>
    </article>
    <article class="hero-stat">
      <div class="hero-stat-value">${summary.reservedCount}</div>
      <div class="hero-stat-label">activos comprados</div>
    </article>
    <article class="hero-stat">
      <div class="hero-stat-value">${currentMatch.home} vs ${currentMatch.away}</div>
      <div class="hero-stat-label">${formatMatchDate(currentMatch.date)} · ${currentMatch.venue}</div>
    </article>
  `;
}

function renderMatchSelect() {
  matchSelect.innerHTML = matches
    .map((match) => `
      <option value="${match.id}" ${match.id === state.config.currentMatchId ? "selected" : ""}>
        ${formatMatchDate(match.date)} · ${match.home} vs ${match.away}
      </option>
    `)
    .join("");

  budgetInput.value = String(state.config.budget);
}

function renderPlayers() {
  if (!state.players.length) {
    playersList.className = "player-list empty-state";
    playersList.textContent = "Todavia no hay jugadores en la ronda.";
    return;
  }

  playersList.className = "player-list";
  playersList.innerHTML = computeRanking()
    .map(({ player, ownedAssets, invested, remainingBudget, netPoints }) => `
      <article class="player-card ${state.activePlayerId === player.id ? "active-player-card" : ""}">
        <div class="player-main">
          <strong>${player.name}</strong>
          <span class="player-budget ${remainingBudget < 70 ? "low-budget" : ""}">
            ${remainingBudget} libres
          </span>
        </div>
        <div class="muted-line">
          Activos: ${ownedAssets.length} · Inversion: ${invested} · Puntos netos: ${netPoints}
        </div>
      </article>
    `)
    .join("");
}

function renderActivePlayerSelect() {
  if (!state.players.length) {
    activePlayerSelect.innerHTML = `<option value="">Crea primero un jugador</option>`;
    return;
  }

  activePlayerSelect.innerHTML = state.players
    .map((player) => `<option value="${player.id}" ${state.activePlayerId === player.id ? "selected" : ""}>${player.name}</option>`)
    .join("");
}

function renderSessionCard() {
  const activePlayer = getPlayer(state.activePlayerId);
  if (!activePlayer) {
    sessionCard.innerHTML = `
      <h3>Sin sesion activa</h3>
      <p>Selecciona un jugador para comprar activos desde el panel del campo.</p>
    `;
    return;
  }

  const ledger = computePlayerLedger(activePlayer.id);
  sessionCard.innerHTML = `
    <h3>Jugando como ${activePlayer.name}</h3>
    <p>Presupuesto libre: ${ledger.remainingBudget} creditos</p>
    <div class="detail-line"><strong>Activos comprados:</strong> ${ledger.ownedAssets.length}</div>
    <div class="detail-line"><strong>Puntos netos:</strong> ${ledger.netPoints}</div>
  `;
}

function buildPitchMarkup() {
  const specialAssetIds = new Set(["corner-nw", "corner-ne", "corner-sw", "corner-se", "goal-left", "goal-right", "penalty-left", "penalty-right", "kickoff-center"]);
  const specialAssetMarkup = [...specialAssetIds]
    .map((assetId) => {
      const assetCells = getAssetCells(assetId);
      if (!assetCells.length) return "";

      const owner = getReservationOwnerByAsset(assetId);
      const representativeCell = assetCells[0];
      const minRow = Math.min(...assetCells.map((cell) => cell.row)) + 1;
      const maxRow = Math.max(...assetCells.map((cell) => cell.row)) + 2;
      const minCol = Math.min(...assetCells.map((cell) => cell.col)) + 1;
      const maxCol = Math.max(...assetCells.map((cell) => cell.col)) + 2;
      const isSelected = state.selectedCellId && getCell(state.selectedCellId)?.assetId === assetId;

      const classes = [
        "pitch-special-asset",
        `zone-${representativeCell.macroZoneId}`,
        isSelected ? "selected" : "",
        owner ? "owned" : ""
      ].filter(Boolean).join(" ");

      return `
        <button
          type="button"
          class="${classes}"
          data-cell-id="${representativeCell.id}"
          data-asset-id="${assetId}"
          style="grid-row:${minRow} / ${maxRow}; grid-column:${minCol} / ${maxCol};"
          title="${representativeCell.macroZone.label} · activo premium"
          aria-label="${representativeCell.macroZone.label}"
        >
          <span class="special-code">${representativeCell.macroZone.short}</span>
          <span class="special-name">${representativeCell.macroZone.label}</span>
          <span class="special-price">${representativeCell.macroZone.entryCost} cr</span>
          ${owner ? `<span class="special-owner">${owner.name}</span>` : ""}
        </button>
      `;
    })
    .join("");

  return `
    <div class="pitch-markings">
      <div class="halfway-line"></div>
      <div class="center-ring"></div>
      <div class="left-penalty-box"></div>
      <div class="left-goal-box"></div>
      <div class="right-penalty-box"></div>
      <div class="right-goal-box"></div>
      <div class="left-spot"></div>
      <div class="right-spot"></div>
      <div class="kickoff-spot"></div>
      <div class="left-arc"></div>
      <div class="right-arc"></div>
    </div>
    ${cells.map((cell) => {
      const isCoveredBySpecialAsset = specialAssetIds.has(cell.assetId);
      const owner = getReservationOwnerByCell(cell);
      const classes = [
        "pitch-zone",
        `zone-${cell.macroZoneId}`,
        isCoveredBySpecialAsset ? "under-special-asset" : "",
        state.selectedCellId === cell.id ? "selected" : "",
        owner ? "owned" : ""
      ].filter(Boolean).join(" ");

      const showCode = ["penaltyspot", "kickoffspot", "goalmouth", "corner"].includes(cell.macroZoneId);

      return `
        <button
          type="button"
          class="${classes}"
          data-cell-id="${cell.id}"
          title="${cell.code} · ${cell.macroZone.label} · activo ${cell.assetId}"
          aria-label="${cell.code} ${cell.macroZone.label}"
        >
          ${showCode ? `<span class="cell-code">${cell.macroZone.short}</span>` : ""}
          ${owner ? `<span class="cell-owner">${owner.name.slice(0, 1).toUpperCase()}</span>` : ""}
        </button>
      `;
    }).join("")}
    ${specialAssetMarkup}
  `;
}

function renderPitch() {
  pitchGrid.innerHTML = buildPitchMarkup();
}

function buildCellDetailMarkup(cell, owner) {
  const assetCells = getAssetCells(cell.assetId);
  const activePlayer = getPlayer(state.activePlayerId);
  const isOwnedByActive = activePlayer && owner && owner.id === activePlayer.id;
  const canBuy = Boolean(activePlayer) && !owner;
  let actionLabel = "Comprar activo";
  if (!activePlayer) actionLabel = "Entra como jugador para comprar";
  if (owner && !isOwnedByActive) actionLabel = `Reservado por ${owner.name}`;
  if (isOwnedByActive) actionLabel = "Ya es tuyo";

  return `
    <h3>${cell.code} · ${cell.macroZone.short} · ${cell.macroZone.label}</h3>
    <p>${cell.macroZone.note}</p>
    <div class="detail-line"><strong>Activo:</strong> ${cell.assetId}</div>
    <div class="detail-line"><strong>Celdas del activo:</strong> ${assetCells.map((item) => item.code).join(", ")}</div>
    <div class="detail-line"><strong>Coordenadas:</strong> x ${cell.minX}-${cell.maxX} · y ${cell.minY}-${cell.maxY}</div>
    <div class="detail-line"><strong>Tier:</strong> ${cell.macroZone.tier}</div>
    <div class="detail-line"><strong>Coste:</strong> ${cell.macroZone.entryCost} creditos</div>
    <div class="detail-line"><strong>Propietario:</strong> ${owner ? owner.name : "Sin asignar"}</div>
    <div class="detail-line"><strong>Sesion activa:</strong> ${activePlayer ? activePlayer.name : "Ninguna"}</div>
    <div class="tag-list">
      ${Object.entries(cell.macroZone.eventScores)
        .map(([eventType, points]) => `<span class="tag ${points >= 16 ? "gold" : ""}">${eventCatalog[eventType]} +${points}</span>`)
        .join("")}
    </div>
    <button
      type="button"
      id="buy-asset-button"
      class="primary-button overlay-buy-button"
      data-cell-id="${cell.id}"
      ${canBuy ? "" : "disabled"}
    >
      ${actionLabel}
    </button>
  `;
}

function renderZoneDetail() {
  if (!state.selectedCellId) {
    selectionOverlay.innerHTML = `
      <h3>Selecciona una celda</h3>
      <p>Al pulsar una zona del campo veras aqui el tipo de activo, el bloque que compras y sus reglas.</p>
    `;
    return;
  }

  const cell = getCell(state.selectedCellId);
  const owner = getReservationOwnerByCell(cell);
  selectionOverlay.innerHTML = buildCellDetailMarkup(cell, owner);
}

function renderZoneCatalog() {
  zoneCatalog.innerHTML = Object.entries(macroZones)
    .map(([macroZoneId, macroZone]) => {
      const assetCount = new Set(cells.filter((cell) => cell.macroZoneId === macroZoneId).map((cell) => cell.assetId)).size;
      return `
        <article class="catalog-card">
          <div class="player-main">
            <strong>${macroZone.short} · ${macroZone.label}</strong>
            <span class="zone-cost">${macroZone.entryCost}</span>
          </div>
          <p>${macroZone.note}</p>
          <p class="muted-line">Tier ${macroZone.tier} · Peso ${macroZone.weight}/12 · ${assetCount} activos</p>
          <ul>
            ${Object.entries(macroZone.eventScores)
              .map(([eventType, points]) => `<li>${eventCatalog[eventType]}: +${points}</li>`)
              .join("")}
          </ul>
        </article>
      `;
    })
    .join("");
}

function renderEventSelectors() {
  eventZoneSelect.innerHTML = cells
    .map((cell) => `
      <option value="${cell.id}">
        ${cell.code} · ${cell.macroZone.short} · ${cell.macroZone.label}
      </option>
    `)
    .join("");

  if (state.selectedCellId) {
    eventZoneSelect.value = state.selectedCellId;
  }

  const uniqueEvents = [...new Set(Object.values(macroZones).flatMap((macroZone) => Object.keys(macroZone.eventScores)))];
  eventTypeSelect.innerHTML = uniqueEvents
    .map((eventType) => `<option value="${eventType}">${eventCatalog[eventType]}</option>`)
    .join("");

  const currentMatch = getCurrentMatch();
  eventTeamSelect.innerHTML = `
    <option value="home">${currentMatch.home}</option>
    <option value="away">${currentMatch.away}</option>
  `;
}

function renderEvents() {
  const currentMatchEvents = state.events.filter((event) => event.matchId === state.config.currentMatchId);

  if (!currentMatchEvents.length) {
    eventsList.className = "events-list empty-state";
    eventsList.textContent = "Todavia no hay eventos en este partido.";
    return;
  }

  const currentMatch = getCurrentMatch();
  eventsList.className = "events-list";
  eventsList.innerHTML = currentMatchEvents
    .slice()
    .reverse()
    .map((event) => {
      const cell = getCell(event.cellId);
      const owner = getReservationOwnerByCell(cell);
      const points = cell.macroZone.eventScores[event.eventType] ?? 0;
      const teamLabel = event.team === "home" ? currentMatch.home : currentMatch.away;

      return `
        <article class="event-row">
          <div class="event-main">
            <strong>${eventCatalog[event.eventType]}</strong>
            <span>Min ${event.minute}</span>
          </div>
          <small>${cell.code} · ${cell.macroZone.short} · ${cell.macroZone.label} · ${teamLabel}</small>
          <small>Activo: ${cell.assetId} · Propietario: ${owner ? owner.name : "sin propietario"} · Valor: +${points}</small>
        </article>
      `;
    })
    .join("");
}

function renderScoreboard() {
  const ranking = computeRanking();

  if (!ranking.length) {
    scoreboard.className = "scoreboard empty-state";
    scoreboard.textContent = "Crea jugadores, reparte activos y registra eventos para generar la tabla.";
    return;
  }

  scoreboard.className = "scoreboard";
  scoreboard.innerHTML = ranking
    .map(({ player, netPoints, grossPoints, reservationPenalty, ownedAssets, eventRows }, index) => `
      <article class="score-row">
        <div class="score-main">
          <strong>#${index + 1} ${player.name}</strong>
          <span class="score-points">${netPoints}</span>
        </div>
        <div class="score-meta">
          Activos: ${ownedAssets.length} · Eventos cobrados: ${eventRows.length} · Bruto: ${grossPoints} · Coste: -${reservationPenalty}
        </div>
      </article>
    `)
    .join("");
}

function renderBreakdown() {
  const ranking = computeRanking();

  if (!ranking.length) {
    breakdownPanel.className = "breakdown-panel empty-state";
    breakdownPanel.textContent = "El detalle por jugador aparecera aqui.";
    return;
  }

  breakdownPanel.className = "breakdown-panel";
  breakdownPanel.innerHTML = ranking
    .map(({ player, ownedAssets, eventRows, invested, remainingBudget, netPoints }) => `
      <article class="breakdown-card">
        <div class="breakdown-main">
          <strong>${player.name}</strong>
          <span class="player-budget">${netPoints} netos</span>
        </div>
        <p>Invertido: ${invested} · Presupuesto libre: ${remainingBudget}</p>
        <p>Activos: ${
          ownedAssets.length
            ? ownedAssets.slice(0, 10).map((asset) => `${asset.sample.macroZone.short} (${asset.assetCells.map((cell) => cell.code).join("/")})`).join(", ")
            : "ninguno"
        }</p>
        <ul>
          ${
            eventRows.length
              ? eventRows
                .map((row) => `<li>Min ${row.minute} · ${row.cell.code} · ${row.cell.macroZone.label} · ${eventCatalog[row.eventType]} = +${row.points}</li>`)
                .join("")
              : "<li>Sin eventos puntuados todavia.</li>"
          }
        </ul>
      </article>
    `)
    .join("");
}

function refreshAll() {
  renderHeroStats();
  renderMatchSelect();
  renderPlayers();
  renderActivePlayerSelect();
  renderSessionCard();
  renderPitch();
  renderZoneDetail();
  renderZoneCatalog();
  renderEventSelectors();
  renderEvents();
  renderScoreboard();
  renderBreakdown();
}

function addPlayer(name) {
  const normalized = name.trim();
  if (!normalized) return;
  if (state.players.some((player) => player.name.toLowerCase() === normalized.toLowerCase())) {
    alert("Ese jugador ya existe en la ronda.");
    return;
  }

  state.players.push({
    id: `player-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name: normalized
  });

  if (!state.activePlayerId) {
    state.activePlayerId = state.players[state.players.length - 1].id;
  }
}

function reserveAssetFromCell(cellId, playerId) {
  const cell = getCell(cellId);
  const player = getPlayer(playerId);
  if (!cell || !player) return;

  const assetId = cell.assetId;
  const owner = getReservationOwnerByAsset(assetId);
  if (owner && owner.id !== playerId) {
    alert("Ese activo ya esta reservado. Reinicia la ronda si quieres reasignarlo.");
    return;
  }

  const ledger = computePlayerLedger(playerId);
  if (!owner && ledger.remainingBudget < cell.macroZone.entryCost) {
    alert("Ese jugador no tiene presupuesto suficiente para este activo.");
    return;
  }

  state.reservations[assetId] = playerId;
}

function addEvent(cellId, eventType, minute, team) {
  const cell = getCell(cellId);
  if (!cell) return;

  state.events.push({
    id: `event-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    matchId: state.config.currentMatchId,
    cellId,
    assetId: cell.assetId,
    eventType,
    minute,
    team
  });
}

function findCellByRowCol(row, col) {
  return cells.find((cell) => cell.row === row && cell.col === col);
}

function loadDemoRound() {
  const kickoffCell = findCellByRowCol(9, 14);
  const leftPenaltyCell = findCellByRowCol(9, 2);
  const leftGoalCell = findCellByRowCol(9, 0);
  const leftSixCell = findCellByRowCol(9, 1);
  const rightCornerCell = findCellByRowCol(0, 28);
  const leftHotZoneCell = findCellByRowCol(9, 5);
  const rightHalfspaceCell = findCellByRowCol(4, 22);

  state.players = [
    { id: "player-ana", name: "Ana" },
    { id: "player-luis", name: "Luis" },
    { id: "player-marta", name: "Marta" },
    { id: "player-javi", name: "Javi" }
  ];

  state.config.budget = 420;
  state.config.currentMatchId = "wc26-014";
  state.selectedCellId = leftPenaltyCell?.id ?? null;
  state.activePlayerId = "player-ana";
  state.reservations = Object.fromEntries(
    [
      [leftPenaltyCell?.assetId, "player-ana"],
      [leftGoalCell?.assetId, "player-luis"],
      [rightCornerCell?.assetId, "player-marta"],
      [kickoffCell?.assetId, "player-javi"],
      [leftSixCell?.assetId, "player-ana"],
      [leftHotZoneCell?.assetId, "player-luis"],
      [rightHalfspaceCell?.assetId, "player-marta"]
    ].filter(([assetId]) => assetId)
  );

  state.events = [
    { id: "demo-1", matchId: "wc26-014", cellId: kickoffCell?.id, assetId: kickoffCell?.assetId, eventType: "kickoff", minute: 1, team: "home" },
    { id: "demo-2", matchId: "wc26-014", cellId: rightHalfspaceCell?.id, assetId: rightHalfspaceCell?.assetId, eventType: "progressiveCarry", minute: 11, team: "away" },
    { id: "demo-3", matchId: "wc26-014", cellId: leftSixCell?.id, assetId: leftSixCell?.assetId, eventType: "finish", minute: 13, team: "home" },
    { id: "demo-4", matchId: "wc26-014", cellId: leftGoalCell?.id, assetId: leftGoalCell?.assetId, eventType: "save", minute: 24, team: "away" },
    { id: "demo-5", matchId: "wc26-014", cellId: leftPenaltyCell?.id, assetId: leftPenaltyCell?.assetId, eventType: "penalty", minute: 67, team: "home" },
    { id: "demo-6", matchId: "wc26-014", cellId: rightCornerCell?.id, assetId: rightCornerCell?.assetId, eventType: "cornerKick", minute: 78, team: "away" },
    { id: "demo-7", matchId: "wc26-014", cellId: leftHotZoneCell?.id, assetId: leftHotZoneCell?.assetId, eventType: "foulWon", minute: 83, team: "home" }
  ].filter((event) => event.cellId && event.assetId);
}

playerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addPlayer(playerNameInput.value);
  playerNameInput.value = "";
  saveState();
  refreshAll();
});

sessionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.players.length) {
    alert("Crea al menos un jugador antes de entrar.");
    return;
  }
  state.activePlayerId = activePlayerSelect.value;
  saveState();
  refreshAll();
});

eventForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addEvent(eventZoneSelect.value, eventTypeSelect.value, Number(eventMinuteInput.value) || 1, eventTeamSelect.value);
  saveState();
  renderEvents();
  renderScoreboard();
  renderBreakdown();
  renderPlayers();
  renderHeroStats();
});

matchSelect.addEventListener("change", () => {
  state.config.currentMatchId = matchSelect.value;
  saveState();
  renderHeroStats();
  renderPlayers();
  renderEventSelectors();
  renderEvents();
  renderScoreboard();
  renderBreakdown();
});

budgetInput.addEventListener("change", () => {
  const nextBudget = Number(budgetInput.value) || defaultState.config.budget;
  state.config.budget = Math.max(50, nextBudget);
  saveState();
  renderPlayers();
  renderScoreboard();
  renderBreakdown();
});

loadDemoMatchButton.addEventListener("click", () => {
  loadDemoRound();
  saveState();
  refreshAll();
});

resetAllButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  state.config = structuredClone(defaultState.config);
  state.selectedCellId = null;
  state.players = [];
  state.reservations = {};
  state.events = [];
  selectedZoneInput.value = "";
  refreshAll();
});

pitchGrid.addEventListener("click", (event) => {
  const target = event.target.closest("[data-cell-id]");
  if (!target) return;

  const cellId = target.getAttribute("data-cell-id");
  const cell = getCell(cellId);
  if (!cell) return;

  state.selectedCellId = cellId;
  renderPitch();
  renderZoneDetail();
  renderEventSelectors();
  saveState();
});

selectionOverlay.addEventListener("click", (event) => {
  const target = event.target.closest("#buy-asset-button");
  if (!target) return;

  const cellId = target.getAttribute("data-cell-id");
  if (!state.activePlayerId) {
    alert("Entra primero como jugador.");
    return;
  }

  reserveAssetFromCell(cellId, state.activePlayerId);
  saveState();
  refreshAll();
});

refreshAll();
