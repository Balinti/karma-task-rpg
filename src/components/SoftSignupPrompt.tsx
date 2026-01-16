'use client';

interface SoftSignupPromptProps {
  onSignup: () => void;
  onDismiss: () => void;
}

export function SoftSignupPrompt({ onSignup, onDismiss }: SoftSignupPromptProps) {
  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-4 shadow-xl animate-in slide-in-from-bottom-4">
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-300"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="flex items-start gap-3">
        <span className="text-2xl">🎉</span>
        <div>
          <h3 className="font-medium text-white">Great progress!</h3>
          <p className="text-sm text-gray-400 mt-1">
            Save your progress and sync across devices. Create a free account to keep your quests safe.
          </p>
          <button
            onClick={onSignup}
            className="mt-3 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
}
