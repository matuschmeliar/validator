import { supabaseAdmin, IdeaWithLatest } from "./db";

export type DashboardStats = {
  ideas: IdeaWithLatest[];
  total: number;
  validatedCount: number;
  unvalidatedCount: number;
  avgScore: number | null;
  avgStars: number | null;
  weeklyActivity: number[]; // last 8 weeks (oldest -> newest)
  weeklyValidations: number[]; // last 8 weeks
  top5: IdeaWithLatest[];
  uniqueAuthors: string[];
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

  const WEEKS = 8;
  const now = new Date();
  const weekStarts = Array.from({ length: WEEKS }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (WEEKS - 1 - i) * 7);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  });
  function bucket(source: string[]): number[] {
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
  const weeklyActivity = bucket(ideas.map((i) => i.created_at));
  const weeklyValidations = bucket(reports.map((r) => r.created_at));

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
    weeklyActivity,
    weeklyValidations,
    top5,
    uniqueAuthors,
  };
}
