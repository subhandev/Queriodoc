-- =============================================================================
-- WARNING: DESTRUCTIVE — DEVELOPMENT / LOCAL RESET ONLY
-- =============================================================================
-- This removes all Queriodoc application data:
--   - Every object in the `documents` storage bucket
--   - All rows in public.documents, public.chunks, public.messages
--
-- It does NOT drop tables, extensions (e.g. vector), migrations, RLS policies,
-- or the storage bucket definition. It does NOT touch Clerk users.
--
-- Run in Supabase Dashboard → SQL Editor as a privileged role (default postgres
-- bypasses RLS). Do NOT run against production unless you intend to delete data.
-- =============================================================================

begin;

-- Uploaded files: bucket id matches migration 007_storage_bucket.sql
delete from storage.objects
where bucket_id = 'documents';

-- Chunks and messages reference documents with ON DELETE CASCADE; deleting
-- parents clears children in one step.
delete from public.documents;

commit;

-- Optional verification (uncomment):
-- select (select count(*) from public.documents) as documents,
--        (select count(*) from public.chunks) as chunks,
--        (select count(*) from public.messages) as messages,
--        (select count(*) from storage.objects where bucket_id = 'documents') as storage_objects;
