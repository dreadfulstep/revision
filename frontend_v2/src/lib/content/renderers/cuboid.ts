import { ResolvedVars } from "../types";
import { svgWrap, STROKE, STROKE_DIM, GREEN } from "./colours";

export function renderCuboid(vars: ResolvedVars): string {
  const l = Number(vars.l);
  const w = Number(vars.w);
  const h = Number(vars.h);
  const unknown = String(vars.unknown ?? "volume");
  const W = 260, H = 200;

  const ox = 60, oy = 140;
  const dx = 110, dy = 0;
  const dzy = -90;
  const dep = 40, depy = -20;

  const pts = {
    a: [ox, oy],
    b: [ox + dx, oy + dy],
    c: [ox + dx + dep, oy + dy + depy],
    d: [ox + dep, oy + depy],
    e: [ox, oy + dzy],
    f: [ox + dx, oy + dy + dzy],
    g: [ox + dx + dep, oy + dy + depy + dzy],
    h: [ox + dep, oy + depy + dzy],
  };

  const face = (keys: (keyof typeof pts)[], fill: string, opacity: number) => {
    const p = keys.map(k => pts[k]!.join(",")).join(" ");
    return `<polygon points="${p}" fill="${fill}" fill-opacity="${opacity}" stroke="${STROKE}" stroke-width="1.5"/>`;
  };

  const lLabel = unknown === "l" ? "?" : `${l}`;
  const wLabel = unknown === "w" ? "?" : `${w}`;
  const hLabel = unknown === "h" ? "?" : `${h}`;
  const lClass = unknown === "l" ? "unkn" : "lbl";
  const wClass = unknown === "w" ? "unkn" : "lbl";
  const hClass = unknown === "h" ? "unkn" : "lbl";

  return svgWrap(W, H, `
    ${face(["a","b","c","d"], GREEN, 0.06)}
    ${face(["a","b","f","e"], GREEN, 0.10)}
    ${face(["b","c","g","f"], GREEN, 0.07)}
    ${face(["d","c","g","h"], STROKE_DIM, 0.03)}
    ${face(["e","f","g","h"], GREEN, 0.13)}
    <line x1="${pts.a![0]}" y1="${pts.a![1]}" x2="${pts.d![0]}" y2="${pts.d![1]}"
      stroke="${STROKE_DIM}" stroke-width="1" stroke-dasharray="4 3" opacity="0.5"/>
    <line x1="${pts.a![0]}" y1="${pts.a![1]}" x2="${pts.e![0]}" y2="${pts.e![1]}"
      stroke="${STROKE_DIM}" stroke-width="1" stroke-dasharray="4 3" opacity="0.5"/>
    <line x1="${pts.d![0]}" y1="${pts.d![1]}" x2="${pts.h![0]}" y2="${pts.h![1]}"
      stroke="${STROKE_DIM}" stroke-width="1" stroke-dasharray="4 3" opacity="0.5"/>
    <text text-anchor="middle" x="${(pts.a![0]!+pts.b![0]!)/2}" y="${pts.a![1]!+16}" class="${lClass}">${lLabel} cm</text>
    <text text-anchor="start"  x="${pts.b![0]!+15}" y="${(pts.b![1]!+pts.c![1]!)/2+20}" class="${wClass}">${wLabel} cm</text>
    <text text-anchor="start"  x="${pts.b![0]!+50}" y="${(pts.b![1]!+pts.f![1]!)/2-8}" class="${hClass}">${hLabel} cm</text>
  `);
}