// KANCHA — Landing (entrada al juego). Reuses PitchField, HowIcon, Flag + data from the app.

const APP_URL = "/login";

/* ---- KANCHA wordmark (inline so it recolors via currentColor) ---- */
function Kancha({ className = "kn-wordmark" }) {
  return (
    <svg className={className} viewBox="0 0 156.63 18.31" role="img" aria-label="KANCHA">
      <polygon points="18.72 1.03 14.31 1.03 7.08 8.03 3.35 8.03 3.35 1.03 0 1.03 0 18.31 3.35 18.31 3.35 10.97 7.08 10.97 15.29 18.31 19.8 18.31 10 9.49 18.72 1.03"></polygon>
      <polygon points="72.34 13.66 58.32 .67 55.44 .67 55.44 18.31 58.77 18.31 58.77 5.33 72.8 18.31 75.67 18.31 75.67 .67 72.34 .67 72.34 13.66"></polygon>
      <path d="M96.42,10.66c-.37,2.74-3.74,4.72-8.02,4.72-4.92,0-8.1-2.44-8.1-6.21s3.18-6.23,8.1-6.23c4.13,0,7.47,1.95,7.94,4.64l.11.62h3.36l-.11-.85c-.57-4.33-5.22-7.35-11.31-7.35-7,0-11.52,3.6-11.52,9.17s4.41,9.14,11.52,9.14c6.27,0,10.96-3.08,11.4-7.48l.08-.82h-3.36l-.09.65Z"></path>
      <polygon points="117.65 7.83 104.36 7.83 104.36 .67 100.97 .67 100.97 18.31 104.36 18.31 104.36 10.81 117.65 10.81 117.65 18.31 121.06 18.31 121.06 .67 117.65 .67 117.65 7.83"></polygon>
      <path d="M20,18.31h4.24l5.17-5.17c2.29,1.82,5.16,2.82,8.11,2.82s5.81-1,8.11-2.82l5.17,5.17h4.24L37.52.79l-17.52,17.52ZM31.55,11l5.97-5.97,5.97,5.97c-1.73,1.29-3.78,1.96-5.97,1.96s-4.24-.68-5.97-1.96Z"></path>
      <path d="M139.11.79l-17.52,17.52h4.24l5.17-5.17c2.29,1.82,5.16,2.82,8.11,2.82s5.81-1,8.11-2.82l5.17,5.17h4.24L139.11.79ZM139.11,12.96c-2.18,0-4.24-.68-5.97-1.96l5.97-5.97,5.97,5.97c-1.73,1.29-3.78,1.96-5.97,1.96Z"></path>
      <circle cx="88.33" cy="9.16" r="1.48" className="kn-wm-dot" style={{ fill: "rgba(200, 68, 46, 0)" }}></circle>
    </svg>);

}

const HEADLINES = {
  "Por zonas": <>El fútbol, <em>por zonas</em>. Tú decides dónde va a pasar.</>,
  "Reserva tu zona": <>Reserva tu zona. <em>Suma</em> en cuanto llega el balón.</>,
  "Lee el partido": <>No predices el resultado. <em>Lees</em> el partido.</>
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "Oscuro",
  "headline": "Por zonas",
  "accent": "#c8442e"
} /*EDITMODE-END*/;

/* ---- top navigation (no wordmark — the hero IS the wordmark) ---- */
function HeroNav() {
  return (
    <nav className="kn-nav">
      <span className="kn-eyebrow-line kn-nav-eyebrow"><span className="kn-star">★</span> Fútbol en juego · Mundial 2026</span>
      <div className="kn-nav-r">
        <a className="kn-btn kn-btn-ghost-light" href={APP_URL}>Entrar</a>
        <a className="kn-btn kn-btn-primary" href={APP_URL}>Crear cuenta</a>
      </div>
    </nav>);

}

/* ---- interactive field teaser ---- */
function FieldTeaser() {
  const match = FIXTURE[0];
  const [selected, setSelected] = React.useState(["penspot_izq", "med_2"]);
  const legend = [["#82a55c", "Bajo"], ["#d4a72c", "Medio"], ["#d6843a", "Alto"], ["#c8442e", "Premium"]];

  function toggle(z) {
    if (z.taken >= z.slots) return;
    setSelected((prev) =>
    prev.includes(z.id) ? prev.filter((id) => id !== z.id) :
    prev.length >= ME.zonesMax ? prev :
    [...prev, z.id]
    );
  }
  const zones = ZONES.map((z) => ({ ...z, taken: selected.includes(z.id) ? Math.min(z.slots, z.taken + 1) : z.taken }));

  return (
    <div className="kn-field-panel">
      <div className="kn-field-head">
        <span className="kn-fh-live"><span className="kn-live-pulse"></span> EN VIVO · 41'</span>
        <div className="kn-fh-match">
          <span className="kn-fh-team"><Flag code={match.home} h={16} /> {match.home}</span>
          <span className="kn-fh-vs">VS</span>
          <span className="kn-fh-team">{match.away} <Flag code={match.away} h={16} /></span>
        </div>
        <span className="kn-fh-cap"><b>{selected.length}</b> / {ME.zonesMax} zonas</span>
      </div>

      <div className="kn-field-stage">
        <PitchField zones={zones} selectedIds={selected} onZoneClick={toggle} />
      </div>

      <div className="kn-field-foot">
        <span className="kn-field-hint"><span className="kn-tap"></span> Toca una zona para reservarla</span>
        <span className="kn-field-legend">
          <span>Precio</span>
          <span className="kn-legend-dots">{legend.map(([c, l]) => <i key={l} style={{ background: c }} title={l}></i>)}</span>
        </span>
      </div>
    </div>);

}

/* ---- HERO ---- */
function Hero({ t }) {
  const variant = t.heroVariant === "Claro" ? "light" : "dark";
  return (
    <header className="kn-hero" data-variant={variant} data-screen-label="hero">
      <div className="kn-hero-shell">
        <HeroNav />
        <div className="kn-hero-poster">
          <Kancha className="kn-wordmark kn-hero-logo" />
          <div className="kn-hero-claim">Antes de que pase<span className="kn-dot">.</span></div>
          <h1 className="kn-hero-headline">{HEADLINES[t.headline] || HEADLINES["Por zonas"]}</h1>
          <p className="kn-hero-sub">
            Reserva las zonas del campo donde crees que pasará la acción. Cada gol, tiro o
            jugada en tus zonas suma puntos. Gana quien mejor lee el partido.
          </p>
          <div className="kn-hero-ctas">
            <a className="kn-btn kn-btn-primary kn-btn-lg" href={APP_URL}>Entrar al juego <span className="kn-btn-arrow">→</span></a>
            <a className="kn-btn kn-btn-ghost-light kn-btn-lg" href="#como">Cómo funciona</a>
          </div>
          <div className="kn-hero-trust">
            <span className="kn-star">★</span> Gratis para empezar · {ME.budget} puntos de bienvenida
          </div>
        </div>
        <div className="kn-hero-field"><FieldTeaser /></div>
      </div>
    </header>);

}

/* ---- CÓMO FUNCIONA ---- */
const STEPS = [
{ n: "01", icon: "cursor", t: "Elige tus zonas", d: "Reserva hasta 5 zonas del campo con tu presupuesto de puntos." },
{ n: "02", icon: "tv", t: "Mira el partido", d: "Sigue el encuentro en vivo, esté donde esté el balón." },
{ n: "03", icon: "ball", t: "Suma puntos", d: "Cada acción en tus zonas reservadas suma al marcador." },
{ n: "04", icon: "trophy", t: "Gana el marcador", d: "Quien mejor lee el partido se lleva la gloria de la jornada." }];

const FACTS = [
{ v: <>{ZONES.length}</>, l: "Zonas en juego por campo" },
{ v: <>{ME.zonesMax}</>, l: "Zonas que puedes reservar" },
{ v: <>{ME.budget}<small>pts</small></>, l: "De bienvenida al registrarte" }];


function ComoFunciona() {
  return (
    <section className="kn-section" id="como" data-screen-label="como-funciona">
      <div className="kn-section-head">
        <span className="kn-eyebrow-line kn-section-eyebrow"><span className="kn-star">★</span> En menos de un minuto <span className="kn-star">★</span></span>
        <h2 className="kn-section-title">Cómo funciona</h2>
        <p className="kn-section-sub">KANCHA convierte cualquier partido en un juego de lectura: no apuestas al resultado, reservas el terreno donde crees que se decidirá.</p>
      </div>
      <div className="kn-steps">
        {STEPS.map((s, i) =>
        <div className={`kn-step kn-step--${i + 1}`} key={s.n}>
            <div className="kn-step-n">{s.n}</div>
            <div className="kn-step-ic"><HowIcon name={s.icon} /></div>
            <div className="kn-step-t">{s.t.toUpperCase()}</div>
            <div className="kn-step-d">{s.d}</div>
          </div>
        )}
      </div>
      <div className="kn-facts">
        {FACTS.map((f, i) =>
        <div className="kn-fact" key={i}>
            <div className="kn-fact-v">{f.v}</div>
            <div className="kn-fact-l">{f.l}</div>
          </div>
        )}
      </div>
    </section>);

}

/* ---- PRUEBA SOCIAL / RANKING ---- */
// Podio ilustrativo de la landing (contenido de marketing, no datos de la app)
const PODIUM_SAMPLE = [
  { rank: 2, name: "Diego M.", handle: "diegoarg",  points: 11932, country: "ARG" },
  { rank: 1, name: "Lucía R.", handle: "lucy_goal", points: 12847, country: "ESP" },
  { rank: 3, name: "Yuki T.",  handle: "yukifc",    points: 11420, country: "JPN" },
];
function PruebaSocial() {
  const top = PODIUM_SAMPLE; // 2 · 1 · 3
  const medals = { 0: "👑", 1: "★", 2: "★" };
  return (
    <section className="kn-proof" id="ranking" data-screen-label="prueba-social">
      <div className="kn-section" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="kn-proof-grid">
          <div className="kn-proof-podium">
            <div className="kn-podium">
              {top.map((p) =>
              <div className={`kn-pod kn-pod-${p.rank}`} key={p.rank}>
                  <div className="kn-pod-card">
                    <div className="kn-pod-medal">{medals[p.rank - 1] || "★"}</div>
                    <Flag code={p.country} h={18} round />
                    <div className="kn-pod-name">{p.name}</div>
                    <div className="kn-pod-handle">@{p.handle}</div>
                    <div className="kn-pod-pts">{p.points.toLocaleString("es")}<small>PUNTOS</small></div>
                  </div>
                  <div className="kn-pod-step">{p.rank}</div>
                </div>
              )}
            </div>
            <div className="kn-you">
              <div className="kn-you-rank">#{ME.rank}</div>
              <div className="kn-you-meta">
                <span className="kn-you-lab">Tu posición de salida</span>
                <span className="kn-you-name">Tú · {ME.totalPoints.toLocaleString("es")} pts</span>
              </div>
              <a className="kn-btn kn-btn-ghost-dark kn-you-arrow" href={APP_URL}>Subir <span className="kn-btn-arrow">→</span></a>
            </div>
          </div>

          <div className="kn-proof-copy">
            <span className="kn-eyebrow-line kn-section-eyebrow">Clasificación en vivo</span>
            <div className="kn-q">Los que mejor <em>leen el partido</em> mandan en la tabla.</div>
            <p>Cada jornada del Mundial reordena el ranking. Reserva mejor que tus amigos, sube posiciones y demuestra quién entiende de verdad el juego — antes de que pase.</p>
            <a className="kn-btn kn-btn-primary kn-btn-lg" href={APP_URL}>Unirme a la clasificación <span className="kn-btn-arrow">→</span></a>
          </div>
        </div>
      </div>
    </section>);

}

/* ---- FINAL CTA ---- */
function FinalCTA() {
  return (
    <section className="kn-cta" data-screen-label="cta-final">
      <div className="kn-cta-inner">
        <span className="kn-eyebrow-line kn-cta-eyebrow"><span className="kn-star">★</span> Mundial 2026 · arranca el 11 de junio <span className="kn-star">★</span></span>
        <h2 className="kn-cta-title">Entra antes de que pase<span className="kn-dot">.</span></h2>
        <p className="kn-cta-sub">Crea tu cuenta gratis, recibe {ME.budget} puntos de bienvenida y reserva tu primera zona para el partido inaugural.</p>
        <div className="kn-cta-actions">
          <a className="kn-btn kn-btn-primary kn-btn-lg" href={APP_URL}>Entrar al juego <span className="kn-btn-arrow">→</span></a>
          <a className="kn-btn kn-btn-ghost-light kn-btn-lg" href={APP_URL}>Crear cuenta</a>
        </div>
      </div>
    </section>);

}

/* ---- FOOTER ---- */
function Footer() {
  return (
    <footer className="kn-footer">
      <div className="kn-footer-inner">
        <div className="kn-footer-brand">
          <Kancha className="kn-wordmark kn-footer-logo" />
          <div className="kn-footer-claim">Antes de que pase<span className="kn-dot">.</span></div>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: "#6f7567", margin: 0 }}>
            El fútbol del Mundial 2026, jugado por zonas. Reserva, mira y suma.
          </p>
        </div>
        <div className="kn-footer-cols">
          <div className="kn-footer-col">
            <h4>El juego</h4>
            <a href="#como">Cómo funciona</a>
            <a href={APP_URL}>Partidos</a>
            <a href="#ranking">Ranking</a>
            <a href={APP_URL}>Reglas y puntos</a>
          </div>
          <div className="kn-footer-col">
            <h4>Cuenta</h4>
            <a href={APP_URL}>Entrar</a>
            <a href={APP_URL}>Crear cuenta</a>
            <a href={APP_URL}>Mis reservas</a>
          </div>
          <div className="kn-footer-col">
            <h4>Mundial 2026</h4>
            <a href={APP_URL}>Fixture</a>
            <a href={APP_URL}>Grupos</a>
            <a href="#ranking">Amigos</a>
          </div>
        </div>
      </div>
      <div className="kn-footer-bar">
        <span>© 2026 KANCHA <span className="kn-star">·</span> Fútbol en juego</span>
        <span>Hecho para vivir el Mundial <span className="kn-star">★</span></span>
      </div>
    </footer>);

}

/* ---- ROOT ---- */
function Landing() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  return (
    <div className="kn-landing" style={{ "--accent": t.accent }}>
      <Hero t={t} />
      <div className="kn-seam"></div>
      <ComoFunciona />
      <PruebaSocial />
      <FinalCTA />
      <Footer />

      <TweaksPanel>
        <TweakSection label="Hero" />
        <TweakRadio label="Fondo del hero" value={t.heroVariant} options={["Oscuro", "Claro"]}
        onChange={(v) => setTweak("heroVariant", v)} />
        <TweakSelect label="Titular" value={t.headline} options={Object.keys(HEADLINES)}
        onChange={(v) => setTweak("headline", v)} />
        <TweakSection label="Marca" />
        <TweakColor label="Color de acento" value={t.accent}
        options={["#c8442e", "#d6843a", "#c9a227", "#3d6b32"]}
        onChange={(v) => setTweak("accent", v)} />
      </TweaksPanel>
    </div>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<Landing />);