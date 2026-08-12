import React from 'react';
import { ActionTarget } from '@/components/apps/shared';

export interface NavigationBarProps {
  currentTargetId: string | null;
  advanceQuest: (id: string) => void;
  setRecentAppsOpen: React.Dispatch<React.SetStateAction<any>>;
  /** 홈 버튼: 기존 상태 초기화 묶음을 그대로 전달받는다 */
  onHome: () => void;
  /** 향후 gesture navigation 확장을 위한 자리 (이번 턴에서는 'buttons'만 사용) */
  mode?: 'buttons' | 'gestures';
}

const HIT = 'w-14 h-full flex justify-center items-center cursor-pointer oneui-press md:hover:opacity-80';

/** One UI 3버튼: 최근 앱 · 홈 · 뒤로가기 */
export default function NavigationBar({
  currentTargetId, advanceQuest, setRecentAppsOpen, onHome, mode = 'buttons',
}: NavigationBarProps) {
  if (mode !== 'buttons') return null;

  return (
    <div className="oneui oneui-navbar w-full shrink-0 bg-black flex justify-center items-center gap-16 sm:gap-24 md:gap-32 z-40 select-none">
      {/* 최근 앱 */}
      <div onClick={() => setRecentAppsOpen(true)} className={HIT} title="최근 앱">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          <path d="M5 5v14M12 5v14M19 5v14" />
        </svg>
      </div>

      {/* 홈 */}
      <ActionTarget
        id="nav-home" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
        onClick={onHome}
        className={HIT}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" aria-hidden="true">
          <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.4" />
        </svg>
      </ActionTarget>

      {/* 뒤로가기 */}
      <div className={HIT} title="뒤로">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 5.5 8 12l7 6.5" />
        </svg>
      </div>
    </div>
  );
}
