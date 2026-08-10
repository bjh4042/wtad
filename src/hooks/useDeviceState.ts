import { useRef, useState } from 'react';
import { DEFAULT_WALLPAPER } from '@/data/homeDefaults';

export interface PhotoItem { id: number; seed: number }
export interface NoteItem { id: number; paths: string[] }
export type VolumeChannel = 'media' | 'ring' | 'notif';

/**
 * 기기(하드웨어/연결/미디어) 상태 묶음.
 * 서로 강하게 얽힌 화면 전환 상태(퀵패널, 모달, 앱 내부 상태)는 컴포넌트에 남겨둔다.
 */
export const useDeviceState = () => {
  // 현재 앱/화면
  const [currentApp, setCurrentApp] = useState<string | null>(null);

  // 네트워크 / 연결
  const [wifi, setWifi] = useState(false);
  const [wifiConnected, setWifiConnected] = useState<string | null>(null);
  const [bluetooth, setBluetooth] = useState(false);
  const [connectedBtDevice, setConnectedBtDevice] = useState<string | null>(null);

  // 화면 / 소리
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(70);
  const [mediaVolume, setMediaVolume] = useState(70);
  const [ringVolume, setRingVolume] = useState(60);
  const [notifVolume, setNotifVolume] = useState(50);
  const [volumePanelOpen, setVolumePanelOpen] = useState(false);
  const [volumePanelType, setVolumePanelType] = useState<VolumeChannel>('media');
  const volumeCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showVolumePanel = (type: VolumeChannel, delta: number) => {
    setVolumePanelType(type);
    setVolumePanelOpen(true);
    const clamp = (v: number) => Math.max(0, Math.min(100, v + delta));
    if (type === 'media') setMediaVolume(clamp);
    if (type === 'ring') setRingVolume(clamp);
    if (type === 'notif') setNotifVolume(clamp);
    if (volumeCloseTimer.current) clearTimeout(volumeCloseTimer.current);
    volumeCloseTimer.current = setTimeout(() => setVolumePanelOpen(false), 2400);
  };

  // 콘텐츠 / 설치 앱 / 배경화면
  const [installedApps, setInstalledApps] = useState<string[]>([]);
  const [wallpaper, setWallpaper] = useState<string>(DEFAULT_WALLPAPER);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);

  return {
    currentApp, setCurrentApp,
    wifi, setWifi,
    wifiConnected, setWifiConnected,
    bluetooth, setBluetooth,
    connectedBtDevice, setConnectedBtDevice,
    brightness, setBrightness,
    volume, setVolume,
    mediaVolume, setMediaVolume,
    ringVolume, setRingVolume,
    notifVolume, setNotifVolume,
    volumePanelOpen, setVolumePanelOpen,
    volumePanelType, setVolumePanelType,
    showVolumePanel,
    installedApps, setInstalledApps,
    wallpaper, setWallpaper,
    photos, setPhotos,
    notes, setNotes,
  };
};
