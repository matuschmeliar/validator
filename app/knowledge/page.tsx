import Link from "next/link";
import { supabaseAdmin, KnowledgeDocument } from "@/lib/db";
import { readSessionEmail } from "@/lib/auth";
import { redirect } from "next/navigation";
import { KnowledgeManager } from "@/components/KnowledgeManager";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const email = await readSessionEmail();
  if (!email) redirect("/login");

  const { data } = await supabaseAdmin()
    .from("knowledge_documents")
    .select("*")
    .order("created_at", { ascending: true });

  const docs = (data ?? []) as KnowledgeDocument[];

  return (
    <div className="fa-stage">
      <div className="fa-stage-top-light" />
      <div
        className="fa-chrome"
        style={{ padding: "32px 40px 40px", minHeight: "calc(100vh - 48px)" }}
      >
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
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
            DIUS knowledge base
          </h1>
          <p style={{ margin: "0 0 28px", color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
            Markdown dokumenty, ktoré Claude prečíta pri každej{" "}
            <strong style={{ color: "#fff" }}>manifest</strong> validácii ako kontext. YC
            validácia ich ignoruje. Aktívne dokumenty idú do system promptu s prompt
            cache-om.
          </p>
          <KnowledgeManager initial={docs} myEmail={email} />
        </div>
      </div>
    </div>
  );
}
