import Link from "next/link";
import { IdeaWithLatest } from "@/lib/db";
import { MASLOW_LABELS_SK, MASLOW_HUE } from "@/lib/rubric";

export function IdeaCard({ idea }: { idea: IdeaWithLatest }) {
  const maslow = idea.latest_maslow_level ?? idea.maslow_level;
  return (
    <li className="border border-[var(--border)] rounded-md p-4 hover:bg-[#11151a]">
      <Link href={`/ideas/${idea.id}`} className="block">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-medium truncate">{idea.title}</h3>
            <p className="text-xs text-[var(--muted)] mt-1 flex flex-wrap gap-x-3 items-center">
              {idea.smer && <span>Smer {idea.smer}</span>}
              {idea.horizont && <span>{idea.horizont}</span>}
              {maslow != null && (
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: `${MASLOW_HUE[maslow]}1f`,
                    border: `1px solid ${MASLOW_HUE[maslow]}55`,
                    color: MASLOW_HUE[maslow],
                    fontWeight: 500,
                  }}
                  title={`Maslow ${maslow} — ${MASLOW_LABELS_SK[maslow]}`}
                >
                  M{maslow} · {MASLOW_LABELS_SK[maslow]}
                </span>
              )}
              <span>{idea.author_email}</span>
              <span>{new Date(idea.created_at).toLocaleDateString("sk-SK")}</span>
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-mono text-lg">
              {idea.latest_score != null
                ? idea.latest_score.toFixed(2)
                : <span className="text-[var(--muted)] text-sm">—</span>}
            </div>
            <div className="text-xs text-[var(--muted)]">
              {idea.avg_stars
                ? `★ ${idea.avg_stars.toFixed(1)} (${idea.ratings_count})`
                : "★ —"}
              {idea.comments_count > 0 && (
                <span className="ml-2">💬 {idea.comments_count}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
