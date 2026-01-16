'use client';

import {
  LocalStoreData,
  INITIAL_STORE_DATA,
  Quest,
  DayState,
  UserSettings,
} from './types';

const STORE_KEY = 'karma-task-rpg-store';

function migrateData(data: LocalStoreData): LocalStoreData {
  // Future migrations can be added here
  // Example: if (data.version === 1) { data = migrateV1toV2(data); }
  return data;
}

export function loadStore(): LocalStoreData {
  if (typeof window === 'undefined') {
    return INITIAL_STORE_DATA;
  }

  try {
    const stored = localStorage.getItem(STORE_KEY);
    if (!stored) {
      return INITIAL_STORE_DATA;
    }

    const data = JSON.parse(stored) as LocalStoreData;
    return migrateData(data);
  } catch {
    console.error('Failed to load store from localStorage');
    return INITIAL_STORE_DATA;
  }
}

export function saveStore(data: LocalStoreData): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save store to localStorage', error);
  }
}

export function updateSettings(settings: Partial<UserSettings>): LocalStoreData {
  const store = loadStore();
  store.settings = { ...store.settings, ...settings };
  saveStore(store);
  return store;
}

export function addQuest(quest: Quest): LocalStoreData {
  const store = loadStore();
  store.quests.push(quest);
  saveStore(store);
  return store;
}

export function updateQuest(id: string, updates: Partial<Quest>): LocalStoreData {
  const store = loadStore();
  const index = store.quests.findIndex((q) => q.id === id);
  if (index !== -1) {
    store.quests[index] = { ...store.quests[index], ...updates };
  }
  saveStore(store);
  return store;
}

export function deleteQuest(id: string): LocalStoreData {
  const store = loadStore();
  store.quests = store.quests.filter((q) => q.id !== id);
  saveStore(store);
  return store;
}

export function completeQuest(id: string): LocalStoreData {
  const store = loadStore();
  const index = store.quests.findIndex((q) => q.id === id);
  if (index !== -1) {
    store.quests[index].status = 'done';
    store.quests[index].completedAt = new Date().toISOString();
    store.hasCompletedQuest = true;
  }
  saveStore(store);
  return store;
}

export function getDayState(date: string): DayState | undefined {
  const store = loadStore();
  return store.dayStates.find((d) => d.date === date);
}

export function setDayState(dayState: DayState): LocalStoreData {
  const store = loadStore();
  const index = store.dayStates.findIndex((d) => d.date === dayState.date);
  if (index !== -1) {
    store.dayStates[index] = dayState;
  } else {
    store.dayStates.push(dayState);
  }
  saveStore(store);
  return store;
}

export function setSignupPromptDismissed(): LocalStoreData {
  const store = loadStore();
  store.signupPromptDismissed = true;
  saveStore(store);
  return store;
}

export function markAsLinked(userId: string): LocalStoreData {
  const store = loadStore();
  store.linkedUserId = userId;
  store.lastSyncTimestamp = new Date().toISOString();
  saveStore(store);
  return store;
}

export function clearStore(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(STORE_KEY);
}

export function exportStoreAsJson(): string {
  const store = loadStore();
  return JSON.stringify(store, null, 2);
}

export function importStoreFromJson(json: string): boolean {
  try {
    const data = JSON.parse(json) as LocalStoreData;
    if (!data.version || !data.settings) {
      throw new Error('Invalid store data');
    }
    saveStore(migrateData(data));
    return true;
  } catch {
    console.error('Failed to import store data');
    return false;
  }
}
