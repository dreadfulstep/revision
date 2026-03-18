"use client";

import { cn } from "@/lib/utils";

type Props = {
  template: string;
  values: string[];
  onChange: (vals: string[]) => void;
  disabled?: boolean;
};

export default function FillBlank({
  template,
  values,
  onChange,
  disabled,
}: Props) {
  const parts = template.split(/(\[\[blank\d+\]\])/g);

  let blankIndex = 0;

  return (
    <p className="text-2xl font-bold leading-tight tracking-tight text-foreground">
      {parts.map((part, i) => {
        if (part.match(/\[\[blank\d+\]\]/)) {
          const idx = blankIndex++;
          const value = values[idx] || "";

          return (
            <input
              key={i}
              value={value}
              onChange={(e) => {
                const copy = [...values];
                copy[idx] = e.target.value;
                onChange(copy);
              }}
              disabled={disabled}
              className={cn(
                "inline-block align-baseline mx-1",
                "bg-transparent border-b-2 border-border",
                "focus:border-primary outline-none",
                "text-center font-medium",
                "transition-all",
                "min-w-15",
                "px-1",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              style={{
                width: `${Math.max(value.length, 4)}ch`,
              }}
            />
          );
        }

        return (
          <span key={i} className="whitespace-pre-wrap">
            {part}
          </span>
        );
      })}
    </p>
  );
}