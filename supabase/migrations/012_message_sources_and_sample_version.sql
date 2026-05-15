-- Persist RAG citation chunks on assistant rows; track demo doc index version.
-- Applies after 011_sample_documents.sql (avoids duplicate 011_ migration names).

alter table messages
  add column if not exists sources jsonb;

alter table documents
  add column if not exists sample_content_version integer;
