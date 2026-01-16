'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabaseClient, hasSupabaseConfig } from '@/lib/supabase/client';
import { loadStore } from '@/lib/localStore';
import { PaywallModal } from '@/components';

type AuthMode = 'signin' | 'signup';

interface UserData {
  id: string;
  email: string;
}

interface Subscription {
  status: string;
  priceId: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export default function AccountPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPaywall, setShowPaywall] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const supabaseAvailable = hasSupabaseConfig();

  const monthlyPriceId = typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || null
    : null;
  const yearlyPriceId = typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || null
    : null;
  const hasStripePrices = monthlyPriceId || yearlyPriceId;

  useEffect(() => {
    if (!supabaseAvailable) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        fetchSubscription();
      }
    });

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        fetchSubscription();
      } else {
        setUser(null);
        setSubscription(null);
      }
    });

    return () => authSub.unsubscribe();
  }, [supabaseAvailable]);

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/entitlements');
      if (res.ok) {
        const data = await res.json();
        if (data.subscription) {
          setSubscription(data.subscription);
        }
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseAvailable) return;

    setError('');
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError('Supabase not configured');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Auto-import local data after signup
        await handleImportData();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = async () => {
    setImporting(true);
    setImportStatus('idle');

    try {
      const store = loadStore();
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: store.settings,
          quests: store.quests,
          dayStates: store.dayStates,
        }),
      });

      if (!res.ok) {
        throw new Error('Import failed');
      }

      setImportStatus('success');
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus('error');
    } finally {
      setImporting(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
      router.push('/');
    }
  };

  const handleUpgrade = async (priceId: string) => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create portal session');
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      console.error('Portal error:', error);
      setError(error instanceof Error ? error.message : 'Failed to open billing portal');
    }
  };

  // Not available banner
  if (!supabaseAvailable) {
    return (
      <div className="min-h-screen bg-[#0f0f1a]">
        <header className="border-b border-[#2a2a4e]">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              <span className="font-bold text-white">Karma Task RPG</span>
            </Link>
          </div>
        </header>
        <main className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-amber-300">Cloud Sync Unavailable</h2>
            <p className="mt-2 text-amber-200/70">
              Account features require Supabase configuration. Your data is saved locally.
            </p>
            <Link
              href="/app"
              className="mt-4 inline-block px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
            >
              Continue to App
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Logged in view
  if (user) {
    const isPro = subscription?.status === 'active' || subscription?.status === 'trialing';

    return (
      <div className="min-h-screen bg-[#0f0f1a]">
        <header className="border-b border-[#2a2a4e]">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              <span className="font-bold text-white">Karma Task RPG</span>
            </Link>
            <Link
              href="/app"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back to App
            </Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-white mb-8">Account</h1>

          {/* User Info */}
          <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
            <p className="text-gray-300">{user.email}</p>
            <button
              onClick={handleSignOut}
              className="mt-4 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Data Sync */}
          <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Data Sync</h2>
            <p className="text-gray-400 text-sm mb-4">
              Import your local progress to sync across devices.
            </p>
            <button
              onClick={handleImportData}
              disabled={importing}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {importing ? 'Importing...' : 'Import Local Data'}
            </button>
            {importStatus === 'success' && (
              <p className="mt-2 text-sm text-emerald-400">Data imported successfully!</p>
            )}
            {importStatus === 'error' && (
              <p className="mt-2 text-sm text-red-400">Import failed. Please try again.</p>
            )}
          </div>

          {/* Subscription */}
          <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Subscription</h2>
            {isPro ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs font-medium bg-indigo-500/20 text-indigo-300 rounded">
                    PRO
                  </span>
                  <span className="text-gray-300">Active</span>
                </div>
                {subscription?.currentPeriodEnd && (
                  <p className="text-sm text-gray-400">
                    {subscription.cancelAtPeriodEnd
                      ? `Cancels on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                      : `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
                  </p>
                )}
                <button
                  onClick={handleManageBilling}
                  className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Manage Billing
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 mb-4">You&apos;re on the Free plan.</p>
                {hasStripePrices && (
                  <button
                    onClick={() => setShowPaywall(true)}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                  >
                    Upgrade to Pro
                  </button>
                )}
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-400 mb-4">{error}</p>
          )}
        </main>

        {/* Paywall Modal */}
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          onSelectPlan={handleUpgrade}
          monthlyPriceId={monthlyPriceId}
          yearlyPriceId={yearlyPriceId}
          isLoading={checkoutLoading}
          feature="Pro features"
        />
      </div>
    );
  }

  // Auth form
  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <header className="border-b border-[#2a2a4e]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <span className="font-bold text-white">Karma Task RPG</span>
          </Link>
          <Link
            href="/app"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Continue without account
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-16">
        <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-400 text-center mb-8">
            {mode === 'signin'
              ? 'Sign in to sync your progress'
              : 'Save and sync your quests across devices'}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-[#0f0f1a] border border-[#2a2a4e] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 bg-[#0f0f1a] border border-[#2a2a4e] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
