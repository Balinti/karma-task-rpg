'use client';

interface ShieldDayToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

export function ShieldDayToggle({ isActive, onToggle }: ShieldDayToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full
        ${isActive
          ? 'bg-purple-500/20 border-purple-500 text-purple-300'
          : 'bg-[#1a1a2e] border-[#2a2a4e] text-gray-400 hover:text-gray-300 hover:border-gray-500'
        }
        border
      `}
    >
      <span className="text-2xl">{isActive ? '🛡️' : '🛡️'}</span>
      <div className="text-left flex-1">
        <div className="font-medium">Shield Day</div>
        <div className="text-xs opacity-70">
          {isActive
            ? 'Active - only MVW tasks shown. Take it easy.'
            : 'Enable for a lighter day with MVW tasks only'}
        </div>
      </div>
      <div
        className={`
          w-12 h-6 rounded-full transition-colors relative
          ${isActive ? 'bg-purple-500' : 'bg-[#2a2a4e]'}
        `}
      >
        <div
          className={`
            absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
            ${isActive ? 'translate-x-7' : 'translate-x-1'}
          `}
        />
      </div>
    </button>
  );
}
