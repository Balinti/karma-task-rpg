import { NextResponse } from 'next/server';
import { getSupabaseServer, getSupabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await getSupabaseServer();
    if (!supabase) {
      return NextResponse.json({ plan: 'free', subscription: null });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ plan: 'free', subscription: null });
    }

    // Check subscription status
    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ plan: 'free', subscription: null });
    }

    const { data: subscription } = await admin
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!subscription) {
      return NextResponse.json({ plan: 'free', subscription: null });
    }

    const isActive =
      (subscription.status === 'active' || subscription.status === 'trialing') &&
      new Date(subscription.current_period_end) > new Date();

    return NextResponse.json({
      plan: isActive ? 'pro' : 'free',
      subscription: {
        status: subscription.status,
        priceId: subscription.price_id,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  } catch (error) {
    console.error('Entitlements error:', error);
    return NextResponse.json({ plan: 'free', subscription: null });
  }
}
