"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RatingStars({
  ideaId,
  initial,
}: {
  ideaId: string;
  initial: number | null;
}) {
  const router = useRouter();
  const [stars, setStars] = useState<number | null>(initial);
  const [hover, setHover] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  async function setRating(n: number) {
    setBusy(true);
    const prev = stars;
    setStars(n);
    try {
      const res = await fetch(`/api/ideas/${ideaId}/ratings`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ stars: n }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setStars(prev);
    } finally {
      setBusy(false);
    }
  }

  async function clearRating() {
    setBusy(true);
    const prev = stars;
    setStars(null);
    try {
      const res = await fetch(`/api/ideas/${ideaId}/ratings`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setStars(prev);
    } finally {
      setBusy(false);
    }
  }

  const display = hover ?? stars ?? 0;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          disabled={busy}
          onClick={() => setRating(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(null)}
          className={`text-xl leading-none disabled:opacity-50 ${
            n <= display ? "text-[var(--accent)]" : "text-[var(--muted)]"
          }`}
          aria-label={`${n} hviezdičiek`}
        >
          ★
        </button>
      ))}
      {stars !== null && (
        <button
          onClick={clearRating}
          disabled={busy}
          className="text-xs text-[var(--muted)] ml-2 hover:text-white"
        >
          zrušiť
        </button>
      )}
    </div>
  );
}
