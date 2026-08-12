import React from 'react';
import { Grid, ChevronUp, Minus, X, Check, Lock } from 'lucide-react';
import { QUESTS } from '@/data/quests';

export interface MissionListOverlayProps {
  dragRef: React.MutableRefObject<any>;
  pos: { x: number; y: number };
  onDragStart: (e: any) => void;
  themeColor: string;
  missionListCompact: boolean;
  setMissionListCompact: (v: any) => void;
  setMissionListOpen: (v: any) => void;
  questIdx: number;
  completedQuests: number[];
  gotoQuest: (idx: number) => void;
}

export default function MissionListOverlay({
  dragRef, pos, onDragStart, themeColor,
  missionListCompact, setMissionListCompact, setMissionListOpen,
  questIdx, completedQuests, gotoQuest,
}: MissionListOverlayProps) {
  return (
    /* 위치(top/left)는 래퍼가 담당, 드래그 transform 은 ref 로만 조작 */
    <div ref={dragRef} className="fixed md:absolute z-[305]" style={{ top: pos.y, left: pos.x }}>
      <div
        className="bg-white rounded-2xl md:rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border overflow-hidden transition-all duration-300 animate-[fadeIn_0.2s_ease-out]"
        style={{
          width: missionListCompact ? 280 : 'calc(100vw - 16px)',
          maxWidth: missionListCompact ? 280 : 420,
          borderColor: `${themeColor}55`,
        }}
      >
          <div
            className="text-white p-3 md:p-4 flex justify-between items-center cursor-move"
            style={{ background: themeColor }}
            onMouseDown={handleDragStartList}
            onTouchStart={handleDragStartList}
          >
            <div className="flex items-center gap-2 font-bold text-base md:text-lg">
              <Grid size={18}/> 미션 목록
              <span className="text-xs font-normal opacity-80">({completedQuests.length}/{QUESTS.length})</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); setMissionListCompact(c => !c); }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition-colors"
                title={missionListCompact ? '확대' : '축소'}
              >
                {missionListCompact ? <ChevronUp size={16}/> : <Minus size={16}/>}
              </button>
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
          {!missionListCompact ? (
            <div className="p-3 md:p-4 max-h-[60vh] overflow-y-auto" style={{ background: `${themeColor}08` }}>
              {/* 카테고리 */}
              {[
                { title: '🔓 기본 조작', range: [0, 7] },
                { title: '⚙️ 설정 · 디스플레이', range: [7, 13] },
                { title: '📸 카메라 · 갤러리', range: [13, 23] },
                { title: '🛍 앱 마켓', range: [23, 30] },
                { title: '🎛 퀵패널 · 블루투스', range: [30, 40] },
                { title: '📝 노트 · 글자크기', range: [40, 48] },
                { title: '🔔 알림 · 권한', range: [48, 56] },
                { title: '👤 계정 · 업데이트', range: [56, 75] },
                { title: '🧮 계산기 · 갤러리', range: [75, 88] },
                { title: '🌐 인터넷 · 검색', range: [88, 96] },
                { title: '🎉 마무리', range: [96, 97] },
              ].map((cat) => (
                <div key={cat.title} className="mb-3">
                  <div className="text-xs font-bold text-gray-700 mb-1.5 px-1">{cat.title}</div>
                  <div className="space-y-1">
                    {QUESTS.slice(cat.range[0], cat.range[1]).map((q, i) => {
                      const idx = cat.range[0] + i;
                      const isDone = completedQuests.includes(idx);
                      const isCurrent = idx === questIdx;
                      const isLocked = idx > questIdx && !completedQuests.includes(idx);
                      return (
                        <button
                          key={idx}
                          onClick={() => !isLocked && gotoQuest(idx)}
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
                              {q.text}
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
