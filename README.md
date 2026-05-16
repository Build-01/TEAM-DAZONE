# SabiWork Frontend

This is the Next.js mobile-responsive frontend for the SabiWork platform.

## Setup

1. Open a terminal in `frontend`.
2. Run `npm install`.
3. Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=SabiWork
```

4. Run the app:

```bash
npm run dev
```

The app will start on `http://localhost:3000` by default.

## Features

- Onboarding + role selection
- Worker and client signup flows
- Dashboard, gigs, portfolio, pension, transactions, posting gigs, applicants, contracts, trust credit, and AI portfolio builder screens
- TailwindCSS styling with mobile-first layout
- API integration with backend endpoints under `services/api.ts`
- Offline gig caching and application queueing
- Browser notifications for session and sync updates
- Language context for English, Pidgin, Yoruba, Igbo, and Hausa
