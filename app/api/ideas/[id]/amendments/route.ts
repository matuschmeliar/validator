import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db";
import { requireUserEmail } from "@/lib/auth";
import { errorResponse } from "@/lib/api-error";

const Body = z.object({
  body_md: z.string().min(3).max(10000),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireUserEmail();
    const { data, error } = await supabaseAdmin()
      .from("idea_amendments")
      .select("*")
      .eq("idea_id", params.id)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ amendments: data ?? [] });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const email = await requireUserEmail();
    const { body_md } = Body.parse(await req.json());

    const { data, error } = await supabaseAdmin()
      .from("idea_amendments")
      .insert({ idea_id: params.id, author_email: email, body_md })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ amendment: data }, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}
