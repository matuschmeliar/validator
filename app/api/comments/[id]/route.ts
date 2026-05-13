import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { requireUserEmail } from "@/lib/auth";
import { errorResponse } from "@/lib/api-error";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const email = await requireUserEmail();
    const db = supabaseAdmin();
    const { data: existing, error: getErr } = await db
      .from("comments")
      .select("author_email")
      .eq("id", params.id)
      .single();
    if (getErr) throw getErr;
    if (existing.author_email !== email) {
      return NextResponse.json({ error: "Only the author can delete this comment" }, { status: 403 });
    }
    const { error } = await db.from("comments").delete().eq("id", params.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
