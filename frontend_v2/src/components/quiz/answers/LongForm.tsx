"use client";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  marks: number;
  minWords?: number;
  disabled?: boolean;
};

export default function LongForm({ value, onChange, onSubmit, marks, minWords, disabled }: Props) {
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
  const meetsMin = !minWords || wordCount >= minWords;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles size={11} className="text-muted-foreground" />
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
            {marks} mark{marks !== 1 ? "s" : ""} - AI marked
          </p>
        </div>
        {minWords && (
          <p className={cn(
            "text-xs font-mono transition-colors",
            meetsMin ? "text-score-high" : "text-muted-foreground"
          )}>
            {wordCount}/{minWords} words
          </p>
        )}
      </div>

      <div className={cn(
        "rounded-2xl border-2 border-border bg-card overflow-hidden",
        "focus-within:border-foreground transition-colors",
        disabled && "opacity-50"
      )}>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && e.ctrlKey && !disabled && onSubmit()}
          placeholder="Write your answer here..."
          disabled={disabled}
          rows={6}
          className="w-full px-4 py-3 bg-transparent text-sm font-medium outline-none resize-none placeholder:text-muted-foreground/40 leading-relaxed"
        />
        <div className="px-4 py-2 border-t border-border bg-muted/30 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground font-mono">{wordCount} words</span>
          <span className="text-[10px] text-muted-foreground">Ctrl+Enter to submit</span>
        </div>
      </div>
    </div>
  );
}