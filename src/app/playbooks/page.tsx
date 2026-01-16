'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PLAYBOOKS } from '@/lib/playbooks';
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

export default function PlaybooksPage() {
  const [isPro, setIsPro] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!hasSupabaseConfig()) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsLoggedIn(true);
        fetchEntitlements().then((data) => setIsPro(data.plan === 'pro'));
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      {/* Header */}
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Playbooks</h1>
          <p className="mt-2 text-gray-400">
            Proven systems and frameworks to level up your freelance business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {PLAYBOOKS.map((playbook) => {
            const isLocked = !playbook.isFree && !isPro;

            return (
              <Link
                key={playbook.slug}
                href={`/playbooks/${playbook.slug}`}
                className={`
                  block bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-6
                  transition-all hover:border-indigo-500/50
                  ${isLocked ? 'opacity-75' : ''}
                `}
              >
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    {playbook.title}
                  </h2>
                  {playbook.isFree ? (
                    <span className="px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-300 rounded">
                      FREE
                    </span>
                  ) : isLocked ? (
                    <span className="px-2 py-1 text-xs font-medium bg-amber-500/20 text-amber-300 rounded flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      PRO
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-indigo-500/20 text-indigo-300 rounded">
                      PRO
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-gray-400">
                  {playbook.description}
                </p>
                <div className="mt-4 text-sm text-indigo-400">
                  {isLocked ? 'Upgrade to unlock' : 'Read playbook'} →
                </div>
              </Link>
            );
          })}
        </div>

        {!isPro && (
          <div className="mt-12 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold text-white">Unlock All Playbooks</h2>
            <p className="mt-2 text-gray-400">
              Upgrade to Pro to access all {PLAYBOOKS.length} playbooks and accelerate your freelance growth.
            </p>
            <Link
              href="/account"
              className="mt-4 inline-block px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
            >
              {isLoggedIn ? 'Upgrade to Pro' : 'Create Free Account'}
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
