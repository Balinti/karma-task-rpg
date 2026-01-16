'use client';

interface ProgressBarsProps {
  stats: {
    shipped: number;
    sold: number;
    invoiced: number;
    total: number;
    completed: number;
  };
}

export function ProgressBars({ stats }: ProgressBarsProps) {
  const progressPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg p-4 space-y-4">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
        This Week&apos;s Progress
      </h3>

      {/* Overall Progress */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Overall</span>
          <span className="text-gray-400">{stats.completed}/{stats.total} quests</span>
        </div>
        <div className="h-2 bg-[#2a2a4e] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-3 gap-4 pt-2">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">{stats.sold}</div>
          <div className="text-xs text-gray-400">Sold</div>
          <div className="text-xs text-gray-500">(Revenue)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.shipped}</div>
          <div className="text-xs text-gray-400">Shipped</div>
          <div className="text-xs text-gray-500">(Delivery)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-400">{stats.invoiced}</div>
          <div className="text-xs text-gray-400">Invoiced</div>
          <div className="text-xs text-gray-500">(Ops)</div>
        </div>
      </div>
    </div>
  );
}
