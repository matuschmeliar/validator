"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
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
    <div
      className="fa-stage"
      style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}
    >
      <div className="fa-stage-top-light" />
      <div className="fa-card" style={{ width: 380, position: "relative", zIndex: 2 }}>
        <div className="fa-card-inner" style={{ padding: "32px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span className="fa-orb" />
            <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", color: "#fff" }}>
              Idea Validator
            </span>
          </div>

          <h1
            style={{
              margin: "0 0 6px",
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            Prihlásenie
          </h1>
          <p style={{ margin: "0 0 24px", color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
            Zadaj zdieľaný prístupový kód a svoj email.
          </p>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Prístupový kód">
              <input
                required
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="fa-input"
                autoFocus
              />
            </Field>
            <Field label="Tvoj email">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="fa-input"
                placeholder="meno@dius.ai"
              />
            </Field>

            {err && <p style={{ color: "#FF8A95", fontSize: 12, margin: 0 }}>{err}</p>}

            <button
              type="submit"
              disabled={busy}
              className="fa-pill primary"
              style={{ justifyContent: "center", marginTop: 6 }}
            >
              {busy ? "Prihlasujem…" : "Prihlásiť"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span
        style={{
          display: "block",
          fontSize: 11,
          color: "rgba(255,255,255,0.5)",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
