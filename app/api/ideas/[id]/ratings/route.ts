import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db";
import { requireUserEmail } from "@/lib/auth";
import { errorResponse } from "@/lib/api-error";

const Body = z.object({
  stars: z.number().int().min(1).max(5),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const email = await requireUserEmail();
    const { stars } = Body.parse(await req.json());

    const { data, error } = await supabaseAdmin()
      .from("ratings")
      .upsert(
        { idea_id: params.id, author_email: email, stars },
        { onConflict: "idea_id,author_email" }
      )
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ rating: data });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const email = await requireUserEmail();
    const { error } = await supabaseAdmin()
      .from("ratings")
      .delete()
      .eq("idea_id", params.id)
      .eq("author_email", email);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
