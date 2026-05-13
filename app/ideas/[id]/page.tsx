import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin, Idea, ValidationReport, IdeaAttachment, IdeaAmendment } from "@/lib/db";
import { readSessionEmail } from "@/lib/auth";
import { MarkdownView } from "@/components/MarkdownView";
import { ScoreTable } from "@/components/ScoreTable";
import { ValidateButton } from "@/components/ValidateButton";
import { RatingStars } from "@/components/RatingStars";
import { CommentList } from "@/components/CommentList";
import { MaslowView } from "@/components/MaslowView";
import { AttachmentManager } from "@/components/AttachmentManager";
import { AmendmentList } from "@/components/AmendmentList";

export const dynamic = "force-dynamic";

export default async function IdeaDetail({ params }: { params: { id: string } }) {
  const db = supabaseAdmin();
  const myEmail = (await readSessionEmail()) ?? "";

  const [ideaRes, reportsRes, ratingsRes, commentsRes, attachmentsRes, amendmentsRes] =
    await Promise.all([
      db.from("ideas").select("*").eq("id", params.id).single(),
      db
        .from("validation_reports")
        .select("*")
        .eq("idea_id", params.id)
        .order("created_at", { ascending: false }),
      db.from("ratings").select("*").eq("idea_id", params.id),
      db.from("comments").select("*").eq("idea_id", params.id).order("created_at", { ascending: true }),
      db
        .from("idea_attachments")
        .select("*")
        .eq("idea_id", params.id)
        .order("created_at", { ascending: true }),
      db
        .from("idea_amendments")
        .select("*")
        .eq("idea_id", params.id)
        .order("created_at", { ascending: true }),
    ]);

  if (ideaRes.error || !ideaRes.data) notFound();

  const idea = ideaRes.data as Idea;
  const reports = (reportsRes.data ?? []) as ValidationReport[];
  const ratings = ratingsRes.data ?? [];
  const comments = commentsRes.data ?? [];
  const attachments = (attachmentsRes.data ?? []) as IdeaAttachment[];
  const amendments = (amendmentsRes.data ?? []) as IdeaAmendment[];

  const latest = reports[0] ?? null;
  const myRating = ratings.find((r) => r.author_email === myEmail)?.stars ?? null;
  const avgStars =
    ratings.length > 0 ? ratings.reduce((a, r) => a + r.stars, 0) / ratings.length : null;

  const isAuthor = idea.author_email === myEmail;

  return (
    <div className="fa-stage">
      <div className="fa-stage-top-light" />
      <div className="fa-chrome" style={{ padding: "28px 40px 48px", minHeight: "calc(100vh - 48px)" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <Link href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
            ← Späť na dashboard
          </Link>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginTop: 16, gap: 24 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                  {idea.horizont && <>Horizont: {idea.horizont} · </>}autor: {idea.author_email}
                </span>
              </div>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.15, color: "#fff" }}>
                {idea.title}
              </h1>
              {idea.tags?.length > 0 && (
                <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
                  {idea.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 11,
                        padding: "4px 10px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 999,
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {isAuthor && (
              <Link href={`/ideas/${idea.id}/edit`} className="fa-pill">
                Upraviť
              </Link>
            )}
          </div>

          {/* Body */}
          <section style={{ marginTop: 32 }}>
            <SectionLabel>Telo</SectionLabel>
            <div className="prose-sk" style={{ marginTop: 8 }}>
              <MarkdownView source={idea.body_md} />
            </div>
          </section>

          {/* Amendments */}
          <section style={{ marginTop: 32 }}>
            <SectionLabel>Doplnenia ({amendments.length})</SectionLabel>
            <div style={{ marginTop: 12 }}>
              <AmendmentList
                ideaId={idea.id}
                initial={amendments}
                myEmail={myEmail}
                ideaAuthorEmail={idea.author_email}
              />
            </div>
          </section>

          {/* Validation */}
          <section style={{ marginTop: 36 }}>
            <div className="fa-card">
              <div className="fa-card-inner" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 12 }}>
                  <div>
                    <SectionLabel>Claude validácia</SectionLabel>
                    {latest && (
                      <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                        {latest.model} · {new Date(latest.created_at).toLocaleString("sk-SK")} · {latest.created_by_email}
                      </div>
                    )}
                  </div>
                  <ValidateButton ideaId={idea.id} />
                </div>

                {!latest ? (
                  <>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0 }}>
                      Idea ešte nebola validovaná. Klikni „Validovať" pre prvý report.
                    </p>
                    {idea.maslow_level != null && (
                      <MaslowView
                        authorLevel={idea.maslow_level}
                        claudeLevel={null}
                        claudeNote={null}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 18 }}>
                      <span className="fa-score-grad" style={{ fontSize: 56, lineHeight: 1 }}>
                        {latest.weighted_score.toFixed(2)}
                      </span>
                      <span style={{ fontSize: 18, color: "rgba(255,255,255,0.35)" }}>/ 5</span>
                    </div>
                    <ScoreTable scores={latest.scores} />
                    <MaslowView
                      authorLevel={idea.maslow_level}
                      claudeLevel={latest.maslow_level}
                      claudeNote={latest.maslow_note}
                    />
                    <div className="prose-sk" style={{ marginTop: 18 }}>
                      <MarkdownView source={latest.summary_md} />
                    </div>
                    {latest.next_step && (
                      <div
                        style={{
                          marginTop: 18,
                          padding: "14px 16px",
                          background: "rgba(255, 77, 94, 0.06)",
                          border: "1px solid rgba(255, 77, 94, 0.2)",
                          borderRadius: 10,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "#FF8A95",
                            marginBottom: 6,
                            fontWeight: 500,
                          }}
                        >
                          Ďalší krok
                        </div>
                        <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.55 }}>{latest.next_step}</div>
                      </div>
                    )}
                  </>
                )}

                {reports.length > 1 && (
                  <details style={{ marginTop: 20 }}>
                    <summary
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.5)",
                        cursor: "pointer",
                      }}
                    >
                      História validácií ({reports.length - 1} starších)
                    </summary>
                    <ul style={{ marginTop: 12, listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                      {reports.slice(1).map((r) => (
                        <li
                          key={r.id}
                          style={{
                            padding: "12px 14px",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 10,
                            background: "rgba(255,255,255,0.02)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 11,
                              color: "rgba(255,255,255,0.4)",
                              marginBottom: 6,
                            }}
                          >
                            <span>
                              {new Date(r.created_at).toLocaleString("sk-SK")} · {r.model}
                            </span>
                            <span className="fa-score-grad" style={{ fontSize: 14 }}>
                              {r.weighted_score.toFixed(2)}
                            </span>
                          </div>
                          <div className="prose-sk" style={{ fontSize: 12 }}>
                            <MarkdownView source={r.summary_md} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </div>
          </section>

          {/* Attachments */}
          <section style={{ marginTop: 32 }}>
            <SectionLabel>Prílohy</SectionLabel>
            <div style={{ marginTop: 12 }}>
              <AttachmentManager
                ideaId={idea.id}
                initial={attachments}
                canEdit={isAuthor}
              />
            </div>
          </section>

          {/* Ratings */}
          <section style={{ marginTop: 28 }}>
            <SectionLabel>Hodnotenie tímu</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
              <RatingStars ideaId={idea.id} initial={myRating} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                {avgStars
                  ? `Priemer ${avgStars.toFixed(1)} z ${ratings.length}`
                  : "Zatiaľ bez hodnotenia"}
              </span>
            </div>
          </section>

          {/* Comments */}
          <section style={{ marginTop: 32 }}>
            <SectionLabel>Komentáre</SectionLabel>
            <div style={{ marginTop: 12 }}>
              <CommentList ideaId={idea.id} comments={comments} myEmail={myEmail} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        color: "rgba(255,255,255,0.45)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
}
