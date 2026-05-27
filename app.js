const STORAGE_KEY = "pitchscore-redesign-v1";
const MAX_RESERVATIONS_PER_PLAYER = 3;
const DEFAULT_BUDGET = 420;
const PITCH_LENGTH = 120;
const PITCH_WIDTH = 80;
const GRID_COLS = 60;
const GRID_ROWS = 40;

const matches = [
  { id: "wc26-001", label: "Mexico vs South Africa", stage: "Grupo A", home: "Mexico", away: "South Africa", venue: "Mexico City Stadium", date: "2026-06-11", kickoff: "2026-06-11T21:00:00+02:00" },
  { id: "wc26-002", label: "Korea Republic vs Czechia", stage: "Grupo A", home: "Korea Republic", away: "Czechia", venue: "Estadio Guadalajara", date: "2026-06-11", kickoff: "2026-06-12T03:00:00+02:00" },
  { id: "wc26-003", label: "Canada vs Bosnia and Herzegovina", stage: "Grupo B", home: "Canada", away: "Bosnia and Herzegovina", venue: "Toronto Stadium", date: "2026-06-12", kickoff: "2026-06-12T23:00:00+02:00" },
  { id: "wc26-004", label: "USA vs Paraguay", stage: "Grupo D", home: "USA", away: "Paraguay", venue: "Los Angeles Stadium", date: "2026-06-12", kickoff: "2026-06-13T03:00:00+02:00" },
  { id: "wc26-005", label: "Haiti vs Scotland", stage: "Grupo C", home: "Haiti", away: "Scotland", venue: "Boston Stadium", date: "2026-06-13", kickoff: "2026-06-13T18:00:00+02:00" },
  { id: "wc26-006", label: "Australia vs Turkiye", stage: "Grupo D", home: "Australia", away: "Turkiye", venue: "BC Place Vancouver", date: "2026-06-13", kickoff: "2026-06-13T21:00:00+02:00" },
  { id: "wc26-007", label: "Brazil vs Morocco", stage: "Grupo C", home: "Brazil", away: "Morocco", venue: "New York New Jersey Stadium", date: "2026-06-13", kickoff: "2026-06-14T00:00:00+02:00" },
  { id: "wc26-008", label: "Qatar vs Switzerland", stage: "Grupo B", home: "Qatar", away: "Switzerland", venue: "San Francisco Bay Area Stadium", date: "2026-06-13", kickoff: "2026-06-14T03:00:00+02:00" },
  { id: "wc26-009", label: "Cote d'Ivoire vs Ecuador", stage: "Grupo E", home: "Cote d'Ivoire", away: "Ecuador", venue: "Philadelphia Stadium", date: "2026-06-14", kickoff: "2026-06-14T18:00:00+02:00" },
  { id: "wc26-010", label: "Germany vs Curacao", stage: "Grupo E", home: "Germany", away: "Curacao", venue: "Houston Stadium", date: "2026-06-14", kickoff: "2026-06-14T21:00:00+02:00" },
  { id: "wc26-011", label: "Netherlands vs Japan", stage: "Grupo F", home: "Netherlands", away: "Japan", venue: "Dallas Stadium", date: "2026-06-14", kickoff: "2026-06-15T00:00:00+02:00" },
  { id: "wc26-012", label: "Sweden vs Tunisia", stage: "Grupo F", home: "Sweden", away: "Tunisia", venue: "Estadio Monterrey", date: "2026-06-14", kickoff: "2026-06-15T03:00:00+02:00" },
  { id: "wc26-013", label: "Saudi Arabia vs Uruguay", stage: "Grupo H", home: "Saudi Arabia", away: "Uruguay", venue: "Miami Stadium", date: "2026-06-15", kickoff: "2026-06-15T18:00:00+02:00" },
  { id: "wc26-014", label: "Spain vs Cabo Verde", stage: "Grupo H", home: "Spain", away: "Cabo Verde", venue: "Atlanta Stadium", date: "2026-06-15", kickoff: "2026-06-15T21:00:00+02:00" },
  { id: "wc26-015", label: "IR Iran vs New Zealand", stage: "Grupo G", home: "IR Iran", away: "New Zealand", venue: "Los Angeles Stadium", date: "2026-06-15", kickoff: "2026-06-16T00:00:00+02:00" },
  { id: "wc26-016", label: "Belgium vs Egypt", stage: "Grupo G", home: "Belgium", away: "Egypt", venue: "Seattle Stadium", date: "2026-06-15", kickoff: "2026-06-16T03:00:00+02:00" }
];

const eventTypes = {
  goal: { label: "Gol", points: 38, energy: "Gol en la zona!" },
  shot: { label: "Tiro peligroso", points: 18, energy: "Tiro peligroso!" },
  save: { label: "Parada", points: 18, energy: "Paradon!" },
  foul: { label: "Falta peligrosa", points: 16, energy: "Falta caliente!" },
  penalty: { label: "Penalti", points: 34, energy: "Penalti!" },
  corner: { label: "Corner", points: 16, energy: "Corner ganado!" },
  cross: { label: "Centro", points: 12, energy: "Centro al area!" },
  recovery: { label: "Recuperacion", points: 8, energy: "Robo importante!" },
  carry: { label: "Conduccion", points: 9, energy: "Avanza el balon!" },
  pass: { label: "Pase clave", points: 13, energy: "Pase que rompe lineas!" }
};

const visibleZones = [
  { id: "corner-tl", name: "Corner norte izq.", short: "CN", rect: [0, 0, 9, 16], price: 110, capacity: 8, multiplier: 1.35, vibe: "Mucho valor en corners, centros y segundas jugadas.", color: "premium" },
  { id: "corner-bl", name: "Corner sur izq.", short: "CS", rect: [0, 84, 9, 16], price: 110, capacity: 8, multiplier: 1.35, vibe: "Zona pequena, cara y con premio alto si hay balon parado.", color: "premium" },
  { id: "box-left", name: "Area izquierda", short: "AR", rect: [0, 22.5, 15, 55], price: 115, capacity: 14, multiplier: 1.35, vibe: "Todo lo que pasa dentro del area pesa mas.", color: "hot" },
  { id: "goal-left", name: "Porteria izquierda", short: "PO", rect: [0, 42, 6, 16], price: 150, capacity: 6, multiplier: 1.7, vibe: "La zona mas dramatica: goles, paradas y rebotes.", color: "legend" },
  { id: "penalty-left", name: "Punto penalti izq.", short: "PP", rect: [8, 44, 6, 12], price: 165, capacity: 6, multiplier: 1.85, vibe: "Activo especial: penalti, remate frontal y maxima tension.", color: "legend" },
  { id: "hot-left", name: "Frontal izquierda", short: "FR", rect: [15, 28, 13, 44], price: 95, capacity: 12, multiplier: 1.2, vibe: "Ideal para faltas peligrosas y tiros desde la frontal.", color: "hot" },
  { id: "wing-top", name: "Banda norte", short: "BN", rect: [9, 0, 82, 22.5], price: 62, capacity: 28, multiplier: 0.9, vibe: "Carril para centros, conducciones y duelos.", color: "base" },
  { id: "wing-bottom", name: "Banda sur", short: "BS", rect: [9, 77.5, 82, 22.5], price: 62, capacity: 28, multiplier: 0.9, vibe: "Menos cara, muy viva si el partido se abre por banda.", color: "base" },
  { id: "middle", name: "Medio campo", short: "MC", rect: [28, 22.5, 44, 55], price: 58, capacity: 26, multiplier: 0.8, vibe: "Zona de ritmo: recuperaciones, conducciones y pases.", color: "base" },
  { id: "center-spot", name: "Punto central", short: "PC", rect: [43, 32, 14, 36], price: 88, capacity: 12, multiplier: 1.05, vibe: "El centro del partido. Buen equilibrio entre precio y accion.", color: "premium" },
  { id: "hot-right", name: "Frontal derecha", short: "FR", rect: [72, 28, 13, 44], price: 95, capacity: 12, multiplier: 1.2, vibe: "Ideal para faltas peligrosas y tiros desde la frontal.", color: "hot" },
  { id: "box-right", name: "Area derecha", short: "AR", rect: [85, 22.5, 15, 55], price: 115, capacity: 14, multiplier: 1.35, vibe: "Todo lo que pasa dentro del area pesa mas.", color: "hot" },
  { id: "penalty-right", name: "Punto penalti der.", short: "PP", rect: [86, 44, 6, 12], price: 165, capacity: 6, multiplier: 1.85, vibe: "Activo especial: penalti, remate frontal y maxima tension.", color: "legend" },
  { id: "goal-right", name: "Porteria derecha", short: "PO", rect: [94, 42, 6, 16], price: 150, capacity: 6, multiplier: 1.7, vibe: "La zona mas dramatica: goles, paradas y rebotes.", color: "legend" },
  { id: "corner-tr", name: "Corner norte der.", short: "CN", rect: [91, 0, 9, 16], price: 110, capacity: 8, multiplier: 1.35, vibe: "Mucho valor en corners, centros y segundas jugadas.", color: "premium" },
  { id: "corner-br", name: "Corner sur der.", short: "CS", rect: [91, 84, 9, 16], price: 110, capacity: 8, multiplier: 1.35, vibe: "Zona pequena, cara y con premio alto si hay balon parado.", color: "premium" }
];

const zonePriority = [
  "goal-left", "goal-right", "penalty-left", "penalty-right", "center-spot",
  "corner-tl", "corner-bl", "corner-tr", "corner-br",
  "box-left", "box-right", "hot-left", "hot-right",
  "wing-top", "wing-bottom", "middle"
];

const defaultState = {
  currentUserId: null,
  currentMatchId: "wc26-001",
  currentRoomId: "room-wc26-001-public",
  selectedZoneId: "center-spot",
  demoOpenMatchIds: ["wc26-001"],
  lastEventZoneId: null,
  users: [],
  gameRooms: [],
  reservations: [],
  events: []
};

const StorageService = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultState);
      return { ...structuredClone(defaultState), ...JSON.parse(raw) };
    } catch {
      return structuredClone(defaultState);
    }
  },
  save(nextState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }
};

const state = StorageService.load();

const AuthService = {
  login(name) {
    const cleanName = name.trim();
    if (!cleanName) return null;
    const existing = state.users.find((user) => user.name.toLowerCase() === cleanName.toLowerCase());
    const user = existing ?? {
      id: `user-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      name: cleanName,
      createdAt: new Date().toISOString()
    };
    if (!existing) state.users.push(user);
    state.currentUserId = user.id;
    saveAndRender();
    return user;
  },
  currentUser() {
    return state.users.find((user) => user.id === state.currentUserId) ?? null;
  }
};

const MatchService = {
  all() {
    return matches;
  },
  current() {
    return matches.find((match) => match.id === state.currentMatchId) ?? matches[0];
  },
  select(matchId) {
    state.currentMatchId = matchId;
    const publicRoom = RoomService.ensureRoomsForMatch(matchId)[0];
    state.currentRoomId = publicRoom.id;
    state.selectedZoneId = "center-spot";
    saveAndRender();
  },
  getStatus(match) {
    if (state.demoOpenMatchIds.includes(match.id)) return "open_for_reservations";
    const kickoff = new Date(match.kickoff);
    const now = new Date();
    const openAt = new Date(kickoff.getTime() - 48 * 60 * 60 * 1000);
    const lockAt = new Date(kickoff.getTime() - 15 * 60 * 1000);
    const finishAt = new Date(kickoff.getTime() + 130 * 60 * 1000);

    if (now < openAt) return "upcoming";
    if (now >= openAt && now < lockAt) return "open_for_reservations";
    if (now >= lockAt && now < kickoff) return "locked";
    if (now >= kickoff && now < finishAt) return "live";
    return "finished";
  },
  toggleDemoOpen(matchId) {
    if (!state.demoOpenMatchIds.includes(matchId)) state.demoOpenMatchIds.push(matchId);
    saveAndRender();
  }
};

const RoomService = {
  ensureRoomsForMatch(matchId) {
    const existing = state.gameRooms.filter((room) => room.matchId === matchId);
    if (existing.length) return existing;

    const nextRooms = [
      { id: `room-${matchId}-public`, matchId, name: "Sala publica", type: "public", createdAt: new Date().toISOString() },
      { id: `room-${matchId}-friends`, matchId, name: "Sala amigos", type: "private", createdAt: new Date().toISOString() }
    ];
    state.gameRooms.push(...nextRooms);
    return nextRooms;
  },
  current() {
    return state.gameRooms.find((room) => room.id === state.currentRoomId) ?? this.ensureRoomsForMatch(state.currentMatchId)[0];
  },
  select(roomId) {
    state.currentRoomId = roomId;
    saveAndRender();
  },
  forCurrentMatch() {
    return this.ensureRoomsForMatch(state.currentMatchId);
  }
};

const ReservationService = {
  forRoom(roomId = state.currentRoomId) {
    return state.reservations.filter((reservation) => reservation.roomId === roomId);
  },
  forUser(userId, roomId = state.currentRoomId) {
    return this.forRoom(roomId).filter((reservation) => reservation.userId === userId);
  },
  forZone(zoneId, roomId = state.currentRoomId) {
    return this.forRoom(roomId).filter((reservation) => reservation.zoneId === zoneId);
  },
  dynamicPrice(zoneId, roomId = state.currentRoomId) {
    const zone = getZone(zoneId);
    const demand = this.forZone(zoneId, roomId).length;
    return zone.price + demand * 12;
  },
  reserve(zoneId) {
    const user = AuthService.currentUser();
    const match = MatchService.current();
    const status = MatchService.getStatus(match);
    const zone = getZone(zoneId);
    if (!user || !zone) return showToast("Entra como jugador para reservar.");
    if (status !== "open_for_reservations") return showToast("Este partido aun no acepta reservas.");
    if (this.forUser(user.id).length >= MAX_RESERVATIONS_PER_PLAYER) return showToast("Modo rapido: solo 3 zonas por jugador.");
    if (this.forUser(user.id).some((item) => item.zoneId === zoneId)) return showToast("Ya tienes esta zona reservada.");
    if (this.forZone(zoneId).length >= zone.capacity) return showToast("Zona completa. Prueba otra.");

    const price = this.dynamicPrice(zoneId);
    const wallet = ScoreService.wallet(user.id);
    if (wallet.remaining < price) return showToast("No tienes puntos suficientes para esta zona.");

    state.reservations.push({
      id: `reservation-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      roomId: state.currentRoomId,
      matchId: state.currentMatchId,
      userId: user.id,
      zoneId,
      price,
      createdAt: new Date().toISOString()
    });
    showToast(`${zone.name} reservada. A jugar.`);
    saveAndRender();
  }
};

const EventService = {
  forMatch(matchId = state.currentMatchId) {
    return state.events.filter((event) => event.matchId === matchId);
  },
  create({ matchId, minute, player, team, eventType, x, y }) {
    const zone = mapCoordinatesToZone(Number(x), Number(y));
    const event = {
      id: `event-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      matchId,
      roomId: state.currentRoomId,
      minute: Number(minute) || 1,
      player: player.trim() || "Jugador",
      team,
      eventType,
      x: clamp(Number(x), 0, PITCH_LENGTH),
      y: clamp(Number(y), 0, PITCH_WIDTH),
      zoneId: zone.id,
      createdAt: new Date().toISOString()
    };
    state.events.push(event);
    state.lastEventZoneId = zone.id;
    showToast(`${eventTypes[eventType].energy} ${zone.name}`);
    saveAndRender();
    window.setTimeout(() => {
      state.lastEventZoneId = null;
      saveAndRender();
    }, 1200);
  }
};

const ScoreService = {
  wallet(userId) {
    const spent = ReservationService.forUser(userId).reduce((sum, reservation) => sum + reservation.price, 0);
    return { budget: DEFAULT_BUDGET, spent, remaining: DEFAULT_BUDGET - spent };
  },
  pointsForEvent(event, userId) {
    const reserved = ReservationService.forUser(userId, state.currentRoomId).some((reservation) => reservation.zoneId === event.zoneId);
    if (!reserved || event.matchId !== state.currentMatchId) return 0;
    const zone = getZone(event.zoneId);
    const base = eventTypes[event.eventType]?.points ?? 0;
    return Math.round(base * zone.multiplier);
  },
  scoreForUser(userId) {
    return EventService.forMatch(state.currentMatchId).reduce((sum, event) => sum + this.pointsForEvent(event, userId), 0);
  },
  ranking() {
    return state.users
      .map((user) => ({
        user,
        points: this.scoreForUser(user.id),
        wallet: this.wallet(user.id),
        reservations: ReservationService.forUser(user.id)
      }))
      .filter((row) => row.reservations.length || row.points > 0 || userIsCurrent(row.user.id))
      .sort((a, b) => b.points - a.points || b.wallet.remaining - a.wallet.remaining);
  }
};

const dom = {
  matchTitle: document.querySelector("#match-title"),
  matchMeta: document.querySelector("#match-meta"),
  playerHud: document.querySelector("#player-hud"),
  fixtureList: document.querySelector("#fixture-list"),
  fixtureListUpcoming: document.querySelector("#fixture-list-upcoming"),
  demoOpenMatch: document.querySelector("#demo-open-match"),
  authForm: document.querySelector("#auth-form"),
  authName: document.querySelector("#auth-name"),
  roomList: document.querySelector("#room-list"),
  roomLabel: document.querySelector("#room-label"),
  matchStatus: document.querySelector("#match-status"),
  reservationLimit: document.querySelector("#reservation-limit"),
  zoneLayer: document.querySelector("#zone-layer"),
  liveFeed: document.querySelector("#live-feed"),
  zonePanel: document.querySelector("#zone-panel"),
  scoreboard: document.querySelector("#scoreboard"),
  eventForm: document.querySelector("#event-form"),
  eventMatch: document.querySelector("#event-match"),
  eventMinute: document.querySelector("#event-minute"),
  eventPlayer: document.querySelector("#event-player"),
  eventTeam: document.querySelector("#event-team"),
  eventType: document.querySelector("#event-type"),
  eventX: document.querySelector("#event-x"),
  eventY: document.querySelector("#event-y")
};

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function getZone(zoneId) {
  return visibleZones.find((zone) => zone.id === zoneId);
}

function userIsCurrent(userId) {
  return state.currentUserId === userId;
}

function saveAndRender() {
  StorageService.save(state);
  render();
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" }).format(new Date(`${dateString}T12:00:00`));
}

function statusLabel(status) {
  return {
    upcoming: "Proximamente",
    open_for_reservations: "Reservas abiertas",
    locked: "Cerrado",
    live: "En directo",
    finished: "Finalizado"
  }[status] ?? status;
}

function showToast(message) {
  dom.liveFeed.dataset.toast = message;
  window.setTimeout(() => {
    if (dom.liveFeed.dataset.toast === message) delete dom.liveFeed.dataset.toast;
    renderLiveFeed();
  }, 1800);
  renderLiveFeed();
}

function mapCoordinatesToZone(x, y) {
  const px = clamp(x, 0, PITCH_LENGTH) / PITCH_LENGTH * 100;
  const py = clamp(y, 0, PITCH_WIDTH) / PITCH_WIDTH * 100;
  for (const zoneId of zonePriority) {
    const zone = getZone(zoneId);
    const [left, top, width, height] = zone.rect;
    if (px >= left && px <= left + width && py >= top && py <= top + height) return zone;
  }
  return getZone("middle");
}

function render() {
  RoomService.ensureRoomsForMatch(state.currentMatchId);
  renderHeader();
  renderFixture();
  renderRooms();
  renderZones();
  renderZonePanel();
  renderLiveFeed();
  renderScoreboard();
  renderAdmin();
}

function renderHeader() {
  const match = MatchService.current();
  const user = AuthService.currentUser();
  const room = RoomService.current();
  const status = MatchService.getStatus(match);
  dom.matchTitle.textContent = match.label;
  dom.matchMeta.textContent = `${match.stage} - ${formatDate(match.date)} - ${match.venue}`;
  dom.roomLabel.textContent = room.name;
  dom.matchStatus.textContent = statusLabel(status);
  dom.matchStatus.className = `status-pill status-${status}`;
  dom.reservationLimit.textContent = `${MAX_RESERVATIONS_PER_PLAYER} zonas max.`;

  if (!user) {
    dom.playerHud.innerHTML = `
      <div class="hud-name">Entra para jugar</div>
      <p class="match-meta">Reserva 3 zonas y sigue el marcador en directo.</p>
    `;
    return;
  }

  const wallet = ScoreService.wallet(user.id);
  const reservations = ReservationService.forUser(user.id);
  dom.playerHud.innerHTML = `
    <div class="hud-name">${user.name}</div>
    <div class="hud-grid">
      <div class="hud-stat"><span>Puntos</span><strong>${ScoreService.scoreForUser(user.id)}</strong></div>
      <div class="hud-stat"><span>Te quedan</span><strong>${wallet.remaining}</strong></div>
      <div class="hud-stat"><span>Zonas</span><strong>${reservations.length}/${MAX_RESERVATIONS_PER_PLAYER}</strong></div>
    </div>
  `;
}

function renderFixture() {
  const current = MatchService.current();
  const currentStatus = MatchService.getStatus(current);
  dom.fixtureList.innerHTML = `
    <button class="fixture-item active" type="button" data-match-id="${current.id}">
      <span class="fixture-main">
        <span>${current.home} vs ${current.away}</span>
        <span class="status-pill status-${currentStatus}">${statusLabel(currentStatus)}</span>
      </span>
      <span class="fixture-meta">${formatDate(current.date)} · ${current.venue}</span>
    </button>
  `;
  const upcomingEl = document.querySelector("#fixture-list-upcoming");
  if (upcomingEl) {
    upcomingEl.innerHTML = MatchService.all()
      .filter(m => m.id !== current.id)
      .map((match) => {
        const status = MatchService.getStatus(match);
        return `
          <button class="fixture-item ${match.id === state.currentMatchId ? "active" : ""}" type="button" data-match-id="${match.id}">
            <span class="fixture-main">
              <span>${match.home} vs ${match.away}</span>
              <span class="status-pill status-${status}">${statusLabel(status)}</span>
            </span>
            <span class="fixture-meta">${formatDate(match.date)} · ${match.venue}</span>
          </button>
        `;
      }).join("");
  }
}

function renderRooms() {
  dom.roomList.innerHTML = RoomService.forCurrentMatch().map((room) => {
    const reservations = ReservationService.forRoom(room.id).length;
    return `
      <button class="room-item ${room.id === state.currentRoomId ? "active" : ""}" type="button" data-room-id="${room.id}">
        <span class="fixture-main">
          <span>${room.name}</span>
          <span>${room.type === "public" ? "publica" : "privada"}</span>
        </span>
        <span class="room-meta">${reservations} reservas en esta sala</span>
      </button>
    `;
  }).join("");
}

function renderZones() {
  dom.zoneLayer.innerHTML = visibleZones.map((zone) => {
    const [left, top, width, height] = zone.rect;
    const demand = ReservationService.forZone(zone.id).length;
    const hasUserReservation = AuthService.currentUser() && ReservationService.forUser(AuthService.currentUser().id).some((item) => item.zoneId === zone.id);
    const classes = [
      "visible-zone",
      `zone-${zone.color}`,
      zone.id === state.selectedZoneId ? "selected" : "",
      hasUserReservation ? "reserved" : "",
      state.lastEventZoneId === zone.id ? "event-glow" : ""
    ].filter(Boolean).join(" ");

    return `
      <button
        type="button"
        class="${classes}"
        data-zone-id="${zone.id}"
        style="left:${left}%;top:${top}%;width:${width}%;height:${height}%;"
        aria-label="${zone.name}"
      >
        <span class="zone-label">${zone.name}</span>
        <span class="zone-price">${ReservationService.dynamicPrice(zone.id)} pts</span>
        <span class="zone-fill">${demand}/${zone.capacity}</span>
      </button>
    `;
  }).join("");
}

function renderZonePanel() {
  const zone = getZone(state.selectedZoneId);
  const user = AuthService.currentUser();
  const price = ReservationService.dynamicPrice(zone.id);
  const reservations = ReservationService.forZone(zone.id);
  const userReservations = user ? ReservationService.forUser(user.id) : [];
  const alreadyReserved = userReservations.some((item) => item.zoneId === zone.id);
  const status = MatchService.getStatus(MatchService.current());
  const disabled = !user || alreadyReserved || status !== "open_for_reservations" || userReservations.length >= MAX_RESERVATIONS_PER_PLAYER || reservations.length >= zone.capacity;
  const buttonText = !user
    ? "Entra para reservar"
    : alreadyReserved
      ? "Ya es tuya"
      : status !== "open_for_reservations"
        ? "Reservas cerradas"
        : "Reservar zona";

  const potentialLabel = zone.multiplier >= 1.7 ? "MUY ALTO" : zone.multiplier >= 1.3 ? "ALTO" : zone.multiplier >= 1.0 ? "MEDIO" : "BAJO";
  const myZoneRows = userReservations.map(r => {
    const z = getZone(r.zoneId);
    const dotColor = z.color === "legend" ? "#c0392b" : z.color === "premium" ? "#d4a847" : z.color === "hot" ? "#d47020" : "#4caf87";
    return `<div class="my-zone-row">
      <span class="my-zone-dot" style="background:${dotColor}"></span>
      <span class="my-zone-name">${z.name}</span>
      <span class="my-zone-pts">${r.price} pts</span>
    </div>`;
  }).join("");
  const totalSpent = userReservations.reduce((s, r) => s + r.price, 0);

  dom.zonePanel.innerHTML = `
    <h2>${zone.name}</h2>
    <p>${zone.vibe}</p>
    <div class="zone-stats">
      <div class="zone-stat"><span>Precio</span><strong>${price} pts</strong></div>
      <div class="zone-stat"><span>Potencial</span><strong style="color:var(--red);font-size:0.9rem">${potentialLabel}</strong></div>
      <div class="zone-stat"><span>Plazas</span><strong>${reservations.length}/${zone.capacity}</strong></div>
    </div>
    <button class="reserve-button" type="button" data-reserve-zone="${zone.id}" ${disabled ? "disabled" : ""}>${buttonText}</button>
    <span class="reserve-cost">Te costará ${price} puntos</span>
    ${userReservations.length ? `
    <div class="my-zones-block">
      <div class="my-zones-header">
        <span>MIS ZONAS (${userReservations.length}/${MAX_RESERVATIONS_PER_PLAYER})</span>
      </div>
      ${myZoneRows}
      <div class="my-zones-total">
        <span>TOTAL</span>
        <strong>${totalSpent} PUNTOS</strong>
      </div>
      <button class="confirm-button" type="button">CONFIRMAR RESERVAS</button>
    </div>` : ""}
  `;
}

function renderLiveFeed() {
  const toast = dom.liveFeed.dataset.toast;
  const events = EventService.forMatch(state.currentMatchId).slice(-5).reverse();
  if (toast) {
    dom.liveFeed.innerHTML = `<article class="feed-item event-glow"><strong>${toast}</strong><span class="feed-meta">Celebracion PitchScore</span></article>`;
    return;
  }
  if (!events.length) {
    dom.liveFeed.innerHTML = `<article class="feed-item"><strong>Esperando el primer evento</strong><span class="feed-meta">El panel admin permite simular acciones reales con coordenadas x/y.</span></article>`;
    return;
  }
  dom.liveFeed.innerHTML = events.map((event) => {
    const zone = getZone(event.zoneId);
    const type = eventTypes[event.eventType];
    return `
      <article class="feed-item">
        <strong>${type.label} - ${zone.name}</strong>
        <span class="feed-meta">Min ${event.minute} - ${event.player} - x${event.x}, y${event.y}</span>
      </article>
    `;
  }).join("");
}

function renderScoreboard() {
  const ranking = ScoreService.ranking();
  if (!ranking.length) {
    dom.scoreboard.innerHTML = `<article class="score-row"><strong>Sin marcador aun</strong><span class="score-meta">Entra, reserva zonas y lanza eventos.</span></article>`;
    return;
  }
  dom.scoreboard.innerHTML = ranking.map((row, index) => `
    <article class="score-row">
      <div class="score-main"><strong>#${index + 1} ${row.user.name}</strong><span>${row.points}</span></div>
      <span class="score-meta">${row.reservations.length} zonas - ${row.wallet.remaining} pts libres</span>
    </article>
  `).join("");
}

function renderAdmin() {
  dom.eventMatch.innerHTML = matches.map((match) => `<option value="${match.id}" ${match.id === state.currentMatchId ? "selected" : ""}>${match.label}</option>`).join("");
  dom.eventTeam.innerHTML = `
    <option value="${MatchService.current().home}">${MatchService.current().home}</option>
    <option value="${MatchService.current().away}">${MatchService.current().away}</option>
  `;
  dom.eventType.innerHTML = Object.entries(eventTypes).map(([id, type]) => `<option value="${id}">${type.label}</option>`).join("");
}

document.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-match-id]");
  if (btn && (btn.closest("#fixture-list") || btn.closest("#fixture-list-upcoming"))) {
    MatchService.select(btn.dataset.matchId);
  }
});
// keep legacy listener stub
const _legacyFixture = { addEventListener: () => {} };
_legacyFixture.addEventListener("click", (event) => {
  const button = event.target.closest("[data-match-id]");
  if (button) MatchService.select(button.dataset.matchId);
});

dom.roomList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-room-id]");
  if (button) RoomService.select(button.dataset.roomId);
});

dom.zoneLayer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-zone-id]");
  if (!button) return;
  state.selectedZoneId = button.dataset.zoneId;
  saveAndRender();
});

dom.zonePanel.addEventListener("click", (event) => {
  const button = event.target.closest("[data-reserve-zone]");
  if (button) ReservationService.reserve(button.dataset.reserveZone);
});

dom.authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  AuthService.login(dom.authName.value);
  dom.authName.value = "";
});

dom.demoOpenMatch.addEventListener("click", () => {
  MatchService.toggleDemoOpen(state.currentMatchId);
});

dom.eventForm.addEventListener("submit", (event) => {
  event.preventDefault();
  EventService.create({
    matchId: dom.eventMatch.value,
    minute: dom.eventMinute.value,
    player: dom.eventPlayer.value,
    team: dom.eventTeam.value,
    eventType: dom.eventType.value,
    x: dom.eventX.value,
    y: dom.eventY.value
  });
});

render();
