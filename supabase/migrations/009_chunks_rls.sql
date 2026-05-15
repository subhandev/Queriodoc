-- Chunks are read only via match_chunks RPC from server routes (service role).
-- RLS blocks direct client access; API enforces document ownership before RPC.
alter table chunks enable row level security;

create policy "chunks_select_via_own_document"
  on chunks for select
  to authenticated
  using (
    exists (
      select 1
      from documents d
      where d.id = chunks.document_id
        and d.user_id = (auth.jwt()->>'sub')
    )
  );
