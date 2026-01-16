import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#2a2a4e]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <span className="font-bold text-white">Karma Task RPG</span>
          </div>
          <Link
            href="/account"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Turn Your Freelance Week Into
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {' '}Daily Quests
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto">
            Your Freelancer Ops Coach that generates outcome-based daily quests for Revenue, Delivery, and Ops. Built-in anti-guilt features when life happens.
          </p>

          <div className="mt-10">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white text-lg font-medium rounded-lg transition-colors"
            >
              Try it now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              No signup required. Start in seconds.
            </p>
          </div>

          {/* Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-6">
              <span className="text-3xl">💰</span>
              <h3 className="mt-4 font-semibold text-white">Revenue Quests</h3>
              <p className="mt-2 text-sm text-gray-400">
                Daily pitches, follow-ups, and sales activities to keep your pipeline flowing.
              </p>
            </div>
            <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-6">
              <span className="text-3xl">📦</span>
              <h3 className="mt-4 font-semibold text-white">Delivery Quests</h3>
              <p className="mt-2 text-sm text-gray-400">
                Deep work blocks and project milestones to ship great work consistently.
              </p>
            </div>
            <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-6">
              <span className="text-3xl">🛡️</span>
              <h3 className="mt-4 font-semibold text-white">Anti-Guilt System</h3>
              <p className="mt-2 text-sm text-gray-400">
                Shield Days and Recovery Mode mean missed days never derail your progress.
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white">How it works</h2>
            <div className="mt-8 grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto font-bold">
                  1
                </div>
                <p className="mt-3 text-sm text-gray-300">Pick your niche</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto font-bold">
                  2
                </div>
                <p className="mt-3 text-sm text-gray-300">Set weekly goals</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto font-bold">
                  3
                </div>
                <p className="mt-3 text-sm text-gray-300">Get daily quests</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto font-bold">
                  4
                </div>
                <p className="mt-3 text-sm text-gray-300">Complete & level up</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a2a4e] py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>Karma Task RPG - Your Freelancer Ops Coach</p>
          <div className="flex gap-6">
            <Link href="/playbooks" className="hover:text-white transition-colors">
              Playbooks
            </Link>
            <Link href="/account" className="hover:text-white transition-colors">
              Account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
