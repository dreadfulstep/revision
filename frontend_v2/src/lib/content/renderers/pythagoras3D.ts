import { ResolvedVars } from "../types";
import { svgWrap, STROKE, STROKE_DIM, AMBER, BLUE_STR, GREEN } from "./colours";

export function renderPythagoras3D(vars: ResolvedVars): string {
  const l = Number(vars.l ?? 6);
  const w = Number(vars.w ?? 4);
  const h = Number(vars.h ?? 3);
  const unknown = String(vars.unknown ?? "diagonal");
  const W = 290, H = 215;

  const ox = 58, oy = 158;
  const dx = 118, dep = 48, depy = -24, dz = -96;

  const pts = {
    A: [ox,        oy         ] as [number,number],
    B: [ox+dx,     oy         ] as [number,number],
    C: [ox+dx+dep, oy+depy    ] as [number,number],
    D: [ox+dep,    oy+depy    ] as [number,number],
    E: [ox,        oy+dz      ] as [number,number],
    F: [ox+dx,     oy+dz      ] as [number,number],
    G: [ox+dx+dep, oy+depy+dz ] as [number,number],
    H: [ox+dep,    oy+depy+dz ] as [number,number],
  };

  const face = (keys: (keyof typeof pts)[], fill: string, op: number) => {
    const p = keys.map(k => pts[k]!.join(",")).join(" ");
    return `<polygon points="${p}" fill="${fill}" fill-opacity="${op}" stroke-opacity=0.4 stroke="${STROKE}" stroke-width="1.4"/>`;
  };

  const diagLabel = unknown === "diagonal"
    ? "?"
    : `${Math.sqrt(l*l+w*w+h*h).toFixed(2)} cm`;
  const diagClass = unknown === "diagonal" ? "unkn" : "lbl";

  const A = pts.A, B = pts.B, G = pts.G, F = pts.F, C = pts.C;

  return svgWrap(W, H, `
    ${face(["A","B","C","D"], STROKE_DIM, 0.04)}
    ${face(["A","B","F","E"], AMBER, 0.07)}
    ${face(["B","C","G","F"], AMBER, 0.05)}
    ${face(["E","F","G","H"], AMBER, 0.11)}
    <!-- Hidden edges -->
    <line x1="${pts.A[0]}" y1="${pts.A[1]}" x2="${pts.D[0]}" y2="${pts.D[1]}"
      stroke="${STROKE_DIM}" stroke-width="1" stroke-dasharray="4 3" opacity="0.4"/>
    <line x1="${pts.A[0]}" y1="${pts.A[1]}" x2="${pts.E[0]}" y2="${pts.E[1]}"
      stroke="${STROKE_DIM}" stroke-width="1" stroke-dasharray="4 3" opacity="0.4"/>
    <line x1="${pts.D[0]}" y1="${pts.D[1]}" x2="${pts.H[0]}" y2="${pts.H[1]}"
      stroke="${STROKE_DIM}" stroke-width="1" stroke-dasharray="4 3" opacity="0.4"/>
    <!-- Base diagonal -->
    <line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}"
      stroke="${GREEN}" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.7"/>
    <!-- Space diagonal -->
    <line x1="${A[0]}" y1="${A[1]}" x2="${G[0]!}" y2="${G[1]!}"
      stroke="${BLUE_STR}" stroke-width="2.5" stroke-dasharray="7 3"/>
    <circle cx="${A[0]}" cy="${A[1]}" r="3.5" fill="${STROKE}"/>
    <circle cx="${G[0]!}" cy="${G[1]!}" r="3.5" fill="${BLUE_STR}"/>
    <!-- Dimension labels — offset to avoid overlapping edges -->
    <text text-anchor="middle" x="${(A[0]+B[0])/2}" y="${A[1]+20}" class="lbl">${l} cm</text>
    <text text-anchor="start"  x="${B[0]+15}" y="${(B[1]+C[1]!)/2+25}" class="lbl">${w} cm</text>
    <text text-anchor="start"  x="${F[0]+60}" y="${(F[1]+G[1]!)/2+40}" class="lbl">${h} cm</text>
    <!-- Diagonal label — offset left of line midpoint -->
    <text text-anchor="end"
      x="${((A[0]+G[0]!)/2 - 6).toFixed(2)}"
      y="${((A[1]+G[1]!)/2 - 8).toFixed(2)}"
      class="${diagClass}">${diagLabel}</text>
  `);
}