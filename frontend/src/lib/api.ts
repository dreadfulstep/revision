const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include", // always send cookies
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error ?? "Request failed");
  }

  return res.json();
}

export const api = {
  subjects: {
    getAll: () => request("/subjects"),
    getOne: (id: string) => request(`/subjects/${id}`),
  },

  quiz: {
    generate: (body: { subjectId: string; topics?: string[]; count?: number; seed?: string }) =>
      request("/quiz/generate", { method: "POST", body: JSON.stringify(body) }),
    getBySeed: (seed: string) => request(`/quiz/${seed}`),
    startAttempt: (seed: string) =>
      request(`/quiz/${seed}/attempt`, { method: "POST" }),
    answer: (seed: string, attemptId: string, body: { questionId: string; answer: number | string | boolean }) =>
      request(`/quiz/${seed}/attempt/${attemptId}/answer`, { method: "POST", body: JSON.stringify(body) }),
    complete: (seed: string, attemptId: string) =>
      request(`/quiz/${seed}/attempt/${attemptId}/complete`, { method: "POST" }),
  },

  me: {
    getStats: () => request("/me/stats"),
    getStreak: () => request("/me/streak"),
    getHistory: (subjectId?: string) =>
      request(`/me/history${subjectId ? `?subjectId=${subjectId}` : ""}`),
    getAttempt: (attemptId: string) => request(`/me/history/${attemptId}`),
    get: () => request("/me")
  },

  leaderboard: {
    getAll: () => request("/leaderboard"),
    getMyRank: () => request("/leaderboard/me"),
  },
};