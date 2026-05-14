create table documents (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  file_path text not null,
  file_type text not null check (file_type in ('pdf', 'docx', 'txt')),
  status text not null default 'processing' check (status in ('processing', 'ready', 'error')),
  chunk_count integer default 0,
  created_at timestamptz default now()
);

create index on documents(user_id);
