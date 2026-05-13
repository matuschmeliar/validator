import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError } from "./auth";

export function errorResponse(e: unknown) {
  if (e instanceof AuthError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (e instanceof z.ZodError) {
    return NextResponse.json({ error: "Invalid input", issues: e.issues }, { status: 400 });
  }
  console.error(e);
  const msg = e instanceof Error ? e.message : "Unknown error";
  return NextResponse.json({ error: msg }, { status: 500 });
}
