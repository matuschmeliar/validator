"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const [code, setCode] = useState("");
  const [email, setEmail] = useState(
    typeof window !== "undefined" ? localStorage.getItem("idea_validator_email") ?? "" : ""
  );
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code, email }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "Prihlásenie zlyhalo");
      localStorage.setItem("idea_validator_email", email);
      router.replace(next);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Prihlásenie zlyhalo");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-24">
      <h1 className="text-2xl font-semibold mb-2">Idea Validator</h1>
      <p className="text-[var(--muted)] text-sm mb-8">
        Zadaj zdieľaný prístupový kód a svoj email.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <Field label="Prístupový kód">
          <input
            required
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={inputCls}
            autoFocus
          />
        </Field>
        <Field label="Tvoj email">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            placeholder="meno@dius.ai"
          />
        </Field>

        {err && <p className="text-red-400 text-sm">{err}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-[var(--accent)] text-black font-medium rounded px-4 py-2 disabled:opacity-50"
        >
          {busy ? "Prihlasujem…" : "Prihlásiť"}
        </button>
      </form>
    </div>
  );
}

const inputCls =
  "w-full bg-[#11151a] border border-[var(--border)] rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-[var(--muted)] mb-1">{label}</span>
      {children}
    </label>
  );
}
