type ExamBoard = "edexcel" | "aqa" | "ocr";

type Subject =
  | "maths"
  | "combined-science"
  | "english-language"
  | "english-literature"
  | "history"
  | "spanish"
  | "computer-science"
  | "creative-imedia";

type Tier = "foundation" | "higher" | "na";

type PaperSpec = {
  timeMinutes: number;
  totalMarks: number;
  calculator: boolean | null;
  sections: string[];
  topicsCovered: string;
  structureNotes: string;
};

const SPECS: Record<string, Record<number, PaperSpec>> = {
  "edexcel-maths": {
    1: {
      timeMinutes: 90,
      totalMarks: 80,
      calculator: false,
      sections: ["Non-calculator"],
      topicsCovered:
        "All topics — number, algebra, ratio, geometry, statistics, probability",
      structureNotes: `
Q1–3: Short answer 1–2 marks. Number, basic algebra, fractions, decimals.
Q4–7: Medium 2–4 marks. Geometry, algebra, graphs, ratio and proportion.
Q8–11: Extended 3–5 marks. Trigonometry, quadratics, simultaneous equations, circle theorems, statistics.
Q12–13: Challenging multi-step 4–6 marks. Proof, vectors, functions, complex geometry.
No calculator — use exact values, surds, fractions, multiples of π.
Higher tier — include content only on higher tier: surds, functions, iteration, histograms, velocity-time graphs.`,
    },
    2: {
      timeMinutes: 90,
      totalMarks: 80,
      calculator: true,
      sections: ["Calculator"],
      topicsCovered: "All topics — calculator paper",
      structureNotes: `
Same structure as Paper 1 but calculator allowed.
Include questions requiring calculator: compound interest, trigonometry to find angles, standard form calculations, statistical calculations.
Avoid exact-value questions — numerical answers expected.`,
    },
    3: {
      timeMinutes: 90,
      totalMarks: 80,
      calculator: true,
      sections: ["Calculator"],
      topicsCovered: "All topics — calculator paper",
      structureNotes:
        "Same as Paper 2. Different questions. Higher proportion of problem-solving.",
    },
  },

  "edexcel-combined-science": {
    1: {
      timeMinutes: 60,
      totalMarks: 60,
      calculator: true,
      sections: ["Biology Paper 1"],
      topicsCovered:
        "Cell biology, organisation, infection & response, bioenergetics",
      structureNotes: `
Q1: Multiple choice — 4 questions × 1 mark.
Q2–4: Short answer 2–4 marks. Describe/explain biological processes.
Q5–6: Application/data question 4–5 marks. Interpret results, calculate magnification/percentage change.
Q7: Extended response 6 marks — "Describe and explain..." requiring 6 creditworthy points.
Include at least 2 calculation questions (magnification, surface area:volume, percentage change).`,
    },
    2: {
      timeMinutes: 60,
      totalMarks: 60,
      calculator: true,
      sections: ["Biology Paper 2"],
      topicsCovered:
        "Homeostasis & response, inheritance/variation/evolution, ecology",
      structureNotes: `
Same structure as Biology Paper 1 but topics from Paper 2 content.
Include genetic cross calculation (Punnett square ratios), biomass transfer calculation (10% rule).
Extended response on ecology or evolution.`,
    },
    3: {
      timeMinutes: 60,
      totalMarks: 60,
      calculator: true,
      sections: ["Chemistry Paper 1"],
      topicsCovered:
        "Atomic structure, bonding, quantitative chemistry, chemical changes, energy changes",
      structureNotes: `
Q1: Multiple choice 4×1 mark.
Q2–3: Recall/describe 2–3 marks. Atomic structure, bonding types.
Q4–5: Calculation questions 3–4 marks. Moles (n=m/Mr), percentage yield, atom economy.
Q6: 4–5 mark application. Electrolysis, reactivity series, extraction.
Q7: Extended response 6 marks. Bond energy calculation + explanation OR evaluation of a process.`,
    },
    4: {
      timeMinutes: 60,
      totalMarks: 60,
      calculator: true,
      sections: ["Chemistry Paper 2"],
      topicsCovered:
        "Rates & equilibrium, organic chemistry, analysis, atmosphere & resources",
      structureNotes: `
Same structure as Chemistry Paper 1 but Paper 2 topics.
Include Rf calculation, rate of reaction from graph gradient, titration calculation.
Haber process or Contact process extended response.`,
    },
    5: {
      timeMinutes: 60,
      totalMarks: 60,
      calculator: true,
      sections: ["Physics Paper 1"],
      topicsCovered: "Forces, energy, waves, electricity",
      structureNotes: `
Q1: Multiple choice 4×1 mark.
Q2–3: Recall 2–3 marks. Definitions, wave properties, circuit rules.
Q4–6: Calculation 3–4 marks. KE=½mv², P=IV, v=fλ, efficiency.
Q7: Multi-step calculation 4–5 marks. Energy/power/work done chain, circuit analysis.
Q8: Extended response 6 marks. Evaluate/explain energy transfer, wave behaviour, or electrical safety.
g = 10 N/kg throughout.`,
    },
    6: {
      timeMinutes: 60,
      totalMarks: 60,
      calculator: true,
      sections: ["Physics Paper 2"],
      topicsCovered:
        "Magnetism & electromagnetism, particle physics, space physics",
      structureNotes: `
Same structure as Physics Paper 1 but Paper 2 topics.
Include transformer calculation (Vs/Vp = ns/np), half-life calculation, momentum calculation.
Extended response on nuclear physics, electromagnetic induction, or space.`,
    },
  },

  "aqa-english-language": {
    1: {
      timeMinutes: 105,
      totalMarks: 80,
      calculator: null,
      sections: [
        "Section A: Reading (fiction)",
        "Section B: Writing (creative)",
      ],
      topicsCovered: "Reading fiction extract, descriptive/narrative writing",
      structureNotes: `
Source: single 20th/21st century fiction extract (~700 words).
Section A — Reading (40 marks):
  Q1 (4 marks): List 4 things from lines X–Y. AO1. Short answer.
  Q2 (8 marks): How does the writer use language to... (lines X–Y). AO2. Language analysis.
  Q3 (8 marks): How has the writer structured the text to... AO2. Structure analysis.
  Q4 (20 marks): "A student said... To what extent do you agree?" Evaluate critically. AO4.
Section B — Writing (40 marks):
  Q5 (24 marks) + Q6 (16 marks): Choice of descriptive OR narrative writing task. AO5+AO6.
  Mark writing in bands 1–4 for content and organisation, then separately for SPaG.`,
    },
    2: {
      timeMinutes: 105,
      totalMarks: 80,
      calculator: null,
      sections: [
        "Section A: Reading (non-fiction)",
        "Section B: Writing (viewpoints)",
      ],
      topicsCovered: "Two non-fiction sources, persuasive/viewpoint writing",
      structureNotes: `
Source A: 19th century non-fiction (~700 words).
Source B: 21st century non-fiction (~700 words). Different viewpoint on same broad topic.
Section A — Reading (40 marks):
  Q1 (4 marks): True/false or list from Source A. AO1.
  Q2 (8 marks): Summary — what can you infer from both sources about... AO1.
  Q3 (12 marks): How does the writer of Source A use language to... AO2.
  Q4 (16 marks): Compare how both writers present their perspectives. AO3.
Section B — Writing (40 marks):
  Q5 (40 marks): Write to present a viewpoint (letter/article/speech). AO5+AO6.`,
    },
  },

  "aqa-english-literature": {
    1: {
      timeMinutes: 100,
      totalMarks: 64,
      calculator: null,
      sections: ["Section A: Shakespeare", "Section B: 19th century novel"],
      topicsCovered: "Shakespeare play, 19th century prose",
      structureNotes: `
Section A — Shakespeare (30 marks + 4 SPaG):
  One question with extract + whole text essay.
  Extract printed on paper. "Starting with this extract, explore how Shakespeare presents..."
  34 marks total. Mark on AO1 (response/quotes), AO2 (language/structure/form), AO3 (context).
Section B — 19th century novel (30 marks):
  One essay question (no extract). "How does [author] present [theme]?"
  30 marks. AO1, AO2, AO3.
Texts vary by school choice — use generic [SHAKESPEARE PLAY] and [NOVEL] placeholders in structure.`,
    },
    2: {
      timeMinutes: 105,
      totalMarks: 96,
      calculator: null,
      sections: [
        "Section A: Modern texts",
        "Section B: Poetry anthology",
        "Section C: Unseen poetry",
      ],
      topicsCovered:
        "Modern prose/drama, poetry anthology, unseen poetry comparison",
      structureNotes: `
Section A — Modern text (34 marks + 4 SPaG):
  One essay (no extract). "How does [author] present [theme/character]?"
Section B — Poetry anthology (30 marks):
  One named poem from anthology printed + comparison to another poem from the cluster.
  "Compare how poets present [theme] in [named poem] and one other poem."
Section C — Unseen poetry (32 marks):
  Q1 (24 marks): Analyse first unseen poem.
  Q2 (8 marks): Compare how both unseen poems present [theme].
  Both unseen poems printed on paper.`,
    },
  },

  "aqa-history": {
    1: {
      timeMinutes: 105,
      totalMarks: 84,
      calculator: null,
      sections: [
        "Section A: Period study",
        "Section B: Wider world depth study",
      ],
      topicsCovered:
        "Period study (e.g. America 1840–1895), Wider world depth (e.g. Conflict in Korea)",
      structureNotes: `
Section A — Period study (~42 marks):
  Q1 (4 marks): How useful are Sources A and B? Provenance + content.
  Q2 (8 marks): Describe two problems/features of... Developed point × 2.
  Q3 (16 marks): "Was X the main cause of Y?" Argue, counter-argue, reach judgement. Includes AO4 (SPaG).
Section B — Wider world depth study (~42 marks):
  Q4 (4 marks): What can you learn from Source C?
  Q5 (8 marks): Describe two consequences/features.
  Q6 (16 marks): Extended essay — thematic argument + judgement.
Use [PERIOD STUDY] and [DEPTH STUDY] as placeholders for the specific topic chosen.`,
    },
    2: {
      timeMinutes: 105,
      totalMarks: 84,
      calculator: null,
      sections: [
        "Section A: Thematic study",
        "Section B: British depth study + historic environment",
      ],
      topicsCovered:
        "Thematic study (e.g. Migration), British depth (e.g. Elizabethan England) + historic environment",
      structureNotes: `
Section A — Thematic study (~36 marks):
  Q1 (4 marks): Describe two features/events.
  Q2 (12 marks): Explain why... Two developed causal points.
  Q3 (16 marks + 4 SPaG): "How far do you agree that..." Extended essay with judgement.
Section B — British depth + historic environment (~48 marks):
  Q4 (4 marks): Source analysis — what can we learn?
  Q5 (4 marks): Historic environment — describe feature of [site].
  Q6 (16 marks): "Was X the most significant...?" Extended essay.
  Q7 (20 marks): "How accurate is [interpretation]?" AO4 — evaluate interpretations.`,
    },
  },

  "aqa-spanish": {
    1: {
      timeMinutes: 45,
      totalMarks: 50,
      calculator: null,
      sections: ["Listening"],
      topicsCovered:
        "All AQA Spanish themes: Identity, Local area, School, Future plans, Environment, Global issues",
      structureNotes: `
Foundation and Higher sections.
Section A (Foundation content, ~25 marks):
  Q1: Letter/number identification (5 marks)
  Q2: Multiple choice — short extracts (10 marks)
  Q3: Gap fill or open response (10 marks)
Section B (Higher content, ~25 marks):
  Q4: Multiple choice — longer extracts (10 marks)
  Q5: Open response in English (10 marks)
  Q6: Dictation — write exactly what you hear in Spanish (5 marks)
NOTE: Listening scripts not generated here — generate question booklet only with rubric and answer spaces.`,
    },
    2: {
      timeMinutes: 60,
      totalMarks: 60,
      calculator: null,
      sections: ["Reading"],
      topicsCovered: "All AQA Spanish themes",
      structureNotes: `
Section A: Foundation content (~30 marks)
  Q1: Matching/letter answers from short texts (10 marks)
  Q2: True/false/not mentioned (5 marks)
  Q3: Multiple choice (10 marks)
  Q4: Translation English→Spanish short sentences (5 marks)
Section B: Higher content (~30 marks)
  Q5: Open questions in English from longer texts (15 marks)
  Q6: Translation Spanish→English paragraph (15 marks)`,
    },
    3: {
      timeMinutes: 60,
      totalMarks: 90,
      calculator: null,
      sections: ["Writing"],
      topicsCovered: "All AQA Spanish themes",
      structureNotes: `
Foundation tasks included for accessibility, Higher tasks for full marks.
Q1 (16 marks): Photo card — describe photo + answer 3 questions in Spanish.
Q2 (32 marks): Two structured tasks (90 words each) on given themes.
Q3 (42 marks): One open-ended essay (150 words) on a theme.
Mark schemes: accuracy of language, range of vocabulary, complexity of structures, communication.`,
    },
  },

  "ocr-computer-science": {
    1: {
      timeMinutes: 90,
      totalMarks: 80,
      calculator: null,
      sections: ["Computer Systems (J277/01)"],
      topicsCovered:
        "Systems architecture, memory/storage, networking, security, ethical/legal issues",
      structureNotes: `
Section A: Short answer (40 marks)
  Q1–4: 1–3 mark questions. Define/state/identify. CPU components, memory types, storage, binary.
  Q5–7: 4–6 mark questions. Describe/explain. Network topologies, protocols, cyber threats.
Section B: Extended answer (40 marks)
  Q8–9: 6–8 mark questions. Evaluate/discuss. Ethical/legal issues, compression, encryption.
  Q10: 8–10 mark structured question. System design scenario — choose components, justify.
Include binary/hex conversion questions, logic gates, Boolean expressions.`,
    },
    2: {
      timeMinutes: 90,
      totalMarks: 80,
      calculator: null,
      sections: ["Computational Thinking, Algorithms & Programming (J277/02)"],
      topicsCovered:
        "Algorithms, programming constructs, data structures, Boolean logic, languages/IDEs",
      structureNotes: `
Section A: Algorithms & programming (50 marks)
  Q1: Trace table question (6 marks) — trace through given pseudocode/code.
  Q2: Pseudocode writing (8 marks) — write algorithm to solve a problem.
  Q3: Program design (10 marks) — design solution, identify data structures needed.
  Q4: Code correction/completion (12 marks) — fix bugs or complete partial code.
  Q5: SQL query (4 marks) — write SELECT statement.
Section B: Data representation & Boolean (30 marks)
  Q6: Binary arithmetic, shifts, two's complement (10 marks).
  Q7: Boolean algebra, truth tables, logic diagrams (12 marks).
  Q8: Data representation (images, sound, compression) (8 marks).
Accept OCR Exam Reference Language (ERL) pseudocode OR Python for all algorithm questions.`,
    },
  },

  "ocr-creative-imedia": {
    1: {
      timeMinutes: 75,
      totalMarks: 60,
      calculator: null,
      sections: ["Pre-Production Skills (R093) — Written exam"],
      topicsCovered:
        "Pre-production documents, planning tools, client requirements, assets, copyright, legislation",
      structureNotes: `
This is the R093 written exam for OCR Creative iMedia.
Section A: Pre-production documents (~25 marks)
  Q1–3: 2–4 mark questions. Identify/describe types of pre-production document (mood board, storyboard, script, visualisation diagram, mind map, spider diagram).
  Q4: 6 mark question. Explain purpose and content of a named document.
Section B: Planning and reviewing (~35 marks)
  Q5: 4 marks. Client requirements — identify what a client needs.
  Q6: 6 marks. Describe factors to consider when planning a media product.
  Q7: 8 marks. Explain legislation and regulations: copyright, data protection, age rating, advertising standards.
  Q8: 8 marks. Discuss how to review and improve a media product (feedback methods, quality criteria).
  Q9: 9 marks. Extended response — evaluate pre-production planning for a given scenario.
All questions based on a scenario insert (media production company, client brief etc).`,
    },
  },
};

const SVG_GUIDANCE = `
SVG diagram rules (use where genuinely helpful):
- viewBox="0 0 300 220", no background fill, transparent
- Stroke: oklch(0.85 0 0) for all lines
- Labels: oklch(0.85 0 0) font 13px system-ui
- Unknown values: oklch(0.72 0.18 250) blue
- Dim text: oklch(0.50 0 0) for "not drawn to scale" etc
- Right angle: 12×12 square marker
- Dashed lines: stroke-dasharray="5 3"
- Inline SVG only — no external resources
- Keep minimal and exam-quality
`;

const COMMAND_WORDS = `
Command word → marks guide:
State/Name/Give/List → 1 mark each
Describe → 1–3 marks (what happens, no reason needed)
Explain → 2–4 marks (what + why, "because/therefore/so")
Calculate → 1–4 marks (show working, units, sig figs match question)
Evaluate → 4–6 marks (pros/cons/evidence, reach a conclusion)
Compare → 2–4 marks (similarities AND differences)
Suggest → 1–3 marks (apply to unfamiliar context)
Analyse → 3–5 marks (break down, identify patterns, interpret)
Justify → 2–4 marks (give reasons to support a choice)
Discuss → 4–6 marks (multiple viewpoints, balanced argument, conclusion)
`;

const SUBJECT_NOTES: Partial<Record<string, string>> = {
  maths: `
- Mark schemes use M (method), A (accuracy), B (independent) marks.
- "oe" = or equivalent. "ft" = follow through from previous error.
- Show full worked solutions in mark scheme, not just final answer.
- Geometry diagrams must match given measurements exactly.
- g = 10 N/kg if any mechanics appears.
`,
  "combined-science": `
- Equations from Edexcel combined science equation sheet only.
- g = 10 N/kg. Standard form answers acceptable.
- Biology: accept correct biological terminology and common synonyms.
- Chemistry: balance all equations, include state symbols.
- Physics: always give units in answers and mark schemes.
- 6-mark extended response: mark in levels (Level 1 = 1–2, Level 2 = 3–4, Level 3 = 5–6).
`,
  "english-language": `
- Reading AOs: AO1 (identify/interpret), AO2 (language/structure analysis), AO3 (compare), AO4 (evaluate).
- Writing AOs: AO5 (communication/organisation), AO6 (vocabulary/sentence structure/SPaG).
- Mark writing in bands. Band descriptors for content and technical accuracy separately.
- No single correct answer — describe qualities of strong responses.
`,
  "english-literature": `
- AO1: personal response with textual evidence.
- AO2: analysis of language, structure and form with effect.
- AO3: relevance of social, historical, cultural context.
- AO4: SPaG (Shakespeare/19th century paper only).
- Mark in levels: simple/some/clear/perceptive/convincing.
- Credit alternative valid interpretations.
- Indicative content only in mark schemes — not exhaustive.
`,
  history: `
- Source questions: consider nature, origin, purpose, audience.
- "How useful" requires both usefulness AND limitation.
- 16-mark essays: sustained argument, counter-argument, substantiated conclusion.
- Level mark schemes: Level 1 (simple/descriptive) → Level 4 (analytical/evaluative).
- AQA: SPaG awarded on one question per paper (4 marks).
`,
  spanish: `
- Mark for communication first, then accuracy of language.
- Accept regional variations and alternative correct forms.
- Writing: assess range of vocabulary and complexity of grammatical structures.
- Translation: mark point by point — do not penalise twice for same error type.
`,
  "computer-science": `
- Accept pseudocode, Python, Java or any recognised language for algorithm questions.
- Trace tables: must show exact values including intermediate steps.
- Logic gates: accept any logically equivalent circuit.
- Binary: show all working for conversions.
- OCR ERL pseudocode is preferred but not required.
`,
  "creative-imedia": `
- All questions relate to a scenario insert — make the scenario realistic.
- Pre-production documents: accept correct terminology (storyboard, mood board, etc).
- Legislation: GDPR, Copyright Designs and Patents Act 1988, Computer Misuse Act 1990, age ratings (BBFC, PEGI).
- Evaluation questions: expect use of media terminology throughout.
`,
};

export function getPaperPrompt(
  examBoard: "edexcel" | "aqa" | "ocr",
  subject: string,
  paperNumber: number,
  tier: "foundation" | "higher" | "na" = "higher",
  type: "generate" | "verify" = "generate",
): string {
  const key = `${examBoard}-${subject}`;
  const spec = SPECS[key]?.[paperNumber];

  const subjectDisplay = subject
    .split("-")
    .map((w) => w[0]!.toUpperCase() + w.slice(1))
    .join(" ");
  const examBoardDisplay = examBoard.toUpperCase();
  const tierDisplay =
    tier === "na"
      ? ""
      : ` (${tier === "higher" ? "Higher" : "Foundation"} Tier)`;
  const subjectNotes = SUBJECT_NOTES[subject] ?? "";

  const specBlock = spec
    ? `
Paper specification:
- Duration: ${spec.timeMinutes} minutes
- Total marks: ${spec.totalMarks}
- Calculator: ${spec.calculator === true ? "Yes" : spec.calculator === false ? "No" : "N/A"}
- Sections: ${spec.sections.join(" | ")}
- Topics covered: ${spec.topicsCovered}

Paper structure:
${spec.structureNotes.trim()}
`
    : `No spec found for ${key} paper ${paperNumber}. Use your best knowledge of the specification.`;

  if (type === "generate") {
    return `You are generating a GCSE mock exam paper.

Exam board: ${examBoardDisplay}
Subject: ${subjectDisplay}${tierDisplay}
Paper number: ${paperNumber}

${specBlock}

## Output format

Output a single JSON object matching this schema exactly:
{
  "title": "${examBoardDisplay} GCSE ${subjectDisplay} — Paper ${paperNumber}${tierDisplay}",
  "subjectId": "${subject}",
  "examBoard": "${examBoard}",
  "tier": "${tier}",
  "paperNumber": ${paperNumber},
  "totalMarks": N,
  "timeMinutes": N,
  "calculator": boolean,
  "questions": [
    {
      "number": N,
      "topic": "topic-id",
      "totalMarks": N,
      "context": "shared stem text shown above all parts, or null",
      "contextSvg": "inline SVG for shared diagram, or null",
      "parts": [
        {
          "label": "a",
          "marks": N,
          "prompt": "question text shown to student",
          "answerType": "number | short | long | multiple_choice",
          "markScheme": "detailed mark scheme with one point per mark",
          "unit": "e.g. cm², m/s, °C — or omit",
          "options": ["array for multiple_choice only"],
          "svgDiagram": "inline SVG or null",
          "workingLines": N
        }
      ]
    }
  ]
}

answerType guide:
- "number": single numerical answer with working
- "short": 1–3 sentences, definition, description, or short explanation
- "long": paragraph+ response, explain/evaluate/essay
- "multiple_choice": 4 options, one correct

workingLines guide:
- 1: single word/number answers
- 2–3: short explanation or simple calculation
- 4–6: multi-step calculation or structured explanation
- 8–12: extended response / essay

${SVG_GUIDANCE}

${COMMAND_WORDS}

${subjectNotes}

## Rules

1. Every fact and calculation in mark schemes MUST be correct.
2. Questions must match the structure notes exactly — same number of questions, same marks distribution.
3. Mark schemes: one bullet point per mark. Include "Accept: ..." for alternatives. "Do not accept: ..." for common wrong answers.
4. Difficulty must increase across the paper.
5. No topic repeated in the same style.
6. SVGs only where genuinely useful — geometry, circuits, graphs, diagrams.
7. Contexts must be realistic and scientifically/historically accurate.
8. Output ONLY valid JSON. No markdown fences, no explanation, no preamble.
9. NO sketching, drawing, or graph-plotting questions — this is a text-based digital exam. Replace any "sketch/draw/plot" questions with "describe the shape of", "state the key features of", or "calculate coordinates of key points on".
10. answerLines: number of ruled lines a student would need to write their answer:
    - number answer: 0 (just a box)
    - one-word/one-sentence: 2
    - short explanation (2–3 sentences): 4
    - structured explanation (3–5 sentences): 6
    - extended response (paragraph): 8
    - long essay: 12–16
11. workingLines: separate working space for calculations only:
    - simple calc: 3
    - multi-step: 6
    - complex multi-step: 8
    - not a calculation: 0
    `;
  }

  return `You are a senior ${examBoardDisplay} examiner reviewing a generated GCSE ${subjectDisplay} mock paper${tierDisplay}.

Find and fix ALL errors. Output the corrected paper JSON only.

## Checklist

### Factual accuracy
- All facts correct for ${examBoardDisplay} ${subjectDisplay}${tierDisplay} specification
- All calculations correct — work them out manually
- No content outside the specification
- Appropriate difficulty for${tierDisplay} tier

### Mark schemes
- Correct number of mark points per part
- Specific and unambiguous points
- Alternatives included ("Accept: ...")
- Common errors excluded ("Do not accept: ...")
- Method and accuracy marks separated for calculations

### SVG diagrams
- Labels consistent with question values
- No overlapping text
- Unknowns clearly marked
- Not misleading

### Question quality
- Command words match mark allocation
- Language clear and unambiguous
- Difficulty increases across paper
- Topics spread — nothing repeated
- Structure matches the spec for this paper

${subjectNotes}

## Output

Corrected paper JSON only. Same schema as input.
Replace fundamentally flawed questions with better ones on the same topic.
Output ONLY valid JSON. No markdown, no explanation.

## Paper to review:

[PASTE GENERATE OUTPUT HERE]`;
}

export const getEdexcelMathsPrompt = (
  paper: 1 | 2 | 3,
  type: "generate" | "verify" = "generate",
) => getPaperPrompt("edexcel", "maths", paper, "higher", type);

export const getEdexcelSciencePrompt = (
  paper: 1 | 2 | 3 | 4 | 5 | 6,
  type: "generate" | "verify" = "generate",
) => getPaperPrompt("edexcel", "combined-science", paper, "higher", type);

export const getAQAEnglishPrompt = (
  paper: "language" | "literature",
  num: 1 | 2,
  type: "generate" | "verify" = "generate",
) => getPaperPrompt("aqa", `english-${paper}`, num, "na", type);

export const getAQAHistoryPrompt = (
  paper: 1 | 2,
  type: "generate" | "verify" = "generate",
) => getPaperPrompt("aqa", "history", paper, "na", type);

export const getAQASpanishPrompt = (
  paper: 1 | 2 | 3,
  type: "generate" | "verify" = "generate",
) => getPaperPrompt("aqa", "spanish", paper, "na", type);

export const getOCRComputerSciencePrompt = (
  paper: 1 | 2,
  type: "generate" | "verify" = "generate",
) => getPaperPrompt("ocr", "computer-science", paper, "na", type);

export const getOCRCreativeIMediaPrompt = (
  type: "generate" | "verify" = "generate",
) => getPaperPrompt("ocr", "creative-imedia", 1, "na", type);
