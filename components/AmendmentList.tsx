"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IdeaAmendment } from "@/lib/db";
import { MarkdownView } from "@/components/MarkdownView";

export function AmendmentList({
  ideaId,
  initial,
  myEmail,
  ideaAuthorEmail,
}: {
  ideaId: string;
  initial: IdeaAmendment[];
  myEmail: string;
  ideaAuthorEmail: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState<IdeaAmendment[]>(initial);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [revalidating, setRevalidating] = useState(false);
  const [justSavedId, setJustSavedId] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    if (text.trim().length < 3) {
      setErr("Doplnenie musí mať aspoň 3 znaky.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/ideas/${ideaId}/amendments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body_md: text }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Nepodarilo sa uložiť");
      }
      const { amendment } = await res.json();
      setItems((prev) => [...prev, amendment]);
      setJustSavedId(amendment.id);
      setText("");
      setOpen(false);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Nepodarilo sa uložiť");
    } finally {
      setBusy(false);
    }
  }

  async function revalidate() {
    setRevalidating(true);
    try {
      const res = await fetch(`/api/validate/${ideaId}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Validation failed");
      }
      setJustSavedId(null);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Validation failed");
    } finally {
      setRevalidating(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Zmazať toto doplnenie?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/amendments/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Nepodarilo sa zmazať");
      }
      setItems((prev) => prev.filter((a) => a.id !== id));
      if (justSavedId === id) setJustSavedId(null);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Nepodarilo sa zmazať");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.length === 0 ? (
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          Žiadne doplnenia.
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((a) => {
            const canDelete = a.author_email === myEmail || ideaAuthorEmail === myEmail;
            return (
              <li
                key={a.id}
                style={{
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.45)",
                    marginBottom: 8,
                    gap: 8,
                  }}
                >
                  <span>
                    {a.author_email.split("@")[0]} ·{" "}
                    {new Date(a.created_at).toLocaleString("sk-SK", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => remove(a.id)}
                      disabled={busy || revalidating}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#FF8A95",
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      Zmazať
                    </button>
                  )}
                </div>
                <div className="prose-sk" style={{ fontSize: 13 }}>
                  <MarkdownView source={a.body_md} />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {justSavedId && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "10px 14px",
            background: "rgba(110,231,166,0.06)",
            border: "1px solid rgba(110,231,166,0.25)",
            borderRadius: 10,
          }}
        >
          <span style={{ fontSize: 12, color: "#6EE7A6" }}>
            Doplnenie uložené. Spustiť Claude revalidáciu s novým kontextom?
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              onClick={revalidate}
              disabled={revalidating}
              className="fa-pill primary"
              style={{ fontSize: 12, padding: "5px 11px" }}
            >
              {revalidating ? "Validujem…" : "Revalidovať"}
            </button>
            <button
              type="button"
              onClick={() => setJustSavedId(null)}
              disabled={revalidating}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              Neskôr
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fa-pill"
        style={{ width: "fit-content", fontSize: 13 }}
      >
        + Doplniť a revalidovať
      </button>

      {err && !open && <p style={{ color: "#FF8A95", fontSize: 12, margin: 0 }}>{err}</p>}

      {open && (
        <div
          onClick={() => !busy && setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 640,
              background: "linear-gradient(180deg, #14141A 0%, #0A0A0C 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: 22,
              boxShadow: "0 24px 60px -10px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.45)",
                marginBottom: 6,
              }}
            >
              Doplnenie k idey
            </div>
            <h2
              style={{
                margin: "0 0 14px",
                fontSize: 20,
                fontWeight: 600,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              Čo si sa o idey dozvedel?
            </h2>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
              Doplnenie sa pridá k chronologickému threadu. Pri ďalšej validácii Claude prečíta telo + všetky doplnenia ako aktuálny kontext.
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
              className="fa-input"
              style={{
                minHeight: 180,
                fontFamily: "ui-monospace, monospace",
                fontSize: 13,
                width: "100%",
                resize: "vertical",
              }}
              placeholder="napr. Po rozhovore s Janom sme si uvedomili, že target user je v skutočnosti…"
            />
            {err && (
              <p style={{ color: "#FF8A95", fontSize: 12, margin: "10px 0 0" }}>{err}</p>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 16,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setText("");
                  setErr(null);
                  setOpen(false);
                }}
                disabled={busy}
                className="fa-pill"
              >
                Zrušiť
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={busy}
                className="fa-pill primary"
              >
                {busy ? "Ukladám…" : "Uložiť doplnenie"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
