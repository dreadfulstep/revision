"use client";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  correctValue?: string;
  showResult?: boolean;
};

export default function TrueFalse({ value, onChange, disabled, correctValue, showResult }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { v: "true",  label: "True",  icon: Check },
        { v: "false", label: "False", icon: X },
      ].map(({ v, label, icon: Icon }) => {
        const selected = value === v;
        const isCorrect = showResult && v === correctValue;
        const isWrong = showResult && selected && v !== correctValue;

        return (
          <button key={v} onClick={() => onChange(v)} disabled={disabled}
            className={cn(
              "flex flex-col items-center justify-center gap-2 py-6 rounded-2xl border-2 transition-all",
              "disabled:cursor-not-allowed",
              isCorrect ? "border-score-high bg-score-high/10" :
              isWrong   ? "border-score-low bg-score-low/10" :
              selected  ? "border-foreground bg-foreground/5" :
                          "border-border bg-card hover:border-foreground/20",
            )}>
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all",
              isCorrect ? "border-score-high bg-score-high/15" :
              isWrong   ? "border-score-low bg-score-low/15" :
              selected  ? "border-foreground" : "border-border",
            )}>
              <Icon size={16} strokeWidth={2.5}
                className={isCorrect ? "text-score-high" : isWrong ? "text-score-low" : selected ? "text-foreground" : "text-muted-foreground"} />
            </div>
            <span className="font-semibold text-sm">{label}</span>
          </button>
        );
      })}
    </div>
  );
}