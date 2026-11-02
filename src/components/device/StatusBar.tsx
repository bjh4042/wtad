import React from 'react';
import { ActionTarget } from '@/components/apps/shared';
import type { NotificationItem } from '@/components/device/HomeScreen';

export interface StatusBarProps {
  currentTargetId: string | null;
  advanceQuest: (id: string) => void;
  quickPanelOpen: boolean;
  setQuickPanelOpen: React.Dispatch<React.SetStateAction<any>>;
  handleSwipeStart: (e: any) => void;
  setPanelMode?: React.Dispatch<React.SetStateAction<any>>;
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
    <svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m11 5-4 3.5H3.5v7H7L11 19V5Z" />
      <path d="m16 9 5 6m0-6-5 6" />
    </svg>
  );
}

/** One UI 7+ displays the percentage inside the compact battery capsule. */
function IconBattery() {
  return (
    <svg width="28" height={ICON} viewBox="0 0 30 16" role="img" aria-label="배터리 98퍼센트">
      <rect x="0" y="1" width="30" height="14" rx="7" fill="currentColor" />
      <text x="15" y="11.4" textAnchor="middle" fontSize="10.4" fontWeight="700" fontFamily="Arial, sans-serif" fill="#35363a">98</text>
    </svg>
  );
}

export interface StatusIconsProps {
  airplane: boolean;
  wifiConnected: string | null;
  bluetooth: boolean;
  soundMode: string;
}

/** 상태 아이콘 묶음 (상태표시줄 / 잠금화면 공용) */
export function StatusIcons({ airplane, wifiConnected, bluetooth, soundMode }: StatusIconsProps) {
  return (
    <div className="flex items-center text-white/95" style={{ gap: 'var(--oneui-icon-gap)' }}>
      {airplane && <IconAirplane />}
      {wifiConnected && <IconWifi />}
      {bluetooth && <IconBluetooth />}
      {soundMode === 'vibrate' && <IconVibrate />}
      {soundMode === 'mute' && <IconMute />}
      <IconBattery />
    </div>
  );
}

export default function StatusBar({
  currentTargetId, advanceQuest, quickPanelOpen, setQuickPanelOpen, handleSwipeStart, setPanelMode,
  timeStr, notifications, airplane, wifiConnected, bluetooth, soundMode,
}: StatusBarProps) {
  const openPanel = (mode: 'quick' | 'notifications') => {
    setPanelMode?.(mode);
    setQuickPanelOpen(true);
    advanceQuest(mode === 'quick' ? 'swipe-trigger' : 'notification-trigger');
  };
  return (
    <div className="oneui absolute top-0 w-full oneui-statusbar flex items-center text-white z-[80] select-none"
      style={{ paddingLeft: 'var(--oneui-screen-pad)', paddingRight: 'var(--oneui-screen-pad)' }}>
      <ActionTarget id="notification-trigger" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
        disableClickAdvance onTouchStart={handleSwipeStart} onMouseDown={handleSwipeStart}
        className="h-full flex-1" tooltipPosition="bottom" tooltipText="왼쪽 위에서 아래로 밀어 알림 열기">
        <button type="button" aria-label="알림 열기, 화면 왼쪽 위" onClick={() => openPanel('notifications')}
          className="h-full w-full flex items-center gap-1.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
          <span className="text-[12px] font-semibold tabular-nums">{timeStr}</span>
          {notifications.length > 0 && <span className="w-[5px] h-[5px] rounded-full bg-white/90" />}
        </button>
      </ActionTarget>
      <ActionTarget id="swipe-trigger" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
        disableClickAdvance onTouchStart={handleSwipeStart} onMouseDown={handleSwipeStart}
        className="h-full flex-1" tooltipPosition="bottom" tooltipText="오른쪽 위에서 아래로 밀어 빠른 설정 열기">
        <button type="button" aria-label="빠른 설정 열기, 화면 오른쪽 위" onClick={() => openPanel('quick')}
          className="h-full w-full flex justify-end items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
          <StatusIcons airplane={airplane} wifiConnected={wifiConnected} bluetooth={bluetooth} soundMode={soundMode} />
        </button>
      </ActionTarget>
    </div>
  );
}
