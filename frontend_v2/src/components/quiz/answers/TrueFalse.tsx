"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { value: string; onChange: (v: string) => void; disabled?: boolean };

export default function TrueFalse({ value, onChange, disabled }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { v: "true",  label: "True",  icon: Check, activeClass: "border-score-high bg-score-high/10 text-score-high" },
        { v: "false", label: "False", icon: X,     activeClass: "border-score-low bg-score-low/10 text-score-low"   },
      ].map(({ v, label, icon: Icon, activeClass }) => {
        const selected = value === v;
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            disabled={disabled}
            className={cn(
              "flex flex-col items-center justify-center gap-2 py-6 rounded-2xl border-2 transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              selected ? activeClass : "border-border bg-card hover:border-foreground/20 hover:bg-muted/40",
            )}
          >
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all",
              selected ? "border-current bg-current/15" : "border-border",
            )}>
              <Icon size={16} strokeWidth={2.5} className={selected ? "text-current" : "text-muted-foreground"} />
            </div>
            <span className="font-semibold text-sm">{label}</span>
          </button>
        );
      })}
    </div>
  );
}