create table if not exists public.bets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null,
  category text not null,
  date date not null,
  time text not null,
  stake numeric not null default 0,
  return_value numeric not null default 0,
  status text not null check (status in ('win', 'loss', 'push', 'open')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.bets enable row level security;

drop policy if exists "Users can read own bets" on public.bets;
create policy "Users can read own bets"
  on public.bets for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own bets" on public.bets;
create policy "Users can create own bets"
  on public.bets for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own bets" on public.bets;
create policy "Users can update own bets"
  on public.bets for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own bets" on public.bets;
create policy "Users can delete own bets"
  on public.bets for delete
  using (auth.uid() = user_id);

create index if not exists bets_user_date_idx on public.bets (user_id, date desc, time desc);

create table if not exists public.betting_houses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table public.betting_houses enable row level security;

drop policy if exists "Users can read betting houses" on public.betting_houses;
create policy "Users can read betting houses"
  on public.betting_houses for select
  to authenticated
  using (true);

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
