import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin, Idea, ValidationReport, IdeaAttachment, IdeaAmendment } from "@/lib/db";
import { readSessionEmail } from "@/lib/auth";
import { MarkdownView } from "@/components/MarkdownView";
import { ValidateButton } from "@/components/ValidateButton";
import { RatingStars } from "@/components/RatingStars";
import { CommentList } from "@/components/CommentList";
import { MaslowView } from "@/components/MaslowView";
import { AttachmentManager } from "@/components/AttachmentManager";
import { AmendmentList } from "@/components/AmendmentList";
import { ReportCard } from "@/components/ReportCard";

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
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 16,
                marginBottom: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <SectionLabel>Claude validácie</SectionLabel>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 6 }}>
                  {reports.length === 0
                    ? "Žiadne reporty. Spusti prvú validáciu."
                    : `${reports.length} ${
                        reports.length === 1
                          ? "report"
                          : reports.length < 5
                          ? "reporty"
                          : "reportov"
                      } · najnovší hore`}
                </div>
              </div>
              <ValidateButton ideaId={idea.id} />
            </div>

            {reports.length === 0 ? (
              <div className="fa-card">
                <div className="fa-card-inner" style={{ padding: 24 }}>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: 0 }}>
                    Idea ešte nebola validovaná. Klikni „Validovať" alebo „YC validácia" pre prvý report.
                  </p>
                  {idea.maslow_level != null && (
                    <MaslowView
                      authorLevel={idea.maslow_level}
                      claudeLevel={null}
                      claudeNote={null}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {reports.map((r, i) => (
                  <ReportCard
                    key={r.id}
                    report={r}
                    idea={idea}
                    isLatest={i === 0}
                    index={i + 1}
                    total={reports.length}
                  />
                ))}
              </div>
            )}
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

