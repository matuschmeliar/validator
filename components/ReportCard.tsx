import { ValidationReport, RubricType, Idea } from "@/lib/db";
import { MarkdownView } from "@/components/MarkdownView";
import { ScoreTable } from "@/components/ScoreTable";
import { MaslowView } from "@/components/MaslowView";

export function ReportCard({
  report,
  idea,
  isLatest,
  index,
  total,
}: {
  report: ValidationReport;
  idea: Idea;
  isLatest: boolean;
  index: number; // 1-based, 1 = newest
  total: number;
}) {
  const rubric = report.rubric_type ?? "manifest";
  const validatedAt = new Date(report.created_at);

  return (
    <article
      className="fa-card"
      style={{ position: "relative" }}
      id={`report-${report.id}`}
    >
      <div className="fa-card-inner" style={{ padding: isLatest ? 24 : 18 }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <RubricBadge rubric={rubric} />
              {isLatest ? (
                <span
                  style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "rgba(110,231,166,0.12)",
                    border: "1px solid rgba(110,231,166,0.35)",
                    color: "#6EE7A6",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Aktuálne
                </span>
              ) : (
                <span
                  style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  #{total - index + 1}
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
              {validatedAt.toLocaleString("sk-SK", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              · {report.model} · {report.created_by_email.split("@")[0]}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 6,
              flexShrink: 0,
            }}
          >
            <span
              className="fa-score-grad"
              style={{ fontSize: isLatest ? 48 : 32, lineHeight: 1 }}
            >
              {report.weighted_score.toFixed(2)}
            </span>
            <span
              style={{
                fontSize: isLatest ? 16 : 12,
                color: "rgba(255,255,255,0.35)",
              }}
            >
              / 5
            </span>
          </div>
        </header>

        {/* Score table with notes */}
        <ScoreTable
          scores={report.scores}
          notes={report.axis_notes ?? undefined}
          rubric={rubric}
        />

        {/* Maslow */}
        <MaslowView
          authorLevel={idea.maslow_level}
          claudeLevel={report.maslow_level}
          claudeNote={report.maslow_note}
        />

        {/* Summary */}
        {report.summary_md && (
          <div style={{ marginTop: 18 }}>
            <SmallLabel>Súhrn</SmallLabel>
            <div className="prose-sk" style={{ marginTop: 6, fontSize: isLatest ? 14 : 13 }}>
              <MarkdownView source={report.summary_md} />
            </div>
          </div>
        )}

        {/* Next step */}
        {report.next_step && (
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
            <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.55 }}>
              {report.next_step}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function RubricBadge({ rubric }: { rubric: RubricType }) {
  const isYC = rubric === "yc";
  const hue = isYC ? "#F5B547" : "#FF6A7A";
  const label = isYC ? "YC validácia" : "DIUS manifest";
  return (
    <span
      style={{
        fontSize: 10,
        padding: "3px 9px",
        borderRadius: 999,
        background: `${hue}1f`,
        border: `1px solid ${hue}55`,
        color: hue,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {label}
    </span>
  );
}

function SmallLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "rgba(255,255,255,0.4)",
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
}
