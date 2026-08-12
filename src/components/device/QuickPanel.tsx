import React from 'react';
import {
  Wifi, Bluetooth, Volume2, VolumeX, Vibrate, Sun, Camera, Settings, Play,
  BatteryCharging, X, RefreshCcw, Plane, Flashlight, MapPin, MonitorPlay,
  ImageIcon, Sliders, Smartphone, Moon, ChevronUp, Cloud, Power, Signal,
} from 'lucide-react';
import { ActionTarget } from '@/components/apps/shared';
import { WIFI_NETWORKS } from '@/data/appCatalog';
import type { NotificationItem, Upd } from '@/components/device/HomeScreen';

export interface QuickPanelProps {
  currentTargetId: string | null;
  advanceQuest: (id: string) => void;
  quickPanelOpen: boolean;
  setQuickPanelOpen: React.Dispatch<React.SetStateAction<any>>;
  notifications: NotificationItem[];
  setNotifications: Upd<NotificationItem[]>;
  notifDrag: { id: number; startX: number; dx: number } | null;
  setNotifDrag: React.Dispatch<React.SetStateAction<any>>;
  readNotifIds: number[];
  setReadNotifIds: React.Dispatch<React.SetStateAction<any>>;
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

export default function QuickPanel({
  currentTargetId, advanceQuest, quickPanelOpen, setQuickPanelOpen,
  notifications, setNotifications, notifDrag, setNotifDrag, readNotifIds, setReadNotifIds,
  wifi, setWifi, wifiConnected, setWifiConnected,
  wifiModalOpen, setWifiModalOpen, wifiPasswordInput, setWifiPasswordInput, wifiPassword, setWifiPassword,
  bluetooth, setBluetooth, connectedBtDevice, setBluetoothModalOpen,
  airplane, setAirplane, darkMode, setDarkMode, brightness, setBrightness,
  volume, setVolume, soundMode, setSoundMode, setPhotos, setCurrentApp, setSettingsMenu,
}: QuickPanelProps) {
  return (
    <div
      className={`absolute inset-0 z-50 transition-opacity duration-300 ${quickPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{ background: 'radial-gradient(ellipse at top, rgba(60,60,60,0.55) 0%, rgba(0,0,0,0.65) 70%)', backdropFilter: 'blur(28px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) { setQuickPanelOpen(false); advanceQuest('quick-panel-bg'); } }}
    >

      {/* 상단 상태 줄 + 액션 아이콘 */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-8 py-5 text-white/95 z-10">
        <span className="text-sm font-medium tracking-tight drop-shadow">{airplane ? '비행기 탑승 모드' : 'SIM 카드 없음 · 제한구역서비스'}</span>
        <div className="flex items-center gap-5">
          <div className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center text-base shadow-md">🙂</div>
          <button className="p-1.5 rounded-full hover:bg-white/10 active:scale-90 transition" title="편집"><Sliders size={20}/></button>
          <button className="p-1.5 rounded-full hover:bg-white/10 active:scale-90 transition" title="전원"><Power size={20}/></button>
          <button
            className="p-1.5 rounded-full hover:bg-white/10 active:scale-90 transition"
            title="설정"
            onClick={() => { setCurrentApp('Settings'); setSettingsMenu('connections'); setQuickPanelOpen(false); }}
          ><Settings size={20}/></button>
        </div>
      </div>

      {/* 메인 패널 (스크롤 가능) */}
      <div className="w-full h-full pt-16 pb-8 px-4 md:px-12 overflow-y-auto flex flex-col items-center gap-3">
        <div className="w-full max-w-3xl flex flex-col gap-3">

          {/* 알림 영역 */}
          {notifications.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-2 mb-0.5">
                <span className="text-white/80 text-xs font-semibold tracking-wide">알림 {notifications.length}</span>
                <ActionTarget
                  id="notif-clear-all" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                  onClick={() => { setNotifications([]); setTimeout(() => { setQuickPanelOpen(false); }, 400); }}
                  tooltipPosition="left"
                  tooltipText="모두 지우기"
                  className="text-white/80 text-xs font-medium px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 cursor-pointer transition"
                >
                  모두 지우기
                </ActionTarget>
              </div>
              {notifications.map(n => {
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
                    onClick={(e) => {
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
                      if (!notifDrag || notifDrag.id !== n.id) { setNotifDrag(null); return; }
                      const d = notifDrag.dx;
                      setNotifDrag(null);
                      if (Math.abs(d) > 100) {
                        setNotifications(prev => prev.filter(x => x.id !== n.id));
                        advanceQuest(`notif-dismiss-${n.id}`);
                      }
                    }}
                    className="bg-white/95 text-gray-900 rounded-2xl px-4 py-3 shadow-lg flex items-start gap-3 cursor-pointer select-none touch-none"
                    style={{ transform: `translateX(${drag}px)`, opacity, transition: notifDrag && notifDrag.id === n.id ? 'none' : 'transform 0.2s, opacity 0.2s' }}
                  >
                    <div className={`w-8 h-8 rounded-lg ${n.color} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow`}>
                      {n.app === 'KakaoTalk' ? '💬' : n.app === 'Messages' ? '✉️' : n.app === 'Gmail' ? 'M' : '!'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-0.5">
                        <span className="font-semibold">{n.appName}</span>
                        <span>· 방금 전</span>
                        {isRead && <span className="text-blue-500 font-medium">· 읽음</span>}
                      </div>
                      <div className="text-sm font-bold truncate">{n.title}</div>
                      <div className="text-[13px] text-gray-700 truncate">{n.body}</div>
                    </div>
                  </ActionTarget>
                );
              })}
            </div>
          )}



          {/* Wi-Fi / 블루투스 대형 알약 */}
          <div className="grid grid-cols-2 gap-3">
            <ActionTarget
              id="quick-wifi-toggle" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={() => {
                if(!wifi) { setWifi(true); setTimeout(() => setWifiModalOpen(true), 300); }
                else { setWifi(false); setWifiConnected(null); }
              }}
              className={`h-20 px-6 rounded-full flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer ${wifi ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/15 text-white backdrop-blur-md'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${wifi ? 'bg-white/20' : 'bg-white/15'}`}><Wifi size={24}/></div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-semibold text-base">Wi-Fi</span>
                <span className="text-xs opacity-80 truncate">{wifiConnected || (wifi ? '연결 대기' : '사용 안 함')}</span>
              </div>
            </ActionTarget>

            <ActionTarget
              id="quick-bluetooth" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={() => {
                if (!bluetooth) { setBluetooth(true); setBluetoothModalOpen(true); }
                else { setBluetoothModalOpen(true); }
              }}
              className={`h-20 px-6 rounded-full flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer ${bluetooth ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/15 text-white backdrop-blur-md'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bluetooth ? 'bg-white/20' : 'bg-white/15'}`}><Bluetooth size={24}/></div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-semibold text-base">블루투스</span>
                <span className="text-xs opacity-80 truncate">{connectedBtDevice || (bluetooth ? '켜짐' : '꺼짐')}</span>
              </div>
            </ActionTarget>
          </div>

          {/* 둥근 아이콘 캡슐 그리드 (2행 x 5열) */}
          <div className="bg-white/12 backdrop-blur-md rounded-[2rem] p-5">
            <div className="grid grid-cols-5 gap-y-5 justify-items-center">
              {[
                { key: 'rotate', icon: <RefreshCcw size={22}/>, on: true, label: '자동회전' },
                { key: 'airplane', icon: <Plane size={22}/>, on: airplane, label: '비행기', target: 'quick-airplane', onClick: () => setAirplane(!airplane) },
                { key: 'flash', icon: <Flashlight size={22}/>, on: false, label: '손전등' },
                { key: 'data', icon: <Signal size={22}/>, on: !airplane, label: '모바일' },
                { key: 'hotspot', icon: <Cloud size={22}/>, on: false, label: '핫스팟' },
                { key: 'battery', icon: <BatteryCharging size={22}/>, on: false, label: '절전' },
                { key: 'eye', icon: <ImageIcon size={22}/>, on: false, label: '눈편함' },
                { key: 'sync', icon: <RefreshCcw size={22}/>, on: true, label: '동기화' },
                { key: 'darkmode', icon: <Moon size={22}/>, on: darkMode, label: '다크모드', target: 'quick-darkmode', onClick: () => setDarkMode(!darkMode) },
                { key: 'location', icon: <MapPin size={22}/>, on: true, label: '위치' },
              ].map((it: any) => {
                const inner = (
                  <div className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${it.on ? 'bg-white text-black' : 'bg-white/15 text-white'}`}>
                      {it.icon}
                    </div>
                    <span className="text-[10px] text-white/85">{it.label}</span>
                  </div>
                );
                return it.target ? (
                  <ActionTarget key={it.key} id={it.target} currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={it.onClick}>
                    {inner}
                  </ActionTarget>
                ) : (
                  <div key={it.key} onClick={it.onClick}>{inner}</div>
                );
              })}
            </div>
          </div>

          {/* 밝기 / 음량 슬라이더 (캡슐) */}
          <div className="flex flex-col gap-2.5">
            <div className="bg-white/12 backdrop-blur-md rounded-full h-14 flex items-center px-5 gap-4">
              <Sun size={20} className="text-white/90 shrink-0"/>
              <input type="range" min="10" max="100" value={brightness}
                onChange={(e) => setBrightness(e.target.value)}
                className="flex-1 accent-white h-2 bg-white/25 rounded-full appearance-none cursor-pointer"/>
              <Moon size={20} className="text-white/90 shrink-0"/>
            </div>
            <ActionTarget id="quick-volume-slider" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              className="bg-white/12 backdrop-blur-md rounded-full h-14 flex items-center px-5 gap-4">
              <VolumeX size={20} className="text-white/90 shrink-0"/>
              <input type="range" min="0" max="100" value={volume}
                onChange={(e) => { setVolume(e.target.value); advanceQuest('quick-volume-slider'); }}
                className="flex-1 accent-white h-2 bg-white/25 rounded-full appearance-none cursor-pointer"/>
              <Volume2 size={20} className="text-white/90 shrink-0"/>
            </ActionTarget>
          </div>

          {/* 음악 재생 + 미디어 출력 */}
          <div className="bg-white/12 backdrop-blur-md rounded-full h-14 flex items-center justify-between pl-6 pr-2">
            <div className="flex items-center gap-3 text-white">
              <Play size={18}/>
              <span className="text-sm font-medium">음악 재생</span>
            </div>
            <button className="bg-white/15 hover:bg-white/25 rounded-full h-10 px-5 text-xs text-white font-medium active:scale-95 transition">미디어 출력</button>
          </div>

          {/* 소리 모드 (간소) */}
          <div className="grid grid-cols-3 gap-3">
            <div onClick={() => setSoundMode('sound')} className={`h-14 rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition ${soundMode === 'sound' ? 'bg-blue-500 text-white' : 'bg-white/12 text-white/90'}`}>
              <Volume2 size={18}/><span className="text-xs font-medium">소리</span>
            </div>
            <ActionTarget id="quick-sound-vibrate" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={() => setSoundMode('vibrate')}
              className={`h-14 rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition ${soundMode === 'vibrate' ? 'bg-blue-500 text-white' : 'bg-white/12 text-white/90'}`}
            >
              <Vibrate size={18}/><span className="text-xs font-medium">진동</span>
            </ActionTarget>
            <div onClick={() => setSoundMode('mute')} className={`h-14 rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition ${soundMode === 'mute' ? 'bg-blue-500 text-white' : 'bg-white/12 text-white/90'}`}>
              <VolumeX size={18}/><span className="text-xs font-medium">무음</span>
            </div>
          </div>

          {/* 하단 카드 2x2 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/12 backdrop-blur-md rounded-3xl h-20 flex items-center gap-4 px-5 cursor-pointer active:scale-[0.98] transition">
              <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center text-white"><Smartphone size={22}/></div>
              <span className="text-sm font-semibold text-white">주변 기기 연결</span>
            </div>
            <div className="bg-white/12 backdrop-blur-md rounded-3xl h-20 flex flex-col justify-center gap-0.5 px-5 cursor-pointer active:scale-[0.98] transition">
              <div className="flex items-center gap-2 text-white"><span className="text-base">✻</span><span className="text-sm font-semibold">SmartThings</span></div>
              <span className="text-[11px] text-white/70 pl-7">기기 제어</span>
            </div>
            <ActionTarget id="quick-screenshot" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={() => {
                const flash = document.createElement('div');
                flash.className = 'fixed inset-0 bg-white z-[200] pointer-events-none opacity-90';
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 200);
                setPhotos(prev => [...prev, { id: Date.now(), seed: Math.floor(Math.random()*1000) }]);
              }}
              className="bg-white/12 backdrop-blur-md rounded-3xl h-20 flex items-center gap-4 px-5 cursor-pointer active:scale-[0.98] transition"
            >
              <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center text-white"><Camera size={22}/></div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">스크린샷</span>
                <span className="text-[11px] text-white/70">화면 캡처</span>
              </div>
            </ActionTarget>
            <div className="bg-white/12 backdrop-blur-md rounded-3xl h-20 flex items-center gap-4 px-5 cursor-pointer active:scale-[0.98] transition">
              <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center text-white"><MonitorPlay size={22}/></div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Smart View</span>
                <span className="text-[11px] text-white/70">화면 미러링</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {quickPanelOpen && (
        <ActionTarget
          id="quick-panel-bg"
          currentTargetId={currentTargetId}
          advanceQuest={advanceQuest}
          onClick={() => setQuickPanelOpen(false)}
          tooltipPosition="top"
          tooltipText="여기를 눌러 퀵패널 닫기"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-6 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-sm font-medium flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg"
        >
          <ChevronUp size={16} /> 닫기 (위로 스와이프)
        </ActionTarget>
      )}



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
}
