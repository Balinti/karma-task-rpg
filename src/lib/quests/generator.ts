import { Quest, QuestCategory, UserSettings } from '../localStore/types';

function generateId(): string {
  return `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

interface QuestTemplate {
  category: QuestCategory;
  titles: string[];
  mvwTitles: string[];
  tags: string[];
}

const QUEST_TEMPLATES: Record<string, QuestTemplate[]> = {
  'Freelance Writer': [
    {
      category: 'revenue',
      titles: [
        'Send 3 pitch emails to new prospects',
        'Follow up with 2 warm leads',
        'Research 5 potential clients in your niche',
        'Update your portfolio with recent work',
        'Reach out to past client for referral',
      ],
      mvwTitles: [
        'Send 1 pitch email',
        'Draft a follow-up email',
        'Find 2 potential clients',
        'Add 1 piece to portfolio',
        'Draft referral request email',
      ],
      tags: ['pitch', 'outreach'],
    },
    {
      category: 'delivery',
      titles: [
        'Complete 2-hour deep work block on current project',
        'Finish first draft of article',
        'Complete client revisions',
        'Research and outline next piece',
        'Write 1000 words on current assignment',
      ],
      mvwTitles: [
        '30-minute focused writing session',
        'Write opening paragraph',
        'Address 1 client comment',
        'Create rough outline',
        'Write 250 words',
      ],
      tags: ['writing', 'deep-work'],
    },
    {
      category: 'ops',
      titles: [
        'Send pending invoices',
        'Update project tracking spreadsheet',
        'Review and respond to all client emails',
        'Update contracts for new project',
        'Reconcile this week\'s income',
      ],
      mvwTitles: [
        'Prepare 1 invoice',
        'Log today\'s work time',
        'Reply to 1 urgent email',
        'Review contract template',
        'Check payment status',
      ],
      tags: ['admin', 'invoice'],
    },
  ],
};

// Default templates for other niches
const DEFAULT_TEMPLATES: QuestTemplate[] = [
  {
    category: 'revenue',
    titles: [
      'Send 3 outreach messages to potential clients',
      'Follow up with 2 prospects',
      'Update your online presence',
      'Research new opportunities in your market',
      'Ask a happy client for testimonial',
    ],
    mvwTitles: [
      'Send 1 outreach message',
      'Draft a follow-up',
      'Update one profile',
      'Find 2 opportunities',
      'Draft testimonial request',
    ],
    tags: ['outreach', 'sales'],
  },
  {
    category: 'delivery',
    titles: [
      'Complete 2-hour deep work session',
      'Finish current milestone',
      'Address client feedback',
      'Plan next deliverable',
      'Make progress on main project',
    ],
    mvwTitles: [
      '30-minute focused work session',
      'Complete one small task',
      'Address 1 feedback item',
      'Create rough plan',
      '15 minutes on main project',
    ],
    tags: ['work', 'delivery'],
  },
  {
    category: 'ops',
    titles: [
      'Send any pending invoices',
      'Update project tracking',
      'Process client communications',
      'Review contracts',
      'Review finances',
    ],
    mvwTitles: [
      'Prepare 1 invoice',
      'Log today\'s progress',
      'Reply to 1 message',
      'Quick contract check',
      'Check recent payments',
    ],
    tags: ['admin', 'invoice'],
  },
];

function getTemplates(niche: string): QuestTemplate[] {
  return QUEST_TEMPLATES[niche] || DEFAULT_TEMPLATES;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateQuestForCategory(
  category: QuestCategory,
  date: Date,
  templates: QuestTemplate[],
  existingQuests: Quest[]
): Quest {
  const template = templates.find((t) => t.category === category)!;
  const dateStr = formatDate(date);

  // Avoid picking the same title as recent quests
  const recentTitles = existingQuests
    .filter((q) => q.category === category)
    .slice(-5)
    .map((q) => q.title);

  const availableTitles = template.titles.filter((t) => !recentTitles.includes(t));
  const titles = availableTitles.length > 0 ? availableTitles : template.titles;

  const titleIndex = Math.floor(Math.random() * titles.length);
  const title = titles[titleIndex];
  const mvwTitle = template.mvwTitles[template.titles.indexOf(title)] || pickRandom(template.mvwTitles);

  return {
    id: generateId(),
    date: dateStr,
    category,
    title,
    mvwTitle,
    status: 'todo',
    source: 'generated',
    tags: [...template.tags],
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
}

export interface GenerateQuestsOptions {
  date: Date;
  settings: UserSettings;
  existingQuests: Quest[];
  isPro: boolean;
  isShieldDay: boolean;
  isRecoveryMode: boolean;
}

export function generateDailyQuests(options: GenerateQuestsOptions): Quest[] {
  const { date, settings, existingQuests, isPro } = options;
  // Note: isShieldDay and isRecoveryMode are used at display time, not generation time
  const dateStr = formatDate(date);

  // Check if quests already exist for this date
  const todayQuests = existingQuests.filter((q) => q.date === dateStr);
  if (todayQuests.length > 0) {
    return todayQuests;
  }

  const templates = getTemplates(settings.niche);
  const quests: Quest[] = [];

  // Always generate Revenue and Delivery quests
  quests.push(generateQuestForCategory('revenue', date, templates, existingQuests));
  quests.push(generateQuestForCategory('delivery', date, templates, existingQuests));

  // Only Pro users get Ops quest
  if (isPro) {
    quests.push(generateQuestForCategory('ops', date, templates, existingQuests));
  }

  // If shield day or recovery mode, mark quests as MVW-only (client will display MVW titles)
  // This is handled at display time, not generation time

  return quests;
}

export function createManualQuest(
  category: QuestCategory,
  title: string,
  mvwTitle: string,
  date: Date,
  tags: string[] = []
): Quest {
  return {
    id: generateId(),
    date: formatDate(date),
    category,
    title,
    mvwTitle: mvwTitle || title,
    status: 'todo',
    source: 'manual',
    tags,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
}

export function shouldEnterRecoveryMode(
  dayStates: { date: string; shield: boolean }[],
  quests: Quest[]
): boolean {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  let consecutiveMissedDays = 0;

  for (let i = 1; i <= 2; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = formatDate(checkDate);

    const dayState = dayStates.find((d) => d.date === dateStr);
    if (dayState?.shield) {
      // Shield days don't count towards missed days
      continue;
    }

    const dayQuests = quests.filter((q) => q.date === dateStr);
    const completedCount = dayQuests.filter((q) => q.status === 'done').length;

    if (completedCount === 0 && dayQuests.length > 0) {
      consecutiveMissedDays++;
    } else {
      break;
    }
  }

  return consecutiveMissedDays >= 2;
}

export function getWeeklyStats(quests: Quest[], startDate: Date): {
  shipped: number;
  sold: number;
  invoiced: number;
  total: number;
  completed: number;
} {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);

  const weekQuests = quests.filter((q) => {
    const questDate = new Date(q.date);
    return questDate >= startDate && questDate < endDate;
  });

  const completed = weekQuests.filter((q) => q.status === 'done');

  return {
    shipped: completed.filter((q) => q.category === 'delivery').length,
    sold: completed.filter((q) => q.category === 'revenue').length,
    invoiced: completed.filter((q) => q.tags.includes('invoice')).length,
    total: weekQuests.length,
    completed: completed.length,
  };
}
