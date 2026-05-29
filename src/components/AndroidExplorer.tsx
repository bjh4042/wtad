// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi, Bluetooth, Volume2, VolumeX, Vibrate,
  Sun, Camera, Settings, Play, Search,
  ChevronLeft, BatteryMedium, Signal, Check, Trash2, X, GripHorizontal,
  Mic, MoreHorizontal, RefreshCcw, Plane, Flashlight, MapPin,
  MonitorPlay, ShieldCheck, User, Bell, ImageIcon, Home,
  Lock, ShieldAlert, AlertTriangle, HeartPulse, BatteryCharging,
  Grid, Sliders, Smartphone, PaintBucket, Moon, Type, ChevronUp,
  Cloud, MessageSquare, Power, Minus
} from 'lucide-react';

const QUESTS = [
  { id: 0, text: "갤럭시탭이 잠겨있어요. 잠금화면을 위로 밀어 올려 잠금을 해제하세요.", targetId: 'lock-swipe', exp: 10 },
  { id: 1, text: "상단 표시줄을 드래그하여 퀵패널을 여세요.", targetId: 'swipe-trigger', exp: 20 },
  { id: 2, text: "와이파이 아이콘의 이름을 눌러 와이파이 설정을 켜세요.", targetId: 'quick-wifi-toggle', exp: 20 },
  { id: 3, text: "'탐험대_WiFi' 네트워크를 선택하세요.", targetId: 'wifi-net-0', exp: 20 },
  { id: 4, text: "비밀번호 입력칸을 누르고 아무 비밀번호나 입력하세요.", targetId: 'wifi-pw-input', exp: 10 },
  { id: 5, text: "연결 버튼을 누르세요.", targetId: 'wifi-connect-btn', exp: 30 },
  { id: 6, text: "빈 곳을 터치하거나 위로 올려 퀵패널을 닫으세요.", targetId: 'quick-panel-bg', exp: 10 },
  { id: 7, text: "설정 앱을 실행하세요.", targetId: 'app-icon-Settings', exp: 20 },
  { id: 8, text: "좌측 메뉴에서 '디스플레이'를 찾아 선택하세요.", targetId: 'settings-menu-display', exp: 20 },
  { id: 9, text: "우측 화면의 밝기 조절 바를 움직여 밝기를 조절해보세요.", targetId: 'settings-brightness-slider', exp: 20 },
  { id: 10, text: "좌측 메뉴를 위로 올려 '배경화면 및 스타일'을 선택하세요.", targetId: 'settings-menu-wallpaper', exp: 20 },
  { id: 11, text: "우측 화면에서 새로운 배경화면 색상을 선택하세요.", targetId: 'settings-wallpaper-change', exp: 30 },
  { id: 12, text: "하단의 둥근 사각형(홈) 버튼을 눌러 바탕화면으로 가세요.", targetId: 'nav-home', exp: 10 },
  { id: 13, text: "바탕화면의 '카메라' 앱을 1초 이상 꾹~ 길게 누르세요.", targetId: 'app-icon-Camera-long-press', exp: 30 },
  { id: 14, text: "아이콘이 깜빡거리면 카메라 앱을 드래그하여 다른 위치로 옮기세요.", targetId: 'drag-camera', exp: 30 },
  { id: 15, text: "이동된 '카메라' 앱을 클릭하여 실행하세요.", targetId: 'app-icon-Camera', exp: 20 },
  { id: 16, text: "하단 중앙의 둥근 셔터 버튼을 눌러 학생 사진을 촬영하세요.", targetId: 'camera-shutter', exp: 30 },
  { id: 17, text: "하단의 홈 버튼을 눌러 바탕화면으로 가세요.", targetId: 'nav-home', exp: 10 },
  { id: 18, text: "갤러리 앱을 실행하세요.", targetId: 'app-icon-Gallery', exp: 20 },
  { id: 19, text: "방금 찍은 사진을 선택하세요.", targetId: 'gallery-photo-0', exp: 20 },
  { id: 20, text: "하단 휴지통 아이콘을 눌러 사진을 삭제하세요.", targetId: 'gallery-delete', exp: 20 },
  { id: 21, text: "삭제 확인(이동) 버튼을 누르세요.", targetId: 'gallery-delete-confirm', exp: 10 },
  { id: 22, text: "하단의 홈 버튼을 눌러 바탕화면으로 가세요.", targetId: 'nav-home', exp: 10 },
  { id: 23, text: "Play 스토어 앱을 실행하세요.", targetId: 'app-icon-PlayStore', exp: 20 },
  { id: 24, text: "상단 검색창을 클릭하세요.", targetId: 'playstore-search-bar', exp: 10 },
  { id: 25, text: "가상 키보드에서 파란색 자판을 순서대로 눌러 '똑똑수학탐험대'를 완성하세요.", targetId: 'playstore-search-input', exp: 20 },
  { id: 26, text: "키보드의 파란색 '검색' 버튼을 누르세요.", targetId: 'playstore-search-submit', exp: 10 },
  { id: 27, text: "'똑똑수학탐험대' 앱의 설치 버튼을 누르세요.", targetId: 'playstore-install-btn', exp: 30 },
  { id: 28, text: "홈 버튼을 눌러 바탕화면으로 돌아가세요.", targetId: 'nav-home', exp: 10 },
  { id: 29, text: "방금 설치한 '수학탐험대' 앱을 바탕화면에서 실행해보세요.", targetId: 'app-icon-math', exp: 20 },
  { id: 30, text: "홈 버튼을 눌러 다시 바탕화면으로 가세요.", targetId: 'nav-home', exp: 10 },
  { id: 31, text: "상단을 드래그하여 퀵패널을 여세요.", targetId: 'swipe-trigger', exp: 10 },
  { id: 32, text: "음량 슬라이더를 움직여 소리 크기를 조절해보세요.", targetId: 'quick-volume-slider', exp: 20 },
  { id: 33, text: "소리 모드 버튼에서 '진동'을 눌러보세요.", targetId: 'quick-sound-vibrate', exp: 20 },
  { id: 34, text: "비행기 탑승 모드를 켜보세요. (공공장소·비행 시 사용)", targetId: 'quick-airplane', exp: 20 },
  { id: 35, text: "모든 임무 완료! 훌륭한 안드로이드 탐험가입니다 🎉", targetId: null, exp: 50 },
];




const SETTINGS_MENUS = [
  { id: 'account', icon: <User size={20} className="text-white"/>, title: '계정 및 백업', sub: '계정 관리 · Smart Switch', bg: 'bg-blue-500' },
  { id: 'connections', icon: <Wifi size={20} className="text-white"/>, title: '연결', sub: 'Wi-Fi · 블루투스 · 비행기 탑승 모드', bg: 'bg-blue-500' },
  { id: 'sounds', icon: <Volume2 size={20} className="text-white"/>, title: '소리 및 진동', sub: '소리 모드 · 벨소리', bg: 'bg-purple-500' },
  { id: 'notifications', icon: <Bell size={20} className="text-white"/>, title: '알림', sub: '앱 알림 · 상태표시줄', bg: 'bg-orange-500' },
  { id: 'display', icon: <Sun size={20} className="text-white"/>, title: '디스플레이', sub: '밝기 · 화면 보호', bg: 'bg-green-500' },
  { id: 'wallpaper', icon: <PaintBucket size={20} className="text-white"/>, title: '배경화면 및 스타일', sub: '배경화면 · 컬러 팔레트', bg: 'bg-pink-500' },
  { id: 'home', icon: <Home size={20} className="text-white"/>, title: '홈 화면', sub: '레이아웃 · 앱 아이콘 배지', bg: 'bg-blue-400' },
  { id: 'lock', icon: <Lock size={20} className="text-white"/>, title: '잠금화면', sub: '화면 잠금 방식', bg: 'bg-teal-500' },
  { id: 'security', icon: <ShieldCheck size={20} className="text-white"/>, title: '생체 인식 및 보안', sub: '얼굴 인식 · 지문', bg: 'bg-indigo-500' },
  { id: 'privacy', icon: <ShieldAlert size={20} className="text-white"/>, title: '개인정보 보호', sub: '권한 사용 · 권한 관리자', bg: 'bg-green-600' },
  { id: 'location', icon: <MapPin size={20} className="text-white"/>, title: '위치', sub: '위치 요청', bg: 'bg-green-400' },
  { id: 'safety', icon: <AlertTriangle size={20} className="text-white"/>, title: '안전 및 긴급', sub: '의료정보 · 재난문자', bg: 'bg-red-500' },
  { id: 'advanced', icon: <Settings size={20} className="text-white"/>, title: '유용한 기능', sub: 'Android Auto · 실험실 · 측면 버튼', bg: 'bg-orange-400' },
  { id: 'digital', icon: <HeartPulse size={20} className="text-white"/>, title: '디지털 웰빙 및 자녀 보호 기능', sub: '사용 시간 · 앱 타이머', bg: 'bg-green-500' },
  { id: 'battery', icon: <BatteryCharging size={20} className="text-white"/>, title: '배터리 및 디바이스 케어', sub: '저장공간 · RAM · 디바이스 보호', bg: 'bg-teal-500' },
  { id: 'apps', icon: <Grid size={20} className="text-white"/>, title: '애플리케이션', sub: '기본 앱 · 애플리케이션 설정', bg: 'bg-blue-500' },
  { id: 'general', icon: <Sliders size={20} className="text-white"/>, title: '일반', sub: '언어 및 키보드 · 날짜 및 시간', bg: 'bg-gray-500' },
];

const WIFI_NETWORKS = [
  { id: 'wifi-net-0', name: '탐험대_WiFi', secure: true, signal: 4 },
  { id: 'wifi-net-1', name: 'Home_Guest', secure: false, signal: 3 },
  { id: 'wifi-net-2', name: 'iptime_5G', secure: true, signal: 4 },
  { id: 'wifi-net-3', name: 'STARBUCKS_WIFI', secure: false, signal: 2 },
  { id: 'wifi-net-4', name: 'AndroidHotspot', secure: true, signal: 3 },
];

const TARGET_SEQUENCE = [
  { key: 'Shift', display: '' }, { key: 'ㄸ', display: 'ㄸ' }, { key: 'ㅗ', display: '또' }, { key: 'ㄱ', display: '똑' },
  { key: 'Shift', display: '똑' }, { key: 'ㄸ', display: '똑ㄸ' }, { key: 'ㅗ', display: '똑또' }, { key: 'ㄱ', display: '똑똑' },
  { key: 'ㅅ', display: '똑똑ㅅ' }, { key: 'ㅜ', display: '똑똑수' },
  { key: 'ㅎ', display: '똑똑수ㅎ' }, { key: 'ㅏ', display: '똑똑수하' }, { key: 'ㄱ', display: '똑똑수학' },
  { key: 'ㅌ', display: '똑똑수학ㅌ' }, { key: 'ㅏ', display: '똑똑수학타' }, { key: 'ㅁ', display: '똑똑수학탐' },
  { key: 'ㅎ', display: '똑똑수학탐ㅎ' }, { key: 'ㅓ', display: '똑똑수학탐허' }, { key: 'ㅁ', display: '똑똑수학탐험' },
  { key: 'ㄷ', display: '똑똑수학탐험ㄷ' }, { key: 'ㅐ', display: '똑똑수학탐험대' }
];

const CuteStudent = ({ seed }) => {
  const isGirl = seed % 2 === 0;
  const skinColors = ['#fef08a', '#ffedd5', '#fde047', '#fed7aa'];
  const skin = skinColors[(seed % 4 + 4) % 4];
  if (isGirl) {
    return (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl transition-all duration-300">
        <rect width="100" height="100" fill="#fbcfe8" rx="20"/>
        <path d="M 20 50 Q 50 10 80 50 L 70 80 Q 50 90 30 80 Z" fill="#3f3f46"/>
        <circle cx="50" cy="48" r="24" fill={skin}/>
        <path d="M 26 40 Q 50 20 74 40 Q 50 30 26 40" fill="#3f3f46"/>
        <circle cx="40" cy="50" r="4.5" fill="#18181b"/><circle cx="60" cy="50" r="4.5" fill="#18181b"/>
        <circle cx="41.5" cy="48.5" r="1.5" fill="#fff"/><circle cx="61.5" cy="48.5" r="1.5" fill="#fff"/>
        <circle cx="34" cy="56" r="3.5" fill="#f87171" opacity="0.5"/><circle cx="66" cy="56" r="3.5" fill="#f87171" opacity="0.5"/>
        <path d="M 46 60 Q 50 66 54 60" fill="#e11d48"/>
        <path d="M 25 100 Q 25 80 50 80 Q 75 80 75 100" fill="#ec4899"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl transition-all duration-300">
      <rect width="100" height="100" fill="#e0f2fe" rx="20"/>
      <path d="M 26 45 Q 50 0 74 45" fill="#1e3a8a"/>
      <circle cx="50" cy="48" r="24" fill={skin}/>
      <path d="M 26 38 Q 50 18 74 38 Q 60 25 50 32 Q 40 25 26 38" fill="#1e3a8a"/>
      <circle cx="40" cy="49" r="4" fill="#0f172a"/><circle cx="60" cy="49" r="4" fill="#0f172a"/>
      <circle cx="34" cy="55" r="3" fill="#fca5a5" opacity="0.6"/><circle cx="66" cy="55" r="3" fill="#fca5a5" opacity="0.6"/>
      <path d="M 44 60 Q 50 65 56 60" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M 25 100 Q 25 80 50 80 Q 75 80 75 100" fill="#0284c7"/>
    </svg>
  );
};

const ActionTarget = ({
  id, children, onClick, onTouchStart, onTouchEnd, onTouchMove,
  onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onPointerDown, onPointerMove, onPointerUp,
  className = "", style = {}, currentTargetId, advanceQuest, disableClickAdvance,
  extraTargetIds = [], tooltipPosition = 'top', tooltipText = '여기를 누르세요!'
}) => {
  const isTarget = currentTargetId === id || extraTargetIds.includes(currentTargetId);
  const tooltipClasses = tooltipPosition === 'bottom'
    ? 'absolute -bottom-12 left-1/2 transform -translate-x-1/2'
    : 'absolute -top-12 left-1/2 transform -translate-x-1/2';
  const arrowClasses = tooltipPosition === 'bottom'
    ? 'absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-blue-600'
    : 'absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-blue-600';
  return (
    <div
      onClick={(e) => { if(onClick) onClick(e); if(!disableClickAdvance) advanceQuest(id); }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchMove={onTouchMove}
      onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      className={`relative ${className} ${isTarget ? 'ring-4 ring-yellow-400 animate-pulse z-[70] rounded-2xl bg-yellow-400/20' : ''}`}
      style={style}
    >
      {isTarget && (
        <div className={`${tooltipClasses} bg-blue-600 text-white text-[13px] px-4 py-2 rounded-xl shadow-xl whitespace-nowrap z-[110] pointer-events-none font-bold`}>
          {tooltipText}
          <div className={arrowClasses}></div>
        </div>
      )}
      {children}
    </div>
  );
};


export default function AndroidExplorer() {
  const [time, setTime] = useState<Date | null>(null);

  const [wifi, setWifi] = useState(false);
  const [wifiConnected, setWifiConnected] = useState(null);
  const [bluetooth, setBluetooth] = useState(false);
  const [airplane, setAirplane] = useState(false);
  const [soundMode, setSoundMode] = useState('sound');
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(70);
  const [photos, setPhotos] = useState([]);
  const [installedApps, setInstalledApps] = useState([]);
  const [currentCameraSeed, setCurrentCameraSeed] = useState(Date.now());
  const [wallpaper, setWallpaper] = useState('radial-gradient(circle at 100% 30%, #c7d2fe 0%, #818cf8 30%, transparent 60%), radial-gradient(circle at 0% 100%, #e879f9 0%, #818cf8 40%, transparent 70%), #1e3a8a');
  const [mathAppOpen, setMathAppOpen] = useState(false);

  const initialApps = Array(24).fill(null);
  initialApps[8] = 'GameLauncher'; initialApps[9] = 'Store'; initialApps[10] = 'Camera'; initialApps[11] = 'Gallery';
  initialApps[12] = 'Wearable'; initialApps[13] = 'Calendar'; initialApps[14] = 'Clock'; initialApps[15] = 'Health';
  initialApps[16] = 'Folder'; initialApps[17] = 'Notes'; initialApps[18] = 'Messages'; initialApps[19] = 'Internet';
  initialApps[20] = 'PlayStore'; initialApps[21] = 'YouTube'; initialApps[22] = 'KakaoTalk'; initialApps[23] = 'Naver';
  initialApps[7] = 'Settings';

  const [homeApps, setHomeApps] = useState(initialApps);
  const [isEditMode, setIsEditMode] = useState(false);
  const pressTimer = useRef(null);

  const [dragInfo, setDragInfo] = useState({ isDragging: false, index: null, x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const [hoverIndex, setHoverIndex] = useState(null);

  const [currentApp, setCurrentApp] = useState(null);
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

  const [viewPhoto, setViewPhoto] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<number[]>([]);

  // 신규 상태들
  const [locked, setLocked] = useState(true);
  const [lockSwipeY, setLockSwipeY] = useState<number | null>(null);
  const [lockOffset, setLockOffset] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [widgets, setWidgets] = useState<string[]>([]);
  const [widgetPickerOpen, setWidgetPickerOpen] = useState(false);
  const [homeMenuOpen, setHomeMenuOpen] = useState(false);
  const [homeLongPressTimer, setHomeLongPressTimer] = useState<any>(null);
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const [drawerSwipeStart, setDrawerSwipeStart] = useState<number | null>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, app: 'KakaoTalk', appName: '카카오톡', title: '엄마', body: '학교 끝나면 바로 와~', color: 'bg-yellow-400' },
    { id: 2, app: 'Messages', appName: '메시지', title: '010-1234-5678', body: '[Web발신] 택배가 도착했습니다.', color: 'bg-blue-500' },
  ]);
  const [cameraPermissionAsked, setCameraPermissionAsked] = useState(false);
  const [cameraPermissionPrompt, setCameraPermissionPrompt] = useState(false);
  const [settingsSearch, setSettingsSearch] = useState('');
  const [uninstallTarget, setUninstallTarget] = useState<string | null>(null);
  const [drawerLongPressTimer, setDrawerLongPressTimer] = useState<any>(null);


  const [questIdx, setQuestIdx] = useState(0);
  const [exp, setExp] = useState(0);
  const [showExpMenu, setShowExpMenu] = useState(true);
  const [expPos, setExpPos] = useState({ x: 20, y: 60 });
  const [isDraggingExp, setIsDraggingExp] = useState(false);
  const dragRefExp = useRef(null);
  const [touchStartY, setTouchStartY] = useState(null);

  const currentTargetId = QUESTS[questIdx]?.targetId;

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--';
  const dateStr = time ? time.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }) : '';

  // 다중 선택 미션 도달 시 샘플 사진 자동 추가
  useEffect(() => {
    if (questIdx === 21 && photos.length < 3) {
      setPhotos([
        { id: Date.now() + 1, seed: 1001 },
        { id: Date.now() + 2, seed: 1002 },
        { id: Date.now() + 3, seed: 1003 },
      ]);
    }
  }, [questIdx]);




  const advanceQuest = (targetId) => {
    if (QUESTS[questIdx]?.targetId === targetId) {
      setExp(e => e + QUESTS[questIdx].exp);
      setQuestIdx(q => q + 1);
    }
  };

  const handleDragStartExp = (e) => {
    setIsDraggingExp(true);
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    dragRefExp.current = { startX: clientX, startY: clientY, initX: expPos.x, initY: expPos.y };
  };

  const handleGlobalMove = (e) => {
    if (isDraggingExp) {
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      setExpPos({
        x: dragRefExp.current.initX + (clientX - dragRefExp.current.startX),
        y: dragRefExp.current.initY + (clientY - dragRefExp.current.startY)
      });
    }
    if (touchStartY !== null && !dragInfo.isDragging) {
      const currentY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      if (!quickPanelOpen && currentY - touchStartY > 15) {
        setQuickPanelOpen(true);
        advanceQuest('swipe-trigger');
        setTouchStartY(null);
      } else if (quickPanelOpen && touchStartY - currentY > 15) {
        setQuickPanelOpen(false);
        advanceQuest('quick-panel-bg');
        setTouchStartY(null);
      }
    }
  };


  const handleGlobalEnd = () => { setIsDraggingExp(false); setTouchStartY(null); };
  const handleSwipeStart = (e) => { setTouchStartY(e.type.includes('touch') ? e.touches[0].clientY : e.clientY); };

  const handleAppPressStart = (appName) => {
    if (isEditMode) return;
    pressTimer.current = setTimeout(() => {
      setIsEditMode(true);
      if (appName === 'Camera') advanceQuest('app-icon-Camera-long-press');
    }, 600);
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

  const renderAppIcon = (appName, index) => {
    let content = null;
    let name = '';
    switch(appName) {
      case 'GameLauncher': name = 'Game Launcher';
        content = (<div className="w-full h-full bg-[#8b5cf6] rounded-[1.25rem] flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 100 100" className="w-1/2 h-1/2">
            <path d="M 10 30 L 40 70 M 40 30 L 10 70" stroke="#fff" strokeWidth="12" strokeLinecap="round"/>
            <circle cx="75" cy="30" r="14" stroke="#fff" strokeWidth="10" fill="none"/>
            <circle cx="65" cy="75" r="8" fill="#fff"/><circle cx="90" cy="75" r="8" fill="#fff"/>
          </svg></div>); break;
      case 'Store': name = 'Galaxy Store';
        content = (<div className="w-full h-full rounded-[1.25rem] flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-1/2 h-1/2">
            <rect x="15" y="35" width="70" height="55" rx="8" fill="#fff"/>
            <path d="M 30 35 Q 50 -5 70 35" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round"/>
            <path d="M 35 50 L 65 50" stroke="#ec4899" strokeWidth="6" strokeLinecap="round"/>
          </svg></div>); break;
      case 'Camera': name = '카메라';
        content = (<div className="w-full h-full bg-[#e5e7eb] rounded-[1.25rem] flex items-center justify-center shadow-lg relative">
          <div className="w-[60%] h-[60%] border-[4px] border-[#9ca3af] rounded-full flex items-center justify-center bg-[#1f2937]">
            <div className="w-[35%] h-[35%] bg-[#6b7280] rounded-full"></div></div>
          <div className="absolute top-[20%] right-[20%] w-[12%] h-[12%] bg-[#ef4444] rounded-full shadow-sm"></div>
        </div>); break;
      case 'Gallery': name = '갤러리';
        content = (<div className="w-full h-full bg-[#ef4444] rounded-[1.25rem] flex items-center justify-center shadow-lg relative overflow-hidden border border-red-600">
          <svg viewBox="0 0 100 100" className="w-[70%] h-[70%] transform rotate-[15deg]">
            <ellipse cx="50" cy="20" rx="14" ry="22" fill="#fff" opacity="0.95"/>
            <ellipse cx="50" cy="80" rx="14" ry="22" fill="#fff" opacity="0.95"/>
            <ellipse cx="20" cy="50" rx="22" ry="14" fill="#fff" opacity="0.85"/>
            <ellipse cx="80" cy="50" rx="22" ry="14" fill="#fff" opacity="0.85"/>
            <ellipse cx="28" cy="28" rx="16" ry="16" fill="#fff" opacity="0.75"/>
            <ellipse cx="72" cy="72" rx="16" ry="16" fill="#fff" opacity="0.75"/>
            <circle cx="50" cy="50" r="10" fill="#f59e0b" />
          </svg></div>); break;
      case 'Wearable': name = 'Wear';
        content = (<div className="w-full h-full bg-[#3b82f6] rounded-[1.25rem] flex items-center justify-center shadow-lg"><span className="text-white font-bold text-[18px]">Wear</span></div>); break;
      case 'Calendar': name = '캘린더';
        content = (<div className="w-full h-full bg-white rounded-[1.25rem] flex flex-col items-center shadow-lg overflow-hidden border border-gray-100">
          <div className="w-full bg-[#22c55e] h-[25%]"></div>
          <div className="flex-1 flex items-center justify-center"><span className="text-[#111] font-black text-2xl">29</span></div></div>); break;
      case 'Clock': name = '시계';
        content = (<div className="w-full h-full bg-white rounded-[1.25rem] flex items-center justify-center shadow-lg border border-gray-100">
          <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]">
            <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="6" fill="none"/>
            <path d="M 50 50 L 50 20" stroke="#111" strokeWidth="6" strokeLinecap="round"/>
            <path d="M 50 50 L 75 65" stroke="#111" strokeWidth="4" strokeLinecap="round"/>
            <path d="M 50 50 L 30 70" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="4" fill="#ef4444"/></svg></div>); break;
      case 'Health': name = 'Samsung Health';
        content = (<div className="w-full h-full bg-[#14b8a6] rounded-[1.25rem] flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 100 100" className="w-1/2 h-1/2">
            <circle cx="50" cy="20" r="12" fill="#fff"/>
            <path d="M 35 45 Q 50 35 65 40 L 75 70 M 50 40 L 40 85 M 50 40 L 60 90" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg></div>); break;
      case 'Folder': name = 'Google';
        content = (<div className="w-full h-full bg-white rounded-[1.25rem] grid grid-cols-2 grid-rows-2 gap-1 p-3 shadow-lg">
          <div className="bg-blue-500 rounded-full"></div><div className="bg-red-500 rounded-full"></div><div className="bg-yellow-500 rounded-full"></div><div className="bg-green-500 rounded-full"></div></div>); break;
      case 'Notes': name = 'Samsung Notes';
        content = (<div className="w-full h-full bg-[#ef4444] rounded-[1.25rem] flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 100 100" className="w-[60%] h-[60%]">
            <path d="M 20 10 L 60 10 L 80 30 L 80 90 L 20 90 Z" fill="#fff"/>
            <path d="M 60 10 L 60 30 L 80 30" fill="#fca5a5"/>
            <path d="M 35 45 L 65 45 M 35 60 L 65 60 M 35 75 L 55 75" stroke="#ef4444" strokeWidth="5" strokeLinecap="round"/>
          </svg></div>); break;
      case 'Messages': name = '메시지';
        content = (<div className="w-full h-full bg-[#3b82f6] rounded-[1.25rem] flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 100 100" className="w-[65%] h-[65%]">
            <path d="M 10 30 Q 10 10 50 10 Q 90 10 90 30 L 90 60 Q 90 80 50 80 L 25 85 L 30 70 Q 10 65 10 30 Z" fill="#ffffff"/>
            <circle cx="30" cy="45" r="6" fill="#3b82f6"/><circle cx="50" cy="45" r="6" fill="#3b82f6"/><circle cx="70" cy="45" r="6" fill="#3b82f6"/>
          </svg></div>); break;
      case 'Internet': name = '인터넷';
        content = (<div className="w-full h-full rounded-[1.25rem] flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]">
            <circle cx="50" cy="50" r="30" fill="#fff"/>
            <path d="M 10 65 Q 50 15 90 35" stroke="#d8b4fe" strokeWidth="8" fill="none" strokeLinecap="round"/>
            <path d="M 10 65 Q 50 115 90 35" stroke="#d8b4fe" strokeWidth="8" fill="none" strokeLinecap="round"/>
          </svg></div>); break;
      case 'PlayStore': name = 'Play 스토어';
        content = (<div className="w-full h-full bg-white rounded-[1.25rem] flex items-center justify-center shadow-lg border border-gray-100">
          <svg viewBox="0 0 100 100" className="w-[55%] h-[55%] ml-1">
            <path d="M 20 15 L 85 50 L 20 85 Z" fill="#34d399"/><path d="M 20 15 L 50 50 L 20 85 Z" fill="#3b82f6"/>
            <path d="M 20 15 L 85 50 L 50 50 Z" fill="#f87171"/><path d="M 20 85 L 85 50 L 50 50 Z" fill="#fbbf24"/>
          </svg></div>); break;
      case 'YouTube': name = 'YouTube';
        content = (<div className="w-full h-full bg-white rounded-[1.25rem] flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]">
            <rect x="5" y="25" width="90" height="50" rx="15" fill="#ef4444"/>
            <path d="M 40 40 L 65 50 L 40 60 Z" fill="#fff"/></svg></div>); break;
      case 'KakaoTalk': name = '카카오톡';
        content = (<div className="w-full h-full bg-[#fde047] rounded-[1.25rem] flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 100 100" className="w-[65%] h-[65%]">
            <path d="M 10 40 Q 10 15 50 15 Q 90 15 90 40 Q 90 65 50 65 L 30 80 L 35 60 Q 10 55 10 40 Z" fill="#451a03"/>
            <text x="50" y="46" fill="#fde047" fontSize="24" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">TALK</text>
          </svg></div>); break;
      case 'Naver': name = 'NAVER';
        content = (<div className="w-full h-full bg-[#22c55e] rounded-[1.25rem] flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 100 100" className="w-[60%] h-[60%]">
            <path d="M 20 20 L 40 20 L 60 60 L 60 20 L 80 20 L 80 80 L 60 80 L 40 40 L 40 80 L 20 80 Z" fill="#fff"/>
          </svg></div>); break;
      case 'Settings': name = '설정';
        content = (<div className="w-full h-full bg-[#f3f4f6] rounded-[1.25rem] flex items-center justify-center shadow-lg">
          <Settings size={40} className="text-[#374151]" strokeWidth={2.5}/></div>); break;
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
          if (appName === 'PlayStore') { setIsSearched(false); setSearchText(''); setKeyboardOpen(false); setTypingIndex(0); setKeyboardShift(false); }
          setCurrentApp(appName);
        }}

        onPointerDown={(e) => onPointerDown(e, index)}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onTouchStart={() => handleAppPressStart(appName)} onTouchEnd={handleAppPressEnd}
        onMouseDown={() => handleAppPressStart(appName)} onMouseUp={handleAppPressEnd} onMouseLeave={handleAppPressEnd}
        className={`flex flex-col items-center gap-3 cursor-pointer group w-[72px] md:w-20 ${isEditMode ? 'animate-wiggle touch-none' : ''}`}
      >
        <div
          className={`relative w-[72px] h-[72px] md:w-20 md:h-20 transition-transform ${!isEditMode ? 'group-hover:scale-105 active:scale-95' : 'ring-2 ring-white/50 rounded-[1.25rem] bg-white/10'}`}
          style={{ visibility: dragInfo.isDragging && dragInfo.index === index ? 'hidden' : 'visible' }}
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
  };


  const renderHome = () => (
    <div className="flex-1 pt-16 p-6 relative flex flex-col transition-all duration-500 overflow-hidden min-h-0" style={{ background: wallpaper, backgroundSize: 'cover' }}>
      <div className="w-full max-w-xl mx-auto mb-16 bg-white rounded-full h-12 flex items-center px-4 shadow-lg opacity-95 shrink-0 transition-transform active:scale-[0.98]">
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 flex items-center justify-center"><div className="w-4 h-4 bg-white rounded-full font-bold text-blue-600 text-[10px] flex items-center justify-center">G</div></div>
        <div className="flex-1"></div>
        <Mic size={20} className="text-gray-500" />
      </div>

      {/* Home widgets row */}
      <div className="absolute top-12 md:top-16 left-3 md:left-8 right-3 md:right-8 flex gap-2 md:gap-4 pointer-events-none flex-wrap">
        {/* Clock widget */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl md:rounded-3xl px-4 md:px-6 py-3 md:py-4 shadow-xl border border-white/20 flex flex-col text-white flex-1 min-w-[150px]">
          <div className="text-4xl md:text-[64px] font-light tracking-tight leading-none drop-shadow-lg tabular-nums">{timeStr}</div>
          <div className="text-xs md:text-sm mt-1 md:mt-2 opacity-90 font-medium truncate">{dateStr}</div>
        </div>
        {/* Weather widget */}
        <div className="bg-gradient-to-br from-sky-400/40 to-blue-600/40 backdrop-blur-md rounded-2xl md:rounded-3xl px-3 md:px-5 py-3 md:py-4 shadow-xl border border-white/20 flex items-center gap-2 md:gap-4 text-white">
          <Sun size={36} className="md:hidden text-yellow-300 drop-shadow-md"/>
          <Sun size={56} className="hidden md:block text-yellow-300 drop-shadow-md"/>
          <div>
            <div className="text-xl md:text-3xl font-bold leading-none">21°</div>
            <div className="text-[10px] md:text-xs opacity-90 mt-0.5 md:mt-1">서울 · 맑음</div>
            <div className="hidden md:block text-[11px] opacity-75 mt-0.5">최고 25° / 최저 14°</div>
          </div>
        </div>
        {/* Calendar widget — hidden on mobile */}
        <div className="hidden md:flex bg-white/15 backdrop-blur-md rounded-3xl px-5 py-4 shadow-xl border border-white/20 flex-col items-center text-white min-w-[100px]">
          <div className="text-[11px] uppercase tracking-widest text-red-300 font-bold">
            {time ? time.toLocaleDateString('ko-KR', { weekday: 'short' }) : ''}
          </div>
          <div className="text-5xl font-bold leading-none mt-1">{time ? time.getDate() : ''}</div>
          <div className="text-[11px] opacity-80 mt-1">{time ? `${time.getMonth() + 1}월` : ''}</div>
        </div>
      </div>


      <div className="flex-1 flex flex-col justify-end pb-8">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-y-10 gap-x-4 md:gap-x-6 px-4 md:px-8 w-full max-w-[1200px] justify-items-center self-center">
          {homeApps.map((appName, index) => {
            if (appName) return <div key={index} data-slot-idx={index}>{renderAppIcon(appName, index)}</div>;
            return (
              <ActionTarget
                key={index} id={`empty-slot-${index}`} currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                className={`w-[72px] h-[72px] md:w-20 md:h-20 ${isEditMode ? 'border-2 border-dashed border-white/50 rounded-[1.25rem] bg-white/10 transition-colors' : ''}`}
              ><div data-slot-idx={index} className="w-full h-full"></div></ActionTarget>
            );
          })}
          {installedApps.includes('math') && !isEditMode && (
            <ActionTarget
              id="app-icon-math" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={() => setMathAppOpen(true)}
              className="flex flex-col items-center gap-3 cursor-pointer group w-[72px] md:w-20"
            >
              <div className="w-[72px] h-[72px] md:w-20 md:h-20 bg-yellow-400 rounded-[1.25rem] flex items-center justify-center shadow-lg font-black text-white text-3xl transition-transform group-hover:scale-105 active:scale-95">1+2</div>
              <span className="text-white text-sm font-medium drop-shadow-md truncate w-full text-center">수학탐험대</span>
            </ActionTarget>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 w-full flex justify-center gap-2 left-0">
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
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
          {renderAppIcon(homeApps[dragInfo.index], dragInfo.index)}
        </div>
      )}

      {/* App Drawer overlay */}
      {appDrawerOpen && (
        <div className="absolute inset-0 z-[90] bg-black/85 backdrop-blur-xl animate-[slideUp_0.3s_ease-out] flex flex-col pt-6">
          <div className="flex items-center justify-between px-8 mb-4">
            <div className="text-white text-2xl font-bold">앱 서랍</div>
            <button
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-90 transition-all"
              onClick={() => setAppDrawerOpen(false)}
            >
              <X size={20}/>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-8">
            <div className="grid grid-cols-6 md:grid-cols-8 gap-y-8 gap-x-4 justify-items-center">
              {homeApps.filter(Boolean).concat(installedApps.includes('math') ? ['math'] : []).map((appName, i) => (
                <div
                  key={`drawer-${appName}-${i}`}
                  className="flex flex-col items-center gap-2 cursor-pointer group w-[72px] active:scale-95 transition-transform"
                  onClick={() => {
                    if (drawerLongPressTimer) { clearTimeout(drawerLongPressTimer); setDrawerLongPressTimer(null); }
                    if (appName === 'math') { setMathAppOpen(true); setAppDrawerOpen(false); return; }
                    setCurrentApp(appName);
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
            <div className="text-center text-white/50 text-xs mt-8">아이콘을 꾹 누르면 앱을 삭제할 수 있어요</div>
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

  const renderSettings = () => (
    <div className="flex-1 bg-[#000000] text-white flex pt-8 overflow-hidden min-h-0 animate-[fadeIn_0.3s_ease-out]">
      <div className="w-1/3 md:w-1/4 border-r border-gray-800 bg-[#000000] flex flex-col py-4 overflow-y-auto min-h-0 shrink-0">

        <div className="px-3 md:px-6 mb-3">
          <div className="text-2xl md:text-3xl font-light mb-3">설정</div>
          <div className="flex items-center gap-2 bg-[#1c1c1e] rounded-full px-3 py-2">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              value={settingsSearch}
              onChange={(e) => setSettingsSearch(e.target.value)}
              placeholder="검색"
              className="bg-transparent outline-none text-sm text-white w-full min-w-0"
            />
            {settingsSearch && (
              <X size={14} className="text-gray-400 cursor-pointer shrink-0" onClick={() => setSettingsSearch('')}/>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 px-2 pb-10">
          <div className="px-3 py-2.5 flex items-center gap-3 bg-[#1c1c1e] rounded-2xl mb-2 cursor-pointer active:scale-[0.98] transition-transform">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shrink-0"><User size={18} className="text-white"/></div>
            <div className="flex flex-col min-w-0"><span className="font-semibold text-sm truncate">내 계정</span><span className="text-[11px] text-gray-400 truncate">삼성 계정</span></div>
          </div>
          {SETTINGS_MENUS.filter(m => !settingsSearch || m.title.includes(settingsSearch) || m.sub.includes(settingsSearch)).map((menu) => (
            <ActionTarget
              key={menu.id} id={`settings-menu-${menu.id}`} currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={() => setSettingsMenu(menu.id)}
              className={`px-3 py-2.5 flex items-center gap-3 rounded-2xl cursor-pointer transition-all active:scale-[0.98] ${settingsMenu === menu.id ? 'bg-[#1c1c1e]' : 'hover:bg-[#1c1c1e]/50'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${menu.bg}`}>{menu.icon}</div>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className={`text-xs md:text-sm font-medium truncate ${settingsMenu === menu.id ? 'text-blue-400' : 'text-gray-200'}`}>{menu.title}</span>
                <span className="text-[10px] text-gray-500 truncate hidden md:block">{menu.sub}</span>
              </div>
            </ActionTarget>
          ))}
          {settingsSearch && SETTINGS_MENUS.filter(m => m.title.includes(settingsSearch) || m.sub.includes(settingsSearch)).length === 0 && (
            <div className="text-center text-gray-500 text-xs py-8">검색 결과 없음</div>
          )}
        </div>
      </div>



      <div className="flex-1 p-10 bg-[#000000] overflow-y-auto min-h-0">
        {settingsMenu === 'connections' && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <h2 className="text-3xl font-medium mb-10 text-gray-100 flex items-center gap-4"><ChevronLeft size={28} className="text-gray-400 cursor-pointer active:scale-90 transition-transform" /> 연결</h2>
            <div className="bg-[#1c1c1e] rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-800 transition-colors active:bg-gray-700">
                <div>
                  <div className="text-xl mb-1 font-medium">Wi-Fi</div>
                  <div className="text-base text-blue-400">{wifiConnected || '사용 안 함'}</div>
                </div>
                <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${wifi ? 'bg-blue-500' : 'bg-gray-600'}`} onClick={() => setWifi(!wifi)}>
                  <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${wifi ? 'translate-x-6' : ''} shadow-md`}></div>
                </div>
              </div>
              <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <div><div className="text-xl mb-1 font-medium">블루투스</div><div className="text-base text-gray-400">{bluetooth ? '켜짐' : '꺼짐'}</div></div>
                <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${bluetooth ? 'bg-blue-500' : 'bg-gray-600'}`} onClick={() => setBluetooth(!bluetooth)}>
                  <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${bluetooth ? 'translate-x-6' : ''} shadow-md`}></div>
                </div>
              </div>
              <div className="p-6 flex justify-between items-center">
                <div><div className="text-xl mb-1 font-medium">비행기 탑승 모드</div><div className="text-base text-gray-400">{airplane ? '모든 통신 꺼짐' : '꺼짐'}</div></div>
                <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${airplane ? 'bg-blue-500' : 'bg-gray-600'}`} onClick={() => setAirplane(!airplane)}>
                  <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${airplane ? 'translate-x-6' : ''} shadow-md`}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {settingsMenu === 'display' && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <h2 className="text-3xl font-medium mb-10 text-gray-100 flex items-center gap-4"><ChevronLeft size={28} className="text-gray-400 cursor-pointer active:scale-90 transition-transform" /> 디스플레이</h2>
            <div className="bg-[#1c1c1e] rounded-3xl overflow-hidden p-8 mb-4">
              <div className="text-xl font-medium mb-6">밝기</div>
              <div className="flex items-center gap-6">
                <Sun size={28} className="text-gray-400" />
                <ActionTarget id="settings-brightness-slider" currentTargetId={currentTargetId} advanceQuest={advanceQuest} className="flex-1">
                  <input type="range" min="10" max="100" value={brightness}
                    onChange={(e) => { setBrightness(e.target.value); advanceQuest('settings-brightness-slider'); }}
                    className="w-full accent-blue-500 h-4 bg-gray-700 rounded-full appearance-none cursor-pointer" />
                </ActionTarget>
              </div>
            </div>
            <div className="bg-[#1c1c1e] rounded-3xl overflow-hidden p-6 md:p-8 mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Moon size={24} className="text-blue-300 shrink-0"/>
                <div className="min-w-0">
                  <div className="text-lg md:text-xl font-medium">다크 모드</div>
                  <div className="text-xs md:text-sm text-gray-400 mt-1">눈이 편안한 어두운 화면</div>
                </div>
              </div>
              <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors shrink-0 ${darkMode ? 'bg-blue-500' : 'bg-gray-600'}`} onClick={() => setDarkMode(!darkMode)}>
                <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${darkMode ? 'translate-x-6' : ''} shadow-md`}></div>
              </div>
            </div>
            <div className="bg-[#1c1c1e] rounded-3xl overflow-hidden p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Type size={22} className="text-gray-400"/>
                <div className="text-lg md:text-xl font-medium">글자 크기</div>
              </div>
              <div className="text-white mb-4 truncate" style={{ fontSize: `${fontScale * 16}px` }}>안드로이드 탐험대</div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">가</span>
                <input type="range" min="0.8" max="1.4" step="0.1" value={fontScale}
                  onChange={(e) => setFontScale(parseFloat(e.target.value))}
                  className="flex-1 accent-blue-500 h-3 bg-gray-700 rounded-full appearance-none cursor-pointer" />
                <span className="text-2xl text-gray-300">가</span>
              </div>
            </div>
          </div>
        )}

        {settingsMenu === 'wallpaper' && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <h2 className="text-3xl font-medium mb-10 text-gray-100 flex items-center gap-4"><ChevronLeft size={28} className="text-gray-400 cursor-pointer active:scale-90 transition-transform" /> 배경화면 및 스타일</h2>
            <div className="bg-[#1c1c1e] rounded-3xl overflow-hidden p-8">
              <div className="text-xl font-medium mb-6">배경화면 선택</div>
              <div className="grid grid-cols-3 gap-6">
                <ActionTarget
                  id="settings-wallpaper-change" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                  onClick={() => setWallpaper('radial-gradient(circle at 100% 30%, #c7d2fe 0%, #818cf8 30%, transparent 60%), radial-gradient(circle at 0% 100%, #e879f9 0%, #818cf8 40%, transparent 70%), #1e3a8a')}
                  className="aspect-[10/16] rounded-2xl cursor-pointer hover:ring-4 ring-blue-500 active:scale-95 transition-all" style={{ background: 'radial-gradient(circle at 100% 30%, #c7d2fe 0%, #818cf8 30%, transparent 60%), radial-gradient(circle at 0% 100%, #e879f9 0%, #818cf8 40%, transparent 70%), #1e3a8a' }}
                />
                <div onClick={() => setWallpaper('linear-gradient(135deg, #065f46 0%, #166534 100%)')} className="aspect-[10/16] rounded-2xl cursor-pointer hover:ring-4 ring-blue-500 active:scale-95 transition-all" style={{ background: 'linear-gradient(135deg, #065f46 0%, #166534 100%)' }}></div>
                <div onClick={() => setWallpaper('linear-gradient(135deg, #7f1d1d 0%, #9f1239 100%)')} className="aspect-[10/16] rounded-2xl cursor-pointer hover:ring-4 ring-blue-500 active:scale-95 transition-all" style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #9f1239 100%)' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStatusBar = () => (
    <>
      <ActionTarget
        id="swipe-trigger" currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance={true}
        onTouchStart={handleSwipeStart} onMouseDown={handleSwipeStart}
        onClick={() => { if (!quickPanelOpen) { setQuickPanelOpen(true); advanceQuest('swipe-trigger'); } }}
        tooltipPosition="bottom"
        tooltipText="↓ 아래로 드래그(또는 탭)하세요"
        className="absolute top-0 w-full h-8 px-6 flex justify-between items-center text-white text-sm cursor-ns-resize z-[80] select-none bg-gradient-to-b from-black/40 to-transparent"
      >
        <span className="font-medium drop-shadow-md">{timeStr}</span>
        <div className="flex space-x-2 items-center drop-shadow-md">
          {airplane && <Plane size={16} strokeWidth={2.5} />}
          {wifiConnected && !airplane && <Wifi size={16} strokeWidth={2.5} />}
          {bluetooth && <Bluetooth size={16} strokeWidth={2.5} />}
          {soundMode === 'vibrate' && <Vibrate size={16} strokeWidth={2.5} />}
          {soundMode === 'mute' && <VolumeX size={16} strokeWidth={2.5} />}
          <Signal size={16} strokeWidth={2.5} />
          <span className="text-xs font-bold ml-1">98%</span>
          <BatteryMedium size={18} strokeWidth={2.5} />
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


  const renderQuickPanel = () => (
    <div className={`absolute inset-0 bg-black/50 backdrop-blur-md z-50 transition-opacity duration-300 flex justify-center pt-4 ${quickPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`relative bg-[#1a1a1a]/95 text-white w-full max-w-2xl h-[90%] pb-8 rounded-[2rem] shadow-2xl z-10 p-4 flex flex-col gap-3 transition-transform duration-300 ${quickPanelOpen ? 'translate-y-0' : '-translate-y-10'} overflow-y-auto`}>
        <div className="flex justify-between items-center px-4 mb-2 text-gray-300">
          <span className="text-sm font-medium">{airplane ? '비행기 탑승 모드' : 'SIM 카드 없음 · 제한구역서비스'}</span>
          <Settings size={20} className="cursor-pointer hover:text-white active:scale-90 transition-transform" onClick={() => { setCurrentApp('Settings'); setSettingsMenu('connections'); setQuickPanelOpen(false); }} />
        </div>

        <div className="grid grid-cols-2 gap-3 px-2">
          <ActionTarget
            id="quick-wifi-toggle" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
            onClick={() => {
              if(!wifi) { setWifi(true); setTimeout(() => setWifiModalOpen(true), 300); }
              else { setWifi(false); setWifiConnected(null); }
            }}
            className={`p-5 rounded-3xl flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer ${wifi ? 'bg-blue-500 text-white shadow-md' : 'bg-[#2c2c2c] text-gray-200'}`}
          >
            <div className="p-3 bg-white/10 rounded-full"><Wifi size={24} /></div>
            <div className="flex flex-col"><span className="font-semibold text-lg">Wi-Fi</span><span className="text-sm opacity-80 truncate">{wifiConnected || '사용 안 함'}</span></div>
          </ActionTarget>

          <ActionTarget
            id="quick-airplane" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
            onClick={() => setAirplane(!airplane)}
            className={`p-5 rounded-3xl flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer ${airplane ? 'bg-orange-500 text-white shadow-md' : 'bg-[#2c2c2c] text-gray-200'}`}
          >
            <div className="p-3 bg-white/10 rounded-full"><Plane size={24} /></div>
            <div className="flex flex-col"><span className="font-semibold text-lg">비행기 모드</span><span className="text-sm opacity-80 truncate">{airplane ? '켜짐' : '꺼짐'}</span></div>
          </ActionTarget>

          <div onClick={() => setBluetooth(!bluetooth)} className={`p-5 rounded-3xl flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer ${bluetooth ? 'bg-blue-500 text-white shadow-md' : 'bg-[#2c2c2c] text-gray-200'}`}>
            <div className="p-3 bg-white/10 rounded-full"><Bluetooth size={24} /></div>
            <div className="flex flex-col"><span className="font-semibold text-lg">블루투스</span><span className="text-sm opacity-80">{bluetooth ? '켜짐' : '꺼짐'}</span></div>
          </div>

          <div onClick={() => {
            const flash = document.createElement('div');
            flash.className = 'fixed inset-0 bg-white z-[200] pointer-events-none opacity-90';
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 200);
            setPhotos(prev => [...prev, { id: Date.now(), seed: Math.floor(Math.random()*1000) }]);
          }} className="p-5 rounded-3xl flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer bg-[#2c2c2c] text-gray-200">
            <div className="p-3 bg-white/10 rounded-full"><Camera size={24} /></div>
            <div className="flex flex-col"><span className="font-semibold text-lg">스크린샷</span><span className="text-sm opacity-80">화면 캡처</span></div>
          </div>

          <div onClick={() => setDarkMode(!darkMode)} className={`p-5 rounded-3xl flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer ${darkMode ? 'bg-indigo-500 text-white shadow-md' : 'bg-[#2c2c2c] text-gray-200'}`}>
            <div className="p-3 bg-white/10 rounded-full"><Moon size={24} /></div>
            <div className="flex flex-col"><span className="font-semibold text-lg">다크 모드</span><span className="text-sm opacity-80">{darkMode ? '켜짐' : '꺼짐'}</span></div>
          </div>

          <div className="p-5 rounded-3xl flex items-center gap-4 bg-[#2c2c2c] text-gray-200">
            <div className="p-3 bg-white/10 rounded-full"><Flashlight size={24} /></div>
            <div className="flex flex-col"><span className="font-semibold text-lg">손전등</span><span className="text-sm opacity-80">꺼짐</span></div>
          </div>

        </div>

        {/* 소리 모드 */}
        <div className="bg-[#2c2c2c] rounded-3xl p-5 mx-2 mt-2">
          <div className="text-sm text-gray-400 font-medium mb-3">소리 모드</div>
          <div className="flex gap-3">
            <div onClick={() => setSoundMode('sound')} className={`flex-1 p-3 rounded-2xl flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-all ${soundMode === 'sound' ? 'bg-blue-500 text-white' : 'bg-[#3a3a3c] text-gray-300'}`}>
              <Volume2 size={22} /><span className="text-xs font-medium">소리</span>
            </div>
            <ActionTarget
              id="quick-sound-vibrate" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={() => setSoundMode('vibrate')}
              className={`flex-1 p-3 rounded-2xl flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-all ${soundMode === 'vibrate' ? 'bg-blue-500 text-white' : 'bg-[#3a3a3c] text-gray-300'}`}
            >
              <Vibrate size={22} /><span className="text-xs font-medium">진동</span>
            </ActionTarget>
            <div onClick={() => setSoundMode('mute')} className={`flex-1 p-3 rounded-2xl flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-all ${soundMode === 'mute' ? 'bg-blue-500 text-white' : 'bg-[#3a3a3c] text-gray-300'}`}>
              <VolumeX size={22} /><span className="text-xs font-medium">무음</span>
            </div>
          </div>
        </div>

        {/* 음량 */}
        <div className="bg-[#333] rounded-3xl p-5 mx-2 flex flex-col gap-4">
          <div className="flex items-center gap-4 px-2">
            <Volume2 size={24} className="text-gray-400" />
            <ActionTarget id="quick-volume-slider" currentTargetId={currentTargetId} advanceQuest={advanceQuest} className="flex-1">
              <input type="range" min="0" max="100" value={volume}
                onChange={(e) => { setVolume(e.target.value); advanceQuest('quick-volume-slider'); }}
                className="w-full accent-blue-500 h-4 bg-gray-600 rounded-full appearance-none cursor-pointer" />
            </ActionTarget>
            <span className="text-sm text-gray-300 w-10 text-right">{volume}%</span>
          </div>
          <div className="flex items-center gap-4 px-2">
            <Sun size={24} className="text-gray-400" />
            <input type="range" min="10" max="100" value={brightness}
              onChange={(e) => setBrightness(e.target.value)}
              className="w-full accent-blue-500 h-4 bg-gray-600 rounded-full appearance-none cursor-pointer" />
            <span className="text-sm text-gray-300 w-10 text-right">{brightness}%</span>
          </div>
        </div>
      </div>
      <ActionTarget id="quick-panel-bg" currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={() => setQuickPanelOpen(false)} className="flex-1 w-full" />

      {wifiModalOpen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#1c1c1e] rounded-3xl p-6 text-[#f5f5f5] shadow-2xl z-50 border border-gray-700/50 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl tracking-wide">Wi-Fi</h3>
            <X size={24} onClick={() => setWifiModalOpen(false)} className="cursor-pointer text-gray-400 hover:text-white bg-gray-800 rounded-full p-1 active:scale-90 transition-transform" />
          </div>
          {wifiConnected ? (
            <div className="p-4 bg-[#2c2c2e] rounded-2xl mb-2 flex items-center text-blue-400">
              <Wifi size={20} className="mr-4" />
              <div className="flex-1"><div className="font-semibold">탐험대_WiFi</div><div className="text-sm text-blue-400/80">연결됨</div></div>
            </div>
          ) : (
            <div className="space-y-3 h-64 overflow-y-auto pr-2">
              {WIFI_NETWORKS.map((net, i) => (
                <ActionTarget
                  key={i} id={net.id} currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                  onClick={() => { if (net.id === 'wifi-net-0') { setWifiPasswordInput('open'); setWifiPassword(''); } }}
                  className="p-4 bg-[#2c2c2e] rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-[#3a3a3c] transition-all active:scale-[0.98]"
                >
                  <Wifi size={22} className="text-gray-300" />
                  <div className="flex-1"><div className="font-semibold text-[17px]">{net.name}</div><div className="text-sm text-gray-400">{net.secure ? '비밀번호로 보호됨' : '저장됨'}</div></div>
                </ActionTarget>
              ))}
            </div>
          )}

          {wifiPasswordInput === 'open' && (
            <div className="absolute inset-0 p-6 bg-[#1c1c1e] rounded-3xl z-10 flex flex-col justify-center animate-[fadeIn_0.2s_ease-out]">
              <h3 className="font-bold text-xl mb-4">탐험대_WiFi</h3>
              <div className="text-sm mb-2 text-gray-400 font-medium">비밀번호 입력</div>
              <div className="mb-8 w-full">
                <ActionTarget id="wifi-pw-input" currentTargetId={currentTargetId} advanceQuest={advanceQuest} className="w-full block">
                  <input type="password" value={wifiPassword}
                    onChange={(e) => { setWifiPassword(e.target.value); if (e.target.value.length > 0) advanceQuest('wifi-pw-input'); }}
                    placeholder="비밀번호 타이핑"
                    className="w-full bg-[#2c2c2e] border border-blue-500/50 rounded-xl p-4 text-white outline-none text-lg shadow-inner focus:ring-2 focus:ring-blue-500 m-0 block transition-all" />
                </ActionTarget>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 py-4 bg-[#3a3a3c] hover:bg-[#4a4a4c] active:scale-95 rounded-xl font-bold text-lg transition-all" onClick={() => setWifiPasswordInput('')}>취소</button>
                <ActionTarget
                  id="wifi-connect-btn" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                  disableClickAdvance={wifiPassword.length === 0}
                  className={`flex-1 ${wifiPassword.length === 0 ? 'pointer-events-none' : ''}`}
                  onClick={() => { if (wifiPassword.length > 0) { setWifiConnected('탐험대_WiFi'); setWifiPasswordInput(''); setTimeout(() => setWifiModalOpen(false), 800); } }}
                >
                  <button className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${wifiPassword.length > 0 ? 'bg-blue-600 text-white active:scale-95 cursor-pointer' : 'bg-gray-600 text-gray-400 pointer-events-none'}`}>연결</button>
                </ActionTarget>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderCamera = () => (
    <div className="flex-1 bg-black relative flex flex-col overflow-hidden min-h-0 animate-[fadeIn_0.3s_ease-out]">
      {!cameraPermissionAsked && (
        <div className="absolute inset-0 z-[120] bg-black/85 flex items-center justify-center backdrop-blur">
          <div className="bg-[#1c1c1e] text-white rounded-3xl p-6 mx-4 w-full max-w-[360px] shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0"><Camera size={24} className="text-blue-400"/></div>
              <div>
                <div className="font-bold text-lg">카메라 권한</div>
                <div className="text-xs text-gray-400">카메라 앱이 다음을 요청합니다</div>
              </div>
            </div>
            <div className="text-sm text-gray-300 leading-relaxed mb-6">
              사진을 찍고 동영상을 녹화할 수 있도록 <span className="font-bold text-white">카메라</span>에 액세스 권한을 허용하시겠어요?
            </div>
            <div className="flex flex-col gap-2">
              <button className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all font-bold" onClick={() => setCameraPermissionAsked(true)}>앱 사용 중에만 허용</button>
              <button className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all font-medium" onClick={() => setCameraPermissionAsked(true)}>이번만 허용</button>
              <button className="w-full py-2 text-red-400 active:scale-95 text-sm" onClick={() => { setCameraPermissionAsked(true); setCurrentApp(null); }}>허용 안 함</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 relative flex items-center justify-center overflow-hidden pt-8 bg-[#111]">
        <div className="w-80 h-80 opacity-95"><CuteStudent seed={currentCameraSeed} /></div>
        <div className="absolute top-6 right-6 flex flex-col gap-6 text-white"><Settings size={28} className="drop-shadow-md cursor-pointer active:scale-90 transition-transform"/></div>
        <div className="absolute inset-0 border border-white/20 m-12 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-px h-full bg-white/20"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-white/20"></div>
          <div className="absolute top-1/3 left-0 w-full h-px bg-white/20"></div>
          <div className="absolute bottom-1/3 left-0 w-full h-px bg-white/20"></div>
        </div>
      </div>
      <div className="h-40 bg-black flex justify-around items-center px-12 pb-4 shrink-0">
        <div className="w-16 h-16 rounded-full border border-gray-600 bg-gray-800 overflow-hidden cursor-pointer flex-shrink-0 active:scale-95 transition-transform" onClick={() => setCurrentApp('Gallery')}>
          {photos.length > 0 && <div className="w-full h-full bg-[#111] flex items-center justify-center p-1"><CuteStudent seed={photos[photos.length-1].seed} /></div>}
        </div>
        <ActionTarget
          id="camera-shutter" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
          onClick={() => {
            const flash = document.createElement('div');
            flash.className = 'fixed inset-0 bg-white z-[200] pointer-events-none opacity-70';
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 200);
            setPhotos([...photos, { id: Date.now(), seed: currentCameraSeed }]);
            setCurrentCameraSeed(Date.now());
          }}
        >
          <div className="w-24 h-24 rounded-full border-[6px] border-white p-1 cursor-pointer hover:scale-105 active:scale-95 transition-all">
            <div className="w-full h-full bg-white rounded-full"></div>
          </div>
        </ActionTarget>
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-white flex-shrink-0 hover:bg-gray-700 active:scale-95 transition-all cursor-pointer"><Camera size={26} /></div>
      </div>
    </div>
  );

  const renderGallery = () => {
    if (viewPhoto) {
      return (
        <div className="flex-1 bg-black flex flex-col text-white pt-8 overflow-hidden min-h-0 animate-[fadeIn_0.3s_ease-out]">
          <div className="p-4 flex justify-between items-center px-6 shrink-0">
            <ChevronLeft size={32} onClick={() => setViewPhoto(null)} className="cursor-pointer hover:text-gray-300 active:scale-90 transition-transform"/>
            <span className="font-medium text-lg">오늘</span>
            <MoreHorizontal size={28} className="cursor-pointer text-gray-300 active:scale-90 transition-transform"/>
          </div>
          <div className="flex-1 flex items-center justify-center p-8 overflow-hidden min-h-0">
            <div className="w-96 h-96 bg-[#1a1a1a] rounded-3xl flex items-center justify-center relative shadow-2xl overflow-hidden border border-gray-800">
              <CuteStudent seed={viewPhoto.seed} />
              {deleteConfirm && (
                <div className="absolute inset-0 bg-black/95 flex items-center justify-center flex-col p-6 text-center z-50 animate-[fadeIn_0.2s_ease-out]">
                  <p className="mb-8 text-xl font-medium">휴지통으로 이동할까요?</p>
                  <div className="flex gap-4 w-full px-8">
                    <button className="flex-1 py-3 rounded-xl font-bold text-lg bg-gray-700 hover:bg-gray-600 active:scale-95 transition-all" onClick={() => setDeleteConfirm(false)}>취소</button>
                    <ActionTarget
                      id="gallery-delete-confirm" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                      onClick={() => { setPhotos(photos.filter(p => p.id !== viewPhoto.id)); setViewPhoto(null); setDeleteConfirm(false); }}
                      className="flex-1"
                    >
                      <button className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold text-lg active:scale-95 transition-all">이동</button>
                    </ActionTarget>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="h-24 flex justify-around items-center px-12 bg-[#111] pb-4 shrink-0">
            <ActionTarget id="gallery-delete" currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={() => setDeleteConfirm(true)}>
              <Trash2 size={28} className="cursor-pointer text-gray-300 hover:text-white active:scale-90 transition-all" />
            </ActionTarget>
          </div>
        </div>
      );
    }
    return (
      <div className="flex-1 bg-black text-white flex flex-col pt-8 overflow-hidden min-h-0 animate-[fadeIn_0.3s_ease-out]">
        <div className="p-4 flex justify-between items-center px-4 md:px-8 shrink-0 gap-2">
          <div className="text-2xl md:text-3xl font-bold truncate">{multiSelectMode ? `${selectedPhotoIds.length}개 선택` : '사진'}</div>
          <div className="flex gap-3 md:gap-6 text-gray-300 items-center shrink-0">
            {multiSelectMode ? (
              <>
                <button className="text-sm text-blue-400 font-medium active:scale-95" onClick={() => { setMultiSelectMode(false); setSelectedPhotoIds([]); }}>취소</button>
                <button className="text-sm text-red-400 font-bold disabled:opacity-50 active:scale-95" disabled={selectedPhotoIds.length === 0} onClick={() => { setPhotos(prev => prev.filter(p => !selectedPhotoIds.includes(p.id))); setSelectedPhotoIds([]); setMultiSelectMode(false); }}>삭제</button>
              </>
            ) : (
              <>
                <Search size={22} className="cursor-pointer hover:text-white active:scale-90 transition-transform"/>
                <button className="text-sm text-blue-400 font-medium active:scale-95" onClick={() => setMultiSelectMode(true)}>선택</button>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 p-4 px-4 md:px-8 grid grid-cols-3 md:grid-cols-5 gap-2 content-start overflow-y-auto min-h-0">
          {photos.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 mt-32 text-lg font-medium">항목 없음</div>
          ) : (
            photos.map((photo, i) => {
              const selected = selectedPhotoIds.includes(photo.id);
              const lp: any = (typeof window !== 'undefined' ? window : {}) as any;
              return (
                <ActionTarget key={photo.id} id={`gallery-photo-${i}`} currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                  onClick={() => {
                    if (multiSelectMode) {
                      setSelectedPhotoIds(prev => prev.includes(photo.id) ? prev.filter(x => x !== photo.id) : [...prev, photo.id]);
                    } else {
                      setViewPhoto(photo);
                    }
                  }}
                  onMouseDown={() => { if (!multiSelectMode) { lp.__galleryLP = setTimeout(() => { setMultiSelectMode(true); setSelectedPhotoIds([photo.id]); }, 500); } }}
                  onMouseUp={() => { if (lp.__galleryLP) { clearTimeout(lp.__galleryLP); lp.__galleryLP = null; } }}
                  onMouseLeave={() => { if (lp.__galleryLP) { clearTimeout(lp.__galleryLP); lp.__galleryLP = null; } }}
                  onTouchStart={() => { if (!multiSelectMode) { lp.__galleryLP = setTimeout(() => { setMultiSelectMode(true); setSelectedPhotoIds([photo.id]); }, 500); } }}
                  onTouchEnd={() => { if (lp.__galleryLP) { clearTimeout(lp.__galleryLP); lp.__galleryLP = null; } }}
                >
                  <div className={`relative aspect-square bg-[#1a1a1a] rounded-xl overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 active:scale-95 transition-all p-2 ${selected ? 'ring-4 ring-blue-500' : ''}`}>
                    <div className="w-full h-full"><CuteStudent seed={photo.seed} /></div>
                    {multiSelectMode && (
                      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 ${selected ? 'bg-blue-500 border-blue-500' : 'border-white/80 bg-black/30'} flex items-center justify-center`}>
                        {selected && <Check size={14} className="text-white"/>}
                      </div>
                    )}
                  </div>
                </ActionTarget>
              );
            })
          )}
        </div>
      </div>

    );
  };

  const renderVirtualKeyboard = () => {
    if (!keyboardOpen) return null;
    const row1_base = ['ㅂ','ㅈ','ㄷ','ㄱ','ㅅ','ㅛ','ㅕ','ㅑ','ㅐ','ㅔ'];
    const row1_shift = ['ㅃ','ㅉ','ㄸ','ㄲ','ㅆ','ㅛ','ㅕ','ㅑ','ㅒ','ㅖ'];
    const row2 = ['ㅁ','ㄴ','ㅇ','ㄹ','ㅎ','ㅗ','ㅓ','ㅏ','ㅣ'];
    const row3 = ['ㅋ','ㅌ','ㅊ','ㅍ','ㅠ','ㅜ','ㅡ'];
    const row1 = keyboardShift ? row1_shift : row1_base;
    const targetKey = TARGET_SEQUENCE[typingIndex]?.key;

    const handleKeyClick = (key) => {
      if (key === 'Shift') {
        setKeyboardShift(!keyboardShift);
        if (targetKey === 'Shift') { setSearchText(TARGET_SEQUENCE[typingIndex].display); setTypingIndex(prev => prev + 1); }
        return;
      }
      if (key === targetKey) {
        setSearchText(TARGET_SEQUENCE[typingIndex].display);
        setTypingIndex(prev => prev + 1);
        if (['ㄸ','ㅃ','ㅉ','ㄲ','ㅆ','ㅒ','ㅖ'].includes(key)) setKeyboardShift(false);
        if (typingIndex + 1 === TARGET_SEQUENCE.length) advanceQuest('playstore-search-input');
      }
    };
    const getKeyClass = (key) => {
      const base = "flex items-center justify-center rounded-lg text-xl font-medium cursor-pointer transition-all active:scale-90 ";
      const isTarget = key === targetKey;
      return base + (isTarget ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.8)] ring-2 ring-blue-300 animate-pulse" : "bg-[#3a3a3c] hover:bg-[#4a4a4c] text-white");
    };

    return (
      <div className="absolute bottom-0 w-full bg-[#1c1c1e] z-50 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-[slideUp_0.3s_ease-out] select-none pb-4 border-t border-gray-800">
        <div className="p-2 pt-4 flex flex-col gap-2 max-w-5xl mx-auto">
          <div className="flex justify-center gap-1.5 px-1">
            {row1.map((k, i) => (<div key={i} className={`flex-1 h-14 ${getKeyClass(k)}`} onClick={(e) => { e.stopPropagation(); handleKeyClick(k); }}>{k}</div>))}
          </div>
          <div className="flex justify-center gap-1.5 px-6">
            {row2.map((k, i) => (<div key={i} className={`flex-1 h-14 ${getKeyClass(k)}`} onClick={(e) => { e.stopPropagation(); handleKeyClick(k); }}>{k}</div>))}
            <div className="flex-[1.5] h-14 flex items-center justify-center bg-[#2c2c2e] hover:bg-[#3a3a3c] rounded-lg text-lg cursor-pointer active:scale-95 transition-all text-gray-300">⌫</div>
          </div>
          <div className="flex justify-center gap-1.5 px-2">
            <div className={`flex-[1.5] h-14 flex items-center justify-center rounded-lg text-xl cursor-pointer transition-all active:scale-95 ${targetKey === 'Shift' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.8)] ring-2 ring-blue-300 animate-pulse' : keyboardShift ? 'bg-white text-black' : 'bg-[#2c2c2e] hover:bg-[#3a3a3c] text-gray-300'}`} onClick={(e) => { e.stopPropagation(); handleKeyClick('Shift'); }}>⇧</div>
            {row3.map((k, i) => (<div key={i} className={`flex-1 h-14 ${getKeyClass(k)}`} onClick={(e) => { e.stopPropagation(); handleKeyClick(k); }}>{k}</div>))}
            <div className="flex-[0.8] h-14 flex items-center justify-center bg-[#3a3a3c] rounded-lg text-lg cursor-pointer active:scale-95 transition-all text-gray-300">,</div>
            <div className="flex-[0.8] h-14 flex items-center justify-center bg-[#3a3a3c] rounded-lg text-lg cursor-pointer active:scale-95 transition-all text-gray-300">.</div>
            <div className="flex-[0.8] h-14 flex items-center justify-center bg-[#3a3a3c] rounded-lg text-lg cursor-pointer active:scale-95 transition-all text-gray-300">?</div>
            <div className="flex-[1.5] h-14 flex items-center justify-center bg-[#2c2c2e] hover:bg-[#3a3a3c] rounded-lg text-xl cursor-pointer active:scale-95 transition-all text-gray-300">↵</div>
          </div>
          <div className="flex justify-center gap-1.5 px-1 mt-1">
            <div className="w-16 h-14 flex items-center justify-center bg-[#2c2c2e] hover:bg-[#3a3a3c] rounded-lg text-sm cursor-pointer font-medium text-gray-300 active:scale-95 transition-all">!#1</div>
            <div className="w-16 h-14 flex items-center justify-center bg-[#2c2c2e] hover:bg-[#3a3a3c] rounded-lg text-sm cursor-pointer font-medium text-gray-300 active:scale-95 transition-all">한자</div>
            <div className="flex-1 h-14 flex items-center justify-center bg-[#3a3a3c] hover:bg-[#4a4a4c] rounded-lg text-base text-gray-300 cursor-pointer active:scale-95 transition-all">한국어</div>
            <div className="w-14 h-14 flex items-center justify-center bg-[#2c2c2e] hover:bg-[#3a3a3c] rounded-lg text-sm cursor-pointer font-bold text-gray-300 active:scale-95 transition-all">한/영</div>
            <ActionTarget
              id="playstore-search-submit" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={(e) => { e.stopPropagation(); if(typingIndex === TARGET_SEQUENCE.length) { setIsSearched(true); setKeyboardOpen(false); } }}
            >
              <div className={`w-24 h-14 flex items-center justify-center rounded-lg text-lg font-bold shadow-lg cursor-pointer transition-all active:scale-95 ${typingIndex === TARGET_SEQUENCE.length && currentTargetId === 'playstore-search-submit' ? 'bg-blue-600 text-white ring-4 ring-yellow-400 animate-pulse' : 'bg-blue-600 text-white'}`}>검색</div>
            </ActionTarget>
          </div>
        </div>
      </div>
    );
  };

  const renderPlayStore = () => (
    <div className="flex-1 bg-white flex flex-col pt-8 text-[#202124] overflow-hidden min-h-0 relative animate-[fadeIn_0.3s_ease-out]">
      <div className="p-4 px-8 border-b border-gray-200 flex gap-4 items-center shadow-sm relative z-10 bg-white shrink-0">
        <Search size={24} className="text-gray-500" />
        <ActionTarget id="playstore-search-bar" currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={() => setKeyboardOpen(true)} className="flex-1">
          <input type="text" placeholder="앱 및 게임 검색 (터치 후 가상 키보드로 타이핑)" className="w-full outline-none text-xl bg-transparent pointer-events-none" value={searchText} readOnly />
        </ActionTarget>
      </div>
      <div className="flex-1 p-10 bg-white overflow-y-auto min-h-0 relative">
        {isSearched && searchText === '똑똑수학탐험대' ? (
          <div className="flex gap-8 max-w-3xl mx-auto mt-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="w-40 h-40 bg-yellow-400 rounded-[2.5rem] flex items-center justify-center text-white font-black text-5xl shadow-lg border border-yellow-300">1+2</div>
            <div className="flex-1 flex flex-col justify-center gap-1">
              <h2 className="text-4xl font-bold mb-2">똑똑수학탐험대</h2>
              <p className="text-lg text-green-700 font-medium">교육부</p>
              <p className="text-sm text-gray-500 mb-6">인앱 구매 · 교육</p>
              {installedApps.includes('math') ? (
                <button className="bg-gray-100 text-gray-700 py-3.5 px-12 rounded-full font-bold self-start w-full max-w-[240px] text-lg active:scale-95 transition-transform">열기</button>
              ) : (
                <ActionTarget id="playstore-install-btn" currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={() => setInstalledApps([...installedApps, 'math'])}>
                  <button className="bg-[#01875f] hover:bg-[#01704e] text-white py-3.5 px-12 rounded-full font-bold self-start w-full max-w-[240px] transition-all active:scale-95 text-lg shadow-md pointer-events-none">설치</button>
                </ActionTarget>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-40">
            <div className="mb-4 text-2xl font-medium">추천 게임 및 앱</div>
            <div className="text-lg">화면 상단의 검색창을 터치하여 검색을 시작하세요.</div>
          </div>
        )}
      </div>
      {renderVirtualKeyboard()}
    </div>
  );

  const renderNavigationBar = () => (
    <div className="h-14 bg-black flex justify-around items-center px-8 sm:px-32 z-40 w-full border-t border-gray-900 shrink-0 pb-2">
      <div className="w-20 h-full flex justify-center items-center cursor-pointer opacity-70 hover:opacity-100 active:scale-90 transition-all">
        <div className="flex gap-1"><div className="w-1 h-5 bg-white rounded-full"></div><div className="w-1 h-5 bg-white rounded-full"></div><div className="w-1 h-5 bg-white rounded-full"></div></div>
      </div>
      <ActionTarget
        id="nav-home" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
        onClick={() => {
          setCurrentApp(null); setQuickPanelOpen(false); setIsEditMode(false); setKeyboardOpen(false);
          setSearchText(''); setIsSearched(false); setTypingIndex(0); setKeyboardShift(false); setMathAppOpen(false);
        }}
        className="w-24 h-full flex justify-center items-center cursor-pointer opacity-70 hover:opacity-100 active:scale-90 transition-all"
      >
        <div className="w-6 h-6 border-[3px] border-white rounded-[6px]"></div>
      </ActionTarget>
      <div className="w-20 h-full flex justify-center items-center cursor-pointer opacity-70 hover:opacity-100 active:scale-90 transition-all">
        <ChevronLeft size={28} strokeWidth={3} className="text-white" />
      </div>
    </div>
  );

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
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center overflow-hidden select-none font-sans p-4" onMouseMove={(e) => { handleGlobalMove(e); handleLockSwipeMove(e); }} onTouchMove={(e) => { handleGlobalMove(e); handleLockSwipeMove(e); }} onMouseUp={(e) => { handleGlobalEnd(e); handleLockSwipeEnd(); }} onTouchEnd={(e) => { handleGlobalEnd(e); handleLockSwipeEnd(); }} onMouseLeave={(e) => { handleGlobalEnd(e); handleLockSwipeEnd(); }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes wiggle { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
        @keyframes pulseUp { 0%,100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-10px); opacity: 1; } }
        .animate-wiggle { animation: wiggle 0.25s ease-in-out infinite; }
        .animate-pulse-up { animation: pulseUp 1.6s ease-in-out infinite; }
      `}</style>

      {/* Galaxy Tab S10 Ultra bezel frame */}
      <div className="relative w-full h-full md:max-w-[1600px] md:max-h-[1080px] md:aspect-[16/10] bg-black rounded-[20px] md:rounded-[36px] p-[6px] md:p-[14px] shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_0_2px_#1f2937] md:shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_0_2px_#1f2937]">
        {/* front camera dot */}
        <div className="absolute top-1/2 -translate-y-1/2 left-[6px] w-1.5 h-1.5 bg-gray-700 rounded-full"></div>
        <div className="relative w-full h-full rounded-[14px] md:rounded-[24px] overflow-hidden bg-black flex flex-col" style={{ fontSize: `${fontScale}rem` }}>

          <div className="absolute inset-0 bg-black pointer-events-none z-[60] transition-opacity duration-300" style={{ opacity: 1 - (brightness / 100) }}></div>
          {darkMode && <div className="absolute inset-0 bg-indigo-950/40 pointer-events-none z-[59] mix-blend-multiply"></div>}

          {renderStatusBar()}

          <div className="flex-1 relative flex flex-col bg-black overflow-hidden min-h-0 z-0">
            {currentApp === null && renderHome()}
            {currentApp === 'Settings' && renderSettings()}
            {currentApp === 'Camera' && renderCamera()}
            {currentApp === 'Gallery' && renderGallery()}
            {currentApp === 'PlayStore' && renderPlayStore()}
          </div>

          <div className="shrink-0 z-40">{renderNavigationBar()}</div>

          {renderQuickPanel()}

          {mathAppOpen && (
            <div className="absolute inset-0 z-[80] bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-400 flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease-out] pt-8 pb-14">
              <div className="text-white text-7xl font-black drop-shadow-lg mb-4">1 + 2 = ?</div>
              <div className="text-white text-2xl font-bold mb-10 drop-shadow">똑똑수학탐험대에 오신 걸 환영해요!</div>
              <div className="flex gap-6">
                {[2, 3, 4].map(n => (
                  <div key={n} className={`w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-black shadow-xl cursor-pointer active:scale-90 transition-all ${n===3 ? 'bg-white text-green-600' : 'bg-white/80 text-gray-700'}`}>{n}</div>
                ))}
              </div>
              <div className="mt-10 text-white text-sm opacity-80">홈 버튼을 눌러 종료하세요</div>
            </div>
          )}

          {/* Lock screen overlay */}
          {locked && (
            <div
              className="absolute inset-0 z-[150] cursor-grab active:cursor-grabbing overflow-hidden"
              style={{
                background: wallpaper,
                backgroundSize: 'cover',
                transform: `translateY(${-lockOffset}px)`,
                transition: lockSwipeY === null ? 'transform 0.3s ease-out' : 'none',
              }}
              onMouseDown={handleLockSwipeStart}
              onTouchStart={handleLockSwipeStart}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                <Lock size={40} className="mb-4 opacity-80" />
                <div className="text-[120px] font-thin leading-none drop-shadow-lg tabular-nums">{timeStr}</div>
                <div className="text-2xl mt-3 opacity-90 drop-shadow">{dateStr}</div>
                <div className="absolute bottom-20 flex flex-col items-center pointer-events-none">
                  <ChevronUp size={48} className={`text-white/80 ${currentTargetId === 'lock-swipe' ? 'animate-pulse-up' : 'opacity-60'}`} />
                  <div className="text-white/90 text-lg mt-2 font-medium drop-shadow">위로 밀어 잠금해제</div>
                </div>
                {currentTargetId === 'lock-swipe' && (
                  <div className="absolute top-24 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl shadow-xl font-bold pointer-events-none animate-bounce">
                    👆 여기서부터 위로 스와이프!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showExpMenu && (
        <div className="fixed md:absolute z-[300] bg-white rounded-2xl md:rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-blue-200 w-[calc(100vw-16px)] max-w-[380px] overflow-hidden transition-all duration-300" style={{ top: expPos.y, left: expPos.x }}>
          <div className="bg-blue-600 text-white p-3 md:p-4 flex justify-between items-center cursor-move" onMouseDown={handleDragStartExp} onTouchStart={handleDragStartExp}>
            <div className="flex items-center gap-2 font-bold text-base md:text-lg"><GripHorizontal size={20}/> 미션 센터</div>
            <X size={20} className="cursor-pointer hover:text-gray-200 transition-colors" onClick={() => setShowExpMenu(false)}/>
          </div>
          <div className="p-3 md:p-6 bg-blue-50/50">
            <div className="flex justify-between items-end mb-2">
              <span className="text-base md:text-xl font-bold text-gray-800">레벨 {Math.floor(exp / 100) + 1}</span>
              <span className="text-sm md:text-lg text-blue-600 font-bold">{exp} EXP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 md:h-3 mb-3 md:mb-6 shadow-inner">
              <div className="bg-blue-600 h-2.5 md:h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${(exp % 100)}%` }}></div>
            </div>
            <div className="bg-white p-3 md:p-6 rounded-2xl border border-blue-100 shadow-sm relative min-h-[90px] md:min-h-[140px] flex flex-col justify-center">
              <div className="text-xs md:text-base font-bold text-blue-500 mb-1 md:mb-2">현재 임무 ({questIdx}/{QUESTS.length - 1})</div>
              <div className="text-gray-800 font-bold text-sm md:text-[19px] leading-relaxed break-keep">
                {QUESTS[questIdx]?.text || "모든 미션을 완료했습니다! 🎉"}
              </div>
            </div>
          </div>
        </div>
      )}

      {!showExpMenu && (
        <div className="fixed md:absolute bottom-4 right-4 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:bg-blue-700 active:scale-90 transition-all z-[300] animate-bounce" onClick={() => setShowExpMenu(true)}>
          <Check size={28} className="text-white" />
        </div>
      )}

    </div>
  );
}
