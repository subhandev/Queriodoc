-- IVFFlat with lists=100 returns no rows when the table has far fewer vectors than
-- lists (e.g. six chunks per document). Drop it; per-document filters are small enough
-- for exact cosine search until chunk volume justifies HNSW.
drop index if exists chunks_embedding_idx;
