import React from 'react';
import {
  Sun, Search, Trash2, X, Mic, Music2, Footprints,
} from 'lucide-react';
import { ActionTarget } from '@/components/apps/shared';
import { PLAYSTORE_APPS } from '@/data/appCatalog';
import { GalaxyAppIcon, GALAXY_APP_LABELS } from './GalaxyAppIcon';

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

export type AppIconVariant = 'home' | 'drawer' | 'taskbar';

/** 전용 앱 화면이 구현된 앱 (그 외는 시뮬레이션 안내로 처리 — 검은 화면 방지) */
const DRAWER_APPS_WITH_SCREEN = ['Settings', 'Camera', 'Gallery', 'PlayStore', 'Notes', 'Calculator', 'Internet', 'Folder', 'Clock', 'Calendar'];
const APP_LABELS: Record<string, string> = { Settings: '설정', Camera: '카메라', Gallery: '갤러리', PlayStore: 'Play 스토어 플레이 스토어 앱 설치', Notes: 'Samsung Notes 삼성 노트 메모', Calculator: '계산기', Internet: '삼성 인터넷', Folder: '내 파일 다운로드', Clock: '시계 알람 타이머', Calendar: '캘린더 일정', math: '똑똑수학탐험대 수학탐험대' };

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
  /** 홈 / 앱스 화면 / 작업표시줄 — 크기와 라벨 표시만 달라진다 */
  variant?: AppIconVariant;
  onOpenApp: (appName: string) => void;
  onPointerDown: (e: any, index: number) => void;
  onPointerMove: (e: any) => void;
  onPointerUp: (e: any) => void;
  handleAppPressStart: (appName: string, index?: number) => void;
  handleAppPressEnd: () => void;
}

/** 홈/앱스/작업표시줄 공용 앱 아이콘 */
export function AppIcon({
  appName, index, time, notifications, currentTargetId, advanceQuest,
  isEditMode, dragInfo, hideWhenDragging = true, variant = 'home', onOpenApp,
  onPointerDown, onPointerMove, onPointerUp, handleAppPressStart, handleAppPressEnd,
}: AppIconProps) {
    const name = GALAXY_APP_LABELS[appName] ?? appName;
    const hasNotif = appName === 'KakaoTalk' && notifications.some(n => n.app === 'KakaoTalk');
    const isTaskbar = variant === 'taskbar';
    const isHome = variant === 'home';
    const iconSizeVar = isTaskbar
      ? 'var(--oneui-taskbar-icon-size)'
      : variant === 'drawer'
        ? 'var(--oneui-drawer-icon-size)'
        : 'var(--oneui-home-icon-size)';
    return (
      <ActionTarget
        key={index}
        id={`app-icon-${appName}`} currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance
        extraTargetIds={appName === 'Camera' ? ['app-icon-Camera-long-press', 'drag-camera'] : []}
        tooltipText={
          appName === 'Camera' && currentTargetId === 'app-icon-Camera-long-press' ? '꾹~ 길게 누르세요'
          : appName === 'Camera' && currentTargetId === 'drag-camera' ? '다른 칸으로 끌어 옮기세요'
          : '여기를 누르세요!'
        }
        onClick={() => {
          if (isEditMode) return;
          onOpenApp(appName);
          advanceQuest(`app-icon-${appName}`);
        }}

        {...(isHome ? {
          // Home 전용: 편집모드 롱프레스 + 드래그. drawer/taskbar 에서는 절대 시작하지 않는다
          onPointerDown: (e: any) => onPointerDown(e, index),
          onPointerMove,
          onPointerUp,
          onTouchStart: () => handleAppPressStart(appName, index),
          onTouchEnd: handleAppPressEnd,
          onMouseDown: () => handleAppPressStart(appName, index),
          onMouseUp: handleAppPressEnd,
          onMouseLeave: handleAppPressEnd,
        } : {})}

        className={`flex flex-col items-center cursor-pointer group oneui-press ${isTaskbar ? '' : 'gap-1.5'} ${isEditMode ? 'animate-wiggle touch-none' : ''}`}
        style={{ width: isTaskbar ? iconSizeVar : `calc(${iconSizeVar} + 48px)`, maxWidth: '100%' }}
      >
        <div role="button" tabIndex={isEditMode ? -1 : 0} aria-label={`${name} 열기`} onKeyDown={(e) => { if (!isEditMode && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onOpenApp(appName); advanceQuest(`app-icon-${appName}`); } }}
          className={`relative transition-transform ${!isEditMode ? 'md:group-hover:scale-105' : 'ring-2 ring-white/50 rounded-[1.25rem] bg-white/10'}`}
          style={{
            width: iconSizeVar,
            height: iconSizeVar,
            visibility: hideWhenDragging && dragInfo.isDragging && dragInfo.index === index ? 'hidden' : 'visible',
          }}
        >
          <GalaxyAppIcon appName={appName} time={time}/>
          {hasNotif && !isEditMode && (
            <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border border-white/70 z-10">
              {notifications.filter(n => n.app === 'KakaoTalk').length}
            </div>
          )}
        </div>
        {!isTaskbar && (
          <span
            className="oneui-app-label text-white font-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] truncate w-full text-center leading-tight"
            style={{ fontSize: 'var(--oneui-home-label-size)' }}
          >{name}</span>
        )}
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
  /** 작업표시줄 표시용 (기존 상태 재사용, 새 관리 시스템 없음) */
  recentApps?: string[];
  currentApp?: string | null;
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
  uninstallTarget, setUninstallTarget, recentApps = [], currentApp = null,
}: HomeScreenProps) {
  /** 앱스 화면 전용: 탭과 스와이프를 구분하기 위한 이동 임계값 추적 */
  const drawerPressStart = React.useRef<{ x: number; y: number } | null>(null);
  const drawerPressMoved = React.useRef(false);
  // 기존 drawerLongPressTimer(state)를 ref 로도 미러링해, 이벤트 사이 stale closure 없이 항상 취소할 수 있게 한다
  const drawerLongPressRef = React.useRef<any>(null);
  const uninstallOpenedAt = React.useRef(0);
  const startDrawerLongPress = (appName: string) => {
    if (drawerLongPressRef.current) clearTimeout(drawerLongPressRef.current);
    const t = setTimeout(() => {
      drawerLongPressRef.current = null;
      setDrawerLongPressTimer(null);
      if (drawerPressMoved.current) return; // 이동 중이면 롱프레스 무시
      uninstallOpenedAt.current = Date.now();
      setUninstallTarget(appName);
    }, 600);
    drawerLongPressRef.current = t;
    setDrawerLongPressTimer(t);
  };
  const cancelDrawerLongPress = () => {
    if (drawerLongPressRef.current) { clearTimeout(drawerLongPressRef.current); drawerLongPressRef.current = null; }
    if (drawerLongPressTimer) { clearTimeout(drawerLongPressTimer); setDrawerLongPressTimer(null); }
  };
  const drawerPointerMoveCheck = (x: number, y: number) => {
    const s = drawerPressStart.current;
    if (!s) return;
    if (Math.abs(x - s.x) > 10 || Math.abs(y - s.y) > 10) {
      drawerPressMoved.current = true;
      cancelDrawerLongPress();
    }
  };
  const renderAppIcon = (appName: any, index: number, hideWhenDragging = true, variant: 'home' | 'drawer' | 'taskbar' = 'home') => {
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
        variant={variant}
        onOpenApp={onOpenApp}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        handleAppPressStart={handleAppPressStart}
        handleAppPressEnd={handleAppPressEnd}
      />
    );
  };

  /** 작업표시줄: 고정 앱(홈 1페이지 상위 앱) + 기존 recentApps */
  const taskbarPinned = ['Internet', 'Notes', 'Gallery', 'Camera', 'Settings'].filter(a => homePages.some(p => p.includes(a)));
  const taskbarRecents = recentApps.filter(a => !taskbarPinned.includes(a)).slice(0, 3);
  const phoneDockApps = ['Internet', 'Notes', 'Gallery', 'Camera'];


  const cycleWidgetSize = (id: string) => {
    setWidgetSizes(prev => {
      const cur = prev[id] ?? 'sm';
      const next = cur === 'sm' ? 'md' : cur === 'md' ? 'lg' : 'sm';
      return { ...prev, [id]: next };
    });
  };
  const widgetSizeClass = (id: string) => {
    const s = widgetSizes[id] ?? 'sm';
    if (isPhone) return `oneui-phone-widget-${s}`;
    if (s === 'lg') return 'scale-125 origin-top-left';
    if (s === 'md') return 'scale-110 origin-top-left';
    return '';
  };

  return (
    <div
      key={`home-flash-${homeFlashKey}`}
      className={`oneui flex-1 relative flex flex-col transition-all duration-500 overflow-hidden min-h-0 animate-app-enter ${isPhone ? 'oneui-phone-home' : ''}`}
      data-home-layout={isPhone ? 'phone' : 'tablet'}
      style={{ background: wallpaper, backgroundSize: 'cover' }}
      onContextMenu={(e) => { e.preventDefault(); if (appDrawerOpen) return; setHomeMenuOpen(true); }}
      onMouseDown={(e) => {
        if (isEditMode || appDrawerOpen) return; // Drawer 는 자체 제스처 처리
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
        if (appDrawerOpen) return; // Drawer 는 자체 제스처 처리 (홈 롱프레스 타이머 시작 금지)
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
        <div className="oneui-home-edit-toolbar absolute top-2 left-0 right-0 z-[20] flex items-center justify-center gap-2 px-3 animate-[fadeIn_0.2s_ease-out]">
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
        className={`oneui-home-page absolute inset-0 flex flex-col transition-transform ${isEditMode ? 'is-editing' : ''}`}
        style={{
          transform: `translateX(${pageSwipeStart ? pageSwipeDX * 0.4 : 0}px)`,
          transitionDuration: pageSwipeStart ? '0ms' : '250ms',
        }}
      >
      {/* Home widgets row */}
      <div
        className={`oneui-home-widgets absolute flex gap-2 md:gap-4 flex-wrap z-[5] ${isEditMode ? '' : 'pointer-events-none'}`}
        style={{
          top: 'calc(var(--oneui-statusbar-h) + var(--oneui-home-pad-top))',
          left: 'var(--oneui-home-pad-x)',
          right: 'var(--oneui-home-pad-x)',
        }}
      >

        {widgets.includes('clock') && (
          <div onClick={() => isEditMode && cycleWidgetSize('clock')} className={`group relative bg-white/15 backdrop-blur-md rounded-2xl md:rounded-3xl px-4 md:px-6 py-2 md:py-3 border border-white/10 flex flex-col text-white pointer-events-auto transition-transform ${widgetSizeClass('clock')} ${isEditMode ? 'cursor-pointer animate-wiggle' : ''}`}>
            <div className="text-2xl md:text-4xl font-light tracking-tight leading-none drop-shadow-lg tabular-nums">{timeStr}</div>
            <div className="text-[10px] md:text-xs mt-1 opacity-90 font-medium truncate">{dateStr}</div>
            {isEditMode && <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-lg" onClick={(e) => { e.stopPropagation(); setWidgets(w => w.filter(x => x !== 'clock')); }}>×</button>}
          </div>
        )}
        {widgets.includes('weather') && (
          <div onClick={() => isEditMode && cycleWidgetSize('weather')} className={`group relative bg-gradient-to-br from-sky-400/40 to-blue-600/40 backdrop-blur-md rounded-2xl md:rounded-3xl px-3 md:px-5 py-2 md:py-3 border border-white/10 flex items-center gap-2 md:gap-3 text-white pointer-events-auto transition-transform ${widgetSizeClass('weather')} ${isEditMode ? 'cursor-pointer animate-wiggle' : ''}`}>
            <Sun size={28} className="text-yellow-300 drop-shadow-md"/>
            <div>
              <div className="text-lg md:text-2xl font-bold leading-none">21°</div>
              <div className="text-[10px] opacity-90 mt-0.5">서울 · 맑음</div>
            </div>
            {isEditMode && <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-lg" onClick={(e) => { e.stopPropagation(); setWidgets(w => w.filter(x => x !== 'weather')); }}>×</button>}
          </div>
        )}
        {widgets.includes('calendar') && (
          <div onClick={() => isEditMode && cycleWidgetSize('calendar')} className={`group relative bg-white/15 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/10 text-white pointer-events-auto transition-transform ${widgetSizeClass('calendar')} ${isEditMode ? 'cursor-pointer animate-wiggle' : ''}`}>
            <div className="text-[10px] opacity-80">{time ? time.toLocaleDateString('ko-KR', { weekday: 'long' }) : ''}</div>
            <div className="text-2xl font-bold leading-none">{time ? time.getDate() : ''}</div>
            {isEditMode && <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-lg" onClick={(e) => { e.stopPropagation(); setWidgets(w => w.filter(x => x !== 'calendar')); }}>×</button>}
          </div>
        )}
        {widgets.includes('music') && (
          <div onClick={() => isEditMode && cycleWidgetSize('music')} className={`group relative bg-gradient-to-br from-pink-500/40 to-purple-600/40 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/10 text-white pointer-events-auto flex items-center gap-2 transition-transform ${widgetSizeClass('music')} ${isEditMode ? 'cursor-pointer animate-wiggle' : ''}`}>
            <Music2 size={27} aria-hidden="true"/><div className="text-xs">재생 중</div>
            {isEditMode && <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-lg" onClick={(e) => { e.stopPropagation(); setWidgets(w => w.filter(x => x !== 'music')); }}>×</button>}
          </div>
        )}
        {widgets.includes('fitness') && (
          <div onClick={() => isEditMode && cycleWidgetSize('fitness')} className={`group relative bg-gradient-to-br from-green-500/40 to-emerald-600/40 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/10 text-white pointer-events-auto flex items-center gap-2 transition-transform ${widgetSizeClass('fitness')} ${isEditMode ? 'cursor-pointer animate-wiggle' : ''}`}>
            <Footprints size={27} aria-hidden="true"/><div className="text-xs">5,280 걸음</div>
            {isEditMode && <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-lg" onClick={(e) => { e.stopPropagation(); setWidgets(w => w.filter(x => x !== 'fitness')); }}>×</button>}
          </div>
        )}
      </div>

      {/* App grid — One UI tablet home grid */}
      <div
        key={`page-${currentPage}`}
        className="oneui-home-apps flex-1 flex flex-col justify-center min-h-0 animate-[fadeIn_0.25s_ease-out]"
        style={{
          paddingTop: 'calc(var(--oneui-statusbar-h) + var(--oneui-home-pad-top) + 78px)',
          paddingBottom: 'var(--oneui-home-reserve)',
        }}
      >
        <div
          className={`oneui-home-grid grid w-full max-w-[1240px] justify-items-center self-center ${isPhone ? 'grid-cols-4' : 'grid-cols-4 md:grid-cols-8'}`}
          style={{
            columnGap: 'var(--oneui-home-grid-gap-x)',
            rowGap: 'var(--oneui-home-grid-gap-y)',
            paddingLeft: 'var(--oneui-home-pad-x)',
            paddingRight: 'var(--oneui-home-pad-x)',
          }}
        >
          {(() => {
            const slots: any[] = [...homeApps];
            const extras: string[] = [];
            if (currentPage === 0 && installedApps.includes('math') && !isEditMode) extras.push('__math');
            if (currentPage === 0) PLAYSTORE_APPS.forEach(a => { if (installedApps.includes(a.id)) extras.push(`__ps:${a.id}`); });
            for (const ex of extras) {
              const i = slots.indexOf(null);
              if (i >= 0) slots[i] = ex; else slots.push(ex);
            }
            const iconBox = { width: 'var(--oneui-home-icon-size)', height: 'var(--oneui-home-icon-size)' } as const;
            const cellBox = { width: 'calc(var(--oneui-home-icon-size) + 48px)', maxWidth: '100%' } as const;
            const labelStyle = { fontSize: 'var(--oneui-home-label-size)' } as const;
            // Reflow tablet storage slots on a phone without changing their identity.
            // Rendering 40 empty-inclusive slots as 10 rows pushed the first icons
            // above the screen. Edit mode retains real spare slots for drag/drop.
            const indexedSlots = slots.map((appName, index) => ({ appName, index }));
            const displaySlots = isPhone
              ? [...indexedSlots.filter(slot => slot.appName), ...indexedSlots.filter(slot => !slot.appName).slice(0, isEditMode ? 4 : 0)]
              : indexedSlots;
            return displaySlots.map(({ appName, index }) => {
              if (appName === '__math') {
                return (
                  <ActionTarget
                    key={`math-${index}`} id="app-icon-math" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                    onClick={() => setMathAppOpen(true)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer group oneui-press"
                    style={cellBox}
                  >
                    <div style={iconBox}><GalaxyAppIcon appName="math"/></div>
                    <span style={labelStyle} className="oneui-app-label text-white font-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] truncate w-full text-center leading-tight">수학탐험대</span>
                  </ActionTarget>
                );
              }
              if (typeof appName === 'string' && appName.startsWith('__ps:')) {
                const id = appName.slice(5);
                const app = PLAYSTORE_APPS.find(a => a.id === id);
                if (!app) return null;
                return (
                  <div key={`ps-${index}`} onClick={() => alert(`${app.name} 앱이 실행되었어요! (시뮬레이션)`)} style={cellBox} className="flex flex-col items-center gap-1.5 cursor-pointer group oneui-press">
                    <div style={iconBox}><GalaxyAppIcon appName={app.id}/></div>
                    <span style={labelStyle} className="oneui-app-label text-white font-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] truncate w-full text-center leading-tight">{app.name}</span>
                  </div>
                );
              }
              if (appName) return <div key={index} data-slot-idx={index} className={isPhone ? 'min-w-0 w-full flex justify-center' : undefined}>{renderAppIcon(appName, index)}</div>;
              return (
                <ActionTarget
                  key={index} id={`empty-slot-${index}`} currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                  style={iconBox}
                  className={`${isEditMode ? 'border border-dashed border-white/40 rounded-[22%] bg-white/5 transition-colors' : ''}`}
                ><div data-slot-idx={index} className="w-full h-full"></div></ActionTarget>
              );
            });
          })()}
        </div>
      </div>
      </div>

      {/* ── 하단 chrome: page indicator → Finder → Taskbar (서로 겹치지 않는 safe area) ── */}
      <div
        className="oneui-home-chrome absolute left-0 right-0 z-[10] flex flex-col items-center pointer-events-none"
        style={{ bottom: isPhone ? 'var(--oneui-phone-dock-h)' : 'var(--oneui-taskbar-h)' }}
      >
        {/* Page indicator — One UI 처럼 작은 dot */}
        <div className="flex items-center justify-center gap-1.5 pointer-events-auto" style={{ height: 'var(--oneui-indicator-h)' }}>
          {homePages.map((_, i) => (
            <button
              key={i}
              aria-label={`홈 ${i + 1}페이지`}
              onClick={(e) => { e.stopPropagation(); setCurrentPage(i); }}
              className={isPhone ? 'oneui-phone-page-dot' : `rounded-full transition-colors ${i === currentPage ? 'w-[7px] h-[7px] bg-white' : 'w-[6px] h-[6px] bg-white/35'}`}
              aria-current={i === currentPage ? 'page' : undefined}
            >{isPhone && <span className={`block rounded-full transition-colors ${i === currentPage ? 'w-[7px] h-[7px] bg-white' : 'w-[6px] h-[6px] bg-white/35'}`}/>}</button>
          ))}
        </div>

        {/* Finder (Samsung 검색 pill) */}
        <button
          type="button" aria-label="앱 검색 및 앱스 열기"
          className="oneui-home-finder pointer-events-auto mt-1.5 mb-2 w-[min(46%,440px)] min-w-[220px] bg-black/25 backdrop-blur-sm rounded-full flex items-center gap-2 px-4 border border-white/15 oneui-press cursor-pointer text-left"
          style={{ height: 'var(--oneui-finder-h)' }}
          onClick={() => setAppDrawerOpen(true)}
        >
          <Search size={16} className="text-white/80 shrink-0" />
          <span className="text-white/80 text-[13px] flex-1 truncate">검색</span>
          <Mic size={15} className="text-white/70 shrink-0" />
        </button>
      </div>

      {/* Galaxy Tab Taskbar — NavigationBar 와 분리된 별도 영역 */}
      {!isPhone && (
        <div
          className="absolute left-0 right-0 bottom-0 z-[12] flex items-center justify-center"
          style={{ height: 'var(--oneui-taskbar-h)' }}
          onTouchStart={(e) => setDrawerSwipeStart(e.touches[0].clientY)}
          onTouchMove={(e) => {
            if (drawerSwipeStart !== null && drawerSwipeStart - e.touches[0].clientY > 60) {
              setAppDrawerOpen(true);
              setDrawerSwipeStart(null);
            }
          }}
          onTouchEnd={() => setDrawerSwipeStart(null)}
        >
          <div className="flex items-center gap-3 md:gap-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/10">
            {/* 앱스 화면 진입 */}
            <button
              aria-label="앱스 화면"
              onClick={() => setAppDrawerOpen(true)}
              className="w-8 h-8 rounded-full grid grid-cols-2 grid-rows-2 gap-[3px] p-[7px] bg-white/15 oneui-press"
            >
              {[0, 1, 2, 3].map(i => <span key={i} className="rounded-[1px] bg-white/90" />)}
            </button>
            <div className="w-px h-6 bg-white/15" />
            {taskbarPinned.map(app => (
              <div key={`tb-${app}`} className="relative">
                {renderAppIcon(app, -1, false, 'taskbar')}
                {currentApp === app && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            ))}
            {taskbarRecents.length > 0 && <div className="w-px h-6 bg-white/15" />}
            {taskbarRecents.map(app => (
              <div key={`tb-recent-${app}`} className="relative opacity-90">
                {renderAppIcon(app, -1, false, 'taskbar')}
                {currentApp === app && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Galaxy phone dock, kept clear of Finder and the navigation buttons. */}
      {isPhone && (
        <div
          className="oneui-phone-dock absolute bottom-0 left-0 right-0 grid grid-cols-4 items-center justify-items-center"
          aria-label="즐겨찾는 앱"
          onTouchStart={(e) => setDrawerSwipeStart(e.touches[0].clientY)}
          onTouchMove={(e) => {
            if (drawerSwipeStart !== null && drawerSwipeStart - e.touches[0].clientY > 60) {
              setAppDrawerOpen(true);
              setDrawerSwipeStart(null);
            }
          }}
          onTouchEnd={() => setDrawerSwipeStart(null)}
        >
          {phoneDockApps.map(app => <div key={`phone-dock-${app}`}>{renderAppIcon(app, -1, false, 'taskbar')}</div>)}
        </div>
      )}


      {dragInfo.isDragging && (
        <div id="drag-ghost" className="fixed pointer-events-none z-[200] opacity-80" style={{ left: dragInfo.x - dragInfo.offsetX, top: dragInfo.y - dragInfo.offsetY }}>
          {renderAppIcon(homeApps[dragInfo.index as number], dragInfo.index as number, false)}
        </div>
      )}

      {/* App Drawer overlay */}
      {appDrawerOpen && (
        <div
          className="oneui-apps-drawer absolute inset-0 z-[90] bg-black/80 backdrop-blur-xl animate-[slideUp_0.3s_ease-out] flex flex-col"
          style={{ paddingTop: 'calc(var(--oneui-statusbar-h) + var(--oneui-drawer-pad-top))' }}
          onTouchStart={(e) => setDrawerSwipeStart(e.touches[0].clientY)}
          onTouchMove={(e) => {
            if (drawerSwipeStart !== null && e.touches[0].clientY - drawerSwipeStart > 70) {
              cancelDrawerLongPress(); drawerPressMoved.current = true;
              setAppDrawerOpen(false); setDrawerSearch(''); setDrawerSwipeStart(null);
            }
          }}
          onTouchEnd={() => setDrawerSwipeStart(null)}
          onTouchCancel={() => { setDrawerSwipeStart(null); cancelDrawerLongPress(); }}
        >
          {/* 닫기 (기존 동작 유지) */}
          <button
            aria-label="앱스 화면 닫기"
            className="oneui-drawer-close absolute right-5 w-9 h-9 rounded-full bg-white/10 md:hover:bg-white/20 flex items-center justify-center text-white oneui-press z-[2]"
            style={{ top: 'calc(var(--oneui-statusbar-h) + 8px)' }}
            onClick={() => { setAppDrawerOpen(false); setDrawerSearch(''); }}
          >
            <X size={18}/>
          </button>

          {/* App Grid */}
          <div
            className="oneui-drawer-grid-scroll flex-1 overflow-y-auto min-h-0"
            style={{
              paddingLeft: 'var(--oneui-drawer-pad-x)',
              paddingRight: 'var(--oneui-drawer-pad-x)',
              paddingBottom: 'var(--oneui-drawer-reserve)',
            }}
          >
            {(() => {
              const all = [...new Set([...DRAWER_APPS_WITH_SCREEN, ...homePages.flat().filter((a: any): a is string => typeof a === 'string' && DRAWER_APPS_WITH_SCREEN.includes(a)), ...installedApps.filter(a => a === 'math')])];
              const filtered = drawerSearch
                ? all.filter(a => `${a} ${APP_LABELS[a] ?? ''}`.toLowerCase().replace(/\s/g, '').includes(drawerSearch.toLowerCase().replace(/\s/g, '')))
                : all;
              return (
            <div
              className={`oneui-drawer-grid grid justify-items-center ${isPhone ? 'grid-cols-4' : 'grid-cols-4 md:grid-cols-8'}`}
              style={{ columnGap: 'var(--oneui-drawer-gap-x)', rowGap: 'var(--oneui-drawer-gap-y)' }}
            >
              {filtered.map((appName, i) => (
                <div
                  key={`drawer-${appName}-${i}`}
                  className="min-w-0 w-full flex flex-col items-center cursor-pointer group oneui-press"
                  onClick={() => {
                    cancelDrawerLongPress();
                    // 명확한 스와이프 동작은 앱 실행으로 처리하지 않는다
                    if (drawerPressMoved.current) { drawerPressMoved.current = false; return; }
                    if (appName === 'math') { setMathAppOpen(true); setAppDrawerOpen(false); advanceQuest('app-icon-math'); return; }
                    setAppDrawerOpen(false);
                    setDrawerSearch('');
                    onOpenApp(appName);
                    advanceQuest(`app-icon-${appName}`);
                  }}
                  onPointerDown={(e) => {
                    drawerPressStart.current = { x: e.clientX, y: e.clientY };
                    drawerPressMoved.current = false;
                  }}
                  onPointerMove={(e) => drawerPointerMoveCheck(e.clientX, e.clientY)}
                  onPointerCancel={cancelDrawerLongPress}
                  onMouseDown={() => startDrawerLongPress(appName)}
                  onMouseUp={cancelDrawerLongPress}
                  onMouseLeave={cancelDrawerLongPress}
                  onTouchStart={() => startDrawerLongPress(appName)}
                  onTouchMove={(e) => drawerPointerMoveCheck(e.touches[0].clientX, e.touches[0].clientY)}
                  onTouchEnd={() => {
                    cancelDrawerLongPress();
                    // 롱프레스 팝업이 열린 뒤 손가락을 떼는 시점을 기준으로 compat click 보호창을 다시 잡는다 (길게 누를수록 click 이 늦게 오므로)
                    if (uninstallOpenedAt.current) uninstallOpenedAt.current = Date.now();
                  }}
                  onTouchCancel={cancelDrawerLongPress}
                >
                  <div className="pointer-events-none min-w-0 w-full flex flex-col items-center">
                    {appName === 'math' ? (
                      <div className="flex flex-col items-center gap-1.5">
                        <div style={{ width: 'var(--oneui-drawer-icon-size)', height: 'var(--oneui-drawer-icon-size)' }}><GalaxyAppIcon appName="math"/></div>
                        <span className="oneui-app-label text-white truncate w-full text-center leading-tight" style={{ fontSize: 'var(--oneui-home-label-size)' }}>똑똑수학탐험대</span>
                      </div>
                    ) : renderAppIcon(appName, -1, false, 'drawer')}
                  </div>
                </div>
              ))}
            </div>
              );
            })()}
          </div>

          {/* Drawer Finder — 홈 Finder 와 동일한 pill 디자인 */}
          <div
            className="oneui-drawer-finder absolute left-0 right-0 z-[2] flex justify-center pointer-events-none"
            style={{ bottom: 'calc(var(--oneui-taskbar-h) + 8px)' }}
          >
            <div
              className="pointer-events-auto w-[min(46%,440px)] min-w-[220px] bg-black/30 backdrop-blur-sm rounded-full flex items-center gap-2 px-4 border border-white/15"
              style={{ height: 'var(--oneui-finder-h)' }}
            >
              <Search size={16} className="text-white/80 shrink-0"/>
              <input
                value={drawerSearch}
                onChange={(e) => setDrawerSearch(e.target.value)}
                aria-label="앱 이름 검색" placeholder="앱 이름 검색"
                className="flex-1 bg-transparent border-0 text-white placeholder-white/60 text-[13px] focus:outline-none min-w-0"
              />
              <Mic size={15} className="text-white/70 shrink-0"/>
            </div>
          </div>



          {/* Uninstall confirm */}
          {uninstallTarget && (
            <div
              className="absolute inset-0 z-[95] bg-black/60 flex items-center justify-center animate-[fadeIn_0.2s_ease-out]"
              onClick={() => {
                // 롱프레스 손가락을 떼는 순간 생기는 compat click(touchend 직후) 이 backdrop 에 떨어져 팝업이 바로 닫히는 것을 방지
                if (Date.now() - uninstallOpenedAt.current < 500) return;
                setUninstallTarget(null);
              }}
            >
              <div className="bg-[#1c1c1e] text-white rounded-3xl p-6 w-[340px] max-w-[calc(100%_-_24px)] max-h-[90%] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-3">
                  <Trash2 size={24} className="text-red-400"/>
                  <div className="text-lg font-bold">{uninstallTarget === 'math' ? '앱 삭제' : '기본 앱'}</div>
                </div>
                <div className="text-sm text-gray-300 mb-6 leading-relaxed">
                  <span className="font-bold text-white">{APP_LABELS[uninstallTarget]?.split(' ')[0] ?? uninstallTarget}</span>{uninstallTarget === 'math' ? ' 앱을 삭제할까요? 앱에 저장한 연습 자료도 사라질 수 있어요.' : '은(는) 기본 앱이에요. 이 연습에서는 삭제하지 않아요. 홈 화면에서 아이콘을 없애는 것과 앱 삭제는 달라요.'}
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all font-medium"
                    onClick={() => setUninstallTarget(null)}
                  >취소</button>
                  {uninstallTarget === 'math' && <button
                    className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 transition-all font-bold"
                    onClick={() => {
                      if (uninstallTarget === 'math') {
                        setInstalledApps(prev => prev.filter(a => a !== 'math'));
                        advanceQuest('app-uninstall');
                      } else {
                        setHomeApps(prev => prev.map(a => a === uninstallTarget ? null : a));
                      }
                      setUninstallTarget(null);
                    }}
                  >삭제</button>}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
