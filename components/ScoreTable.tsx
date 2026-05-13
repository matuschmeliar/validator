import { AXIS_LABELS_SK, RUBRIC_WEIGHTS } from "@/lib/rubric";
import { YC_AXIS_LABELS_SK, YC_RUBRIC_WEIGHTS } from "@/lib/yc-rubric";
import type { RubricType } from "@/lib/db";

const MANIFEST_ORDER = ["alignment", "tech", "ethics", "economy", "deps", "moat"] as const;
const YC_ORDER = ["demand", "specificity", "status_quo", "wedge", "observation", "future_fit"] as const;

export function ScoreTable({
  scores,
  notes,
  rubric = "manifest",
}: {
  scores: Record<string, number>;
  notes?: Record<string, string> | null;
  rubric?: RubricType;
}) {
  const order: readonly string[] = rubric === "yc" ? YC_ORDER : MANIFEST_ORDER;
  const labels: Record<string, string> = rubric === "yc" ? YC_AXIS_LABELS_SK : AXIS_LABELS_SK;
  const weights: Record<string, number> =
    rubric === "yc" ? YC_RUBRIC_WEIGHTS : RUBRIC_WEIGHTS;
  const hasNotes = !!notes && Object.values(notes).some((v) => v && v.trim());

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: 0,
        fontSize: 13,
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <thead>
        <tr>
          <Th align="left">Os</Th>
          <Th align="right">Skóre</Th>
          <Th align="right">Váha</Th>
          {hasNotes && <Th align="left">Poznámka</Th>}
        </tr>
      </thead>
      <tbody>
        {order.map((k, i) => {
          const isLast = i === order.length - 1;
          const note = notes?.[k]?.trim();
          return (
            <tr key={k}>
              <td
                style={{
                  padding: "12px 14px",
                  borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.85)",
                  verticalAlign: "top",
                  whiteSpace: "nowrap",
                }}
              >
                {labels[k]}
              </td>
              <td
                style={{
                  padding: "12px 14px",
                  borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                  verticalAlign: "top",
                  whiteSpace: "nowrap",
                }}
              >
                <Bar value={scores[k] ?? 0} />
              </td>
              <td
                style={{
                  padding: "12px 14px",
                  borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
                  textAlign: "right",
                  color: "rgba(255,255,255,0.4)",
                  fontVariantNumeric: "tabular-nums",
                  verticalAlign: "top",
                  whiteSpace: "nowrap",
                }}
              >
                {(weights[k] * 100).toFixed(0)} %
              </td>
              {hasNotes && (
                <td
                  style={{
                    padding: "12px 14px",
                    borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 12,
                    lineHeight: 1.5,
                    verticalAlign: "top",
                    minWidth: 0,
                  }}
                >
                  {note || <span style={{ color: "rgba(255,255,255,0.25)" }}>—</span>}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function Th({ children, align }: { children: React.ReactNode; align: "left" | "right" }) {
  return (
    <th
      style={{
        textAlign: align,
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "rgba(255,255,255,0.4)",
        padding: "12px 14px",
        fontWeight: 500,
        background: "rgba(255,255,255,0.02)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {children}
    </th>
  );
}

function Bar({ value }: { value: number }) {
  const pct = (value / 5) * 100;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        justifyContent: "flex-end",
      }}
    >
      <span style={{ color: "#fff" }}>{value}/5</span>
      <span
        style={{
          display: "inline-block",
          width: 64,
          height: 4,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "block",
            height: "100%",
            width: `${pct}%`,
            background: "linear-gradient(90deg, #DC1F3D 0%, #FF6A7A 100%)",
          }}
        />
      </span>
    </span>
  );
}
