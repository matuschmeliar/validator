import { AXIS_LABELS_SK, RUBRIC_WEIGHTS } from "@/lib/rubric";
import { YC_AXIS_LABELS_SK, YC_RUBRIC_WEIGHTS } from "@/lib/yc-rubric";
import type { RubricType } from "@/lib/db";

const MANIFEST_ORDER = ["alignment", "tech", "ethics", "economy", "deps", "moat"] as const;
const YC_ORDER = ["demand", "specificity", "status_quo", "wedge", "observation", "future_fit"] as const;

export function ScoreTable({
  scores,
  rubric = "manifest",
}: {
  scores: Record<string, number>;
  rubric?: RubricType;
}) {
  const order: readonly string[] = rubric === "yc" ? YC_ORDER : MANIFEST_ORDER;
  const labels: Record<string, string> = rubric === "yc" ? YC_AXIS_LABELS_SK : AXIS_LABELS_SK;
  const weights: Record<string, number> =
    rubric === "yc" ? YC_RUBRIC_WEIGHTS : RUBRIC_WEIGHTS;

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
          {["Os", "Skóre", "Váha"].map((h, i) => (
            <th
              key={h}
              style={{
                textAlign: i === 0 ? "left" : "right",
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
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {order.map((k, i) => (
          <tr key={k}>
            <td
              style={{
                padding: "10px 14px",
                borderBottom: i < order.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {labels[k]}
            </td>
            <td
              style={{
                padding: "10px 14px",
                borderBottom: i < order.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <Bar value={scores[k] ?? 0} />
            </td>
            <td
              style={{
                padding: "10px 14px",
                borderBottom: i < order.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                textAlign: "right",
                color: "rgba(255,255,255,0.4)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {(weights[k] * 100).toFixed(0)} %
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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
