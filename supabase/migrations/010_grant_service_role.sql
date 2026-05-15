-- Server routes use the service role key (createAdminClient). Tables created in
-- migrations do not automatically grant privileges to service_role.
grant select, insert, update, delete on table public.documents to service_role;
grant select, insert, update, delete on table public.chunks to service_role;
grant select, insert, update, delete on table public.messages to service_role;

grant execute on function public.match_chunks(vector, uuid, int, float) to service_role;

-- Client JWT access is gated by RLS policies in 006/009; table grants are still required.
grant select on table public.documents to authenticated;
grant select on table public.messages to authenticated;
grant select on table public.chunks to authenticated;
