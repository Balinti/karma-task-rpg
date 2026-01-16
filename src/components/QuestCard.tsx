'use client';

import { Quest } from '@/lib/localStore/types';

interface QuestCardProps {
  quest: Quest;
  showMvw: boolean;
  onComplete: (id: string) => void;
  onEdit: (quest: Quest) => void;
  onDelete: (id: string) => void;
}

const categoryColors = {
  revenue: 'border-l-emerald-500 bg-emerald-500/10',
  delivery: 'border-l-blue-500 bg-blue-500/10',
  ops: 'border-l-amber-500 bg-amber-500/10',
};

const categoryLabels = {
  revenue: 'Revenue',
  delivery: 'Delivery',
  ops: 'Ops',
};

const categoryIcons = {
  revenue: '💰',
  delivery: '📦',
  ops: '⚙️',
};

export function QuestCard({
  quest,
  showMvw,
  onComplete,
  onEdit,
  onDelete,
}: QuestCardProps) {
  const isCompleted = quest.status === 'done';
  const displayTitle = showMvw ? quest.mvwTitle : quest.title;

  return (
    <div
      className={`
        relative p-4 rounded-lg border-l-4 transition-all
        ${categoryColors[quest.category]}
        ${isCompleted ? 'opacity-60' : 'hover:scale-[1.02]'}
        bg-[#1a1a2e] border border-[#2a2a4e]
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{categoryIcons[quest.category]}</span>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              {categoryLabels[quest.category]}
            </span>
            {showMvw && (
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                MVW
              </span>
            )}
            {quest.source === 'manual' && (
              <span className="text-xs px-2 py-0.5 rounded bg-gray-500/20 text-gray-300">
                Custom
              </span>
            )}
          </div>
          <h3
            className={`text-lg font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-white'}`}
          >
            {displayTitle}
          </h3>
          {quest.tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {quest.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded bg-[#2a2a4e] text-gray-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {!isCompleted && (
            <button
              onClick={() => onComplete(quest.id)}
              className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors"
              title="Mark complete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
          <button
            onClick={() => onEdit(quest)}
            className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(quest.id)}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      {isCompleted && quest.completedAt && (
        <div className="mt-2 text-xs text-gray-500">
          Completed {new Date(quest.completedAt).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
