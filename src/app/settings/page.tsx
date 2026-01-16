'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { loadStore, clearStore, exportStoreAsJson, importStoreFromJson, updateSettings } from '@/lib/localStore';
import { UserSettings, NICHE_PRESETS } from '@/lib/localStore/types';
import { getSupabaseClient, hasSupabaseConfig } from '@/lib/supabase/client';

function useInitialData() {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return { settings: null, user: null };
    }
    const store = loadStore();
    return { settings: store.settings };
  }, []);
}

export default function SettingsPage() {
  const initialData = useInitialData();
  const [settings, setSettings] = useState<UserSettings | null>(initialData.settings);
  const [exportData, setExportData] = useState('');
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Load settings on client if not available
  if (settings === null && typeof window !== 'undefined') {
    const store = loadStore();
    setSettings(store.settings);
  }

  // Check auth once on client
  if (!authChecked && typeof window !== 'undefined' && hasSupabaseConfig()) {
    setAuthChecked(true);
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({ email: session.user.email || '' });
        }
      });
    }
  }

  const handleUpdateSettings = (updates: Partial<UserSettings>) => {
    if (!settings) return;
    const newSettings = { ...settings, ...updates };
    updateSettings(newSettings);
    setSettings(newSettings);
  };

  const handleExport = () => {
    const json = exportStoreAsJson();
    setExportData(json);
    navigator.clipboard.writeText(json);
  };

  const handleImport = () => {
    const success = importStoreFromJson(importText);
    setImportStatus(success ? 'success' : 'error');
    if (success) {
      const store = loadStore();
      setSettings(store.settings);
      setImportText('');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure? This will delete all your local data.')) {
      clearStore();
      window.location.href = '/app';
    }
  };

  const handleSignOut = async () => {
    if (hasSupabaseConfig()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.auth.signOut();
        setUser(null);
      }
    }
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

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

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

        {/* Profile Settings */}
        <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Niche
              </label>
              <select
                value={settings.niche}
                onChange={(e) => handleUpdateSettings({ niche: e.target.value })}
                className="w-full px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4e] rounded-lg text-white focus:outline-none focus:border-indigo-500"
              >
                {NICHE_PRESETS.map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Weekly Goals</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Pitches per week</span>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.goals.pitchesPerWeek}
                onChange={(e) =>
                  handleUpdateSettings({
                    goals: { ...settings.goals, pitchesPerWeek: parseInt(e.target.value) || 1 },
                  })
                }
                className="w-20 px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4e] rounded text-white text-center focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Deep work blocks per week</span>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.goals.deepWorkBlocksPerWeek}
                onChange={(e) =>
                  handleUpdateSettings({
                    goals: { ...settings.goals, deepWorkBlocksPerWeek: parseInt(e.target.value) || 1 },
                  })
                }
                className="w-20 px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4e] rounded text-white text-center focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Invoices per week</span>
              <input
                type="number"
                min="0"
                max="10"
                value={settings.goals.invoicesPerWeek}
                onChange={(e) =>
                  handleUpdateSettings({
                    goals: { ...settings.goals, invoicesPerWeek: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-20 px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4e] rounded text-white text-center focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Data Management</h2>

          <div className="space-y-4">
            <div>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-[#2a2a4e] hover:bg-[#3a3a5e] text-white rounded-lg transition-colors"
              >
                Export Data (Copy to Clipboard)
              </button>
              {exportData && (
                <p className="mt-2 text-sm text-emerald-400">Data copied to clipboard!</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Import Data (paste JSON)
              </label>
              <textarea
                value={importText}
                onChange={(e) => {
                  setImportText(e.target.value);
                  setImportStatus('idle');
                }}
                placeholder="Paste exported JSON here..."
                className="w-full h-32 px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4e] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-mono text-sm"
              />
              <button
                onClick={handleImport}
                disabled={!importText}
                className="mt-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                Import
              </button>
              {importStatus === 'success' && (
                <p className="mt-2 text-sm text-emerald-400">Data imported successfully!</p>
              )}
              {importStatus === 'error' && (
                <p className="mt-2 text-sm text-red-400">Invalid data format. Please check and try again.</p>
              )}
            </div>
          </div>
        </div>

        {/* Account */}
        {user && (
          <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
            <p className="text-gray-300 mb-4">{user.email}</p>
            <button
              onClick={handleSignOut}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Danger Zone */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-300 mb-4">Danger Zone</h2>
          <p className="text-sm text-red-200/70 mb-4">
            This will permanently delete all your local data including quests, settings, and history.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
          >
            Reset All Data
          </button>
        </div>
      </main>
    </div>
  );
}
