"use client";

import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  unit?: string;
  disabled?: boolean;
  type?: "text" | "number" | "fill_blank";
};

export default function TextNumber({ value, onChange, onSubmit, unit, disabled, type }: Props) {
  return (
    <div className="space-y-2">
      {type === "fill_blank" && (
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
          Fill in the blank
        </p>
      )}
      <div className={cn(
        "flex items-stretch rounded-xl border-2 border-border bg-card overflow-hidden",
        "focus-within:border-foreground transition-colors",
        disabled && "opacity-50",
      )}>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !disabled && onSubmit()}
          placeholder={type === "number" ? "Enter a number..." : type === "fill_blank" ? "Fill in the blank..." : "Your answer..."}
          inputMode={type === "number" ? "decimal" : "text"}
          disabled={disabled}
          className="flex-1 px-4 py-4 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50"
        />
        {unit && (
          <div className="flex items-center px-4 border-l-2 border-border bg-muted/50">
            <span className="text-sm font-semibold font-mono text-foreground">{unit}</span>
          </div>
        )}
      </div>
      {type === "number" && (
        <p className="text-xs pt-2 text-muted-foreground">
          Press <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-[10px]">Enter</kbd> to submit
        </p>
      )}
    </div>
  );
}