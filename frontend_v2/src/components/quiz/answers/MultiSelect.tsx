"use client";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  disabled?: boolean;
  correctValues?: string[];
  showResult?: boolean;
};

export default function MultiSelect({ options, value, onChange, disabled, correctValues, showResult }: Props) {
  function toggle(opt: string) {
    if (value.includes(opt)) onChange(value.filter(v => v !== opt));
    else onChange([...value, opt]);
  }

  return (
    <div className="space-y-2.5">
      <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
        Select all that apply
      </p>
      {options.map((opt, i) => {
        const selected = value.includes(opt);
        const isCorrect = showResult && correctValues?.includes(opt);
        const isWrong = showResult && selected && !correctValues?.includes(opt);
        const isMissed = showResult && !selected && correctValues?.includes(opt);

        return (
          <button key={i} onClick={() => toggle(opt)} disabled={disabled}
            className={cn(
              "w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border-2 text-left transition-all",
              "disabled:cursor-not-allowed",
              isCorrect && "border-score-high bg-score-high/10",
              isWrong   && "border-score-low bg-score-low/10",
              isMissed  && "border-score-high/50 bg-score-high/5 border-dashed",
              !showResult && selected && "border-foreground bg-foreground/5",
              !showResult && !selected && "border-border bg-card hover:border-foreground/25",
            )}>
            <div className={cn(
              "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
              isCorrect ? "border-score-high bg-score-high" :
              isWrong   ? "border-score-low bg-score-low" :
              isMissed  ? "border-score-high/50" :
              selected  ? "border-foreground bg-foreground" : "border-border",
            )}>
              {(isCorrect || (!showResult && selected)) && <Check size={11} className="text-background" strokeWidth={3}/>}
              {isWrong && <X size={11} className="text-background" strokeWidth={3}/>}
            </div>
            <span className="text-sm font-medium flex-1 leading-snug">{opt}</span>
            {isMissed && <span className="text-[10px] text-score-high font-medium">should select</span>}
          </button>
        );
      })}
    </div>
  );
}