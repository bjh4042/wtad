import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, MoreHorizontal, Share2, Edit3, Trash2, Heart, Search, Check, RotateCw, Crop, Undo2, FolderPlus, X } from 'lucide-react';
import { ActionTarget, CuteStudent } from './shared';
import type { PhotoItem } from '@/hooks/useDeviceState';

export interface GalleryAppProps {
  currentTargetId: string | null; advanceQuest: (id: string) => void;
  photos: PhotoItem[]; setPhotos: React.Dispatch<React.SetStateAction<PhotoItem[]>>;
  viewPhoto: PhotoItem | null; setViewPhoto: (v: PhotoItem | null) => void;
  deleteConfirm: boolean; setDeleteConfirm: (v: boolean) => void;
  photoZoom: number; setPhotoZoom: React.Dispatch<React.SetStateAction<number>>;
  multiSelectMode: boolean; setMultiSelectMode: (v: boolean) => void;
  selectedPhotoIds: number[]; setSelectedPhotoIds: React.Dispatch<React.SetStateAction<number[]>>;
}
type PhotoMeta = { favorite?: boolean; rotation?: number; cropped?: boolean; album?: string };
type GalleryStorage = { trash: PhotoItem[]; metadata: Record<string, PhotoMeta>; albums: string[] };
const STORAGE_KEY = 'android-explorer-gallery-v2';
const emptyStorage: GalleryStorage = { trash: [], metadata: {}, albums: [] };
function readGallery(): GalleryStorage {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { trash: Array.isArray(raw.trash) ? raw.trash.filter((p: PhotoItem) => Number.isFinite(p.id) && Number.isFinite(p.seed)) : [], metadata: raw.metadata && typeof raw.metadata === 'object' ? raw.metadata : {}, albums: Array.isArray(raw.albums) ? raw.albums.filter((s: unknown) => typeof s === 'string') : [] };
  } catch { return emptyStorage; }
}

const GalleryApp = (props: GalleryAppProps) => {
  const { currentTargetId, advanceQuest, photos, setPhotos, viewPhoto, setViewPhoto, deleteConfirm, setDeleteConfirm, photoZoom, setPhotoZoom, multiSelectMode, setMultiSelectMode, selectedPhotoIds, setSelectedPhotoIds } = props;
  const [storage, setStorage] = useState<GalleryStorage>(emptyStorage);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<'photos' | 'albums' | 'favorites' | 'trash'>('photos');
  const [album, setAlbum] = useState<string | null>(null);
  const [newAlbum, setNewAlbum] = useState('');
  const [sheet, setSheet] = useState<'edit' | 'share' | 'more' | 'album' | null>(null);
  const [rotation, setRotation] = useState(0);
  const [cropped, setCropped] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [consent, setConsent] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [notice, setNotice] = useState('');
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; zoom: number } | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressedLong = useRef(false);
  useEffect(() => { setStorage(readGallery()); setReady(true); }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(storage)); } catch { /* practice remains usable without storage */ } } }, [storage, ready]);
  useEffect(() => () => { if (pressTimer.current) clearTimeout(pressTimer.current); }, []);
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(''), 4500); return () => clearTimeout(t); }, [notice]);
  const patchMeta = (id: number, patch: PhotoMeta) => setStorage(s => ({ ...s, metadata: { ...s.metadata, [id]: { ...s.metadata[id], ...patch } } }));
  const photoName = (photo: PhotoItem) => (photo as PhotoItem & { name?: string }).name || `사진_${photo.id}.jpg`;
  const isTrashPhoto = !!viewPhoto && storage.trash.some(p => p.id === viewPhoto.id);
  const meta = viewPhoto ? storage.metadata[viewPhoto.id] || {} : {};
  const image = (photo: PhotoItem, editing = false) => {
    const metadata = storage.metadata[photo.id] || {};
    const extended = photo as PhotoItem & { dataUrl?: string; imageUrl?: string; src?: string; kind?: string };
    const src = extended.src || extended.dataUrl || extended.imageUrl;
    return <div className="w-full h-full overflow-hidden flex items-center justify-center" style={{ transform: `rotate(${editing ? rotation : metadata.rotation || 0}deg) scale(${(editing ? cropped : metadata.cropped) ? 1.35 : 1})` }}>
      {src ? <img src={src} alt={photoName(photo)} className="w-full h-full object-contain" /> : extended.kind === 'screenshot' ? <div className="w-full h-full bg-gradient-to-br from-blue-900 to-sky-300 p-5 flex flex-col justify-end text-white"><span className="text-xs">화면 캡처 · 연습</span><div className="text-xl font-bold">안드로이드 탐험대</div><div className="mt-3 h-5 rounded bg-white/30" /></div> : <CuteStudent seed={photo.seed} />}
    </div>;
  };
  const trashPhotos = (ids: number[]) => {
    const moving = photos.filter(p => ids.includes(p.id));
    if (!moving.length) return;
    setStorage(s => ({ ...s, trash: [...moving, ...s.trash.filter(p => !ids.includes(p.id))] }));
    setPhotos(prev => prev.filter(p => !ids.includes(p.id)));
    setViewPhoto(null); setDeleteConfirm(false); setBulkConfirm(false); setMultiSelectMode(false); setSelectedPhotoIds([]);
    setNotice('휴지통으로 이동했어요. 휴지통에서 복원할 수 있어요.');
    advanceQuest('gallery-delete-confirm');
  };
  const restore = () => {
    if (!viewPhoto || !isTrashPhoto) return;
    const restoring = viewPhoto;
    setPhotos(prev => prev.some(p => p.id === restoring.id) ? prev : [...prev, restoring]);
    setStorage(s => ({ ...s, trash: s.trash.filter(p => p.id !== restoring.id) }));
    setViewPhoto(null); setTab('photos'); setNotice('사진을 원래 위치로 복원했어요.'); advanceQuest('gallery-restore');
  };
  const makeAlbum = () => {
    const name = newAlbum.trim().slice(0, 30);
    if (!name) { setNotice('앨범 이름을 입력해 주세요.'); return; }
    if (storage.albums.includes(name) || ['카메라','스크린샷'].includes(name)) { setNotice('같은 이름의 앨범이 있어요.'); return; }
    setStorage(s => ({ ...s, albums: [...s.albums, name] })); setNewAlbum(''); setNotice(`‘${name}’ 앨범을 만들었어요.`); advanceQuest('gallery-album-create');
  };
  const chooseTab = (next: typeof tab) => { setTab(next); setAlbum(null); setQuery(''); setMultiSelectMode(false); setSelectedPhotoIds([]); if (next === 'trash') advanceQuest('gallery-trash-open'); };
  const closePhoto = () => { setViewPhoto(null); setDeleteConfirm(false); setSheet(null); setPhotoZoom(1); };
  const sources = tab === 'trash' ? storage.trash : photos;
  const shown = [...sources].sort((a, b) => b.id - a.id).filter(p => (tab !== 'favorites' || storage.metadata[p.id]?.favorite) && (!album || (album === '스크린샷' ? (p as PhotoItem & {kind?:string}).kind === 'screenshot' : album === '카메라' ? (p as PhotoItem & {kind?:string}).kind !== 'screenshot' : storage.metadata[p.id]?.album === album)) && (!query || photoName(p).includes(query) || storage.metadata[p.id]?.album?.includes(query)));
  const cancelPress = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };
  const beginPress = (id: number) => { pressedLong.current = false; cancelPress(); if (tab !== 'trash') pressTimer.current = setTimeout(() => { pressedLong.current = true; setMultiSelectMode(true); setSelectedPhotoIds([id]); }, 550); };
  const buttonClass = 'flex flex-col items-center justify-center gap-1 min-w-12 min-h-12 px-2 text-sm hover:bg-white/10 rounded-xl';
  const action = (id: string, onClick: () => void, children: React.ReactNode, className = '') => <ActionTarget id={id} currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance className={className}><button className={buttonClass} onClick={onClick}>{children}</button></ActionTarget>;
  return <div className="flex-1 bg-[#101012] text-white flex flex-col pt-8 overflow-hidden min-h-0 relative">
    {notice && <div role="status" className="absolute z-[100] top-10 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white text-gray-900 shadow-lg rounded-2xl p-3 text-sm text-center">{notice}</div>}
    {viewPhoto ? <>
      <header className="flex items-center justify-between gap-3 p-3 shrink-0">
        <button aria-label="사진 목록으로" onClick={closePhoto} className={buttonClass}><ChevronLeft /></button>
        <div className="text-center min-w-0"><div className="font-semibold truncate">{isTrashPhoto ? '휴지통' : '사진'}</div><div className="text-xs text-gray-400 truncate max-w-[220px]">{photoName(viewPhoto)}</div></div>
        <button aria-label="사진 정보" className={buttonClass} onClick={() => setSheet('more')}><MoreHorizontal /></button>
      </header>
      <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden relative px-8 py-3">
        <div className="h-full max-h-[420px] aspect-square max-w-full overflow-hidden touch-none rounded-xl"
          onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pointers.current.size === 2) { const [a,b] = [...pointers.current.values()]; pinch.current = { distance: Math.hypot(a.x-b.x,a.y-b.y), zoom: photoZoom }; } }}
          onPointerMove={e => { if (!pointers.current.has(e.pointerId)) return; pointers.current.set(e.pointerId, {x:e.clientX,y:e.clientY}); if (pointers.current.size === 2 && pinch.current?.distance) { const [a,b] = [...pointers.current.values()]; const z = Math.max(1, Math.min(3, pinch.current.zoom * Math.hypot(a.x-b.x,a.y-b.y) / pinch.current.distance)); setPhotoZoom(z); if (z > pinch.current.zoom + .1) advanceQuest('photo-zoom-in'); if (z < pinch.current.zoom - .1) advanceQuest('photo-zoom-out'); } }}
          onPointerUp={e => { pointers.current.delete(e.pointerId); pinch.current = null; }} onPointerCancel={e => { pointers.current.delete(e.pointerId); pinch.current = null; }}>
          <div className="w-full h-full" style={{ transform: `scale(${photoZoom})` }}>{image(viewPhoto)}</div>
        </div>
        {!isTrashPhoto && <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 rounded-2xl p-1">
          {action('photo-zoom-in', () => { if (photoZoom < 3) { setPhotoZoom(z => Math.min(3,z+.5)); advanceQuest('photo-zoom-in'); } }, <span aria-label="사진 확대" className="text-2xl">+</span>)}
          <div className="text-xs text-center">{Math.round(photoZoom*100)}%</div>
          {action('photo-zoom-out', () => { if (photoZoom > 1) { setPhotoZoom(z => Math.max(1,z-.5)); advanceQuest('photo-zoom-out'); } }, <span aria-label="사진 축소" className="text-2xl">−</span>)}
        </div>}
      </div>
      <p className="text-center text-xs text-gray-400 py-1">{isTrashPhoto ? '실수로 지운 사진은 복원할 수 있어요.' : '두 손가락을 벌리거나 모아 확대·축소해요. PC에서는 + / −를 눌러요.'}</p>
      <footer className="flex items-center justify-around gap-1 p-2 bg-[#1c1c1e] shrink-0">
        {isTrashPhoto ? action('gallery-restore', restore, <><Undo2 /><span>복원</span></>) : <>
          <button className={buttonClass} onClick={() => { setConsent(false); setPrivacy(false); setSheet('share'); }}><Share2 /><span>공유</span></button>
          <button className={buttonClass} onClick={() => { setRotation(meta.rotation || 0); setCropped(!!meta.cropped); setSheet('edit'); }}><Edit3 /><span>편집</span></button>
          {action('gallery-delete', () => { setDeleteConfirm(true); advanceQuest('gallery-delete'); }, <><Trash2 /><span>삭제</span></>)}
          {action('gallery-favorite', () => { patchMeta(viewPhoto.id, {favorite:!meta.favorite}); if (!meta.favorite) advanceQuest('gallery-favorite'); }, <><Heart className={meta.favorite ? 'fill-red-400 text-red-400' : ''} /><span>즐겨찾기</span></>)}
          <button className={buttonClass} onClick={() => setSheet('album')}><FolderPlus /><span>앨범</span></button>
        </>}
      </footer>
    </> : <>
      <header className="flex items-center justify-between gap-2 p-4 shrink-0">
        <h2 className="text-2xl font-bold truncate">{multiSelectMode ? `${selectedPhotoIds.length}개 선택` : album || ({photos:'사진',albums:'앨범',favorites:'즐겨찾기',trash:'휴지통'}[tab])}</h2>
        <div className="flex items-center gap-2">
          {multiSelectMode ? <><button className="p-3" onClick={() => { setMultiSelectMode(false); setSelectedPhotoIds([]); }}>취소</button><button disabled={!selectedPhotoIds.length} className="p-3 text-red-300 disabled:opacity-40" onClick={() => setBulkConfirm(true)}>삭제</button></> : <><button aria-label="사진 검색" className={buttonClass} onClick={() => setSearchOpen(v=>!v)}><Search size={22}/></button>{tab !== 'trash' && <button className="p-3 text-blue-300" onClick={() => setMultiSelectMode(true)}>선택</button>}</>}
        </div>
      </header>
      {searchOpen && <input aria-label="사진 이름 검색" className="mx-4 mb-3 p-3 rounded-xl bg-white/10 outline-none" placeholder="파일 이름 또는 앨범 이름 검색" value={query} onChange={e => setQuery(e.target.value)} />}
      <main className="flex-1 min-h-0 overflow-y-auto px-4 pb-5">
        {tab === 'albums' && !album ? <>
          <div className="flex gap-2 mb-5"><input aria-label="새 앨범 이름" value={newAlbum} maxLength={30} onChange={e => setNewAlbum(e.target.value)} placeholder="새 앨범 이름" className="min-w-0 flex-1 rounded-xl bg-white/10 px-3" />{action('gallery-album-create', makeAlbum, <><FolderPlus size={20}/><span>만들기</span></>)}</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{['카메라','스크린샷',...storage.albums].map(name => <button key={name} className="text-left p-4 bg-white/5 rounded-2xl min-h-28" onClick={() => setAlbum(name)}><FolderPlus className="text-blue-300 mb-2" /><strong>{name}</strong><p className="text-xs text-gray-400 mt-1">{photos.filter(p=>name==='스크린샷'?(p as PhotoItem & {kind?:string}).kind==='screenshot':name==='카메라'?(p as PhotoItem & {kind?:string}).kind!=='screenshot':storage.metadata[p.id]?.album===name).length}개 항목</p></button>)}</div>
          {!storage.albums.length && <p className="text-center text-gray-400 py-8">‘수업 사진’처럼 알아보기 쉬운 이름으로 앨범을 만들어 보세요.</p>}
        </> : <>
          {album && <button className="mb-4 text-blue-300 flex gap-1 items-center" onClick={() => setAlbum(null)}><ChevronLeft size={18}/> 모든 앨범</button>}
          {tab === 'trash' && <p className="text-sm text-gray-400 mb-4">사진을 선택한 뒤 ‘복원’을 누르세요. 실제 갤럭시 갤러리는 휴지통 항목을 보통 30일간 보관해요. 이 연습에서는 자동 삭제하지 않아요.</p>}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
            {shown.map((photo,i) => <ActionTarget key={photo.id} id={`gallery-photo-${i}`} currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance>
              <button aria-label={`${photoName(photo)} ${selectedPhotoIds.includes(photo.id)?'선택됨':''}`} className={`w-full aspect-square rounded-xl overflow-hidden relative bg-white/5 touch-pan-y ${selectedPhotoIds.includes(photo.id)?'ring-4 ring-blue-400':''}`}
                onPointerDown={() => beginPress(photo.id)} onPointerUp={cancelPress} onPointerMove={cancelPress} onPointerLeave={cancelPress} onPointerCancel={cancelPress}
                onClick={() => { if (pressedLong.current) { pressedLong.current=false; return; } if (multiSelectMode) setSelectedPhotoIds(ids=>ids.includes(photo.id)?ids.filter(id=>id!==photo.id):[...ids,photo.id]); else { setViewPhoto(photo); setPhotoZoom(1); advanceQuest(`gallery-photo-${i}`); } }}>
                {image(photo)}
                {storage.metadata[photo.id]?.favorite && <Heart size={16} className="absolute bottom-2 left-2 fill-white drop-shadow text-white" />}
                {multiSelectMode && <span className={`absolute top-2 right-2 rounded-full border w-6 h-6 flex items-center justify-center ${selectedPhotoIds.includes(photo.id)?'bg-blue-500':'bg-black/40'}`}>{selectedPhotoIds.includes(photo.id)&&<Check size={16}/>}</span>}
              </button>
            </ActionTarget>)}
          </div>
          {!shown.length && <div className="py-12 text-center text-gray-400">{tab==='trash'?'휴지통이 비어 있어요.':tab==='favorites'?'사진을 열고 하트를 눌러 보세요.':'항목이 없어요. 카메라에서 사진을 찍어 보세요.'}</div>}
        </>}
      </main>
      <nav aria-label="갤러리 보기" className="flex justify-around bg-[#1c1c1e] p-1 shrink-0">
        {(['photos','albums','favorites','trash'] as const).map(next => <ActionTarget key={next} id={next==='trash'?'gallery-trash-open':`gallery-tab-${next}`} currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance><button className={`p-3 min-h-12 text-sm ${tab===next?'text-blue-300 font-bold':'text-gray-300'}`} onClick={()=>chooseTab(next)}>{{photos:'사진',albums:'앨범',favorites:'즐겨찾기',trash:'휴지통'}[next]}{next==='trash'&&storage.trash.length?` ${storage.trash.length}`:''}</button></ActionTarget>)}
      </nav>
    </>}
    {(deleteConfirm || bulkConfirm) && <div role="dialog" aria-modal="true" aria-label="휴지통 이동 확인" className="absolute inset-0 z-[90] bg-black/60 flex items-center justify-center p-5"><div className="bg-[#2b2b30] p-6 rounded-3xl max-w-sm w-full"><h3 className="text-lg font-bold">휴지통으로 이동할까요?</h3><p className="text-sm text-gray-300 mt-2 mb-5">삭제한 사진은 휴지통에서 다시 복원할 수 있어요.</p><div className="flex justify-end gap-3"><button className="p-3" onClick={()=>{setDeleteConfirm(false);setBulkConfirm(false);}}>취소</button>{action('gallery-delete-confirm',()=>trashPhotos(bulkConfirm?selectedPhotoIds:viewPhoto?[viewPhoto.id]:[]),<span className="text-red-300 font-bold">이동</span>)}</div></div></div>}
    {sheet && viewPhoto && <div role="dialog" aria-modal="true" aria-label={{edit:'사진 편집',share:'안전한 공유',more:'사진 정보',album:'앨범에 이동'}[sheet]} className="absolute inset-0 bg-black/70 z-[85] flex items-end justify-center" onClick={()=>setSheet(null)}>
      <div className="bg-[#29292e] rounded-t-3xl p-5 w-full max-w-2xl max-h-[90%] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3"><h3 className="text-xl font-bold">{{edit:'사진 편집',share:'공유하기',more:'상세 정보',album:'앨범에 이동'}[sheet]}</h3><button aria-label="닫기" className={buttonClass} onClick={()=>setSheet(null)}><X/></button></div>
        {sheet==='edit'&&<><div className="w-40 h-40 mx-auto rounded-lg overflow-hidden">{image(viewPhoto,true)}</div><div className="flex justify-center gap-5 my-4"><button className={buttonClass} onClick={()=>setRotation(r=>(r+90)%360)}><RotateCw/><span>회전</span></button><button aria-pressed={cropped} className={`${buttonClass} ${cropped?'text-blue-300':''}`} onClick={()=>setCropped(c=>!c)}><Crop/><span>가운데 자르기</span></button><button className={buttonClass} onClick={()=>{setRotation(0);setCropped(false);}}><Undo2/><span>원본</span></button></div>{action('gallery-edit-save',()=>{if(rotation===(meta.rotation||0)&&cropped===!!meta.cropped){setNotice('사진을 회전하거나 잘라 본 뒤 저장해 주세요.');return;}patchMeta(viewPhoto.id,{rotation,cropped});setSheet(null);setNotice('편집한 사진을 저장했어요. 원본 버튼으로 되돌릴 수 있어요.');advanceQuest('gallery-edit-save');},<span className="text-blue-300 font-bold">저장</span>)}</>}
        {sheet==='share'&&<><p className="text-sm text-gray-300 mb-4">보내기 전에 사진 속 사람의 동의와 이름·주소 같은 개인정보를 확인해요.</p><label className="flex gap-3 items-center py-3"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="w-5 h-5"/>사진 속 사람에게 공유해도 되는지 확인했어요.</label><label className="flex gap-3 items-center py-3"><input type="checkbox" checked={privacy} onChange={e=>setPrivacy(e.target.checked)} className="w-5 h-5"/>개인정보가 보이지 않는지 확인했어요.</label><ActionTarget id="gallery-share-safe" currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance><button disabled={!consent||!privacy} className="mt-4 w-full rounded-2xl py-3 bg-blue-500 disabled:opacity-40 font-bold" onClick={()=>{if(!consent||!privacy)return;setSheet(null);setNotice('연습 교실에 사진 공유를 완료했어요. 실제 파일은 전송되지 않아요.');advanceQuest('gallery-share-safe');}}>연습 교실에 공유</button></ActionTarget><p className="text-xs text-gray-400 mt-3">학습용 공유 연습 · 실제 계정이나 다른 기기에 전송되지 않아요.</p></>}
        {sheet==='more'&&<dl className="grid grid-cols-[auto_1fr] gap-3 text-sm"><dt className="text-gray-400">파일 이름</dt><dd className="break-all">{photoName(viewPhoto)}</dd><dt className="text-gray-400">보관 위치</dt><dd>{isTrashPhoto?'휴지통':meta.album||'카메라 / 사진'}</dd><dt className="text-gray-400">종류</dt><dd>학습용 이미지</dd></dl>}
        {sheet==='album'&&<><div className="flex gap-2 mb-4"><input aria-label="새 앨범 이름" className="min-w-0 flex-1 rounded-xl bg-white/10 px-3" value={newAlbum} onChange={e=>setNewAlbum(e.target.value)} maxLength={30} placeholder="새 앨범 이름"/>{action('gallery-album-create',makeAlbum,<span>만들기</span>)}</div>{!storage.albums.length&&<p className="text-sm text-gray-400">앨범을 먼저 만들어 주세요.</p>}{storage.albums.map(name=><ActionTarget key={name} id="gallery-album-move" currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance><button className="p-4 w-full text-left border-b border-white/10 flex gap-3" onClick={()=>{patchMeta(viewPhoto.id,{album:name});setSheet(null);setNotice(`‘${name}’ 앨범에 사진을 옮겼어요.`);advanceQuest('gallery-album-move');}}><FolderPlus size={20}/>{name}</button></ActionTarget>)}</>}
      </div>
    </div>}
  </div>;
};
export default GalleryApp;
