export type Subject = {
  id: string;
  name: string;
  exam_board: string;
  colour: string;
  papers: string[];
  topics: { id: string; name: string }[];
};

export type QuestionVariable =
  | { type: "int"; min: number; max: number }
  | { type: "float"; min: number; max: number; dp: number }
  | { type: "pick"; options: (number | string)[] }
  | { type: "derived"; expr: string };

export type NumberAnswer = { type: "number"; answer: string; unit?: string };

export type TextAnswer = {
  type: "text";
  textAnswer: string;
  acceptedAnswers?: string[];
};

export type MultipleChoiceAnswer = {

  type: "multiple_choice";
  options: string[];
  answer: string;
};

export type TrueFalseAnswer = { type: "true_false"; answer: boolean };

export type MatchingAnswer = {
  type: "matching";
  pairs: { left: string; right: string }[];
};

export type OrderingAnswer = { type: "ordering"; items: string[] };

export type FillBlankAnswer = {
  type: "fill_blank";
  answers: string[][];
  acceptedAnswers?: string[][];
};

export type MultiSelectAnswer = {
  type: "multi_select";
  options: string[];
  correctOptions: string[];
};

export type MultiPartAnswer = {
  type: "multi_part";
  parts: {
    label: string;
    answer: string;
    unit?: string;
  }[];
};

export type ImageConfig =
  | { type: "rendered" | "generated"; renderer: string }
  | { type: "svg"; content: string }
  | { type: "url"; src: string; alt: string; attribution?: string };

export type LongFormAnswer = {
  type: "long_form";
  marks: number;
  markScheme: string;
  minWords?: number;
};

export type AnswerConfig =
  | NumberAnswer
  | TextAnswer
  | MultipleChoiceAnswer
  | TrueFalseAnswer
  | MatchingAnswer
  | OrderingAnswer
  | FillBlankAnswer
  | MultiSelectAnswer
  | MultiPartAnswer
  | LongFormAnswer;

export type Question = {
  id: string;
  topic: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  image: { type: "generated"; renderer: string } | null;
  template: string;
  variables: Record<string, QuestionVariable>;
  answerConfig: AnswerConfig;
  explanation: string;
};

export type ResolvedVars = Record<string, string | number>;

export type PaperQuestionPart = {
  label: string;
  marks: number;
  prompt: string;
  answerType: "number" | "short" | "long" | "multiple_choice";
  markScheme: string;
  unit?: string;
  options?: string[];
  svgDiagram?: string | null;
  answerLines: number;
  workingLines?: number;
};

export type PaperQuestion = {
  number: number;
  topic: string;
  totalMarks: number;
  context?: string | null;
  contextSvg?: string | null;
  parts: PaperQuestionPart[];
};

export type Paper = {
  id: string;
  title: string;
  subjectId: string;
  examBoard: string;
  tier: string;
  paperNumber: number;
  totalMarks: number;
  timeMinutes: number;
  calculator: boolean | null;
  questions: PaperQuestion[];
};

export type PaperMeta = {
  papers: {
    number: number;
    title: string;
    filename: string;
    tier: string;
    totalMarks: number;
    timeMinutes: number;
    calculator: boolean | null;
  }[];
};
