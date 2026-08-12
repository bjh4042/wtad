import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { ActionTarget } from '@/components/apps/shared';

export interface NavigationBarProps {
  currentTargetId: string | null;
  advanceQuest: (id: string) => void;
  setRecentAppsOpen: React.Dispatch<React.SetStateAction<any>>;
  /** 홈 버튼: 기존 상태 초기화 묶음을 그대로 전달받는다 */
  onHome: () => void;
}

export default function NavigationBar({ currentTargetId, advanceQuest, setRecentAppsOpen, onHome }: NavigationBarProps) {
  return (
    <div className="h-14 bg-black flex justify-around items-center px-8 sm:px-32 z-40 w-full border-t border-gray-900 shrink-0 pb-2">

      <div onClick={() => setRecentAppsOpen(true)} className="w-20 h-full flex justify-center items-center cursor-pointer opacity-70 hover:opacity-100 active:scale-90 transition-all">
        <div className="flex gap-1"><div className="w-1 h-5 bg-white rounded-full"></div><div className="w-1 h-5 bg-white rounded-full"></div><div className="w-1 h-5 bg-white rounded-full"></div></div>
      </div>

      <ActionTarget
        id="nav-home" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
        onClick={onHome}
        className="w-24 h-full flex justify-center items-center cursor-pointer opacity-70 hover:opacity-100 active:scale-90 transition-all"
      >
        <div className="w-6 h-6 border-[3px] border-white rounded-[6px]"></div>
      </ActionTarget>
      <div className="w-20 h-full flex justify-center items-center cursor-pointer opacity-70 hover:opacity-100 active:scale-90 transition-all">
        <ChevronLeft size={28} strokeWidth={3} className="text-white" />
      </div>
    </div>
  );
}
