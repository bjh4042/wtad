import React from 'react';
import { ActionTarget } from '@/components/apps/shared';
import type { NotificationItem } from '@/components/device/HomeScreen';

export interface StatusBarProps {
  currentTargetId: string | null;
  advanceQuest: (id: string) => void;
  quickPanelOpen: boolean;
  setQuickPanelOpen: React.Dispatch<React.SetStateAction<any>>;
  handleSwipeStart: (e: any) => void;
  timeStr: string;
  notifications: NotificationItem[];
  airplane: boolean;
  wifiConnected: string | null;
  bluetooth: boolean;
  soundMode: string;
}

/** One UI 시스템 아이콘 (Samsung 시스템 아이콘에 가깝게 단순화한 자체 SVG) */
const ICON = 15;

function IconWifi() {
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 19.2a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z" />
      <path d="M12 10.4c2 0 3.9.8 5.3 2.1l1.5-1.6A10 10 0 0 0 12 8.2a10 10 0 0 0-6.8 2.7l1.5 1.6A7.6 7.6 0 0 1 12 10.4Z" />
      <path d="M12 4.6c3.5 0 6.7 1.4 9 3.6l1.5-1.6A14.5 14.5 0 0 0 12 2.6C7.9 2.6 4.1 4.2 1.5 6.6L3 8.2c2.3-2.2 5.5-3.6 9-3.6Z" />
    </svg>
  );
}

function IconBluetooth() {
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v18l5-4.8L7.5 8.4M12 3l5 4.8L7.5 15.6" />
    </svg>
  );
}

function IconAirplane() {
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 15.5v-1.7l-7.2-4V4.4a1.3 1.3 0 0 0-2.6 0v5.4l-7.2 4v1.7l7.2-2.2v4.1l-2 1.4V20l3.3-.9 3.3.9v-1.2l-2-1.4v-4.1L21 15.5Z" />
    </svg>
  );
}

function IconVibrate() {
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5h8c.8 0 1.5.7 1.5 1.5v10c0 .8-.7 1.5-1.5 1.5H8c-.8 0-1.5-.7-1.5-1.5V7c0-.8.7-1.5 1.5-1.5Zm0 1.4a.1.1 0 0 0-.1.1v10c0 .1 0 .1.1.1h8a.1.1 0 0 0 .1-.1V7a.1.1 0 0 0-.1-.1H8Z" />
      <path d="M3 9h1.3v6H3zM19.7 9H21v6h-1.3z" />
    </svg>
  );
}

function IconMute() {
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11 4.8 6.8 8.4H3.6v7.2h3.2L11 19.2V4.8Z" />
      <path d="M15 9.3l1-1 4.2 4.2-1 1L15 9.3Z" transform="translate(-0.6 -0.4)" />
      <path d="M19.8 9.5l-1-1L14.6 12.7l1 1 4.2-4.2Z" />
      <path d="M14.6 9.5l-1 1 4.2 4.2 1-1-4.2-4.2Z" />
    </svg>
  );
}

function IconBattery() {
  return (
    <svg width="24" height={ICON} viewBox="0 0 26 14" fill="none" aria-hidden="true">
      <rect x="0.9" y="1.6" width="21.5" height="10.8" rx="2.6" stroke="currentColor" strokeWidth="1.3" opacity="0.9" />
      <rect x="2.6" y="3.3" width="18.1" height="7.4" rx="1.5" fill="currentColor" />
      <path d="M24 5.2c.9.3 1.5 1 1.5 1.8s-.6 1.5-1.5 1.8V5.2Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
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
        className="oneui absolute top-0 w-full oneui-statusbar flex justify-between items-center text-white cursor-ns-resize z-[80] select-none"
        style={{ paddingLeft: 'var(--oneui-screen-pad)', paddingRight: 'var(--oneui-screen-pad)' }}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-semibold tracking-[-0.01em] tabular-nums">{timeStr}</span>
          {notifications.length > 0 && (
            <span className="w-[5px] h-[5px] rounded-full bg-white/90" />
          )}
        </div>
        <div className="flex items-center text-white/95" style={{ gap: 'var(--oneui-icon-gap)' }}>
          {airplane && <IconAirplane />}
          {!airplane && wifiConnected && <IconWifi />}
          {bluetooth && <IconBluetooth />}
          {soundMode === 'vibrate' && <IconVibrate />}
          {soundMode === 'mute' && <IconMute />}
          <span className="text-[11px] font-semibold tabular-nums ml-0.5">98%</span>
          <IconBattery />
        </div>
      </ActionTarget>

      {currentTargetId === 'swipe-trigger' && (
        <div className="absolute top-9 left-1/2 -translate-x-1/2 z-[110] pointer-events-none flex flex-col items-center oneui-hint-up">
          <div className="w-0.5 h-8 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 border-r-[3px] border-b-[3px] border-yellow-400 rotate-45 -mt-1.5"></div>
        </div>
      )}
    </>
  );
}
