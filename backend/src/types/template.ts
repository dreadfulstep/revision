export type VariableDef =
  | { type: "int"; min: number; max: number; notEqualTo?: string; multipleOf?: number }
  | { type: "float"; min: number; max: number; dp: number }
  | { type: "pick"; options: (string | number)[] }
  | { type: "derived"; expr: string };

export type ImageDef =
  | { type: "generated"; renderer: string }
  | { type: "static"; src: string }
  | null;

export interface QuestionTemplate {
  id: string;
  topic: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: "number" | "text" | "multi-choice" | "true-false";
  image: ImageDef;
  template: string;
  variables: Record<string, VariableDef>;
  // For number questions
  answer?: string; // expression e.g. "Math.sqrt(a*a + b*b)"
  tolerance?: number;
  unit?: string;
  // For text questions
  textAnswer?: string; // expression returning string e.g. "`x^2 + ${a+b}x + ${a*b}`"
  acceptedAnswers?: string[]; // expressions
  // For multi-choice
  options?: string[]; // can contain {{expr}}
  choiceAnswer?: number; // index
  // For true-false
  boolAnswer?: boolean;
  explanation?: string; // can contain {{expr}}
}

export interface ResolvedVars {
  [key: string]: number | string;
}

export interface GeneratedQuestion {
  id: string;
  templateId: string;
  topic: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: "number" | "text" | "multi-choice" | "true-false";
  question: string;
  answer: number | string | boolean;
  tolerance?: number;
  unit?: string;
  acceptedAnswers?: string[];
  options?: string[];
  explanation?: string;
  image: { type: "svg"; data: string } | { type: "static"; src: string } | null;
  vars: ResolvedVars; // stored so frontend can use them if needed
}