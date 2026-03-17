import { ResolvedVars } from "../types";
import { renderAnglesParallel } from "./anglesParallel";
import { renderRightTriangle } from "./rightTriangle";
import { renderIsoscelesTriangle } from "./isoscelesTriangle";
import { renderCircle } from "./circle";
import { renderCoordinateGrid } from "./coordinateGrid";
import { renderAnglesOnLine } from "./anglesOnLine";
import { renderBearingDiagram } from "./bearingDiagram";
import { renderCuboid } from "./cuboid";
import { renderTrigRightTriangle } from "./trigRightTriangle";
import { renderSimilarTriangles } from "./similarTriangles";
import { renderVectorDiagram } from "./vectorDiagram";
import { renderCircleTheorem } from "./circleTheorems";
import { renderPythagoras3D } from "./pythagoras3D";
import { renderTrigBearing } from "./trigBearing";
import { renderSimultaneousGraphs } from "./simultaneousGraphs";
import { renderTransformationGrid } from "./transformationGrid";
import { renderShapeInShape } from "./shapeInShape";
import { renderLociConstruction } from "./lociConstruction";
import { renderAlgebraGraph } from "./algebraGraph";

export const renderers: Record<string, (vars: ResolvedVars) => string> = {
  "angles-parallel": renderAnglesParallel,
  "right-triangle": renderRightTriangle,
  "isosceles-triangle": renderIsoscelesTriangle,
  circle: renderCircle,
  "coordinate-grid": renderCoordinateGrid,
  "angles-on-line": renderAnglesOnLine,
  bearing: renderBearingDiagram,
  cuboid: renderCuboid,
  "trig-right-triangle": renderTrigRightTriangle,
  "similar-triangles": renderSimilarTriangles,
  "vector-diagram": renderVectorDiagram,
  "circle-theorem": renderCircleTheorem,
  "pythagoras-3d": renderPythagoras3D,
  "trig-bearing": renderTrigBearing,
  "simultaneous-graphs": renderSimultaneousGraphs,
  "transformation-grid": renderTransformationGrid,
  "shape-in-shape": renderShapeInShape,
  "loci-construction": renderLociConstruction,
  "algebra-graph": renderAlgebraGraph,
};
