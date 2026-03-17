"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { options: string[]; value: string[]; onChange: (v: string[]) => void; disabled?: boolean };

export default function MultiSelect({ options, value, onChange, disabled }: Props) {
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
        return (
          <button
            key={i}
            onClick={() => toggle(opt)}
            disabled={disabled}
            className={cn(
              "w-full flex items-center gap-2 px-4 py-3.5 rounded-2xl border-2 text-left transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              selected
                ? "border-foreground bg-foreground/5"
                : "border-border bg-card hover:border-foreground/25 hover:bg-muted/30",
            )}
          >
            <div className={cn(
              "w-5 h-5 border-2 flex items-center rounded justify-center shrink-0 transition-all",
              selected ? "border-foreground bg-foreground" : "border-border",
            )}>
              {selected && <Check size={11} className="text-background" strokeWidth={3} />}
            </div>
            <span className="text-sm font-medium flex-1 leading-snug">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}