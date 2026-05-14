alter table documents enable row level security;
alter table messages enable row level security;

-- Clerk JWT (Supabase template): subject is Clerk user id; role is authenticated
create policy "documents_select_own"
  on documents for select
  to authenticated
  using ((auth.jwt()->>'sub') = user_id);

create policy "messages_select_own"
  on messages for select
  to authenticated
  using ((auth.jwt()->>'sub') = user_id);
