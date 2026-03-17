import { renderers } from "@/lib/content";

const TEST_VARS: Record<string, Record<string, string | number>> = {
  "angles-parallel-alt":   { known_angle: 65,  angle_type: "alternate" },
  "angles-parallel-corr":  { known_angle: 110, angle_type: "corresponding" },
  "angles-parallel-coint": { known_angle: 72,  angle_type: "co-interior" },
  "angles-on-line":        { known_angle: 115, type: "straight" },
  "angles-on-line-point":  { known_angle: 80,  type: "point" },

  "right-triangle-c":      { a: 3,  b: 4,  unknown: "c" },
  "right-triangle-a":      { a: 5,  b: 12, unknown: "a" },
  "isosceles-triangle":    { base: 8, equal_side: 6, unknown: "angle" },
  "trig-rt-opp":           { angle: 35, adj: 8,  opp: 0, hyp: 0,  unknown: "opp" },
  "trig-rt-hyp":           { angle: 42, adj: 0,  opp: 5, hyp: 0,  unknown: "hyp" },
  "similar-triangles":     { a1: 3, b1: 5, a2: 6, unknown: "b2" },

  "circle-radius":         { r: 5, show_diameter: 0, unknown: "area" },
  "circle-diameter":       { r: 7, show_diameter: 1, unknown: "d" },
  "ct-inscribed":          { theorem: "inscribed",   known_angle: 40 },
  "ct-semicircle":         { theorem: "semicircle",  known_angle: 90 },
  "ct-tangent":            { theorem: "tangent",     known_angle: 90 },
  "ct-cyclic-quad":        { theorem: "cyclic-quad", known_angle: 65 },

  "rectangle":             { l: 12, w: 5,  unknown: "area" },
  "rectangle-w":           { l: 9,  w: 4,  unknown: "w" },
  "composite-shape":       { l: 10, w: 6,  unknown: "area" },
  "shape-circle-in-sq":    { type: "circle-in-square",   outer: 10, unknown: "shaded" },
  "shape-tri-in-rect":     { type: "triangle-in-rect",   outer: 10, h: 8, b: 12, unknown: "shaded" },
  "shape-sector":          { type: "sector",             outer: 8,  sector_angle: 120, unknown: "shaded" },

  "cuboid":                { l: 8, w: 4, h: 5, unknown: "volume" },
  "cuboid-missing":        { l: 6, w: 3, h: 4, unknown: "h" },
  "pythagoras-3d":         { l: 6, w: 4, h: 3, unknown: "diagonal" },

  "coord-grid-pos":        { m: 2,  c: 1 },
  "coord-grid-neg":        { m: -1, c: 3 },
  "simultaneous":          { m1: 2,  c1: 1,  m2: -1, c2: 4 },
  "simultaneous-2":        { m1: 3,  c1: -2, m2: 1,  c2: 2 },
  "algebra-quadratic":     { graph_type: "quadratic",   a: 1, b: 0, c: -4 },
  "algebra-quadratic-2":   { graph_type: "quadratic",   a: 1, b: -1, c: -6 },
  "algebra-cubic":         { graph_type: "cubic",       a: 1, b: -3, c: 0 },
  "algebra-reciprocal":    { graph_type: "reciprocal",  a: 4, b: 0, c: 0 },
  "algebra-exponential":   { graph_type: "exponential", a: 1, b: 0, c: 0 },

  "vector-basic":          { ax: 3,  ay: 2,  bx: 1,  by: 3,  show_resultant: 1 },
  "vector-neg":            { ax: 4,  ay: 1,  bx: -2, by: 3,  show_resultant: 1 },
  "vector-no-result":      { ax: -2, ay: 3,  bx: 3,  by: -1, show_resultant: 0 },
  "vector-large":          { ax: 2,  ay: -3, bx: -1, by: 4,  show_resultant: 1 },

  "bearing-acute":         { bearing: 60 },
  "bearing-obtuse":        { bearing: 145 },
  "bearing-reflex":        { bearing: 230 },
  "bearing-large":         { bearing: 315 },
  "trig-bearing-e":        { bearing: 65,  dist: 120, unknown: "east" },
  "trig-bearing-n":        { bearing: 220, dist: 90,  unknown: "north" },

  "loci-equidistant":      { type: "equidistant" },
  "loci-angle-bisector":   { type: "equidistant-lines" },
  "loci-fixed-dist":       { type: "fixed-distance" },

  "transform-reflect":     { type: "reflection" },
  "transform-rotate":      { type: "rotation" },
  "transform-translate":   { type: "translation" },
};

const RENDERER_MAP: Record<string, string> = {
  "angles-parallel-alt":   "angles-parallel",
  "angles-parallel-corr":  "angles-parallel",
  "angles-parallel-coint": "angles-parallel",
  "angles-on-line":        "angles-on-line",
  "angles-on-line-point":  "angles-on-line",
  "right-triangle-c":      "right-triangle",
  "right-triangle-a":      "right-triangle",
  "isosceles-triangle":    "isosceles-triangle",
  "trig-rt-opp":           "trig-right-triangle",
  "trig-rt-hyp":           "trig-right-triangle",
  "similar-triangles":     "similar-triangles",
  "circle-radius":         "circle",
  "circle-diameter":       "circle",
  "ct-inscribed":          "circle-theorem",
  "ct-semicircle":         "circle-theorem",
  "ct-tangent":            "circle-theorem",
  "ct-cyclic-quad":        "circle-theorem",
  "shape-circle-in-sq":    "shape-in-shape",
  "shape-tri-in-rect":     "shape-in-shape",
  "shape-annulus":         "shape-in-shape",
  "shape-sector":          "shape-in-shape",
  "cuboid":                "cuboid",
  "cuboid-missing":        "cuboid",
  "pythagoras-3d":         "pythagoras-3d",
  "coord-grid-pos":        "coordinate-grid",
  "coord-grid-neg":        "coordinate-grid",
  "simultaneous":          "simultaneous-graphs",
  "simultaneous-2":        "simultaneous-graphs",
  "algebra-quadratic":     "algebra-graph",
  "algebra-quadratic-2":   "algebra-graph",
  "algebra-cubic":         "algebra-graph",
  "algebra-reciprocal":    "algebra-graph",
  "algebra-exponential":   "algebra-graph",
  "vector-basic":          "vector-diagram",
  "vector-neg":            "vector-diagram",
  "vector-no-result":      "vector-diagram",
  "vector-large":          "vector-diagram",
  "bearing-acute":         "bearing",
  "bearing-obtuse":        "bearing",
  "bearing-reflex":        "bearing",
  "bearing-large":         "bearing",
  "trig-bearing-e":        "trig-bearing",
  "trig-bearing-n":        "trig-bearing",
  "loci-equidistant":      "loci-construction",
  "loci-angle-bisector":   "loci-construction",
  "loci-fixed-dist":       "loci-construction",
  "transform-reflect":     "transformation-grid",
  "transform-rotate":      "transformation-grid",
  "transform-translate":   "transformation-grid",
};

function prettyKey(key: string) {
  return key.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function getCategory(key: string) {
  if (key.startsWith("angles"))     return "Angles";
  if (key.startsWith("right") || key.startsWith("trig-rt") || key.startsWith("isosceles") || key.startsWith("similar")) return "Triangles";
  if (key.startsWith("circle") || key.startsWith("ct-")) return "Circles";
  if (key.startsWith("rectangle") || key.startsWith("composite") || key.startsWith("shape")) return "Area & Shapes";
  if (key.startsWith("cuboid") || key.startsWith("pythagoras")) return "3D";
  if (key.startsWith("coord") || key.startsWith("simultaneous") || key.startsWith("algebra")) return "Graphs";
  if (key.startsWith("vector"))     return "Vectors";
  if (key.startsWith("bearing") || key.startsWith("trig-bearing")) return "Bearings";
  if (key.startsWith("loci"))       return "Loci";
  if (key.startsWith("transform"))  return "Transformations";
  return "Other";
}

export default function RendererTestPage() {
  const entries = Object.entries(TEST_VARS);
  const categories = [...new Set(entries.map(([k]) => getCategory(k)))];

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Renderer Preview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {entries.length} variants · {Object.keys(renderers).length} renderers
          </p>
        </div>

        {categories.map(cat => {
          const catEntries = entries.filter(([k]) => getCategory(k) === cat);
          return (
            <div key={cat} className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                {cat}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {catEntries.map(([key, vars]) => {
                  const rendererKey = RENDERER_MAP[key];
                  if (!rendererKey) return null;
                  const renderer = renderers[rendererKey];
                  if (!renderer) return (
                    <div key={key} className="rounded-2xl border border-border bg-card p-4">
                      <p className="text-xs text-muted-foreground">{key}</p>
                      <p className="text-xs text-red-400 mt-1">renderer &quot;{rendererKey}&quot; not found</p>
                    </div>
                  );

                  let svg = "";
                  try {
                    svg = renderer(vars);
                  } catch (e) {
                    svg = `<svg viewBox="0 0 200 60"><text x="8" y="30" fill="oklch(0.65 0.22 27)" font-size="11">Error: ${String(e).slice(0, 60)}</text></svg>`;
                  }

                  return (
                    <div key={key} className="rounded-2xl border border-border bg-card overflow-hidden">
                      <div className="px-3 py-2 border-b border-border flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold truncate">{prettyKey(key)}</span>
                        <span className="text-[10px] font-mono text-muted-foreground shrink-0">{rendererKey}</span>
                      </div>
                      <div className="p-3" dangerouslySetInnerHTML={{ __html: svg }} />
                      <div className="px-3 py-1.5 border-t border-border">
                        <p className="text-[10px] font-mono text-muted-foreground/60 break-all leading-relaxed">
                          {JSON.stringify(vars)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}