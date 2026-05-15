import {
  ValidationReport,
  RubricType,
  Idea,
  Verdict,
  Confidence,
} from "@/lib/db";
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
  index: number;
  total: number;
}) {
  const rubric = report.rubric_type ?? "manifest";
  const validatedAt = new Date(report.created_at);
  const strengths = report.strengths ?? [];
  const weaknesses = report.weaknesses ?? [];
  const redFlags = report.red_flags ?? [];

  return (
    <article className="fa-card" id={`report-${report.id}`}>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <RubricBadge rubric={rubric} />
              {report.verdict && <VerdictPill verdict={report.verdict} />}
              {report.confidence && <ConfidencePill confidence={report.confidence} />}
              {isLatest ? (
                <Chip color="#6EE7A6" label="Aktuálne" />
              ) : (
                <Chip color="rgba(255,255,255,0.5)" label={`#${total - index + 1}`} />
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
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexShrink: 0 }}>
            <span
              className="fa-score-grad fa-score-big"
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

        {/* TLDR */}
        {report.summary_md && (
          <div
            style={{
              padding: "12px 14px",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              marginBottom: 18,
            }}
          >
            <SmallLabel>TL;DR</SmallLabel>
            <div className="prose-sk" style={{ marginTop: 6, fontSize: 14 }}>
              <MarkdownView source={report.summary_md} />
            </div>
          </div>
        )}

        {/* Red flags — only when something serious */}
        {redFlags.length > 0 && (
          <div
            style={{
              padding: "12px 14px",
              background: "rgba(255, 77, 94, 0.07)",
              border: "1px solid rgba(255, 77, 94, 0.3)",
              borderRadius: 10,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#FF8A95",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              ⚠ Red flags
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                fontSize: 13,
                color: "#fff",
                lineHeight: 1.5,
              }}
            >
              {redFlags.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Strengths / Weaknesses side-by-side */}
        {(strengths.length > 0 || weaknesses.length > 0) && (
          <div
            className="fa-sw-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <BulletPanel
              title="Silné stránky"
              hue="#6EE7A6"
              items={strengths}
              emptyHint="—"
            />
            <BulletPanel
              title="Slabé stránky"
              hue="#FF8A95"
              items={weaknesses}
              emptyHint="—"
            />
          </div>
        )}

        {/* Score table */}
        <SmallLabel>Skóre podľa osí</SmallLabel>
        <div style={{ marginTop: 6 }}>
          <ScoreTable
            scores={report.scores}
            notes={report.axis_notes ?? undefined}
            rubric={rubric}
          />
        </div>

        {/* Maslow */}
        <MaslowView
          authorLevel={idea.maslow_level}
          claudeLevel={report.maslow_level}
          claudeNote={report.maslow_note}
        />

        {/* Critical question */}
        {report.critical_question && (
          <div
            style={{
              marginTop: 18,
              padding: "14px 16px",
              background: "rgba(245, 181, 71, 0.07)",
              border: "1px solid rgba(245, 181, 71, 0.3)",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#F5B547",
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              Kritická otázka
            </div>
            <div style={{ fontSize: 14, color: "#fff", lineHeight: 1.55 }}>
              {report.critical_question}
            </div>
          </div>
        )}

        {/* Next step */}
        {report.next_step && (
          <div
            style={{
              marginTop: 12,
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
                fontWeight: 600,
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

function BulletPanel({
  title,
  hue,
  items,
  emptyHint,
}: {
  title: string;
  hue: string;
  items: string[];
  emptyHint: string;
}) {
  return (
    <div
      style={{
        padding: "12px 14px",
        background: `${hue}0d`,
        border: `1px solid ${hue}33`,
        borderRadius: 10,
      }}
    >
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: hue,
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        {title}
      </div>
      {items.length === 0 ? (
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>{emptyHint}</div>
      ) : (
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 13,
            color: "rgba(255,255,255,0.92)",
            lineHeight: 1.5,
          }}
        >
          {items.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </div>
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

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const config = {
    go: { hue: "#6EE7A6", label: "GO" },
    caution: { hue: "#F5B547", label: "CAUTION" },
    "no-go": { hue: "#FF6A7A", label: "NO-GO" },
  }[verdict];
  return (
    <span
      style={{
        fontSize: 11,
        padding: "3px 10px",
        borderRadius: 999,
        background: `${config.hue}26`,
        border: `1px solid ${config.hue}66`,
        color: config.hue,
        fontWeight: 700,
        letterSpacing: "0.08em",
      }}
    >
      {config.label}
    </span>
  );
}

function ConfidencePill({ confidence }: { confidence: Confidence }) {
  const label = { high: "High confidence", medium: "Medium confidence", low: "Low confidence" }[
    confidence
  ];
  const opacity = { high: 1, medium: 0.7, low: 0.45 }[confidence];
  return (
    <span
      style={{
        fontSize: 10,
        padding: "3px 8px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: `rgba(255,255,255,${opacity})`,
        fontWeight: 500,
        letterSpacing: "0.04em",
      }}
    >
      {label}
    </span>
  );
}

function Chip({ color, label }: { color: string; label: string }) {
  return (
    <span
      style={{
        fontSize: 10,
        padding: "2px 8px",
        borderRadius: 999,
        background:
          color === "#6EE7A6" ? "rgba(110,231,166,0.12)" : "rgba(255,255,255,0.04)",
        border:
          color === "#6EE7A6"
            ? "1px solid rgba(110,231,166,0.35)"
            : "1px solid rgba(255,255,255,0.08)",
        color,
        fontWeight: 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        fontVariantNumeric: "tabular-nums",
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
