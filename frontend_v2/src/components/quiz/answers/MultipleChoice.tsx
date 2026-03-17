"use client";

import { cn } from "@/lib/utils";

type Props = { options: string[]; value: string; onChange: (v: string) => void; disabled?: boolean };

const LABELS = ["A", "B", "C", "D", "E", "F"];

export default function MultipleChoice({ options, value, onChange, disabled }: Props) {
  return (
    <div className="space-y-4">
      {options.map((opt, i) => {
        const selected = value === opt;
        return (
          <button
            key={i}
            onClick={() => onChange(opt)}
            disabled={disabled}
            className={cn(
              "w-full flex items-center gap-2 px-4 py-3.5 rounded-2xl border-2 text-left transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              selected
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card hover:border-foreground/25 hover:bg-muted/30",
            )}
          >
            <span className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all",
              selected ? "bg-background/20 text-background" : "bg-muted text-muted-foreground",
            )}>
              {LABELS[i]}
            </span>
            <span className="text-sm font-medium flex-1 leading-snug">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}