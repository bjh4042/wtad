import React from 'react';
import { Wifi, Bluetooth, Vibrate, VolumeX, Signal, Plane, Bell, Zap } from 'lucide-react';
import { ActionTarget } from '@/components/apps/shared';
import type { NotificationItem } from '@/components/device/HomeScreen';

export interface StatusBarProps {
  currentTargetId: string | null;
  advanceQuest: (id: string) => void;
  quickPanelOpen: boolean;
  setQuickPanelOpen: (v: any) => void;
  handleSwipeStart: (e: any) => void;
  timeStr: string;
  notifications: NotificationItem[];
  airplane: boolean;
  wifiConnected: string | null;
  bluetooth: boolean;
  soundMode: string;
}

export default function StatusBar({
  currentTargetId, advanceQuest, quickPanelOpen, setQuickPanelOpen, handleSwipeStart,
  timeStr, notifications, airplane, wifiConnected, bluetooth, soundMode,
}: StatusBarProps) {
  return (
    <>
      <ActionTarget
        id="swipe-trigger" currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance={true}
        onTouchStart={handleSwipeStart} onMouseDown={handleSwipeStart}
        onClick={() => { if (!quickPanelOpen) { setQuickPanelOpen(true); advanceQuest('swipe-trigger'); } }}
        tooltipPosition="bottom"
        tooltipText="↓ 아래로 드래그(또는 탭)하세요"
        className="absolute top-0 w-full h-8 px-6 flex justify-between items-center text-white text-sm cursor-ns-resize z-[80] select-none bg-gradient-to-b from-black/40 to-transparent"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold drop-shadow-md tracking-tight">{timeStr}</span>
          {notifications.length > 0 && (
            <div className="flex items-center gap-1 bg-red-500/90 px-1.5 rounded-full text-[10px] font-bold leading-none py-0.5">
              <Bell size={9} strokeWidth={3}/> {notifications.length}
            </div>
          )}
        </div>
        <div className="flex space-x-1.5 items-center drop-shadow-md">
          {airplane && <Plane size={14} strokeWidth={2.5} />}
          {wifiConnected && !airplane && <Wifi size={14} strokeWidth={2.5} />}
          {bluetooth && <Bluetooth size={14} strokeWidth={2.5} />}
          {soundMode === 'vibrate' && <Vibrate size={14} strokeWidth={2.5} />}
          {soundMode === 'mute' && <VolumeX size={14} strokeWidth={2.5} />}
          {!airplane && (
            <>
              <Signal size={14} strokeWidth={2.5} />
              <span className="text-[10px] font-bold tracking-wider">LTE</span>
            </>
          )}
          <span className="text-[11px] font-bold ml-1 tabular-nums">98%</span>
          {/* 배터리 아이콘 — 깔끔한 캡슐 형태 + 충전 번개 */}
          <div className="relative flex items-center ml-0.5">
            <div className="relative w-[26px] h-[12px] border-[1.5px] border-white/95 rounded-[3px] p-[1.5px] bg-transparent">
              <div className="h-full bg-white rounded-[1.5px]" style={{ width: '92%' }}></div>
              <Zap size={8} strokeWidth={3} className="absolute inset-0 m-auto text-[#0f172a] fill-[#0f172a]" />
            </div>
            <div className="w-[2px] h-[5px] bg-white/95 rounded-r-[1px] -ml-px"></div>
          </div>
        </div>
      </ActionTarget>

      {currentTargetId === 'swipe-trigger' && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[110] pointer-events-none flex flex-col items-center animate-bounce">
          <div className="w-1 h-10 bg-yellow-400 rounded-full"></div>
          <div className="w-4 h-4 border-r-4 border-b-4 border-yellow-400 rotate-45 -mt-2"></div>
        </div>
      )}
    </>
  );
}
