# Karma Task RPG

A Freelancer Ops Coach that turns your week into outcome-based daily Quests with anti-guilt features.

**Live Demo**: https://karma-task-rpg.vercel.app

## Features

- **Daily Quest System**: Revenue, Delivery, and Ops quests tailored to your niche
- **Niche Presets**: Developer, Designer, Writer, Marketer, Consultant, Coach
- **Anti-Guilt Loop**:
  - Shield Day toggle for rest days
  - Recovery Mode when you miss days
  - MVW (Minimum Viable Win) quests for low-energy periods
- **Anonymous First**: Works instantly without signup using localStorage
- **Optional Sync**: Create an account to sync across devices via Supabase
- **Pro Tier**: Upgrade via Stripe for 3 quests/day, 30-day history, all playbooks

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (Dark RPG theme)
- **Auth & Database**: Supabase (optional)
- **Payments**: Stripe (optional)

## Quick Start

```bash
# Clone the repo
git clone https://github.com/Balinti/karma-task-rpg.git
cd karma-task-rpg

# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:3000 - the app works immediately in anonymous mode.

## Environment Variables

The app works without any environment variables (anonymous localStorage mode). Add these for full functionality:

### Supabase (Authentication & Cloud Sync)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Stripe (Subscription Payments)

```env
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_...
```

### App Configuration

```env
NEXT_PUBLIC_APP_URL=https://karma-task-rpg.vercel.app
```

## Supabase Setup

1. Create a new Supabase project
2. Run the migrations in order:

```bash
# In Supabase SQL Editor, run:
# 1. supabase/schema.sql (creates tables)
# 2. supabase/rls.sql (enables Row Level Security)
```

## Stripe Setup

1. Create products in Stripe Dashboard:
   - Pro Monthly subscription
   - Pro Yearly subscription
2. Copy the Price IDs to environment variables
3. Set up webhook endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
4. Subscribe to events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── app/page.tsx      # Main campaign dashboard
│   ├── account/page.tsx  # Auth & subscription management
│   ├── playbooks/        # Static playbook content
│   ├── settings/page.tsx # User settings
│   └── api/              # API routes
│       ├── entitlements/ # Check user plan
│       ├── import/       # Import localStorage to cloud
│       └── stripe/       # Checkout, portal, webhook
├── components/           # React components
├── lib/
│   ├── localStore/       # localStorage management
│   ├── quests/           # Quest generation logic
│   ├── supabase/         # Supabase clients
│   ├── playbooks.ts      # Playbook content
│   └── env.ts            # Environment utilities
└── supabase/             # Database migrations
```

## Deployment

### Vercel (Recommended)

```bash
npx vercel
```

Then add environment variables in Vercel Dashboard > Project Settings > Environment Variables.

### Self-Hosted

Build and run with any Node.js hosting:

```bash
npm run build
npm start
```

## License

MIT
