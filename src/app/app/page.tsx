'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  loadStore,
  saveStore,
  completeQuest,
  updateQuest,
  deleteQuest,
  setDayState,
  getDayState,
  setSignupPromptDismissed,
  addQuest,
} from '@/lib/localStore';
import { Quest, UserSettings, LocalStoreData, DayState } from '@/lib/localStore/types';
import { generateDailyQuests, shouldEnterRecoveryMode, getWeeklyStats } from '@/lib/quests';
import {
  QuestList,
  ProgressBars,
  ShieldDayToggle,
  RecoveryModeBanner,
  SoftSignupPrompt,
  QuestEditModal,
  OnboardingFlow,
} from '@/components';
import { getSupabaseClient, hasSupabaseConfig } from '@/lib/supabase/client';

async function fetchEntitlements(): Promise<{ plan: string }> {
  try {
    const res = await fetch('/api/entitlements');
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Failed to check entitlements:', error);
  }
  return { plan: 'free' };
}

function useInitialStore() {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    return loadStore();
  }, []);
}

export default function AppPage() {
  const router = useRouter();
  const initialStore = useInitialStore();
  const [store, setStore] = useState<LocalStoreData | null>(initialStore);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isNewQuest, setIsNewQuest] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [questsGenerated, setQuestsGenerated] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Load store on client if not available from initial render
  if (store === null && typeof window !== 'undefined') {
    const loadedStore = loadStore();
    setStore(loadedStore);
  }

  // Check auth status once
  if (!authChecked && typeof window !== 'undefined' && hasSupabaseConfig()) {
    setAuthChecked(true);
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || '' });
          fetchEntitlements().then((data) => setIsPro(data.plan === 'pro'));
        }
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || '' });
          fetchEntitlements().then((data) => setIsPro(data.plan === 'pro'));
        } else {
          setUser(null);
          setIsPro(false);
        }
      });
    }
  }

  // Calculate derived state
  const todayState = store ? getDayState(today) : undefined;
  const isShieldDay = todayState?.shield || false;
  const isRecoveryMode = store ? shouldEnterRecoveryMode(store.dayStates, store.quests) : false;

  // Generate quests if needed (once per session when store is ready)
  let todayQuests: Quest[] = [];
  if (store && store.settings.onboardingComplete) {
    todayQuests = store.quests.filter((q) => q.date === today);

    if (todayQuests.length === 0 && !questsGenerated) {
      const newQuests = generateDailyQuests({
        date: new Date(),
        settings: store.settings,
        existingQuests: store.quests,
        isPro,
        isShieldDay,
        isRecoveryMode,
      });
      const updatedStore = { ...store, quests: [...store.quests, ...newQuests] };
      saveStore(updatedStore);
      setStore(updatedStore);
      setQuestsGenerated(true);
      todayQuests = newQuests;
    }
  }

  const handleCompleteQuest = useCallback((id: string) => {
    const updatedStore = completeQuest(id);
    setStore(updatedStore);

    // Show signup prompt after first completion if not dismissed and not logged in
    if (!updatedStore.signupPromptDismissed && !user && hasSupabaseConfig()) {
      setShowSignupPrompt(true);
    }
  }, [user]);

  const handleEditQuest = useCallback((quest: Quest) => {
    setEditingQuest(quest);
    setIsNewQuest(false);
  }, []);

  const handleDeleteQuest = useCallback((id: string) => {
    const updatedStore = deleteQuest(id);
    setStore(updatedStore);
  }, []);

  const handleSaveQuest = useCallback((quest: Quest) => {
    let updatedStore: LocalStoreData;
    if (isNewQuest) {
      updatedStore = addQuest(quest);
    } else {
      updatedStore = updateQuest(quest.id, quest);
    }
    setStore(updatedStore);
    setEditingQuest(null);
  }, [isNewQuest]);

  const handleToggleShieldDay = useCallback(() => {
    const currentShieldState = getDayState(today)?.shield || false;
    const newShieldState = !currentShieldState;
    const dayState: DayState = {
      date: today,
      shield: newShieldState,
      recovery: isRecoveryMode,
    };
    const updatedStore = setDayState(dayState);
    setStore(updatedStore);
  }, [today, isRecoveryMode]);

  const handleDismissSignupPrompt = useCallback(() => {
    setSignupPromptDismissed();
    setShowSignupPrompt(false);
  }, []);

  const handleGoToSignup = useCallback(() => {
    router.push('/account');
  }, [router]);

  const handleOnboardingComplete = useCallback((settings: UserSettings) => {
    const currentStore = loadStore();
    const updatedStore = {
      ...currentStore,
      settings,
    };
    saveStore(updatedStore);
    setStore(updatedStore);
  }, []);

  const handleCreateQuest = useCallback(() => {
    setEditingQuest(null);
    setIsNewQuest(true);
  }, []);

  // Show onboarding if not completed
  if (store && !store.settings.onboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Loading state
  if (!store) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const stats = getWeeklyStats(store.quests, weekStart);

  const showMvw = isShieldDay || isRecoveryMode;

  // Stripe price IDs
  const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || null;
  const yearlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || null;
  const hasUpgrade = (monthlyPriceId || yearlyPriceId) && hasSupabaseConfig();

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      {/* Header */}
      <header className="border-b border-[#2a2a4e]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <span className="font-bold text-white">Karma Task RPG</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/playbooks"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Playbooks
            </Link>
            {user ? (
              <Link
                href="/account"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {user.email}
              </Link>
            ) : hasSupabaseConfig() ? (
              <Link
                href="/account"
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Sign In
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Recovery Mode Banner */}
        <RecoveryModeBanner isActive={isRecoveryMode} />

        {/* Day Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Today&apos;s Campaign
            </h1>
            <p className="text-gray-400">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isPro && (
              <span className="px-2 py-1 text-xs font-medium bg-indigo-500/20 text-indigo-300 rounded">
                PRO
              </span>
            )}
            <span className="text-sm text-gray-400">
              {store.settings.niche}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Quest Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shield Day Toggle */}
            <ShieldDayToggle isActive={isShieldDay} onToggle={handleToggleShieldDay} />

            {/* Quest List */}
            <QuestList
              quests={todayQuests}
              showMvw={showMvw}
              onComplete={handleCompleteQuest}
              onEdit={handleEditQuest}
              onDelete={handleDeleteQuest}
            />

            {/* Add Quest Button */}
            <button
              onClick={handleCreateQuest}
              className="w-full py-3 border-2 border-dashed border-[#2a2a4e] rounded-lg text-gray-400 hover:text-white hover:border-indigo-500 transition-colors"
            >
              + Add Custom Quest
            </button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <ProgressBars stats={stats} />

            {/* Plan Info */}
            <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                Your Plan
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Quests/day</span>
                  <span className="text-white">{isPro ? '3' : '2'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">History</span>
                  <span className="text-white">{isPro ? '30 days' : '7 days'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Playbooks</span>
                  <span className="text-white">{isPro ? 'All' : '1 free'}</span>
                </div>
              </div>
              {!isPro && hasUpgrade && (
                <Link
                  href="/account"
                  className="mt-4 block w-full py-2 text-center bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg transition-colors text-sm"
                >
                  Upgrade to Pro
                </Link>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                Quick Links
              </h3>
              <div className="space-y-2">
                <Link
                  href="/playbooks"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  View Playbooks
                </Link>
                <Link
                  href="/settings"
                  className="block text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Soft Signup Prompt */}
      {showSignupPrompt && (
        <SoftSignupPrompt
          onSignup={handleGoToSignup}
          onDismiss={handleDismissSignupPrompt}
        />
      )}

      {/* Quest Edit Modal */}
      <QuestEditModal
        isOpen={editingQuest !== null || isNewQuest}
        quest={editingQuest}
        onClose={() => {
          setEditingQuest(null);
          setIsNewQuest(false);
        }}
        onSave={handleSaveQuest}
        isNew={isNewQuest}
      />
    </div>
  );
}
