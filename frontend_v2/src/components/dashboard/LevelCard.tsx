import { Card, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";
import type { Rank } from "@/lib/xp";

type Props = {
  level: number;
  xp: number;
  xpCurrent: number;
  xpNeeded: number;
  xpProgress: number;
  rank: Rank;
};

export default function LevelCard({ level, xp, xpCurrent, xpNeeded, xpProgress, rank }: Props) {
  return (
    <Card>
      <CardContent className="px-4 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ backgroundColor: `${rank.colour}25` }}>
              <Zap size={16} className="text-xp" style={{ color: rank.colour }}/>
            </div>
            <div>
              <p className="font-semibold text-sm leading-none" style={{ color: rank.colour }}>
                {rank.title}
              </p>
              <p className="text-muted-foreground text-xs mt-1">Level {level}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold font-mono text-base leading-none" style={{ color: rank.colour }}>
              {xp.toLocaleString()} XP
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {(xpNeeded - xpCurrent).toLocaleString()} to next
            </p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5">
            <span>Lv {level}</span>
            <span className="font-mono">{Math.round(xpProgress * 100)}%</span>
            <span>Lv {level + 1}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${xpProgress * 100}%`, backgroundColor: rank.colour }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}