"use client";

import { useState } from "react";

export function RatingStars({
  ideaId,
  initial,
}: {
  ideaId: string;
  initial: number | null;
}) {
  const [stars, setStars] = useState<number | null>(initial);
  const [hover, setHover] = useState<number | null>(null);
  const [pending, setPending] = useState(false);

  async function setRating(n: number) {
    const prev = stars;
    setStars(n);
    setPending(true);
    try {
      const res = await fetch(`/api/ideas/${ideaId}/ratings`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ stars: n }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setStars(prev);
    } finally {
      setPending(false);
    }
  }

  async function clearRating() {
    const prev = stars;
    setStars(null);
    setPending(true);
    try {
      const res = await fetch(`/api/ideas/${ideaId}/ratings`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setStars(prev);
    } finally {
      setPending(false);
    }
  }

  const display = hover ?? stars ?? 0;

  return (
    <div
      className="flex items-center gap-1"
      style={{ opacity: pending ? 0.7 : 1, transition: "opacity 120ms" }}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => setRating(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(null)}
          className={`text-xl leading-none ${
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
          className="text-xs text-[var(--muted)] ml-2 hover:text-white"
        >
          zrušiť
        </button>
      )}
    </div>
  );
}
