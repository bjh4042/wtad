// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import { useSimulatorStorage } from '@/hooks/useSimulatorStorage';
import MyFilesApp from './apps/MyFilesApp';
import ClockApp from './apps/ClockApp';
import CameraApp from './apps/CameraApp';
import NotesPracticeApp from './apps/NotesPracticeApp';
import CalendarPracticeApp from './apps/CalendarPracticeApp';
import {
  Wifi, Bluetooth, Volume2, VolumeX, Vibrate,
  Sun, Camera, Settings, Play, Search,
  ChevronLeft, BatteryMedium, Signal, Check, Trash2, X, GripHorizontal,
  Mic, MoreHorizontal, RefreshCcw, Plane, Flashlight, MapPin,
  MonitorPlay, ShieldCheck, User, Bell, ImageIcon, Home,
  Lock, ShieldAlert, AlertTriangle, HeartPulse, BatteryCharging,
  Grid, Sliders, Smartphone, PaintBucket, Moon, Type, ChevronUp,
  Cloud, MessageSquare, Power, Minus, Share2, Edit3, Heart, Zap, Menu,
  Music2, Phone, Headphones, Keyboard, Watch, Speaker, PanelsTopLeft, Palette
} from 'lucide-react';
import { QUESTS } from '@/data/quests';
import { DEFAULT_HOME_APPS, DEFAULT_WALLPAPER, DEFAULT_WIDGETS, emptyHomePage } from '@/data/homeDefaults';
import { useQuestEngine } from '@/hooks/useQuestEngine';
import { useDeviceState } from '@/hooks/useDeviceState';
import { useProgressStorage, clearProgress } from '@/hooks/useProgressStorage';
import { ActionTarget, CuteStudent } from '@/components/apps/shared';
import { SETTINGS_MENUS, WIFI_NETWORKS, PLAYSTORE_APPS, WIDGET_CATALOG, PERMISSION_ICONS, TARGET_SEQUENCE } from '@/data/appCatalog';
import { makeInternetTab } from '@/types/internet';
import type { InternetTab } from '@/types/internet';
import SettingsApp from '@/components/apps/SettingsApp';
import GalleryApp from '@/components/apps/GalleryApp';
import PlayStoreApp from '@/components/apps/PlayStoreApp';
import InternetApp from '@/components/apps/InternetApp';
import HomeScreen from '@/components/device/HomeScreen';
import { GalaxyAppIcon, GALAXY_APP_LABELS } from '@/components/device/GalaxyAppIcon';
import QuickPanel from '@/components/device/QuickPanel';
import StatusBar from '@/components/device/StatusBar';
import NavigationBar from '@/components/device/NavigationBar';
import LockScreen from '@/components/device/LockScreen';
import MissionCenter from '@/components/missions/MissionCenter';
import MissionListOverlay from '@/components/missions/MissionListOverlay';
import './mobile-shell.css';

function BluetoothDeviceIcon({ deviceId, size = 28 }: { deviceId: string; size?: number }) {
  const Icon = deviceId === 'bt-device-keyboard' ? Keyboard : deviceId === 'bt-device-watch' ? Watch : deviceId === 'bt-device-speaker' ? Speaker : Headphones;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}

// QUESTS 데이터는 src/data/quests.ts 로 분리됨




// SETTINGS_MENUS / WIFI_NETWORKS / PLAYSTORE_APPS / WIDGET_CATALOG / PERMISSION_ICONS / TARGET_SEQUENCE 는 src/data/appCatalog.tsx 로 분리

// CuteStudent / ActionTarget 는 src/components/apps/shared.tsx 로 분리


// 저장 로직: src/hooks/useProgressStorage.ts / 홈 기본값: src/data/homeDefaults.ts


export default function AndroidExplorer() {
  const [time, setTime] = useState<Date | null>(null);
  const [isPhone, setIsPhone] = useState<boolean>(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches);
  const settingsBackHandler = useRef<(() => boolean) | null>(null);
  const registerSettingsBackHandler = React.useCallback((handler: (() => boolean) | null) => { settingsBackHandler.current = handler; }, []);
  useEffect(() => {
    const mql = typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)') : null;
    if (!mql) return;
    const apply = () => setIsPhone(mql.matches);
    apply();
    mql.addEventListener?.('change', apply);
    return () => mql.removeEventListener?.('change', apply);
  }, []);


  // 기기 상태는 useDeviceState 로 분리 (identifier 는 그대로 유지)
  const device = useDeviceState();
  const {
    currentApp, setCurrentApp,
    wifi, setWifi, wifiConnected, setWifiConnected,
    bluetooth, setBluetooth, connectedBtDevice, setConnectedBtDevice,
    brightness, setBrightness, volume, setVolume,
    mediaVolume, setMediaVolume, ringVolume, setRingVolume, notifVolume, setNotifVolume,
    volumePanelOpen, setVolumePanelOpen, volumePanelType, setVolumePanelType, showVolumePanel, volumeCloseTimer,
    installedApps, setInstalledApps, wallpaper, setWallpaper,
    photos, setPhotos, notes, setNotes,
  } = device;
  const [airplane, setAirplane] = useState(false);
  const [soundMode, setSoundMode] = useState('sound');
  const [currentCameraSeed, setCurrentCameraSeed] = useState(() => Date.now());
  const [mathAppOpen, setMathAppOpen] = useState(false);
  const [mathInstallProgress, setMathInstallProgress] = useState<number | null>(null);

  const [homePages, setHomePages] = useState<any[][]>(() => [DEFAULT_HOME_APPS, emptyHomePage()]);
  const [currentPage, setCurrentPage] = useState(0);
  const homeApps = homePages[currentPage] ?? Array(40).fill(null);
  const setHomeApps: any = (updater: any) => {
    setHomePages(prev => {
      const next = prev.map(p => [...p]);
      const idx = Math.min(currentPage, next.length - 1);
      next[idx] = typeof updater === 'function' ? updater(prev[idx]) : updater;
      return next;
    });
  };
  const [pageSwipeStart, setPageSwipeStart] = useState<{ x: number; y: number } | null>(null);
  const [pageSwipeDX, setPageSwipeDX] = useState(0);
  const [homeFlashKey, setHomeFlashKey] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [appContextMenu, setAppContextMenu] = useState<{ appName: string; index: number } | null>(null);
  const pressTimer = useRef<any>(null);



  const [dragInfo, setDragInfo] = useState({ isDragging: false, index: null, x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const [hoverIndex, setHoverIndex] = useState(null);

  const [settingsMenu, setSettingsMenu] = useState('connections');
  const [quickPanelOpen, setQuickPanelOpen] = useState(false);
  const [wifiModalOpen, setWifiModalOpen] = useState(false);
  const [wifiPasswordInput, setWifiPasswordInput] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');

  const [searchText, setSearchText] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardShift, setKeyboardShift] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);

  // 삼성 인터넷 앱
  // 삼성 인터넷 타입/헬퍼는 src/types/internet.ts 로 분리
  const [internetTabs, setInternetTabs] = useState<InternetTab[]>([makeInternetTab(1)]);
  const [internetActiveTabId, setInternetActiveTabId] = useState<number>(1);
  const [internetUrlPanelOpen, setInternetUrlPanelOpen] = useState(false);
  const [internetTabSwitcherOpen, setInternetTabSwitcherOpen] = useState(false);
  const [internetBookmarks, setInternetBookmarks] = useState<{ title: string; url: string }[]>([]);
  const [internetMenuOpen, setInternetMenuOpen] = useState(false);
  const [internetKbInput, setInternetKbInput] = useState('');
  const [internetKbShift, setInternetKbShift] = useState(false);

  const [viewPhoto, setViewPhoto] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<number[]>([]);

  // 신규 상태들
  const [locked, setLocked] = useState(true);
  const [lockSwipeY, setLockSwipeY] = useState<number | null>(null);
  const [lockOffset, setLockOffset] = useState(0);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [fontScale, setFontScale] = useState<number>(1);
  const [widgetPages, setWidgetPages] = useState<string[][]>(() => DEFAULT_WIDGETS.map(p => [...p]));
  const widgets = widgetPages[currentPage] ?? [];
  const setWidgets: any = (updater: any) => {
    setWidgetPages(prev => {
      const next = prev.map(p => [...p]);
      const idx = Math.min(currentPage, next.length - 1);
      next[idx] = typeof updater === 'function' ? updater(prev[idx]) : updater;
      return next;
    });
  };
  const [widgetSizes, setWidgetSizes] = useState<Record<string, 'sm' | 'md' | 'lg'>>({});

  const [widgetPickerOpen, setWidgetPickerOpen] = useState(false);
  const [homeMenuOpen, setHomeMenuOpen] = useState(false);
  const [homeLongPressTimer, setHomeLongPressTimer] = useState<any>(null);
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const [drawerSwipeStart, setDrawerSwipeStart] = useState<number | null>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, app: 'KakaoTalk', appName: '톡톡', title: '엄마', body: '학교 끝나면 바로 와~', color: 'bg-yellow-400' },
    { id: 2, app: 'Messages', appName: '메시지', title: '010-1234-5678', body: '[Web발신] 택배가 도착했습니다.', color: 'bg-blue-500' },
    { id: 3, app: 'Gmail', appName: '메일', title: '탐험대', body: '새로운 기기에서 로그인되었습니다.', color: 'bg-red-500' },
  ]);
  const [notifDrag, setNotifDrag] = useState<{ id: number; startX: number; dx: number } | null>(null);
  const [readNotifIds, setReadNotifIds] = useState<number[]>([]);
  // 탐험대 계정 로그인
  const [googleLoginOpen, setGoogleLoginOpen] = useState(false);
  const [googleLoginStep, setGoogleLoginStep] = useState<'email' | 'password' | 'consent' | 'syncing' | 'done'>('email');
  const [googleEmail, setGoogleEmail] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [googleError, setGoogleError] = useState('');
  const [googleConsent, setGoogleConsent] = useState(false);
  const [googleAccount, setGoogleAccount] = useState<string | null>(null);
  const [accountAddOpen, setAccountAddOpen] = useState(false);
  const [googleShake, setGoogleShake] = useState(0);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const googleEmailRef = useRef<HTMLInputElement>(null);
  const googlePasswordRef = useRef<HTMLInputElement>(null);
  // Play Store 업데이트
  const [playStoreView, setPlayStoreView] = useState<'home' | 'manage'>('home');
  const [playStoreProfileOpen, setPlayStoreProfileOpen] = useState(false);
  const [updatingAll, setUpdatingAll] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [appsUpdated, setAppsUpdated] = useState(false);
  // 앱별 업데이트 진행 상태
  const [appUpdateStatus, setAppUpdateStatus] = useState<Record<string, 'pending'|'downloading'|'installing'|'done'>>({});
  const [appUpdateProgress, setAppUpdateProgress] = useState<Record<string, number>>({});
  const [cameraPermissionAsked, setCameraPermissionAsked] = useState(false);
  const [cameraPermissionPrompt, setCameraPermissionPrompt] = useState(false);
  const [settingsSearch, setSettingsSearch] = useState('');
  const [uninstallTarget, setUninstallTarget] = useState<string | null>(null);
  const [drawerLongPressTimer, setDrawerLongPressTimer] = useState<any>(null);

  const [themeColor, setThemeColor] = useState<string>('#3b82f6');
  const [recentAppsOpen, setRecentAppsOpen] = useState(false);
  const [recentApps, setRecentApps] = useState<string[]>([]);
  const [splitScreen, setSplitScreen] = useState<{ top: string; bottom: string } | null>(null);
  const [appPermissions, setAppPermissions] = useState<Record<string, Record<string, boolean>>>({
    Camera: { 카메라: true, 마이크: true, 위치: false, 저장공간: true },
    Gallery: { 카메라: false, 마이크: false, 위치: false, 저장공간: true },
    Messages: { 카메라: false, 마이크: false, 위치: false, 연락처: true },
    PlayStore: { 카메라: false, 마이크: false, 위치: true, 저장공간: true },
    KakaoTalk: { 카메라: true, 마이크: true, 위치: false, 연락처: true },
  });
  const [playStoreQuery, setPlayStoreQuery] = useState('');

  // 신규: 블루투스 기기 / 노트
  const [bluetoothModalOpen, setBluetoothModalOpen] = useState(false);
  const [btPairingDevice, setBtPairingDevice] = useState<{ id: string; name: string } | null>(null);
  const [btPairingPin, setBtPairingPin] = useState<string>('');
  const [notesEditing, setNotesEditing] = useState<{ paths: string[]; current: string } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Calculator
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrev, setCalcPrev] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [calcJustEvaluated, setCalcJustEvaluated] = useState(false);

  // Photo viewer zoom
  const [photoZoom, setPhotoZoom] = useState(1);

  // 퀘스트 진행 로직은 useQuestEngine 으로 분리
  const questEngine = useQuestEngine();
  const {
    questIdx, setQuestIdx, exp, setExp, completedQuests, setCompletedQuests,
    currentTargetId: engineTargetId, advanceQuest: engineAdvanceQuest, gotoQuest: engineGotoQuest, resetQuestProgress,
    confettiKey, rewardToast, levelUpFlash,
  } = questEngine;
  const [practiceMode, setPracticeMode] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(() => {try{return !localStorage.getItem('android-explorer-welcome-v3')}catch{return true}});
  const [notice, setNotice] = useState('');
  const [captureBusy, setCaptureBusy] = useState(false);
  const deviceScreenRef = useRef<HTMLDivElement>(null);
  const currentTargetId = practiceMode ? null : engineTargetId;
  const advanceQuest = (target: string) => { if (!practiceMode) engineAdvanceQuest(target); };
  const gotoQuest = (idx:number) => { engineGotoQuest(idx); setNotice('복습 미션을 골랐어요. 필요한 화면은 아래 현재 미션으로 버튼으로 열 수 있어요.'); };
  const [drawerSearch, setDrawerSearch] = useState('');
  const [appLaunchKey, setAppLaunchKey] = useState(0);
  const [showExpMenu, setShowExpMenu] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [expPos, setExpPos] = useState({ x: 26, y: 92 });
  const [isDraggingExp, setIsDraggingExp] = useState(false);
  const dragRefExp = useRef(null);
  const expMenuRef = useRef(null);
  const [touchStartY, setTouchStartY] = useState(null);
  // 시스템 패널 모드: 왼쪽 위에서 내리면 알림, 오른쪽 위에서 내리면 빠른 설정
  const [panelMode, setPanelMode] = useState<'quick' | 'notifications' | null>(null);
  const swipeStartX = useRef<number>(0);
  const resolvePanelMode = (): 'quick' | 'notifications' => {
    const bounds = deviceScreenRef.current?.getBoundingClientRect();
    return swipeStartX.current > (bounds ? bounds.left + bounds.width * .55 : window.innerWidth * .55) ? 'quick' : 'notifications';
  };

  // 미션 리스트 팝업 (12번)
  const [missionListOpen, setMissionListOpen] = useState(false);
  const [missionListCompact, setMissionListCompact] = useState(false);
  const [missionListPos, setMissionListPos] = useState({ x: 420, y: 60 });
  const [isDraggingList, setIsDraggingList] = useState(false);
  const dragRefList = useRef<any>(null);
  const missionListRef = useRef<any>(null);


  // 측면 하드웨어 버튼: 음량 패널 / 전원 메뉴
  const [powerMenuOpen, setPowerMenuOpen] = useState(false);
  const [powerOff, setPowerOff] = useState(false);

  // 최근 앱 카드 스와이프(위로 밀어 닫기)
  const [recentSwipe, setRecentSwipe] = useState<{ index: number; startY: number; dy: number } | null>(null);







  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 진행도 로드/저장 + 레거시 호환은 useProgressStorage 담당
  const { isStorageReady, storageError: progressStorageError } = useProgressStorage(
    {
      questIdx, exp, completedQuests, installedApps, homePages, widgetPages, widgetSizes,
      wallpaper, darkMode, fontScale, themeColor,
    },
    (loaded) => {
      setInstalledApps(loaded.installedApps);
      setWallpaper(loaded.wallpaper);
      setHomePages(loaded.homePages);
      setDarkMode(loaded.darkMode);
      setFontScale(loaded.fontScale);
      setWidgetPages(loaded.widgetPages);
      setWidgetSizes(loaded.widgetSizes);
      setThemeColor(loaded.themeColor);
      setQuestIdx(loaded.questIdx);
      setExp(loaded.exp);
      setCompletedQuests(loaded.completedQuests);
    },
  );

  const {storageError: sessionStorageError} = useSimulatorStorage(
    {photos,notes,wifi,wifiConnected,bluetooth,connectedBtDevice,brightness,mediaVolume,notifVolume,airplane,soundMode,currentApp,locked,quickPanelOpen,panelMode,settingsMenu,viewPhoto,internetTabs,internetActiveTabId,internetBookmarks,googleAccount,notifications,readNotifIds,recentApps,appsUpdated},
    data => {
      if(Array.isArray(data.photos))setPhotos(data.photos.filter(p=>p&&Number.isFinite(p.id)&&Number.isFinite(p.seed)).slice(-30));
      if(Array.isArray(data.notes))setNotes(data.notes.filter(n=>n&&Array.isArray(n.paths)).slice(-50));
      setWifi(!!data.wifi);setWifiConnected(typeof data.wifiConnected==='string'?data.wifiConnected:null);
      setBluetooth(!!data.bluetooth);setConnectedBtDevice(typeof data.connectedBtDevice==='string'?data.connectedBtDevice:null);
      for(const [key,setter] of [['brightness',setBrightness],['mediaVolume',setMediaVolume],['notifVolume',setNotifVolume]] as any) if(Number.isFinite(data[key]))setter(Math.max(0,Math.min(100,data[key])));
      setAirplane(!!data.airplane);if(['sound','vibrate','mute'].includes(data.soundMode))setSoundMode(data.soundMode);
      if(typeof data.currentApp==='string'||data.currentApp===null)setCurrentApp(data.currentApp);
      setLocked(data.locked===true);setQuickPanelOpen(!!data.quickPanelOpen);if(['quick','notifications',null].includes(data.panelMode))setPanelMode(data.panelMode);
      if(typeof data.settingsMenu==='string')setSettingsMenu(data.settingsMenu);if(data.viewPhoto&&typeof data.viewPhoto==='object')setViewPhoto(data.viewPhoto);
      if(Array.isArray(data.internetTabs)){const tabs=data.internetTabs.filter(t=>t&&Number.isFinite(t.id)&&typeof t.title==='string'&&typeof t.url==='string'&&['newtab','results','site','naver','google'].includes(t.view)&&Array.isArray(t.history)&&t.history.length>0&&t.history.every(h=>h&&typeof h.title==='string'&&typeof h.url==='string'&&['newtab','results','site','naver','google'].includes(h.view))&&Number.isInteger(t.historyIndex)&&t.historyIndex>=0&&t.historyIndex<t.history.length).slice(0,20);if(tabs.length){setInternetTabs(tabs);setInternetActiveTabId(tabs.some(t=>t.id===data.internetActiveTabId)?data.internetActiveTabId:tabs[0].id);}}
      if(Array.isArray(data.internetBookmarks))setInternetBookmarks(data.internetBookmarks.filter(b=>b&&typeof b.title==='string'&&typeof b.url==='string').slice(0,50));
      if(typeof data.googleAccount==='string')setGoogleAccount(data.googleAccount);
      if(Array.isArray(data.notifications))setNotifications(data.notifications.filter(n=>n&&Number.isFinite(n.id)&&typeof n.title==='string'&&typeof n.body==='string'&&typeof n.app==='string'&&typeof n.appName==='string'&&typeof n.color==='string').slice(0,30));if(Array.isArray(data.readNotifIds))setReadNotifIds(data.readNotifIds.filter(Number.isFinite));
      if(Array.isArray(data.recentApps))setRecentApps(data.recentApps.filter(a=>typeof a==='string').slice(0,5));setAppsUpdated(!!data.appsUpdated);
    }
  );

  const timeStr = time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--';
  const dateStr = time ? time.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }) : '';

  // 최근 사용 앱 추적
  useEffect(() => {
    if (currentApp) {
      setRecentApps(prev => [currentApp, ...prev.filter(a => a !== currentApp)].slice(0, 5));
    }
  }, [currentApp]);

  // 앱 전환 애니메이션 트리거
  useEffect(() => { setAppLaunchKey(k => k + 1); }, [currentApp]);

  // 사진 뷰어 진입 시 줌 리셋
  useEffect(() => { setPhotoZoom(1); }, [viewPhoto]);


  // Google 로그인 입력 자동 포커스 (단계 변경/오류 시)
  useEffect(() => {
    if (!googleLoginOpen) return;
    const t = setTimeout(() => {
      if (googleLoginStep === 'email') googleEmailRef.current?.focus();
      else if (googleLoginStep === 'password') googlePasswordRef.current?.focus();
    }, 80);
    return () => clearTimeout(t);
  }, [googleLoginOpen, googleLoginStep, googleShake]);







  // advanceQuest / 마지막 미션 자동 완료 / 중복 EXP 방지 → useQuestEngine



  const resetProgress = () => {
    const error=clearProgress();
    if(error){setNotice(error);return;}
    window.location.reload();
  };

  const handleDragStartExp = (e) => {
    setIsDraggingExp(true);
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    dragRefExp.current = { startX: clientX, startY: clientY, initX: expPos.x, initY: expPos.y };
  };

  const handleDragStartList = (e) => {
    setIsDraggingList(true);
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    dragRefList.current = { startX: clientX, startY: clientY, initX: missionListPos.x, initY: missionListPos.y };
  };

  const handleGlobalMove = (e) => {
    if (isDraggingExp && expMenuRef.current && dragRefExp.current) {
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragRefExp.current.startX;
      const dy = clientY - dragRefExp.current.startY;
      expMenuRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      expMenuRef.current.style.willChange = 'transform';
      dragRefExp.current.lastDx = dx;
      dragRefExp.current.lastDy = dy;
    }
    if (isDraggingList && missionListRef.current && dragRefList.current) {
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragRefList.current.startX;
      const dy = clientY - dragRefList.current.startY;
      missionListRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      missionListRef.current.style.willChange = 'transform';
      dragRefList.current.lastDx = dx;
      dragRefList.current.lastDy = dy;
    }
    if (touchStartY !== null && !dragInfo.isDragging) {
      const currentY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      if (!quickPanelOpen && currentY - touchStartY > 15) {
        const nextMode=resolvePanelMode();
        setPanelMode(nextMode);
        setQuickPanelOpen(true);
        advanceQuest(nextMode === 'quick' ? 'swipe-trigger' : 'notification-trigger');
        setTouchStartY(null);
      } else if (quickPanelOpen && touchStartY - currentY > 15) {
        setQuickPanelOpen(false);
        setPanelMode(null);
        advanceQuest('quick-panel-bg');
        setTouchStartY(null);
      }
    }
  };



  const handleGlobalEnd = () => {
    // 드래그 중에는 래퍼의 transform 만 DOM 으로 직접 조작하고,
    // 종료 시 최종 좌표만 state(top/left)에 반영한다. (React 가 같은 속성을 렌더하지 않음)
    if (isDraggingExp && expMenuRef.current && dragRefExp.current) {
      const dx = dragRefExp.current.lastDx || 0;
      const dy = dragRefExp.current.lastDy || 0;
      expMenuRef.current.style.transform = '';
      expMenuRef.current.style.willChange = '';
      setExpPos({
        x: dragRefExp.current.initX + dx,
        y: dragRefExp.current.initY + dy
      });
    }
    if (isDraggingList && missionListRef.current && dragRefList.current) {
      const dx = dragRefList.current.lastDx || 0;
      const dy = dragRefList.current.lastDy || 0;
      missionListRef.current.style.transform = '';
      missionListRef.current.style.willChange = '';
      setMissionListPos({
        x: dragRefList.current.initX + dx,
        y: dragRefList.current.initY + dy
      });
    }
    setIsDraggingExp(false);
    setIsDraggingList(false);
    setTouchStartY(null);
  };


  const handleSwipeStart = (e) => {
    const isTouch = e.type.includes('touch');
    swipeStartX.current = isTouch ? e.touches[0].clientX : e.clientX;
    setTouchStartY(isTouch ? e.touches[0].clientY : e.clientY);
  };

  const handleAppPressStart = (appName, index?: number) => {
    if (isEditMode) return;
    pressTimer.current = setTimeout(() => {
      setIsEditMode(true);
      if (appName === 'Camera' && currentTargetId === 'app-icon-Camera-long-press') {
        advanceQuest('app-icon-Camera-long-press');
      }
    }, 550);
  };

  const handleAppPressEnd = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };

  const onPointerDown = (e, index) => {
    if (!isEditMode || !homeApps[index]) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragInfo({ isDragging: true, index, x: e.clientX, y: e.clientY, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top });
  };
  const onPointerMove = (e) => {
    if (!dragInfo.isDragging) return;
    setDragInfo(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
    const ghost = document.getElementById('drag-ghost');
    if (ghost) ghost.style.visibility = 'hidden';
    const elem = document.elementFromPoint(e.clientX, e.clientY);
    if (ghost) ghost.style.visibility = 'visible';
    const slot = elem?.closest('[data-slot-idx]');
    if (slot) setHoverIndex(parseInt(slot.getAttribute('data-slot-idx')));
    else setHoverIndex(null);
  };
  const onPointerUp = (e) => {
    if (!dragInfo.isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (hoverIndex !== null && hoverIndex !== dragInfo.index) {
      const newApps = [...homeApps];
      const temp = newApps[hoverIndex];
      newApps[hoverIndex] = newApps[dragInfo.index];
      newApps[dragInfo.index] = temp;
      setHomeApps(newApps);
      if (newApps[hoverIndex] === 'Camera' || newApps[dragInfo.index] === 'Camera') {
        advanceQuest('drag-camera');
        setIsEditMode(false);
      }
    }
    setDragInfo({ isDragging: false, index: null, x: 0, y: 0, offsetX: 0, offsetY: 0 });
    setHoverIndex(null);
  };

  const openApp = (appName: string) => {
    if (appName === 'PlayStore') { setIsSearched(false); setSearchText(''); setKeyboardOpen(false); setTypingIndex(0); setKeyboardShift(false); }
    setCurrentApp(appName);
  };

  const renderHome = () => (
    <HomeScreen
      isPhone={isPhone} time={time} timeStr={timeStr} dateStr={dateStr} wallpaper={wallpaper}
      currentTargetId={currentTargetId} advanceQuest={advanceQuest}
      homePages={homePages} setHomePages={setHomePages}
      currentPage={currentPage} setCurrentPage={setCurrentPage}
      homeApps={homeApps} setHomeApps={setHomeApps}
      widgets={widgets} setWidgets={setWidgets} setWidgetPages={setWidgetPages}
      widgetSizes={widgetSizes} setWidgetSizes={setWidgetSizes}
      isEditMode={isEditMode} setIsEditMode={setIsEditMode}
      homeFlashKey={homeFlashKey}
      pageSwipeStart={pageSwipeStart} setPageSwipeStart={setPageSwipeStart}
      pageSwipeDX={pageSwipeDX} setPageSwipeDX={setPageSwipeDX}
      homeLongPressTimer={homeLongPressTimer} setHomeLongPressTimer={setHomeLongPressTimer}
      setHomeMenuOpen={setHomeMenuOpen} setWidgetPickerOpen={setWidgetPickerOpen}
      installedApps={installedApps} setInstalledApps={setInstalledApps}
      notifications={notifications}
      dragInfo={dragInfo}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      handleAppPressStart={handleAppPressStart} handleAppPressEnd={handleAppPressEnd}
      onOpenApp={openApp} setMathAppOpen={setMathAppOpen}
      appDrawerOpen={appDrawerOpen} setAppDrawerOpen={setAppDrawerOpen}
      drawerSwipeStart={drawerSwipeStart} setDrawerSwipeStart={setDrawerSwipeStart}
      drawerSearch={drawerSearch} setDrawerSearch={setDrawerSearch}
      drawerLongPressTimer={drawerLongPressTimer} setDrawerLongPressTimer={setDrawerLongPressTimer}
      uninstallTarget={uninstallTarget} setUninstallTarget={setUninstallTarget}
      recentApps={recentApps} currentApp={currentApp}
    />

  );

  const renderSettings = () => (
    <SettingsApp
      isPhone={isPhone} onBackHandlerChange={registerSettingsBackHandler}
      onOpenApp={(id)=>openApp(id==='MyFiles'?'Folder':id)}
      mediaVolume={mediaVolume} setMediaVolume={setMediaVolume} notifVolume={notifVolume} setNotifVolume={setNotifVolume} soundMode={soundMode} setSoundMode={setSoundMode} setWifiConnected={setWifiConnected}
      onOpenWifi={()=>{setPanelMode("quick");setQuickPanelOpen(true);setWifiModalOpen(true);}} onOpenBluetooth={()=>setBluetoothModalOpen(true)}
      currentTargetId={currentTargetId} advanceQuest={advanceQuest}
      settingsSearch={settingsSearch} setSettingsSearch={setSettingsSearch}
      settingsMenu={settingsMenu} setSettingsMenu={setSettingsMenu}
      wifi={wifi} setWifi={setWifi} wifiConnected={wifiConnected}
      bluetooth={bluetooth} setBluetooth={setBluetooth}
      airplane={airplane} setAirplane={setAirplane}
      brightness={brightness} setBrightness={setBrightness}
      darkMode={darkMode} setDarkMode={setDarkMode}
      fontScale={fontScale} setFontScale={setFontScale}
      wallpaper={wallpaper} setWallpaper={setWallpaper}
      themeColor={themeColor} setThemeColor={setThemeColor}
      photos={photos}
      appPermissions={appPermissions} setAppPermissions={setAppPermissions}
      googleAccount={googleAccount} setGoogleAccount={setGoogleAccount}
      logoutConfirmOpen={logoutConfirmOpen} setLogoutConfirmOpen={setLogoutConfirmOpen}
      accountAddOpen={accountAddOpen} setAccountAddOpen={setAccountAddOpen}
      setGoogleEmail={setGoogleEmail} setGooglePassword={setGooglePassword}
      setGoogleConsent={setGoogleConsent} setGoogleError={setGoogleError}
      setGoogleLoginStep={setGoogleLoginStep} setGoogleLoginOpen={setGoogleLoginOpen}
    />
  );

  const renderStatusBar = () => (
    <StatusBar
      setPanelMode={setPanelMode}
      currentTargetId={currentTargetId} advanceQuest={advanceQuest}
      quickPanelOpen={quickPanelOpen} setQuickPanelOpen={setQuickPanelOpen}
      handleSwipeStart={handleSwipeStart}
      timeStr={timeStr} notifications={notifications}
      airplane={airplane} wifiConnected={wifiConnected}
      bluetooth={bluetooth} soundMode={soundMode}
    />
  );


  const renderQuickPanel = () => (
    <QuickPanel
      isPhone={isPhone}
      onScreenshot={()=>captureScreen("quick-screenshot")}
      onPowerMenu={()=>{setQuickPanelOpen(false);setPowerMenuOpen(true);}}
      currentTargetId={currentTargetId} advanceQuest={advanceQuest}
      quickPanelOpen={quickPanelOpen} setQuickPanelOpen={setQuickPanelOpen}
      panelMode={panelMode} setPanelMode={setPanelMode}
      notifications={notifications} setNotifications={setNotifications}
      notifDrag={notifDrag} setNotifDrag={setNotifDrag}
      readNotifIds={readNotifIds} setReadNotifIds={setReadNotifIds}
      wifi={wifi} setWifi={setWifi} wifiConnected={wifiConnected} setWifiConnected={setWifiConnected}
      wifiModalOpen={wifiModalOpen} setWifiModalOpen={setWifiModalOpen}
      wifiPasswordInput={wifiPasswordInput} setWifiPasswordInput={setWifiPasswordInput}
      wifiPassword={wifiPassword} setWifiPassword={setWifiPassword}
      bluetooth={bluetooth} setBluetooth={setBluetooth}
      connectedBtDevice={connectedBtDevice} setBluetoothModalOpen={setBluetoothModalOpen}
      airplane={airplane} setAirplane={setAirplane}
      darkMode={darkMode} setDarkMode={setDarkMode}
      brightness={brightness} setBrightness={setBrightness}
      volume={mediaVolume} setVolume={setMediaVolume}
      soundMode={soundMode} setSoundMode={setSoundMode}
      setPhotos={setPhotos} setCurrentApp={setCurrentApp} setSettingsMenu={setSettingsMenu}
    />
  );

  const renderCamera = () => <CameraApp photos={photos} setPhotos={setPhotos} currentTargetId={currentTargetId} advanceQuest={advanceQuest} onOpenGallery={()=>setCurrentApp('Gallery')}/>;

  const renderGallery = () => (
    <GalleryApp
      currentTargetId={currentTargetId} advanceQuest={advanceQuest}
      photos={photos} setPhotos={setPhotos}
      viewPhoto={viewPhoto} setViewPhoto={setViewPhoto}
      deleteConfirm={deleteConfirm} setDeleteConfirm={setDeleteConfirm}
      photoZoom={photoZoom} setPhotoZoom={setPhotoZoom}
      multiSelectMode={multiSelectMode} setMultiSelectMode={setMultiSelectMode}
      selectedPhotoIds={selectedPhotoIds} setSelectedPhotoIds={setSelectedPhotoIds}
    />
  );

  const renderPlayStore = () => (
    <PlayStoreApp
      onOpenApp={(id)=>{if(id==="math"){setMathAppOpen(true);setCurrentApp(null);}else openApp(id);}} networkAvailable={wifi && !!wifiConnected}
      currentTargetId={currentTargetId} advanceQuest={advanceQuest}
      searchText={searchText} setSearchText={setSearchText}
      isSearched={isSearched} setIsSearched={setIsSearched}
      keyboardOpen={keyboardOpen} setKeyboardOpen={setKeyboardOpen}
      keyboardShift={keyboardShift} setKeyboardShift={setKeyboardShift}
      typingIndex={typingIndex} setTypingIndex={setTypingIndex}
      googleAccount={googleAccount}
      playStoreProfileOpen={playStoreProfileOpen} setPlayStoreProfileOpen={setPlayStoreProfileOpen}
      playStoreView={playStoreView} setPlayStoreView={setPlayStoreView}
      appsUpdated={appsUpdated} setAppsUpdated={setAppsUpdated}
      updatingAll={updatingAll} setUpdatingAll={setUpdatingAll}
      updateProgress={updateProgress} setUpdateProgress={setUpdateProgress}
      appUpdateStatus={appUpdateStatus} setAppUpdateStatus={setAppUpdateStatus}
      appUpdateProgress={appUpdateProgress} setAppUpdateProgress={setAppUpdateProgress}
      installedApps={installedApps} setInstalledApps={setInstalledApps}
      mathInstallProgress={mathInstallProgress} setMathInstallProgress={setMathInstallProgress}
    />
  );

  const renderCalculator = () => {
    const apply = (a: number, b: number, op: string) => {
      if (op === '+') return a + b;
      if (op === '−') return a - b;
      if (op === '×') return a * b;
      if (op === '÷') return b === 0 ? NaN : a / b;
      return b;
    };
    const inputDigit = (d: string) => {
      if (calcJustEvaluated) { setCalcDisplay(d); setCalcJustEvaluated(false); return; }
      setCalcDisplay(prev => prev === '0'||!Number.isFinite(Number(prev)) ? d : (prev.length<14?prev+d:prev));
    };
    const inputDot = () => {
      if (calcJustEvaluated) { setCalcDisplay('0.'); setCalcJustEvaluated(false); return; }
      if (!calcDisplay.includes('.')) setCalcDisplay(calcDisplay + '.');
    };
    const chooseOp = (op: string) => {
      const cur = parseFloat(calcDisplay);
      if (calcPrev !== null && calcOp && !calcJustEvaluated) {
        const r = apply(calcPrev, cur, calcOp);
        setCalcPrev(r);
        setCalcDisplay(Number.isFinite(r)?String(Number(r.toPrecision(12))):'계산할 수 없음');
      } else {
        setCalcPrev(cur);
      }
      setCalcOp(op);
      setCalcJustEvaluated(true);
    };
    const equals = () => {
      if (calcPrev === null || !calcOp) return;
      const cur = parseFloat(calcDisplay);
      const r = apply(calcPrev, cur, calcOp);
      setCalcDisplay(Number.isFinite(r)?String(Number(r.toPrecision(12))):'계산할 수 없음');
      setCalcPrev(null);
      setCalcOp(null);
      setCalcJustEvaluated(true);
      if (Math.abs(r - 96) < 1e-9) advanceQuest('calc-result-96');
    };
    const clear = () => { setCalcDisplay('0'); setCalcPrev(null); setCalcOp(null); setCalcJustEvaluated(false); };
    const Btn = ({ label, onPress, variant = 'num', targetId }: any) => (
      <ActionTarget id={targetId || `calc-btn-${label}`} currentTargetId={currentTargetId} advanceQuest={advanceQuest}
        disableClickAdvance={!targetId}
        onClick={onPress}
        className={`h-12 md:h-16 rounded-full text-2xl font-medium flex items-center justify-center active:scale-95 transition-all cursor-pointer select-none ${
          variant === 'op' ? 'bg-[#e6f3e4] text-[#258b37]'  :
          variant === 'fn' ? 'bg-[#f0f0f2] text-[#d74747]'  :
          'bg-[#f5f5f6] text-[#212124]' 
        }`}
      >
        <button type="button" aria-label={`계산기 ${label}`} className="w-full h-full rounded-full">{label}</button>
      </ActionTarget>
    );
    return (
      <div className="flex-1 bg-white text-slate-900 flex flex-col pt-4 px-4 pb-4 animate-[fadeIn_0.3s_ease-out] overflow-hidden min-h-0">
        <div className="text-right text-4xl md:text-6xl font-extralight px-4 pb-6 truncate tabular-nums" aria-live="polite">{calcDisplay}</div>
        <div className="grid grid-cols-4 gap-2">
          <Btn label="AC" variant="fn" onPress={clear}/>
          <Btn label="±" variant="fn" onPress={() => setCalcDisplay(d => d.startsWith('-') ? d.slice(1) : (d === '0' ? d : '-' + d))}/>
          <Btn label="%" variant="fn" onPress={() => setCalcDisplay(String(parseFloat(calcDisplay) / 100))}/>
          <Btn label="÷" variant="op" onPress={() => chooseOp('÷')}/>
          <Btn label="7" onPress={() => inputDigit('7')}/>
          <Btn label="8" onPress={() => inputDigit('8')} targetId="calc-key-8"/>
          <Btn label="9" onPress={() => inputDigit('9')}/>
          <Btn label="×" variant="op" onPress={() => chooseOp('×')} targetId="calc-key-mul"/>
          <Btn label="4" onPress={() => inputDigit('4')}/>
          <Btn label="5" onPress={() => inputDigit('5')}/>
          <Btn label="6" onPress={() => inputDigit('6')}/>
          <Btn label="−" variant="op" onPress={() => chooseOp('−')}/>
          <Btn label="1" onPress={() => inputDigit('1')} targetId="calc-key-1"/>
          <Btn label="2" onPress={() => inputDigit('2')} targetId="calc-key-2"/>
          <Btn label="3" onPress={() => inputDigit('3')}/>
          <Btn label="+" variant="op" onPress={() => chooseOp('+')}/>
          <ActionTarget id="calc-key-0" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
            onClick={() => inputDigit('0')}
            className="col-span-2 h-12 md:h-16 rounded-full text-2xl font-medium flex items-center justify-start pl-7 active:scale-95 transition-all cursor-pointer select-none bg-[#f5f5f6] text-[#212124]"
          ><button type="button" aria-label="계산기 0" className="w-full h-full text-left">0</button></ActionTarget>
          <Btn label="." onPress={inputDot}/>
          <Btn label="=" variant="op" onPress={equals} targetId="calc-key-eq"/>
        </div>
      </div>
    );
  };

  const renderNotes = () => <NotesPracticeApp notes={notes} setNotes={setNotes} currentTargetId={currentTargetId} advanceQuest={advanceQuest}/>;

  const renderInternet = () => (
    <InternetApp
      networkAvailable={wifi && !!wifiConnected}
      currentTargetId={currentTargetId} advanceQuest={advanceQuest}
      internetTabs={internetTabs} setInternetTabs={setInternetTabs}
      internetActiveTabId={internetActiveTabId} setInternetActiveTabId={setInternetActiveTabId}
      internetUrlPanelOpen={internetUrlPanelOpen} setInternetUrlPanelOpen={setInternetUrlPanelOpen}
      internetTabSwitcherOpen={internetTabSwitcherOpen} setInternetTabSwitcherOpen={setInternetTabSwitcherOpen}
      internetBookmarks={internetBookmarks} setInternetBookmarks={setInternetBookmarks}
      internetMenuOpen={internetMenuOpen} setInternetMenuOpen={setInternetMenuOpen}
      internetKbInput={internetKbInput} setInternetKbInput={setInternetKbInput}
      internetKbShift={internetKbShift} setInternetKbShift={setInternetKbShift}
    />
  );

  const homeButtonAction = () => {
    setSplitScreen(null); setRecentAppsOpen(false); setViewPhoto(null); setWifiModalOpen(false); setBluetoothModalOpen(false); setGoogleLoginOpen(false); setAccountAddOpen(false); setAppDrawerOpen(false); setWidgetPickerOpen(false); setHomeMenuOpen(false);
    setCurrentApp(null); setQuickPanelOpen(false); setIsEditMode(false); setKeyboardOpen(false);
    setSearchText(''); setIsSearched(false); setTypingIndex(0); setKeyboardShift(false); setMathAppOpen(false);
    setPlayStoreView('home'); setPlayStoreProfileOpen(false);
    setCurrentPage(0); setHomeFlashKey(k => k + 1); setAppLaunchKey(k => k + 1);
  };

  const renderNavigationBar = () => (
    <NavigationBar
      currentTargetId={currentTargetId}
      advanceQuest={advanceQuest}
      setRecentAppsOpen={setRecentAppsOpen}
      onHome={homeButtonAction} onBack={backAction}
    />
  );

  const backAction = () => {
    if(wifiModalOpen){setWifiModalOpen(false);return;}if(bluetoothModalOpen){setBluetoothModalOpen(false);return;}
    if(googleLoginOpen){setGoogleLoginOpen(false);return;}if(accountAddOpen){setAccountAddOpen(false);return;}
    if(quickPanelOpen){setQuickPanelOpen(false);return;}if(recentAppsOpen){setRecentAppsOpen(false);return;}
    if(splitScreen){setSplitScreen(null);return;}if(viewPhoto){setViewPhoto(null);return;}
    if(appDrawerOpen){setAppDrawerOpen(false);return;}if(widgetPickerOpen){setWidgetPickerOpen(false);return;}
    if(isEditMode){setIsEditMode(false);return;}if(mathAppOpen){setMathAppOpen(false);return;}
    if(currentApp==='Internet' && window.dispatchEvent(new Event('android-explorer-internet-back', {cancelable:true}))===false)return;
    if(currentApp==='Settings' && isPhone){if(!settingsBackHandler.current?.())homeButtonAction();return;}
    if(currentApp==='Settings' && settingsMenu!=='connections'){setSettingsMenu('connections');return;}
    homeButtonAction();
  };
  const captureScreen = async (target:string) => {
    if(captureBusy||!deviceScreenRef.current)return;
    setCaptureBusy(true);setQuickPanelOpen(false);setNotice('화면을 캡처하고 있어요…');
    await new Promise(resolve=>setTimeout(resolve,160));
    try{
      const src=await toPng(deviceScreenRef.current,{pixelRatio:.75,cacheBust:false,skipFonts:true,filter:node=>!(node instanceof HTMLElement && node.dataset.captureExclude==='true')});
      setPhotos(prev=>[...prev,{id:Date.now(),seed:0,kind:'screenshot',src,name:'스크린샷 '+new Date().toLocaleTimeString('ko-KR')}]);
      advanceQuest(target);if(target==='quick-screenshot'){setPanelMode('quick');setQuickPanelOpen(true);}setNotice('화면을 캡처했어요. 갤러리의 스크린샷에서 확인하세요.');
    }catch{setNotice('이 브라우저에서 화면 캡처가 완료되지 않았어요. 다시 시도해 주세요.');}
    finally{setCaptureBusy(false);}
  };
  const recoverLesson = () => {
    const t=engineTargetId||'';setPracticeMode(false);setLocked(t==='lock-swipe');setShowExpMenu(true);setIsCompact(true);setRecentAppsOpen(false);setSplitScreen(null);setQuickPanelOpen(false);setWifiModalOpen(false);setAppDrawerOpen(false);
    if(t==='lock-swipe'||t.startsWith('app-icon-')||t==='drag-camera'||t==='nav-home'){setCurrentApp(null);setIsEditMode(t==='drag-camera');}
    else if(t==='swipe-trigger'||t==='notification-trigger')setCurrentApp(null);
    else if(t.startsWith('quick-')||t.startsWith('wifi-')||t.startsWith('notif-')){setPanelMode(t.startsWith('notif-')?'notifications':'quick');setQuickPanelOpen(true);if(t.startsWith('wifi-')){setWifi(true);setWifiModalOpen(true);if(t==='wifi-pw-input'||t==='wifi-connect-btn'){setWifiPasswordInput('open');setWifiPassword('');}}}
    else if(t.startsWith('settings-')||t.startsWith('perm-')||t.startsWith('account-')||t.startsWith('google-')){if(currentApp==='Settings')setAppLaunchKey(key=>key+1);setCurrentApp('Settings');if(t.startsWith('perm-'))setSettingsMenu('privacy');if(t.startsWith('account-')||t.startsWith('google-'))setSettingsMenu('account');if(t==='account-google')setAccountAddOpen(true);if(['google-email-next','google-password-next','google-consent-agree','google-done'].includes(t)){setGoogleLoginOpen(true);setGoogleEmail('student@example.invalid');setGoogleLoginStep(t==='google-email-next'?'email':t==='google-password-next'?'password':t==='google-consent-agree'?'consent':'done');}if(t==='google-logout-confirm')setLogoutConfirmOpen(true);}
    else if(t.startsWith('gallery-')||t.startsWith('photo-'))setCurrentApp('Gallery');
    else if(t.startsWith('camera-'))setCurrentApp('Camera');
    else if(t.startsWith('bt-')){setBluetooth(true);setBluetoothModalOpen(true);if(t==='bt-pair-confirm'){setBtPairingDevice({id:'bt-device-buds',name:'무선 이어버드'});setBtPairingPin('482716');}}
    else if(t.startsWith('playstore-'))setCurrentApp('PlayStore');
    else if(t.startsWith('internet-')||t.startsWith('naver-'))setCurrentApp('Internet');
    else if(t.startsWith('notes-'))setCurrentApp('Notes');
    else if(t.startsWith('files-'))setCurrentApp('Folder');
    else if(t.startsWith('clock-'))setCurrentApp('Clock');
    else if(t.startsWith('calc-')){setCurrentApp('Calculator');setCalcDisplay('0');setCalcPrev(null);setCalcOp(null);}
    else if(t==='split-screen-open')setRecentAppsOpen(true);
    setNotice('현재 미션의 연습 화면을 열었어요. 직접 조작하면 완료돼요.');
  };
  useEffect(()=>{if(engineTargetId==='final-safety-check'){setIsCompact(false);setShowExpMenu(true);}},[engineTargetId]);
  useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),4500);return ()=>clearTimeout(timer);},[notice]);

  const handleLockSwipeStart = (e: any) => {
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    setLockSwipeY(y);
  };
  const handleLockSwipeMove = (e: any) => {
    if (lockSwipeY === null) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = Math.max(0, lockSwipeY - y);
    setLockOffset(delta);
  };
  const handleLockSwipeEnd = () => {
    if (lockSwipeY === null) return;
    if (lockOffset > 100) {
      setLocked(false);
      setLockOffset(0);
      if (currentTargetId === 'lock-swipe') advanceQuest('lock-swipe');
    } else {
      setLockOffset(0);
    }
    setLockSwipeY(null);
  };

  return (
    <div data-device={isPhone ? 'phone' : 'tablet'} className="explorer-shell fixed inset-0 w-full h-full bg-[#15243b] flex items-center justify-center overflow-hidden select-none oneui p-2 md:p-5 pt-16 md:pt-20" onMouseMove={(e) => { handleGlobalMove(e); handleLockSwipeMove(e); }} onTouchMove={(e) => { handleGlobalMove(e); handleLockSwipeMove(e); }} onMouseUp={(e) => { handleGlobalEnd(e); handleLockSwipeEnd(); }} onTouchEnd={(e) => { handleGlobalEnd(e); handleLockSwipeEnd(); }} onMouseLeave={(e) => { handleGlobalEnd(e); handleLockSwipeEnd(); }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes wiggle { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
        @keyframes pulseUp { 0%,100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-10px); opacity: 1; } }
        @keyframes appEnter { from { transform: scale(0.86); opacity: 0; filter: blur(6px); } to { transform: scale(1); opacity: 1; filter: blur(0); } }
        @keyframes confettiFall {
          0% { transform: translate3d(0,-20vh,0) rotate(0deg); opacity: 1; }
          100% { transform: translate3d(var(--cx, 0px), 110vh, 0) rotate(720deg); opacity: 0; }
        }
        @keyframes rewardPop {
          0% { transform: translate(-50%, -10%) scale(0.5); opacity: 0; }
          12% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
          88% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -90%) scale(0.95); opacity: 0; }
        }
        @keyframes levelUpFlash {
          0% { opacity: 0; transform: scale(0.5); }
          15% { opacity: 1; transform: scale(1.2); }
          70% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.4); }
        }
        @keyframes starPop {
          0% { transform: scale(0) rotate(-30deg); opacity: 0; }
          60% { transform: scale(1.3) rotate(10deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        .animate-wiggle { animation: wiggle 0.25s ease-in-out infinite; }
        .animate-pulse-up { animation: pulseUp 1.6s ease-in-out infinite; }
        .animate-app-enter { animation: appEnter 0.32s cubic-bezier(0.2, 0.8, 0.2, 1); transform-origin: center; }
        .animate-star-pop { animation: starPop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
      `}</style>



      <header className="explorer-header absolute inset-x-0 top-0 h-14 md:h-16 px-3 md:px-6 flex items-center gap-3 text-white z-[350] bg-[#15243b]">
        <div className="mr-auto"><h1 className="font-extrabold text-sm md:text-lg tracking-tight">안드로이드 탐험대 <span className="hidden sm:inline font-normal text-blue-200">/ 갤럭시탭 교실</span></h1><p className="hidden md:block text-[11px] text-slate-300">Android 17 · One UI 9 기준의 학습 시뮬레이션</p></div>
        <button className={`px-3 py-2 rounded-xl text-xs md:text-sm ${practiceMode?'bg-white/10':'bg-blue-500'}`} onClick={()=>{setPracticeMode(false);setShowExpMenu(true)}}>미션</button>
        <button className={`px-3 py-2 rounded-xl text-xs md:text-sm ${practiceMode?'bg-blue-500':'bg-white/10'}`} onClick={()=>{setPracticeMode(true);setLocked(false);setCurrentApp(null);setQuickPanelOpen(false)}}>자유 연습</button>
        <button onClick={()=>setWelcomeOpen(true)} className="px-3 py-2 bg-white/10 rounded-xl text-xs md:text-sm">도움말</button>
      </header>
      <details className="explorer-tools" open={isPhone ? undefined : true}>
        <summary>기기 조작 도구 <ChevronUp size={16}/></summary>
      <div className="explorer-tools-buttons absolute bottom-2 left-3 md:left-8 z-[350] flex gap-1.5 flex-wrap max-w-[65%]">
        <button onClick={()=>captureScreen('hardware-screenshot')} disabled={captureBusy||locked} title="실제 기기: 측면 버튼과 음량 아래 버튼을 짧게 동시에 누르기" className="px-3 py-2 bg-slate-800/95 text-white rounded-full text-[11px] disabled:opacity-50">측면 + 음량↓ 캡처</button>
        <button onClick={()=>showVolumePanel('media',-10)} className="px-3 py-2 bg-slate-800/95 text-white rounded-full text-[11px]">음량 −</button><button onClick={()=>showVolumePanel('media',10)} className="px-3 py-2 bg-slate-800/95 text-white rounded-full text-[11px]">음량 +</button>
        <button onClick={()=>setPowerMenuOpen(true)} className="px-3 py-2 bg-slate-800/95 text-white rounded-full text-[11px]">전원 메뉴</button>
        {!practiceMode&&<button onClick={recoverLesson} className="px-3 py-2 bg-blue-700 text-white rounded-full text-[11px]">현재 미션으로</button>}
      </div>
      </details>
      {notice&&<div role="status" className="explorer-notice absolute top-20 left-1/2 -translate-x-1/2 z-[450] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-sm max-w-[90%]">{notice}</div>}
      {(sessionStorageError||progressStorageError)&&<div role="alert" className="absolute top-16 left-3 z-[451] bg-amber-100 text-amber-900 p-2 rounded-xl text-xs">저장 공간이 부족해요. 새로고침 전에 학습 기록을 확인하세요.</div>}
      {welcomeOpen&&<div className="fixed inset-0 z-[500] bg-[#0b172c]/85 backdrop-blur-md flex items-center justify-center p-4"><section role="dialog" aria-modal="true" aria-labelledby="welcome-title" className="w-full max-w-3xl max-h-[92dvh] overflow-auto bg-[#f7f9fc] rounded-[32px] p-6 md:p-10 text-slate-900 shadow-2xl">
        <div className="text-blue-600 text-xs font-bold tracking-widest mb-4">GALAXY TAB · LEARNING LAB</div><h2 id="welcome-title" className="text-3xl md:text-4xl font-extrabold tracking-tight">내 손으로 익히는<br/>안드로이드 탐험대</h2><p className="mt-4 text-slate-600 leading-relaxed">설정을 바꾸고, 사진을 찍고, 앱을 설치하고, 파일을 정리해 보세요. 실수해도 괜찮아요. 이 안의 태블릿은 안전한 연습 공간이에요.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">{[['01','터치와 화면','잠금 · 홈 · 최근 앱'],['02','연결과 설정','Wi-Fi · 음량 · 권한'],['03','앱 활용','사진 · 노트 · 파일'],['04','안전한 사용','설치 · 공유 · 확인']].map(([n,t,d])=><div key={n} className="rounded-2xl bg-white border border-slate-200 p-4"><span className="text-blue-600 text-xs font-bold">{n}</span><b className="block mt-2 text-sm">{t}</b><span className="text-[11px] text-slate-500">{d}</span></div>)}</div>
        <div className="bg-blue-50 rounded-2xl p-4 text-sm leading-relaxed"><b>연습 방법</b><p>노란 테두리와 미션 안내를 따라 직접 조작해요. 왼쪽 위를 내리면 알림, 오른쪽 위를 내리면 빠른 설정이에요. 마우스로 누르거나 손가락으로 터치할 수 있어요.</p><p className="mt-2">실제 계정·비밀번호·사진은 필요하지 않아요. 촬영, 설치, 공유, Wi-Fi는 웹앱 안에서 연습하며 실제 기기 설정은 바뀌지 않아요.</p></div>
        <p className="text-xs text-slate-500 my-4 leading-relaxed">최신 기준: Android 17 / One UI 9, Galaxy Tab S12 공식 발표 확인(2026.11.02). 학교 기기는 모델·업데이트 상태에 따라 메뉴가 달라질 수 있어요. 설정 → 태블릿 정보 → 소프트웨어 정보에서 확인해요. 웹 연습 뒤 실제 기기로 한 번 더 확인해요.</p>
        <div className="flex gap-3 flex-wrap"><button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 font-bold" onClick={()=>{setWelcomeOpen(false);try{localStorage.setItem('android-explorer-welcome-v3','1')}catch{};setPracticeMode(false);setIsCompact(true)}}>미션 시작 / 이어 하기 →</button><button className="bg-slate-200 rounded-full px-6 py-3 font-bold" onClick={()=>{setWelcomeOpen(false);setPracticeMode(true);setLocked(false)}}>자유롭게 둘러보기</button></div>
      </section></div>}

      {showExpMenu && !practiceMode && !welcomeOpen && (
        <MissionCenter
          isPhone={isPhone}
          dragRef={expMenuRef}
          pos={expPos}
          onDragStart={handleDragStartExp}
          themeColor={themeColor}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          missionListOpen={missionListOpen}
          setMissionListOpen={setMissionListOpen}
          isCompact={isCompact}
          setIsCompact={setIsCompact}
          setShowExpMenu={setShowExpMenu}
          exp={exp}
          questIdx={questIdx}
          completedQuests={completedQuests}
          gotoQuest={gotoQuest}
          resetProgress={resetProgress} advanceQuest={advanceQuest}
        />
      )}

      {/* The phone display preserves Galaxy S26's 1080 × 2340 ratio in CSS pixels. */}
      <div className={`device-frame relative w-full h-full bg-black shadow-[0_8px_28px_rgba(0,0,0,0.55),0_0_0_1.5px_#23272e] ${isPhone ? 'rounded-[37px] p-[7px] mx-auto' : 'max-w-[1600px] max-h-[1000px] aspect-[16/10] rounded-[22px] md:rounded-[30px] p-[8px] md:p-[12px]'}`}>
        {/* front camera dot */}
        {isPhone ? (
          <div className="absolute top-[15px] left-1/2 -translate-x-1/2 w-2 h-2 bg-black ring-1 ring-white/10 rounded-full z-[180] pointer-events-none"></div>
        ) : (
          <div className="absolute top-1/2 -translate-y-1/2 left-[6px] w-1.5 h-1.5 bg-gray-700 rounded-full"></div>
        )}

        {/* 측면 하드웨어 버튼 — 우측 상단 */}
        <button
          title="전원"
          onClick={() => {setLocked(v=>!v);setNotice("측면 버튼으로 화면을 잠그거나 깨워요. 전원 메뉴는 기기 조작 도구에서 열 수 있어요.");}}
          className="absolute right-[-3px] top-[18%] w-[6px] h-14 bg-gradient-to-b from-gray-700 to-gray-900 rounded-r-md hover:from-gray-600 active:translate-x-[1px] transition-all shadow-md z-[170]"
        />
        <button
          title="음량 +"
          onClick={() => showVolumePanel('media', 10)}
          className="absolute right-[-3px] top-[38%] w-[6px] h-12 bg-gradient-to-b from-gray-700 to-gray-900 rounded-r-md hover:from-gray-600 active:translate-x-[1px] transition-all shadow-md z-[170]"
        />
        <button
          title="음량 -"
          onClick={() => showVolumePanel('media', -10)}
          className="absolute right-[-3px] top-[51%] w-[6px] h-12 bg-gradient-to-b from-gray-700 to-gray-900 rounded-r-md hover:from-gray-600 active:translate-x-[1px] transition-all shadow-md z-[170]"
        />

        <div ref={deviceScreenRef} data-device-screen className={`device-screen oneui relative w-full h-full overflow-hidden bg-black flex flex-col ${isPhone ? 'rounded-[30px]' : 'rounded-[15px] md:rounded-[20px]'}`} style={{ fontSize: `${fontScale}rem` }}>

          <div className="absolute inset-0 bg-black pointer-events-none z-[60] transition-opacity duration-300" style={{ opacity: (1 - (brightness / 100)) * .55 }}></div>
          {darkMode && <div className="absolute inset-0 bg-indigo-950/40 pointer-events-none z-[59] mix-blend-multiply"></div>}

          {renderStatusBar()}

          <div className="flex-1 relative flex flex-col bg-black overflow-hidden min-h-0 z-0">
            <div key={`app-${appLaunchKey}`} className="absolute inset-0 flex flex-col animate-app-enter">
              {currentApp === null && renderHome()}
              {currentApp === 'Settings' && renderSettings()}
              {currentApp === 'Camera' && renderCamera()}
              {currentApp === 'Gallery' && renderGallery()}
              {currentApp === 'PlayStore' && renderPlayStore()}
              {currentApp === 'Notes' && renderNotes()}
              {currentApp === 'Calculator' && renderCalculator()}
              {currentApp === 'Internet' && renderInternet()}
              {currentApp === 'Folder' && <MyFilesApp currentTargetId={currentTargetId} advanceQuest={advanceQuest}/>}
              {currentApp === 'Clock' && <ClockApp currentTargetId={currentTargetId} advanceQuest={advanceQuest}/>}
              {currentApp === 'Calendar' && <CalendarPracticeApp/>}
              {currentApp && !['Settings','Camera','Gallery','PlayStore','Notes','Calculator','Internet','Folder','Clock','Calendar'].includes(currentApp) && <div className="flex-1 bg-white p-10 text-center text-slate-800"><h2 className="text-2xl font-bold mb-4">이 앱은 추가 학습 영역이에요</h2><p>홈에서 설정, 카메라, 갤러리, Play 스토어, 삼성 노트, 내 파일, 시계, 캘린더, 계산기, 인터넷을 연습할 수 있어요.</p><button className="mt-6 rounded-full bg-blue-600 text-white p-4" onClick={homeButtonAction}>홈으로</button></div>}

            </div>
          </div>


          <div className="shrink-0 z-40">{renderNavigationBar()}</div>

          {renderQuickPanel()}

          {/* 음량 슬라이더 패널 (측면 볼륨 버튼으로 호출) */}
          {volumePanelOpen && (
            <div
              className="absolute right-3 top-12 z-[150] w-[78px] bg-[#1c1c1e]/95 backdrop-blur-md rounded-3xl p-3 shadow-2xl border border-white/10 animate-[fadeIn_0.18s_ease-out] flex flex-col items-center gap-3"
              onMouseEnter={() => { if (volumeCloseTimer.current) clearTimeout(volumeCloseTimer.current); }}
              onMouseLeave={() => { volumeCloseTimer.current = setTimeout(() => setVolumePanelOpen(false), 1400); }}
            >
              {(() => {
                const cur = volumePanelType === 'media' ? mediaVolume : volumePanelType === 'ring' ? ringVolume : notifVolume;
                const setCur = (v: number) => {
                  if (volumePanelType === 'media') setMediaVolume(v);
                  else if (volumePanelType === 'ring') setRingVolume(v);
                  else setNotifVolume(v);
                };
                const VolumeIcon = volumePanelType === 'media' ? Music2 : volumePanelType === 'ring' ? Volume2 : Bell;
                return (
                  <>
                    <VolumeIcon size={22} strokeWidth={1.8} className="text-white" aria-hidden="true" />
                    <div className="relative w-3 h-40 bg-white/15 rounded-full overflow-hidden">
                      <div className="absolute bottom-0 left-0 right-0 bg-white transition-all" style={{ height: `${cur}%` }}/>
                    </div>
                    <div className="text-white/80 text-[11px] font-medium tabular-nums">{cur}</div>
                    <div className="flex flex-col gap-1 w-full">
                      {[
                        { id: 'media', icon: Music2, label: '미디어' },
                        { id: 'ring', icon: Volume2, label: '벨소리' },
                        { id: 'notif', icon: Bell, label: '알림' },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setVolumePanelType(t.id as any)}
                          className={`w-full py-1.5 rounded-xl text-[10px] flex flex-col items-center gap-0.5 transition ${volumePanelType === t.id ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'}`}
                        >
                          <t.icon size={18} strokeWidth={1.8} aria-hidden="true" />
                          <span className="leading-none">{t.label}</span>
                        </button>
                      ))}
                    </div>
                    <button aria-label={cur === 0 ? '음량 켜기' : '음소거'} onClick={() => setCur(cur === 0 ? 70 : 0)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-base active:scale-90 transition">
                      {cur === 0 ? <VolumeX size={20} strokeWidth={1.8}/> : <Volume2 size={20} strokeWidth={1.8}/>}
                    </button>
                  </>
                );
              })()}
            </div>
          )}

          {/* 전원 메뉴 */}
          {powerMenuOpen && (
            <div className="absolute inset-0 z-[160] bg-black/70 flex items-center justify-center animate-[fadeIn_0.2s_ease-out]" onClick={() => setPowerMenuOpen(false)}>
              <div className="bg-[#1c1c1e] rounded-3xl p-6 w-72 text-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="text-center font-bold text-lg mb-5">전원</div>
                <div className="flex justify-around mb-2">
                  <button
                    onClick={() => { setPowerMenuOpen(false); setPowerOff(true); setTimeout(() => { setPowerOff(false); setLocked(true); }, 1800); }}
                    className="flex flex-col items-center gap-2 active:scale-95"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#dc4949] flex items-center justify-center"><Power size={29} strokeWidth={1.8}/></div>
                    <div className="text-xs">전원 끄기</div>
                  </button>
                  <button
                    onClick={() => { setPowerMenuOpen(false); setPowerOff(true); setTimeout(() => { setPowerOff(false); setLocked(true); }, 1500); }}
                    className="flex flex-col items-center gap-2 active:scale-95"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#43a866] flex items-center justify-center"><RefreshCcw size={29} strokeWidth={1.8}/></div>
                    <div className="text-xs">다시 시작</div>
                  </button>
                  <button
                    onClick={() => setPowerMenuOpen(false)}
                    className="flex flex-col items-center gap-2 active:scale-95"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#ed5757] flex items-center justify-center"><Phone size={27} strokeWidth={1.8}/></div>
                    <div className="text-xs">긴급전화</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 전원 OFF 페이드 */}
          {powerOff && (
            <div className="absolute inset-0 z-[200] bg-black flex items-center justify-center animate-[fadeIn_0.3s_ease-out]">
              <div className="text-white/70 text-sm tracking-widest">SAMSUNG</div>
            </div>
          )}



          {mathAppOpen && (
            <div className="absolute left-0 right-0 top-0 bottom-14 z-[80] bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-400 flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease-out] pt-8 pb-4">
              <div className="text-white text-7xl font-black drop-shadow-lg mb-4">1 + 2 = ?</div>
              <div className="text-white text-2xl font-bold mb-10 drop-shadow">설치한 앱 열기 연습 · 1 + 2를 풀어 보세요</div>
              <div className="flex gap-6">
                {[2, 3, 4].map(n => (
                  <button key={n} onClick={()=>setNotice(n===3?"정답이에요. 앱 실행을 잘했어요!":"다시 계산해 보세요.")} className={`w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-black shadow-xl cursor-pointer active:scale-90 transition-all ${n===3 ? 'bg-white text-green-600' : 'bg-white/80 text-gray-700'}`}>{n}</button>
                ))}
              </div>
              <div className="mt-10 text-white text-sm opacity-80">홈 버튼을 눌러 종료하세요</div>
            </div>
          )}

          {splitScreen && <div className="absolute inset-x-0 top-8 bottom-14 z-[85] flex flex-col bg-slate-200">
            <div className="bg-white px-4 py-2 flex items-center justify-between text-sm text-slate-800"><b>분할 화면 · 계산하며 메모하기</b><button onClick={()=>setSplitScreen(null)} className="px-4 py-2 rounded-full bg-slate-100">분할 화면 닫기</button></div>
            <div className="flex flex-1 min-h-0 flex-col md:flex-row gap-1"><div className="flex flex-1 min-h-0 min-w-0">{renderCalculator()}</div><div className="w-1 bg-slate-400 hidden md:block"/><div className="flex flex-1 min-h-0 min-w-0">{renderNotes()}</div></div>
          </div>}

          {/* Recent apps overlay */}
          {recentAppsOpen && (
            <div className="absolute inset-0 z-[88] bg-black/90 backdrop-blur-md flex flex-col pt-12 px-6 animate-[fadeIn_0.2s_ease-out]" onClick={() => setRecentAppsOpen(false)}>
              <div className="text-white text-xl font-bold mb-4 px-2">최근 사용한 앱</div>
              {recentApps.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-white/60">최근 사용한 앱이 없습니다</div>
              ) : (
                <div className="flex-1 overflow-x-auto flex gap-4 pb-8 items-start" onClick={(e) => e.stopPropagation()}>
                  {recentApps.map((app, i) => {
                    const psApp = PLAYSTORE_APPS.find(a => a.id === app);
                    const bg = psApp?.color || ['#1e3a8a','#7c2d12','#065f46','#581c87','#7f1d1d'][i%5];
                    const name = psApp?.name || ({Settings:'설정',Camera:'카메라',Gallery:'갤러리',PlayStore:'Play 스토어',Notes:'삼성 노트',Calculator:'계산기',Internet:'인터넷',Folder:'내 파일',Clock:'시계',Calendar:'캘린더'} as Record<string,string>)[app] || app;
                    const isSwiping = recentSwipe?.index === i;
                    const dy = isSwiping ? Math.min(0, recentSwipe!.dy) : 0;
                    return (
                      <div
                        key={`${app}-${i}`}
                        className="w-[200px] shrink-0 flex flex-col items-center gap-3 transition-transform"
                        style={{ transform: `translateY(${dy}px)`, opacity: 1 + dy / 400 }}
                        onPointerDown={(e) => { setRecentSwipe({ index: i, startY: e.clientY, dy: 0 }); }}
                        onPointerMove={(e) => {
                          if (recentSwipe?.index !== i) return;
                          setRecentSwipe({ index: i, startY: recentSwipe.startY, dy: e.clientY - recentSwipe.startY });
                        }}
                        onPointerUp={() => {
                          if (recentSwipe?.index === i && recentSwipe.dy < -120) {
                            setRecentApps(prev => prev.filter((_, idx) => idx !== i));
                          }
                          setRecentSwipe(null);
                        }}
                        onPointerCancel={() => setRecentSwipe(null)}
                      >
                        <div className="w-full h-[300px] rounded-2xl shadow-2xl flex flex-col items-center justify-center text-white relative" style={{ background: bg }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setRecentApps(prev => prev.filter((_, idx) => idx !== i)); }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center text-sm active:scale-90"
                          >×</button>
                          <GalaxyAppIcon appName={app} time={time} className="mb-3" style={{width:68,height:68}} />
                          <div className="text-lg font-bold">{name}</div>
                          <div className="absolute bottom-3 text-[10px] opacity-60">위로 밀어 닫기</div>
                        </div>
                        <div className="flex gap-2 w-full">
                          <button onClick={() => { setCurrentApp(app); setRecentAppsOpen(false); }} className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold active:scale-95">열기</button>
                          <button
                            onClick={() => {
                              const other = recentApps.find(a => a !== app) || PLAYSTORE_APPS[0].id;
                              setSplitScreen({ top: 'Calculator', bottom: 'Notes' });
                              advanceQuest('split-screen-open');
                              setRecentAppsOpen(false);
                            }}
                            className="flex-1 py-2 rounded-xl bg-purple-600 text-white text-sm font-bold active:scale-95"
                          >계산기 + 노트 분할</button>
                        </div>
                      </div>
                    );
                  })}

                </div>
              )}
              <div className="flex gap-3 justify-center pb-6">
                <button onClick={(e) => { e.stopPropagation(); setRecentApps([]); setRecentAppsOpen(false); }} className="px-6 py-2 rounded-full bg-white/10 text-white text-sm font-medium active:scale-95">모두 닫기</button>
                <button onClick={() => setRecentAppsOpen(false)} className="px-6 py-2 rounded-full bg-white/10 text-white text-sm font-medium active:scale-95">취소</button>
              </div>
            </div>
          )}

          {/* Home long-press menu */}
          {homeMenuOpen && (
            <div className="absolute inset-0 z-[92] bg-black/60 flex items-end animate-[fadeIn_0.2s_ease-out]" onClick={() => setHomeMenuOpen(false)}>
              <div className="w-full bg-[#1c1c1e] text-white rounded-t-3xl p-6 animate-[slideUp_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-6"/>
                <div className="grid grid-cols-3 gap-4">
                  <button onClick={() => { setHomeMenuOpen(false); setWidgetPickerOpen(true); }} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#2c2c2e] active:scale-95">
                    <PanelsTopLeft size={30} strokeWidth={1.8}/><div className="text-sm font-medium">위젯</div>
                  </button>
                  <button onClick={() => { setHomeMenuOpen(false); setCurrentApp('Settings'); setSettingsMenu('wallpaper'); }} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#2c2c2e] active:scale-95">
                    <ImageIcon size={30} strokeWidth={1.8}/><div className="text-sm font-medium">배경화면</div>
                  </button>
                  <button onClick={() => { setHomeMenuOpen(false); setCurrentApp('Settings'); setSettingsMenu('wallpaper'); }} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#2c2c2e] active:scale-95">
                    <Palette size={30} strokeWidth={1.8}/><div className="text-sm font-medium">테마</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Widget picker */}
          {widgetPickerOpen && (
            <div className="absolute inset-0 z-[93] bg-black/70 flex items-end animate-[fadeIn_0.2s_ease-out]" onClick={() => setWidgetPickerOpen(false)}>
              <div className="w-full bg-[#1c1c1e] text-white rounded-t-3xl p-6 max-h-[70%] overflow-y-auto animate-[slideUp_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-4"/>
                <div className="text-xl font-bold mb-4">위젯 추가</div>
                <div className="grid grid-cols-2 gap-3">
                  {WIDGET_CATALOG.map(w => {
                    const added = widgets.includes(w.id);
                    return (
                      <div key={w.id} className="bg-[#2c2c2e] rounded-2xl p-4 flex items-center gap-3">
                        <div className="text-3xl">{w.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">{w.name}</div>
                          <div className="text-[11px] text-gray-400 truncate">{w.desc}</div>
                        </div>
                        <button
                          onClick={() => setWidgets(prev => added ? prev.filter(x => x !== w.id) : [...prev, w.id])}
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg active:scale-90 transition-all ${added ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
                        >{added ? '−' : '+'}</button>
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setWidgetPickerOpen(false)} className="w-full mt-6 py-3 rounded-2xl bg-blue-600 font-bold active:scale-95">완료</button>
              </div>
            </div>
          )}


          {/* Bluetooth devices modal */}
          {bluetoothModalOpen && (
            <div className="absolute inset-0 z-[94] bg-black/70 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]" onClick={() => setBluetoothModalOpen(false)}>
              <div className="bg-[#1c1c1e] text-white rounded-3xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3"><Bluetooth size={22} className="text-blue-400"/><div className="font-bold text-xl">블루투스</div></div>
                  <X size={22} className="cursor-pointer text-gray-400" onClick={() => setBluetoothModalOpen(false)}/>
                </div>
                <div className="text-sm text-gray-400 mb-4">사용 가능한 기기를 검색했어요. 연결할 기기를 선택하세요.</div>
                <div className="space-y-2">
                  {[
                    { id: 'bt-device-buds', name: '무선 이어버드', sub: '오디오 · 미연결' },
                    { id: 'bt-device-keyboard', name: '무선 키보드', sub: '키보드 · 미연결' },
                    { id: 'bt-device-watch', name: '스마트워치', sub: '웨어러블 · 미연결' },
                    { id: 'bt-device-speaker', name: '블루투스 스피커', sub: '오디오 · 미연결' },
                  ].map(dev => {
                    const connected = connectedBtDevice === dev.name;
                    return (
                      <ActionTarget key={dev.id} id={dev.id} currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                        onClick={() => {
                          if (connected) return;
                          // PIN 페어링 단계로 진입
                          const pin = String(Math.floor(1000 + Math.random() * 9000));
                          setBtPairingDevice(dev);
                          setBtPairingPin(pin);
                        }}
                        className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all ${connected ? 'bg-blue-600' : 'bg-[#2c2c2e] hover:bg-[#3a3a3c]'}`}
                      >
                        <BluetoothDeviceIcon deviceId={dev.id}/>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{dev.name}</div>
                          <div className="text-xs text-gray-400 truncate">{connected ? '연결됨' : dev.sub}</div>
                        </div>
                        {connected && <Check size={20} className="text-white"/>}
                      </ActionTarget>
                    );
                  })}
                </div>
                <button onClick={() => { setBluetooth(false); setConnectedBtDevice(null); setBluetoothModalOpen(false); }} className="w-full mt-4 py-3 rounded-2xl bg-white/10 text-sm font-medium active:scale-95">블루투스 끄기</button>
              </div>
            </div>
          )}

          {/* Bluetooth pairing PIN dialog */}
          {btPairingDevice && (
            <div className="absolute inset-0 z-[120] bg-black/80 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]" onClick={() => setBtPairingDevice(null)}>
              <div className="bg-[#1c1c1e] text-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-3">
                  <BluetoothDeviceIcon deviceId={btPairingDevice.id} size={32}/>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg truncate">{btPairingDevice.name}</div>
                    <div className="text-xs text-gray-400">Bluetooth 페어링 요청</div>
                  </div>
                </div>
                <div className="text-sm text-gray-300 mb-4 leading-relaxed">
                  상대 기기에 표시된 코드가 아래와 같은지 확인하세요. 같다면 <span className="text-blue-400 font-semibold">페어링</span> 을 누르세요.
                </div>
                <div className="bg-black/40 rounded-2xl py-5 mb-5 flex items-center justify-center">
                  <div className="text-5xl font-bold tracking-[0.4em] tabular-nums text-white">{btPairingPin}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBtPairingDevice(null)}
                    className="flex-1 py-3 rounded-2xl bg-[#2c2c2e] hover:bg-[#3a3a3c] active:scale-95 font-bold text-sm transition"
                  >취소</button>
                  <ActionTarget id="bt-pair-confirm" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                    onClick={() => {
                      const dev = btPairingDevice;
                      setBtPairingDevice(null);
                      if (dev) {
                        setConnectedBtDevice(dev.name);
                        advanceQuest(dev.id);
                        setTimeout(() => setBluetoothModalOpen(false), 700);
                      }
                    }}
                    className="flex-1"
                  >
                    <button className="w-full py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 active:scale-95 font-bold text-sm transition">페어링</button>
                  </ActionTarget>
                </div>
              </div>
            </div>
          )}



          {/* Google 로그인 (실제와 유사한 풀스크린) */}
          {googleLoginOpen && (
            <div className="absolute inset-0 z-[180] bg-white flex flex-col text-[#202124] animate-[fadeIn_0.25s_ease-out] overflow-y-auto" style={{ fontFamily: 'Roboto, "Noto Sans KR", system-ui, -apple-system, sans-serif' }}>
              <div className="flex items-center justify-between px-6 pt-12 pb-4">
                <svg viewBox="0 0 272 92" className="h-7">
                  <path fill="#4285F4" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18S71.25 59.95 71.25 47.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                  <path fill="#EA4335" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                  <path fill="#FBBC05" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
                  <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
                  <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
                  <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
                </svg>
                <button onClick={() => setGoogleLoginOpen(false)} className="text-gray-500 active:scale-90 transition"><X size={22}/></button>
              </div>

              {/* Step Indicator */}
              {(() => {
                const steps = [
                  { key: 'email', label: '이메일' },
                  { key: 'password', label: '비밀번호' },
                  { key: 'consent', label: '약관' },
                  { key: 'syncing', label: '동기화' },
                  { key: 'done', label: '완료' },
                ];
                const order = ['email','password','consent','syncing','done'];
                const curIdx = order.indexOf(googleLoginStep);
                return (
                  <div className="max-w-md w-full mx-auto px-8 mb-6">
                    <div className="flex items-center">
                      {steps.map((s, i) => {
                        const done = i < curIdx;
                        const active = i === curIdx;
                        return (
                          <React.Fragment key={s.key}>
                            <div className="flex flex-col items-center">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${done ? 'bg-blue-600 text-white' : active ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-200 text-gray-500'}`}>
                                {done ? <Check size={14} strokeWidth={3}/> : i + 1}
                              </div>
                              <div className={`text-[10px] mt-1 ${active ? 'text-blue-600 font-medium' : done ? 'text-gray-700' : 'text-gray-400'}`}>{s.label}</div>
                            </div>
                            {i < steps.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-1 mt-[-14px] ${i < curIdx ? 'bg-blue-600' : 'bg-gray-200'}`}/>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="flex-1 max-w-md w-full mx-auto px-8 pb-10">
                {googleLoginStep === 'email' && (
                  <div>
                    <h1 className="text-[28px] leading-tight font-normal mb-2">로그인</h1>
                    <p className="text-base text-gray-700 mb-8">탐험대 계정 사용</p>
                    <div className="mb-2" key={`email-${googleShake}`} style={googleError ? { animation: 'shake 0.4s ease-in-out' } : undefined}>
                      <input
                        ref={googleEmailRef}
                        type="email"
                        value={googleEmail}
                        onChange={(e) => { setGoogleEmail(e.target.value); setGoogleError(''); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('google-email-next-btn')?.click(); }}
                        placeholder="이메일 또는 휴대전화"
                        className={`w-full border-2 rounded text-base px-3 py-3.5 outline-none transition-colors ${googleError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-600'}`}
                      />
                      {googleError && (
                        <div className="flex items-center gap-1.5 text-red-600 text-sm mt-2">
                          <AlertTriangle size={14}/> {googleError}
                        </div>
                      )}
                    </div>
                    <button className="text-blue-600 text-sm font-medium mt-3 px-3 py-2 -ml-3 rounded">이메일을 잊으셨나요?</button>
                    <p className="text-sm text-gray-600 mt-6 leading-relaxed">내 컴퓨터가 아닌가요? 게스트 모드를 사용해 비공개로 로그인하세요. <span className="text-blue-600 font-medium">자세히 알아보기</span></p>
                    <div className="flex justify-between items-center mt-10">
                      <button className="text-blue-600 text-sm font-medium px-3 py-2 -ml-3 rounded">계정 만들기</button>
                      <ActionTarget
                        id="google-email-next" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                        disableClickAdvance={true}
                        onClick={() => {
                          if (googleEmail.trim().toLowerCase() === 'student@example.invalid') {
                            setGoogleError(''); setGoogleLoginStep('password');
                            advanceQuest('google-email-next');
                          } else {
                            setGoogleError('탐험대 계정을 찾을 수 없습니다. 이메일을 다시 확인하세요.');
                            setGoogleShake(s => s + 1);
                            setTimeout(() => googleEmailRef.current?.focus(), 50);
                          }
                        }}
                      >
                        <button id="google-email-next-btn" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded text-sm active:scale-95 transition">다음</button>
                      </ActionTarget>
                    </div>
                  </div>
                )}

                {googleLoginStep === 'password' && (
                  <div>
                    <h1 className="text-[28px] leading-tight font-normal mb-2">환영합니다</h1>
                    <div className="inline-flex items-center gap-2 mb-8 mt-3 border border-gray-300 rounded-full pl-1 pr-3 py-1 max-w-full cursor-pointer hover:bg-gray-50" onClick={() => { setGoogleLoginStep('email'); setGoogleError(''); setGooglePassword(''); }}>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{googleEmail[0]?.toUpperCase() || 'W'}</div>
                      <span className="text-sm truncate">{googleEmail}</span>
                      <ChevronLeft size={14} className="rotate-[-90deg] text-gray-600"/>
                    </div>
                    <div className="mb-2" key={`pw-${googleShake}`} style={googleError ? { animation: 'shake 0.4s ease-in-out' } : undefined}>
                      <input
                        ref={googlePasswordRef}
                        type="password"
                        value={googlePassword}
                        onChange={(e) => { setGooglePassword(e.target.value); setGoogleError(''); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('google-password-next-btn')?.click(); }}
                        placeholder="비밀번호 입력"
                        className={`w-full border-2 rounded text-base px-3 py-3.5 outline-none transition-colors ${googleError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-600'}`}
                      />
                      {googleError && (
                        <div className="flex items-center gap-1.5 text-red-600 text-sm mt-2">
                          <AlertTriangle size={14}/> {googleError}
                        </div>
                      )}
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 mt-4 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4"/> 비밀번호 표시
                    </label>
                    <div className="flex justify-between items-center mt-10">
                      <button onClick={() => { setGoogleLoginStep('email'); setGoogleError(''); }} className="flex items-center gap-1 text-blue-600 text-sm font-medium px-3 py-2 -ml-3 rounded"><ChevronLeft size={16}/> 뒤로</button>
                      <ActionTarget
                        id="google-password-next" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                        disableClickAdvance={true}
                        onClick={() => {
                          if (googlePassword === 'Practice123!') {
                            setGoogleError(''); setGoogleLoginStep('consent');
                            advanceQuest('google-password-next');
                          } else {
                            setGoogleError('비밀번호가 올바르지 않습니다. 다시 시도하세요.');
                            setGoogleShake(s => s + 1);
                            setGooglePassword('');
                            setTimeout(() => googlePasswordRef.current?.focus(), 50);
                          }
                        }}
                      >
                        <button id="google-password-next-btn" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded text-sm active:scale-95 transition">다음</button>
                      </ActionTarget>
                    </div>
                  </div>
                )}

                {googleLoginStep === 'consent' && (
                  <div>
                    <h1 className="text-[26px] leading-tight font-normal mb-3">탐험대 서비스 약관</h1>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      탐험대 계정을 추가하면 메일, 튜브, Drive 등 탐험대 서비스의 데이터가 이 기기와 동기화됩니다.
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5 max-h-40 overflow-y-auto text-xs text-gray-600 leading-relaxed">
                      탐험대 서비스를 사용함으로써 귀하는 본 약관을 따르고 탐험대 개인정보처리방침에 따라 데이터가 처리되는 데 동의합니다. 동기화 가능한 항목: 연락처 · 캘린더 · 메일 · 드라이브 · 사진 · 앱 데이터. 언제든지 설정에서 동기화를 해제할 수 있습니다.
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={googleConsent} onChange={(e) => { setGoogleConsent(e.target.checked); setGoogleError(''); }} className="w-5 h-5 mt-0.5"/>
                      <span className="text-sm text-gray-800">위 약관에 동의하며, 기기 백업과 동기화를 허용합니다.</span>
                    </label>
                    {googleError && (
                      <div className="flex items-center gap-1.5 text-red-600 text-sm mt-3" key={`consent-${googleShake}`} style={{ animation: 'shake 0.4s ease-in-out' }}>
                        <AlertTriangle size={14}/> {googleError}
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-10">
                      <button onClick={() => { setGoogleLoginStep('password'); setGoogleError(''); }} className="flex items-center gap-1 text-blue-600 text-sm font-medium px-3 py-2 -ml-3 rounded"><ChevronLeft size={16}/> 뒤로</button>
                      <ActionTarget
                        id="google-consent-agree" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                        disableClickAdvance={true}
                        onClick={() => {
                          if (!googleConsent) { setGoogleError('동의 체크박스를 선택하세요.'); setGoogleShake(s => s + 1); return; }
                          setGoogleError(''); setGoogleLoginStep('syncing');
                          advanceQuest('google-consent-agree');
                          setTimeout(() => setGoogleLoginStep('done'), 1800);
                        }}
                      >
                        <button className={`font-medium px-6 py-2.5 rounded text-sm transition ${googleConsent ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95' : 'bg-gray-200 text-gray-400'}`}>동의함</button>
                      </ActionTarget>
                    </div>
                  </div>
                )}

                {googleLoginStep === 'syncing' && (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <div className="text-lg font-medium">탐험대 계정 동기화 중…</div>
                    <div className="text-sm text-gray-500 mt-2">메일 · 연락처 · 캘린더 · 드라이브</div>
                    <div className="mt-6 space-y-1.5 text-xs text-gray-600">
                      {['연락처','캘린더','메일','드라이브'].map(s => (
                        <div key={s} className="flex items-center gap-2"><Check size={12} className="text-green-600"/> {s} 동기화 완료</div>
                      ))}
                    </div>
                  </div>
                )}

                {googleLoginStep === 'done' && (
                  <div className="flex flex-col items-center text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5 animate-[fadeIn_0.3s_ease-out]">
                      <Check size={42} className="text-green-600" strokeWidth={3}/>
                    </div>
                    <h1 className="text-2xl font-normal mb-2">환영합니다, {googleEmail}</h1>
                    <p className="text-sm text-gray-600 mb-8 max-w-xs">탐험대 계정이 이 기기에 추가되었어요. 메일, 튜브 등에 자동으로 로그인됩니다.</p>
                    <ActionTarget
                      id="google-done" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                      onClick={() => {
                        setGoogleAccount(googleEmail);
                        setGoogleLoginOpen(false);
                      }}
                    >
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-10 py-2.5 rounded text-sm active:scale-95 transition">확인</button>
                    </ActionTarget>
                  </div>
                )}

                {(googleLoginStep === 'email' || googleLoginStep === 'password') && (
                  <div className="mt-8 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                    <div className="font-bold mb-1">💡 학습용 안내</div>
                    아이디: <span className="font-mono font-bold">student@example.invalid</span><br/>
                    비밀번호: <span className="font-mono font-bold">Practice123!</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center px-6 py-4 text-xs text-gray-500 border-t border-gray-100">
                <select className="bg-transparent outline-none"><option>한국어</option></select>
                <div className="flex gap-5">
                  <span>도움말</span><span>개인정보처리방침</span><span>약관</span>
                </div>
              </div>
            </div>
          )}



          {/* Lock screen overlay */}
          {locked && (
            <LockScreen
              wallpaper={wallpaper}
              timeStr={timeStr}
              dateStr={dateStr}
              lockOffset={lockOffset}
              isDragging={lockSwipeY !== null}
              onSwipeStart={handleLockSwipeStart}
              currentTargetId={currentTargetId}
              airplane={airplane}
              wifiConnected={wifiConnected}
              bluetooth={bluetooth}
              soundMode={soundMode}
            />
          )}

        </div>
      </div>

      {/* App icon long-press context menu */}
      {appContextMenu && (
        <div
          className="fixed inset-0 z-[310] bg-black/40 flex items-center justify-center animate-[fadeIn_0.15s_ease-out]"
          onClick={() => setAppContextMenu(null)}
        >
          <div className="bg-[#1c1c1e] text-white rounded-3xl w-[280px] overflow-hidden shadow-2xl animate-[slideUp_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-white/10 flex items-center gap-3">
              <GalaxyAppIcon appName={appContextMenu.appName} time={time} style={{width:48,height:48,flexShrink:0}} />
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{GALAXY_APP_LABELS[appContextMenu.appName] || appContextMenu.appName}</div>
                <div className="text-[11px] text-white/50">길게 눌러서 옵션 표시</div>
              </div>
            </div>
            <div className="py-2">
              <button
                className="w-full px-5 py-3 text-left text-sm hover:bg-white/5 active:bg-white/10 flex items-center gap-3 transition-colors"
                onClick={() => { setIsEditMode(true); setAppContextMenu(null); }}
              >
                <GripHorizontal size={18} className="text-blue-400"/> 이동
              </button>
              <button
                className="w-full px-5 py-3 text-left text-sm hover:bg-white/5 active:bg-white/10 flex items-center gap-3 transition-colors"
                onClick={() => { setAppContextMenu(null); setWidgetPickerOpen(true); }}
              >
                <PanelsTopLeft size={18} strokeWidth={1.8} className="text-blue-400"/> 위젯 추가
              </button>
              <button
                className="w-full px-5 py-3 text-left text-sm hover:bg-white/5 active:bg-white/10 flex items-center gap-3 transition-colors"
                onClick={() => { setAppContextMenu(null); setCurrentApp('Settings'); setSettingsMenu('apps'); }}
              >
                <Settings size={18} className="text-gray-300"/> 앱 정보
              </button>
              <button
                className="w-full px-5 py-3 text-left text-sm hover:bg-white/5 active:bg-white/10 flex items-center gap-3 transition-colors text-red-400"
                onClick={() => { setUninstallTarget(appContextMenu.appName); setAppContextMenu(null); }}
              >
                <Trash2 size={18}/> 삭제
              </button>
            </div>
            <button
              className="w-full py-3 border-t border-white/10 text-sm font-medium text-white/70 hover:bg-white/5 active:bg-white/10 transition-colors"
              onClick={() => setAppContextMenu(null)}
            >취소</button>
          </div>
        </div>
      )}


      {!isPhone && !showExpMenu && (
        <div className="fixed md:absolute bottom-4 right-4 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:bg-blue-700 active:scale-90 transition-all z-[300] animate-bounce" onClick={() => setShowExpMenu(true)}>
          <Check size={28} className="text-white" />
        </div>
      )}

      {/* === 미션 목록 팝업 (12번) === */}
      {missionListOpen && (
        <MissionListOverlay
          isPhone={isPhone}
          dragRef={missionListRef}
          pos={missionListPos}
          onDragStart={handleDragStartList}
          themeColor={themeColor}
          missionListCompact={missionListCompact}
          setMissionListCompact={setMissionListCompact}
          setMissionListOpen={setMissionListOpen}
          questIdx={questIdx}
          completedQuests={completedQuests}
          gotoQuest={gotoQuest}
        />
      )}

      {/* === 미션 목록 플로팅 버튼 (미션 센터가 닫혀 있을 때) === */}
      {!isPhone && !showExpMenu && !missionListOpen && (
        <button
          onClick={() => setMissionListOpen(true)}
          className="fixed md:absolute bottom-4 right-[5.5rem] md:bottom-8 md:right-28 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl cursor-pointer active:scale-90 transition-all z-[300] text-white"
          style={{ background: themeColor }}
          title="미션 목록"
        >
          <Grid size={22} />
        </button>
      )}

      {/* === Reward Toast (미션 완료 시) === */}
      {rewardToast && (
        <div
          key={rewardToast.key}
          className="fixed inset-0 pointer-events-none z-[400] flex items-center justify-center"
        >
          <div
            className="px-6 py-4 rounded-3xl font-black text-white text-2xl md:text-4xl shadow-2xl whitespace-nowrap"
            style={{
              background: `linear-gradient(135deg, ${themeColor}, #10b981)`,
              animation: 'rewardPop 3.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
              position: 'absolute',
              left: '50%',
              top: '50%',
            }}
          >
            ⭐ +{rewardToast.exp} EXP!
          </div>
        </div>
      )}

      {/* === Confetti (미션 완료 시) === */}
      {confettiKey > 0 && (
        <div key={confettiKey} className="fixed inset-0 pointer-events-none z-[399] overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => {
            const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#a855f7', '#06b6d4', '#ef4444'];
            const left = Math.random() * 100;
            const cx = (Math.random() - 0.5) * 200;
            const delay = Math.random() * 0.3;
            const duration = 1.4 + Math.random() * 1.0;
            const size = 6 + Math.random() * 8;
            const color = colors[i % colors.length];
            const shape = i % 3 === 0 ? '50%' : i % 3 === 1 ? '2px' : '0';
            return (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: '-5vh',
                  width: size,
                  height: size,
                  background: color,
                  borderRadius: shape,
                  animation: `confettiFall ${duration}s ease-out ${delay}s forwards`,
                  ['--cx' as any]: `${cx}px`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* === Level-up flash === */}
      {levelUpFlash > 0 && (
        <div
          key={`lvl-${levelUpFlash}`}
          className="fixed inset-0 pointer-events-none z-[401] flex items-center justify-center"
        >
          <div
            className="px-8 py-6 rounded-3xl font-black text-white text-3xl md:text-5xl shadow-[0_0_80px_rgba(255,200,0,0.8)] whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #ef4444)',
              animation: 'levelUpFlash 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
              transformOrigin: 'center',
            }}
          >
            🎉 LEVEL UP! 🎉
          </div>
        </div>
      )}



    </div>
  );
}
