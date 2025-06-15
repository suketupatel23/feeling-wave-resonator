
-- Create the profiles table linked to auth.users
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  primary key (id)
);

-- Automatically insert a public.profiles row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, created_at, updated_at)
  values (new.id, now(), now());
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable RLS for security
alter table public.profiles enable row level security;

-- Allow users to SELECT their own profile
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

-- Allow users to INSERT their own profile
create policy "Users can create their own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Allow users to UPDATE their own profile
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Allow users to DELETE their own profile (optional, not usually recommended)
create policy "Users can delete their own profile" on public.profiles
  for delete using (auth.uid() = id);
