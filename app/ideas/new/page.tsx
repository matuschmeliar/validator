"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MaslowLevel } from "@/lib/rubric";
import { MaslowPicker } from "@/components/MaslowPicker";

const MAX_MB = 25;
const ALLOWED_EXT = ".pdf,.docx,.xlsx,.png,.jpg,.jpeg";

export default function NewIdeaPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [smer, setSmer] = useState<"A" | "B" | "C" | "">("");
  const [horizont, setHorizont] = useState("");
  const [tags, setTags] = useState("");
  const [bodyMd, setBodyMd] = useState("");
  const [maslowLevel, setMaslowLevel] = useState<MaslowLevel | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  function addFiles(picked: FileList | null) {
    if (!picked) return;
    const next: File[] = [];
    for (const f of Array.from(picked)) {
      if (f.size > MAX_MB * 1024 * 1024) {
        setErr(`"${f.name}" je väčší než ${MAX_MB} MB`);
        continue;
      }
      next.push(f);
    }
    setFiles((prev) => [...prev, ...next].slice(0, 10));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          smer: smer || null,
          horizont: horizont || null,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          body_md: bodyMd,
          maslow_level: maslowLevel,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Nepodarilo sa uložiť");
      }
      const { idea } = await res.json();

      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        setUploadStatus(`Nahrávam (${i + 1}/${files.length}) ${f.name}…`);
        const fd = new FormData();
        fd.append("file", f);
        const up = await fetch(`/api/ideas/${idea.id}/attachments`, {
          method: "POST",
          body: fd,
        });
        if (!up.ok) {
          const j = await up.json().catch(() => ({}));
          throw new Error(`Upload "${f.name}" zlyhal: ${j.error ?? up.status}`);
        }
      }

      router.push(`/ideas/${idea.id}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Nepodarilo sa uložiť");
    } finally {
      setBusy(false);
      setUploadStatus(null);
    }
  }

  return (
    <div className="fa-stage">
      <div className="fa-stage-top-light" />
      <div className="fa-chrome" style={{ padding: "32px 40px 40px", minHeight: "calc(100vh - 48px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Link
            href="/"
            style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}
          >
            ← Späť na dashboard
          </Link>
          <h1
            style={{
              margin: "12px 0 6px",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            Pridať ideu
          </h1>
          <p style={{ margin: "0 0 28px", color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            Zapíš víziu, ktorú chceš dať Claude na validáciu proti 6-osému rubricu.
          </p>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Názov *">
              <input
                required
                minLength={3}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="fa-input"
                placeholder="napr. Memory Mesh"
              />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Smer">
                <select
                  value={smer}
                  onChange={(e) => setSmer(e.target.value as "A" | "B" | "C" | "")}
                  className="fa-input"
                >
                  <option value="">—</option>
                  <option value="A">A — Využitie dát</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </Field>
              <Field label="Horizont">
                <input
                  value={horizont}
                  onChange={(e) => setHorizont(e.target.value)}
                  className="fa-input"
                  placeholder="napr. 2026, 2-5 rokov, sci-fi"
                />
              </Field>
            </div>

            <Field label="Tagy (čiarkami oddelené)">
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="fa-input"
                placeholder="LLM, on-device, families"
              />
            </Field>

            <Field label="Maslowova úroveň (akú potrebu idea adresuje)">
              <MaslowPicker value={maslowLevel} onChange={setMaslowLevel} />
            </Field>

            <Field label="Telo idey (markdown) *">
              <textarea
                required
                minLength={10}
                value={bodyMd}
                onChange={(e) => setBodyMd(e.target.value)}
                className="fa-input"
                style={{ minHeight: 320, fontFamily: "ui-monospace, monospace", fontSize: 13 }}
                placeholder="Popíš ideu, kontext, prepojenia na iné nápady, čo je potrebné aby existovala…"
              />
            </Field>

            <Field label="Prílohy (PDF, Word, Excel, obrázky)">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {files.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                    {files.map((f, i) => (
                      <li
                        key={`${f.name}-${i}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                          padding: "6px 12px",
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: 8,
                          fontSize: 13,
                          color: "rgba(255,255,255,0.85)",
                        }}
                      >
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {f.name} <span style={{ color: "rgba(255,255,255,0.4)", marginLeft: 6 }}>{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                          disabled={busy}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#FF8A95",
                            fontSize: 11,
                            cursor: "pointer",
                          }}
                        >
                          Odstrániť
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    border: "1px dashed rgba(255,255,255,0.15)",
                    borderRadius: 8,
                    cursor: busy ? "not-allowed" : "pointer",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.7)",
                    width: "fit-content",
                  }}
                >
                  + Pridať súbor
                  <input
                    type="file"
                    multiple
                    accept={ALLOWED_EXT}
                    disabled={busy}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      addFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                  Max {MAX_MB} MB / súbor, max 10 / ideu. Claude ich pri validácii prečíta.
                </div>
              </div>
            </Field>

            {err && <p style={{ color: "#FF8A95", fontSize: 13, margin: 0 }}>{err}</p>}
            {uploadStatus && (
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: 0 }}>{uploadStatus}</p>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" disabled={busy} className="fa-pill primary">
                {busy ? "Ukladám…" : "Uložiť ideu"}
              </button>
              <Link href="/" className="fa-pill">
                Zrušiť
              </Link>
            </div>
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
