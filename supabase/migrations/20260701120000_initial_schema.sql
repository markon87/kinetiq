create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('Easy Run', 'Tempo Run', 'Long Run', 'Recovery Run', 'Interval')),
  performed_at timestamptz not null,
  distance_km numeric(6,2) not null check (distance_km > 0),
  pace_seconds int not null check (pace_seconds > 0),
  avg_heart_rate int not null check (avg_heart_rate > 0),
  duration_seconds int not null check (duration_seconds > 0),
  elevation_gain_m int not null default 0 check (elevation_gain_m >= 0),
  source text not null default 'manual' check (source in ('manual', 'screenshot')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.uploaded_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  confidence int not null check (confidence >= 0 and confidence <= 100),
  workout_type text not null,
  extracted_metrics jsonb not null,
  anomalies text[] not null default '{}',
  suggested_insights text[] not null default '{}',
  file_meta jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists activities_user_performed_idx on public.activities(user_id, performed_at desc);
create index if not exists uploaded_analyses_user_created_idx on public.uploaded_analyses(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger activities_set_updated_at
before update on public.activities
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.activities enable row level security;
alter table public.uploaded_analyses enable row level security;

create policy "profiles_select_own" on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "activities_select_own" on public.activities
for select
using (auth.uid() = user_id);

create policy "activities_insert_own" on public.activities
for insert
with check (auth.uid() = user_id);

create policy "activities_update_own" on public.activities
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "activities_delete_own" on public.activities
for delete
using (auth.uid() = user_id);

create policy "uploaded_analyses_select_own" on public.uploaded_analyses
for select
using (auth.uid() = user_id);

create policy "uploaded_analyses_insert_own" on public.uploaded_analyses
for insert
with check (auth.uid() = user_id);

create policy "uploaded_analyses_delete_own" on public.uploaded_analyses
for delete
using (auth.uid() = user_id);
