-- DIUS knowledge base — markdown documents injected into the manifest
-- validator's system prompt with prompt caching. Active docs only.

create table if not exists knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content_md text not null,
  active boolean not null default true,
  uploaded_by_email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists knowledge_active_idx
  on knowledge_documents (active, created_at asc);

-- Reuse the updated_at trigger from 0001_init.sql
create trigger knowledge_updated_at before update on knowledge_documents
  for each row execute procedure set_updated_at();
