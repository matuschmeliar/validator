import Link from "next/link";
import { supabaseAdmin } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const { data } = await supabaseAdmin()
    .from("ideas_with_latest_report")
    .select("id, title, horizont, latest_score, latest_next_step, latest_validated_at, author_email")
    .order("latest_score", { ascending: false, nullsFirst: false });

  const rows = data ?? [];
  const validated = rows.filter((r) => r.latest_score !== null);

  return (
    <div className="fa-stage">
      <div className="fa-stage-top-light" />
      <div className="fa-chrome" style={{ padding: "32px 40px 40px", minHeight: "calc(100vh - 48px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Link href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
            ← Späť na dashboard
          </Link>
          <h1
            style={{
              margin: "12px 0 6px",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            Reporty
          </h1>
          <p style={{ margin: "0 0 28px", color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            Najnovšia Claude validácia pre každú ideu, zoradené podľa skóre.
          </p>

          {validated.length === 0 ? (
            <div className="fa-card">
              <div className="fa-card-inner" style={{ padding: "40px 24px", textAlign: "center" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>
                  Zatiaľ žiadne validácie.{" "}
                  <Link href="/" style={{ color: "var(--accent-2)" }}>
                    Otvor ideu a klikni „Validovať" →
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <div className="fa-card">
              <div className="fa-card-inner" style={{ padding: 0 }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
                  <thead>
                    <tr>
                      {["#", "Idea", "Autor", "Skóre", "Posledná"].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: h === "Skóre" ? "right" : "left",
                            fontWeight: 500,
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "rgba(255,255,255,0.35)",
                            padding: "16px 16px 12px",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {validated.map((r, idx) => {
                      return (
                        <tr key={r.id} className="fa-row" style={{ cursor: "pointer" }}>
                          <td
                            style={{
                              padding: "13px 16px",
                              borderBottom: "1px solid rgba(255,255,255,0.04)",
                              fontSize: 11,
                              color: "rgba(255,255,255,0.3)",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {String(idx + 1).padStart(2, "0")}
                          </td>
                          <td style={{ padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <Link
                              href={`/ideas/${r.id}`}
                              style={{
                                color: "#fff",
                                fontWeight: 500,
                                textDecoration: "none",
                              }}
                            >
                              {r.title}
                            </Link>
                            {r.horizont && (
                              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                                Horizont: {r.horizont}
                              </div>
                            )}
                          </td>
                          <td
                            style={{
                              padding: "13px 16px",
                              borderBottom: "1px solid rgba(255,255,255,0.04)",
                              fontSize: 12,
                              color: "rgba(255,255,255,0.7)",
                            }}
                          >
                            {r.author_email?.split("@")[0]}
                          </td>
                          <td
                            style={{
                              padding: "13px 16px",
                              borderBottom: "1px solid rgba(255,255,255,0.04)",
                              textAlign: "right",
                            }}
                          >
                            <span className="fa-score-grad" style={{ fontSize: 16 }}>
                              {r.latest_score?.toFixed(2)}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "13px 16px",
                              borderBottom: "1px solid rgba(255,255,255,0.04)",
                              fontSize: 11,
                              color: "rgba(255,255,255,0.4)",
                            }}
                          >
                            {r.latest_validated_at
                              ? new Date(r.latest_validated_at).toLocaleDateString("sk-SK", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
