import { Card, CardContent } from "@/components/ui/card";

type Props = {
  quizzesCompleted: number;
  questionsAnswered: number;
  accuracyRate: number;
  totalXp: number;
};

export default function StatCards({ quizzesCompleted, questionsAnswered, accuracyRate, totalXp }: Props) {
  const stats = [
    { label: "Quizzes Completed", value: quizzesCompleted },
    { label: "Questions Answered", value: questionsAnswered },
    { label: "Accuracy Rate", value: `${accuracyRate}%` },
    { label: "Total XP", value: totalXp.toLocaleString() },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ label, value }) => (
        <Card key={label}>
          <CardContent className="px-4">
            <p className="text-2xl font-bold font-mono tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}