// Geometría de las zonas de Kancha, replicada de pitchscore.js (PF, rectFor,
// circleFor, cornerGeo). Si la geometría cambia allí, hay que actualizarla aquí.
// Expone locateZone(x, y) con coordenadas StatsBomb (campo 120x80).

const PF = (() => {
  const W = 1000, H = 700, PX0 = 58, PY0 = 66, PW = 884, PH = 568;
  const PX1 = PX0 + PW, PY1 = PY0 + PH, CX = W / 2, CY = H / 2;
  const BOXD = 139, BOXY0 = 182, BOXY1 = 518, GA_D = 46, GAY0 = 273, GAY1 = 427;
  const MX0 = PX0 + BOXD, MX1 = PX1 - BOXD;
  const PSPOT_L = PX0 + 93, PSPOT_R = PX1 - 93;
  const SPOT_R = 13, CORNER_R = 46;
  const STEP = (MX1 - MX0) / 4;
  const WING_EDGES = [PX0, MX0, MX0 + STEP, CX, MX1 - STEP, MX1, PX1];
  const LANE_Y = [BOXY0, BOXY0 + (BOXY1 - BOXY0) / 3, BOXY0 + 2 * (BOXY1 - BOXY0) / 3, BOXY1];
  return { W, H, PX0, PY0, PW, PH, PX1, PY1, CX, CY, BOXD, BOXY0, BOXY1, GA_D, GAY0, GAY1, MX0, MX1, PSPOT_L, PSPOT_R, SPOT_R, CORNER_R, STEP, WING_EDGES, LANE_Y };
})();

const ZONES = [];
const Z = (z) => ZONES.push(z);

Z({ id: "corner_n_izq", name: "Córner superior izquierdo", kind: "corner", v: "n", h: "izq" });
Z({ id: "corner_n_der", name: "Córner superior derecho",   kind: "corner", v: "n", h: "der" });
Z({ id: "corner_s_izq", name: "Córner inferior izquierdo", kind: "corner", v: "s", h: "izq" });
Z({ id: "corner_s_der", name: "Córner inferior derecho",   kind: "corner", v: "s", h: "der" });

["izq", "der"].forEach((side) => {
  const lado = side === "izq" ? "izquierda" : "derecha";
  const ladoM = side === "izq" ? "izquierdo" : "derecho";
  Z({ id: `box6_${side}`,    name: `Área pequeña ${lado}`,              kind: "box6",     side });
  Z({ id: `boxN_${side}`,    name: `Área grande ${lado} · flanco sup.`, kind: "boxband",  side, band: "N" });
  Z({ id: `boxS_${side}`,    name: `Área grande ${lado} · flanco inf.`, kind: "boxband",  side, band: "S" });
  Z({ id: `boxF_${side}`,    name: `Frontal del área ${lado}`,          kind: "boxfront", side });
  Z({ id: `penspot_${side}`, name: `Punto de penalti ${ladoM}`,         kind: "spot",     side });
});

[["izq", "Banda izquierda"], ["der", "Banda derecha"]].forEach(([side, lane]) => {
  for (let c = 0; c < 6; c++) {
    Z({ id: `wing_${side}_${c}`, name: `${lane} · sector ${c + 1}`, kind: "grid", grid: "wing", side, col: c, cols: 6 });
  }
});

[["cil", "Carril central izquierdo"], ["med", "Mediocampo"], ["cid", "Carril central derecho"]]
  .forEach(([key, lane], li) => {
    for (let c = 0; c < 4; c++) {
      Z({ id: `${key}_${c}`, name: `${lane} · sector ${c + 1}`, kind: "grid", grid: "central", lane: li, col: c, cols: 4 });
    }
  });

Z({ id: "centerspot", name: "Punto central de saque", kind: "cspot" });

function rectFor(z) {
  const p = PF;
  switch (z.kind) {
    case "grid": {
      if (z.grid === "wing") {
        const x0 = p.WING_EDGES[z.col], x1 = p.WING_EDGES[z.col + 1];
        const y = z.side === "izq" ? p.PY0 : p.BOXY1;
        return { x: x0, y, w: x1 - x0, h: p.BOXY0 - p.PY0 };
      }
      const w = (p.MX1 - p.MX0) / z.cols, x = p.MX0 + z.col * w;
      return { x, y: p.LANE_Y[z.lane], w, h: p.LANE_Y[z.lane + 1] - p.LANE_Y[z.lane] };
    }
    case "box6":     { const x = z.side === "izq" ? p.PX0 : p.PX1 - p.GA_D; return { x, y: p.GAY0, w: p.GA_D, h: p.GAY1 - p.GAY0 }; }
    case "boxfront": { const x = z.side === "izq" ? p.PX0 + p.GA_D : p.MX1; return { x, y: p.GAY0, w: p.BOXD - p.GA_D, h: p.GAY1 - p.GAY0 }; }
    case "boxband":  { const x = z.side === "izq" ? p.PX0 : p.PX1 - p.BOXD, y = z.band === "N" ? p.BOXY0 : p.GAY1, h = z.band === "N" ? p.GAY0 - p.BOXY0 : p.BOXY1 - p.GAY1; return { x, y, w: p.BOXD, h }; }
    default: return null;
  }
}

function circleFor(z) {
  const p = PF;
  if (z.kind === "spot")  return { cx: z.side === "izq" ? p.PSPOT_L : p.PSPOT_R, cy: p.CY, r: p.SPOT_R };
  if (z.kind === "cspot") return { cx: p.CX, cy: p.CY, r: p.SPOT_R };
  return null;
}

function contains(z, px, py) {
  if (z.kind === "corner") {
    const cx = z.h === "izq" ? PF.PX0 : PF.PX1, cy = z.v === "n" ? PF.PY0 : PF.PY1;
    return Math.hypot(px - cx, py - cy) <= PF.CORNER_R;
  }
  const c = circleFor(z);
  if (c) return Math.hypot(px - c.cx, py - c.cy) <= c.r;
  const r = rectFor(z);
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

// Las zonas pequeñas (puntos de penalti, saque, córners) y las áreas se
// comprueban antes que las rejillas que tienen debajo.
const PRIORITY = { spot: 0, cspot: 0, corner: 1, box6: 2, boxfront: 2, boxband: 2, grid: 3 };
const ORDERED = [...ZONES].sort((a, b) => PRIORITY[a.kind] - PRIORITY[b.kind]);

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// StatsBomb: x 0-120 (hacia la portería rival), y 0-80 (de banda a banda).
function sbToCanvas(x, y) {
  return {
    px: clamp(PF.PX0 + (x / 120) * PF.PW, PF.PX0, PF.PX1),
    py: clamp(PF.PY0 + (y / 80) * PF.PH, PF.PY0, PF.PY1),
  };
}

function locateZone(x, y) {
  const { px, py } = sbToCanvas(x, y);
  for (const z of ORDERED) if (contains(z, px, py)) return z;
  return null; // las rejillas cubren todo el campo: no debería ocurrir
}

module.exports = { PF, ZONES, locateZone, sbToCanvas };
