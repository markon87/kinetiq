alter table public.activities
add column if not exists deleted_at timestamptz;

create index if not exists activities_user_active_performed_idx
on public.activities(user_id, performed_at desc)
where deleted_at is null;