alter table documents add column if not exists is_sample boolean not null default false;

create index if not exists documents_user_sample_idx on documents (user_id) where is_sample = true;
