"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function RetakeButton({ attemptId }: { attemptId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRetake() {
    setLoading(true);
    try {
      const res = await fetch(`/api/quiz/${attemptId}/retake`, { method: "POST" });
      const data = await res.json();
      if (data.id) {
        router.push(`/dashboard/quiz/${data.id}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleRetake} 
      disabled={loading}
      className="w-full h-14 rounded-2xl text-base font-semibold"
    >
      <RotateCcw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
      {loading ? "Preparing..." : "Retake This Quiz"}
    </Button>
  );
}