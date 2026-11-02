import React from 'react';
import { Grid, ChevronUp, Minus, X, Check, Lock } from 'lucide-react';
import { CHAPTERS, QUESTS } from '@/data/quests';
import { canVisitQuest } from '@/hooks/useQuestEngine';
import { formatLessonText } from './lessonText';
import type { Upd } from '@/components/device/HomeScreen';

export interface MissionListOverlayProps {
  isPhone?: boolean;
  dragRef: React.MutableRefObject<any>;
  pos: { x: number; y: number };
  onDragStart: (e: any) => void;
  themeColor: string;
  missionListCompact: boolean;
  setMissionListCompact: Upd<boolean>;
  setMissionListOpen: Upd<boolean>;
  questIdx: number;
  completedQuests: number[];
  gotoQuest: (idx: number) => void;
}

export default function MissionListOverlay({
  isPhone = false,
  dragRef, pos, onDragStart, themeColor,
  missionListCompact, setMissionListCompact, setMissionListOpen,
  questIdx, completedQuests, gotoQuest,
}: MissionListOverlayProps) {
  return (
    /* 위치(top/left)는 래퍼가 담당, 드래그 transform 은 ref 로만 조작 */
    <div ref={dragRef} className={isPhone ? 'fixed inset-0 z-[405] flex items-end justify-center bg-slate-950/50 p-2 pb-[max(8px,env(safe-area-inset-bottom))]' : 'fixed md:absolute z-[305]'} role="dialog" aria-modal={isPhone ? true : undefined} aria-label="학습 과정 전체 목록" style={isPhone ? { transform: 'none' } : { top: pos.y, left: pos.x }} onClick={isPhone ? event => { if (event.target === event.currentTarget) setMissionListOpen(false); } : undefined}>
      <div
        className={`bg-white rounded-2xl md:rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border overflow-hidden transition-all duration-300 animate-[fadeIn_0.2s_ease-out] ${isPhone ? 'flex flex-col min-h-0 max-h-[84dvh]' : ''}`}
        style={{
          width: isPhone ? '100%' : missionListCompact ? 280 : 'calc(100vw - 16px)',
          maxWidth: isPhone ? 440 : missionListCompact ? 280 : 420,
          borderColor: `${themeColor}55`,
        }}
      >
          <div
            className={`text-white p-3 md:p-4 flex justify-between items-center shrink-0 ${isPhone ? '' : 'cursor-move'}`}
            style={{ background: themeColor }}
            onMouseDown={isPhone ? undefined : onDragStart}
            onTouchStart={isPhone ? undefined : onDragStart}
          >
            <div className="flex items-center gap-2 font-bold text-base md:text-lg">
              <Grid size={18}/> 미션 목록
              <span className="text-xs font-normal opacity-80">({completedQuests.length}/{QUESTS.length})</span>
            </div>
            <div className="flex items-center gap-1">
              {!isPhone && <button
                onClick={(e) => { e.stopPropagation(); setMissionListCompact(c => !c); }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition-colors"
                title={missionListCompact ? '확대' : '축소'}
              >
                {missionListCompact ? <ChevronUp size={16}/> : <Minus size={16}/>}
              </button>}
              <button
                onClick={(e) => { e.stopPropagation(); setMissionListOpen(false); }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition-colors"
                title="닫기"
              >
                <X size={18}/>
              </button>
            </div>
          </div>
          {isPhone || !missionListCompact ? (
            <div className={`p-3 md:p-4 overflow-y-auto overscroll-contain ${isPhone ? 'min-h-0 flex-1' : 'max-h-[60vh]'}`} style={{ background: `${themeColor}08` }}>
              {/* 카테고리 */}
              {CHAPTERS.map((cat) => (
                <div key={cat.title} className="mb-3">
                  <div className="text-xs font-bold text-gray-700 mb-1.5 px-1 flex justify-between gap-2"><span>{cat.title}</span><span>{QUESTS.filter((q, idx) => q.chapter === cat.id && completedQuests.includes(idx)).length}/{QUESTS.filter(q => q.chapter === cat.id).length}</span></div>
                  <div className="space-y-1">
                    {QUESTS.map((q, idx) => ({ q, idx })).filter(({q}) => q.chapter === cat.id).map(({q, idx}) => {
                      const isDone = completedQuests.includes(idx);
                      const isCurrent = idx === questIdx;
                      const isLocked = !canVisitQuest(idx, completedQuests);
                      return (
                        <button
                          key={idx}
                          onClick={() => { if (!isLocked) { gotoQuest(idx); if (isPhone) setMissionListOpen(false); } }}
                          disabled={isLocked}
                          className={`w-full text-left p-2 rounded-xl flex items-start gap-2 transition-all ${
                            isCurrent
                              ? 'bg-white shadow-md ring-2'
                              : isDone
                                ? 'bg-green-50 hover:bg-green-100 active:scale-[0.98]'
                                : isLocked
                                  ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                                  : 'bg-white hover:bg-gray-50 active:scale-[0.98]'
                          }`}
                          style={isCurrent ? { boxShadow: `0 0 0 2px ${themeColor}` } : {}}
                        >
                          <div
                            className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white`}
                            style={{ background: isDone ? '#10b981' : isCurrent ? themeColor : '#9ca3af' }}
                          >
                            {isDone ? <Check size={14}/> : isLocked ? <Lock size={12}/> : idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-[12px] leading-snug ${isDone ? 'text-gray-600 line-through' : 'text-gray-800 font-medium'}`}>
                              {formatLessonText(q.text, isPhone)}
                            </div>
                            <div className="text-[10px] text-gray-500 mt-0.5">+{q.exp} EXP</div>
                          </div>
                          {isCurrent && <div className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white shrink-0" style={{ background: themeColor }}>지금</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3" style={{ background: `${themeColor}08` }}>
              <div className="text-xs text-gray-600 mb-2">완료한 미션</div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(completedQuests.length / QUESTS.length) * 100}%`, background: themeColor }}></div>
              </div>
              <div className="text-center text-xs font-bold mt-2" style={{ color: themeColor }}>
                {completedQuests.length} / {QUESTS.length}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
