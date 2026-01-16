'use client';

import { Quest } from '@/lib/localStore/types';
import { QuestCard } from './QuestCard';

interface QuestListProps {
  quests: Quest[];
  showMvw: boolean;
  onComplete: (id: string) => void;
  onEdit: (quest: Quest) => void;
  onDelete: (id: string) => void;
}

export function QuestList({
  quests,
  showMvw,
  onComplete,
  onEdit,
  onDelete,
}: QuestListProps) {
  const todoQuests = quests.filter((q) => q.status === 'todo');
  const doneQuests = quests.filter((q) => q.status === 'done');

  if (quests.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-4">🎯</div>
        <p>No quests for today yet.</p>
        <p className="text-sm mt-2">They&apos;ll be generated based on your goals!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {todoQuests.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Active Quests ({todoQuests.length})
          </h3>
          {todoQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              showMvw={showMvw}
              onComplete={onComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {doneQuests.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Completed ({doneQuests.length})
          </h3>
          {doneQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              showMvw={showMvw}
              onComplete={onComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
