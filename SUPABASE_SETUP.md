# Supabase Setup Guide

## Prerequisites
1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project

## Database Setup

### Tables

#### 1. `frameworks` table
```sql
create table frameworks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  framework_type text not null,
  title text not null,
  description text,
  content jsonb not null default '{}'::jsonb,
  folder_id uuid references folders(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table frameworks enable row level security;

-- Create policies
create policy "Users can view their own frameworks"
  on frameworks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own frameworks"
  on frameworks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own frameworks"
  on frameworks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own frameworks"
  on frameworks for delete
  using (auth.uid() = user_id);

-- Create index for better performance
create index frameworks_user_id_idx on frameworks(user_id);
create index frameworks_folder_id_idx on frameworks(folder_id);
```

#### 2. `folders` table
```sql
create table folders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  parent_folder_id uuid references folders(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table folders enable row level security;

-- Create policies
create policy "Users can view their own folders"
  on folders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own folders"
  on folders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own folders"
  on folders for update
  using (auth.uid() = user_id);

create policy "Users can delete their own folders"
  on folders for delete
  using (auth.uid() = user_id);

-- Create index
create index folders_user_id_idx on folders(user_id);
```

#### 3. `profiles` table
```sql
create table profiles (
  id uuid references auth.users primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Storage Setup

#### Create storage buckets

1. **framework-files** bucket
   - For user uploaded documents, images, etc.
   - Public access: No
   - File size limit: 50MB
   - Allowed MIME types: `image/*`, `application/pdf`, `text/*`, `application/vnd.*`

```sql
-- Create bucket
insert into storage.buckets (id, name, public)
values ('framework-files', 'framework-files', false);

-- Create storage policies
create policy "Users can upload their own files"
  on storage.objects for insert
  with check (
    bucket_id = 'framework-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view their own files"
  on storage.objects for select
  using (
    bucket_id = 'framework-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own files"
  on storage.objects for delete
  using (
    bucket_id = 'framework-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

2. **avatars** bucket
   - For user profile pictures
   - Public access: Yes
   - File size limit: 2MB
   - Allowed MIME types: `image/*`

```sql
-- Create bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Create storage policies
create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   You can find these in your Supabase project settings under "API".

## Email Templates (Optional)

Configure email templates in Supabase Dashboard > Authentication > Email Templates:

- Confirm signup
- Reset password
- Magic link
- Change email address

## Testing

After setup, test the connection:
```javascript
import { supabase } from './src/js/supabase.js';

// Test connection
const testConnection = async () => {
  const { data, error } = await supabase.from('profiles').select('count');
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connection successful!');
  }
};

testConnection();
```
