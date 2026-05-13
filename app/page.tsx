import Link from "next/link";
import { supabaseAdmin, IdeaWithLatest } from "@/lib/db";
import { IdeaCard } from "@/components/IdeaCard";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { smer?: string; sort?: string };
}) {
  const smer = searchParams.smer;
  const sort = searchParams.sort ?? "created";

  let q = supabaseAdmin().from("ideas_with_latest_report").select("*");
  if (smer && ["A", "B", "C"].includes(smer)) q = q.eq("smer", smer);

  if (sort === "score") {
    q = q.order("latest_score", { ascending: false, nullsFirst: false });
  } else if (sort === "stars") {
    q = q.order("avg_stars", { ascending: false, nullsFirst: false });
  } else {
    q = q.order("created_at", { ascending: false });
  }

  const { data, error } = await q;
  const ideas = (data ?? []) as IdeaWithLatest[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Idey</h1>
        <Link
          href="/ideas/new"
          className="text-sm border border-[var(--accent)] text-[var(--accent)] rounded px-3 py-1.5 hover:bg-[#0e201a]"
        >
          + Pridať ideu
        </Link>
      </div>

      <div className="flex gap-4 mb-6 text-sm text-[var(--muted)]">
        <FilterLink current={smer} value={undefined} param="smer" sort={sort}>Všetky smery</FilterLink>
        <FilterLink current={smer} value="A" param="smer" sort={sort}>Smer A</FilterLink>
        <FilterLink current={smer} value="B" param="smer" sort={sort}>Smer B</FilterLink>
        <FilterLink current={smer} value="C" param="smer" sort={sort}>Smer C</FilterLink>
        <span className="ml-auto">Zoradiť:</span>
        <FilterLink current={sort} value="created" param="sort" smer={smer}>Najnovšie</FilterLink>
        <FilterLink current={sort} value="score" param="sort" smer={smer}>Skóre</FilterLink>
        <FilterLink current={sort} value="stars" param="sort" smer={smer}>Hviezdičky</FilterLink>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">DB error: {error.message}</p>}

      {ideas.length === 0 ? (
        <p className="text-[var(--muted)]">Žiadne idey. <Link href="/ideas/new" className="text-[var(--accent)] underline">Pridaj prvú →</Link></p>
      ) : (
        <ul className="space-y-3">
          {ideas.map((i) => (
            <IdeaCard key={i.id} idea={i} />
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterLink({
  current,
  value,
  param,
  smer,
  sort,
  children,
}: {
  current: string | undefined;
  value: string | undefined;
  param: "smer" | "sort";
  smer?: string;
  sort?: string;
  children: React.ReactNode;
}) {
  const params = new URLSearchParams();
  if (param === "smer") {
    if (value) params.set("smer", value);
    if (sort && sort !== "created") params.set("sort", sort);
  } else {
    if (smer) params.set("smer", smer);
    if (value) params.set("sort", value);
  }
  const href = "/?" + params.toString();
  const isActive = current === value;
  return (
    <Link
      href={href}
      className={isActive ? "text-white font-medium" : "hover:text-white"}
    >
      {children}
    </Link>
  );
}
