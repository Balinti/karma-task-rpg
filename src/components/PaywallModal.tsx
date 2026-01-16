'use client';

import { PricingCards } from './PricingCards';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (priceId: string) => void;
  monthlyPriceId: string | null;
  yearlyPriceId: string | null;
  isLoading?: boolean;
  feature?: string;
}

export function PaywallModal({
  isOpen,
  onClose,
  onSelectPlan,
  monthlyPriceId,
  yearlyPriceId,
  isLoading,
  feature = 'this feature',
}: PaywallModalProps) {
  if (!isOpen) return null;

  const hasAnyPrice = monthlyPriceId || yearlyPriceId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#0f0f1a] border border-[#2a2a4e] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <span className="text-4xl">⚡</span>
          <h2 className="text-2xl font-bold text-white mt-4">Upgrade to Pro</h2>
          <p className="text-gray-400 mt-2">
            Unlock {feature} and supercharge your freelance productivity.
          </p>
        </div>

        {hasAnyPrice ? (
          <PricingCards
            onSelectPlan={onSelectPlan}
            monthlyPriceId={monthlyPriceId}
            yearlyPriceId={yearlyPriceId}
            isLoading={isLoading}
          />
        ) : (
          <div className="text-center text-gray-400 py-8">
            <p>Pro plans coming soon!</p>
            <p className="text-sm mt-2">Check back later for upgrade options.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Free tier includes:</h3>
          <div className="flex justify-center gap-6 text-sm text-gray-300">
            <span>2 quests/day</span>
            <span>7-day history</span>
            <span>1 playbook</span>
          </div>
        </div>
      </div>
    </div>
  );
}
