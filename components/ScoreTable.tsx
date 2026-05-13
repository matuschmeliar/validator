import { AXIS_LABELS_SK, RUBRIC_WEIGHTS, AxisKey } from "@/lib/rubric";
import type { Scores } from "@/lib/db";

export function ScoreTable({ scores }: { scores: Scores | Record<string, number> }) {
  const order: AxisKey[] = ["alignment", "tech", "ethics", "economy", "deps", "moat"];
  return (
    <table className="w-full text-sm border border-[var(--border)] rounded">
      <thead>
        <tr className="text-left text-xs uppercase text-[var(--muted)] border-b border-[var(--border)]">
          <th className="py-2 px-3">Os</th>
          <th className="py-2 px-3 text-right">Skóre</th>
          <th className="py-2 px-3 text-right">Váha</th>
        </tr>
      </thead>
      <tbody>
        {order.map((k) => (
          <tr key={k} className="border-b border-[var(--border)] last:border-0">
            <td className="py-1.5 px-3">{AXIS_LABELS_SK[k]}</td>
            <td className="py-1.5 px-3 text-right font-mono">
              <Bar value={(scores as Record<string, number>)[k]} />
            </td>
            <td className="py-1.5 px-3 text-right text-[var(--muted)]">
              {(RUBRIC_WEIGHTS[k] * 100).toFixed(0)} %
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
    <div className="inline-flex items-center gap-2 justify-end">
      <span>{value}/5</span>
      <span className="inline-block w-16 h-1.5 bg-[#1f242b] rounded-full overflow-hidden">
        <span
          className="block h-full bg-[var(--accent)]"
          style={{ width: `${pct}%` }}
        />
      </span>
    </div>
  );
}
