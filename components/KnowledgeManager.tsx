"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KnowledgeDocument } from "@/lib/db";

type Pending = KnowledgeDocument & { _pending?: boolean };

export function KnowledgeManager({
  initial,
  myEmail,
}: {
  initial: KnowledgeDocument[];
  myEmail: string;
}) {
  const router = useRouter();
  const [docs, setDocs] = useState<Pending[]>(initial);
  const [open, setOpen] = useState<KnowledgeDocument | "new" | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function save(payload: { id?: string; title: string; content_md: string; active: boolean }) {
    setErr(null);
    try {
      const url = payload.id ? `/api/knowledge/${payload.id}` : "/api/knowledge";
      const method = payload.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: payload.title,
          content_md: payload.content_md,
          active: payload.active,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Uloženie zlyhalo");
      }
      const { document } = await res.json();
      setDocs((prev) =>
        payload.id ? prev.map((d) => (d.id === document.id ? document : d)) : [...prev, document]
      );
      setOpen(null);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Uloženie zlyhalo");
    }
  }

  async function toggleActive(d: KnowledgeDocument) {
    const optimistic = { ...d, active: !d.active };
    setDocs((prev) => prev.map((x) => (x.id === d.id ? optimistic : x)));
    try {
      const res = await fetch(`/api/knowledge/${d.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ active: !d.active }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setDocs((prev) => prev.map((x) => (x.id === d.id ? d : x)));
    }
  }

  async function remove(id: string) {
    if (!confirm("Zmazať tento dokument?")) return;
    const prev = docs;
    setDocs(docs.filter((d) => d.id !== id));
    try {
      const res = await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setDocs(prev);
    }
  }

  const activeCount = docs.filter((d) => d.active).length;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
          {docs.length} {docs.length === 1 ? "dokument" : docs.length < 5 ? "dokumenty" : "dokumentov"} ·{" "}
          <span style={{ color: "#6EE7A6" }}>{activeCount} aktívnych</span>
        </div>
        <button onClick={() => setOpen("new")} className="fa-pill primary">
          + Pridať dokument
        </button>
      </div>

      {docs.length === 0 ? (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            border: "1px dashed rgba(255,255,255,0.1)",
            borderRadius: 12,
            color: "rgba(255,255,255,0.45)",
            fontSize: 13,
          }}
        >
          Žiadne dokumenty. Pridaj prvý cez tlačidlo vyššie alebo dropni .md súbor do modalu.
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {docs.map((d) => (
            <li
              key={d.id}
              style={{
                padding: "14px 16px",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                opacity: d.active ? 1 : 0.55,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{d.title}</span>
                  {d.active ? (
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 7px",
                        borderRadius: 999,
                        background: "rgba(110,231,166,0.12)",
                        border: "1px solid rgba(110,231,166,0.35)",
                        color: "#6EE7A6",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                      }}
                    >
                      ACTIVE
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 7px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.5)",
                        fontWeight: 500,
                        letterSpacing: "0.06em",
                      }}
                    >
                      INACTIVE
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => toggleActive(d)}
                    className="fa-pill"
                    style={{ fontSize: 11, padding: "4px 10px" }}
                  >
                    {d.active ? "Vypnúť" : "Zapnúť"}
                  </button>
                  <button
                    onClick={() => setOpen(d)}
                    className="fa-pill"
                    style={{ fontSize: 11, padding: "4px 10px" }}
                  >
                    Upraviť
                  </button>
                  <button
                    onClick={() => remove(d.id)}
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
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 8,
                  display: "flex",
                  gap: 12,
                }}
              >
                <span>{d.content_md.length.toLocaleString("sk-SK")} znakov</span>
                <span>
                  ~{Math.ceil(d.content_md.length / 4).toLocaleString("sk-SK")} tokenov
                </span>
                <span>
                  {d.uploaded_by_email.split("@")[0]} ·{" "}
                  {new Date(d.created_at).toLocaleDateString("sk-SK")}
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.55)",
                  fontFamily: "ui-monospace, monospace",
                  background: "rgba(0,0,0,0.2)",
                  padding: "8px 10px",
                  borderRadius: 6,
                  whiteSpace: "pre-wrap",
                  overflow: "hidden",
                  maxHeight: 80,
                  position: "relative",
                }}
              >
                {d.content_md.slice(0, 280)}
                {d.content_md.length > 280 && "…"}
              </div>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <DocEditor
          initial={open === "new" ? null : open}
          onClose={() => setOpen(null)}
          onSave={save}
          error={err}
          myEmail={myEmail}
        />
      )}
    </div>
  );
}

function DocEditor({
  initial,
  onClose,
  onSave,
  error,
}: {
  initial: KnowledgeDocument | null;
  onClose: () => void;
  onSave: (p: { id?: string; title: string; content_md: string; active: boolean }) => Promise<void>;
  error: string | null;
  myEmail: string;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content_md ?? "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [saving, setSaving] = useState(false);

  function loadFile(file: File) {
    if (!file.name.toLowerCase().endsWith(".md") && !file.type.startsWith("text/")) {
      alert("Podporujeme len .md / text súbory.");
      return;
    }
    file.text().then((text) => {
      setContent(text);
      if (!title) setTitle(file.name.replace(/\.md$/i, ""));
    });
  }

  async function submit() {
    setSaving(true);
    await onSave({
      id: initial?.id,
      title: title.trim(),
      content_md: content,
      active,
    });
    setSaving(false);
  }

  return (
    <div
      onClick={() => !saving && onClose()}
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
          maxWidth: 820,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
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
          {initial ? "Upraviť dokument" : "Nový dokument"}
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
          DIUS knowledge document
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Názov dokumentu"
          className="fa-input"
          style={{ marginBottom: 10, fontSize: 14, fontWeight: 500 }}
        />

        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            border: "1px dashed rgba(255,255,255,0.15)",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 12,
            color: "rgba(255,255,255,0.7)",
            width: "fit-content",
            marginBottom: 10,
          }}
        >
          📎 Nahrať .md súbor
          <input
            type="file"
            accept=".md,text/markdown,text/plain"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) loadFile(f);
              e.target.value = "";
            }}
          />
        </label>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Markdown obsah… alebo nahraj .md súbor vyššie."
          className="fa-input"
          style={{
            flex: 1,
            minHeight: 280,
            fontFamily: "ui-monospace, monospace",
            fontSize: 12,
            resize: "vertical",
          }}
        />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "rgba(255,255,255,0.8)",
            marginTop: 12,
          }}
        >
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Aktívny — pripoj do manifest validácií
        </label>

        {error && (
          <p style={{ color: "#FF8A95", fontSize: 12, margin: "10px 0 0" }}>{error}</p>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 16,
          }}
        >
          <button onClick={onClose} disabled={saving} className="fa-pill">
            Zrušiť
          </button>
          <button
            onClick={submit}
            disabled={saving || !title.trim() || content.trim().length < 2}
            className="fa-pill primary"
          >
            {saving ? "Ukladám…" : initial ? "Uložiť zmeny" : "Vytvoriť"}
          </button>
        </div>
      </div>
    </div>
  );
}
