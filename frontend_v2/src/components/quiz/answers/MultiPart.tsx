"use client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

type Part = { label: string; unit?: string };
type CorrectPart = { label: string; answer: string; unit?: string };

type Props = {
  parts: Part[];
  value: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
  disabled?: boolean;
  correctParts?: CorrectPart[];
  showResult?: boolean;
};

export default function MultiPart({ parts, value, onChange, disabled, correctParts, showResult }: Props) {
  function update(label: string, val: string) {
    onChange({ ...value, [label]: val });
  }

  return (
    <div className="space-y-3">
      {parts.map(p => {
        const correct = correctParts?.find(c => c.label === p.label);
        const submitted = value[p.label] ?? "";
        const isCorrect = showResult && correct && Math.abs(parseFloat(submitted) - parseFloat(correct.answer)) < 0.01;
        const isWrong = showResult && correct && !isCorrect;

        return (
          <div key={p.label} className="flex items-center gap-3">
            <Badge variant="secondary" className="font-mono text-sm px-3 py-1.5 shrink-0">
              {p.label} =
            </Badge>
            <div className={cn(
              "flex-1 flex items-stretch rounded-xl border-2 overflow-hidden transition-colors",
              isCorrect ? "border-score-high bg-score-high/5" :
              isWrong   ? "border-score-low bg-score-low/5" :
                          "border-border bg-card focus-within:border-foreground",
              disabled && "opacity-50",
            )}>
              <input
                value={submitted}
                onChange={e => update(p.label, e.target.value)}
                placeholder="..."
                inputMode="decimal"
                disabled={disabled}
                className="flex-1 px-4 py-3 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/40"
              />
              {showResult && correct && (
                <div className={cn(
                  "flex items-center px-3 border-l-2 gap-2",
                  isCorrect ? "border-score-high/30 bg-score-high/10" : "border-score-low/30 bg-score-low/10"
                )}>
                  {isCorrect
                    ? <Check size={14} className="text-score-high" strokeWidth={3}/>
                    : <>
                        <X size={14} className="text-score-low" strokeWidth={3}/>
                        <span className="text-xs font-mono text-score-low">{correct.answer}</span>
                      </>
                  }
                </div>
              )}
              {p.unit && !showResult && (
                <div className="flex items-center px-4 border-l-2 border-border bg-muted/50">
                  <span className="text-sm font-semibold font-mono">{p.unit}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}