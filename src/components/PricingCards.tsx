'use client';

interface PricingCardsProps {
  onSelectPlan: (priceId: string) => void;
  monthlyPriceId: string | null;
  yearlyPriceId: string | null;
  isLoading?: boolean;
}

export function PricingCards({
  onSelectPlan,
  monthlyPriceId,
  yearlyPriceId,
  isLoading,
}: PricingCardsProps) {
  const hasAnyPrice = monthlyPriceId || yearlyPriceId;

  if (!hasAnyPrice) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
      {/* Monthly */}
      {monthlyPriceId && (
        <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white">Pro Monthly</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold text-white">$9</span>
            <span className="text-gray-400">/month</span>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              3 quests/day (incl. Ops)
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              30-day history
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Full playbook access
            </li>
          </ul>
          <button
            onClick={() => onSelectPlan(monthlyPriceId)}
            disabled={isLoading}
            className="mt-6 w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? 'Processing...' : 'Subscribe Monthly'}
          </button>
        </div>
      )}

      {/* Yearly */}
      {yearlyPriceId && (
        <div className="bg-[#1a1a2e] border-2 border-indigo-500 rounded-lg p-6 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 text-white text-xs font-medium rounded-full">
            Save 17%
          </div>
          <h3 className="text-lg font-semibold text-white">Pro Yearly</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold text-white">$90</span>
            <span className="text-gray-400">/year</span>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              3 quests/day (incl. Ops)
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              30-day history
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Full playbook access
            </li>
          </ul>
          <button
            onClick={() => onSelectPlan(yearlyPriceId)}
            disabled={isLoading}
            className="mt-6 w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? 'Processing...' : 'Subscribe Yearly'}
          </button>
        </div>
      )}
    </div>
  );
}
