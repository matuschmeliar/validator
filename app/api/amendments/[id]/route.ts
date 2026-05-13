import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { requireUserEmail } from "@/lib/auth";
import { errorResponse } from "@/lib/api-error";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const email = await requireUserEmail();
    const db = supabaseAdmin();

    const { data: am, error: getErr } = await db
      .from("idea_amendments")
      .select("id, author_email, ideas:idea_id(author_email)")
      .eq("id", params.id)
      .single();
    if (getErr) throw getErr;

    const ideaAuthor = (am as any).ideas?.author_email as string | undefined;
    if (am.author_email !== email && ideaAuthor !== email) {
      return NextResponse.json(
        { error: "Len autor doplnenia alebo idey môže zmazať" },
        { status: 403 }
      );
    }

    const { error: delErr } = await db
      .from("idea_amendments")
      .delete()
      .eq("id", params.id);
    if (delErr) throw delErr;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
