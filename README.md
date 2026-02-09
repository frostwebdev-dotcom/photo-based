# Photo-Based Junk Quote

A production-ready web app for junk removal quote requests. Customers upload photos and details without creating accounts; admins manage submissions via a secure dashboard.

## Tech Stack

- **Next.js 14+** (App Router) + TypeScript
- **Tailwind CSS**
- **Supabase** (Postgres + Storage + Auth)
- **SendGrid** (email)
- **reCAPTCHA v3** (spam protection)
- **Vercel** (deployment)

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in .env.local with your credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx           # Landing
  request/page.tsx   # Public request form
  success/page.tsx   # Post-submit success
  admin/
    login/page.tsx   # Admin login
    page.tsx         # Admin dashboard
    [id]/page.tsx    # Admin detail
api/
  submit-request/    # POST form (service role)
  admin/submissions/ # GET list, GET/PATCH by id
  admin/export-csv/  # CSV export
lib/
  supabaseClient.ts  # Browser client
  supabaseServer.ts  # Server client (session)
  supabaseService.ts # Service role client
  validators.ts      # Zod schemas
  recaptcha.ts       # reCAPTCHA verify
  sendgrid.ts        # Email
  signedUrl.ts       # Storage signed URLs
  csv.ts             # CSV builder
  rateLimit.ts       # Per-IP rate limit
supabase/migrations/ # SQL migration
```

## Environment Variables

See `.env.example` for all required variables.

## Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables (see HANDOFF.md)
4. Deploy

See **HANDOFF.md** for full setup instructions.
