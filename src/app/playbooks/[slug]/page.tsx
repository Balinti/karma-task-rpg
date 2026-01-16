'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getPlaybook } from '@/lib/playbooks';
import { getSupabaseClient, hasSupabaseConfig } from '@/lib/supabase/client';

export default function PlaybookPage() {
  const params = useParams();
  const slug = params.slug as string;
  const playbook = getPlaybook(slug);
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      setIsLoading(false);
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkEntitlements();
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  const checkEntitlements = async () => {
    try {
      const res = await fetch('/api/entitlements');
      if (res.ok) {
        const data = await res.json();
        setIsPro(data.plan === 'pro');
      }
    } catch (error) {
      console.error('Failed to check entitlements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!playbook) {
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
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-white">Playbook Not Found</h1>
          <Link
            href="/playbooks"
            className="mt-4 inline-block text-indigo-400 hover:text-indigo-300"
          >
            ← Back to Playbooks
          </Link>
        </main>
      </div>
    );
  }

  const isLocked = !playbook.isFree && !isPro;
  const previewContent = playbook.content.split('\n').slice(0, 20).join('\n');

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
            href="/playbooks"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← All Playbooks
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Playbook Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {playbook.isFree ? (
              <span className="px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-300 rounded">
                FREE
              </span>
            ) : (
              <span className="px-2 py-1 text-xs font-medium bg-indigo-500/20 text-indigo-300 rounded">
                PRO
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white">{playbook.title}</h1>
          <p className="mt-2 text-gray-400">{playbook.description}</p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-gray-400">Loading...</div>
        ) : isLocked ? (
          <div>
            {/* Preview */}
            <div className="relative">
              <div className="prose prose-invert max-w-none">
                <div
                  className="text-gray-300 whitespace-pre-wrap"
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                  }}
                >
                  {previewContent}
                </div>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="mt-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg p-8 text-center">
              <span className="text-4xl">🔒</span>
              <h2 className="mt-4 text-xl font-bold text-white">
                Unlock This Playbook
              </h2>
              <p className="mt-2 text-gray-400">
                Upgrade to Pro to access the full playbook and all other premium content.
              </p>
              <Link
                href="/account"
                className="mt-4 inline-block px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        ) : (
          /* Full Content */
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {playbook.content}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
