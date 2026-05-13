"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ValidateButton({ ideaId }: { ideaId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function run(deep = false) {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/validate/${ideaId}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deep }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Validation failed");
      }
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Validation failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {err && <span className="text-xs text-red-400">{err}</span>}
      <button
        onClick={() => run(false)}
        disabled={busy}
        className="text-sm border border-[var(--accent)] text-[var(--accent)] rounded px-3 py-1.5 hover:bg-[#0e201a] disabled:opacity-50"
      >
        {busy ? "Validujem…" : "Validovať (Sonnet)"}
      </button>
      <button
        onClick={() => run(true)}
        disabled={busy}
        className="text-xs text-[var(--muted)] hover:text-white disabled:opacity-50"
        title="Hlbšia validácia s Claude Opus"
      >
        Deep
      </button>
    </div>
  );
}
