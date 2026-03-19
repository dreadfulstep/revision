"use client";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

const LABELS = ["A", "B", "C", "D"];

type Props = {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  correctValue?: string;
  showResult?: boolean;
};

export default function MultipleChoice({ options, value, onChange, disabled, correctValue, showResult }: Props) {
  return (
    <div className="space-y-2.5">
      {options.map((opt, i) => {
        const isSelected = value === opt;
        const isCorrect = showResult && opt === correctValue;
        const isWrong = showResult && isSelected && opt !== correctValue;

        return (
          <button key={i} onClick={() => onChange(opt)} disabled={disabled}
            className={cn(
              "w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border-2 text-left transition-all",
              "disabled:cursor-not-allowed",
              isCorrect && "border-score-high bg-score-high/10",
              isWrong && "border-score-low bg-score-low/10",
              !isCorrect && !isWrong && isSelected && "border-foreground bg-foreground text-background",
              !isCorrect && !isWrong && !isSelected && "border-border bg-card hover:border-foreground/25",
            )}>
            <span className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
              isCorrect ? "bg-score-high/20 text-score-high" :
              isWrong   ? "bg-score-low/20 text-score-low" :
              isSelected ? "bg-background/20 text-background" : "bg-muted text-muted-foreground",
            )}>
              {showResult && isCorrect ? <Check size={12} strokeWidth={3}/> :
               showResult && isWrong   ? <X size={12} strokeWidth={3}/> :
               LABELS[i]}
            </span>
            <span className="text-sm font-medium flex-1 leading-snug">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}