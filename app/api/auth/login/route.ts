import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAccessCode, getAllowedDomain, setSessionCookie } from "@/lib/auth";

const Body = z.object({
  code: z.string().min(1),
  email: z.string().email("Zadaj platný email").max(200),
});

export async function POST(req: NextRequest) {
  let body;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.issues[0]?.message ?? "Neplatný vstup" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Neplatný vstup" }, { status: 400 });
  }

  const expected = getAccessCode();
  if (!safeEqual(body.code, expected)) {
    return NextResponse.json({ error: "Nesprávny prístupový kód" }, { status: 401 });
  }

  const email = body.email.trim().toLowerCase();
  const domain = getAllowedDomain();
  if (domain && !email.endsWith(`@${domain}`)) {
    return NextResponse.json(
      { error: `Email musí byť z domény @${domain}` },
      { status: 403 }
    );
  }

  await setSessionCookie(email);
  return NextResponse.json({ ok: true, email });
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}
