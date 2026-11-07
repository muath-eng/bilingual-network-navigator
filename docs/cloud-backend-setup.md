# Network Master cloud backend setup

This repository currently runs learner progress locally in the browser. The SQL migration in `supabase/migrations` prepares a secure Supabase data model for the next phase:

- learner profiles and learning goals
- completed lesson records
- quiz and exam attempts
- saved network-lab topologies

## Security model

Every learner-owned table has Row Level Security enabled. Policies use the authenticated user's own `auth.uid()` and do not allow one learner to read or modify another learner's records. Quiz attempts are append-only for the client role. Never expose a Supabase service-role key in browser code, GitHub, or Lovable environment variables prefixed with `VITE_`.

## Required setup

1. Create or select a Supabase project for Network Master.
2. In Supabase SQL Editor, run `202611070001_network_master_core.sql`.
3. Enable Email authentication and configure the email confirmation and redirect URLs for the published Lovable domain.
4. Keep the Project URL and anon/publishable key available for the frontend integration phase. Do not share the service-role key.
5. Verify RLS is enabled for all four public tables before storing learner data.

## Current limitation

The migration is a database foundation only. The frontend has not yet been switched to cloud authentication or synchronization, and the profile page deliberately states that progress is browser-local. Until the frontend integration is completed and the Supabase project is connected, use the profile page's JSON backup/restore to move progress between devices.

## Planned integration

The frontend integration will add sign-up, sign-in, sign-out, session refresh, profile synchronization, lesson-progress synchronization, exam history, and saved-topology synchronization. These operations must use the authenticated user's access token and rely on the RLS policies above.
