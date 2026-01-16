'use client';

import { useState, useMemo } from 'react';
import { Quest, QuestCategory } from '@/lib/localStore/types';

interface QuestEditModalProps {
  isOpen: boolean;
  quest: Quest | null;
  onClose: () => void;
  onSave: (quest: Quest) => void;
  isNew?: boolean;
}

export function QuestEditModal({
  isOpen,
  quest,
  onClose,
  onSave,
  isNew = false,
}: QuestEditModalProps) {
  // Compute initial values based on quest prop
  const initialValues = useMemo(() => {
    if (quest) {
      return {
        title: quest.title,
        mvwTitle: quest.mvwTitle,
        category: quest.category,
        tags: quest.tags.join(', '),
      };
    }
    return {
      title: '',
      mvwTitle: '',
      category: 'delivery' as QuestCategory,
      tags: '',
    };
  }, [quest]);

  const [title, setTitle] = useState(initialValues.title);
  const [mvwTitle, setMvwTitle] = useState(initialValues.mvwTitle);
  const [category, setCategory] = useState<QuestCategory>(initialValues.category);
  const [tags, setTags] = useState(initialValues.tags);
  const [lastQuestId, setLastQuestId] = useState<string | null>(quest?.id || null);

  // Reset form when quest changes
  if (quest?.id !== lastQuestId) {
    setLastQuestId(quest?.id || null);
    if (quest) {
      setTitle(quest.title);
      setMvwTitle(quest.mvwTitle);
      setCategory(quest.category);
      setTags(quest.tags.join(', '));
    } else {
      setTitle('');
      setMvwTitle('');
      setCategory('delivery');
      setTags('');
    }
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagList = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const now = new Date();
    const updatedQuest: Quest = {
      id: quest?.id || `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: quest?.date || now.toISOString().split('T')[0],
      category,
      title,
      mvwTitle: mvwTitle || title,
      status: quest?.status || 'todo',
      source: quest?.source || 'manual',
      tags: tagList,
      createdAt: quest?.createdAt || now.toISOString(),
      completedAt: quest?.completedAt || null,
    };

    onSave(updatedQuest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#0f0f1a] border border-[#2a2a4e] rounded-xl max-w-md w-full p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-white mb-6">
          {isNew ? 'Create Quest' : 'Edit Quest'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as QuestCategory)}
              className="w-full px-3 py-2 bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="revenue">Revenue</option>
              <option value="delivery">Delivery</option>
              <option value="ops">Ops</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Quest Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's the full task?"
              className="w-full px-3 py-2 bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              MVW Title (10-20 min version)
            </label>
            <input
              type="text"
              value={mvwTitle}
              onChange={(e) => setMvwTitle(e.target.value)}
              placeholder="Minimum viable version of this task"
              className="w-full px-3 py-2 bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to use the main title
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="pitch, invoice, deep-work"
              className="w-full px-3 py-2 bg-[#1a1a2e] border border-[#2a2a4e] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-[#2a2a4e] hover:bg-[#3a3a5e] text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
            >
              {isNew ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
