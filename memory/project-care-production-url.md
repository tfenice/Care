---
name: project-care-production-url
description: Care app production URL on Vercel; Supabase project and redirect URL config
metadata:
  type: project
---

Production URL: https://care-eight-kappa.vercel.app

Supabase Auth → URL Configuration:
- Site URL: https://care-eight-kappa.vercel.app
- Redirect URLs: https://care-eight-kappa.vercel.app/auth/callback

**Why:** Needed for NEXT_PUBLIC_SITE_URL env var and for verifying auth callback configuration.
**How to apply:** When referencing the production URL or debugging Supabase auth config, use this domain.
