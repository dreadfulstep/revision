import { ResolvedVars } from "../types/template";
import { svgWrap, STROKE, TEXT_DIM, GREEN, GRID_LINE } from "./colours";

export function renderCoordinateGrid(vars: ResolvedVars): string {
  const m = Number(vars.m ?? 1);
  const c = Number(vars.c ?? 0);
  const showLine = Number(vars.show_line ?? 1) === 1;
  const xMin = Number(vars.x_min ?? -5);
  const xMax = Number(vars.x_max ?? 5);
  const yMin = Number(vars.y_min ?? -5);
  const yMax = Number(vars.y_max ?? 5);

  const W = 260,
    H = 220,
    pad = 30;
  const drawW = W - pad * 2;
  const drawH = H - pad * 2;
  const xRange = xMax - xMin;
  const yRange = yMax - yMin;

  function sx(x: number) {
    return pad + ((x - xMin) / xRange) * drawW;
  }
  function sy(y: number) {
    return pad + ((yMax - y) / yRange) * drawH;
  }

  const ox = sx(0),
    oy = sy(0);

  // Grid lines
  let grid = "";
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++)
    grid += `<line x1="${sx(x).toFixed(1)}" y1="${pad}" x2="${sx(x).toFixed(1)}" y2="${H - pad}" stroke="${GRID_LINE}" stroke-width="0.8"/>`;
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++)
    grid += `<line x1="${pad}" y1="${sy(y).toFixed(1)}" x2="${W - pad}" y2="${sy(y).toFixed(1)}" stroke="${GRID_LINE}" stroke-width="0.8"/>`;

  // Tick marks + labels
  let ticks = "";
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
    if (x === 0) continue;
    const px = sx(x);
    const ly = Math.min(Math.max(oy + 14, pad + 12), H - pad + 14);
    ticks += `<line x1="${px.toFixed(1)}" y1="${(oy - 3).toFixed(1)}" x2="${px.toFixed(1)}" y2="${(oy + 3).toFixed(1)}" stroke="${STROKE}" stroke-width="1"/>`;
    if (x % 2 === 0 || xRange <= 8)
      ticks += `<text x="${px.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" fill="${TEXT_DIM}" font-size="10">${x}</text>`;
  }
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
    if (y === 0) continue;
    const py = sy(y);
    const lx = Math.max(ox - 6, pad + 8);
    ticks += `<line x1="${(ox - 3).toFixed(1)}" y1="${py.toFixed(1)}" x2="${(ox + 3).toFixed(1)}" y2="${py.toFixed(1)}" stroke="${STROKE}" stroke-width="1"/>`;
    if (y % 2 === 0 || yRange <= 8)
      ticks += `<text x="${(lx - 4).toFixed(1)}" y="${(py + 4).toFixed(1)}" text-anchor="end" fill="${TEXT_DIM}" font-size="10">${y}</text>`;
  }

  // Line + equation label
  let lineSvg = "";
  if (showLine) {
    const pts: [number, number][] = [];
    for (const x of [xMin, xMax]) {
      const y = m * x + c;
      if (y >= yMin && y <= yMax) pts.push([x, y]);
    }
    for (const y of [yMin, yMax]) {
      if (m !== 0) {
        const x = (y - c) / m;
        if (x > xMin && x < xMax) pts.push([x, y]);
      }
    }
    if (pts.length >= 2) {
      pts.sort((a, b) => a[0] - b[0]);
      const [p0, p1] = [pts[0], pts[pts.length - 1]];
      lineSvg += `<line x1="${sx(p0[0]).toFixed(1)}" y1="${sy(p0[1]).toFixed(1)}" x2="${sx(p1[0]).toFixed(1)}" y2="${sy(p1[1]).toFixed(1)}" stroke="${GREEN}" stroke-width="2.5" stroke-linecap="round"/>`;
    }
    if (c >= yMin && c <= yMax)
      lineSvg += `<circle cx="${ox.toFixed(1)}" cy="${sy(c).toFixed(1)}" r="4" fill="${GREEN}"/>`;

    const mStr =
      m === 1 ? "" : m === -1 ? "−" : m < 0 ? `−${Math.abs(m)}` : String(m);
    const cStr = c > 0 ? ` + ${c}` : c < 0 ? ` − ${Math.abs(c)}` : "";
    const eq = `y = ${mStr}x${cStr}`;
    const elx = sx(xMax) - 4;
    const ely = sy(m * xMax + c) - 8;
    if (ely > pad + 4 && ely < H - pad - 4)
      lineSvg += `<text x="${elx.toFixed(1)}" y="${ely.toFixed(1)}" text-anchor="end" class="eq">${eq}</text>`;
  }

  return svgWrap(
    W,
    H,
    `
  ${grid}
  <line x1="${pad}" y1="${oy.toFixed(1)}" x2="${W - pad}" y2="${oy.toFixed(1)}" stroke="${STROKE}" stroke-width="1.5"/>
  <line x1="${ox.toFixed(1)}" y1="${H - pad}" x2="${ox.toFixed(1)}" y2="${pad}" stroke="${STROKE}" stroke-width="1.5"/>
  ${ticks}
  <text x="${(W - pad + 3).toFixed(1)}" y="${(oy + 4).toFixed(1)}" fill="${TEXT_DIM}" font-size="10">x</text>
  <text x="${(ox + 3).toFixed(1)}" y="${(pad - 3).toFixed(1)}" fill="${TEXT_DIM}" font-size="10">y</text>
  <text x="${(ox - 4).toFixed(1)}" y="${(oy + 13).toFixed(1)}" text-anchor="end" fill="${TEXT_DIM}" font-size="10">0</text>
  ${lineSvg}`,
  );
}
