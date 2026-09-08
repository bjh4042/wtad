import React from 'react';
import {
  Wifi, Bluetooth, Volume2, VolumeX, Vibrate, Sun, Camera, Settings, Play,
  BatteryCharging, X, RefreshCcw, Plane, Flashlight, MapPin,
  ImageIcon, Sliders, Moon, ChevronUp, BellOff, Bell, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { ActionTarget } from '@/components/apps/shared';
import { WIFI_NETWORKS } from '@/data/appCatalog';
import type { NotificationItem, Upd } from '@/components/device/HomeScreen';

export type PanelMode = 'quick' | 'notifications' | null;

export interface QuickPanelProps {
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
  setCurrentApp: React.Dispatch<React.SetStateAction<any>>;
  setSettingsMenu: React.Dispatch<React.SetStateAction<any>>;
}

/** One UI 시스템 패널 공통 헤더 (시간 / 날짜 / 편집 / 설정) */
function PanelHeader({
  title, onSettings, right,
}: { title: string; onSettings?: () => void; right?: React.ReactNode }) {
  const [now, setNow] = React.useState<{ t: string; d: string } | null>(null);
  React.useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow({
        t: d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
        d: d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }),
      });
    };
    tick();
    const iv = setInterval(tick, 20000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="flex items-end justify-between text-white/95" style={{ minHeight: 'var(--oneui-panel-header-h)' }}>
      <div className="flex items-end gap-3 min-w-0">
        <span className="text-[26px] font-semibold leading-none tabular-nums tracking-[-0.02em]">{now?.t ?? '--:--'}</span>
        <span className="text-[13px] text-white/70 leading-none pb-0.5 truncate">{now?.d ?? ''}</span>
        <span className="text-[13px] text-white/50 leading-none pb-0.5 hidden sm:inline">· {title}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {right}
        <button
          type="button" title="편집 (시뮬레이션)" aria-label="편집"
          className="w-9 h-9 rounded-full flex items-center justify-center text-white/85 hover:bg-white/10 active:scale-90 transition"
          onClick={(e) => e.stopPropagation()}
        ><Sliders size={18} /></button>
        <button
          type="button" title="설정" aria-label="설정"
          className="w-9 h-9 rounded-full flex items-center justify-center text-white/85 hover:bg-white/10 active:scale-90 transition"
          onClick={(e) => { e.stopPropagation(); onSettings?.(); }}
        ><Settings size={18} /></button>
      </div>
    </div>
  );
}

export default function QuickPanel({
  currentTargetId, advanceQuest, quickPanelOpen, setQuickPanelOpen,
  panelMode, setPanelMode,
  notifications, setNotifications, notifDrag, setNotifDrag, readNotifIds, setReadNotifIds,
  wifi, setWifi, wifiConnected, setWifiConnected,
  wifiModalOpen, setWifiModalOpen, wifiPasswordInput, setWifiPasswordInput, wifiPassword, setWifiPassword,
  bluetooth, setBluetooth, connectedBtDevice, setBluetoothModalOpen,
  airplane, setAirplane, darkMode, setDarkMode, brightness, setBrightness,
  volume, setVolume, soundMode, setSoundMode, setPhotos, setCurrentApp, setSettingsMenu,
}: QuickPanelProps) {
  const mode: Exclude<PanelMode, null> = panelMode === 'notifications' ? 'notifications' : 'quick';
  const goMode = (m: Exclude<PanelMode, null>) => setPanelMode?.(m);

  const closePanel = () => { setQuickPanelOpen(false); setPanelMode?.(null); };
  const openSettings = () => { setCurrentApp('Settings'); setSettingsMenu('connections'); closePanel(); };

  /* ---- 패널 좌우 전환 제스처 (slider/toggle 위에서는 시작하지 않음) ---- */
  const swipe = React.useRef<{ x: number; y: number } | null>(null);
  const isInteractive = (target: EventTarget | null) => {
    const el = target as HTMLElement | null;
    return !!el?.closest?.('input, button, [role="slider"]');
  };
  const onSwipeDown = (e: React.PointerEvent) => {
    if (isInteractive(e.target)) { swipe.current = null; return; }
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onSwipeUp = (e: React.PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) goMode('notifications');
      else goMode('quick');
      return;
    }
    if (dy < -60 && Math.abs(dy) > Math.abs(dx)) {
      closePanel();
      advanceQuest('quick-panel-bg');
    }
  };

  const soundLabel = soundMode === 'vibrate' ? '진동' : soundMode === 'mute' ? '무음' : '소리';
  const SoundIcon = soundMode === 'vibrate' ? Vibrate : soundMode === 'mute' ? VolumeX : Volume2;

  /* ---- 큰 toggle 타일 ---- */
  const Tile = ({
    id, on, icon, label, sub, onClick, extraTarget,
  }: { id?: string; on: boolean; icon: React.ReactNode; label: string; sub?: string; onClick: () => void; extraTarget?: boolean }) => {
    const inner = (
      <div
        className="h-[74px] flex items-center gap-3 cursor-pointer select-none active:scale-[0.98] transition-transform"
        style={{
          background: on ? 'var(--oneui-panel-tile-on)' : 'var(--oneui-panel-tile)',
          color: on ? '#101114' : '#fff',
          borderRadius: '999px',
          paddingLeft: 16, paddingRight: 20,
        }}
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          style={{ background: on ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.14)' }}
        >{icon}</div>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-[14px] font-semibold truncate">{label}</span>
          <span className={`text-[11px] truncate ${on ? 'opacity-60' : 'opacity-70'}`}>{sub}</span>
        </div>
      </div>
    );
    return id ? (
      <ActionTarget id={id} currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={onClick} className="block">
        {inner}
      </ActionTarget>
    ) : (
      <div onClick={onClick}>{inner}</div>
    );
  };

  const MiniTile = ({
    id, on, icon, label, onClick,
  }: { id?: string; on: boolean; icon: React.ReactNode; label: string; onClick?: () => void }) => {
    const inner = (
      <div className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform">
        <div
          className="w-[52px] h-[52px] rounded-full flex items-center justify-center"
          style={{ background: on ? 'var(--oneui-panel-tile-on)' : 'var(--oneui-panel-tile)', color: on ? '#101114' : '#fff' }}
        >{icon}</div>
        <span className="text-[10.5px] text-white/80">{label}</span>
      </div>
    );
    return id ? (
      <ActionTarget id={id} currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={onClick}>{inner}</ActionTarget>
    ) : (
      <div onClick={onClick}>{inner}</div>
    );
  };

  const renderNotifCard = (n: NotificationItem) => {
    const drag = notifDrag && notifDrag.id === n.id ? notifDrag.dx : 0;
    const opacity = Math.max(0, 1 - Math.abs(drag) / 200);
    const isRead = readNotifIds.includes(n.id);
    return (
      <ActionTarget
        key={n.id}
        id={`notif-tap-${n.id}`}
        currentTargetId={currentTargetId}
        advanceQuest={advanceQuest}
        extraTargetIds={[`notif-dismiss-${n.id}`]}
        disableClickAdvance={true}
        onClick={(e: any) => {
          e.stopPropagation();
          if (Math.abs(drag) > 5) return;
          setReadNotifIds(prev => prev.includes(n.id) ? prev : [...prev, n.id]);
          advanceQuest(`notif-tap-${n.id}`);
        }}
        tooltipPosition="bottom"
        tooltipText={currentTargetId === `notif-dismiss-${n.id}` ? '← 옆으로 스와이프해서 지우기' : '탭해서 확인'}
        onPointerDown={(e: any) => {
          e.stopPropagation();
          setNotifDrag({ id: n.id, startX: e.clientX, dx: 0 });
        }}
        onPointerMove={(e: any) => {
          if (!notifDrag || notifDrag.id !== n.id) return;
          setNotifDrag({ ...notifDrag, dx: e.clientX - notifDrag.startX });
        }}
        onPointerUp={(e: any) => {
          e.stopPropagation?.();
          if (!notifDrag || notifDrag.id !== n.id) { setNotifDrag(null); return; }
          const d = notifDrag.dx;
          setNotifDrag(null);
          if (Math.abs(d) > 100) {
            setNotifications(prev => prev.filter(x => x.id !== n.id));
            advanceQuest(`notif-dismiss-${n.id}`);
          }
        }}
        className="rounded-[22px] px-4 py-3 flex items-start gap-3 cursor-pointer select-none touch-none text-white"
        style={{
          background: 'rgba(255,255,255,0.10)',
          transform: `translateX(${drag}px)`,
          opacity,
          transition: notifDrag && notifDrag.id === n.id ? 'none' : 'transform 0.2s, opacity 0.2s',
        }}
      >
        <div className={`w-9 h-9 rounded-full ${n.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
          {n.app === 'KakaoTalk' ? '💬' : n.app === 'Messages' ? '✉️' : n.app === 'Gmail' ? 'M' : '!'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-white/60 mb-0.5">
            <span className="font-semibold text-white/80">{n.appName}</span>
            <span>· 방금 전</span>
            {isRead && <span className="text-sky-300 font-medium">· 읽음</span>}
          </div>
          <div className="text-[14px] font-semibold truncate">{n.title}</div>
          <div className="text-[12.5px] text-white/70 truncate">{n.body}</div>
        </div>
      </ActionTarget>
    );
  };

  return (
    <div
      className={`absolute inset-0 z-[90] transition-opacity ${quickPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{
        transitionDuration: 'var(--oneui-duration)',
        transitionTimingFunction: 'var(--oneui-ease)',
        background: 'var(--oneui-panel-scrim)',
        backdropFilter: 'blur(var(--oneui-overlay-blur))',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) { closePanel(); advanceQuest('quick-panel-bg'); } }}
    >
      {/* 상단에서 내려오는 시스템 패널 */}
      <div
        key={mode}
        className="oneui oneui-panel-enter absolute left-0 right-0 top-0 mx-auto flex flex-col text-white z-[91]"
        style={{
          maxWidth: 'min(1120px, 94%)',
          maxHeight: 'calc(100% - var(--oneui-navbar-h) - 16px)',
          background: 'var(--oneui-panel-bg)',
          backdropFilter: 'blur(var(--oneui-overlay-blur))',
          borderBottomLeftRadius: 'var(--oneui-panel-radius)',
          borderBottomRightRadius: 'var(--oneui-panel-radius)',
          padding: 'var(--oneui-panel-pad)',
          gap: 'var(--oneui-panel-gap)',
          boxShadow: '0 18px 48px rgba(0,0,0,0.42)',
        }}
        onPointerDown={onSwipeDown}
        onPointerUp={onSwipeUp}
      >
        <PanelHeader
          title={mode === 'quick' ? '빠른 설정' : '알림'}
          onSettings={openSettings}
          right={
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goMode(mode === 'quick' ? 'notifications' : 'quick'); }}
              className="h-9 px-3 rounded-full bg-white/12 hover:bg-white/20 active:scale-95 transition flex items-center gap-1.5 text-[12px] font-medium"
            >
              {mode === 'quick'
                ? <><ChevronRight size={14} /> 알림{notifications.length > 0 ? ` ${notifications.length}` : ''}</>
                : <><ChevronLeft size={14} /> 빠른 설정</>}
            </button>
          }
        />

        <div className="flex-1 min-h-0 overflow-y-auto pr-1" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--oneui-panel-gap)' }}>
          {mode === 'quick' ? (
            <>
              {/* 주요 연결 toggle */}
              <div className="grid grid-cols-2 gap-3">
                <Tile
                  id="quick-wifi-toggle" on={wifi}
                  icon={<Wifi size={22} />} label="Wi-Fi"
                  sub={wifiConnected || (wifi ? '연결 대기' : '사용 안 함')}
                  onClick={() => {
                    if (!wifi) { setWifi(true); setTimeout(() => setWifiModalOpen(true), 260); }
                    else { setWifi(false); setWifiConnected(null); }
                  }}
                />
                <Tile
                  id="quick-bluetooth" on={bluetooth}
                  icon={<Bluetooth size={22} />} label="블루투스"
                  sub={connectedBtDevice || (bluetooth ? '켜짐' : '꺼짐')}
                  onClick={() => { if (!bluetooth) setBluetooth(true); setBluetoothModalOpen(true); }}
                />
                <Tile
                  id="quick-airplane" on={airplane}
                  icon={<Plane size={22} />} label="비행기 탑승 모드"
                  sub={airplane ? '켜짐 · 통신 차단' : '꺼짐'}
                  onClick={() => setAirplane(!airplane)}
                />
                <Tile
                  on={soundMode === 'sound'}
                  icon={<SoundIcon size={22} />} label="소리 모드" sub={soundLabel}
                  onClick={() => setSoundMode(soundMode === 'sound' ? 'vibrate' : soundMode === 'vibrate' ? 'mute' : 'sound')}
                />
              </div>

              {/* 소리 모드 상세 (진동 quest 대상 유지) */}
              <div className="grid grid-cols-3 gap-2.5">
                <div onClick={() => setSoundMode('sound')} className={`h-12 rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition ${soundMode === 'sound' ? 'bg-white text-[#101114]' : 'bg-white/12 text-white/90'}`}>
                  <Volume2 size={17} /><span className="text-[12px] font-medium">소리</span>
                </div>
                <ActionTarget
                  id="quick-sound-vibrate" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                  onClick={() => setSoundMode('vibrate')}
                  className={`h-12 rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition ${soundMode === 'vibrate' ? 'bg-white text-[#101114]' : 'bg-white/12 text-white/90'}`}
                >
                  <Vibrate size={17} /><span className="text-[12px] font-medium">진동</span>
                </ActionTarget>
                <div onClick={() => setSoundMode('mute')} className={`h-12 rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition ${soundMode === 'mute' ? 'bg-white text-[#101114]' : 'bg-white/12 text-white/90'}`}>
                  <VolumeX size={17} /><span className="text-[12px] font-medium">무음</span>
                </div>
              </div>

              {/* 밝기 / 음량 */}
              <div className="flex flex-col" style={{ gap: 'var(--oneui-panel-gap)' }}>
                <div className="rounded-full h-[52px] flex items-center px-5 gap-4" style={{ background: 'var(--oneui-panel-tile)' }}>
                  <Sun size={19} className="text-white/90 shrink-0" />
                  <input
                    type="range" min="10" max="100" value={brightness} aria-label="밝기"
                    onChange={(e) => setBrightness(e.target.value)}
                    className="flex-1 accent-white h-2.5 bg-white/25 rounded-full appearance-none cursor-pointer"
                  />
                  <span className="text-[11px] text-white/70 w-8 text-right tabular-nums">{brightness}</span>
                </div>
                <ActionTarget
                  id="quick-volume-slider" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                  className="rounded-full h-[52px] flex items-center px-5 gap-4"
                  style={{ background: 'var(--oneui-panel-tile)' }}
                >
                  <VolumeX size={19} className="text-white/90 shrink-0" />
                  <input
                    type="range" min="0" max="100" value={volume} aria-label="음량"
                    onChange={(e) => { setVolume(e.target.value); advanceQuest('quick-volume-slider'); }}
                    className="flex-1 accent-white h-2.5 bg-white/25 rounded-full appearance-none cursor-pointer"
                  />
                  <Volume2 size={19} className="text-white/90 shrink-0" />
                </ActionTarget>
              </div>

              {/* 보조 control */}
              <div className="rounded-[24px] p-4" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div className="grid grid-cols-5 gap-y-4 justify-items-center">
                  <MiniTile on={darkMode} id="quick-darkmode" icon={<Moon size={20} />} label="다크 모드" onClick={() => setDarkMode(!darkMode)} />
                  <MiniTile
                    on={false} id="quick-screenshot" icon={<Camera size={20} />} label="스크린샷"
                    onClick={() => {
                      const flash = document.createElement('div');
                      flash.className = 'fixed inset-0 bg-white z-[200] pointer-events-none opacity-90';
                      document.body.appendChild(flash);
                      setTimeout(() => flash.remove(), 200);
                      setPhotos(prev => [...prev, { id: Date.now(), seed: Math.floor(Math.random() * 1000) }]);
                    }}
                  />
                  <MiniTile on={true} icon={<RefreshCcw size={20} />} label="자동 회전" />
                  <MiniTile on={false} icon={<Flashlight size={20} />} label="손전등" />
                  <MiniTile on={true} icon={<MapPin size={20} />} label="위치" />
                  <MiniTile on={false} icon={<BatteryCharging size={20} />} label="절전" />
                  <MiniTile on={false} icon={<ImageIcon size={20} />} label="눈 편한 화면" />
                  <MiniTile on={!airplane} icon={<Play size={20} />} label="미디어" />
                </div>
              </div>
            </>
          ) : (
            <>
              {notifications.length > 0 ? (
                <>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-white/75 text-[12px] font-semibold">알림 {notifications.length}개</span>
                    <ActionTarget
                      id="notif-clear-all" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                      onClick={() => { setNotifications([]); }}
                      tooltipPosition="left" tooltipText="모두 지우기"
                      className="text-white/85 text-[12px] font-medium px-3.5 py-1.5 rounded-full bg-white/12 hover:bg-white/20 active:scale-95 cursor-pointer transition"
                    >
                      모두 지우기
                    </ActionTarget>
                  </div>
                  <div className="flex flex-col gap-2">
                    {notifications.map(renderNotifCard)}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2.5 py-12 text-white/60">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center"><BellOff size={24} /></div>
                  <div className="text-[13px]">알림이 없어요</div>
                </div>
              )}
              <div className="flex items-center justify-between rounded-[22px] px-5 h-[52px] mt-1" style={{ background: 'var(--oneui-panel-tile)' }}>
                <div className="flex items-center gap-2.5 text-white/85"><Bell size={17} /><span className="text-[13px] font-medium">알림 설정</span></div>
                <button
                  type="button"
                  className="text-[12px] text-white/70 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition"
                  onClick={(e) => { e.stopPropagation(); openSettings(); }}
                >설정 열기</button>
              </div>
            </>
          )}
        </div>

        {/* 좌우 전환 안내 (학습용) */}
        <div className="flex items-center justify-center gap-2 pt-0.5 text-[11px] text-white/50">
          <span className={mode === 'quick' ? 'text-white' : ''}>빠른 설정</span>
          <span>↔ 좌우로 스와이프 ↔</span>
          <span className={mode === 'notifications' ? 'text-white' : ''}>알림</span>
        </div>
      </div>

      {quickPanelOpen && (
        <ActionTarget
          id="quick-panel-bg"
          currentTargetId={currentTargetId}
          advanceQuest={advanceQuest}
          onClick={() => closePanel()}
          tooltipPosition="top"
          tooltipText="여기를 눌러 퀵패널 닫기"
          className="absolute bottom-[calc(var(--oneui-navbar-h)+14px)] left-1/2 -translate-x-1/2 z-[92] px-6 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-[13px] font-medium flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg"
        >
          <ChevronUp size={16} /> 닫기 (위로 스와이프)
        </ActionTarget>
      )}

      {wifiModalOpen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#1c1c1e] rounded-3xl p-6 text-[#f5f5f5] shadow-2xl z-[95] border border-gray-700/50 animate-[fadeIn_0.2s_ease-out]">
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
}
