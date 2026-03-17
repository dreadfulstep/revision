import { ResolvedVars } from "../types";
import { svgWrap, STROKE, STROKE_DIM, AMBER, BLUE_STR } from "./colours";

export function renderAnglesParallel(vars: ResolvedVars): string {
  const known = Number(vars.known_angle);
  const type  = String(vars.angle_type ?? "alternate");
  const W = 300, H = 210;

  const y1 = 75, y2 = 148;
  const ix1 = 105, ix2 = 200;

  const tA = Math.atan2(y2 - y1, ix2 - ix1);
  const ext = 68;
  const tx0 = ix1 - ext * Math.cos(tA), ty0 = y1 - ext * Math.sin(tA);
  const tx1 = ix2 + ext * Math.cos(tA), ty1 = y2 + ext * Math.sin(tA);

  function sector(
    cx: number, cy: number, rad: number,
    startAngle: number, endAngle: number,
    color: string, ccw = false
  ) {
    const sweep = ccw ? 0 : 1;
    let span = ccw
      ? startAngle - endAngle
      : endAngle - startAngle;
    while (span < 0)  span += Math.PI * 2;
    while (span > Math.PI * 2) span -= Math.PI * 2;
    const large = span > Math.PI ? 1 : 0;

    const sx = cx + rad * Math.cos(startAngle);
    const sy = cy + rad * Math.sin(startAngle);
    const ex = cx + rad * Math.cos(endAngle);
    const ey = cy + rad * Math.sin(endAngle);

    return `
      <path d="M ${cx} ${cy} L ${sx.toFixed(2)} ${sy.toFixed(2)}
               A ${rad} ${rad} 0 ${large} ${sweep}
               ${ex.toFixed(2)} ${ey.toFixed(2)} Z"
        fill="${color}" fill-opacity="0.25" stroke="none"/>
      <path d="M ${sx.toFixed(2)} ${sy.toFixed(2)}
               A ${rad} ${rad} 0 ${large} ${sweep}
               ${ex.toFixed(2)} ${ey.toFixed(2)}"
        fill="none" stroke="${color}" stroke-width="1.6" stroke-opacity="0.85"/>
    `;
  }

  function cwMid(s: number, e: number) {
    let span = e - s;
    while (span < 0) span += Math.PI * 2;
    return s + span / 2;
  }

  function labelAt(cx: number, cy: number, rad: number, angle: number, text: string, cls: string) {
    const lx = cx + (rad + 18) * Math.cos(angle);
    const ly = cy + (rad + 18) * Math.sin(angle);
    return `<text text-anchor="middle" x="${lx.toFixed(2)}" y="${(ly + 4).toFixed(2)}" class="${cls}">${text}</text>`;
  }

  function ticks(y: number) {
    const mx = 155;
    return `
      <line x1="${mx-5}" y1="${y-7}" x2="${mx+5}" y2="${y+7}" stroke="${STROKE_DIM}" stroke-width="1.5"/>
      <line x1="${mx+4}" y1="${y-7}" x2="${mx+14}" y2="${y+7}" stroke="${STROKE_DIM}" stroke-width="1.5"/>
    `;
  }

  const baseLines = `
    <line x1="18" y1="${y1}" x2="${W-18}" y2="${y1}" stroke="${STROKE}" stroke-width="2"/>
    <line x1="18" y1="${y2}" x2="${W-18}" y2="${y2}" stroke="${STROKE}" stroke-width="2"/>
    ${ticks(y1)}${ticks(y2)}
    <line x1="${tx0.toFixed(2)}" y1="${ty0.toFixed(2)}"
          x2="${tx1.toFixed(2)}" y2="${ty1.toFixed(2)}"
      stroke="${STROKE}" stroke-width="2"/>
  `;

  const RIGHT = 0;
  const DOWN  = tA;
  const LEFT  = Math.PI;
  const UP    = Math.PI + tA;

  const r = 30;

  let arc1 = "", arc2 = "";
  let lbl1 = "", lbl2 = "";

  if (type === "alternate") {
    arc1 = sector(ix1, y1, r, UP, RIGHT, AMBER);
    lbl1 = labelAt(ix1, y1, r, cwMid(UP, RIGHT), `${known}°`, "lbl");
    arc2 = sector(ix2, y2, r, DOWN, LEFT, BLUE_STR);
    lbl2 = labelAt(ix2, y2, r, cwMid(DOWN, LEFT), "x°", "unkn");

  } else if (type === "corresponding") {
    arc1 = sector(ix1, y1, r, UP, RIGHT, AMBER);
    lbl1 = labelAt(ix1, y1, r, cwMid(UP, RIGHT), `${known}°`, "lbl");
    arc2 = sector(ix2, y2, r, UP, RIGHT, BLUE_STR);
    lbl2 = labelAt(ix2, y2, r, cwMid(UP, RIGHT), "x°", "unkn");

  } else {
    arc1 = sector(ix1, y1, r, UP, RIGHT, AMBER);
    lbl1 = labelAt(ix1, y1, r, cwMid(UP, RIGHT), `${known}°`, "lbl");
    arc2 = sector(ix2, y2, r, UP, RIGHT, BLUE_STR);
    lbl2 = labelAt(ix2, y2, r, cwMid(UP, RIGHT), "x°", "unkn");
  }

  return svgWrap(W, H, `
    ${arc1}${arc2}
    ${baseLines}
    ${lbl1}${lbl2}
  `);
}