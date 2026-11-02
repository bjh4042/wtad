import React from 'react';
import {
  Wifi, Bluetooth, Volume2, VolumeX, Vibrate, Sun, Settings, BatteryCharging,
  X, RotateCcw, Plane, MapPin, Moon, ChevronUp, BellOff, Bell,
  ChevronLeft, ChevronRight, Pencil, Power, LockKeyhole, Eye, ScanLine,
  Check,
} from 'lucide-react';
import { ActionTarget } from '@/components/apps/shared';
import { GalaxyAppIcon } from '@/components/device/GalaxyAppIcon';
import { WIFI_NETWORKS } from '@/data/appCatalog';
import type { NotificationItem, Upd } from '@/components/device/HomeScreen';
import './quick-panel.css';

export type PanelMode = 'quick' | 'notifications' | null;

export interface QuickPanelProps {
  isPhone?: boolean;
  currentTargetId: string | null;
  advanceQuest: (id: string) => void;
  quickPanelOpen: boolean;
  setQuickPanelOpen: React.Dispatch<React.SetStateAction<any>>;
  panelMode?: PanelMode;
  setPanelMode?: React.Dispatch<React.SetStateAction<any>>;
  notifications: NotificationItem[];
  setNotifications: Upd<NotificationItem[]>;
  notifDrag: { id: number; startX: number; dx: number } | null;
  setNotifDrag: React.Dispatch<React.SetStateAction<any>>;
  readNotifIds: number[];
  setReadNotifIds: Upd<number[]>;
  wifi: boolean;
  setWifi: React.Dispatch<React.SetStateAction<any>>;
  wifiConnected: string | null;
  setWifiConnected: React.Dispatch<React.SetStateAction<any>>;
  wifiModalOpen: boolean;
  setWifiModalOpen: React.Dispatch<React.SetStateAction<any>>;
  wifiPasswordInput: string;
  setWifiPasswordInput: React.Dispatch<React.SetStateAction<any>>;
  wifiPassword: string;
  setWifiPassword: React.Dispatch<React.SetStateAction<any>>;
  bluetooth: boolean;
  setBluetooth: React.Dispatch<React.SetStateAction<any>>;
  connectedBtDevice: string | null;
  setBluetoothModalOpen: React.Dispatch<React.SetStateAction<any>>;
  airplane: boolean;
  setAirplane: React.Dispatch<React.SetStateAction<any>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<any>>;
  brightness: number;
  setBrightness: React.Dispatch<React.SetStateAction<any>>;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<any>>;
  soundMode: string;
  setSoundMode: React.Dispatch<React.SetStateAction<any>>;
  setPhotos: Upd<any[]>;
  onScreenshot?: () => void;
  onPowerMenu?: () => void;
  setCurrentApp: React.Dispatch<React.SetStateAction<any>>;
  setSettingsMenu: React.Dispatch<React.SetStateAction<any>>;
}

type TargetProps = Pick<QuickPanelProps, 'currentTargetId' | 'advanceQuest'>;

function PanelHeader({ onSettings, onEdit, onPower }: {
  onSettings: () => void; onEdit: () => void; onPower: () => void;
}) {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(timer);
  }, []);
  return (
    <header className="qp-header">
      <div className="qp-clock">
        <span>{now?.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }) ?? '--:--'}</span>
        <span>{now?.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }) ?? ''}</span>
      </div>
      <div className="qp-header-actions">
        <button type="button" className="qp-icon-button" aria-label="빠른 설정 편집" title="편집" onClick={onEdit}><Pencil size={19} /></button>
        <button type="button" className="qp-icon-button" aria-label="전원 메뉴" title="전원 메뉴" onClick={onPower}><Power size={21} /></button>
        <button type="button" className="qp-icon-button" aria-label="설정" title="설정" onClick={onSettings}><Settings size={21} /></button>
      </div>
    </header>
  );
}

function ConnectionTile({ id, active, icon, label, detail, onClick, currentTargetId, advanceQuest }: TargetProps & {
  id: string; active: boolean; icon: React.ReactNode; label: string; detail: string; onClick: () => void;
}) {
  return (
    <ActionTarget id={id} currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance className="qp-connection-target" tooltipPosition="bottom">
      <button type="button" className={`qp-connection ${active ? 'is-active' : ''}`} aria-label={`${label}: ${detail}`} aria-pressed={active} onClick={onClick}>
        <span className="qp-connection-icon">{icon}</span>
        <span className="qp-connection-copy"><strong>{label}</strong><span>{detail}</span></span>
        <ChevronRight size={13} className="qp-connection-chevron" />
      </button>
    </ActionTarget>
  );
}

function RoundControl({ id, extraTargetIds, active, icon, label, onClick, currentTargetId, advanceQuest }: TargetProps & {
  id: string; extraTargetIds?: string[]; active: boolean; icon: React.ReactNode; label: string; onClick: () => void;
}) {
  return (
    <ActionTarget id={id} extraTargetIds={extraTargetIds} currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance className="qp-control-target" tooltipPosition="bottom">
      <button type="button" className={`qp-round-control ${active ? 'is-active' : ''}`} aria-label={label} aria-pressed={active} onClick={onClick}>
        <span className="qp-control-disc">{icon}</span><span className="qp-control-label">{label}</span>
      </button>
    </ActionTarget>
  );
}

function WifiSignal({ secure, signal = 4 }: { secure: boolean; signal?: number }) {
  return <span className="qp-wifi-signal"><Wifi size={25} strokeWidth={1.85} style={{ opacity: signal < 3 ? .58 : 1 }} />{secure && <LockKeyhole size={10} strokeWidth={2.7} className="qp-wifi-lock" />}</span>;
}

export default function QuickPanel({
  isPhone = false,
  currentTargetId, advanceQuest, quickPanelOpen, setQuickPanelOpen, panelMode, setPanelMode,
  notifications, setNotifications, notifDrag, setNotifDrag, readNotifIds, setReadNotifIds,
  wifi, setWifi, wifiConnected, setWifiConnected, wifiModalOpen, setWifiModalOpen,
  wifiPasswordInput, setWifiPasswordInput, wifiPassword, setWifiPassword,
  bluetooth, setBluetooth, connectedBtDevice, setBluetoothModalOpen,
  airplane, setAirplane, darkMode, setDarkMode, brightness, setBrightness,
  volume, setVolume, soundMode, setSoundMode, onScreenshot, onPowerMenu, setCurrentApp, setSettingsMenu,
}: QuickPanelProps) {
  const beforeAirplane = React.useRef<{ wifi: boolean; wifiConnected: string | null; bluetooth: boolean } | null>(null);
  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('android-explorer-airplane-v1') || 'null');
      if (saved && typeof saved.wifi === 'boolean' && typeof saved.bluetooth === 'boolean' && (saved.wifiConnected === null || typeof saved.wifiConnected === 'string')) beforeAirplane.current = saved;
    } catch { /* No previous practice state. */ }
  }, []);
  const [autoRotate, setAutoRotate] = React.useState(false);
  const [locationEnabled, setLocationEnabled] = React.useState(false);
  const [powerSaving, setPowerSaving] = React.useState(false);
  const [eyeComfort, setEyeComfort] = React.useState(false);
  const [editPanel, setEditPanel] = React.useState(false);
  const [showExtraControls, setShowExtraControls] = React.useState(true);
  const [soundOptionsOpen, setSoundOptionsOpen] = React.useState(false);
  const [wifiError, setWifiError] = React.useState('');
  const [showWifiPassword, setShowWifiPassword] = React.useState(false);
  const [panelNotice, setPanelNotice] = React.useState('');
  const [expandedNotification, setExpandedNotification] = React.useState<number | null>(null);
  const mode = panelMode === 'notifications' ? 'notifications' : 'quick';
  const targetProps = { currentTargetId, advanceQuest };
  const closePanel = () => { setQuickPanelOpen(false); setPanelMode?.(null); };
  const closeWifi = () => { setWifiModalOpen(false); setWifiPasswordInput(''); setWifiError(''); };
  const openSettings = (menu = 'connections') => { setCurrentApp('Settings'); setSettingsMenu(menu); closeWifi(); closePanel(); };
  const goMode = (next: 'notifications' | 'quick') => { setPanelMode?.(next); advanceQuest(next === 'notifications' ? 'notification-trigger' : 'swipe-trigger'); };
  const soundLabel = soundMode === 'vibrate' ? '진동' : soundMode === 'mute' ? '무음' : '소리';
  const SoundIcon = soundMode === 'vibrate' ? Vibrate : soundMode === 'mute' ? VolumeX : Volume2;
  const showSoundOptions = soundOptionsOpen || ['quick-sound-vibrate', 'quick-sound-mute', 'quick-sound-sound'].includes(currentTargetId ?? '');
  const showAuxiliary = showExtraControls || ['quick-darkmode', 'quick-location', 'quick-power-saving', 'quick-eye-comfort'].includes(currentTargetId ?? '');

  React.useEffect(() => {
    if (!quickPanelOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (wifiPasswordInput === 'open') setWifiPasswordInput('');
      else if (wifiModalOpen) setWifiModalOpen(false);
      else { setQuickPanelOpen(false); setPanelMode?.(null); advanceQuest('quick-panel-bg'); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [quickPanelOpen, wifiModalOpen, wifiPasswordInput, setWifiPasswordInput, setWifiModalOpen, setQuickPanelOpen, setPanelMode, advanceQuest]);

  const swipe = React.useRef<{ x: number; y: number } | null>(null);
  const onSwipeDown = (event: React.PointerEvent) => {
    if ((event.target as HTMLElement).closest('input, button, [role="slider"], [data-action-target]')) { swipe.current = null; return; }
    swipe.current = { x: event.clientX, y: event.clientY };
  };
  const onSwipeUp = (event: React.PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) goMode(dx > 0 ? 'notifications' : 'quick');
    else if (dy < -60 && Math.abs(dy) > Math.abs(dx)) { closePanel(); advanceQuest('quick-panel-bg'); }
  };
  const toggleAirplane = () => {
    const next = !airplane;
    setAirplane(next);
    if (next) {
      beforeAirplane.current = { wifi, wifiConnected, bluetooth };
      try { localStorage.setItem('android-explorer-airplane-v1', JSON.stringify(beforeAirplane.current)); } catch { /* Keep in-memory state. */ }
      setWifi(false); setWifiConnected(null); setBluetooth(false);
    } else if (beforeAirplane.current) {
      setWifi(beforeAirplane.current.wifi); setWifiConnected(beforeAirplane.current.wifiConnected); setBluetooth(beforeAirplane.current.bluetooth);
      setPanelNotice('비행기 탑승 모드를 껐어요. 이전 무선 연결 상태로 돌아왔어요.');
    } else setPanelNotice('비행기 탑승 모드를 껐어요. Wi-Fi에서 학교 네트워크에 다시 연결해요.');
    advanceQuest(next ? 'quick-airplane' : 'quick-airplane-off');
  };
  const chooseSound = (next: string) => {
    setSoundMode(next);
    advanceQuest(next === 'vibrate' ? 'quick-sound-vibrate' : next === 'mute' ? 'quick-sound-mute' : 'quick-sound-sound');
  };
  const connectWifi = () => {
    if (wifiPassword !== 'tablet1234') { setWifiError('비밀번호가 달라요. tablet1234를 확인해 다시 입력해요.'); return; }
    setWifi(true); setWifiConnected('탐험대_WiFi'); setWifiPassword(''); closeWifi(); advanceQuest('wifi-connect-btn');
  };
  const openTrainingNetwork = () => {
    setWifi(true); setWifiPasswordInput('open'); setWifiPassword(''); setWifiError(''); advanceQuest('wifi-net-0');
  };

  const renderNotification = (notification: NotificationItem) => {
    const drag = notifDrag?.id === notification.id ? notifDrag.dx : 0;
    const isRead = readNotifIds.includes(notification.id);
    return (
      <ActionTarget key={notification.id} id={`notif-tap-${notification.id}`} extraTargetIds={[`notif-dismiss-${notification.id}`]} {...targetProps} disableClickAdvance
        className="qp-notification" tooltipPosition="bottom"
        tooltipText={currentTargetId === `notif-dismiss-${notification.id}` ? '옆으로 밀어 알림 지우기' : '알림 확인하기'}
        style={{ transform: `translateX(${drag}px)`, opacity: Math.max(0, 1 - Math.abs(drag) / 200), transition: notifDrag?.id === notification.id ? 'none' : 'transform .2s, opacity .2s' }}
        onClick={(event) => { event.stopPropagation(); if (Math.abs(drag) > 5) return; setReadNotifIds(prev => prev.includes(notification.id) ? prev : [...prev, notification.id]); setExpandedNotification(expandedNotification === notification.id ? null : notification.id); advanceQuest(`notif-tap-${notification.id}`); }}
        onPointerDown={(event) => { event.stopPropagation(); event.currentTarget.setPointerCapture(event.pointerId); setNotifDrag({ id: notification.id, startX: event.clientX, dx: 0 }); }}
        onPointerMove={(event) => { if (notifDrag?.id === notification.id) setNotifDrag({ ...notifDrag, dx: event.clientX - notifDrag.startX }); }}
        onPointerUp={(event) => { event.stopPropagation(); const distance = notifDrag?.id === notification.id ? notifDrag.dx : 0; setNotifDrag(null); if (Math.abs(distance) > 100) { setNotifications(prev => prev.filter(item => item.id !== notification.id)); advanceQuest(`notif-dismiss-${notification.id}`); } }}>
        <span className="qp-notification-icon"><GalaxyAppIcon appName={notification.app} /></span>
        <div className="qp-notification-copy">
          <div className="qp-notification-meta">{notification.appName}<span> · 방금 전{isRead ? ' · 읽음' : ''}</span></div>
          <strong>{notification.title}</strong>
          <p className={expandedNotification === notification.id ? 'is-expanded' : ''}>{notification.body}</p>
        </div>
        <button type="button" aria-label={`${notification.appName} 알림 지우기`} className="qp-icon-button qp-dismiss-notification" onPointerDown={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); setNotifications(prev => prev.filter(item => item.id !== notification.id)); advanceQuest(`notif-dismiss-${notification.id}`); }}><X size={15} /></button>
      </ActionTarget>
    );
  };

  return (
    <div aria-hidden={!quickPanelOpen} inert={!quickPanelOpen} className={`qp-overlay ${quickPanelOpen ? 'is-open' : ''}`}
      onClick={event => { if (event.target === event.currentTarget) { closePanel(); advanceQuest('quick-panel-bg'); } }}>
      <div className={`qp-shell ${mode === 'notifications' ? 'qp-shell-notifications' : ''}`} inert={wifiModalOpen}>
        <section aria-label={mode === 'quick' ? '빠른 설정' : '알림'} className={`qp-panel ${eyeComfort ? 'qp-eye-comfort' : ''}`} onPointerDown={onSwipeDown} onPointerUp={onSwipeUp}>
          <PanelHeader onSettings={() => openSettings()} onEdit={() => setEditPanel(!editPanel)} onPower={() => { if (onPowerMenu) { closePanel(); onPowerMenu(); } else setPanelNotice('태블릿의 측면 버튼과 음량 아래 버튼을 길게 누르면 전원 메뉴가 열려요.'); }} />
          <div className="qp-scroll-body">
            {editPanel && <div className="qp-edit-panel"><div><strong>빠른 설정 편집</strong><span>보조 버튼 표시</span></div><button type="button" role="switch" aria-label="보조 버튼 표시" aria-checked={showExtraControls} className={`qp-switch ${showExtraControls ? 'is-on' : ''}`} onClick={() => setShowExtraControls(!showExtraControls)}><span /></button><button type="button" className="qp-text-button" onClick={() => setEditPanel(false)}>완료</button></div>}
            {panelNotice && <div className="qp-notice" role="status"><span>{panelNotice}</span><button type="button" aria-label="안내 닫기" className="qp-icon-button" onClick={() => setPanelNotice('')}><X size={14} /></button></div>}
            {mode === 'quick' ? <>
              <div className="qp-connections">
                <ConnectionTile {...targetProps} id="quick-wifi-toggle" active={wifi} icon={<Wifi size={24} />} label="Wi-Fi" detail={wifiConnected || (wifi ? '사용 중' : '사용 안 함')} onClick={() => { setWifi(true); setWifiModalOpen(true); setWifiPasswordInput(''); setWifiError(''); advanceQuest('quick-wifi-toggle'); }} />
                <ConnectionTile {...targetProps} id="quick-bluetooth" active={bluetooth} icon={<Bluetooth size={23} />} label="블루투스" detail={connectedBtDevice || (bluetooth ? '사용 중' : '사용 안 함')} onClick={() => { if (!bluetooth) setBluetooth(true); setBluetoothModalOpen(true); advanceQuest('quick-bluetooth'); }} />
              </div>
              <div className="qp-control-group">
                <RoundControl {...targetProps} id="quick-sound-mode" active={soundMode !== 'mute'} icon={<SoundIcon size={23} />} label={soundLabel} onClick={() => { chooseSound(soundMode === 'sound' ? 'vibrate' : soundMode === 'vibrate' ? 'mute' : 'sound'); setSoundOptionsOpen(true); }} />
                <RoundControl {...targetProps} id="quick-rotation-auto" active={autoRotate} icon={autoRotate ? <RotateCcw size={23} /> : <LockKeyhole size={22} />} label={autoRotate ? '자동 회전' : isPhone ? '세로' : '가로'} onClick={() => { setAutoRotate(!autoRotate); if (!autoRotate) advanceQuest('quick-rotation-auto'); setPanelNotice(autoRotate ? `화면 방향을 ${isPhone ? '세로' : '가로'}로 고정했어요.` : '자동 회전을 켰어요. 실제 갤럭시 기기를 돌리면 화면 방향이 바뀌어요.'); }} />
                <RoundControl {...targetProps} id="quick-airplane" extraTargetIds={['quick-airplane-off']} active={airplane} icon={<Plane size={23} />} label="비행기 탑승 모드" onClick={toggleAirplane} />
                <RoundControl {...targetProps} id="quick-screenshot" active={false} icon={<ScanLine size={23} />} label="화면 캡처" onClick={() => { if (onScreenshot) onScreenshot(); else setPanelNotice('측면 버튼과 음량 아래 버튼을 동시에 짧게 눌러 화면을 캡처해요.'); }} />
                {showAuxiliary && <>
                  <RoundControl {...targetProps} id="quick-darkmode" active={darkMode} icon={<Moon size={22} />} label="다크 모드" onClick={() => { setDarkMode(!darkMode); advanceQuest('quick-darkmode'); }} />
                  <RoundControl {...targetProps} id="quick-eye-comfort" active={eyeComfort} icon={<Eye size={23} />} label="편안하게 화면 보기" onClick={() => { setEyeComfort(!eyeComfort); if (!eyeComfort) advanceQuest('quick-eye-comfort'); }} />
                  <RoundControl {...targetProps} id="quick-location" active={locationEnabled} icon={<MapPin size={23} />} label="위치" onClick={() => { setLocationEnabled(!locationEnabled); advanceQuest('quick-location'); setPanelNotice('위치는 지도처럼 필요한 앱을 사용할 때만 켜요.'); }} />
                  <RoundControl {...targetProps} id="quick-power-saving" active={powerSaving} icon={<BatteryCharging size={24} />} label="절전 모드" onClick={() => { setPowerSaving(!powerSaving); if (!powerSaving) advanceQuest('quick-power-saving'); setPanelNotice(powerSaving ? '절전 모드를 껐어요.' : '절전 모드를 켰어요. 백그라운드 활동을 줄여 배터리를 아껴요.'); }} />
                </>}
              </div>
              <div className="qp-slider-group">
                <ActionTarget {...targetProps} id="quick-brightness-slider" disableClickAdvance className="qp-slider" style={{ '--qp-level': `${(brightness - 10) / 90 * 100}%` } as React.CSSProperties} tooltipPosition="bottom">
                  <span className="qp-slider-fill" /><Sun size={21} className="qp-slider-icon" /><span className="qp-slider-number">{brightness}%</span>
                  <input type="range" min="10" max="100" value={brightness} aria-label="밝기" aria-valuetext={`${brightness}%`} onChange={event => { setBrightness(Number(event.target.value)); advanceQuest('quick-brightness-slider'); }} />
                </ActionTarget>
                <ActionTarget {...targetProps} id="quick-volume-slider" disableClickAdvance className="qp-slider" style={{ '--qp-level': `${volume}%` } as React.CSSProperties} tooltipPosition="bottom">
                  <span className="qp-slider-fill" /><Volume2 size={21} className="qp-slider-icon" /><span className="qp-slider-number">{volume}%</span>
                  <input type="range" min="0" max="100" value={volume} aria-label="음량" aria-valuetext={`${volume}%`} onChange={event => { setVolume(Number(event.target.value)); advanceQuest('quick-volume-slider'); }} />
                </ActionTarget>
              </div>
              {showSoundOptions && <div className="qp-sound-options" aria-label="소리 모드">
                {([{ value: 'sound', label: '소리', Icon: Volume2 }, { value: 'vibrate', label: '진동', Icon: Vibrate }, { value: 'mute', label: '무음', Icon: VolumeX }]).map(({ value, label, Icon }) => <ActionTarget key={value} {...targetProps} id={`quick-sound-${value}`} disableClickAdvance className="qp-sound-target" tooltipPosition="bottom"><button type="button" aria-pressed={soundMode === value} className={soundMode === value ? 'is-active' : ''} onClick={() => chooseSound(value)}><Icon size={17} />{label}</button></ActionTarget>)}
              </div>}
            </> : <>
              <div className="qp-notification-heading"><h2>알림 <span>{notifications.length}</span></h2>{notifications.length > 0 && <ActionTarget {...targetProps} id="notif-clear-all" className="qp-clear-target" tooltipPosition="bottom" onClick={() => setNotifications([])}><button type="button" className="qp-text-button">모두 지우기</button></ActionTarget>}</div>
              {notifications.length ? <div className="qp-notification-list">{notifications.map(renderNotification)}</div> : <div className="qp-empty"><BellOff size={30} /><p>알림이 없어요</p></div>}
              <button type="button" className="qp-notification-settings" onClick={() => openSettings('notifications')}><Bell size={18} /><span>알림 설정</span><ChevronRight size={17} /></button>
            </>}
          </div>
          <footer className="qp-footer">
            <button type="button" className="qp-mode-button" onClick={() => goMode(mode === 'quick' ? 'notifications' : 'quick')}>{mode === 'quick' ? <><Bell size={15} />알림{notifications.length > 0 && <span>{notifications.length}</span>}</> : <><ChevronLeft size={15} />빠른 설정</>}</button>
            <ActionTarget {...targetProps} id="quick-panel-bg" disableClickAdvance className="qp-close-target" tooltipPosition="top-left" tooltipText="패널 닫기"><button type="button" className="qp-close-button" aria-label="빠른 설정 또는 알림 닫기" onClick={() => { closePanel(); advanceQuest('quick-panel-bg'); }}><ChevronUp size={18} /><span>닫기</span></button></ActionTarget>
          </footer>
        </section>
        <p className="qp-learning-caption">좌우로 밀어 빠른 설정과 알림을 전환해요.<br />화면 캡처: 측면 버튼 + 음량 아래 버튼을 짧게 누르기.<br />버튼 구성과 진동 지원은 기종에 따라 달라요.</p>
      </div>

      {wifiModalOpen && <div className="qp-dialog-overlay" onClick={event => { if (event.target === event.currentTarget) closeWifi(); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="qp-wifi-title" className="qp-wifi-dialog">
          <header className="qp-dialog-header"><h2 id="qp-wifi-title">{wifiPasswordInput === 'open' ? '탐험대_WiFi' : 'Wi-Fi'}</h2><button type="button" className="qp-icon-button" aria-label="Wi-Fi 닫기" onClick={closeWifi}><X size={20} /></button></header>
          {wifiPasswordInput === 'open' ? <>
            <form className="qp-password-body" id="qp-wifi-form" onSubmit={event => { event.preventDefault(); connectWifi(); }}>
              <div className="qp-password-help"><span>연습 비밀번호</span><strong>tablet1234</strong><p>실제 학교나 집의 비밀번호는 입력하지 않아요.</p></div>
              <label htmlFor="practice-wifi-password" className="qp-field-label">비밀번호</label>
              <ActionTarget {...targetProps} id="wifi-pw-input" disableClickAdvance className="qp-password-target" tooltipPosition="bottom">
                <input id="practice-wifi-password" autoComplete="off" spellCheck={false} type={showWifiPassword ? 'text' : 'password'} value={wifiPassword} onChange={event => { setWifiPassword(event.target.value); setWifiError(''); if (event.target.value === 'tablet1234') advanceQuest('wifi-pw-input'); }} placeholder="비밀번호 입력" aria-invalid={!!wifiError} aria-describedby={wifiError ? 'qp-wifi-error' : undefined} />
              </ActionTarget>
              <label className="qp-password-checkbox"><input type="checkbox" checked={showWifiPassword} onChange={event => setShowWifiPassword(event.target.checked)} />비밀번호 표시</label>
              {wifiError && <p id="qp-wifi-error" role="alert" className="qp-wifi-error">{wifiError}</p>}
            </form>
            <footer className="qp-dialog-footer"><button type="button" onClick={() => { setWifiPasswordInput(''); setWifiError(''); }}>취소</button><ActionTarget {...targetProps} id="wifi-connect-btn" disableClickAdvance className="qp-connect-target"><button type="submit" form="qp-wifi-form" disabled={!wifiPassword}>연결</button></ActionTarget></footer>
          </> : <>
            <div className="qp-wifi-toggle-row"><span>{wifi ? '사용 중' : '사용 안 함'}</span><button type="button" role="switch" aria-label="Wi-Fi" aria-checked={wifi} className={`qp-switch ${wifi ? 'is-on' : ''}`} onClick={() => { setWifi(!wifi); if (wifi) setWifiConnected(null); }}><span /></button></div>
            <div className="qp-network-scroll">
              {!wifi ? <div className="qp-wifi-disabled"><Wifi size={32} /><p>Wi-Fi를 켜면 주변 네트워크를 찾을 수 있어요.</p></div> : <>
                {wifiConnected && <><p className="qp-network-section-label">현재 네트워크</p><ActionTarget {...targetProps} id={WIFI_NETWORKS.find(network => network.name === wifiConnected)?.id ?? 'wifi-current-network'} disableClickAdvance className="qp-network-target" tooltipPosition="bottom"><button type="button" className="qp-network-row qp-network-connected" onClick={() => { if (wifiConnected === '탐험대_WiFi') openTrainingNetwork(); else openSettings('connections'); }}><WifiSignal secure /><span className="qp-network-copy"><strong>{wifiConnected}</strong><span>연결됨</span></span><Check size={19} /></button></ActionTarget></>}
                <p className="qp-network-section-label">사용 가능한 네트워크</p>
                {wifiError && <p role="status" className="qp-wifi-network-notice">{wifiError}</p>}
                {WIFI_NETWORKS.filter(network => network.name !== wifiConnected).map(network => <ActionTarget key={network.id} {...targetProps} id={network.id} disableClickAdvance className="qp-network-target" tooltipPosition="bottom">
                  <button type="button" className="qp-network-row" onClick={() => { if (network.id === 'wifi-net-0') openTrainingNetwork(); else { setWifiError('학교에서 안내한 탐험대_WiFi에 연결해요. 모르는 네트워크에는 연결하지 않아요.'); } }}>
                    <WifiSignal secure={network.secure} signal={network.signal} /><span className="qp-network-copy"><strong>{network.name}</strong><span>{network.secure ? '보안 네트워크' : '공개 네트워크'}</span></span>
                  </button>
                </ActionTarget>)}
              </>}
            </div>
            <footer className="qp-dialog-footer"><button type="button" onClick={() => openSettings('connections')}>상세설정</button><button type="button" onClick={closeWifi}>완료</button></footer>
          </>}
        </section>
      </div>}
    </div>
  );
}
