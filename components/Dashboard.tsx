"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DashboardStats } from "@/lib/stats";
import type { IdeaWithLatest } from "@/lib/db";
import { MASLOW_LABELS_SK, MASLOW_HUE } from "@/lib/rubric";

const ACCENT = "#FF4D5E";
const ACCENT_PINK = "#FF8A95";
const BLUE = "#5A8AE6";
const GREEN = "#6EE7A6";

type Props = {
  stats: DashboardStats;
  myEmail: string;
};

export function Dashboard({ stats, myEmail }: Props) {
  const router = useRouter();
  const [author, setAuthor] = useState<string>("all");
  const [scoreMin, setScoreMin] = useState(0);
  const [sort, setSort] = useState<"score" | "recent" | "stars">("score");
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState<"overview" | "ideas" | "validated" | "unvalidated">("overview");
  const isOverview = activeNav === "overview" || activeNav === "ideas";

  const filtered = useMemo(() => {
    let list = [...stats.ideas];
    if (author !== "all") list = list.filter((i) => i.author_email === author);
    if (scoreMin > 0) list = list.filter((i) => (i.latest_score ?? 0) >= scoreMin);
    if (activeNav === "validated") list = list.filter((i) => i.latest_score !== null);
    if (activeNav === "unvalidated") list = list.filter((i) => i.latest_score === null);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) => i.title.toLowerCase().includes(q) || i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) => {
      if (sort === "score") return (b.latest_score ?? -1) - (a.latest_score ?? -1);
      if (sort === "stars") return (b.avg_stars ?? -1) - (a.avg_stars ?? -1);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return list;
  }, [stats.ideas, author, scoreMin, sort, search, activeNav]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="fa-stage" style={{ color: "#fff" }}>
      <div className="fa-stage-top-light" />
      <div
        className="fa-chrome"
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          height: "calc(100vh - 48px)",
        }}
      >
        {/* ── Sidebar ── */}
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "20px 16px",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            background: "linear-gradient(180deg, rgba(12,12,14,0.85) 0%, rgba(6,6,8,0.85) 100%)",
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px", marginBottom: 24 }}>
            <span className="fa-orb" />
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>Idea Validator</span>
          </div>

          {/* Active workspace */}
          <button className="fa-active-workspace" style={{ marginBottom: 14 }}>
            <SparkleIcon />
            DIUS Vízie
          </button>

          {/* Segmented (Ideas / Validated) */}
          <div className="fa-segments" style={{ marginBottom: 22 }}>
            <button
              className={`fa-segment ${activeNav === "overview" || activeNav === "ideas" ? "active" : ""}`}
              onClick={() => setActiveNav("overview")}
            >
              Idey
            </button>
            <button
              className={`fa-segment ${activeNav === "validated" ? "active" : ""}`}
              onClick={() => setActiveNav("validated")}
            >
              Validované
            </button>
          </div>

          {/* Pipeline nav */}
          <div className="fa-section-label">Prehľad</div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 22 }}>
            <NavRow
              label="Všetky idey"
              desc="Všetky príspevky"
              count={stats.total}
              icon={<GridIcon />}
              active={activeNav === "overview" || activeNav === "ideas"}
              accent={ACCENT}
              onClick={() => setActiveNav("overview")}
            />
            <NavRow
              label="Validované"
              desc="Majú Claude report"
              count={stats.validatedCount}
              icon={<CheckIcon />}
              active={activeNav === "validated"}
              accent={GREEN}
              badge={GREEN}
              onClick={() => setActiveNav("validated")}
            />
            <NavRow
              label="Bez validácie"
              desc="Čakajú na ohodnotenie"
              count={stats.unvalidatedCount}
              icon={<ClockIcon />}
              active={activeNav === "unvalidated"}
              accent={"#F5B547"}
              onClick={() => setActiveNav("unvalidated")}
            />
            <Link href="/reports" style={{ textDecoration: "none" }}>
              <div className="fa-nav-row">
                <span className="fa-icon-tile">
                  <ReportIcon />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>Reporty</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>História validácií</div>
                </div>
              </div>
            </Link>
          </nav>

        </aside>

        {/* ── Main ── */}
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            minWidth: 0,
            minHeight: 0,
          }}
        >
          {/* Topbar */}
          <header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "22px 28px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              gap: 16,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", color: "#fff" }}>
                Validation prehľad
              </h2>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                DIUS · {stats.total} {pluralize(stats.total, "idea", "idey", "ideí")} · {stats.validatedCount} validovaných
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div className="fa-pill" style={{ padding: "7px 12px" }}>
                <SearchIcon />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Hľadaj v ideách, tagoch…"
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#fff",
                    fontSize: 12,
                    width: 220,
                    fontFamily: "inherit",
                  }}
                />
              </div>
              <Link href="/ideas/new" className="fa-pill primary">
                <PlusIcon />
                Pridať ideu
              </Link>
              <button
                className="fa-pill"
                onClick={logout}
                title={myEmail}
                style={{ padding: "7px 10px", fontSize: 11 }}
              >
                <UserIcon />
                {myEmail.split("@")[0]}
              </button>
            </div>
          </header>

          {isOverview && (
          <>
          {/* KPI strip */}
          <div
            style={{
              padding: "18px 24px 12px",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            <KpiTile
              label="Priem. skóre"
              value={
                <span>
                  <span className="fa-score-grad" style={{ fontSize: 40 }}>
                    {stats.avgScore !== null ? stats.avgScore.toFixed(2) : "—"}
                  </span>
                  <span style={{ fontSize: 16, color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>/ 5</span>
                </span>
              }
              delta={stats.validatedCount > 0 ? `n=${stats.validatedCount} reportov` : "ešte žiadny report"}
              icon={<TrendIcon />}
              iconColor={ACCENT}
              trend={paddedTrend(stats.weeklyValidations)}
            />
            <KpiTile
              label="Idey v systéme"
              value={
                <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.04em" }}>{stats.total}</span>
              }
              delta={`+${stats.weeklyActivity[stats.weeklyActivity.length - 1]} tento týždeň`}
              icon={<ShieldIcon />}
              iconColor={ACCENT_PINK}
              trend={paddedTrend(stats.weeklyActivity)}
            />
            <KpiTile
              label="Validované"
              value={
                <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.04em", color: GREEN }}>
                  {stats.validatedCount}
                </span>
              }
              delta={
                stats.total > 0
                  ? `${Math.round((stats.validatedCount / stats.total) * 100)} % zo všetkých`
                  : "—"
              }
              icon={<CheckIcon />}
              iconColor={GREEN}
              trend={paddedTrend(stats.weeklyValidations)}
            />
            <KpiTile
              label="Priem. hviezdičky"
              value={
                <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.04em", color: BLUE }}>
                  {stats.avgStars !== null ? stats.avgStars.toFixed(1) : "—"}
                </span>
              }
              delta={stats.avgStars !== null ? "hodnotenie tímu" : "zatiaľ bez hodnotenia"}
              icon={<StarIcon />}
              iconColor={BLUE}
              trend={paddedTrend([0, 0, 0, 0, 0, 0, 0, stats.avgStars !== null ? Math.round(stats.avgStars * 20) : 0])}
            />
          </div>

          {/* Mid charts */}
          <div
            style={{
              padding: "6px 24px 12px",
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {/* Maslow distribution */}
            <div className="fa-card">
              <div className="fa-card-inner" style={{ padding: 18 }}>
                <SectionHeader label="Podľa Maslow potrieb" sub={
                  stats.maslowClassifiedCount > 0
                    ? `${stats.maslowClassifiedCount} z ${stats.total} klasifikovaných`
                    : "Žiadne klasifikované"
                } />
                {stats.maslowClassifiedCount === 0 ? (
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                    Pri zadaní idey vyber Maslow úroveň, alebo nechaj Claude aby ju doplnil pri validácii.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {stats.byMaslow.map((m) => {
                      const pct =
                        stats.maslowClassifiedCount > 0
                          ? (m.count / stats.maslowClassifiedCount) * 100
                          : 0;
                      return (
                        <div key={m.level} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "16px 1fr auto auto",
                              alignItems: "center",
                              gap: 8,
                              fontSize: 11,
                            }}
                          >
                            <span
                              style={{
                                width: 16,
                                fontSize: 10,
                                fontWeight: 700,
                                color: m.hue,
                                fontVariantNumeric: "tabular-nums",
                              }}
                            >
                              M{m.level}
                            </span>
                            <span
                              style={{
                                color: "rgba(255,255,255,0.75)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {m.name}
                            </span>
                            <span
                              style={{
                                color: "rgba(255,255,255,0.4)",
                                fontVariantNumeric: "tabular-nums",
                                fontSize: 10,
                                minWidth: 22,
                                textAlign: "right",
                              }}
                            >
                              {m.count}
                            </span>
                            <span
                              style={{
                                color: m.hue,
                                fontVariantNumeric: "tabular-nums",
                                fontSize: 11,
                                fontWeight: 500,
                                minWidth: 30,
                                textAlign: "right",
                              }}
                            >
                              {m.avg !== null ? m.avg.toFixed(2) : "—"}
                            </span>
                          </div>
                          <div
                            style={{
                              height: 3,
                              background: "rgba(255,255,255,0.05)",
                              borderRadius: 99,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${pct}%`,
                                height: "100%",
                                background: m.hue,
                                opacity: m.count > 0 ? 1 : 0,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Activity */}
            <div className="fa-card">
              <div className="fa-card-inner" style={{ padding: 18 }}>
                <SectionHeader label="Aktivita" sub={null}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.025em", color: "#fff" }}>
                      {stats.weeklyActivity.reduce((a, b) => a + b, 0)}
                    </span>
                    <span style={{ fontSize: 11, color: GREEN }}>
                      / 8 týždňov
                    </span>
                  </div>
                </SectionHeader>
                <ActivityChart data={stats.weeklyActivity} approvals={stats.weeklyValidations} />
              </div>
            </div>

            {/* Top 5 */}
            <div className="fa-card">
              <div className="fa-card-inner" style={{ padding: 18 }}>
                <SectionHeader label="Top performers" sub="Najlepšie validované" />
                {stats.top5.length === 0 ? (
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                    Zatiaľ žiadne validované idey.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {stats.top5.map((idea, i) => (
                      <Link
                        key={idea.id}
                        href={`/ideas/${idea.id}`}
                        className="fa-row"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "16px 1fr 38px",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 6px",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.3)",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          0{i + 1}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "#fff",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {idea.title}
                        </span>
                        <span className="fa-score-grad" style={{ fontSize: 14, textAlign: "right" }}>
                          {idea.latest_score?.toFixed(2)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          </>
          )}

          {/* Filter rail */}
          <div
            style={{
              padding: "10px 24px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "rgba(255,255,255,0.5)",
                fontSize: 12,
                paddingRight: 8,
                borderRight: "1px solid rgba(255,255,255,0.06)",
                marginRight: 4,
              }}
            >
              <FilterIcon />
              Filtre
            </div>
            <FilterChip
              label="Autor"
              value={author === "all" ? "Všetci" : author.split("@")[0]}
              options={[["all", "Všetci"], ...stats.uniqueAuthors.map((a): [string, string] => [a, a])]}
              onChange={(v) => setAuthor(v)}
            />
            <div className="fa-pill" style={{ padding: "6px 12px", gap: 10 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Skóre ≥</span>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={scoreMin}
                onChange={(e) => setScoreMin(+e.target.value)}
                style={{ width: 100, accentColor: ACCENT }}
              />
              <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", minWidth: 24, color: "#fff" }}>
                {scoreMin.toFixed(1)}
              </span>
            </div>
            {(author !== "all" || scoreMin > 0 || search) && (
              <button
                className="fa-pill"
                onClick={() => {
                  setAuthor("all");
                  setScoreMin(0);
                  setSearch("");
                }}
                style={{ fontSize: 11, color: ACCENT_PINK }}
              >
                Vymazať ×
              </button>
            )}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                {filtered.length} {pluralize(filtered.length, "idea", "idey", "ideí")}
              </span>
              <div className="fa-segments" style={{ padding: 3, gridTemplateColumns: "1fr 1fr 1fr" }}>
                {(
                  [
                    ["score", "Skóre"],
                    ["recent", "Najnovšie"],
                    ["stars", "★"],
                  ] as const
                ).map(([k, lbl]) => (
                  <button
                    key={k}
                    className={`fa-segment ${sort === k ? "active" : ""}`}
                    onClick={() => setSort(k)}
                    style={{ padding: "5px 12px", fontSize: 11 }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ideas table */}
          <div style={{ padding: "2px 24px 28px" }}>
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
                <thead>
                  <tr>
                    {["Idea", "Autor", "Skóre", "★", "💬", "Aktualizované", ""].map((h, i) => (
                      <th
                        key={i}
                        style={{
                          textAlign: ["Skóre", "★", "💬"].includes(h) ? "right" : "left",
                          fontWeight: 500,
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: "rgba(255,255,255,0.35)",
                          padding: "14px 12px 12px",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((idea) => (
                    <IdeaRow key={idea.id} idea={idea} />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function NavRow({
  label,
  desc,
  count,
  icon,
  active,
  accent,
  badge,
  onClick,
}: {
  label: string;
  desc: string;
  count?: number;
  icon: React.ReactNode;
  active?: boolean;
  accent?: string;
  badge?: string;
  onClick?: () => void;
}) {
  return (
    <button className={`fa-nav-row ${active ? "active" : ""}`} onClick={onClick}>
      <span
        className="fa-icon-tile"
        style={active && accent ? { color: accent, borderColor: `${accent}40` } : {}}
      >
        {icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: active ? "#fff" : "rgba(255,255,255,0.85)", fontWeight: 500 }}>
          {label}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{desc}</div>
      </div>
      {count != null && (
        <span
          style={{
            fontSize: 11,
            color: badge ?? "rgba(255,255,255,0.5)",
            fontVariantNumeric: "tabular-nums",
            fontWeight: 500,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function SectionHeader({
  label,
  sub,
  children,
}: {
  label: string;
  sub: string | null;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        gap: 8,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.45)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: 14, color: "#fff", marginTop: 4, fontWeight: 500 }}>{sub}</div>
        )}
      </div>
      {children}
    </div>
  );
}

function KpiTile({
  label,
  value,
  delta,
  icon,
  iconColor,
  trend,
}: {
  label: string;
  value: React.ReactNode;
  delta: string;
  icon: React.ReactNode;
  iconColor: string;
  trend: number[];
}) {
  const max = Math.max(...trend, 1);
  return (
    <div className="fa-card">
      <div
        className="fa-card-inner"
        style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            className="fa-icon-tile"
            style={{ width: 24, height: 24, color: iconColor, borderColor: `${iconColor}26` }}
          >
            {icon}
          </span>
          <span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 10,
            minHeight: 44,
          }}
        >
          <div>{value}</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 32, flex: "0 0 80px" }}>
            {trend.map((v, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${(v / max) * 100}%`,
                  minHeight: 2,
                  background:
                    i === trend.length - 1
                      ? `linear-gradient(180deg, ${iconColor}, ${iconColor}66)`
                      : "rgba(255,255,255,0.08)",
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{delta}</div>
      </div>
    </div>
  );
}

function ActivityChart({ data, approvals }: { data: number[]; approvals: number[] }) {
  const w = 360;
  const h = 88;
  const pad = 6;
  const max = Math.max(...data, 1);
  const stepX = (w - pad * 2) / Math.max(data.length - 1, 1);
  const points = data.map((v, i): [number, number] => [
    pad + i * stepX,
    h - pad - (v / max) * (h - pad * 2 - 6),
  ]);
  const path =
    points.length > 0
      ? points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ")
      : "";
  const area =
    points.length > 0
      ? `${path} L ${points[points.length - 1][0]} ${h - pad} L ${points[0][0]} ${h - pad} Z`
      : "";
  const last = points[points.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: 88, display: "block" }}>
      <defs>
        <linearGradient id="act-area-v2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF4D5E" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#FF4D5E" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="act-line-v2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF2E3D" />
          <stop offset="50%" stopColor="#FF6A7A" />
          <stop offset="100%" stopColor="#5A8AE6" />
        </linearGradient>
      </defs>
      {area && <path d={area} fill="url(#act-area-v2)" />}
      {path && <path d={path} fill="none" stroke="url(#act-line-v2)" strokeWidth="2" strokeLinecap="round" />}
      {approvals.map(
        (a, i) =>
          a > 0 && (
            <circle
              key={i}
              cx={pad + i * stepX}
              cy={h - pad - 4}
              r="2.5"
              fill="#6EE7A6"
              opacity="0.65"
            />
          )
      )}
      {last && <circle cx={last[0]} cy={last[1]} r="4" fill="#5A8AE6" />}
      {last && <circle cx={last[0]} cy={last[1]} r="7" fill="#5A8AE6" opacity="0.25" />}
    </svg>
  );
}

function FilterChip({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button className="fa-pill" onClick={() => setOpen(!open)} style={{ padding: "6px 12px" }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{label}:</span>
        <span style={{ color: "#fff" }}>{value}</span>
        <ChevronDownIcon />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 50 }} />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              zIndex: 51,
              minWidth: 240,
              maxHeight: 280,
              overflowY: "auto",
              background: "linear-gradient(180deg, #18181C 0%, #0E0E12 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: 4,
              boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
            }}
          >
            {options.map(([v, lbl]) => (
              <button
                key={v}
                onClick={() => {
                  onChange(v);
                  setOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 12,
                  textAlign: "left",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
              >
                {lbl}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function IdeaRow({ idea }: { idea: IdeaWithLatest }) {
  const initial = (idea.author_email[0] ?? "?").toUpperCase();
  const pct = idea.latest_score !== null ? (idea.latest_score / 5) * 100 : 0;
  const maslow = idea.latest_maslow_level ?? idea.maslow_level;
  return (
    <tr
      onClick={() => {
        window.location.href = `/ideas/${idea.id}`;
      }}
      className="fa-row"
      style={{ cursor: "pointer" }}
    >
      <td
        style={{
          padding: "13px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          maxWidth: 380,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#fff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {idea.title}
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            marginTop: 3,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {idea.horizont && (
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
              Horizont: {idea.horizont}
            </span>
          )}
          {maslow != null && (
            <span
              style={{
                fontSize: 10,
                padding: "1px 7px",
                borderRadius: 999,
                background: `${MASLOW_HUE[maslow]}1f`,
                border: `1px solid ${MASLOW_HUE[maslow]}55`,
                color: MASLOW_HUE[maslow],
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
              title={`Maslow ${maslow} — ${MASLOW_LABELS_SK[maslow]}`}
            >
              M{maslow} · {MASLOW_LABELS_SK[maslow]}
            </span>
          )}
        </div>
      </td>
      <td style={{ padding: "13px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar initial={initial} size={22} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
            {idea.author_email.split("@")[0]}
          </span>
        </div>
      </td>
      <td
        style={{
          padding: "13px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          textAlign: "right",
        }}
      >
        {idea.latest_score !== null ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 80,
                height: 4,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #DC1F3D 0%, #FF6A7A 100%)",
                }}
              />
            </div>
            <span className="fa-score-grad" style={{ fontSize: 14, minWidth: 38, textAlign: "right" }}>
              {idea.latest_score.toFixed(2)}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>—</span>
        )}
      </td>
      <td
        style={{
          padding: "13px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
          color: "rgba(255,255,255,0.7)",
          fontSize: 12,
        }}
      >
        {idea.avg_stars !== null ? (
          <span>
            {idea.avg_stars.toFixed(1)}
            <span style={{ color: "rgba(255,255,255,0.3)" }}> · {idea.ratings_count}</span>
          </span>
        ) : (
          <span style={{ color: "rgba(255,255,255,0.3)" }}>—</span>
        )}
      </td>
      <td
        style={{
          padding: "13px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
          color: "rgba(255,255,255,0.7)",
          fontSize: 12,
        }}
      >
        {idea.comments_count > 0 ? idea.comments_count : <span style={{ color: "rgba(255,255,255,0.3)" }}>—</span>}
      </td>
      <td
        style={{
          padding: "13px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
        }}
      >
        {relativeDate(idea.updated_at)}
      </td>
      <td
        style={{
          padding: "13px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        <ChevronRightIcon />
      </td>
    </tr>
  );
}

function Avatar({ initial, size = 22 }: { initial: string; size?: number }) {
  const colors = ["#FF7AB0", "#FF8A65", "#9F7BFF", "#60A5FA", "#4ADE80", "#F5B547"];
  const idx = initial.charCodeAt(0) % colors.length;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.42,
        fontWeight: 600,
        color: "#0A0A0F",
        background: `linear-gradient(135deg, ${colors[idx]}, ${colors[(idx + 2) % colors.length]})`,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        padding: "60px 24px",
        textAlign: "center",
        color: "rgba(255,255,255,0.5)",
        fontSize: 14,
      }}
    >
      Žiadne idey nezodpovedajú filtrom.{" "}
      <Link href="/ideas/new" style={{ color: "var(--accent-2)", textDecoration: "underline" }}>
        Pridať novú →
      </Link>
    </div>
  );
}

/* ─── Utils ─── */

function pluralize(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  if (n >= 2 && n <= 4) return few;
  return many;
}

function paddedTrend(arr: number[]): number[] {
  if (arr.length >= 8) return arr.slice(-8);
  return Array(8 - arr.length).fill(0).concat(arr);
}

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const day = 86400000;
  if (diff < day) return "dnes";
  if (diff < 2 * day) return "včera";
  const days = Math.floor(diff / day);
  if (days < 7) return `pred ${days} d`;
  if (days < 30) return `pred ${Math.floor(days / 7)} t`;
  return new Date(iso).toLocaleDateString("sk-SK", { day: "numeric", month: "short" });
}

/* ─── Inline icons ─── */

function SparkleIcon() {
  return (
    <svg className="fa-sparkle" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="sparkle-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF4D5E" />
          <stop offset="100%" stopColor="#5A8AE6" />
        </linearGradient>
      </defs>
      <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6z" fill="url(#sparkle-grad)" />
      <path d="M19 14l.8 2.7L22 17.5l-2.2.8L19 21l-.8-2.7L16 17.5l2.2-.8z" fill="url(#sparkle-grad)" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 12l4 4L19 7" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function ReportIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}
function TrendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 5h18M6 12h12M10 19h4" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: "rgba(255,255,255,0.4)" }}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
