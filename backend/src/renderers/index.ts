import { ResolvedVars } from "../types/template";
import { renderRightTriangle } from "./right-triangle";
 
type Renderer = (vars: ResolvedVars) => string;
 
const renderers: Record<string, Renderer> = {
  "right-triangle": renderRightTriangle,
};
 
export function getRenderer(name: string): Renderer | null {
  return renderers[name] ?? null;
}