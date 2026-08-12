import React from 'react';
import { ChevronLeft, MoreHorizontal, Share2, Edit3, Trash2, Heart, Search, Check } from 'lucide-react';
import { ActionTarget, CuteStudent } from './shared';
import type { PhotoItem } from '@/hooks/useDeviceState';

export interface GalleryAppProps {
  currentTargetId: string | null;
  advanceQuest: (id: string) => void;
  photos: PhotoItem[];
  setPhotos: React.Dispatch<React.SetStateAction<PhotoItem[]>>;
  viewPhoto: PhotoItem | null;
  setViewPhoto: (v: PhotoItem | null) => void;
  deleteConfirm: boolean;
  setDeleteConfirm: (v: boolean) => void;
  photoZoom: number;
  setPhotoZoom: React.Dispatch<React.SetStateAction<number>>;
  multiSelectMode: boolean;
  setMultiSelectMode: (v: boolean) => void;
  selectedPhotoIds: number[];
  setSelectedPhotoIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const GalleryApp = (props: GalleryAppProps) => {
  const {
    currentTargetId, advanceQuest, photos, setPhotos, viewPhoto, setViewPhoto,
    deleteConfirm, setDeleteConfirm, photoZoom, setPhotoZoom,
    multiSelectMode, setMultiSelectMode, selectedPhotoIds, setSelectedPhotoIds,
  } = props;
    if (viewPhoto) {
      return (
        <div className="flex-1 bg-black flex flex-col text-white pt-8 overflow-hidden min-h-0 animate-[fadeIn_0.3s_ease-out]">
          <div className="p-4 flex justify-between items-center px-6 shrink-0">
            <ChevronLeft size={32} onClick={() => setViewPhoto(null)} className="cursor-pointer hover:text-gray-300 active:scale-90 transition-transform"/>
            <span className="font-medium text-lg">오늘</span>
            <MoreHorizontal size={28} className="cursor-pointer text-gray-300 active:scale-90 transition-transform"/>
          </div>
          <div className="flex-1 flex items-center justify-center p-8 overflow-hidden min-h-0 relative">
            <div className="w-96 h-96 bg-[#1a1a1a] rounded-3xl flex items-center justify-center relative shadow-2xl overflow-hidden border border-gray-800">
              <div className="w-full h-full transition-transform duration-200" style={{ transform: `scale(${photoZoom})`, transformOrigin: 'center' }}>
                <CuteStudent seed={viewPhoto.seed} />
              </div>
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
            {/* 줌 컨트롤 */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-black/50 rounded-2xl p-2 backdrop-blur-md">
              <ActionTarget id="photo-zoom-in" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                onClick={() => setPhotoZoom(z => Math.min(3, +(z + 0.5).toFixed(2)))}
                tooltipPosition="left" tooltipText="확대하세요"
              >
                <button aria-label="확대" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 transition flex items-center justify-center text-xl text-white font-bold">+</button>
              </ActionTarget>
              <div className="text-[10px] text-white/70 text-center tabular-nums">{Math.round(photoZoom * 100)}%</div>
              <ActionTarget id="photo-zoom-out" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                onClick={() => setPhotoZoom(z => Math.max(1, +(z - 0.5).toFixed(2)))}
                tooltipPosition="left" tooltipText="축소하세요"
              >
                <button aria-label="축소" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 transition flex items-center justify-center text-xl text-white font-bold">−</button>
              </ActionTarget>
            </div>
          </div>

          <div className="h-24 flex justify-around items-center px-4 md:px-12 bg-[#111] pb-4 shrink-0 text-gray-300">
            <button className="flex flex-col items-center gap-1 active:scale-90 transition-transform hover:text-white">
              <Share2 size={24}/>
              <span className="text-[11px]">공유</span>
            </button>
            <button className="flex flex-col items-center gap-1 active:scale-90 transition-transform hover:text-white">
              <Edit3 size={24}/>
              <span className="text-[11px]">편집</span>
            </button>
            <ActionTarget id="gallery-delete" currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={() => setDeleteConfirm(true)}>
              <div className="flex flex-col items-center gap-1 cursor-pointer active:scale-90 transition-transform hover:text-white">
                <Trash2 size={24}/>
                <span className="text-[11px]">삭제</span>
              </div>
            </ActionTarget>
            <button className="flex flex-col items-center gap-1 active:scale-90 transition-transform hover:text-white">
              <Heart size={24}/>
              <span className="text-[11px]">즐겨찾기</span>
            </button>
            <button className="flex flex-col items-center gap-1 active:scale-90 transition-transform hover:text-white">
              <MoreHorizontal size={24}/>
              <span className="text-[11px]">더보기</span>
            </button>
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

export default GalleryApp;
