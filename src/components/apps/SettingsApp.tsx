import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Search, X, User, ChevronLeft, ChevronRight, Sun, Moon, Type, Check, Wifi, Volume2, Bell, PaintBucket, Home, Lock, ShieldCheck, MapPin, BatteryCharging, Grid, Sliders, Accessibility, Download, Info, Sparkles, Clock, HardDrive } from 'lucide-react';
import { ActionTarget } from './shared';
import type { PhotoItem } from '@/hooks/useDeviceState';
import { GalaxyAppIcon, GALAXY_APP_LABELS } from '@/components/device/GalaxyAppIcon';

export interface SettingsAppProps {
  currentTargetId: string | null;
  advanceQuest: (id: string) => void;
  settingsSearch: string; setSettingsSearch: (v: string) => void;
  settingsMenu: string; setSettingsMenu: (v: string) => void;
  wifi: boolean; setWifi: (v: boolean) => void; wifiConnected: string | null;
  bluetooth: boolean; setBluetooth: (v: boolean) => void;
  airplane: boolean; setAirplane: (v: boolean) => void;
  brightness: number; setBrightness: (v: number) => void;
  darkMode: boolean; setDarkMode: (v: boolean) => void;
  fontScale: number; setFontScale: (v: number) => void;
  wallpaper: string; setWallpaper: (v: string) => void;
  themeColor: string; setThemeColor: (v: string) => void;
  photos: PhotoItem[];
  appPermissions: Record<string, Record<string, boolean>>;
  setAppPermissions: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>;
  googleAccount: string | null; setGoogleAccount: (v: string | null) => void;
  logoutConfirmOpen: boolean; setLogoutConfirmOpen: (v: boolean) => void;
  accountAddOpen: boolean; setAccountAddOpen: (v: boolean) => void;
  setGoogleEmail: (v: string) => void; setGooglePassword: (v: string) => void;
  setGoogleConsent: (v: boolean) => void; setGoogleError: (v: string) => void;
  setGoogleLoginStep: (v: 'email' | 'password' | 'consent' | 'syncing' | 'done') => void;
  setGoogleLoginOpen: (v: boolean) => void;
  mediaVolume?: number; setMediaVolume?: (v: number) => void;
  notifVolume?: number; setNotifVolume?: (v: number) => void;
  soundMode?: string; setSoundMode?: (v: 'sound' | 'vibrate' | 'mute') => void;
  setWifiConnected?: (v: string | null) => void;
  onOpenWifi?: () => void; onOpenBluetooth?: () => void;
  onOpenApp?: (name: string) => void;
  onBackHandlerChange?: (handler: (() => boolean) | null) => void;
}

const MENUS = [
  { id: 'connections', title: '연결', sub: 'Wi-Fi · 블루투스 · 비행기 탑승 모드', icon: Wifi, color: '#287be0' },
  { id: 'sounds', title: '소리 및 진동', sub: '소리 모드 · 음량', icon: Volume2, color: '#9253d4' },
  { id: 'notifications', title: '알림', sub: '앱 알림 · 방해 금지', icon: Bell, color: '#ed8542' },
  { id: 'display', title: '디스플레이', sub: '밝기 · 글자 크기 · 화면 자동 꺼짐', icon: Sun, color: '#50ac75' },
  { id: 'wallpaper', title: '배경화면 및 스타일', sub: '배경화면 · 컬러 팔레트', icon: PaintBucket, color: '#cf5b96' },
  { id: 'home', title: '홈 화면', sub: '앱스 화면 · 아이콘 · 위젯', icon: Home, color: '#438de3' },
  { id: 'lock', title: '잠금화면', sub: '화면 잠금 방식', icon: Lock, color: '#49a5a2' },
  { id: 'privacy', title: '보안 및 개인정보 보호', sub: '앱 권한 · 보안 설정', icon: ShieldCheck, color: '#4c9c64' },
  { id: 'location', title: '위치', sub: '위치 사용 · 앱 권한', icon: MapPin, color: '#58a379' },
  { id: 'account', title: '계정 및 백업', sub: '계정 관리 · 백업', icon: User, color: '#4985df' },
  { id: 'advanced', title: '유용한 기능', sub: '멀티윈도우 · 화면 캡처', icon: Sparkles, color: '#de8b42' },
  { id: 'digital', title: '디지털 웰빙 및 자녀 보호 기능', sub: '사용 시간 · 휴식', icon: Clock, color: '#5eaa83' },
  { id: 'battery', title: '배터리', sub: '배터리 잔량 · 절전 모드', icon: BatteryCharging, color: '#49a8a0' },
  { id: 'care', title: '디바이스 케어', sub: '저장공간 · 기기 관리', icon: HardDrive, color: '#4d9fa5' },
  { id: 'apps', title: '애플리케이션', sub: '앱 정보 · 권한', icon: Grid, color: '#4c8bcd' },
  { id: 'general', title: '일반', sub: '언어 · 삼성 키보드', icon: Sliders, color: '#8894a4' },
  { id: 'accessibility', title: '접근성', sub: '시인성 · 읽기 편한 글자', icon: Accessibility, color: '#598ad0' },
  { id: 'update', title: '소프트웨어 업데이트', sub: '다운로드 및 설치', icon: Download, color: '#527ac4' },
  { id: 'about', title: '태블릿 정보', sub: '소프트웨어 정보 · 연습 기기', icon: Info, color: '#7b889d' },
];
const APP_NAMES: Record<string, string> = { ...GALAXY_APP_LABELS, KakaoTalk: '톡톡', YouTube: '동영상', Chrome: 'Chrome', Gmail: '메일' };
const NOTIFICATION_APP_IDS: Record<string, string> = { 톡톡: 'KakaoTalk', 메시지: 'Messages', 'Play 스토어': 'PlayStore' };
const WALLPAPERS = [
  { name: '라벤더', value: 'radial-gradient(circle at 100% 30%, #c7d2fe 0%, #818cf8 30%, transparent 60%), radial-gradient(circle at 0% 100%, #e879f9 0%, #818cf8 40%, transparent 70%), #1e3a8a', color: '#818cf8' },
  { name: '숲', value: 'linear-gradient(135deg, #065f46 0%, #166534 100%)', color: '#10b981' },
  { name: '바다', value: 'linear-gradient(135deg, #38bdf8, #0369a1 55%, #0c4a6e)', color: '#0ea5e9' },
  { name: '노을', value: 'linear-gradient(135deg, #fb923c, #ec4899 60%, #581c87)', color: '#ec4899' },
  { name: '파스텔', value: 'linear-gradient(135deg, #fbcfe8, #c7d2fe 50%, #bae6fd)', color: '#a78bfa' },
  { name: '미드나잇', value: 'linear-gradient(135deg, #0f172a, #1e293b 50%, #312e81)', color: '#6366f1' },
];


interface SettingsUi { currentTargetId: string | null; advanceQuest: (id: string) => void; darkMode: boolean; panel: string; secondary: string; divider: string; }
const SettingsUiContext = createContext<SettingsUi>({ currentTargetId: null, advanceQuest: () => {}, darkMode: false, panel: 'bg-white', secondary: 'text-slate-500', divider: 'divide-slate-100' });

export const SETTINGS_STORAGE_KEY = 'android-explorer-settings-v1';
interface PracticeSettings { powerSaving: boolean; screenTimeout: string; notificationsOn: Record<string, boolean>; doNotDisturb: boolean; locationOn: boolean; autoBlocker: boolean; pinConfigured: boolean; localMedia: number; localNotif: number; localSound: string; }
const DEFAULT_SETTINGS: PracticeSettings = { powerSaving: false, screenTimeout: '30초', notificationsOn: { 톡톡: true, 메시지: true, 'Play 스토어': true }, doNotDisturb: false, locationOn: false, autoBlocker: true, pinConfigured: false, localMedia: 70, localNotif: 50, localSound: 'sound' };
const readPracticeSettings = (): PracticeSettings => {
  try {
    const raw = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || 'null');
    if (!raw || typeof raw !== 'object') return DEFAULT_SETTINGS;
    const result = { ...DEFAULT_SETTINGS };
    for (const key of ['powerSaving','doNotDisturb','locationOn','autoBlocker','pinConfigured'] as const) if (typeof raw[key] === 'boolean') result[key] = raw[key];
    if (['15초','30초','1분','2분','5분','10분'].includes(raw.screenTimeout)) result.screenTimeout = raw.screenTimeout;
    if (['sound','vibrate','mute'].includes(raw.localSound)) result.localSound = raw.localSound;
    for (const key of ['localMedia','localNotif'] as const) if (typeof raw[key] === 'number' && Number.isFinite(raw[key])) result[key] = Math.max(0, Math.min(100, raw[key]));
    result.notificationsOn = { ...DEFAULT_SETTINGS.notificationsOn };
    for (const name of Object.keys(result.notificationsOn)) if (typeof raw.notificationsOn?.[name] === 'boolean') result.notificationsOn[name] = raw.notificationsOn[name];
    return result;
  } catch { return DEFAULT_SETTINGS; }
};

const Target = ({ id, children, className = '' }: { id: string; children: React.ReactNode; className?: string }) => { const { currentTargetId, advanceQuest } = useContext(SettingsUiContext); return <ActionTarget id={id} currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance className={className}>{children}</ActionTarget>; };
const Hint = ({ children }: { children: React.ReactNode }) => { const { secondary } = useContext(SettingsUiContext); return <p className={`text-xs md:text-sm leading-relaxed px-2 my-4 ${secondary}`}>{children}</p>; };
const Card = ({ children }: { children: React.ReactNode }) => { const { panel, divider } = useContext(SettingsUiContext); return <div className={`${panel} rounded-[24px] overflow-hidden mb-4 divide-y ${divider}`}>{children}</div>; };
const Row = ({ title, sub, onClick, children, icon }: { title: string; sub?: string; onClick?: () => void; children?: React.ReactNode; icon?: React.ReactNode }) => { const { secondary } = useContext(SettingsUiContext); return (
    <div className="flex items-center gap-4 px-4 md:px-6 py-4 min-h-16">
      {icon && <span className="w-10 h-10 shrink-0">{icon}</span>}
      {onClick ? <button className="text-left flex-1 min-w-0 py-1" onClick={onClick}><div className="font-medium text-sm md:text-base">{title}</div>{sub && <div className={`text-xs mt-1 leading-relaxed ${secondary}`}>{sub}</div>}</button> : <div className="flex-1 min-w-0"><div className="font-medium text-sm md:text-base">{title}</div>{sub && <div className={`text-xs mt-1 leading-relaxed ${secondary}`}>{sub}</div>}</div>}
      {children ?? (onClick ? <ChevronRight size={18} className={secondary} aria-hidden/> : null)}
    </div>
  ); };
const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) => { const { darkMode } = useContext(SettingsUiContext); return <button type="button" role="switch" aria-label={label} aria-checked={checked} onClick={() => onChange(!checked)} className={`w-12 h-7 p-0.5 rounded-full shrink-0 transition-colors ${checked ? 'bg-[#3b79df]' : darkMode ? 'bg-gray-600' : 'bg-slate-300'}`}><span className={`block w-6 h-6 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`}/></button>; };

const SettingsApp = (props: SettingsAppProps) => {
  const { currentTargetId, advanceQuest, settingsSearch, setSettingsSearch, settingsMenu, setSettingsMenu, wifi, setWifi, wifiConnected, bluetooth, setBluetooth, airplane, setAirplane, brightness, setBrightness, darkMode, setDarkMode, fontScale, setFontScale, wallpaper, setWallpaper, themeColor, setThemeColor, appPermissions, setAppPermissions, googleAccount, setGoogleAccount, logoutConfirmOpen, setLogoutConfirmOpen, accountAddOpen, setAccountAddOpen, setGoogleEmail, setGooglePassword, setGoogleConsent, setGoogleError, setGoogleLoginStep, setGoogleLoginOpen } = props;
  const [practice, setPractice] = useState<PracticeSettings>(readPracticeSettings);
  const [isPhone, setIsPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches);
  const isMenuLesson = currentTargetId?.startsWith('settings-menu-') ?? false;
  const isDetailLesson = !!currentTargetId && /^(settings-(?!menu-)|perm-|account-|google-)/.test(currentTargetId);
  const [phoneDetailOpen, setPhoneDetailOpen] = useState(() => !isMenuLesson && (settingsMenu !== 'connections' || isDetailLesson));
  const previousMenu = useRef(settingsMenu);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsPhone(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (isMenuLesson) setPhoneDetailOpen(false);
    else if (isDetailLesson) setPhoneDetailOpen(true);
  }, [currentTargetId, isMenuLesson, isDetailLesson]);
  useEffect(() => {
    if (previousMenu.current === settingsMenu) return;
    previousMenu.current = settingsMenu;
    if (!isMenuLesson) setPhoneDetailOpen(true);
  }, [settingsMenu, isMenuLesson]);
  const { powerSaving, screenTimeout, notificationsOn, doNotDisturb, locationOn, autoBlocker, pinConfigured, localMedia, localNotif, localSound } = practice;
  const changePractice = <K extends keyof PracticeSettings,>(key: K, value: PracticeSettings[K]) => setPractice(prev => ({ ...prev, [key]: value }));
  const setPowerSaving = (v: boolean) => changePractice('powerSaving', v);
  const setScreenTimeout = (v: string) => changePractice('screenTimeout', v);
  const setDoNotDisturb = (v: boolean) => changePractice('doNotDisturb', v);
  const setLocationOn = (v: boolean) => changePractice('locationOn', v);
  const setAutoBlocker = (v: boolean) => changePractice('autoBlocker', v);
  const setPinConfigured = (v: boolean) => changePractice('pinConfigured', v);
  const setLocalMedia = (v: number) => changePractice('localMedia', v);
  const setLocalNotif = (v: number) => changePractice('localNotif', v);
  const setLocalSound = (v: string) => changePractice('localSound', v);
  const setNotificationsOn = (update: (prev: Record<string, boolean>) => Record<string, boolean>) => setPractice(prev => ({ ...prev, notificationsOn: update(prev.notificationsOn) }));
  useEffect(() => { try { localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(practice)); } catch { /* Practice remains usable when storage is unavailable. */ } }, [practice]);
  const [storageOpen, setStorageOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'done'>('idle');
  const [permission, setPermission] = useState<{ app: string; name: string } | null>(null);
  const [lockPractice, setLockPractice] = useState(false);
  const [practicePin, setPracticePin] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!props.onBackHandlerChange) return;
    props.onBackHandlerChange(() => {
      if (!isPhone) return false;
      if (permission || lockPractice || logoutConfirmOpen || accountAddOpen) {
        setPermission(null); setLockPractice(false); setLogoutConfirmOpen(false); setAccountAddOpen(false);
        return true;
      }
      if (!phoneDetailOpen) return false;
      setPhoneDetailOpen(false);
      return true;
    });
    return () => props.onBackHandlerChange?.(null);
  }, [props.onBackHandlerChange, isPhone, phoneDetailOpen, permission, lockPractice, logoutConfirmOpen, accountAddOpen, setLogoutConfirmOpen, setAccountAddOpen]);
  const media = props.mediaVolume ?? localMedia;
  const notificationVolume = props.notifVolume ?? localNotif;
  const sound = props.soundMode ?? localSound;
  const aboutTitle = isPhone ? '휴대전화 정보' : '태블릿 정보';
  const menus = MENUS.map(menu => menu.id === 'about' ? { ...menu, title: aboutTitle } : menu);
  const current = menus.find(m => m.id === settingsMenu) ?? menus[0];
  const filtered = menus.filter(m => `${m.title} ${m.sub}`.includes(settingsSearch.trim()));
  const panel = darkMode ? 'bg-[#1c1c1e]' : 'bg-white';
  const secondary = darkMode ? 'text-gray-400' : 'text-slate-500';
  const divider = darkMode ? 'divide-white/10' : 'divide-slate-100';

  useEffect(() => { setMessage(''); setStorageOpen(false); }, [settingsMenu]);
  useEffect(() => {
    if (updateStatus !== 'checking') return;
    const timer = setTimeout(() => { setUpdateStatus('done'); advanceQuest('settings-update-check'); }, 900);
    return () => clearTimeout(timer);
  }, [updateStatus, advanceQuest]);

  const go = (id: string) => { setSettingsMenu(id); setPhoneDetailOpen(true); setSettingsSearch(''); advanceQuest(`settings-menu-${id}`); };
  const applyPermission = (enabled: boolean) => {
    if (!permission) return;
    setAppPermissions(prev => ({ ...prev, [permission.app]: { ...prev[permission.app], [permission.name]: enabled } }));
    if (!enabled) { advanceQuest(`perm-${permission.app}-${permission.name}`); advanceQuest('settings-permission-deny'); }
    setMessage(`${APP_NAMES[permission.app] || permission.app} · ${permission.name}: ${enabled ? (['카메라','마이크','위치'].includes(permission.name) ? '앱 사용 중에만 허용' : '허용') : '허용 안 함'}`);
    setPermission(null);
  };
  const permissionsContent = <>
    <Hint>권한은 앱에 꼭 필요한 것만 허용하세요. 대화를 읽는 데 현재 위치는 필요하지 않아요. 권한을 누르고 허용 범위를 선택해 보세요.</Hint>
    {Object.entries(appPermissions).map(([app, perms]) => <Card key={app}><Row title={APP_NAMES[app] || app} icon={<GalaxyAppIcon appName={app}/>}/>{Object.entries(perms).map(([name, enabled]) => <Target key={name} id={`perm-${app}-${name}`}><Row title={name === '저장공간' ? '사진 및 동영상' : name} sub={enabled ? '허용됨' : '허용 안 함'} onClick={() => setPermission({ app, name })}/></Target>)}</Card>)}
  </>;

  return <SettingsUiContext.Provider value={{ currentTargetId, advanceQuest, darkMode, panel, secondary, divider }}><div data-settings-page={isPhone ? phoneDetailOpen ? 'detail' : 'list' : 'split'} className={`relative flex-1 min-h-0 flex overflow-hidden pt-8 ${darkMode ? 'bg-black text-white' : 'bg-[#f3f4f6] text-[#191c20]'}`}>
    <aside className={`${phoneDetailOpen ? 'hidden md:block' : 'block'} w-full md:w-[31%] md:max-w-[340px] shrink-0 overflow-y-auto md:border-r ${darkMode ? 'border-white/10' : 'border-slate-200/70'}`}>
      <div className="px-3 md:px-5 pt-5 pb-3"><h1 className="text-2xl md:text-4xl font-semibold tracking-tight mb-5">설정</h1><div className={`${panel} rounded-full px-3 py-2.5 flex items-center gap-2`}><Search size={17} className={secondary}/><input aria-label="설정 검색" placeholder="검색" value={settingsSearch} onChange={e => setSettingsSearch(e.target.value)} className="bg-transparent w-full min-w-0 outline-none text-sm"/>{settingsSearch && <button aria-label="설정 검색 지우기" onClick={() => setSettingsSearch('')}><X size={16}/></button>}</div></div>
      <nav aria-label="설정 항목" className="px-2 md:px-3 pb-10 space-y-1">
        <button onClick={() => go('account')} className={`w-full ${panel} rounded-2xl p-3 flex gap-3 items-center mb-4 text-left`}><span className="w-10 h-10 rounded-full bg-blue-500 text-white grid place-items-center shrink-0"><User size={21}/></span><span className="min-w-0"><span className="block font-semibold text-sm">탐험대 연습 계정</span><span className={`block text-[11px] ${secondary}`}>실제 계정 입력 없이 연습</span></span></button>
        {filtered.map(menu => <Target key={menu.id} id={`settings-menu-${menu.id}`}><button onClick={() => go(menu.id)} aria-current={settingsMenu === menu.id ? 'page' : undefined} className={`w-full flex items-center gap-2.5 px-2.5 py-3 rounded-2xl text-left ${settingsMenu === menu.id ? darkMode ? 'bg-[#213353]' : 'bg-[#dde9fa]' : darkMode ? 'hover:bg-white/5' : 'hover:bg-white/80'}`}><span className="w-8 h-8 rounded-full grid place-items-center text-white shrink-0" style={{ background: menu.color }}><menu.icon size={18}/></span><span className="min-w-0"><span className="text-sm font-medium block leading-snug">{menu.title}</span><span className={`hidden lg:block text-[10px] mt-1 ${secondary}`}>{menu.sub}</span></span></button></Target>)}
        {!filtered.length && <p className={`p-5 text-sm ${secondary}`}>일치하는 설정이 없어요.</p>}
      </nav>
    </aside>
    <main className={`${phoneDetailOpen ? 'block' : 'hidden md:block'} flex-1 min-w-0 overflow-y-auto px-3 md:px-7 lg:px-10 py-3 md:py-6 pb-12`}>
      <div className="flex items-center gap-1 mb-4 md:mb-6"><button type="button" aria-label="설정 목록으로" onClick={() => setPhoneDetailOpen(false)} className="md:hidden w-11 h-11 shrink-0 grid place-items-center rounded-full hover:bg-gray-500/10"><ChevronLeft size={24}/></button><h2 className="text-xl md:text-3xl font-semibold leading-snug">{current.title}</h2></div>
      {message && <div role="status" className="rounded-2xl bg-blue-500/10 text-blue-500 p-3 text-sm mb-4">{message}</div>}
      {settingsMenu === 'connections' && <><Card><Row title="Wi-Fi" sub={!wifi ? '사용 안 함' : wifiConnected || '네트워크 선택'} onClick={props.onOpenWifi}><Toggle label="Wi-Fi" checked={wifi} onChange={v => { setWifi(v); if (!v) props.setWifiConnected?.(null); }}/></Row><Row title="블루투스" sub={bluetooth ? '사용 중 · 기기 선택' : '사용 안 함'} onClick={props.onOpenBluetooth}><Toggle label="블루투스" checked={bluetooth} onChange={setBluetooth}/></Row><Row title="비행기 탑승 모드" sub="Wi-Fi와 블루투스는 별도로 다시 켤 수 있어요."><Toggle label="비행기 탑승 모드" checked={airplane} onChange={v => { setAirplane(v); if (v) { setWifi(false); setBluetooth(false); props.setWifiConnected?.(null); } }}/></Row></Card><Hint>수업에서는 선생님이 알려 준 Wi-Fi 이름과 연습용 비밀번호를 확인하세요. 모르는 무료 Wi-Fi에 함부로 연결하지 않아요.</Hint></>}
      {settingsMenu === 'sounds' && <><Card><Row title="소리 모드"/><div className="grid grid-cols-3 gap-2 p-4">{([{id:'sound',name:'소리'},{id:'vibrate',name:'진동'},{id:'mute',name:'무음'}] as const).map(mode => <button key={mode.id} aria-pressed={sound === mode.id} onClick={() => { (props.setSoundMode ?? setLocalSound)(mode.id); setMessage(`${mode.name} 모드로 바꿨어요.`); }} className={`py-3 rounded-2xl text-sm ${sound === mode.id ? 'bg-blue-600 text-white' : 'bg-gray-500/10'}`}>{mode.name}</button>)}</div></Card><Card><div className="p-5"><label className="block font-medium mb-4" htmlFor="settings-media">미디어 음량 · {media}%</label><input id="settings-media" className="w-full accent-blue-600" type="range" min="0" max="100" value={media} onChange={e => { (props.setMediaVolume ?? setLocalMedia)(Number(e.target.value)); advanceQuest('settings-media-volume'); }}/></div><div className="p-5"><label className="block font-medium mb-4" htmlFor="settings-notif">알림 음량 · {notificationVolume}%</label><input id="settings-notif" className="w-full accent-blue-600" type="range" min="0" max="100" value={notificationVolume} onChange={e => (props.setNotifVolume ?? setLocalNotif)(Number(e.target.value))}/></div></Card><Hint>동영상 소리는 미디어 음량으로 조절해요. 무음이어도 미디어 소리가 나올 수 있어요. 진동 지원 여부는 갤럭시 모델마다 달라요.</Hint></>}
      {settingsMenu === 'notifications' && <><Card><Row title="방해 금지" sub="수업에 집중할 때 알림 방식을 조절해요."><Toggle label="방해 금지" checked={doNotDisturb} onChange={setDoNotDisturb}/></Row></Card><Card>{Object.entries(notificationsOn).map(([name, enabled]) => <Row key={name} title={name} icon={<GalaxyAppIcon appName={NOTIFICATION_APP_IDS[name] || name}/>} sub={enabled ? '알림 허용' : '알림 차단'}><Toggle label={`${name} 알림`} checked={enabled} onChange={v => { setNotificationsOn(prev => ({...prev,[name]:v})); advanceQuest('settings-app-notification'); }}/></Row>)}</Card><Hint>알림을 지우는 것과 앱 알림을 끄는 것은 달라요. 알림을 지워도 앱 안의 메시지는 남아 있어요. 이 페이지에서는 알림 설정을 연습해요.</Hint></>}
      {settingsMenu === 'display' && <><Card><Row title="다크 모드" sub="밝은 화면과 어두운 화면 중 편한 것을 골라요."><Toggle label="다크 모드" checked={darkMode} onChange={setDarkMode}/></Row><div className="p-5"><label htmlFor="settings-brightness" className="block font-medium mb-4">밝기 · {brightness}%</label><Target id="settings-brightness-slider"><div className="flex gap-4 items-center"><Sun size={21}/><input id="settings-brightness" type="range" min="10" max="100" value={brightness} onChange={e => { setBrightness(Number(e.target.value)); advanceQuest('settings-brightness-slider'); }} className="w-full accent-blue-600"/></div></Target></div></Card><Card><div className="p-5"><label htmlFor="settings-font" className="flex gap-2 font-medium mb-4"><Type size={20}/>글자 크기와 스타일</label><p className="mb-4" style={{fontSize:`${fontScale * 18}px`}}>안드로이드 탐험대</p><Target id="settings-fontsize-slider"><input id="settings-font" type="range" min="0.8" max="1.4" step="0.1" value={fontScale} onChange={e => { const next=Number(e.target.value); setFontScale(next); if(next>1) advanceQuest('settings-fontsize-slider'); }} className="w-full accent-blue-600"/></Target></div><div className="p-5"><label htmlFor="screen-timeout" className="block font-medium mb-3">화면 자동 꺼짐</label><Target id="settings-screen-time"><select id="screen-timeout" value={screenTimeout} onChange={e=>{setScreenTimeout(e.target.value); if(e.target.value==='1분') advanceQuest('settings-screen-time');}} className={`w-full rounded-xl border border-gray-400/30 p-3 ${panel}`}>{['15초','30초','1분','2분','5분','10분'].map(v=><option key={v}>{v}</option>)}</select><button className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-white text-sm" onClick={()=>{setMessage(`화면 자동 꺼짐을 ${screenTimeout}으로 설정했어요.`);if(screenTimeout==='1분')advanceQuest('settings-screen-time');}}>설정 확인</button></Target><Hint>화면을 사용하지 않을 때 꺼지는 시간을 고르는 연습이에요.</Hint></div></Card></>}
      {settingsMenu === 'wallpaper' && <><Card><div className="p-5"><h3 className="font-semibold mb-4">배경화면 변경</h3><Target id="settings-wallpaper-change"><div className="grid grid-cols-2 md:grid-cols-3 gap-3">{WALLPAPERS.map(wp=><button key={wp.name} aria-label={`${wp.name} 배경화면`} aria-pressed={wallpaper===wp.value} onClick={()=>{setWallpaper(wp.value);setThemeColor(wp.color);advanceQuest('settings-wallpaper-change');}} className="relative aspect-[4/3] rounded-2xl overflow-hidden text-white shadow-sm" style={{background:wp.value}}>{wallpaper===wp.value && <Check className="absolute top-2 right-2" size={20}/>}<span className="absolute bottom-2 left-2 text-xs bg-black/30 rounded-full px-2 py-1">{wp.name}</span></button>)}</div></Target></div></Card><Card><div className="p-5"><h3 className="font-semibold mb-4">컬러 팔레트</h3><div className="flex flex-wrap gap-3">{['#3b82f6','#a855f7','#ec4899','#f59e0b','#10b981'].map(color=><button key={color} aria-label={`강조 색상 ${color}`} aria-pressed={themeColor===color} className="w-11 h-11 rounded-full grid place-items-center text-white" style={{background:color}} onClick={()=>setThemeColor(color)}>{themeColor===color&&<Check size={21}/>}</button>)}</div></div></Card></>}
      {(settingsMenu === 'privacy' || settingsMenu === 'security') && <><Card><Row title="보안 위험 자동 차단" sub="출처를 알 수 없는 앱 설치 등으로부터 기기를 보호해요."><Toggle label="보안 위험 자동 차단" checked={autoBlocker} onChange={v=>{setAutoBlocker(v);setMessage(v?'보안 위험 자동 차단을 켰어요.':'앱은 선생님이 허락한 공식 스토어에서 설치하세요.');}}/></Row></Card><h3 className="font-semibold mb-2 px-2">권한 관리자</h3>{permissionsContent}</>}
      {settingsMenu === 'location' && <><Card><Row title="위치 사용" sub={locationOn?'사용 중':'사용 안 함'}><Toggle label="위치 사용" checked={locationOn} onChange={setLocationOn}/></Row><Row title="앱 권한" sub="위치를 사용할 수 있는 앱 확인" onClick={()=>go('privacy')}/></Card><Hint>지도에서 내 위치를 찾을 때처럼 꼭 필요한 상황에서 사용해요. 사진을 공유하기 전 위치 정보가 담겼는지 확인하세요.</Hint></>}
      {settingsMenu === 'lock' && <><Card><Target id="settings-lock-practice"><Row title="화면 잠금 방식" sub={pinConfigured?'PIN · 연습 설정 완료':'밀어서 잠금 해제 · PIN으로 바꾸기'} onClick={()=>{setLockPractice(true);setPracticePin('');}}/></Target></Card><Hint>기기를 놓고 자리를 비울 때는 측면 버튼을 눌러 잠그세요. 학교 기기의 실제 잠금 방식은 선생님과 함께 변경해요. 여기서는 정해진 연습용 PIN만 사용해요.</Hint></>}
      {(settingsMenu === 'battery' || settingsMenu === 'care') && <>{settingsMenu === 'battery' && <Card><Row title="배터리" sub="연습 기기 · 85% 남음"><BatteryCharging size={32} className="text-green-500"/></Row><Target id="settings-power-saving"><Row title="절전 모드" sub={powerSaving?'사용 중 · 배터리 사용을 줄여요':'사용 안 함'}><Toggle label="절전 모드" checked={powerSaving} onChange={v=>{setPowerSaving(v);if(v)advanceQuest('settings-power-saving');}}/></Row></Target></Card>}<Card><Target id="settings-storage-review"><Row title="저장공간" sub="32GB 사용 / 128GB · 연습용 예시" onClick={()=>{setStorageOpen(!storageOpen);advanceQuest('settings-storage-review');}}/></Target>{storageOpen&&<div className="p-5"><div className="h-3 rounded-full bg-gray-400/20 overflow-hidden mb-4"><div className="w-1/4 h-full bg-blue-500"/></div>{[['앱','18GB'],['사진 및 동영상','8GB'],['문서 및 기타','6GB'],['사용 가능','96GB']].map(([name,size])=><div key={name} className="flex justify-between text-sm py-2"><span>{name}</span><span className={secondary}>{size}</span></div>)}<Hint>용량이 부족하면 내 파일·갤러리에서 필요 없는 자료를 확인하고 정리해요. 모르는 시스템 파일은 지우지 않아요.</Hint><button onClick={()=>props.onOpenApp?.('MyFiles')} disabled={!props.onOpenApp} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm disabled:opacity-40">내 파일 열기</button></div>}</Card><Hint>{settingsMenu === 'battery' ? '저장공간은 디바이스 케어에서도 확인할 수 있어요. 절전 모드는 연습용 설정이에요.' : '저장공간의 숫자는 연습용 예시예요. 실제 용량은 사용하는 기기에서 확인하세요.'}</Hint></>}
      {settingsMenu === 'update' && <><Card><Target id="settings-update-check"><Row title="다운로드 및 설치" sub={updateStatus==='checking'?'업데이트 확인 중…':updateStatus==='done'?'연습용 업데이트 확인 완료':'새로운 소프트웨어 확인'} onClick={()=>{if(updateStatus!=='checking')setUpdateStatus('checking');}}/></Target>{updateStatus==='done'&&<div role="status" className="p-5 text-sm leading-relaxed"><Check className="text-green-500 mb-2"/>업데이트 확인 연습을 마쳤어요. 실제 {isPhone ? '스마트폰' : '태블릿'}에서는 Wi-Fi와 충전 상태를 확인하고 선생님께 알린 뒤 진행하세요.</div>}</Card><Hint>앱 업데이트와 안드로이드·One UI 업데이트는 서로 달라요. 이 웹앱은 실제 기기 소프트웨어를 바꾸지 않아요.</Hint></>}
      {settingsMenu === 'home' && <><Card><Row title="홈 화면과 앱스 화면" sub="홈 화면은 자주 쓰는 앱, 앱스 화면은 설치된 앱 전체를 보여줘요."/><Row title="홈 화면 아이콘 이동" sub="홈 화면에서 아이콘을 길게 누른 후 빈 자리로 끌어 놓아요."/><Row title="위젯" sub="홈 화면의 빈 곳을 길게 누르고 위젯을 선택해요."/></Card><Hint>홈 화면에서 아이콘만 삭제해도 앱은 남아 있어요. 앱 자체를 없애려면 ‘설치 삭제’를 사용해요.</Hint></>}
      {settingsMenu === 'advanced' && <><Card><Row title="화면 캡처" sub="측면 버튼과 음량 아래 버튼을 동시에 짧게 눌러요. 캡처는 갤러리에서 확인해요."/><Row title="멀티윈도우" sub="최근 앱 → 앱 아이콘 → 분할 화면으로 열기 → 두 번째 앱 선택"/><Row title="S펜" sub="지원되는 갤럭시 기기에서는 Samsung Notes에 글씨를 쓰거나 그릴 수 있어요."/></Card><Hint>물리 버튼과 S펜 지원 여부는 모델에 따라 달라요. 이 앱의 기기 버튼으로 조작 순서를 연습할 수 있어요.</Hint></>}
      {settingsMenu === 'digital' && <><Card><Row title="화면 사용 시간" sub="연습 예시 · 오늘 30분"/><Row title="눈과 몸 쉬기" sub="오랫동안 볼 때는 먼 곳을 보고 바른 자세로 쉬어요."/><Row title="자녀 보호 기능" sub="개인 기기에서는 보호자와 함께, 학교 기기에서는 선생님과 함께 정해요."/></Card><button className="w-full rounded-2xl py-4 bg-blue-600 text-white" onClick={()=>setMessage('잠깐 화면에서 눈을 떼고 먼 곳을 바라보세요. 어깨와 손목도 가볍게 움직여요.')}>휴식 안내 보기</button></>}
      {settingsMenu === 'apps' && <><Hint>앱을 선택하면 어떤 권한을 쓰는지 확인할 수 있어요.</Hint>{permissionsContent}</>}
      {settingsMenu === 'general' && <><Card><Row title="언어" sub="한국어 (대한민국)"/><Row title="삼성 키보드 설정" sub="한/영 전환 · 숫자/기호 · 지우기 · 줄바꿈" onClick={()=>setMessage('입력칸을 누르면 키보드가 열려요. 한/영으로 언어를 바꾸고, 123 또는 기호 버튼으로 숫자와 기호를 입력해요.')}/><Row title="복사 및 붙여넣기" sub="글자를 길게 눌러 선택 → 복사 → 붙여넣을 입력칸 길게 누르기" onClick={()=>setMessage('복사는 원래 글을 남기고, 잘라내기는 선택한 글을 옮겨요. 비밀번호 같은 개인정보는 복사·공유하지 않아요.')}/><Row title="날짜 및 시간" sub="자동 설정 · 네트워크에서 제공하는 시간"/></Card></>}
      {settingsMenu === 'accessibility' && <><Card><Row title="시인성 향상" sub="화면을 읽기 편하게 조절해요."/><div className="p-5"><label htmlFor="accessible-font" className="block mb-3">글자 크기 · {Math.round(fontScale*100)}%</label><input id="accessible-font" className="w-full accent-blue-600" type="range" min="0.8" max="1.4" step="0.1" value={fontScale} onChange={e=>{const next=Number(e.target.value);setFontScale(next);if(next>1)advanceQuest('settings-accessibility-size');}}/><p className="mt-4" style={{fontSize:`${fontScale*18}px`}}>글자를 편안하게 읽어요.</p></div></Card><Hint>화면을 읽기 어렵거나 소리를 듣기 어려우면 선생님께 알려 주세요. 실제 기기의 TalkBack 등 보조 기능은 선생님과 함께 사용해요.</Hint></>}
      {settingsMenu === 'about' && <><Card><Row title="기기 이름" sub={`안드로이드 탐험대 · ${isPhone ? '갤럭시 스마트폰' : '갤럭시탭'} 연습 기기`}/><Row title="소프트웨어 정보" sub={`Android 17 · One UI 9 기준 / ${isPhone ? 'Galaxy 스마트폰' : 'Galaxy Tab S12 계열'} 공통 조작`}/><Row title="이 앱에서 저장되는 내용" sub="학습 진도와 연습 설정. 실제 사진 촬영·계정 로그인·네트워크 변경은 하지 않아요."/></Card><Hint>실제 기기의 버전은 설정 → {aboutTitle} → 소프트웨어 정보에서 확인하세요. 모델과 학교 관리 정책에 따라 항목이 다를 수 있어요.</Hint></>}
      {settingsMenu === 'account' && <><Hint>Google·삼성 계정은 서비스마다 역할이 달라요. 학교에서는 선생님이 안내한 계정을 사용하고, 비밀번호는 다른 사람에게 알려 주지 않아요.</Hint><Card><Row title="계정 관리" sub={googleAccount || '등록된 연습 계정 없음'}/>{googleAccount&&<Target id="google-logout-btn"><Row title="연습 계정 삭제 (기기에서 로그아웃)" sub="기기에서 계정을 빼는 것과 계정 자체를 없애는 것은 달라요." onClick={()=>{setLogoutConfirmOpen(true);advanceQuest('google-logout-btn');}}/></Target>}<Target id="account-add-btn"><Row title="계정 추가" sub="연습 계정으로 진행 · 실제 계정 입력 금지" onClick={()=>{setAccountAddOpen(true);advanceQuest('account-add-btn');}}/></Target></Card><Card><Row title="백업" sub="자료를 다른 안전한 곳에 보관하는 것이에요. 동기화와 삭제의 영향을 선생님과 확인하세요."/></Card></>}
    </main>
    {(permission || lockPractice || logoutConfirmOpen || accountAddOpen) && <div className="absolute inset-0 z-[210] bg-black/50 grid place-items-center p-3 md:p-5" onClick={()=>{setPermission(null);setLockPractice(false);setLogoutConfirmOpen(false);setAccountAddOpen(false);}}><div role="dialog" aria-modal="true" aria-label={permission?'앱 권한':lockPractice?'PIN 연습':'계정 관리'} className={`${panel} rounded-[28px] p-5 md:p-6 w-full max-w-md max-h-full overflow-y-auto shadow-2xl`} onClick={e=>e.stopPropagation()}>
      {permission&&<><GalaxyAppIcon appName={permission.app} style={{width: 48, height: 48, marginBottom: 16}}/><h3 className="font-semibold text-xl mb-2">{permission.name} 권한</h3><p className={`text-sm mb-5 ${secondary}`}>{APP_NAMES[permission.app] || permission.app}에서 꼭 필요한 권한인지 생각해 보세요.</p><div className="space-y-2"><button className="w-full text-left rounded-2xl p-4 bg-gray-500/10" onClick={()=>applyPermission(true)}>{['카메라','마이크','위치'].includes(permission.name)?'앱 사용 중에만 허용':'허용'}</button><button className="w-full text-left rounded-2xl p-4 bg-blue-500/10 text-blue-500 font-semibold" onClick={()=>applyPermission(false)}>허용 안 함</button></div></>}
      {lockPractice&&<><h3 className="font-semibold text-xl mb-3">PIN으로 잠금 연습</h3><p className={`text-sm leading-relaxed mb-4 ${secondary}`}>실제 비밀번호 대신 연습용 PIN <strong>482716</strong>을 입력하세요. 이 입력은 저장하지 않아요.</p><input aria-label="연습용 PIN" inputMode="numeric" autoComplete="off" maxLength={6} value={practicePin} onChange={e=>setPracticePin(e.target.value.replace(/\D/g,''))} className="bg-gray-500/10 rounded-xl w-full p-3 text-center text-2xl tracking-[0.35em]"/><button disabled={practicePin!=='482716'} onClick={()=>{setPinConfigured(true);setPracticePin('');setLockPractice(false);setMessage('PIN 설정 순서 연습을 마쳤어요. 실제 기기의 잠금은 바뀌지 않아요.');advanceQuest('settings-lock-practice');}} className="w-full mt-4 py-3 rounded-xl bg-blue-600 text-white disabled:opacity-40">연습 PIN 확인</button></>}
      {logoutConfirmOpen&&<><h3 className="font-semibold text-xl mb-3">기기에서 연습 계정을 삭제할까요?</h3><p className={`text-sm leading-relaxed mb-5 ${secondary}`}>이 연습 기기에서 로그아웃하는 과정이에요. Google 계정 자체를 영구 삭제하는 기능은 아니에요.</p><Target id="google-logout-confirm"><button className="w-full py-3 rounded-xl bg-red-500 text-white" onClick={()=>{setGoogleAccount(null);setGoogleEmail('');setGooglePassword('');setGoogleConsent(false);setGoogleLoginStep('email');setLogoutConfirmOpen(false);advanceQuest('google-logout-confirm');}}>기기에서 삭제 (로그아웃)</button></Target></>}
      {accountAddOpen&&<><h3 className="font-semibold text-xl mb-3">계정 추가</h3><p className={`text-xs leading-relaxed mb-4 ${secondary}`}>교육용 연습 화면입니다. 실제 이메일·비밀번호를 입력하지 마세요.</p><Target id="account-google"><button className="w-full flex items-center gap-3 p-4 bg-gray-500/10 rounded-2xl text-left" onClick={()=>{setAccountAddOpen(false);setGoogleLoginOpen(true);setGoogleLoginStep('email');setGoogleEmail('');setGooglePassword('');setGoogleError('');setGoogleConsent(false);advanceQuest('account-google');}}><GalaxyAppIcon appName="Google" style={{width: 36, height: 36, flexShrink: 0}}/><span><span className="block font-semibold">탐험대 연습 계정</span><span className={`block text-xs ${secondary}`}>Google 계정 추가 순서 연습</span></span></button></Target></>}
      <button className="w-full mt-4 py-3 rounded-xl bg-gray-500/10 text-sm" onClick={()=>{setPermission(null);setLockPractice(false);setLogoutConfirmOpen(false);setAccountAddOpen(false);}}>취소</button>
    </div></div>}
  </div></SettingsUiContext.Provider>;
};
export default SettingsApp;
