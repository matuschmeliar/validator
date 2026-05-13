-- Idea amendments — chronological updates to an idea after the original
-- post. Body stays immutable; amendments capture "what we learned later".
-- Claude reads body + all amendments at validation time.

create table if not exists idea_amendments (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references ideas(id) on delete cascade,
  body_md text not null,
  author_email text not null,
  created_at timestamptz not null default now()
);

create index if not exists idea_amendments_idea_idx
  on idea_amendments (idea_id, created_at asc);
