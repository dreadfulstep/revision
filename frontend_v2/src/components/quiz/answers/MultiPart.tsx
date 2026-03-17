"use client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Part = { label: string; unit?: string };
type Props = {
  parts: Part[];
  value: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
  disabled?: boolean;
};

export default function MultiPart({ parts, value, onChange, disabled }: Props) {
  function update(label: string, val: string) {
    onChange({ ...value, [label]: val });
  }

  return (
    <div className="space-y-3">
      {parts.map((p) => (
        <div key={p.label} className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className="font-mono text-sm px-3 py-1.5 shrink-0"
          >
            {p.label} =
          </Badge>
          <div
            className={cn(
              "flex-1 flex items-stretch rounded-xl border-2 border-border bg-card overflow-hidden",
              "focus-within:border-foreground transition-colors",
              disabled && "opacity-50",
            )}
          >
            <Input
              value={value[p.label] ?? ""}
              onChange={(e) => update(p.label, e.target.value)}
              placeholder="..."
              inputMode="decimal"
              disabled={disabled}
              className="flex-1 px-4 py-3 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/40"
            />
            {p.unit && (
              <div className="flex items-center px-4 border-l-2 border-border bg-muted/50">
                <span className="text-sm font-semibold font-mono">
                  {p.unit}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
