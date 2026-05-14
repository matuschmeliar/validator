import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db";
import { requireUserEmail } from "@/lib/auth";
import { errorResponse } from "@/lib/api-error";

const Create = z.object({
  title: z.string().min(2).max(200),
  content_md: z.string().min(2).max(200_000),
  active: z.boolean().default(true),
});

export async function GET() {
  try {
    await requireUserEmail();
    const { data, error } = await supabaseAdmin()
      .from("knowledge_documents")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ documents: data ?? [] });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const email = await requireUserEmail();
    const body = Create.parse(await req.json());
    const { data, error } = await supabaseAdmin()
      .from("knowledge_documents")
      .insert({
        title: body.title,
        content_md: body.content_md,
        active: body.active,
        uploaded_by_email: email,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ document: data }, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}
