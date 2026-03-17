import { ResolvedVars } from "../types";
import { svgWrap, STROKE, AMBER } from "./colours";

export function renderIsoscelesTriangle(vars: ResolvedVars): string {
  const base = Number(vars.base);
  const equal = Number(vars.equal_side);
  const unknown = String(vars.unknown ?? "angle");
  const W = 260, H = 210, margin = 30;

  const apex = { x: W / 2, y: margin };
  const bl   = { x: margin + 10, y: H - margin };
  const br   = { x: W - margin - 10, y: H - margin };

  const midL = { x: (apex.x + bl.x) / 2, y: (apex.y + bl.y) / 2 };
  const midR = { x: (apex.x + br.x) / 2, y: (apex.y + br.y) / 2 };
  const angleL = Math.atan2(bl.y - apex.y, bl.x - apex.x);
  const angleR = Math.atan2(br.y - apex.y, br.x - apex.x);

  function tick(cx: number, cy: number, angle: number) {
    const perp = angle + Math.PI / 2;
    const d = 5;
    return `<line x1="${(cx + Math.cos(perp)*d).toFixed(1)}" y1="${(cy + Math.sin(perp)*d).toFixed(1)}"
                  x2="${(cx - Math.cos(perp)*d).toFixed(1)}" y2="${(cy - Math.sin(perp)*d).toFixed(1)}"
                  stroke="${STROKE}" stroke-width="1.5"/>`;
  }

  const baseLabel = unknown === "base" ? "?" : `${base} cm`;
  const sideLabel = unknown === "side" ? "?" : `${equal} cm`;
  const sideClass = unknown === "side" ? "unkn" : "lbl";
  const baseClass = unknown === "base" ? "unkn" : "lbl";

  return svgWrap(W, H, `
    <polygon points="${apex.x},${apex.y} ${bl.x},${bl.y} ${br.x},${br.y}"
      fill="${AMBER}" fill-opacity="0.1" stroke="${STROKE}" stroke-width="2"/>
    ${tick(midL.x, midL.y, angleL)}
    ${tick(midR.x, midR.y, angleR)}
    <text text-anchor="middle" x="${(bl.x+br.x)/2}" y="${bl.y+18}" class="${baseClass}">${baseLabel}</text>
    <text text-anchor="end"    x="${midL.x - 10}"  y="${midL.y}"   class="${sideClass}">${sideLabel}</text>
    <text text-anchor="start"  x="${midR.x + 10}"  y="${midR.y}"   class="${sideClass}">${sideLabel}</text>
  `);
}