create table chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  content text not null,
  chunk_index integer not null,
  embedding vector(1536)
);

create index on chunks(document_id);
create index on chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);
