create extension if not exists "pgcrypto";

create table if not exists public.bets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  platform text not null,
  category text not null default 'Outro',
  date date not null,
  time time not null,
  stake numeric(12, 2) not null default 0 check (stake >= 0),
  return_value numeric(12, 2) not null default 0 check (return_value >= 0),
  status text not null default 'open' check (status in ('win', 'loss', 'push', 'open')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists bets_user_date_idx on public.bets (user_id, date desc, time desc);
create index if not exists bets_user_platform_idx on public.bets (user_id, platform);
create index if not exists bets_user_category_idx on public.bets (user_id, category);

alter table public.bets enable row level security;

drop policy if exists "Users can read own bets" on public.bets;
create policy "Users can read own bets"
on public.bets for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own bets" on public.bets;
create policy "Users can insert own bets"
on public.bets for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own bets" on public.bets;
create policy "Users can update own bets"
on public.bets for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own bets" on public.bets;
create policy "Users can delete own bets"
on public.bets for delete
to authenticated
using (auth.uid() = user_id);
