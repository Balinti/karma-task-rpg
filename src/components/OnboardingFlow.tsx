'use client';

import { useState } from 'react';
import { UserSettings, NICHE_PRESETS } from '@/lib/localStore/types';

interface OnboardingFlowProps {
  onComplete: (settings: UserSettings) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState('Freelance Writer');
  const [customNiche, setCustomNiche] = useState('');
  const [goals, setGoals] = useState({
    pitchesPerWeek: 5,
    deepWorkBlocksPerWeek: 10,
    invoicesPerWeek: 2,
  });

  const handleComplete = () => {
    onComplete({
      niche: customNiche || niche,
      goals,
      onboardingComplete: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-colors ${
                s <= step ? 'bg-indigo-500' : 'bg-[#2a2a4e]'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center">
            <span className="text-6xl">🎮</span>
            <h1 className="text-3xl font-bold text-white mt-6">Welcome, Freelancer!</h1>
            <p className="text-gray-400 mt-4 text-lg">
              Turn your week into outcome-based daily quests. No guilt, just progress.
            </p>
            <div className="mt-8 space-y-4 text-left bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-6">
              <div className="flex items-start gap-3">
                <span className="text-xl">💰</span>
                <div>
                  <h3 className="font-medium text-white">Revenue Quests</h3>
                  <p className="text-sm text-gray-400">Pitches, follow-ups, sales activities</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">📦</span>
                <div>
                  <h3 className="font-medium text-white">Delivery Quests</h3>
                  <p className="text-sm text-gray-400">Deep work, client projects, creation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">⚙️</span>
                <div>
                  <h3 className="font-medium text-white">Ops Quests</h3>
                  <p className="text-sm text-gray-400">Invoicing, admin, business maintenance</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-8 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors"
            >
              Let&apos;s Go
            </button>
          </div>
        )}

        {/* Step 2: Niche Selection */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-white text-center">What&apos;s your niche?</h2>
            <p className="text-gray-400 text-center mt-2">
              We&apos;ll customize your quests based on this
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {NICHE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setNiche(preset);
                    setCustomNiche('');
                  }}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    niche === preset && !customNiche
                      ? 'bg-indigo-500/20 border-indigo-500 text-white'
                      : 'bg-[#1a1a2e] border-[#2a2a4e] text-gray-300 hover:border-gray-500'
                  } border`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="text"
                value={customNiche}
                onChange={(e) => setCustomNiche(e.target.value)}
                placeholder="Or type your own..."
                className="w-full px-4 py-3 bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 px-4 bg-[#2a2a4e] hover:bg-[#3a3a5e] text-white rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-white text-center">Set weekly goals</h2>
            <p className="text-gray-400 text-center mt-2">
              These help us generate the right quests
            </p>
            <div className="mt-6 space-y-6">
              <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-4">
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Pitches / Outreach per week</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={goals.pitchesPerWeek}
                    onChange={(e) =>
                      setGoals({ ...goals, pitchesPerWeek: parseInt(e.target.value) || 1 })
                    }
                    className="w-20 px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4e] rounded text-white text-center focus:outline-none focus:border-indigo-500"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">Revenue quest frequency</p>
              </div>
              <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-4">
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Deep work blocks per week</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={goals.deepWorkBlocksPerWeek}
                    onChange={(e) =>
                      setGoals({ ...goals, deepWorkBlocksPerWeek: parseInt(e.target.value) || 1 })
                    }
                    className="w-20 px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4e] rounded text-white text-center focus:outline-none focus:border-indigo-500"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">Delivery quest frequency</p>
              </div>
              <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-4">
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Invoices per week</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={goals.invoicesPerWeek}
                    onChange={(e) =>
                      setGoals({ ...goals, invoicesPerWeek: parseInt(e.target.value) || 0 })
                    }
                    className="w-20 px-3 py-2 bg-[#0f0f1a] border border-[#2a2a4e] rounded text-white text-center focus:outline-none focus:border-indigo-500"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">Ops quest frequency</p>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 px-4 bg-[#2a2a4e] hover:bg-[#3a3a5e] text-white rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
              >
                Start Campaign
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
