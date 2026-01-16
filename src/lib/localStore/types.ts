export type QuestCategory = 'revenue' | 'delivery' | 'ops';
export type QuestStatus = 'todo' | 'done';
export type QuestSource = 'generated' | 'manual';

export interface Quest {
  id: string;
  date: string; // YYYY-MM-DD
  category: QuestCategory;
  title: string;
  mvwTitle: string; // Minimum Viable Work title (10-20 min version)
  status: QuestStatus;
  source: QuestSource;
  tags: string[];
  createdAt: string;
  completedAt: string | null;
}

export interface DayState {
  date: string;
  shield: boolean;
  recovery: boolean;
}

export interface UserSettings {
  niche: string;
  goals: {
    pitchesPerWeek: number;
    deepWorkBlocksPerWeek: number;
    invoicesPerWeek: number;
  };
  onboardingComplete: boolean;
}

export interface LocalStoreData {
  version: number;
  settings: UserSettings;
  quests: Quest[];
  dayStates: DayState[];
  hasCompletedQuest: boolean;
  signupPromptDismissed: boolean;
  linkedUserId: string | null;
  lastSyncTimestamp: string | null;
}

export const DEFAULT_SETTINGS: UserSettings = {
  niche: 'Freelance Writer',
  goals: {
    pitchesPerWeek: 5,
    deepWorkBlocksPerWeek: 10,
    invoicesPerWeek: 2,
  },
  onboardingComplete: false,
};

export const INITIAL_STORE_DATA: LocalStoreData = {
  version: 1,
  settings: DEFAULT_SETTINGS,
  quests: [],
  dayStates: [],
  hasCompletedQuest: false,
  signupPromptDismissed: false,
  linkedUserId: null,
  lastSyncTimestamp: null,
};

export const NICHE_PRESETS = [
  'Freelance Writer',
  'Freelance Designer',
  'Web Developer',
  'Marketing Consultant',
  'Virtual Assistant',
  'Video Editor',
  'Social Media Manager',
  'SEO Specialist',
  'Copywriter',
  'Business Coach',
];
