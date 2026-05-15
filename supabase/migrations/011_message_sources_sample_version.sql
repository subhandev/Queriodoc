alter table messages
  add column if not exists sources jsonb;

alter table documents
  add column if not exists sample_content_version integer;
