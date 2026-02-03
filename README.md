# Clawdbot SaaS Dashboard

Customer-facing dashboard and marketing site for SimpleClaw.

## Features
- Landing page with pricing
- Stripe Checkout integration
- Success page with provisioning status
- Customer dashboard (coming soon)

## Deploy to Vercel

1. Connect this repo to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL` - Backend API URL (Railway)
   - `NEXT_PUBLIC_APP_URL` - Frontend URL (Vercel)
   - `STRIPE_SECRET_KEY` - Stripe secret key
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

3. Deploy!

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
