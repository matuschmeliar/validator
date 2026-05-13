import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin, Idea, ValidationReport } from "@/lib/db";
import { readSessionEmail } from "@/lib/auth";
import { MarkdownView } from "@/components/MarkdownView";
import { ScoreTable } from "@/components/ScoreTable";
import { ValidateButton } from "@/components/ValidateButton";
import { RatingStars } from "@/components/RatingStars";
import { CommentList } from "@/components/CommentList";

export const dynamic = "force-dynamic";

export default async function IdeaDetail({ params }: { params: { id: string } }) {
  const db = supabaseAdmin();
  const myEmail = (await readSessionEmail()) ?? "";

  const [ideaRes, reportsRes, ratingsRes, commentsRes] = await Promise.all([
    db.from("ideas").select("*").eq("id", params.id).single(),
    db
      .from("validation_reports")
      .select("*")
      .eq("idea_id", params.id)
      .order("created_at", { ascending: false }),
    db.from("ratings").select("*").eq("idea_id", params.id),
    db.from("comments").select("*").eq("idea_id", params.id).order("created_at", { ascending: true }),
  ]);

  if (ideaRes.error || !ideaRes.data) notFound();

  const idea = ideaRes.data as Idea;
  const reports = (reportsRes.data ?? []) as ValidationReport[];
  const ratings = ratingsRes.data ?? [];
  const comments = commentsRes.data ?? [];

  const latest = reports[0] ?? null;
  const myRating = ratings.find((r) => r.author_email === myEmail)?.stars ?? null;
  const avgStars =
    ratings.length > 0 ? ratings.reduce((a, r) => a + r.stars, 0) / ratings.length : null;

  const isAuthor = idea.author_email === myEmail;

  return (
    <div>
      <Link href="/" className="text-sm text-[var(--muted)] hover:text-white">← späť</Link>

      <div className="flex items-start justify-between mt-3">
        <div>
          <h1 className="text-2xl font-semibold">{idea.title}</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            {idea.smer && <span className="mr-3">Smer {idea.smer}</span>}
            {idea.horizont && <span className="mr-3">Horizont: {idea.horizont}</span>}
            <span>autor: {idea.author_email}</span>
          </p>
          {idea.tags?.length > 0 && (
            <div className="flex gap-2 mt-2">
              {idea.tags.map((t) => (
                <span key={t} className="text-xs bg-[#161a1f] border border-[var(--border)] rounded px-2 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        {isAuthor && (
          <Link
            href={`/ideas/${idea.id}/edit`}
            className="text-xs text-[var(--muted)] border border-[var(--border)] rounded px-2 py-1 hover:text-white"
          >
            Upraviť
          </Link>
        )}
      </div>

      <section className="mt-8">
        <h2 className="text-sm uppercase text-[var(--muted)] mb-2">Telo</h2>
        <div className="prose-sk">
          <MarkdownView source={idea.body_md} />
        </div>
      </section>

      <section className="mt-10 border-t border-[var(--border)] pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Claude validácia</h2>
          <ValidateButton ideaId={idea.id} />
        </div>

        {!latest ? (
          <p className="text-[var(--muted)] text-sm">
            Idea ešte nebola validovaná. Klikni „Validovať" pre prvý report.
          </p>
        ) : (
          <>
            <div className="text-3xl font-semibold mb-1">
              {latest.weighted_score.toFixed(2)}{" "}
              <span className="text-sm text-[var(--muted)] font-normal">/ 5</span>
            </div>
            <p className="text-xs text-[var(--muted)] mb-4">
              {latest.model} · {new Date(latest.created_at).toLocaleString("sk-SK")} · {latest.created_by_email}
            </p>
            <ScoreTable scores={latest.scores} />
            <div className="prose-sk mt-4">
              <MarkdownView source={latest.summary_md} />
            </div>
            {latest.next_step && (
              <div className="mt-4 border-l-2 border-[var(--accent)] pl-4">
                <div className="text-xs uppercase text-[var(--muted)] mb-1">Ďalší krok</div>
                <div>{latest.next_step}</div>
              </div>
            )}
          </>
        )}

        {reports.length > 1 && (
          <details className="mt-6">
            <summary className="text-sm text-[var(--muted)] cursor-pointer hover:text-white">
              História validácií ({reports.length - 1} starších)
            </summary>
            <ul className="mt-3 space-y-2 text-sm">
              {reports.slice(1).map((r) => (
                <li key={r.id} className="border border-[var(--border)] rounded p-3">
                  <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                    <span>{new Date(r.created_at).toLocaleString("sk-SK")} · {r.model}</span>
                    <span className="font-mono">{r.weighted_score.toFixed(2)}</span>
                  </div>
                  <div className="prose-sk text-sm">
                    <MarkdownView source={r.summary_md} />
                  </div>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      <section className="mt-10 border-t border-[var(--border)] pt-6">
        <h2 className="text-lg font-semibold mb-3">Hodnotenie tímu</h2>
        <div className="flex items-center gap-4">
          <RatingStars ideaId={idea.id} initial={myRating} />
          <span className="text-sm text-[var(--muted)]">
            {avgStars
              ? `Priemer ${avgStars.toFixed(1)} z ${ratings.length}`
              : "Zatiaľ bez hodnotenia"}
          </span>
        </div>
      </section>

      <section className="mt-10 border-t border-[var(--border)] pt-6">
        <h2 className="text-lg font-semibold mb-3">Komentáre</h2>
        <CommentList ideaId={idea.id} comments={comments} myEmail={myEmail} />
      </section>
    </div>
  );
}
