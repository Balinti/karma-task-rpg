import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase/server';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    if (!stripeSecretKey) {
      console.error('Stripe secret key not configured');
      return NextResponse.json({ received: true });
    }

    const stripe = new Stripe(stripeSecretKey);

    const body = await request.text();
    let event: Stripe.Event;

    // Verify signature only if webhook secret is present
    if (webhookSecret) {
      const signature = request.headers.get('stripe-signature');
      if (!signature) {
        console.error('No Stripe signature found');
        return NextResponse.json({ received: true });
      }

      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json({ received: true });
      }
    } else {
      // No webhook secret - parse event without verification
      // This is less secure but allows for easier development
      try {
        event = JSON.parse(body) as Stripe.Event;
      } catch {
        console.error('Failed to parse webhook body');
        return NextResponse.json({ received: true });
      }
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      console.error('Supabase admin client not available');
      return NextResponse.json({ received: true });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(stripe, admin, session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(admin, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(admin, subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  }
}

async function handleCheckoutCompleted(
  stripe: Stripe,
  admin: ReturnType<typeof getSupabaseAdmin>,
  session: Stripe.Checkout.Session
) {
  if (!admin) return;

  const userId = session.metadata?.user_id;
  if (!userId) {
    console.error('No user_id in session metadata');
    return;
  }

  // Get subscription details
  const subscriptionId = session.subscription as string;
  if (!subscriptionId) {
    console.error('No subscription ID in session');
    return;
  }

  const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId);
  const subscription = subscriptionResponse as unknown as {
    status: string;
    items: { data: Array<{ price: { id: string } }> };
    current_period_end: number;
    cancel_at_period_end: boolean;
  };

  await admin.from('subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: session.customer as string,
    stripe_subscription_id: subscriptionId,
    status: subscription.status,
    price_id: subscription.items.data[0]?.price.id,
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  });

  console.log(`Subscription created for user ${userId}`);
}

interface SubscriptionData {
  id: string;
  customer: string;
  status: string;
  items: { data: Array<{ price: { id: string } }> };
  current_period_end: number;
  cancel_at_period_end: boolean;
  metadata?: { user_id?: string };
}

async function handleSubscriptionUpdated(
  admin: ReturnType<typeof getSupabaseAdmin>,
  rawSubscription: Stripe.Subscription
) {
  if (!admin) return;

  const subscription = rawSubscription as unknown as SubscriptionData;
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error('No user_id in subscription metadata');
    return;
  }

  await admin.from('subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    price_id: subscription.items.data[0]?.price.id,
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  });

  console.log(`Subscription updated for user ${userId}: ${subscription.status}`);
}

async function handleSubscriptionDeleted(
  admin: ReturnType<typeof getSupabaseAdmin>,
  rawSubscription: Stripe.Subscription
) {
  if (!admin) return;

  const subscription = rawSubscription as unknown as SubscriptionData;
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error('No user_id in subscription metadata');
    return;
  }

  await admin.from('subscriptions').update({
    status: 'canceled',
    cancel_at_period_end: true,
    updated_at: new Date().toISOString(),
  }).eq('user_id', userId);

  console.log(`Subscription canceled for user ${userId}`);
}
