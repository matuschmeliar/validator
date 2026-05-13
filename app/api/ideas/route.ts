import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/db";
import { requireUserEmail } from "@/lib/auth";
import { errorResponse } from "@/lib/api-error";

const CreateIdea = z.object({
  title: z.string().min(3).max(200),
  horizont: z.string().max(50).nullable(),
  tags: z.array(z.string()).max(20).default([]),
  body_md: z.string().min(10).max(50000),
  maslow_level: z.number().int().min(1).max(5).nullable().default(null),
});

export async function GET(req: NextRequest) {
  try {
    await requireUserEmail();
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort") ?? "created"; // created | score | stars

    let q = supabaseAdmin().from("ideas_with_latest_report").select("*");

    if (sort === "score") {
      q = q.order("latest_score", { ascending: false, nullsFirst: false });
    } else if (sort === "stars") {
      q = q.order("avg_stars", { ascending: false, nullsFirst: false });
    } else {
      q = q.order("created_at", { ascending: false });
    }

    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json({ ideas: data });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const email = await requireUserEmail();
    const body = CreateIdea.parse(await req.json());

    const { data, error } = await supabaseAdmin()
      .from("ideas")
      .insert({
        title: body.title,
        horizont: body.horizont,
        tags: body.tags,
        body_md: body.body_md,
        maslow_level: body.maslow_level,
        author_email: email,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ idea: data }, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}

