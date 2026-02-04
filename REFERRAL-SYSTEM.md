# Referral System for Clawdbot/Ally

## Overview

A complete referral system has been implemented that allows users to:
1. Get a unique referral link
2. See who they've referred
3. Earn rewards (credits and free months)
4. Share easily via social buttons

## Files Created

### API Layer
- `app/api/referrals/route.ts` - REST API for referral data
  - GET: Fetch user's referral stats, link, and referral list
  - POST: Track referral clicks and conversions

### Pages
- `app/dashboard/referrals/page.tsx` - Main referral dashboard with:
  - Hero card with referral link and share buttons
  - Quick stats (total earned, referrals, free months)
  - Tabbed interface: Overview, Referrals list, Rewards
  
- `app/r/[code]/page.tsx` - Referral landing page
  - Validates incoming referral codes
  - Stores referral code in localStorage + cookie
  - Shows $20 discount benefit
  - Redirects to checkout with referral applied

### Components (`components/referrals/`)
- `ShareButtons.tsx` - Social sharing (Twitter, LinkedIn, WhatsApp, Telegram, Email, Copy)
- `ReferralLink.tsx` - Copyable referral link with tooltip feedback
- `ReferralList.tsx` - List of referred users with status badges
- `RewardTracker.tsx` - Stats cards + ambassador tier progress
- `index.ts` - Barrel export

### Icons Added (`components/ui/icons.tsx`)
- GiftIcon, ShareIcon, TwitterIcon, LinkedInIcon
- WhatsAppIcon, TelegramIcon, StarIcon, TrophyIcon
- CurrencyDollarIcon, ChartBarIcon, FireIcon

## Dashboard Integration

Updated `app/dashboard/page.tsx`:
- Added "Refer & Earn" card to Quick Actions grid
- Prominent green styling to stand out
- Links to `/dashboard/referrals`

## Reward Structure (Configurable)

Current mock data structure:
- **Per Referral**: $20 credit
- **Free Month**: Every 5 successful referrals
- **Streak Bonus**: Extra 10% for monthly referral streak

### Ambassador Tiers
| Tier | Referrals | Reward/Referral |
|------|-----------|-----------------|
| Bronze | 0-4 | $20 |
| Silver | 5-14 | $25 |
| Gold | 15-29 | $30 |
| Platinum | 30+ | $40 |

## Referral Flow

```
1. User visits /dashboard/referrals
2. Copies unique link (clawdbot.com/r/CLAWD123ABC)
3. Friend clicks link → lands on /r/[code]
4. Code stored in localStorage + cookie
5. Friend signs up → checkout applies discount
6. Original user earns $20 credit
7. After 5 referrals → free month awarded
```

## TODO for Production

### Database Schema Needed
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY,
  referrer_id UUID REFERENCES users(id),
  referred_email VARCHAR(255),
  referral_code VARCHAR(20),
  status ENUM('pending', 'signed_up', 'subscribed', 'churned'),
  signed_up_at TIMESTAMP,
  subscribed_at TIMESTAMP,
  reward_credited DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE referral_codes (
  code VARCHAR(20) PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE referral_rewards (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type ENUM('credit', 'free_month'),
  amount DECIMAL(10,2),
  source_referral_id UUID REFERENCES referrals(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Integration Points
1. **Checkout flow**: Read referral code from cookie, apply discount
2. **User creation**: Track referral source on signup
3. **Subscription webhook**: Credit referrer when referral subscribes
4. **Billing system**: Apply credits to invoices

## Design Highlights

- **Dark mode optimized** with purple/green gradients
- **Mobile responsive** with touch-friendly buttons
- **Animated** feedback for copy actions
- **Social proof** elements (ratings, user count)
- **Clear CTAs** throughout the flow

## Screenshots (Run locally to view)

```bash
cd dashboard
npm run dev
# Visit http://localhost:3000/dashboard/referrals
# Visit http://localhost:3000/r/CLAWD123ABC
```
