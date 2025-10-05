# Corporacity — MVP scaffold (Next.js + Supabase)

This is a starter scaffold for the Corporacity Phase 1 MVP. It contains minimal example pages:
- Landing + magic-link auth (email)
- Create Company (CEO flow)
- Join Company (employee flow - creates join request)
- Employee status page (quick buttons)
- CEO dashboard (live feed + join request approval)

## Setup (quick)

1. Install dependencies
   ```bash
   cd corporacity-mvp
   npm install
   ```

2. Create a Supabase project (https://app.supabase.com) and copy your `URL` and `ANON KEY`.
   Add these to a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_anon_key
   ```

3. Run the database schema SQL in Supabase SQL Editor: `supabase/schema.sql`

4. Start the dev server
   ```bash
   npm run dev
   ```

## Notes & Next steps
- This scaffold prioritizes clarity over completeness. It's a working starting point but not production hardened.
- For realtime updates we rely on Supabase Realtime channels; verify `realtime` is enabled on your Supabase project.
- Add proper Row Level Security (RLS) policies for production.
- Payment, push notifications, and mobile wrappers are intentionally omitted in this MVP codebase.
