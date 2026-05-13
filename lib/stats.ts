import { supabaseAdmin, IdeaWithLatest } from "./db";

export type SmerKey = "A" | "B" | "C" | "unset";

export type DashboardStats = {
  ideas: IdeaWithLatest[];
  total: number;
  validatedCount: number;
  unvalidatedCount: number;
  avgScore: number | null;
  avgStars: number | null;
  bySmer: Array<{ id: SmerKey; name: string; hue: string; count: number; avg: number | null }>;
  weeklyActivity: number[]; // last 8 weeks (oldest -> newest)
  weeklyValidations: number[]; // last 8 weeks
  top5: IdeaWithLatest[];
  uniqueAuthors: string[];
};

const SMER_META: Record<SmerKey, { name: string; hue: string }> = {
  A: { name: "Smer A — Využitie dát", hue: "#FF6A7A" },
  B: { name: "Smer B", hue: "#5A8AE6" },
  C: { name: "Smer C", hue: "#A0C8FF" },
  unset: { name: "Bez smeru", hue: "#71717A" },
};

export async function loadDashboardStats(): Promise<DashboardStats> {
  const db = supabaseAdmin();
  const [ideasRes, reportsRes] = await Promise.all([
    db
      .from("ideas_with_latest_report")
      .select("*")
      .order("created_at", { ascending: false }),
    db
      .from("validation_reports")
      .select("created_at, weighted_score"),
  ]);

  const ideas = (ideasRes.data ?? []) as IdeaWithLatest[];
  const reports = (reportsRes.data ?? []) as Array<{ created_at: string; weighted_score: number }>;

  const validated = ideas.filter((i) => i.latest_score !== null);
  const avgScore =
    validated.length > 0
      ? validated.reduce((a, i) => a + (i.latest_score ?? 0), 0) / validated.length
      : null;
  const ratedIdeas = ideas.filter((i) => i.avg_stars !== null);
  const avgStars =
    ratedIdeas.length > 0
      ? ratedIdeas.reduce((a, i) => a + (i.avg_stars ?? 0), 0) / ratedIdeas.length
      : null;

  const bySmer: DashboardStats["bySmer"] = (["A", "B", "C", "unset"] as SmerKey[])
    .map((id) => {
      const items = ideas.filter((i) =>
        id === "unset" ? i.smer === null : i.smer === id
      );
      const withScore = items.filter((i) => i.latest_score !== null);
      const avg =
        withScore.length > 0
          ? withScore.reduce((a, i) => a + (i.latest_score ?? 0), 0) / withScore.length
          : null;
      return {
        id,
        name: SMER_META[id].name,
        hue: SMER_META[id].hue,
        count: items.length,
        avg: avg !== null ? Math.round(avg * 100) / 100 : null,
      };
    })
    .filter((s) => s.count > 0);

  const WEEKS = 8;
  const now = new Date();
  const weekStarts = Array.from({ length: WEEKS }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (WEEKS - 1 - i) * 7);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  });
  function bucket(ts: number, source: string[]): number[] {
    const buckets = new Array(WEEKS).fill(0);
    for (const iso of source) {
      const t = new Date(iso).getTime();
      for (let i = WEEKS - 1; i >= 0; i--) {
        if (t >= weekStarts[i]) {
          buckets[i]++;
          break;
        }
      }
    }
    return buckets;
  }
  const weeklyActivity = bucket(0, ideas.map((i) => i.created_at));
  const weeklyValidations = bucket(0, reports.map((r) => r.created_at));

  const top5 = [...validated]
    .sort((a, b) => (b.latest_score ?? 0) - (a.latest_score ?? 0))
    .slice(0, 5);

  const uniqueAuthors = Array.from(new Set(ideas.map((i) => i.author_email))).sort();

  return {
    ideas,
    total: ideas.length,
    validatedCount: validated.length,
    unvalidatedCount: ideas.length - validated.length,
    avgScore: avgScore !== null ? Math.round(avgScore * 100) / 100 : null,
    avgStars: avgStars !== null ? Math.round(avgStars * 10) / 10 : null,
    bySmer,
    weeklyActivity,
    weeklyValidations,
    top5,
    uniqueAuthors,
  };
}
