# Kinetiq

Kinetiq is a Next.js dashboard for running intelligence. It includes training insights, trend views, and a Phase 1 mocked screenshot analyzer.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Recharts
- Lucide React

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create local environment config:

```bash
cp .env.example .env.local
```

3. Start development server:

```bash
npm run dev
```

4. Open http://localhost:3000.

## Scripts

- `npm run dev` - Start Next.js dev server
- `npm run build` - Build production bundle
- `npm run start` - Run production server
- `npm run lint` - Run ESLint

## Project Structure

- `src/app/(dashboard)` - Main dashboard routes and layout
- `src/components/dashboard` - Dashboard cards and visualizations
- `src/components/layout` - Header and sidebar
- `src/components/upload` - Upload modal and analyzer entry point
- `src/providers` - Theme and upload-analysis state providers
- `src/data` - Mock dataset used by dashboard components
- `src/app/api/analyze-image/route.js` - Phase 1 analyzer API route (mock response)

## Upload Analyzer

The analyzer endpoint currently returns mocked insights with a stable response shape to unblock UI iteration.

- Accepted file types and size limits are configured via environment variables.
- Validation runs in both client and API code paths.
- Real model integration can replace the mock payload while preserving the same response contract.

## Environment Variables

Set these in `.env.local`:

- `NEXT_PUBLIC_UPLOAD_MAX_SIZE_BYTES`
- `NEXT_PUBLIC_UPLOAD_ACCEPTED_TYPES`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional fallback)
- `SUPABASE_SERVICE_ROLE_KEY`

See `.env.example` for defaults.

## Supabase Setup (Sprint 1)

Kinetiq now includes Supabase foundation files:

- `supabase/config.toml`
- `supabase/migrations/20260701120000_initial_schema.sql`
- `src/lib/supabase/*` (browser/server/admin clients)
- `src/app/api/activities/route.js` (auth-aware activities endpoint)

Recommended bootstrap flow:

1. Install Supabase CLI (if not installed):

```bash
brew install supabase/tap/supabase
```

2. Authenticate CLI:

```bash
supabase login
```

3. Link this repo to your Supabase project:

```bash
supabase link --project-ref <your-project-ref>
```

4. Apply migrations to remote:

```bash
supabase db push
```

5. (Optional) run local Supabase stack for offline development:

```bash
supabase start
```

6. Add Supabase keys to `.env.local` from your project settings.

Notes:

- The activities API route requires an authenticated Supabase user session and will return `401` when unauthenticated.
- Row Level Security is enabled on user-owned tables (`profiles`, `activities`, `uploaded_analyses`).

## Current Scope

- Demo-ready dashboard experience
- Mock-backed analysis flow
- Shared validation and config for upload constraints

Planned later: persistent analysis history, deeper test coverage, and production model integration.
