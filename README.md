# Traveling ORCAS

A web application for tracking and sharing ORCA figure travels around the world.

## Features

- Submit entries with photos and location data
- View travel history in a logbook format
- Interactive map showing all travel locations
- Responsive design for mobile and desktop

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- React Query
- React Leaflet
- i18next
- Vercel Blob Storage

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in the required environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

Create the following table in your Supabase database:

```sql
create table entries (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  location text not null,
  message text not null,
  photo_url text not null,
  coordinates jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table entries enable row level security;

-- Allow public read access
create policy "Allow public read access"
  on entries for select
  using (true);

-- Allow authenticated insert
create policy "Allow authenticated insert"
  on entries for insert
  with check (true);
```

## Deployment

1. Create a new project on Vercel
2. Connect your repository
3. Add the required environment variables
4. Deploy!
