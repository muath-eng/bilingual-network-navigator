-- Network Master cloud data foundation
-- Apply in a Supabase project after enabling email/password authentication.
-- Every learner-owned table is protected by row-level security.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 60),
  learning_goal text not null default 'ccna'
    check (learning_goal in ('ccna', 'mikrotik', 'network-admin', 'troubleshooting')),
  weekly_target integer not null default 5 check (weekly_target between 1 and 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null check (char_length(lesson_id) between 1 and 120),
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_id text not null check (char_length(exam_id) between 1 and 120),
  score integer not null check (score >= 0),
  total integer not null check (total > 0 and score <= total),
  passed boolean not null,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.lab_topologies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My network' check (char_length(name) between 1 and 80),
  topology jsonb not null check (jsonb_typeof(topology) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lesson_progress_user_completed_idx
  on public.lesson_progress (user_id, completed_at desc);
create index if not exists quiz_attempts_user_created_idx
  on public.quiz_attempts (user_id, created_at desc);
create index if not exists lab_topologies_user_updated_idx
  on public.lab_topologies (user_id, updated_at desc);

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.lab_topologies enable row level security;

drop policy if exists "Learners read own profile" on public.profiles;
create policy "Learners read own profile" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
drop policy if exists "Learners create own profile" on public.profiles;
create policy "Learners create own profile" on public.profiles
  for insert to authenticated with check (id = (select auth.uid()));
drop policy if exists "Learners update own profile" on public.profiles;
create policy "Learners update own profile" on public.profiles
  for update to authenticated using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "Learners manage own lesson progress" on public.lesson_progress;
create policy "Learners manage own lesson progress" on public.lesson_progress
  for all to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "Learners read own quiz attempts" on public.quiz_attempts;
create policy "Learners read own quiz attempts" on public.quiz_attempts
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "Learners create own quiz attempts" on public.quiz_attempts;
create policy "Learners create own quiz attempts" on public.quiz_attempts
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "Learners manage own lab topologies" on public.lab_topologies;
create policy "Learners manage own lab topologies" on public.lab_topologies
  for all to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Create a profile automatically for each newly registered learner.
create or replace function public.handle_new_network_master_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_network_master_user_created on auth.users;
create trigger on_network_master_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_network_master_user();

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.lesson_progress to authenticated;
grant select, insert on public.quiz_attempts to authenticated;
grant select, insert, update, delete on public.lab_topologies to authenticated;
