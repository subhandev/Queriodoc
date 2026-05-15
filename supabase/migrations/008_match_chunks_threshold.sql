create or replace function match_chunks(
  query_embedding vector(1536),
  match_document_id uuid,
  match_count int default 5,
  match_threshold float default 0.5
)
returns table (
  content text,
  chunk_index int,
  similarity float
)
language sql stable
as $$
  select
    content,
    chunk_index,
    1 - (embedding <=> query_embedding) as similarity
  from chunks
  where document_id = match_document_id
    and (1 - (embedding <=> query_embedding)) >= match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
