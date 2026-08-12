import React from 'react';
import { Sun, Moon, Grid, ChevronUp, ChevronLeft, Minus, X, Check, GripHorizontal, RefreshCcw } from 'lucide-react';
import { QUESTS } from '@/data/quests';

export interface MissionCenterProps {
  dragRef: React.MutableRefObject<any>;
  pos: { x: number; y: number };
  onDragStart: (e: any) => void;
  themeColor: string;
  darkMode: boolean;
  setDarkMode: (v: any) => void;
  missionListOpen: boolean;
  setMissionListOpen: (v: any) => void;
  isCompact: boolean;
  setIsCompact: (v: any) => void;
  setShowExpMenu: (v: any) => void;
  exp: number;
  questIdx: number;
  completedQuests: number[];
  gotoQuest: (idx: number) => void;
  resetProgress: () => void;
}

export default function MissionCenter({
  dragRef, pos, onDragStart, themeColor, darkMode, setDarkMode,
  missionListOpen, setMissionListOpen, isCompact, setIsCompact, setShowExpMenu,
  exp, questIdx, completedQuests, gotoQuest, resetProgress,
}: MissionCenterProps) {
  return (
    /* 위치(top/left)는 이 래퍼가 담당하고, 드래그 중 transform 은 ref 로만 조작한다 */
    <div ref={dragRef} className="fixed md:absolute z-[300]" style={{ top: pos.y, left: pos.x }}>
      <div
        className="bg-white rounded-2xl md:rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border w-[calc(100vw-16px)] max-w-[380px] overflow-hidden transition-all duration-300"
        style={{ borderColor: `${themeColor}55` }}
      >
          <div className="text-white p-3 md:p-4 flex justify-between items-center cursor-move" style={{ background: themeColor }} onMouseDown={onDragStart} onTouchStart={onDragStart}>
            <div className="flex items-center gap-2 font-bold text-base md:text-lg"><GripHorizontal size={20}/> 미션 센터</div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); setDarkMode(d => !d); }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition-colors"
                title={darkMode ? '라이트 모드' : '다크 모드'}
              >
                {darkMode ? <Sun size={16}/> : <Moon size={16}/>}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setMissionListOpen(o => !o); }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className={`p-1.5 rounded-lg transition-colors ${missionListOpen ? 'bg-white/30' : 'hover:bg-white/20 active:bg-white/30'}`}
                title="미션 목록"
              >
                <Grid size={16}/>
              </button>
              <button
                onClick={() => setIsCompact(c => !c)}
                className="p-1.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition-colors"
                title={isCompact ? '확대' : '축소'}
              >
                {isCompact ? <ChevronUp size={16}/> : <Minus size={16}/>}
              </button>
              <button
                onClick={() => setShowExpMenu(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition-colors"
                title="닫기"
              >
                <X size={18}/>
              </button>
            </div>
          </div>
          {!isCompact ? (
            <div className="p-3 md:p-5" style={{ background: `${themeColor}0d` }}>
              {/* 레벨 + EXP */}
              <div className="flex justify-between items-end mb-2">
                <span className="text-base md:text-xl font-bold text-gray-800">레벨 {Math.floor(exp / 100) + 1}</span>
                <span className="text-sm md:text-lg font-bold" style={{ color: themeColor }}>{exp} EXP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 md:h-3 mb-3 shadow-inner overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${(exp % 100)}%`, background: `linear-gradient(90deg, ${themeColor}, ${themeColor}cc)` }}></div>
              </div>

              {/* 전체 미션 진행률 (체크포인트) */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-gray-600">전체 진행률</span>
                  <span className="text-[11px] font-bold" style={{ color: themeColor }}>
                    {completedQuests.length}/{QUESTS.length} · {Math.round((completedQuests.length / QUESTS.length) * 100)}%
                  </span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-2 shadow-inner overflow-hidden">
                  <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-500" style={{ width: `${(completedQuests.length / QUESTS.length) * 100}%`, background: `linear-gradient(90deg, #10b981, ${themeColor})` }}></div>
                </div>
                {/* 체크포인트 점 (10단계) */}
                <div className="flex justify-between mt-1.5 px-0.5">
                  {Array.from({ length: 10 }, (_, i) => {
                    const checkpoint = Math.round(((i + 1) / 10) * QUESTS.length);
                    const reached = completedQuests.length >= checkpoint;
                    return (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${reached ? 'scale-125' : ''}`}
                        style={{ background: reached ? themeColor : '#d1d5db' }}
                        title={`${checkpoint}번째 미션`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-2xl border shadow-sm relative min-h-[90px] flex flex-col justify-center" style={{ borderColor: `${themeColor}33` }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs md:text-sm font-bold" style={{ color: themeColor }}>현재 임무 {questIdx + 1}/{QUESTS.length}</div>
                  {completedQuests.includes(questIdx) && (
                    <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1 animate-star-pop">⭐ 완료</div>
                  )}
                </div>
                <div className="text-gray-800 font-bold text-sm md:text-[17px] leading-relaxed break-keep">
                  {QUESTS[questIdx]?.text || "모든 미션을 완료했습니다! 🎉"}
                </div>
              </div>
              {/* Mission navigation controls */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => gotoQuest(questIdx - 1)}
                  disabled={questIdx === 0}
                  className="flex-1 py-2 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  <ChevronLeft size={16}/> 이전
                </button>
                <button
                  onClick={() => gotoQuest(questIdx + 1)}
                  disabled={!completedQuests.includes(questIdx) || questIdx >= QUESTS.length - 1}
                  className="flex-1 py-2 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  다음 <ChevronLeft size={16} className="rotate-180"/>
                </button>
                <button
                  onClick={() => { if (confirm('모든 진행도를 초기화하고 미션을 처음부터 다시 시작합니다. 계속할까요?')) resetProgress(); }}
                  className="px-3 py-2 rounded-xl text-sm font-bold text-white active:scale-95 transition-all flex items-center gap-1"
                  style={{ background: '#ef4444' }}
                  title="처음부터 다시"
                >
                  <RefreshCcw size={14}/> 재시작
                </button>
              </div>
              <div className="text-[10px] text-gray-500 mt-2 text-center">
                ◀▶ 로 완료한 미션을 다시 연습할 수 있어요
              </div>
            </div>

          ) : (
            <div className="p-3 md:p-4" style={{ background: `${themeColor}0d` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md" style={{ background: themeColor }}>
                    L{Math.floor(exp / 100) + 1}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">{exp} EXP</div>
                    <div className="text-xs text-gray-500">{questIdx + 1}/{QUESTS.length} 미션</div>
                  </div>
                </div>
                {completedQuests.includes(questIdx) && (
                  <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1"><Check size={10}/> 완료</div>
                )}
              </div>
              <div className="mt-2 text-sm font-bold text-gray-800 line-clamp-2 leading-snug">
                {QUESTS[questIdx]?.text || "모든 미션을 완료했습니다! 🎉"}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
