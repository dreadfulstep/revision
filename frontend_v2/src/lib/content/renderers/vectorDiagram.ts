import { ResolvedVars } from "../types";
import { svgWrap, STROKE, STROKE_DIM, AMBER, BLUE_STR } from "./colours";

export function renderVectorDiagram(vars: ResolvedVars): string {
  const ax = Number(vars.ax ?? 3);
  const ay = Number(vars.ay ?? 2);
  const bx = Number(vars.bx ?? 1);
  const by = Number(vars.by ?? 3);
  const W = 260, H = 240;
  const margin = 40;

  const rx = ax + bx, ry = ay + by;

  const allX = [0, ax, rx];
  const allY = [0, ay, ry];
  const minX = Math.min(...allX), maxX = Math.max(...allX);
  const minY = Math.min(...allY), maxY = Math.max(...allY);

  const padX = Math.max(1, (maxX - minX) * 0.3);
  const padY = Math.max(1, (maxY - minY) * 0.3);
  const rangeX = maxX - minX + padX * 2;
  const rangeY = maxY - minY + padY * 2;
  const scale = Math.min(
    (W - margin * 2) / rangeX,
    (H - margin * 2) / rangeY,
    40
  );

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const ox = W / 2 - midX * scale;
  const oy = H / 2 + midY * scale;

  function toSvg(x: number, y: number) {
    return { x: ox + x * scale, y: oy - y * scale };
  }

  const gridStep = scale >= 30 ? 1 : scale >= 15 ? 2 : 5;
  const gxMin = Math.floor((-ox / scale) - 1);
  const gxMax = Math.ceil(((W - ox) / scale) + 1);
  const gyMin = Math.floor(((oy - H) / scale) - 1);
  const gyMax = Math.ceil((oy / scale) + 1);

  const gridLines: string[] = [];
  for (let gx = gxMin; gx <= gxMax; gx += gridStep) {
    const px = ox + gx * scale;
    gridLines.push(`<line x1="${px.toFixed(1)}" y1="0" x2="${px.toFixed(1)}" y2="${H}"
      stroke="${STROKE_DIM}" stroke-width="0.5" opacity="0.3"/>`);
  }
  for (let gy = gyMin; gy <= gyMax; gy += gridStep) {
    const py = oy - gy * scale;
    gridLines.push(`<line x1="0" y1="${py.toFixed(1)}" x2="${W}" y2="${py.toFixed(1)}"
      stroke="${STROKE_DIM}" stroke-width="0.5" opacity="0.3"/>`);
  }


  function arrow(
    x1: number, y1: number, x2: number, y2: number,
    color: string, dash = "", label = "", labelOffset = { x: 0, y: 0 }
  ) {
    const p1 = toSvg(x1, y1);
    const p2 = toSvg(x2, y2);
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const as = 9;
    const ah1x = p2.x - as * Math.cos(angle - 0.38);
    const ah1y = p2.y - as * Math.sin(angle - 0.38);
    const ah2x = p2.x - as * Math.cos(angle + 0.38);
    const ah2y = p2.y - as * Math.sin(angle + 0.38);
    const lx = (p1.x + p2.x) / 2 + labelOffset.x;
    const ly = (p1.y + p2.y) / 2 + labelOffset.y;
    return `
      <line x1="${p1.x.toFixed(2)}" y1="${p1.y.toFixed(2)}"
            x2="${p2.x.toFixed(2)}" y2="${p2.y.toFixed(2)}"
        stroke="${color}" stroke-width="2.2"${dash ? ` stroke-dasharray="${dash}"` : ""}/>
      <polygon points="${p2.x.toFixed(2)},${p2.y.toFixed(2)} ${ah1x.toFixed(2)},${ah1y.toFixed(2)} ${ah2x.toFixed(2)},${ah2y.toFixed(2)}"
        fill="${color}"/>
      ${label ? `<text text-anchor="middle" x="${lx.toFixed(2)}" y="${ly.toFixed(2)}" class="lbl" font-size="12" font-weight="700">${label}</text>` : ""}
    `;
  }

  const O = toSvg(0, 0);

  return svgWrap(W, H, `
    <clipPath id="vclip">
      <rect x="0" y="0" width="${W}" height="${H}"/>
    </clipPath>
    <g clip-path="url(#vclip)">
      ${gridLines.join("")}
      ${arrow(0, 0, ax, ay, AMBER, "", "a", { x: -10, y: -8 })}
      ${arrow(ax, ay, rx, ry, BLUE_STR, "", "b", { x: 10, y: -8 })}
      <circle cx="${O.x.toFixed(2)}" cy="${O.y.toFixed(2)}" r="3.5" fill="${STROKE}"/>
    </g>
  `);
}