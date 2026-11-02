import React, { useEffect, useRef, useState } from 'react';
import { Camera, Grid3X3, RotateCcw, Timer } from 'lucide-react';
import { ActionTarget } from './shared';
import type { PhotoItem } from '@/hooks/useDeviceState';

export interface CameraAppProps {
  photos: PhotoItem[];
  setPhotos: React.Dispatch<React.SetStateAction<PhotoItem[]>>;
  currentTargetId: string | null;
  advanceQuest: (id: string) => void;
  onOpenGallery: () => void;
}
const PERMISSION_KEY = 'android-explorer-camera-permission-v2';
/** Every scene is drawn locally; this practice app never requests a real camera. */
const sceneSvg = (front: boolean, portrait: boolean, zoom: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#97dafa"/><stop offset="1" stop-color="#e5f7ff"/></linearGradient></defs><rect width="800" height="600" fill="url(#sky)"/><g transform="translate(400 300) scale(${zoom}) translate(-400 -300)">${front ? `<rect x="70" y="50" width="660" height="500" rx="35" fill="${portrait ? '#d6c6ed' : '#d9e8ef'}"/><path d="M200 600Q200 400 400 400Q600 400 600 600" fill="#378be6"/><ellipse cx="400" cy="282" rx="118" ry="135" fill="#f5c59b"/><path d="M280 270Q260 100 400 118Q548 105 520 274Q490 218 455 204Q350 241 306 198Z" fill="#30273b"/><circle cx="358" cy="287" r="10" fill="#30273b"/><circle cx="442" cy="287" r="10" fill="#30273b"/><path d="M370 342Q400 366 430 342" fill="none" stroke="#b26466" stroke-width="10" stroke-linecap="round"/><circle cx="335" cy="325" r="14" fill="#e49d98"/><circle cx="465" cy="325" r="14" fill="#e49d98"/>` : `<circle cx="660" cy="100" r="48" fill="#fff4ad"/><path d="M0 380Q160 230 330 370Q560 210 800 350V600H0Z" fill="#8ac9a3"/><path d="M0 470Q300 360 800 460V600H0Z" fill="#5bab8a"/><rect x="228" y="210" width="340" height="250" rx="8" fill="#f6d49d"/><path d="M200 220L398 100L600 220Z" fill="#6579a9"/><rect x="360" y="337" width="80" height="123" rx="4" fill="#687da9"/><g fill="#b5e3f5" stroke="#fff" stroke-width="8"><rect x="268" y="255" width="66" height="58"/><rect x="462" y="255" width="66" height="58"/></g><path d="M0 560Q150 490 300 540Q500 590 800 520" fill="none" stroke="#f9edcd" stroke-width="50"/>`}</g><rect x="20" y="548" width="245" height="32" rx="16" fill="#16314c" fill-opacity=".7"/><text x="37" y="570" font-family="sans-serif" font-size="17" fill="white">${front ? '연습 인물 · 가상 촬영' : '탐험대 학교 · 가상 촬영'}</text></svg>`;
const svgUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export default function CameraApp({ photos, setPhotos, currentTargetId, advanceQuest, onOpenGallery }: CameraAppProps) {
  const [permission, setPermission] = useState<'ask' | 'allowed' | 'denied'>('ask');
  const [front, setFront] = useState(false);
  const [mode, setMode] = useState<'photo' | 'portrait'>('photo');
  const [grid, setGrid] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [flash, setFlash] = useState(false);
  const [notice, setNotice] = useState('');
  const [focus, setFocus] = useState<{x: number; y: number} | null>(null);
  const pendingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const captureLock = useRef(false);
  useEffect(() => {
    try { const saved = localStorage.getItem(PERMISSION_KEY); if (saved === 'allowed' || saved === 'denied') setPermission(saved); } catch { /* no storage is also supported */ }
    return () => pendingTimers.current.forEach(clearTimeout);
  }, []);
  const later = (fn: () => void, ms: number) => { const t = setTimeout(fn, ms); pendingTimers.current.push(t); };
  const decidePermission = (next: 'allowed' | 'denied', once = false) => {
    setPermission(next);
    if (!once) try { localStorage.setItem(PERMISSION_KEY, next); } catch { /* remains usable */ }
    advanceQuest(next === 'allowed' ? 'camera-permission' : 'camera-permission-deny');
  };
  const source = svgUrl(sceneSvg(front, mode === 'portrait', zoom));
  const capture = () => {
    if (permission !== 'allowed' || captureLock.current) return;
    captureLock.current = true;
    const take = () => {
      const id = Date.now();
      const photo = { id, seed: id % 1000, src: source, dataUrl: source, name: `사진_${new Date(id).toISOString().replace(/[:.]/g, '-')}.svg`, kind: 'photo' as const, createdAt: new Date(id).toISOString() };
      setPhotos(prev => [...prev, photo]);
      setFlash(true); setCountdown(0); setNotice('찰칵! 연습 사진을 갤러리에 저장했어요.');
      advanceQuest('camera-shutter');
      later(() => { setFlash(false); captureLock.current = false; }, 300);
      later(() => setNotice(''), 3500);
    };
    if (timerEnabled) {
      setCountdown(3);
      later(() => setCountdown(2), 1000); later(() => setCountdown(1), 2000); later(take, 3000);
    } else take();
  };
  const last = photos[photos.length - 1] as (PhotoItem & { src?: string; dataUrl?: string }) | undefined;
  return <div className="relative flex-1 min-h-0 flex flex-col bg-black text-white overflow-hidden">
    <div className="shrink-0 flex items-center justify-between px-4 pt-9 pb-2 gap-2">
      <span className="text-xs text-white/60">카메라 · 가상 장면</span>
      <div className="flex items-center gap-2">
        <button type="button" aria-label="촬영 타이머" aria-pressed={timerEnabled} onClick={() => setTimerEnabled(!timerEnabled)} className={`min-w-11 h-11 rounded-full flex gap-1 items-center justify-center ${timerEnabled ? 'bg-yellow-300 text-black' : 'bg-white/10'}`}><Timer size={18}/><span className="text-xs">{timerEnabled ? '3초' : '끔'}</span></button>
        <button type="button" aria-label="안내선" aria-pressed={grid} onClick={() => { setGrid(!grid); advanceQuest('camera-grid'); }} className={`w-11 h-11 rounded-full flex items-center justify-center ${grid ? 'bg-yellow-300 text-black' : 'bg-white/10'}`}><Grid3X3 size={18}/></button>
      </div>
    </div>
    <div className="relative flex-1 min-h-0 flex items-center justify-center overflow-hidden bg-[#15232e]" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setFocus({ x: e.clientX - r.left, y: e.clientY - r.top }); advanceQuest('camera-focus'); later(() => setFocus(null), 1500); }}>
      <img src={source} className="w-full h-full object-contain" alt={front ? '전면 카메라 연습용 가상 인물' : '후면 카메라 연습용 학교 풍경'} draggable={false}/>
      {grid && <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">{Array.from({length:9}, (_,i) => <div key={i} className="border border-white/25"/>)}</div>}
      {focus && <div className="absolute w-16 h-16 border-2 border-yellow-300 rounded-lg pointer-events-none -translate-x-1/2 -translate-y-1/2" style={{left: focus.x, top: focus.y}}/>}
      {countdown > 0 && <div role="status" className="absolute text-7xl font-bold drop-shadow-xl">{countdown}</div>}
      <div className="absolute bottom-3 flex gap-2">{[1,2].map(z => <button type="button" key={z} aria-label={`${z}배 줌`} onClick={e => {e.stopPropagation(); setZoom(z);}} className={`w-11 h-11 rounded-full text-sm font-bold ${zoom === z ? 'bg-yellow-300 text-black' : 'bg-black/60 text-white'}`}>{z}x</button>)}</div>
    </div>
    <div className="shrink-0 bg-black px-5 pt-2 pb-4">
      <div className="flex items-center justify-center gap-6 pb-2">
        <button type="button" onClick={() => { setMode('portrait'); setFront(true); }} className={`h-10 px-4 rounded-full text-sm ${mode === 'portrait' ? 'text-yellow-300 bg-white/10' : 'text-white/70'}`}>인물 사진</button>
        <ActionTarget id="camera-photo-mode" currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance>
          <button type="button" onClick={() => { setMode('photo'); advanceQuest('camera-photo-mode'); }} className={`h-10 px-4 rounded-full text-sm ${mode === 'photo' ? 'text-yellow-300 bg-white/10' : 'text-white/70'}`}>사진</button>
        </ActionTarget>
      </div>
      <div className="max-w-lg mx-auto flex items-center justify-around gap-3 sm:gap-8">
        <button type="button" aria-label="촬영한 사진을 갤러리에서 보기" onClick={onOpenGallery} className="w-14 h-14 shrink-0 rounded-full border border-white/40 overflow-hidden bg-white/10 flex items-center justify-center">{last?.src || last?.dataUrl ? <img src={last.src || last.dataUrl} alt="최근 사진" className="w-full h-full object-cover"/> : <Camera size={24}/>}</button>
        <ActionTarget id="camera-shutter" currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance>
          <button type="button" aria-label="사진 촬영" disabled={permission !== 'allowed' || countdown > 0} onClick={capture} className="w-20 h-20 shrink-0 rounded-full border-4 border-white p-1 active:scale-95 disabled:opacity-40"><span className="block w-full h-full bg-white rounded-full"/></button>
        </ActionTarget>
        <ActionTarget id="camera-switch" currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance>
          <button type="button" aria-label="전면 후면 카메라 전환" onClick={() => { setFront(!front); setZoom(1); advanceQuest('camera-switch'); }} className="w-14 h-14 shrink-0 rounded-full bg-white/10 flex items-center justify-center"><RotateCcw size={25}/></button>
        </ActionTarget>
      </div>
      <p className="text-[11px] text-center text-white/60 mt-3">실제 카메라는 사용하지 않아요. 실제 친구를 촬영할 때는 먼저 허락을 받아요.</p>
    </div>
    {notice && <div role="status" className="absolute top-24 left-1/2 -translate-x-1/2 rounded-full bg-black/80 px-5 py-3 text-sm text-center">{notice}</div>}
    {flash && <div className="absolute inset-0 bg-white/80 pointer-events-none"/>}
    {permission !== 'allowed' && <div className="absolute inset-0 z-30 bg-black/80 flex items-center justify-center p-5"><div className="bg-[#25272c] rounded-3xl p-6 w-full max-w-sm max-h-full overflow-y-auto shadow-xl">
      <Camera className="mx-auto text-sky-300 mb-3" size={32}/><h2 className="text-xl font-bold text-center">{permission === 'denied' ? '카메라 권한이 꺼져 있어요' : '카메라 권한 연습'}</h2>
      <p className="text-sm text-white/75 leading-relaxed my-5">{permission === 'denied' ? '허용하지 않은 앱은 카메라를 사용할 수 없어요. 사진을 찍으려면 권한을 다시 확인해요.' : '사진 촬영에는 카메라 권한이 필요해요. 필요한 기능에만 권한을 허용해요. 아래는 가상 권한 창이며 실제 카메라에 접근하지 않아요.'}</p>
      {permission === 'ask' ? <div className="space-y-2">
        <button type="button" onClick={() => decidePermission('allowed')} className="w-full py-3 rounded-2xl bg-blue-500 font-semibold">앱 사용 중에만 허용</button>
        <button type="button" onClick={() => decidePermission('allowed', true)} className="w-full py-3 rounded-2xl bg-white/10">이번만 허용</button>
        <button type="button" onClick={() => decidePermission('denied')} className="w-full py-3 text-white/70">허용 안 함</button>
      </div> : <button type="button" onClick={() => setPermission('ask')} className="w-full py-3 rounded-2xl bg-blue-500 font-semibold">권한 다시 확인하기</button>}
    </div></div>}
  </div>;
}
