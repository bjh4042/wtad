import React from 'react';
import {
  Sun, Camera, Settings, Search, ChevronUp, Trash2, X, Mic,
} from 'lucide-react';
import iconStore from '@/assets/icons/store.png';
import iconGallery from '@/assets/icons/gallery.png';
import iconPlayStore from '@/assets/icons/playstore.png';
import iconFolder from '@/assets/icons/folder.png';
import iconMessages from '@/assets/icons/messages.png';
import iconInternet from '@/assets/icons/internet.png';
import iconCamera from '@/assets/icons/camera.png';
import iconPhone from '@/assets/icons/phone.png';
import { ActionTarget } from '@/components/apps/shared';
import { PLAYSTORE_APPS } from '@/data/appCatalog';

export const APP_ICON_IMAGES: Record<string, string> = {
  Store: iconStore,
  Gallery: iconGallery,
  PlayStore: iconPlayStore,
  Folder: iconFolder,
  Messages: iconMessages,
  Internet: iconInternet,
  Camera: iconCamera,
  Phone: iconPhone,
};

/** setState 호환 업데이터 (값 또는 콜백) */
export type Upd<T> = (v: T | ((prev: T) => T)) => void;

export interface NotificationItem {
  id: number;
  app: string;
  appName: string;
  title: string;
  body: string;
  color: string;
}

export interface DragInfo {
  isDragging: boolean;
  index: number | null;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
}

export interface AppIconProps {
  appName: string;
  index: number;
  time: Date | null;
  notifications: NotificationItem[];
  currentTargetId: string | null;
  advanceQuest: (id: string) => void;
  isEditMode: boolean;
  dragInfo: DragInfo;
  /** 드래그 고스트 사본은 숨김 처리를 하지 않는다 (React 렌더와 DOM 조작 충돌 방지) */
  hideWhenDragging?: boolean;
  onOpenApp: (appName: string) => void;
  onPointerDown: (e: any, index: number) => void;
  onPointerMove: (e: any) => void;
  onPointerUp: (e: any) => void;
  handleAppPressStart: (appName: string, index?: number) => void;
  handleAppPressEnd: () => void;
}

/** 홈/앱서랍 공용 앱 아이콘 (기존 renderAppIcon 과 동일한 마크업) */
export function AppIcon({
  appName, index, time, notifications, currentTargetId, advanceQuest,
  isEditMode, dragInfo, hideWhenDragging = true, onOpenApp,
  onPointerDown, onPointerMove, onPointerUp, handleAppPressStart, handleAppPressEnd,
}: AppIconProps) {
    let content = null;
    let name = '';
    // One UI 7 / Android 15 풍 squircle (스쿼클) 공통 클래스
    const sq = "w-full h-full rounded-[22%] flex items-center justify-center shadow-[0_6px_14px_rgba(0,0,0,0.25)] overflow-hidden";
    switch(appName) {
      case 'Calculator': name = '계산기';
        content = (<div className={sq} style={{ background: 'linear-gradient(135deg,#1f2937 0%,#0f172a 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-[68%] h-[68%]">
            <rect x="18" y="10" width="64" height="80" rx="10" fill="#f8fafc"/>
            <rect x="24" y="16" width="52" height="18" rx="3" fill="#0f172a"/>
            <text x="71" y="29" textAnchor="end" fill="#fbbf24" fontSize="13" fontFamily="monospace" fontWeight="700">96</text>
            {[0,1,2,3].map(r => [0,1,2,3].map(c => {
              const isOp = c === 3;
              return <rect key={`${r}-${c}`} x={24+c*14} y={40+r*12} width="11" height="9" rx="2" fill={isOp ? '#f97316' : '#e2e8f0'}/>;
            }))}
          </svg></div>); break;

      case 'GameLauncher': name = 'Game Launcher';
        content = (<div className={`${sq}`} style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
            <rect x="10" y="35" width="55" height="35" rx="17" fill="#fff" opacity="0.95"/>
            <circle cx="25" cy="52" r="4" fill="#7c3aed"/><circle cx="38" cy="52" r="4" fill="#7c3aed"/>
            <circle cx="78" cy="40" r="6" fill="#fff"/><circle cx="85" cy="58" r="6" fill="#fff"/>
          </svg></div>); break;
      case 'Store': name = 'Galaxy Store';
        content = (<div className={sq} style={{ background: 'linear-gradient(135deg,#a855f7 0%,#ec4899 50%,#f97316 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
            <path d="M 20 45 Q 50 -5 80 45 L 80 80 Q 50 95 20 80 Z" fill="#fff"/>
            <path d="M 35 60 L 50 75 L 70 50" stroke="#a855f7" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg></div>); break;
      case 'Camera': name = '카메라';
        content = (<div className={sq} style={{ background: 'linear-gradient(160deg,#f8fafc 0%,#cbd5e1 100%)' }}>
          <div className="relative w-[62%] h-[62%]">
            <div className="absolute inset-0 rounded-full bg-[#1f2937] shadow-inner flex items-center justify-center">
              <div className="w-[55%] h-[55%] rounded-full bg-gradient-to-br from-[#60a5fa] to-[#1e3a8a] border-2 border-[#0f172a]"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#fbbf24] rounded-full shadow"></div>
          </div>
        </div>); break;
      case 'Gallery': name = '갤러리';
        content = (<div className={sq} style={{ background: '#fff' }}>
          <svg viewBox="0 0 100 100" className="w-[78%] h-[78%]">
            <g transform="translate(50,50)">
              <ellipse cx="0" cy="-26" rx="14" ry="22" fill="#fbbf24"/>
              <ellipse cx="0" cy="26" rx="14" ry="22" fill="#ec4899"/>
              <ellipse cx="-26" cy="0" rx="22" ry="14" fill="#3b82f6"/>
              <ellipse cx="26" cy="0" rx="22" ry="14" fill="#22c55e"/>
              <circle cx="0" cy="0" r="9" fill="#fff"/>
            </g>
          </svg></div>); break;
      case 'Wearable': name = 'Galaxy Wear';
        content = (<div className={sq} style={{ background: 'linear-gradient(135deg,#1e293b 0%,#475569 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
            <rect x="28" y="22" width="44" height="56" rx="14" fill="none" stroke="#fff" strokeWidth="6"/>
            <circle cx="50" cy="50" r="10" fill="#3b82f6"/>
          </svg></div>); break;
      case 'Calendar': name = '캘린더';
        content = (<div className={`${sq} flex-col`} style={{ background: '#fff' }}>
          <div className="w-full h-[28%] bg-[#ef4444] flex items-center justify-center">
            <span className="text-white text-[10px] font-bold tracking-wider">{time ? time.toLocaleDateString('ko-KR', { weekday: 'short' }).toUpperCase() : 'SUN'}</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-[#111] font-black text-[28px] leading-none">{time ? time.getDate() : 1}</span>
          </div></div>); break;
      case 'Clock': name = '시계';
        content = (<div className={sq} style={{ background: '#fff' }}>
          <svg viewBox="0 0 100 100" className="w-[78%] h-[78%]">
            <circle cx="50" cy="50" r="44" fill="#fff" stroke="#111" strokeWidth="5"/>
            {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
              // 서버/클라이언트 부동소수 직렬화 차이로 hydration mismatch 가 발생하므로 고정 소수점으로 반올림
              const r3 = (v: number) => Number(v.toFixed(3));
              const a = (i*30)*Math.PI/180;
              const x1 = r3(50+Math.sin(a)*38); const y1 = r3(50-Math.cos(a)*38);
              const x2 = r3(50+Math.sin(a)*42); const y2 = r3(50-Math.cos(a)*42);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#111" strokeWidth="2"/>;
            })}
            <line x1="50" y1="50" x2="50" y2="22" stroke="#111" strokeWidth="5" strokeLinecap="round"/>
            <line x1="50" y1="50" x2="72" y2="62" stroke="#111" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="50" y1="50" x2="34" y2="68" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="3.5" fill="#ef4444"/></svg></div>); break;
      case 'Health': name = '건강';
        content = (<div className={sq} style={{ background: 'linear-gradient(135deg,#fff 0%,#f1f5f9 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]">
            <path d="M 50 82 C 18 60, 18 30, 38 28 C 46 28, 50 34, 50 38 C 50 34, 54 28, 62 28 C 82 30, 82 60, 50 82 Z" fill="#f97316"/>
            <path d="M 25 55 L 38 55 L 44 42 L 52 68 L 58 50 L 75 50" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg></div>); break;
      case 'Folder': name = '탐험대';
        content = (<div className={`${sq} grid grid-cols-2 grid-rows-2 gap-1.5 p-3.5`} style={{ background: '#fff' }}>
          <div className="rounded-full" style={{ background: '#4285F4' }}></div>
          <div className="rounded-full" style={{ background: '#EA4335' }}></div>
          <div className="rounded-full" style={{ background: '#FBBC05' }}></div>
          <div className="rounded-full" style={{ background: '#34A853' }}></div></div>); break;
      case 'Notes': name = '메모';
        content = (<div className={sq} style={{ background: 'linear-gradient(160deg,#fde68a 0%,#fbbf24 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-[62%] h-[62%]">
            <path d="M 22 12 L 62 12 L 82 32 L 82 88 L 22 88 Z" fill="#fff"/>
            <path d="M 62 12 L 62 32 L 82 32 Z" fill="#fcd34d"/>
            <path d="M 32 48 L 70 48 M 32 60 L 70 60 M 32 72 L 58 72" stroke="#92400e" strokeWidth="4.5" strokeLinecap="round"/>
          </svg></div>); break;
      case 'Messages': name = '메시지';
        content = (<div className={sq} style={{ background: 'linear-gradient(135deg,#22c55e 0%,#16a34a 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-[68%] h-[68%]">
            <path d="M 14 36 Q 14 14 50 14 Q 86 14 86 36 L 86 58 Q 86 78 50 78 L 32 88 L 36 76 Q 14 70 14 36 Z" fill="#ffffff"/>
            <circle cx="34" cy="46" r="5.5" fill="#22c55e"/><circle cx="50" cy="46" r="5.5" fill="#22c55e"/><circle cx="66" cy="46" r="5.5" fill="#22c55e"/>
          </svg></div>); break;
      case 'Internet': name = '인터넷';
        content = (<div className={sq} style={{ background: 'linear-gradient(135deg,#3b82f6 0%,#6366f1 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-[72%] h-[72%]">
            <circle cx="50" cy="50" r="30" fill="#fff"/>
            <ellipse cx="50" cy="50" rx="30" ry="12" fill="none" stroke="#3b82f6" strokeWidth="3"/>
            <ellipse cx="50" cy="50" rx="12" ry="30" fill="none" stroke="#3b82f6" strokeWidth="3"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#3b82f6" strokeWidth="3"/>
          </svg></div>); break;
      case 'PlayStore': name = '앱 마켓';
        content = (<div className={sq} style={{ background: '#fff' }}>
          <svg viewBox="0 0 100 100" className="w-[60%] h-[60%]">
            <defs>
              <linearGradient id="ps-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#00C2A8"/><stop offset="1" stopColor="#00897B"/>
              </linearGradient>
              <linearGradient id="ps-b" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#2196F3"/><stop offset="1" stopColor="#0D47A1"/>
              </linearGradient>
              <linearGradient id="ps-r" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#EA4335"/><stop offset="1" stopColor="#C62828"/>
              </linearGradient>
              <linearGradient id="ps-y" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#FBBC05"/><stop offset="1" stopColor="#F57F17"/>
              </linearGradient>
            </defs>
            <path d="M 20 10 L 55 50 L 20 90 Z" fill="url(#ps-b)"/>
            <path d="M 20 10 L 85 50 L 70 58 Z" fill="url(#ps-r)"/>
            <path d="M 20 90 L 85 50 L 70 42 Z" fill="url(#ps-y)"/>
            <path d="M 55 50 L 70 42 L 85 50 L 70 58 Z" fill="url(#ps-g)"/>
          </svg></div>); break;
      case 'YouTube': name = '튜브';
        content = (<div className={sq} style={{ background: '#fff' }}>
          <svg viewBox="0 0 100 100" className="w-[78%] h-[78%]">
            <rect x="8" y="26" width="84" height="48" rx="14" fill="#FF0000"/>
            <path d="M 42 38 L 66 50 L 42 62 Z" fill="#fff"/>
          </svg></div>); break;
      case 'KakaoTalk': name = '톡톡';
        content = (<div className={sq} style={{ background: '#FAE100' }}>
          <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]">
            <path d="M 50 18 C 26 18, 12 32, 12 48 C 12 60, 20 70, 32 75 L 28 88 L 44 80 C 46 80, 48 80, 50 80 C 74 80, 88 66, 88 50 C 88 32, 74 18, 50 18 Z" fill="#3A1D1D"/>
          </svg></div>); break;
      case 'Naver': name = '검색';
        content = (<div className={sq} style={{ background: '#03C75A' }}>
          <svg viewBox="0 0 100 100" className="w-[60%] h-[60%]">
            <path d="M 22 22 L 42 22 L 60 56 L 60 22 L 78 22 L 78 78 L 58 78 L 40 44 L 40 78 L 22 78 Z" fill="#fff"/>
          </svg></div>); break;
      case 'Settings': name = '설정';
        content = (<div className={sq} style={{ background: 'linear-gradient(135deg,#e0e7ff 0%,#c7d2fe 100%)' }}>
          <Settings size={42} className="text-[#1e3a8a]" strokeWidth={2}/></div>); break;
    }
    // 이미지 아이콘이 있는 앱은 SVG 대신 생성된 이미지로 대체
    if (APP_ICON_IMAGES[appName]) {
      content = (
        <img
          src={APP_ICON_IMAGES[appName]}
          alt={name || appName}
          loading="lazy"
          width={512}
          height={512}
          draggable={false}
          className="w-full h-full object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)] select-none pointer-events-none"
        />
      );
    }
    if (!content) return null;
    const hasNotif = appName === 'KakaoTalk' && notifications.some(n => n.app === 'KakaoTalk');
    return (
      <ActionTarget
        key={index}
        id={`app-icon-${appName}`} currentTargetId={currentTargetId} advanceQuest={advanceQuest}
        extraTargetIds={appName === 'Camera' ? ['app-icon-Camera-long-press', 'drag-camera'] : []}
        tooltipText={
          appName === 'Camera' && currentTargetId === 'app-icon-Camera-long-press' ? '꾹~ 길게 누르세요'
          : appName === 'Camera' && currentTargetId === 'drag-camera' ? '다른 칸으로 끌어 옮기세요'
          : '여기를 누르세요!'
        }
        onClick={() => {
          if (isEditMode) return;
          onOpenApp(appName);
        }}

        onPointerDown={(e) => onPointerDown(e, index)}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onTouchStart={() => handleAppPressStart(appName, index)} onTouchEnd={handleAppPressEnd}
        onMouseDown={() => handleAppPressStart(appName, index)} onMouseUp={handleAppPressEnd} onMouseLeave={handleAppPressEnd}

        className={`flex flex-col items-center gap-3 cursor-pointer group w-[72px] md:w-20 ${isEditMode ? 'animate-wiggle touch-none' : ''}`}
      >
        <div
          className={`relative w-[72px] h-[72px] md:w-20 md:h-20 transition-transform ${!isEditMode ? 'group-hover:scale-105 active:scale-95' : 'ring-2 ring-white/50 rounded-[1.25rem] bg-white/10'}`}
          style={{ visibility: hideWhenDragging && dragInfo.isDragging && dragInfo.index === index ? 'hidden' : 'visible' }}
        >
          {content}
          {hasNotif && !isEditMode && (
            <div className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center shadow-lg border-2 border-white/80 z-10">
              {notifications.filter(n => n.app === 'KakaoTalk').length}
            </div>
          )}
        </div>
        <span className="text-white text-[13px] md:text-sm font-medium drop-shadow-md truncate w-full text-center">{name}</span>
      </ActionTarget>
    );
}

export interface HomeScreenProps {
  isPhone: boolean;
  time: Date | null;
  timeStr: string;
  dateStr: string;
  wallpaper: string;
  currentTargetId: string | null;
  advanceQuest: (id: string) => void;
  homePages: any[][];
  setHomePages: Upd<any[][]>;
  currentPage: number;
  setCurrentPage: Upd<number>;
  homeApps: any[];
  setHomeApps: Upd<any[]>;
  widgets: string[];
  setWidgets: Upd<string[]>;
  setWidgetPages: Upd<string[][]>;
  widgetSizes: Record<string, 'sm' | 'md' | 'lg'>;
  setWidgetSizes: Upd<Record<string, 'sm' | 'md' | 'lg'>>;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<any>>;
  homeFlashKey: number;
  pageSwipeStart: { x: number; y: number } | null;
  setPageSwipeStart: React.Dispatch<React.SetStateAction<any>>;
  pageSwipeDX: number;
  setPageSwipeDX: React.Dispatch<React.SetStateAction<any>>;
  homeLongPressTimer: any;
  setHomeLongPressTimer: React.Dispatch<React.SetStateAction<any>>;
  setHomeMenuOpen: React.Dispatch<React.SetStateAction<any>>;
  setWidgetPickerOpen: React.Dispatch<React.SetStateAction<any>>;
  installedApps: string[];
  setInstalledApps: Upd<string[]>;
  notifications: NotificationItem[];
  dragInfo: DragInfo;
  onPointerDown: (e: any, index: number) => void;
  onPointerMove: (e: any) => void;
  onPointerUp: (e: any) => void;
  handleAppPressStart: (appName: string, index?: number) => void;
  handleAppPressEnd: () => void;
  onOpenApp: (appName: string) => void;
  setMathAppOpen: React.Dispatch<React.SetStateAction<any>>;
  appDrawerOpen: boolean;
  setAppDrawerOpen: React.Dispatch<React.SetStateAction<any>>;
  drawerSwipeStart: number | null;
  setDrawerSwipeStart: React.Dispatch<React.SetStateAction<any>>;
  drawerSearch: string;
  setDrawerSearch: React.Dispatch<React.SetStateAction<any>>;
  drawerLongPressTimer: any;
  setDrawerLongPressTimer: React.Dispatch<React.SetStateAction<any>>;
  uninstallTarget: string | null;
  setUninstallTarget: React.Dispatch<React.SetStateAction<any>>;
}

export default function HomeScreen({
  isPhone, time, timeStr, dateStr, wallpaper, currentTargetId, advanceQuest,
  homePages, setHomePages, currentPage, setCurrentPage, homeApps, setHomeApps,
  widgets, setWidgets, setWidgetPages, widgetSizes, setWidgetSizes,
  isEditMode, setIsEditMode, homeFlashKey,
  pageSwipeStart, setPageSwipeStart, pageSwipeDX, setPageSwipeDX,
  homeLongPressTimer, setHomeLongPressTimer, setHomeMenuOpen, setWidgetPickerOpen,
  installedApps, setInstalledApps, notifications,
  dragInfo, onPointerDown, onPointerMove, onPointerUp,
  handleAppPressStart, handleAppPressEnd, onOpenApp, setMathAppOpen,
  appDrawerOpen, setAppDrawerOpen, drawerSwipeStart, setDrawerSwipeStart,
  drawerSearch, setDrawerSearch, drawerLongPressTimer, setDrawerLongPressTimer,
  uninstallTarget, setUninstallTarget,
}: HomeScreenProps) {
  const renderAppIcon = (appName: any, index: number, hideWhenDragging = true) => {
    if (!appName) return null;
    return (
      <AppIcon
        key={index}
        appName={appName}
        index={index}
        time={time}
        notifications={notifications}
        currentTargetId={currentTargetId}
        advanceQuest={advanceQuest}
        isEditMode={isEditMode}
        dragInfo={dragInfo}
        hideWhenDragging={hideWhenDragging}
        onOpenApp={onOpenApp}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        handleAppPressStart={handleAppPressStart}
        handleAppPressEnd={handleAppPressEnd}
      />
    );
  };

  const cycleWidgetSize = (id: string) => {
    setWidgetSizes(prev => {
      const cur = prev[id] ?? 'sm';
      const next = cur === 'sm' ? 'md' : cur === 'md' ? 'lg' : 'sm';
      return { ...prev, [id]: next };
    });
  };
  const widgetSizeClass = (id: string) => {
    const s = widgetSizes[id] ?? 'sm';
    if (s === 'lg') return 'scale-125 origin-top-left';
    if (s === 'md') return 'scale-110 origin-top-left';
    return '';
  };

  return (
    <div
      key={`home-flash-${homeFlashKey}`}
      className="flex-1 pt-10 md:pt-12 px-2 md:px-4 pb-2 relative flex flex-col transition-all duration-500 overflow-hidden min-h-0 animate-app-enter"
      style={{ background: wallpaper, backgroundSize: 'cover' }}
      onContextMenu={(e) => { e.preventDefault(); setHomeMenuOpen(true); }}
      onMouseDown={(e) => {
        if (isEditMode) return;
        const target = e.target as HTMLElement;
        if (target.closest('[data-slot-idx]') || target.closest('button')) return;
        setPageSwipeStart({ x: e.clientX, y: e.clientY });
        if (homeLongPressTimer) clearTimeout(homeLongPressTimer);
        const t = setTimeout(() => setHomeMenuOpen(true), 700);
        setHomeLongPressTimer(t);
      }}
      onMouseMove={(e) => {
        if (pageSwipeStart) setPageSwipeDX(e.clientX - pageSwipeStart.x);
      }}
      onMouseUp={() => {
        if (homeLongPressTimer) { clearTimeout(homeLongPressTimer); setHomeLongPressTimer(null); }
        if (pageSwipeStart && Math.abs(pageSwipeDX) > 90) {
          if (pageSwipeDX < 0 && currentPage < homePages.length - 1) setCurrentPage(currentPage + 1);
          else if (pageSwipeDX > 0 && currentPage > 0) setCurrentPage(currentPage - 1);
        }
        setPageSwipeStart(null); setPageSwipeDX(0);
      }}
      onMouseLeave={() => {
        if (homeLongPressTimer) { clearTimeout(homeLongPressTimer); setHomeLongPressTimer(null); }
        setPageSwipeStart(null); setPageSwipeDX(0);
      }}
      onTouchStart={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('button')) return;
        setPageSwipeStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        if (isEditMode) return;
        if (target.closest('[data-slot-idx]')) return;
        if (homeLongPressTimer) clearTimeout(homeLongPressTimer);
        const t = setTimeout(() => setHomeMenuOpen(true), 700);
        setHomeLongPressTimer(t);
      }}
      onTouchMove={(e) => {
        if (pageSwipeStart) {
          const dx = e.touches[0].clientX - pageSwipeStart.x;
          const dy = e.touches[0].clientY - pageSwipeStart.y;
          if (Math.abs(dx) > Math.abs(dy)) setPageSwipeDX(dx);
        }
      }}
      onTouchEnd={() => {
        if (homeLongPressTimer) { clearTimeout(homeLongPressTimer); setHomeLongPressTimer(null); }
        if (pageSwipeStart && Math.abs(pageSwipeDX) > 60) {
          if (pageSwipeDX < 0 && currentPage < homePages.length - 1) setCurrentPage(currentPage + 1);
          else if (pageSwipeDX > 0 && currentPage > 0) setCurrentPage(currentPage - 1);
        }
        setPageSwipeStart(null); setPageSwipeDX(0);
      }}
    >
      {/* Edit mode top bar */}
      {isEditMode && (
        <div className="absolute top-2 left-0 right-0 z-[20] flex items-center justify-center gap-2 px-3 animate-[fadeIn_0.2s_ease-out]">
          <button onClick={() => setWidgetPickerOpen(true)} className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-white text-xs font-medium active:scale-95">＋ 위젯</button>
          <button onClick={() => { setHomePages(p => [...p, Array(40).fill(null)]); setWidgetPages(p => [...p, []]); setCurrentPage(homePages.length); }} className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-white text-xs font-medium active:scale-95">＋ 페이지</button>
          {homePages.length > 1 && (
            <button onClick={() => {
              const idx = currentPage;
              setHomePages(p => p.filter((_, i) => i !== idx));
              setWidgetPages(p => p.filter((_, i) => i !== idx));
              setCurrentPage(Math.max(0, idx - 1));
            }} className="px-3 py-1.5 rounded-full bg-red-500/80 text-white text-xs font-medium active:scale-95">페이지 삭제</button>
          )}
          <button onClick={() => setIsEditMode(false)} className="px-4 py-1.5 rounded-full bg-blue-500 text-white text-xs font-bold active:scale-95">완료</button>
        </div>
      )}

      {/* Page slider wrapper — animates between pages */}
      <div
        className="absolute inset-0 flex flex-col transition-transform"
        style={{
          transform: `translateX(${pageSwipeStart ? pageSwipeDX * 0.4 : 0}px)`,
          transitionDuration: pageSwipeStart ? '0ms' : '250ms',
        }}
      >
      {/* Home widgets row */}
      <div className={`absolute top-12 md:top-16 left-3 md:left-8 right-3 md:right-8 flex gap-2 md:gap-4 flex-wrap z-[5] ${isEditMode ? '' : 'pointer-events-none'}`}>
        {widgets.includes('clock') && (
          <div onClick={() => isEditMode && cycleWidgetSize('clock')} className={`group relative bg-white/15 backdrop-blur-md rounded-2xl md:rounded-3xl px-4 md:px-6 py-2 md:py-3 shadow-xl border border-white/20 flex flex-col text-white pointer-events-auto transition-transform ${widgetSizeClass('clock')} ${isEditMode ? 'cursor-pointer animate-wiggle' : ''}`}>
            <div className="text-2xl md:text-4xl font-light tracking-tight leading-none drop-shadow-lg tabular-nums">{timeStr}</div>
            <div className="text-[10px] md:text-xs mt-1 opacity-90 font-medium truncate">{dateStr}</div>
            {isEditMode && <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-lg" onClick={(e) => { e.stopPropagation(); setWidgets(w => w.filter(x => x !== 'clock')); }}>×</button>}
          </div>
        )}
        {widgets.includes('weather') && (
          <div onClick={() => isEditMode && cycleWidgetSize('weather')} className={`group relative bg-gradient-to-br from-sky-400/40 to-blue-600/40 backdrop-blur-md rounded-2xl md:rounded-3xl px-3 md:px-5 py-2 md:py-3 shadow-xl border border-white/20 flex items-center gap-2 md:gap-3 text-white pointer-events-auto transition-transform ${widgetSizeClass('weather')} ${isEditMode ? 'cursor-pointer animate-wiggle' : ''}`}>
            <Sun size={28} className="text-yellow-300 drop-shadow-md"/>
            <div>
              <div className="text-lg md:text-2xl font-bold leading-none">21°</div>
              <div className="text-[10px] opacity-90 mt-0.5">서울 · 맑음</div>
            </div>
            {isEditMode && <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-lg" onClick={(e) => { e.stopPropagation(); setWidgets(w => w.filter(x => x !== 'weather')); }}>×</button>}
          </div>
        )}
        {widgets.includes('calendar') && (
          <div onClick={() => isEditMode && cycleWidgetSize('calendar')} className={`group relative bg-white/15 backdrop-blur-md rounded-2xl px-3 py-2 shadow-xl border border-white/20 text-white pointer-events-auto transition-transform ${widgetSizeClass('calendar')} ${isEditMode ? 'cursor-pointer animate-wiggle' : ''}`}>
            <div className="text-[10px] opacity-80">{time ? time.toLocaleDateString('ko-KR', { weekday: 'long' }) : ''}</div>
            <div className="text-2xl font-bold leading-none">{time ? time.getDate() : ''}</div>
            {isEditMode && <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-lg" onClick={(e) => { e.stopPropagation(); setWidgets(w => w.filter(x => x !== 'calendar')); }}>×</button>}
          </div>
        )}
        {widgets.includes('music') && (
          <div onClick={() => isEditMode && cycleWidgetSize('music')} className={`group relative bg-gradient-to-br from-pink-500/40 to-purple-600/40 backdrop-blur-md rounded-2xl px-3 py-2 shadow-xl border border-white/20 text-white pointer-events-auto flex items-center gap-2 transition-transform ${widgetSizeClass('music')} ${isEditMode ? 'cursor-pointer animate-wiggle' : ''}`}>
            <div className="text-2xl">🎵</div><div className="text-xs">재생 중</div>
            {isEditMode && <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-lg" onClick={(e) => { e.stopPropagation(); setWidgets(w => w.filter(x => x !== 'music')); }}>×</button>}
          </div>
        )}
        {widgets.includes('fitness') && (
          <div onClick={() => isEditMode && cycleWidgetSize('fitness')} className={`group relative bg-gradient-to-br from-green-500/40 to-emerald-600/40 backdrop-blur-md rounded-2xl px-3 py-2 shadow-xl border border-white/20 text-white pointer-events-auto flex items-center gap-2 transition-transform ${widgetSizeClass('fitness')} ${isEditMode ? 'cursor-pointer animate-wiggle' : ''}`}>
            <div className="text-2xl">👟</div><div className="text-xs">5,280 걸음</div>
            {isEditMode && <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-lg" onClick={(e) => { e.stopPropagation(); setWidgets(w => w.filter(x => x !== 'fitness')); }}>×</button>}
          </div>
        )}
      </div>

      {/* App grid — fills the screen like real tablet */}
      <div key={`page-${currentPage}`} className="flex-1 flex flex-col justify-center pt-8 md:pt-20 pb-4 min-h-0 animate-[fadeIn_0.25s_ease-out]">
        <div className={`grid gap-y-3 md:gap-y-5 gap-x-1 md:gap-x-2 px-2 md:px-6 w-full max-w-[1200px] justify-items-center self-center ${isPhone ? 'grid-cols-4' : 'grid-cols-4 md:grid-cols-8'}`}>
          {(() => {
            const slots: any[] = [...homeApps];
            const extras: string[] = [];
            if (currentPage === 0 && installedApps.includes('math') && !isEditMode) extras.push('__math');
            if (currentPage === 0) PLAYSTORE_APPS.forEach(a => { if (installedApps.includes(a.id)) extras.push(`__ps:${a.id}`); });
            for (const ex of extras) {
              const i = slots.indexOf(null);
              if (i >= 0) slots[i] = ex; else slots.push(ex);
            }
            return slots.map((appName, index) => {
              if (appName === '__math') {
                return (
                  <ActionTarget
                    key={`math-${index}`} id="app-icon-math" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                    onClick={() => setMathAppOpen(true)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer group w-[64px] md:w-[88px]"
                  >
                    <div className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] bg-yellow-400 rounded-[1.25rem] flex items-center justify-center shadow-lg font-black text-white text-2xl transition-transform group-hover:scale-105 active:scale-95">1+2</div>
                    <span className="text-white text-[11px] md:text-[12px] font-medium drop-shadow-md truncate w-full text-center">수학탐험대</span>
                  </ActionTarget>
                );
              }
              if (typeof appName === 'string' && appName.startsWith('__ps:')) {
                const id = appName.slice(5);
                const app = PLAYSTORE_APPS.find(a => a.id === id);
                if (!app) return null;
                return (
                  <div key={`ps-${index}`} onClick={() => alert(`${app.name} 앱이 실행되었어요! (시뮬레이션)`)} className="flex flex-col items-center gap-1.5 cursor-pointer group w-[64px] md:w-[88px] active:scale-95 transition-transform">
                    <div className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] rounded-[1.25rem] flex items-center justify-center shadow-lg font-black text-white text-2xl group-hover:scale-105 transition-transform" style={{ background: app.color }}>{app.label}</div>
                    <span className="text-white text-[11px] md:text-[12px] font-medium drop-shadow-md truncate w-full text-center">{app.name}</span>
                  </div>
                );
              }
              if (appName) return <div key={index} data-slot-idx={index}>{renderAppIcon(appName, index)}</div>;
              return (
                <ActionTarget
                  key={index} id={`empty-slot-${index}`} currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                  className={`w-[56px] h-[56px] md:w-[64px] md:h-[64px] ${isEditMode ? 'border-2 border-dashed border-white/50 rounded-[1.25rem] bg-white/10 transition-colors' : ''}`}
                ><div data-slot-idx={index} className="w-full h-full"></div></ActionTarget>
              );
            });
          })()}
        </div>
      </div>

      {/* Bottom search bar (Samsung Finder style) */}
      <div className="w-full max-w-xl mx-auto mb-3 bg-white/90 rounded-full h-11 md:h-12 flex items-center px-5 shadow-lg shrink-0 transition-transform active:scale-[0.98]">
        <span className="text-gray-500 text-sm flex-1">검색</span>
        <Mic size={18} className="text-gray-500" />
      </div>

      <div className="absolute bottom-14 w-full flex justify-center gap-2 left-0">
        {homePages.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrentPage(i); }}
            className={`h-2 rounded-full transition-all ${i === currentPage ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
          />
        ))}
      </div>
      </div>



      {/* App drawer pull-up handle */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 flex flex-col items-center justify-end pb-1 cursor-pointer group"
        onClick={() => setAppDrawerOpen(true)}
        onTouchStart={(e) => setDrawerSwipeStart(e.touches[0].clientY)}
        onTouchMove={(e) => {
          if (drawerSwipeStart !== null && drawerSwipeStart - e.touches[0].clientY > 60) {
            setAppDrawerOpen(true);
            setDrawerSwipeStart(null);
          }
        }}
        onTouchEnd={() => setDrawerSwipeStart(null)}
      >
        <ChevronUp size={28} className="text-white/70 group-hover:text-white animate-pulse-up" />
        <div className="text-white/60 text-[11px] -mt-1">앱 서랍</div>
      </div>

      {dragInfo.isDragging && (
        <div id="drag-ghost" className="fixed pointer-events-none z-[200] opacity-80" style={{ left: dragInfo.x - dragInfo.offsetX, top: dragInfo.y - dragInfo.offsetY }}>
          {renderAppIcon(homeApps[dragInfo.index as number], dragInfo.index as number, false)}
        </div>
      )}

      {/* App Drawer overlay */}
      {appDrawerOpen && (
        <div className="absolute inset-0 z-[90] bg-black/85 backdrop-blur-xl animate-[slideUp_0.3s_ease-out] flex flex-col pt-6">
          <div className="flex items-center justify-between px-8 mb-3">
            <div className="text-white text-2xl font-bold">앱 서랍</div>
            <button
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-90 transition-all"
              onClick={() => { setAppDrawerOpen(false); setDrawerSearch(''); }}
            >
              <X size={20}/>
            </button>
          </div>
          <div className="px-8 mb-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"/>
              <input
                value={drawerSearch}
                onChange={(e) => setDrawerSearch(e.target.value)}
                placeholder="앱 검색…"
                className="w-full bg-white/10 border border-white/15 text-white placeholder-white/40 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:bg-white/15"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-8">
            {(() => {
              const all = homeApps.filter(Boolean).concat(installedApps.includes('math') ? ['math'] : []);
              const filtered = drawerSearch
                ? all.filter(a => a.toLowerCase().includes(drawerSearch.toLowerCase()))
                : all;
              return (
            <div className="grid grid-cols-6 md:grid-cols-8 gap-y-8 gap-x-4 justify-items-center">
              {filtered.map((appName, i) => (
                <div
                  key={`drawer-${appName}-${i}`}
                  className="flex flex-col items-center gap-2 cursor-pointer group w-[72px] active:scale-95 transition-transform"
                  onClick={() => {
                    if (drawerLongPressTimer) { clearTimeout(drawerLongPressTimer); setDrawerLongPressTimer(null); }
                    if (appName === 'math') { setMathAppOpen(true); setAppDrawerOpen(false); return; }
                    onOpenApp(appName);
                    setAppDrawerOpen(false);
                  }}
                  onMouseDown={() => {
                    const t = setTimeout(() => setUninstallTarget(appName), 600);
                    setDrawerLongPressTimer(t);
                  }}
                  onMouseUp={() => { if (drawerLongPressTimer) { clearTimeout(drawerLongPressTimer); setDrawerLongPressTimer(null); } }}
                  onMouseLeave={() => { if (drawerLongPressTimer) { clearTimeout(drawerLongPressTimer); setDrawerLongPressTimer(null); } }}
                  onTouchStart={() => {
                    const t = setTimeout(() => setUninstallTarget(appName), 600);
                    setDrawerLongPressTimer(t);
                  }}
                  onTouchEnd={() => { if (drawerLongPressTimer) { clearTimeout(drawerLongPressTimer); setDrawerLongPressTimer(null); } }}
                >
                  <div className="w-[72px] h-[72px] pointer-events-none">
                    {appName === 'math' ? (
                      <div className="w-full h-full bg-yellow-400 rounded-[1.25rem] flex items-center justify-center shadow-lg font-black text-white text-3xl">1+2</div>
                    ) : renderAppIcon(appName, -1)}
                  </div>
                </div>
              ))}
            </div>
              );
            })()}
            <div className="text-center text-white/50 text-xs mt-8">아이콘을 꾹 누르면 앱을 삭제할 수 있어요 · 총 {homeApps.filter(Boolean).length + (installedApps.includes('math') ? 1 : 0)}개</div>
          </div>


          {/* Uninstall confirm */}
          {uninstallTarget && (
            <div className="absolute inset-0 z-[95] bg-black/60 flex items-center justify-center animate-[fadeIn_0.2s_ease-out]" onClick={() => setUninstallTarget(null)}>
              <div className="bg-[#1c1c1e] text-white rounded-3xl p-6 w-[340px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-3">
                  <Trash2 size={24} className="text-red-400"/>
                  <div className="text-lg font-bold">앱 삭제</div>
                </div>
                <div className="text-sm text-gray-300 mb-6 leading-relaxed">
                  <span className="font-bold text-white">{uninstallTarget}</span> 앱을 정말 삭제하시겠어요? 시스템 앱은 사용 중지됩니다.
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all font-medium"
                    onClick={() => setUninstallTarget(null)}
                  >취소</button>
                  <button
                    className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 transition-all font-bold"
                    onClick={() => {
                      if (uninstallTarget === 'math') {
                        setInstalledApps(prev => prev.filter(a => a !== 'math'));
                      } else {
                        setHomeApps(prev => prev.map(a => a === uninstallTarget ? null : a));
                      }
                      setUninstallTarget(null);
                    }}
                  >삭제</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
