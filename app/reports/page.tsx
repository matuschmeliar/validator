import Link from "next/link";
import { supabaseAdmin } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const { data } = await supabaseAdmin()
    .from("ideas_with_latest_report")
    .select("id, title, smer, horizont, latest_score, latest_next_step, latest_validated_at")
    .order("latest_score", { ascending: false, nullsFirst: false });

  const rows = data ?? [];
  const validated = rows.filter((r) => r.latest_score !== null);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Reporty — zoradené podľa skóre</h1>

      {validated.length === 0 ? (
        <p className="text-[var(--muted)]">Zatiaľ žiadne validácie.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-[var(--muted)] border-b border-[var(--border)]">
              <th className="py-2 pr-3">#</th>
              <th className="py-2 pr-3">Idea</th>
              <th className="py-2 pr-3">Smer</th>
              <th className="py-2 pr-3">Horizont</th>
              <th className="py-2 pr-3 text-right">Skóre</th>
              <th className="py-2 pr-3">Posledná</th>
            </tr>
          </thead>
          <tbody>
            {validated.map((r, idx) => (
              <tr key={r.id} className="border-b border-[var(--border)] hover:bg-[#11151a]">
                <td className="py-2 pr-3 text-[var(--muted)]">{idx + 1}</td>
                <td className="py-2 pr-3">
                  <Link href={`/ideas/${r.id}`} className="text-[var(--accent)] hover:underline">
                    {r.title}
                  </Link>
                </td>
                <td className="py-2 pr-3">{r.smer ?? "—"}</td>
                <td className="py-2 pr-3">{r.horizont ?? "—"}</td>
                <td className="py-2 pr-3 text-right font-mono">
                  {r.latest_score?.toFixed(2)}
                </td>
                <td className="py-2 pr-3 text-xs text-[var(--muted)]">
                  {r.latest_validated_at
                    ? new Date(r.latest_validated_at).toLocaleDateString("sk-SK")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
