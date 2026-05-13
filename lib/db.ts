import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { MaslowLevel } from "./rubric";

// Lazy init — env vars may be absent at build-time; only required at runtime.
let _publicClient: SupabaseClient | null = null;
let _adminClient: SupabaseClient | null = null;

export function supabasePublic(): SupabaseClient {
  if (_publicClient) return _publicClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  _publicClient = createClient(url, anonKey, { auth: { persistSession: false } });
  return _publicClient;
}

// Admin client — server-side only. Bypasses RLS. Never import in client components.
export function supabaseAdmin(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("supabaseAdmin() must not be called from the browser");
  }
  if (_adminClient) return _adminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  }
  _adminClient = createClient(url, serviceKey, { auth: { persistSession: false } });
  return _adminClient;
}

export type Idea = {
  id: string;
  title: string;
  smer: "A" | "B" | "C" | null;
  horizont: string | null;
  tags: string[];
  body_md: string;
  author_email: string;
  maslow_level: MaslowLevel | null;
  created_at: string;
  updated_at: string;
};

export type Scores = {
  alignment: number;
  tech: number;
  ethics: number;
  economy: number;
  deps: number;
  moat: number;
};

export type ValidationReport = {
  id: string;
  idea_id: string;
  scores: Scores;
  weighted_score: number;
  summary_md: string;
  next_step: string | null;
  maslow_level: MaslowLevel | null;
  maslow_note: string | null;
  model: string;
  created_by_email: string;
  created_at: string;
};

export type IdeaWithLatest = Idea & {
  latest_score: number | null;
  latest_scores: Scores | null;
  latest_summary_md: string | null;
  latest_next_step: string | null;
  latest_maslow_level: MaslowLevel | null;
  latest_maslow_note: string | null;
  latest_validated_at: string | null;
  avg_stars: number | null;
  ratings_count: number;
  comments_count: number;
};
