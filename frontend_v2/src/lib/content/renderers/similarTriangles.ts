import { ResolvedVars } from "../types";
import { svgWrap, AMBER, BLUE_STR } from "./colours";

export function renderSimilarTriangles(vars: ResolvedVars): string {
  const a1 = Number(vars.a1 ?? 3);
  const b1 = Number(vars.b1 ?? 4);
  const a2 = Number(vars.a2 ?? 6);
  const unknown = String(vars.unknown ?? "b2");
  const scale = a2 / a1;
  const b2 = b1 * scale;
  const W = 320, H = 190;

  const s = { x0: 22, y0: 155, x1: 110, y1: 155, x2: 22, y2: 65 };
  const lw = (s.x1 - s.x0) * scale;
  const lh = (s.y0 - s.y2) * scale;
  const lx0 = 148, ly0 = 162;
  const l = { x0: lx0, y0: ly0, x1: lx0 + lw, y1: ly0, x2: lx0, y2: ly0 - lh };

  const clampedX1 = Math.min(l.x1, W - 12);
  const clampedY2 = Math.max(l.y2, 12);

  const b2Label = unknown === "b2" ? "?" : b2.toFixed(1);
  const b2Class = unknown === "b2" ? "unkn" : "lbl";

  return svgWrap(W, H, `
    <polygon points="${s.x0},${s.y0} ${s.x1},${s.y1} ${s.x2},${s.y2}"
      fill="${AMBER}" fill-opacity="0.14" stroke="${AMBER}" stroke-width="2"/>
    <polygon points="${l.x0},${l.y0} ${clampedX1},${l.y1} ${l.x2},${clampedY2}"
      fill="${BLUE_STR}" fill-opacity="0.12" stroke="${BLUE_STR}" stroke-width="2"/>
    <text text-anchor="middle" x="${(s.x0+s.x1)/2}" y="${s.y0+16}" class="lbl">${b1} cm</text>
    <text text-anchor="end"    x="${s.x0-6}" y="${(s.y0+s.y2)/2+4}" class="lbl">${a1} cm</text>
    <text text-anchor="middle" x="${(l.x0+clampedX1)/2}" y="${l.y1+16}" class="${b2Class}">${b2Label} cm</text>
    <text text-anchor="end"    x="${l.x0-6}" y="${(l.y0+clampedY2)/2+4}" class="lbl">${a2} cm</text>
  `);
}