import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

type Props = {
  correct: boolean;
  correctAnswer: string;
  explanation: string;
  xpGained: number;
  onNext: () => void;
  isLast: boolean;
};

export default function Feedback({ correct, correctAnswer, explanation, xpGained, onNext, isLast }: Props) {
  return (
    <Card className={`border-2 ${correct ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-red-500 bg-red-50 dark:bg-red-950/20"}`}>
      <CardContent className="pt-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {correct
              ? <CheckCircle2 className="text-green-600" size={24} />
              : <XCircle className="text-red-600" size={24} />}
            <span className={`font-bold text-lg ${correct ? "text-green-700" : "text-red-700"}`}>
              {correct ? "Correct!" : "Incorrect"}
            </span>
          </div>
          <Badge variant="secondary">+{xpGained} XP</Badge>
        </div>

        {!correct && (
          <p className="text-sm">
            <span className="font-medium">Correct answer: </span>
            <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{correctAnswer}</span>
          </p>
        )}

        <p className="text-sm text-muted-foreground border-t pt-3">{explanation}</p>

        <Button onClick={onNext} className="w-full">
          {isLast ? "See Results →" : "Next Question →"}
        </Button>
      </CardContent>
    </Card>
  );
}