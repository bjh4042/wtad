import { useEffect, useRef, useState } from 'react';
import { QUESTS, questIndexById } from '@/data/quests';
import { DEFAULT_HOME_APPS, DEFAULT_WALLPAPER, DEFAULT_WIDGETS, emptyHomePage } from '@/data/homeDefaults';
import { PLAYSTORE_APPS, WIDGET_CATALOG } from '@/data/appCatalog';

/** Stable key; formatVersion distinguishes newly validated saves. */
export const LS_KEY = 'android-explorer-v2';
const FORMAT_VERSION = 3;
const APP_IDS = new Set([...DEFAULT_HOME_APPS.filter((id): id is string => typeof id === 'string'), ...PLAYSTORE_APPS.map(app => app.id), 'math']);
const WIDGET_IDS = new Set(WIDGET_CATALOG.map(widget => widget.id));
/** Uploaded legacy array: Bluetooth confirmation (ID 75) was inserted at index 39. */
export const LEGACY_QUEST_IDS = [
  ...Array.from({ length: 39 }, (_, index) => index), 75,
  ...Array.from({ length: 36 }, (_, index) => index + 39),
  ...Array.from({ length: 28 }, (_, index) => index + 76),
];
export interface ProgressSnapshot {
  questIdx: number;
  exp: number;
  completedQuests: number[];
  installedApps: string[];
  homePages: (string | null)[][];
  widgetPages: string[][];
  widgetSizes: Record<string, 'sm' | 'md' | 'lg'>;
  wallpaper: string;
  darkMode: boolean;
  fontScale: number;
  themeColor: string;
}
const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const integer = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value);
const finiteNumber = (value: unknown, fallback: number) => typeof value === 'number' && Number.isFinite(value) ? value : fallback;
const safeWallpaper = (value: unknown) => typeof value === 'string' && value.length <= 2000 && !/url\s*\(|[;{}<>]|javascript/i.test(value) && (/^#[a-f\d]{3,8}$/i.test(value) || /^(?:radial|linear)-gradient\(/.test(value)) ? value : DEFAULT_WALLPAPER;

/** Pure normalization is shared by the loader and regression checks. */
export const normalizeProgressData = (input: unknown): ProgressSnapshot => {
  const saved = isRecord(input) ? input : {};
  const hasIds = Array.isArray(saved.completedQuestIds);
  const rawCompleted = hasIds ? saved.completedQuestIds as unknown[] : Array.isArray(saved.completedQuests) ? saved.completedQuests : [];
  const completedQuests = [...new Set(rawCompleted.slice(0, QUESTS.length + 104)
    .filter(integer)
    .map(value => hasIds ? value : LEGACY_QUEST_IDS[value])
    .filter((id): id is number => typeof id === 'number')
    .map(questIndexById).filter(index => index >= 0))].sort((a, b) => a - b);
  // An old finish screen does not prove completion of newly added practical lessons.
  const done = new Set(completedQuests);
  const summaryIndex = QUESTS.findIndex(quest => quest.targetId === null);
  if (summaryIndex >= 0 && QUESTS.some((quest, index) => quest.targetId !== null && !done.has(index))) done.delete(summaryIndex);
  const safeCompleted = completedQuests.filter(index => done.has(index));
  const firstUnfinished = QUESTS.findIndex((_, index) => !done.has(index));
  const frontier = firstUnfinished < 0 ? QUESTS.length - 1 : firstUnfinished;
  const savedId = integer(saved.currentQuestId) ? saved.currentQuestId : integer(saved.questIdx) ? LEGACY_QUEST_IDS[saved.questIdx] : undefined;
  const requestedIndex = savedId === undefined ? -1 : questIndexById(savedId);
  const questIdx = requestedIndex >= 0 && (done.has(requestedIndex) || requestedIndex === frontier) ? requestedIndex : frontier;

  const rawPages = Array.isArray(saved.homePages) && saved.homePages.some(Array.isArray) ? saved.homePages : Array.isArray(saved.homeApps) ? [saved.homeApps, emptyHomePage()] : [DEFAULT_HOME_APPS, emptyHomePage()];
  const homePages = rawPages.slice(0, 8).map(page => Array.from({ length: 40 }, (_, index) => Array.isArray(page) && typeof page[index] === 'string' && APP_IDS.has(page[index]) ? page[index] : null));
  const rawWidgets = Array.isArray(saved.widgetPages) && saved.widgetPages.some(Array.isArray) ? saved.widgetPages : Array.isArray(saved.widgets) ? [saved.widgets, []] : DEFAULT_WIDGETS;
  const widgetPages = rawWidgets.slice(0, 8).map(page => Array.isArray(page) ? [...new Set(page.filter((id): id is string => typeof id === 'string' && WIDGET_IDS.has(id)))].slice(0, 5) : []);
  while (widgetPages.length < homePages.length) widgetPages.push([]);
  const widgetSizes: Record<string, 'sm' | 'md' | 'lg'> = {};
  if (isRecord(saved.widgetSizes)) for (const [key, size] of Object.entries(saved.widgetSizes)) {
    if (WIDGET_IDS.has(key) && (size === 'sm' || size === 'md' || size === 'lg')) widgetSizes[key] = size;
  }
  return {
    questIdx,
    exp: safeCompleted.reduce((total, index) => total + QUESTS[index].exp, 0),
    completedQuests: safeCompleted,
    installedApps: Array.isArray(saved.installedApps) ? [...new Set(saved.installedApps.filter((id): id is string => typeof id === 'string' && APP_IDS.has(id)))].slice(0, 40) : [],
    homePages,
    widgetPages,
    widgetSizes,
    wallpaper: safeWallpaper(saved.wallpaper),
    darkMode: saved.darkMode === true,
    fontScale: Math.max(0.8, Math.min(1.5, finiteNumber(saved.fontScale, 1))),
    themeColor: typeof saved.themeColor === 'string' && /^#[a-f\d]{6}$/i.test(saved.themeColor) ? saved.themeColor : '#3b82f6',
  };
};
const readProgress = (): { snapshot: ProgressSnapshot; error: string | null } => {
  if (typeof window === 'undefined') return { snapshot: normalizeProgressData({}), error: null };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { snapshot: normalizeProgressData({}), error: null };
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value)) return { snapshot: normalizeProgressData({}), error: '저장 기록의 형식이 올바르지 않아 기본 상태로 열었어요.' };
    return { snapshot: normalizeProgressData(value), error: null };
  } catch {
    return { snapshot: normalizeProgressData({}), error: '저장 기록을 읽지 못했어요. 새로고침 전에 학습 기록을 확인해 주세요.' };
  }
};
export const loadProgress = (): ProgressSnapshot => readProgress().snapshot;
/** Returns an error message so the UI never claims a failed save succeeded. */
export const saveProgress = (snapshot: ProgressSnapshot): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const completedQuestIds = [...new Set(snapshot.completedQuests.filter(integer).map(index => QUESTS[index]?.id).filter((id): id is number => typeof id === 'number'))];
    const payload = normalizeProgressData({ ...snapshot, currentQuestId: QUESTS[snapshot.questIdx]?.id ?? 0, completedQuestIds });
    localStorage.setItem(LS_KEY, JSON.stringify({
      ...payload,
      formatVersion: FORMAT_VERSION,
      currentQuestId: QUESTS[payload.questIdx]?.id ?? 0,
      completedQuestIds: payload.completedQuests.map(index => QUESTS[index].id),
      // The stable-ID fields are authoritative; omit legacy array indices.
      questIdx: undefined,
      completedQuests: undefined,
    }));
    return null;
  } catch {
    return '이 브라우저에 학습 기록을 저장하지 못했어요. 창을 닫으면 이번 진행이 사라질 수 있어요.';
  }
};
/** Only this simulator's namespaced records are cleared. */
export const clearProgress = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const keys: string[] = [];
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (key?.startsWith('android-explorer-')) keys.push(key);
    }
    keys.forEach(key => localStorage.removeItem(key));
    return null;
  } catch {
    return '저장 기록을 지우지 못했어요. 이 브라우저의 저장 권한을 확인해 주세요.';
  }
};
export const useProgressStorage = (snapshot: ProgressSnapshot, apply: (loaded: ProgressSnapshot) => void) => {
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const applyRef = useRef(apply);
  applyRef.current = apply;
  useEffect(() => {
    const loaded = readProgress();
    applyRef.current(loaded.snapshot);
    setLoadError(loaded.error);
    setIsStorageReady(true);
  }, []);
  const serialized = JSON.stringify(snapshot);
  useEffect(() => {
    if (!isStorageReady) return;
    setSaveError(saveProgress(snapshot));
    // A stable serialization avoids a save loop from the caller's inline object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStorageReady, serialized]);
  return { isStorageReady, storageError: saveError || loadError };
};
