// Environment variable utilities with graceful fallbacks

export const env = {
  // Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  stripeProMonthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || '',
  stripeProYearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || '',

  // App
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

export const hasSupabase = () => !!env.supabaseUrl && !!env.supabaseAnonKey;
export const hasStripe = () => !!env.stripeSecretKey && !!env.stripePublishableKey;
export const hasStripePrices = () => !!env.stripeProMonthlyPriceId || !!env.stripeProYearlyPriceId;
export const hasStripeWebhookSecret = () => !!env.stripeWebhookSecret;
