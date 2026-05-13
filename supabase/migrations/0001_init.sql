-- Idea Validator — initial schema

create extension if not exists "pgcrypto";

-- ============ IDEAS ============
create table ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  smer text check (smer in ('A','B','C')),
  horizont text,
  tags text[] default '{}',
  body_md text not null,
  author_email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ideas_smer_created_idx on ideas (smer, created_at desc);
create index ideas_author_idx on ideas (author_email);

-- ============ VALIDATION REPORTS (history) ============
create table validation_reports (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references ideas(id) on delete cascade,
  scores jsonb not null,           -- {alignment, tech, ethics, economy, deps, moat}
  weighted_score numeric(3,2) not null,
  summary_md text not null,
  next_step text,
  model text not null,
  created_by_email text not null,
  created_at timestamptz not null default now()
);

create index reports_idea_idx on validation_reports (idea_id, created_at desc);
create index reports_score_idx on validation_reports (weighted_score desc);

-- ============ HUMAN RATINGS ============
create table ratings (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references ideas(id) on delete cascade,
  author_email text not null,
  stars smallint not null check (stars between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (idea_id, author_email)
);

create index ratings_idea_idx on ratings (idea_id);

-- ============ COMMENTS ============
create table comments (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references ideas(id) on delete cascade,
  author_email text not null,
  body_md text not null,
  created_at timestamptz not null default now()
);

create index comments_idea_created_idx on comments (idea_id, created_at asc);

-- ============ updated_at trigger ============
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end
$$ language plpgsql;

create trigger ideas_updated_at before update on ideas
  for each row execute procedure set_updated_at();

create trigger ratings_updated_at before update on ratings
  for each row execute procedure set_updated_at();

-- ============ Views for convenience ============
create or replace view ideas_with_latest_report as
select
  i.*,
  r.weighted_score as latest_score,
  r.scores         as latest_scores,
  r.summary_md     as latest_summary_md,
  r.next_step      as latest_next_step,
  r.created_at     as latest_validated_at,
  (select avg(stars)::numeric(3,2) from ratings where idea_id = i.id) as avg_stars,
  (select count(*) from ratings where idea_id = i.id) as ratings_count,
  (select count(*) from comments where idea_id = i.id) as comments_count
from ideas i
left join lateral (
  select * from validation_reports
  where idea_id = i.id
  order by created_at desc
  limit 1
) r on true;
