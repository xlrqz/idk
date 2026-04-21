# Generic Storefront for Vercel

A generic static storefront with:
- secure-ish server-side admin login via Vercel API routes
- hidden admin page at `/admin`
- editable product catalog
- cart quantity controls
- no restricted-product content

## Important note
Product edits are stored in the browser's `localStorage` in this template. That means:
- admin login is server-side and the password is not exposed in the client
- product changes are only shared on the same browser/device unless you connect a real database

If you want shared live product data later, connect Supabase, Neon/Postgres, or another database.

## Deploy on Vercel
1. Upload this folder to a Git repo or drag it into Vercel.
2. In Vercel project settings, add environment variables:
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`
3. Deploy.

## Local dev
```bash
npm i -g vercel
vercel dev
```

## Admin access
- Open `/admin`
- Enter the password you set in `ADMIN_PASSWORD`

