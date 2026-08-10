import { useCallback, useEffect, useRef, useState } from 'react';
import { QUESTS } from '@/data/quests';
import type { Quest } from '@/types/quest';

export interface RewardToast {
  exp: number;
  key: number;
}

/**
 * 퀘스트 진행 엔진.
 * - questIdx(배열 인덱스) <-> questId 매핑
 * - 완료 처리 / 다음 퀘스트 이동 / EXP 지급
 * - 중복 완료 및 중복 EXP 방지
 * - 마지막(요약) 퀘스트 자동 완료
 * 문구·EXP·targetId·순서는 src/data/quests.ts 값을 그대로 사용한다.
 */
export const useQuestEngine = () => {
  const [questIdx, setQuestIdx] = useState<number>(0);
  const [exp, setExp] = useState<number>(0);
  /** 완료 퀘스트의 배열 인덱스 목록 */
  const [completedQuests, setCompletedQuests] = useState<number[]>([]);

  // 리워드 효과
  const [confettiKey, setConfettiKey] = useState(0);
  const [rewardToast, setRewardToast] = useState<RewardToast | null>(null);
  const [levelUpFlash, setLevelUpFlash] = useState(0);
  const prevLevelRef = useRef<number>(1);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuest: Quest | undefined = QUESTS[questIdx];
  const currentTargetId = currentQuest?.targetId;
  const currentQuestId = currentQuest?.id ?? 0;
  const level = Math.floor(exp / 100) + 1;

  useEffect(() => {
    prevLevelRef.current = Math.max(prevLevelRef.current, Math.floor(exp / 100) + 1);
  }, [exp]);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const grantReward = useCallback((gained: number) => {
    setExp((prev) => {
      const newExp = prev + gained;
      const newLevel = Math.floor(newExp / 100) + 1;
      if (newLevel > prevLevelRef.current) {
        prevLevelRef.current = newLevel;
        setLevelUpFlash((f) => f + 1);
      }
      return newExp;
    });
    setConfettiKey((k) => k + 1);
    setRewardToast({ exp: gained, key: Date.now() });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setRewardToast(null), 3400);
  }, []);

  /** targetId 가 현재 퀘스트와 일치할 때만 완료 처리 후 다음으로 이동 */
  const advanceQuest = useCallback((targetId: string) => {
    if (QUESTS[questIdx]?.targetId !== targetId) return;
    // 중복 완료 방지 가드: 이미 완료된 퀘스트면 EXP 재지급 없이 인덱스만 이동
    if (completedQuests.includes(questIdx)) {
      setQuestIdx((q) => Math.min(q + 1, QUESTS.length - 1));
      return;
    }
    grantReward(QUESTS[questIdx]?.exp ?? 0);
    setCompletedQuests((prev) => (prev.includes(questIdx) ? prev : [...prev, questIdx]));
    setQuestIdx((q) => Math.min(q + 1, QUESTS.length - 1));
  }, [questIdx, completedQuests, grantReward]);

  // 마지막(요약) 미션 자동 완료 및 최종 경험치 지급
  useEffect(() => {
    const lastIdx = QUESTS.length - 1;
    if (questIdx !== lastIdx) return;
    if (QUESTS[lastIdx]?.targetId !== null) return;
    if (completedQuests.includes(lastIdx)) return;
    grantReward(QUESTS[lastIdx]?.exp ?? 0);
    setCompletedQuests((prev) => (prev.includes(lastIdx) ? prev : [...prev, lastIdx]));
  }, [questIdx, completedQuests, grantReward]);

  /** 완료한 퀘스트 범위 안에서만 이동 */
  const gotoQuest = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(QUESTS.length - 1, idx));
    setQuestIdx((cur) => {
      if (clamped > cur && !completedQuests.includes(cur)) return cur;
      return clamped;
    });
  }, [completedQuests]);

  const resetQuestProgress = useCallback(() => {
    prevLevelRef.current = 1;
    setQuestIdx(0);
    setExp(0);
    setCompletedQuests([]);
    setRewardToast(null);
  }, []);

  return {
    questIdx, setQuestIdx,
    exp, setExp,
    completedQuests, setCompletedQuests,
    currentQuest, currentQuestId, currentTargetId,
    level,
    advanceQuest, gotoQuest, resetQuestProgress,
    confettiKey, rewardToast, levelUpFlash,
  };
};
