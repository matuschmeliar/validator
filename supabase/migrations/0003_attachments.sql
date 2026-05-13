-- Idea attachments — files uploaded by users alongside ideas.
-- File bytes live in Supabase Storage; this table holds metadata only.

create table if not exists idea_attachments (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references ideas(id) on delete cascade,
  filename text not null,
  mime text not null,
  size_bytes bigint not null,
  storage_path text not null unique,
  uploaded_by_email text not null,
  created_at timestamptz not null default now()
);

create index if not exists idea_attachments_idea_idx
  on idea_attachments (idea_id, created_at desc);
