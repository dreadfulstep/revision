import { ResolvedVars } from "../types";
import { svgWrap, STROKE, STROKE_DIM, AMBER, BLUE_STR } from "./colours";

export function renderLociConstruction(vars: ResolvedVars): string {
  const type = String(vars.type ?? "equidistant");
  const W = 260, H = 220;
  const cx = W / 2, cy = H / 2;

  if (type === "equidistant") {
    const ax = cx - 70, ay = cy + 20;
    const bx = cx + 70, by = cy - 20;
    const mx = (ax + bx) / 2, my = (ay + by) / 2;
    const dx = bx - ax, dy = by - ay;
    const len = Math.sqrt(dx*dx + dy*dy);
    const px = -dy/len * 85, py = dx/len * 85;

    return svgWrap(W, H, `
      <line x1="${(mx+px).toFixed(2)}" y1="${(my+py).toFixed(2)}"
            x2="${(mx-px).toFixed(2)}" y2="${(my-py).toFixed(2)}"
        stroke="${BLUE_STR}" stroke-width="2" stroke-dasharray="6 3"/>
      <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"
        stroke="${STROKE_DIM}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.5"/>
      <!-- Equal distance marks -->
      <line x1="${(mx + px*0.15 - dy*0.1).toFixed(2)}" y1="${(my + py*0.15 + dx*0.1).toFixed(2)}"
            x2="${(mx - px*0.15 - dy*0.1).toFixed(2)}" y2="${(my - py*0.15 + dx*0.1).toFixed(2)}"
        stroke="${STROKE}" stroke-width="1.5"/>
      <circle cx="${ax}" cy="${ay}" r="5" fill="${AMBER}"/>
      <circle cx="${bx}" cy="${by}" r="5" fill="${AMBER}"/>
      <circle cx="${mx.toFixed(2)}" cy="${my.toFixed(2)}" r="3" fill="${STROKE}"/>
      <text x="${ax - 14}" y="${ay + 4}" class="lbl">A</text>
      <text x="${bx + 6}" y="${by + 4}" class="lbl">B</text>
      <text text-anchor="middle" x="${W/2}" y="${H-4}" class="dim">Locus equidistant from A and B</text>
    `);
  }

  if (type === "equidistant-lines") {
    const vx = cx - 20, vy = cy + 30;
    const arm1Angle = (-30 * Math.PI) / 180;
    const arm2Angle = (-80 * Math.PI) / 180;
    const bisectorAngle = (arm1Angle + arm2Angle) / 2;
    const armLen = 100;

    return svgWrap(W, H, `
      <line x1="${vx}" y1="${vy}"
            x2="${(vx + armLen*Math.cos(arm1Angle)).toFixed(2)}"
            y2="${(vy + armLen*Math.sin(arm1Angle)).toFixed(2)}"
        stroke="${STROKE}" stroke-width="2"/>
      <line x1="${vx}" y1="${vy}"
            x2="${(vx + armLen*Math.cos(arm2Angle)).toFixed(2)}"
            y2="${(vy + armLen*Math.sin(arm2Angle)).toFixed(2)}"
        stroke="${STROKE}" stroke-width="2"/>
      <line x1="${vx}" y1="${vy}"
            x2="${(vx + armLen*Math.cos(bisectorAngle)).toFixed(2)}"
            y2="${(vy + armLen*Math.sin(bisectorAngle)).toFixed(2)}"
        stroke="${BLUE_STR}" stroke-width="2" stroke-dasharray="6 3"/>
      <!-- Arc ticks showing equal angles -->
      <path d="M ${(vx + 35*Math.cos(arm1Angle)).toFixed(2)} ${(vy + 35*Math.sin(arm1Angle)).toFixed(2)}
        A 35 35 0 0 0 ${(vx + 35*Math.cos(arm2Angle)).toFixed(2)} ${(vy + 35*Math.sin(arm2Angle)).toFixed(2)}"
        fill="none" stroke="${AMBER}" stroke-width="1.5"/>
      <circle cx="${vx}" cy="${vy}" r="4" fill="${STROKE}"/>
      <text text-anchor="middle" x="${W/2}" y="${H-4}" class="dim">Locus equidistant from two lines = angle bisector</text>
    `);
  }

  const r = 65;
  return svgWrap(W, H, `
    <circle cx="${cx}" cy="${cy}" r="${r}"
      fill="none" stroke="${BLUE_STR}" stroke-width="2" stroke-dasharray="8 4"/>
    <circle cx="${cx}" cy="${cy}" r="5" fill="${AMBER}"/>
    <line x1="${cx}" y1="${cy}" x2="${cx+r}" y2="${cy}"
      stroke="${STROKE_DIM}" stroke-width="1.2" stroke-dasharray="3 2"/>
    <text text-anchor="middle" x="${cx+r/2}" y="${cy-8}" class="lbl">3 cm</text>
    <text x="${cx+6}" y="${cy+4}" class="lbl">P</text>
  `);
}