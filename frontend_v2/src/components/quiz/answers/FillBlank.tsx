"use client";
import { cn } from "@/lib/utils";

type Props = {
  template: string;
  values: string[];
  onChange: (vals: string[]) => void;
  disabled?: boolean;
  correctAnswers?: string[][];
  showResult?: boolean;
};

export default function FillBlank({ template, values, onChange, disabled, correctAnswers, showResult }: Props) {
  const parts = template.split(/(\[\[blank\d+\]\])/g);
  let blankIndex = 0;

  return (
    <p className="text-2xl font-bold leading-tight tracking-tight text-foreground">
      {parts.map((part, i) => {
        if (part.match(/\[\[blank\d+\]\]/)) {
          const idx = blankIndex++;
          const value = values[idx] ?? "";
          const correct = correctAnswers?.[idx];
          const isCorrect = showResult && correct?.some(c => c.toLowerCase().trim() === value.toLowerCase().trim());
          const isWrong = showResult && !isCorrect;

          return (
            <span key={i} className="inline-flex flex-col items-center mx-1 relative">
              <input
                value={value}
                onChange={e => {
                  const copy = [...values];
                  copy[idx] = e.target.value;
                  onChange(copy);
                }}
                disabled={disabled}
                className={cn(
                  "inline-block align-baseline",
                  "bg-transparent border-b-2",
                  "focus:outline-none text-center font-medium transition-all px-1",
                  "min-w-[4ch]",
                  isCorrect ? "border-score-high text-score-high" :
                  isWrong   ? "border-score-low text-score-low" :
                              "border-border focus:border-primary",
                  disabled && "cursor-not-allowed opacity-50"
                )}
                style={{ width: `${Math.max(value.length, 4)}ch` }}
              />
              {showResult && isWrong && correct && (
                <span className="text-[10px] text-score-high font-medium mt-0.5 whitespace-nowrap">
                  {correct[0]}
                </span>
              )}
            </span>
          );
        }
        return <span key={i} className="whitespace-pre-wrap">{part}</span>;
      })}
    </p>
  );
}