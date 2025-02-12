# Traveling ORCAS Project Specification
## Project Overview
The "TravelingORCAS" app is designed to connect ORCA colleagues by allowing them to share their experiences with a 3D ORCA figure. Each ORCA is equipped with a unique QR code, and users can log their interactions on a dedicated website. The app will be built using Next.js, styled with Tailwind CSS, and deployed on Vercel. Vercel's Blob Storage and Supabase will be used for storing photos and user data.

## User Experience
### User Journey
1. Scan QR Code: Users scan the QR code on the ORCA with their phone to access the website. The QR code contains a link to this website.
2. Submit Entry: Users fill out a form with their name, location, a photo, and a message.
3. View Logbook: Users can browse previous entries in a logbook format.
4. View Map: Users can see the ORCA's travel route on a map.

### UI Design
- Form Page: A simple form for submitting entries, including fields for name, location, photo upload, and a message. 
- Logbook Page: A list of previous entries with photos, names, locations, and messages.
- Map Page: An interactive map showing the ORCA's travel route.

## Technical Details
### Frontend
- Framework: Next.js
- Styling: Tailwind CSS
- State Management: Zustand
- Data Fetching: TanStack React Query
- Internationalization: i18next

### Backend
- Database: Supabase (hosted on Vercel)
- Tables: entries with fields for name, location, message, photo_url, created_at
- Storage: Vercel Blob Storage for photos

## Key Features
1. Form Submission
   - Validate and submit user data to Supabase.
   - Store photos in Vercel Blob Storage.
2. Logbook Display
   - Fetch and display entries from Supabase.
3. Map Integration
   - Use react-leaflet to display the ORCA's travel route.

## Deployment
- Platform: Vercel
- Environment Variables: Configure Supabase and Blob Storage credentials in Vercel.
## Additional Considerations
- Responsive Design: Ensure the app is mobile-friendly using Tailwind CSS.
- Error Handling: Implement user-friendly error messages and logging.
- Testing: Write unit and integration tests for critical components.
