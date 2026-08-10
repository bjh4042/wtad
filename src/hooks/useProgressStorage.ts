import { useEffect, useRef, useState } from 'react';
import { QUESTS, questIndexById } from '@/data/quests';
import { DEFAULT_HOME_APPS, DEFAULT_WALLPAPER, DEFAULT_WIDGETS, emptyHomePage } from '@/data/homeDefaults';

/** 기존 키 유지 (마이그레이션 대상 데이터와 동일 키) */
export const LS_KEY = 'android-explorer-v2';

export interface ProgressSnapshot {
  /** 현재 퀘스트의 배열 인덱스 (저장 시 questId 로 변환) */
  questIdx: number;
  exp: number;
  /** 완료 퀘스트의 배열 인덱스 목록 (저장 시 questId 목록으로 변환) */
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

const readRaw = (): any => {
  if (typeof window === 'undefined') return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const toNumber = (v: unknown, fallback: number): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * 저장 데이터를 읽어 현재 QUESTS 배열 기준으로 정규화한다.
 * - 신규 구조: currentQuestId / completedQuestIds (id 기반)
 * - 레거시 구조: questIdx / completedQuests (인덱스 기반). 당시 배열은 id 순서(0..103)와
 *   동일했으므로 값을 그대로 questId 로 해석해 현재 인덱스로 변환한다.
 * - 존재하지 않는 questId 는 제거한다.
 */
export const loadProgress = (): ProgressSnapshot => {
  const saved = readRaw();

  const rawCompletedIds: unknown[] = Array.isArray(saved.completedQuestIds)
    ? saved.completedQuestIds
    : Array.isArray(saved.completedQuests)
      ? saved.completedQuests
      : [];

  const completedQuests = Array.from(
    new Set(
      rawCompletedIds
        .map((id) => questIndexById(Number(id)))
        .filter((idx) => idx >= 0),
    ),
  ).sort((a, b) => a - b);

  const savedQuestId = saved.currentQuestId ?? saved.questIdx ?? 0;
  const questIdxRaw = questIndexById(Number(savedQuestId));
  const questIdx = questIdxRaw >= 0 ? Math.min(questIdxRaw, QUESTS.length - 1) : 0;

  const homePages: (string | null)[][] = Array.isArray(saved.homePages) && saved.homePages.length
    ? saved.homePages
    : Array.isArray(saved.homeApps)
      ? [saved.homeApps, emptyHomePage()]
      : [DEFAULT_HOME_APPS, emptyHomePage()];

  const widgetPages: string[][] = Array.isArray(saved.widgetPages) && saved.widgetPages.length
    ? saved.widgetPages
    : Array.isArray(saved.widgets)
      ? [saved.widgets, []]
      : DEFAULT_WIDGETS;

  return {
    questIdx,
    exp: Math.max(0, toNumber(saved.exp, 0)),
    completedQuests,
    installedApps: Array.isArray(saved.installedApps) ? saved.installedApps : [],
    homePages,
    widgetPages,
    widgetSizes: saved.widgetSizes && typeof saved.widgetSizes === 'object' ? saved.widgetSizes : {},
    wallpaper: typeof saved.wallpaper === 'string' ? saved.wallpaper : DEFAULT_WALLPAPER,
    darkMode: !!saved.darkMode,
    fontScale: toNumber(saved.fontScale, 1),
    themeColor: typeof saved.themeColor === 'string' ? saved.themeColor : '#3b82f6',
  };
};

/** id 기반으로 저장 (배열 순서가 바뀌어도 진행도 유지) */
export const saveProgress = (s: ProgressSnapshot): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({
        currentQuestId: QUESTS[s.questIdx]?.id ?? 0,
        completedQuestIds: s.completedQuests
          .map((idx) => QUESTS[idx]?.id)
          .filter((id): id is number => typeof id === 'number'),
        exp: s.exp,
        installedApps: s.installedApps,
        homePages: s.homePages,
        widgetPages: s.widgetPages,
        widgetSizes: s.widgetSizes,
        wallpaper: s.wallpaper,
        darkMode: s.darkMode,
        fontScale: s.fontScale,
        themeColor: s.themeColor,
      }),
    );
  } catch {}
};

export const clearProgress = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LS_KEY);
  } catch {}
};

/**
 * 마운트 시 1회 로드(+마이그레이션)하고, 이후 스냅샷 변경 시 저장한다.
 * localStorage 접근은 모두 useEffect 내부이므로 SSR 안전.
 */
export const useProgressStorage = (
  snapshot: ProgressSnapshot,
  apply: (loaded: ProgressSnapshot) => void,
) => {
  const [isStorageReady, setIsStorageReady] = useState(false);
  const applyRef = useRef(apply);
  applyRef.current = apply;

  useEffect(() => {
    applyRef.current(loadProgress());
    setIsStorageReady(true);
  }, []);

  const serialized = JSON.stringify(snapshot);
  useEffect(() => {
    if (!isStorageReady) return;
    saveProgress(snapshot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStorageReady, serialized]);

  return { isStorageReady };
};
