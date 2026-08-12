import React from 'react';
import { StatusIcons } from '@/components/device/StatusBar';

export interface LockScreenProps {
  wallpaper: string;
  timeStr: string;
  dateStr: string;
  lockOffset: number;
  isDragging: boolean;
  onSwipeStart: (e: any) => void;
  currentTargetId: string | null;
  airplane: boolean;
  wifiConnected: string | null;
  bluetooth: boolean;
  soundMode: string;
}

/** Galaxy Tab One UI 잠금화면 (가로 화면 기준) */
export default function LockScreen({
  wallpaper, timeStr, dateStr, lockOffset, isDragging, onSwipeStart, currentTargetId,
  airplane, wifiConnected, bluetooth, soundMode,
}: LockScreenProps) {
  const progress = Math.min(1, lockOffset / 140);

  return (
    <div
      className="oneui absolute inset-0 z-[150] cursor-grab active:cursor-grabbing overflow-hidden"
      style={{
        background: wallpaper,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: `translateY(${-lockOffset}px)`,
        opacity: 1 - progress * 0.25,
        transition: isDragging ? 'none' : 'transform var(--oneui-duration) var(--oneui-ease), opacity var(--oneui-duration) var(--oneui-ease)',
      }}
      onMouseDown={onSwipeStart}
      onTouchStart={onSwipeStart}
    >
      {/* One UI 잠금화면 상·하단 스크림 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/45 pointer-events-none" />

      <div className="relative z-10 h-full w-full text-white">
        {/* 잠금화면 상태 표시줄 (우측 아이콘만 — 실제 One UI 동일) */}
        <div
          className="absolute top-0 left-0 right-0 oneui-statusbar flex items-center justify-end"
          style={{ paddingLeft: 'var(--oneui-screen-pad)', paddingRight: 'var(--oneui-screen-pad)' }}
        >
          <StatusIcons airplane={airplane} wifiConnected={wifiConnected} bluetooth={bluetooth} soundMode={soundMode} />
        </div>
        {/* 시계 / 날짜 — 상단 중앙 */}
        <div className="absolute left-0 right-0 top-[13%] flex flex-col items-center">
          <div className="text-[76px] md:text-[92px] font-light leading-[0.95] tracking-[-0.03em] tabular-nums">
            {timeStr}
          </div>
          <div className="mt-2 text-[15px] font-medium tracking-[-0.01em] text-white/90">{dateStr}</div>
        </div>

        {/* 잠금 상태 + 잠금 해제 힌트 — 하단 중앙 */}
        <div className="absolute left-0 right-0 bottom-[7%] flex flex-col items-center pointer-events-none">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="opacity-90" aria-hidden="true">
            <path d="M12 2.6a4.6 4.6 0 0 0-4.6 4.6v2.2H6.6c-1 0-1.8.8-1.8 1.8v7.4c0 1 .8 1.8 1.8 1.8h10.8c1 0 1.8-.8 1.8-1.8v-7.4c0-1-.8-1.8-1.8-1.8h-.8V7.2A4.6 4.6 0 0 0 12 2.6Zm-3 4.6a3 3 0 0 1 6 0v2.2H9V7.2Z" />
          </svg>
          <div
            className={`mt-3 flex flex-col items-center ${currentTargetId === 'lock-swipe' ? 'oneui-hint-up' : 'opacity-70'}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 14.5 12 8.5l6 6" />
            </svg>
            <div className="mt-1 text-[13px] font-medium tracking-[-0.01em]">위로 밀어 잠금해제</div>
          </div>
        </div>

        {/* 퀘스트 강조는 퀘스트가 실제로 이 단계일 때만 표시 */}
        {currentTargetId === 'lock-swipe' && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[22%] bg-blue-600 text-white text-[13px] px-4 py-2 rounded-xl shadow-lg font-bold pointer-events-none">
            👆 여기서부터 위로 스와이프!
          </div>
        )}
      </div>
    </div>
  );
}
