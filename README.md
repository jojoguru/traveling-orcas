# Traveling ORCAS

A web application for tracking and sharing ORCA figure travels around the world. Each ORCA figure has its own journey, and colleagues can capture and share moments from different locations.

## Features

- Email-based authentication with verification codes
- Multi-language support (English, German)
- Submit entries with photos and location data
- Automatic geolocation detection
- Interactive location search with address suggestions
- View travel history in a logbook format
- Interactive map showing travel routes and locations
- Individual journey tracking for each ORCA
- Responsive design for mobile and desktop
- Beautiful loading states and animations
- Secure file uploads with Vercel Blob Storage

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase (Database & Storage)
- TanStack Query (React Query)
- React Leaflet for maps
- i18next for internationalization
- Vercel Blob Storage for images
- Resend for transactional emails
- OpenStreetMap/Nominatim for geocoding

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
   RESEND_API_KEY=your-resend-api-key
   EMAIL_SENDER_ADDRESS=your-sender-email
   EMAIL_SENDER_NAME=your-sender-name
   SESSION_DURATION_DAYS=7
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

Create the following tables in your Supabase database:
[View the full schema](docs/schema.sql)


## Authentication Flow

The application uses a passwordless authentication system:

1. User enters their email address
2. A 6-digit verification code is sent via email
3. User enters the code to verify their identity
4. A session is created and stored in an HTTP-only cookie
5. Sessions expire after the configured duration (default: 7 days)

## Internationalization

The application supports multiple languages:
- English (default)
- German
- More languages can be easily added via the translation files

Language detection order:
1. User's manual selection (stored in localStorage)
2. Browser language
3. Falls back to English

## Deployment

1. Create a new project on Vercel
2. Connect your repository
3. Add the required environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `BLOB_READ_WRITE_TOKEN`
   - `RESEND_API_KEY`
   - `EMAIL_SENDER_ADDRESS`
   - `EMAIL_SENDER_NAME`
   - `SESSION_DURATION_DAYS`
4. Deploy!

## Security Considerations

- All authentication codes expire after 15 minutes
- Sessions are stored in HTTP-only cookies
- Email verification required for access
- Restricted email domains for authentication
- Secure file upload handling
- Row Level Security enabled on all tables
