import { ResolvedVars } from "../types";
import { svgWrap, STROKE, AMBER } from "./colours";

export function renderRightTriangle(vars: ResolvedVars): string {
  const a = Number(vars.a);
  const b = Number(vars.b);
  const unknown = String(vars.unknown ?? "c");
  const hyp = Math.sqrt(a * a + b * b);
  const W = 260, H = 200, margin = 40;

  const x0 = margin,     y0 = H - margin;
  const x1 = W - margin, y1 = H - margin;
  const x2 = margin,     y2 = margin;

  const labelA = unknown === "a" ? "?" : `${a}`;
  const labelB = unknown === "b" ? "?" : `${b}`;
  const labelC = unknown === "c" ? "?" : hyp % 1 === 0 ? `${hyp}` : hyp.toFixed(2);

  const aClass = unknown === "a" ? "unkn" : "lbl";
  const bClass = unknown === "b" ? "unkn" : "lbl";
  const cClass = unknown === "c" ? "unkn" : "lbl";

  return svgWrap(W, H, `
    <polygon points="${x0},${y0} ${x1},${y1} ${x2},${y2}"
      fill="${AMBER}" fill-opacity="0.12" stroke="${STROKE}" stroke-width="2"/>
    <polyline points="${x0+14},${y0} ${x0+14},${y0-14} ${x0},${y0-14}"
      fill="none" stroke="${STROKE}" stroke-width="1.5"/>
    <text text-anchor="middle" x="${(x0+x1)/2}" y="${y0+18}" class="${aClass}">${labelA}</text>
    <text text-anchor="middle" x="${x0-18}" y="${(y0+y2)/2+5}" class="${bClass}">${labelB}</text>
    <text text-anchor="middle" x="${(x1+x2)/2+14}" y="${(y1+y2)/2}" class="${cClass}">${labelC}</text>
  `);
}