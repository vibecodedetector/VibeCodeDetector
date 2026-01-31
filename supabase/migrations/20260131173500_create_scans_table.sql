-- Create scans table
create table if not exists public.scans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  status text not null,
  overall_score integer,
  results jsonb,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.scans enable row level security;

-- Policies
create policy "Users can view their own scans"
  on public.scans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own scans"
  on public.scans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own scans"
  on public.scans for update
  using (auth.uid() = user_id);
