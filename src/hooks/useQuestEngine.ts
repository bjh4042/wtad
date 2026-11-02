import { useCallback, useEffect, useRef, useState, type SetStateAction } from 'react';
import { QUESTS } from '@/data/quests';
import type { Quest } from '@/types/quest';

export interface RewardToast { exp: number; key: number; }

/** The first unfinished lesson is the only unfinished lesson a learner can open. */
export const getQuestFrontier = (completed: readonly number[]): number => {
  const done = new Set(completed);
  const first = QUESTS.findIndex((_, index) => !done.has(index));
  return first < 0 ? QUESTS.length - 1 : first;
};

export const canVisitQuest = (index: number, completed: readonly number[]): boolean =>
  Number.isInteger(index) && index >= 0 && index < QUESTS.length &&
  (completed.includes(index) || index === getQuestFrontier(completed));

/** Outcome events advance one lesson; duplicate events cannot award duplicate EXP. */
export const useQuestEngine = () => {
  const [questIdx, updateQuestIdx] = useState(0);
  const [exp, updateExp] = useState(0);
  const [completedQuests, updateCompleted] = useState<number[]>([]);
  const questRef = useRef(0);
  const expRef = useRef(0);
  const completedRef = useRef<number[]>([]);
  const [confettiKey, setConfettiKey] = useState(0);
  const [rewardToast, setRewardToast] = useState<RewardToast | null>(null);
  const [levelUpFlash, setLevelUpFlash] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // These compatible setters also cover the existing storage hydration API.
  const setQuestIdx = useCallback((action: SetStateAction<number>) => {
    const value = typeof action === 'function' ? action(questRef.current) : action;
    questRef.current = Math.max(0, Math.min(QUESTS.length - 1, Math.floor(value) || 0));
    updateQuestIdx(questRef.current);
  }, []);
  const setExp = useCallback((action: SetStateAction<number>) => {
    const value = typeof action === 'function' ? action(expRef.current) : action;
    expRef.current = Number.isFinite(value) ? Math.max(0, value) : 0;
    updateExp(expRef.current);
  }, []);
  const setCompletedQuests = useCallback((action: SetStateAction<number[]>) => {
    const value = typeof action === 'function' ? action(completedRef.current) : action;
    completedRef.current = [...new Set(value.filter(index => Number.isInteger(index) && index >= 0 && index < QUESTS.length))].sort((a,b) => a-b);
    updateCompleted(completedRef.current);
  }, []);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const grantReward = useCallback((gained: number) => {
    const previousLevel = Math.floor(expRef.current / 100) + 1;
    const nextExp = expRef.current + gained;
    setExp(nextExp);
    if (Math.floor(nextExp / 100) + 1 > previousLevel) setLevelUpFlash(value => value + 1);
    setConfettiKey(value => value + 1);
    setRewardToast({ exp: gained, key: Date.now() });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setRewardToast(null), 3400);
  }, [setExp]);

  const advanceQuest = useCallback((targetId: string) => {
    // A stale handler (including a bubbling second click) belongs to the prior lesson.
    if (questRef.current !== questIdx || QUESTS[questIdx]?.targetId !== targetId) return;
    if (!canVisitQuest(questIdx, completedRef.current)) return;
    if (!completedRef.current.includes(questIdx)) {
      setCompletedQuests([...completedRef.current, questIdx]);
      grantReward(QUESTS[questIdx].exp);
    }
    const next = Math.min(questIdx + 1, QUESTS.length - 1);
    setQuestIdx(canVisitQuest(next, completedRef.current) ? next : getQuestFrontier(completedRef.current));
  }, [questIdx, grantReward, setCompletedQuests, setQuestIdx]);

  useEffect(() => {
    const lastIdx = QUESTS.length - 1;
    if (!canVisitQuest(questIdx, completedRef.current)) {
      setQuestIdx(getQuestFrontier(completedRef.current));
      return;
    }
    if (questIdx !== lastIdx || QUESTS[lastIdx]?.targetId !== null) return;
    // Imported/legacy saves and review navigation must never unlock a false finish.
    if (getQuestFrontier(completedRef.current) !== lastIdx) {
      setQuestIdx(getQuestFrontier(completedRef.current));
      return;
    }
    if (completedRef.current.includes(lastIdx)) return;
    setCompletedQuests([...completedRef.current, lastIdx]);
    grantReward(QUESTS[lastIdx].exp);
  }, [questIdx, completedQuests, grantReward, setCompletedQuests, setQuestIdx]);

  const gotoQuest = useCallback((index: number) => {
    if (canVisitQuest(index, completedRef.current)) setQuestIdx(index);
  }, [setQuestIdx]);

  const resetQuestProgress = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setQuestIdx(0); setExp(0); setCompletedQuests([]); setRewardToast(null);
  }, [setQuestIdx, setExp, setCompletedQuests]);

  const currentQuest: Quest | undefined = QUESTS[questIdx];
  return {
    questIdx, setQuestIdx, exp, setExp, completedQuests, setCompletedQuests,
    currentQuest, currentQuestId: currentQuest?.id ?? 0,
    currentTargetId: currentQuest?.targetId ?? null, level: Math.floor(exp / 100) + 1,
    advanceQuest, gotoQuest, resetQuestProgress, confettiKey, rewardToast, levelUpFlash,
  };
};
