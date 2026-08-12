import React from 'react';
import { Search, ChevronLeft, Check } from 'lucide-react';
import { ActionTarget } from './shared';
import { PLAYSTORE_APPS, TARGET_SEQUENCE } from '@/data/appCatalog';

export type AppUpdateStatus = 'pending' | 'downloading' | 'installing' | 'done';

export interface PlayStoreAppProps {
  currentTargetId: string | null;
  advanceQuest: (id: string) => void;
  searchText: string;
  setSearchText: (v: string) => void;
  isSearched: boolean;
  setIsSearched: (v: boolean) => void;
  keyboardOpen: boolean;
  setKeyboardOpen: (v: boolean) => void;
  keyboardShift: boolean;
  setKeyboardShift: (v: boolean) => void;
  typingIndex: number;
  setTypingIndex: React.Dispatch<React.SetStateAction<number>>;
  googleAccount: string | null;
  playStoreProfileOpen: boolean;
  setPlayStoreProfileOpen: (v: boolean) => void;
  playStoreView: 'home' | 'manage';
  setPlayStoreView: (v: 'home' | 'manage') => void;
  appsUpdated: boolean;
  setAppsUpdated: (v: boolean) => void;
  updatingAll: boolean;
  setUpdatingAll: (v: boolean) => void;
  updateProgress: number;
  setUpdateProgress: (v: number) => void;
  appUpdateStatus: Record<string, AppUpdateStatus>;
  setAppUpdateStatus: React.Dispatch<React.SetStateAction<Record<string, AppUpdateStatus>>>;
  appUpdateProgress: Record<string, number>;
  setAppUpdateProgress: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  installedApps: string[];
  setInstalledApps: React.Dispatch<React.SetStateAction<string[]>>;
  mathInstallProgress: number | null;
  setMathInstallProgress: React.Dispatch<React.SetStateAction<number | null>>;
}

const PlayStoreApp = (props: PlayStoreAppProps) => {
  const {
    currentTargetId, advanceQuest, searchText, setSearchText, isSearched, setIsSearched,
    keyboardOpen, setKeyboardOpen, keyboardShift, setKeyboardShift, typingIndex, setTypingIndex,
    googleAccount, playStoreProfileOpen, setPlayStoreProfileOpen, playStoreView, setPlayStoreView,
    appsUpdated, setAppsUpdated, updatingAll, setUpdatingAll, updateProgress, setUpdateProgress,
    appUpdateStatus, setAppUpdateStatus, appUpdateProgress, setAppUpdateProgress,
    installedApps, setInstalledApps, mathInstallProgress, setMathInstallProgress,
  } = props;

  const renderVirtualKeyboard = () => {
    if (!keyboardOpen) return null;
    const row1_base = ['ㅂ','ㅈ','ㄷ','ㄱ','ㅅ','ㅛ','ㅕ','ㅑ','ㅐ','ㅔ'];
    const row1_shift = ['ㅃ','ㅉ','ㄸ','ㄲ','ㅆ','ㅛ','ㅕ','ㅑ','ㅒ','ㅖ'];
    const row2 = ['ㅁ','ㄴ','ㅇ','ㄹ','ㅎ','ㅗ','ㅓ','ㅏ','ㅣ'];
    const row3 = ['ㅋ','ㅌ','ㅊ','ㅍ','ㅠ','ㅜ','ㅡ'];
    const row1 = keyboardShift ? row1_shift : row1_base;
    const targetKey = TARGET_SEQUENCE[typingIndex]?.key;

    const handleKeyClick = (key) => {
      if (key === 'Shift') {
        setKeyboardShift(!keyboardShift);
        if (targetKey === 'Shift') { setSearchText(TARGET_SEQUENCE[typingIndex].display); setTypingIndex(prev => prev + 1); }
        return;
      }
      if (key === targetKey) {
        setSearchText(TARGET_SEQUENCE[typingIndex].display);
        setTypingIndex(prev => prev + 1);
        if (['ㄸ','ㅃ','ㅉ','ㄲ','ㅆ','ㅒ','ㅖ'].includes(key)) setKeyboardShift(false);
        if (typingIndex + 1 === TARGET_SEQUENCE.length) advanceQuest('playstore-search-input');
      }
    };
    const getKeyClass = (key) => {
      const base = "flex items-center justify-center rounded-lg text-xl font-medium cursor-pointer transition-all active:scale-90 ";
      const isTarget = key === targetKey;
      return base + (isTarget ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.8)] ring-2 ring-blue-300 animate-pulse" : "bg-[#3a3a3c] hover:bg-[#4a4a4c] text-white");
    };

    return (
      <div className="absolute bottom-0 w-full bg-[#1c1c1e] z-50 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-[slideUp_0.3s_ease-out] select-none pb-4 border-t border-gray-800">
        <div className="p-2 pt-4 flex flex-col gap-2 max-w-5xl mx-auto">
          <div className="flex justify-center gap-1.5 px-1">
            {row1.map((k, i) => (<div key={i} className={`flex-1 h-14 ${getKeyClass(k)}`} onClick={(e) => { e.stopPropagation(); handleKeyClick(k); }}>{k}</div>))}
          </div>
          <div className="flex justify-center gap-1.5 px-6">
            {row2.map((k, i) => (<div key={i} className={`flex-1 h-14 ${getKeyClass(k)}`} onClick={(e) => { e.stopPropagation(); handleKeyClick(k); }}>{k}</div>))}
            <div className="flex-[1.5] h-14 flex items-center justify-center bg-[#2c2c2e] hover:bg-[#3a3a3c] rounded-lg text-lg cursor-pointer active:scale-95 transition-all text-gray-300">⌫</div>
          </div>
          <div className="flex justify-center gap-1.5 px-2">
            <div className={`flex-[1.5] h-14 flex items-center justify-center rounded-lg text-xl cursor-pointer transition-all active:scale-95 ${targetKey === 'Shift' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.8)] ring-2 ring-blue-300 animate-pulse' : keyboardShift ? 'bg-white text-black' : 'bg-[#2c2c2e] hover:bg-[#3a3a3c] text-gray-300'}`} onClick={(e) => { e.stopPropagation(); handleKeyClick('Shift'); }}>⇧</div>
            {row3.map((k, i) => (<div key={i} className={`flex-1 h-14 ${getKeyClass(k)}`} onClick={(e) => { e.stopPropagation(); handleKeyClick(k); }}>{k}</div>))}
            <div className="flex-[0.8] h-14 flex items-center justify-center bg-[#3a3a3c] rounded-lg text-lg cursor-pointer active:scale-95 transition-all text-gray-300">,</div>
            <div className="flex-[0.8] h-14 flex items-center justify-center bg-[#3a3a3c] rounded-lg text-lg cursor-pointer active:scale-95 transition-all text-gray-300">.</div>
            <div className="flex-[0.8] h-14 flex items-center justify-center bg-[#3a3a3c] rounded-lg text-lg cursor-pointer active:scale-95 transition-all text-gray-300">?</div>
            <div className="flex-[1.5] h-14 flex items-center justify-center bg-[#2c2c2e] hover:bg-[#3a3a3c] rounded-lg text-xl cursor-pointer active:scale-95 transition-all text-gray-300">↵</div>
          </div>
          <div className="flex justify-center gap-1.5 px-1 mt-1">
            <div className="w-16 h-14 flex items-center justify-center bg-[#2c2c2e] hover:bg-[#3a3a3c] rounded-lg text-sm cursor-pointer font-medium text-gray-300 active:scale-95 transition-all">!#1</div>
            <div className="w-16 h-14 flex items-center justify-center bg-[#2c2c2e] hover:bg-[#3a3a3c] rounded-lg text-sm cursor-pointer font-medium text-gray-300 active:scale-95 transition-all">한자</div>
            <div className="flex-1 h-14 flex items-center justify-center bg-[#3a3a3c] hover:bg-[#4a4a4c] rounded-lg text-base text-gray-300 cursor-pointer active:scale-95 transition-all">한국어</div>
            <div className="w-14 h-14 flex items-center justify-center bg-[#2c2c2e] hover:bg-[#3a3a3c] rounded-lg text-sm cursor-pointer font-bold text-gray-300 active:scale-95 transition-all">한/영</div>
            <ActionTarget
              id="playstore-search-submit" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={(e) => { e.stopPropagation(); if(typingIndex === TARGET_SEQUENCE.length) { setIsSearched(true); setKeyboardOpen(false); } }}
            >
              <div className={`w-24 h-14 flex items-center justify-center rounded-lg text-lg font-bold shadow-lg cursor-pointer transition-all active:scale-95 ${typingIndex === TARGET_SEQUENCE.length && currentTargetId === 'playstore-search-submit' ? 'bg-blue-600 text-white ring-4 ring-yellow-400 animate-pulse' : 'bg-blue-600 text-white'}`}>검색</div>
            </ActionTarget>
          </div>
        </div>
      </div>
    );
  };

    const PENDING_UPDATES = [
      { id: 'youtube', name: '튜브', dev: '탐험대', color: '#FF0000', label: '▶', size: '128 MB' },
      { id: 'kakao', name: '톡톡', dev: '톡톡', color: '#FAE100', text: '#3A1D1D', label: '💬', size: '96 MB' },
      { id: 'chrome', name: '웹브라우저', dev: '탐험대', color: '#1A73E8', label: 'C', size: '210 MB' },
    ];
    return (
    <div className="flex-1 bg-white flex flex-col pt-8 text-[#202124] overflow-hidden min-h-0 relative animate-[fadeIn_0.3s_ease-out]">
      <div className="p-4 px-8 border-b border-gray-200 flex gap-4 items-center shadow-sm relative z-10 bg-white shrink-0">
        <Search size={24} className="text-gray-500" />
        <ActionTarget id="playstore-search-bar" currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={() => setKeyboardOpen(true)} className="flex-1">
          <input type="text" placeholder="앱 및 게임 검색 (터치 후 가상 키보드로 타이핑)" className="w-full outline-none text-xl bg-transparent pointer-events-none" value={searchText} readOnly />
        </ActionTarget>
        <ActionTarget
          id="playstore-avatar" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
          onClick={() => setPlayStoreProfileOpen(true)}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer active:scale-90 transition shadow-md">
            {googleAccount ? googleAccount[0].toUpperCase() : 'W'}
          </div>
        </ActionTarget>
      </div>

      {playStoreProfileOpen && (
        <div className="absolute inset-0 z-[60] bg-black/40" onClick={() => setPlayStoreProfileOpen(false)}>
          <div className="absolute right-3 top-16 bg-white rounded-2xl shadow-2xl w-80 overflow-hidden animate-[fadeIn_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">{googleAccount ? googleAccount[0].toUpperCase() : 'W'}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{googleAccount || '게스트'}</div>
                <div className="text-xs text-gray-500 truncate">{googleAccount || '로그인되지 않음'}</div>
              </div>
            </div>
            <ActionTarget
              id="playstore-manage" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={() => { setPlayStoreView('manage'); setPlayStoreProfileOpen(false); }}
              className="p-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer flex items-center gap-3 transition"
            >
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">📲</div>
              <div className="flex-1">
                <div className="font-medium text-sm">앱 및 기기 관리</div>
                <div className="text-xs text-gray-500">업데이트 {PENDING_UPDATES.length}개 사용 가능</div>
              </div>
            </ActionTarget>
            {['알림 및 설정', '결제 및 정기 결제', '도움말 및 의견'].map(s => (
              <div key={s} className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3 text-sm text-gray-700">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">⚙</div>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 p-10 bg-white overflow-y-auto min-h-0 relative">
        {playStoreView === 'manage' ? (
          <div className="max-w-3xl mx-auto animate-[fadeIn_0.25s_ease-out]">
            <button onClick={() => setPlayStoreView('home')} className="flex items-center gap-2 text-gray-600 mb-4 active:scale-95"><ChevronLeft size={20}/> 뒤로</button>
            <h2 className="text-3xl font-bold mb-2">앱 및 기기 관리</h2>
            <div className="text-sm text-gray-500 mb-6">최신 상태 유지를 위해 모든 앱을 업데이트하세요.</div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl">⬇</div>
              <div className="flex-1">
                <div className="font-bold text-lg">
                  {appsUpdated ? '모든 앱이 최신 상태입니다' : `업데이트 사용 가능 (${PENDING_UPDATES.length}개)`}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {updatingAll ? `업데이트 중… ${updateProgress}%` : appsUpdated ? '마지막 확인: 방금 전' : '총 434 MB · Wi-Fi 권장'}
                </div>
                {updatingAll && (
                  <div className="w-full h-1.5 bg-blue-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all" style={{ width: `${updateProgress}%` }}/>
                  </div>
                )}
              </div>
              {!appsUpdated && !updatingAll && (
                <ActionTarget
                  id="playstore-update-all" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                  onClick={() => {
                    setUpdatingAll(true); setUpdateProgress(0);
                    // 초기 상태: 모두 pending
                    const initStatus: Record<string, 'pending'|'downloading'|'installing'|'done'> = {};
                    const initProg: Record<string, number> = {};
                    PENDING_UPDATES.forEach(a => { initStatus[a.id] = 'pending'; initProg[a.id] = 0; });
                    setAppUpdateStatus(initStatus);
                    setAppUpdateProgress(initProg);

                    // 앱별 순차 업데이트
                    let appIdx = 0;
                    const updateNextApp = () => {
                      if (appIdx >= PENDING_UPDATES.length) {
                        setUpdateProgress(100);
                        setTimeout(() => { setUpdatingAll(false); setAppsUpdated(true); }, 500);
                        return;
                      }
                      const currentApp = PENDING_UPDATES[appIdx];
                      setAppUpdateStatus(s => ({ ...s, [currentApp.id]: 'downloading' }));
                      const iv = setInterval(() => {
                        setAppUpdateProgress(p => {
                          const cur = p[currentApp.id] || 0;
                          const next = Math.min(100, cur + Math.floor(Math.random()*10) + 6);
                          // 전체 진행률 갱신
                          const totalDone = appIdx * 100 + next;
                          setUpdateProgress(Math.floor(totalDone / PENDING_UPDATES.length));
                          if (next >= 100) {
                            clearInterval(iv);
                            setAppUpdateStatus(s => ({ ...s, [currentApp.id]: 'installing' }));
                            setTimeout(() => {
                              setAppUpdateStatus(s => ({ ...s, [currentApp.id]: 'done' }));
                              appIdx++;
                              setTimeout(updateNextApp, 250);
                            }, 500);
                          }
                          return { ...p, [currentApp.id]: next };
                        });
                      }, 180);
                    };
                    setTimeout(updateNextApp, 300);
                  }}
                >
                  <button className="bg-[#01875f] hover:bg-[#01704e] text-white font-bold px-6 py-2.5 rounded-full text-sm active:scale-95 transition shadow">모두 업데이트</button>
                </ActionTarget>
              )}
            </div>

            <div className="text-sm font-bold text-gray-700 mb-3">대기 중인 업데이트</div>
            <div className="space-y-3">
              {PENDING_UPDATES.map(app => {
                const status = appUpdateStatus[app.id] || 'pending';
                const progress = appUpdateProgress[app.id] || 0;
                const isDone = appsUpdated || status === 'done';
                const isDownloading = status === 'downloading';
                const isInstalling = status === 'installing';
                const sizeMB = parseInt(app.size) || 100;
                return (
                  <div key={app.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-md shrink-0" style={{ background: app.color, color: app.text || '#fff' }}>{app.label}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{app.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {isDone ? `${app.dev} · 설치됨` : isDownloading ? `다운로드 중… ${(sizeMB*progress/100).toFixed(1)} MB / ${sizeMB} MB` : isInstalling ? '설치 중…' : `${app.dev} · ${app.size}`}
                      </div>
                      {(isDownloading || isInstalling) && (
                        <div className="w-full h-1 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                          <div className="h-full bg-[#01875f] transition-all duration-200" style={{ width: isInstalling ? '100%' : `${progress}%` }}/>
                        </div>
                      )}
                    </div>
                    {isDone ? (
                      <span className="text-xs text-green-600 font-bold flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-full"><Check size={14}/> 설치됨</span>
                    ) : isDownloading || isInstalling ? (
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-xs font-bold text-[#01875f] tabular-nums">{isInstalling ? '설치 중' : `${progress}%`}</div>
                        <div className="w-4 h-4 border-2 border-[#01875f] border-t-transparent rounded-full animate-spin"/>
                      </div>
                    ) : (
                      <button className="px-4 py-1.5 rounded-full border border-[#01875f] text-[#01875f] font-bold text-sm">업데이트</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : isSearched && searchText === '똑똑수학탐험대' ? (

          <div className="flex gap-8 max-w-3xl mx-auto mt-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="w-40 h-40 bg-yellow-400 rounded-[2.5rem] flex items-center justify-center text-white font-black text-5xl shadow-lg border border-yellow-300">1+2</div>
            <div className="flex-1 flex flex-col justify-center gap-1">
              <h2 className="text-4xl font-bold mb-2">똑똑수학탐험대</h2>
              <p className="text-lg text-green-700 font-medium">교육부</p>
              {installedApps.includes('math') ? (
                <button className="bg-gray-100 text-gray-700 py-3.5 px-12 rounded-full font-bold self-start w-full max-w-[240px] text-lg active:scale-95 transition-transform">열기</button>
              ) : mathInstallProgress !== null ? (
                <div className="w-full max-w-[240px] self-start">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[#01875f]">설치 중... {mathInstallProgress}%</span>
                    <span className="text-xs text-gray-500">{(mathInstallProgress * 0.42).toFixed(1)}MB / 42MB</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#01875f] transition-all duration-200" style={{ width: `${mathInstallProgress}%` }} />
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {mathInstallProgress < 30 ? '다운로드 중...' : mathInstallProgress < 80 ? '파일 압축 해제 중...' : '설치 마무리 중...'}
                  </div>
                </div>
              ) : (
                <ActionTarget id="playstore-install-btn" currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={() => {
                  if (mathInstallProgress !== null) return;
                  setMathInstallProgress(0);
                  const interval = setInterval(() => {
                    setMathInstallProgress(p => {
                      if (p === null) { clearInterval(interval); return null; }
                      const next = p + Math.floor(Math.random() * 8) + 3;
                      if (next >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                          setInstalledApps(prev => prev.includes('math') ? prev : [...prev, 'math']);
                          setMathInstallProgress(null);
                        }, 400);
                        return 100;
                      }
                      return next;
                    });
                  }, 200);
                }}>
                  <button className="bg-[#01875f] hover:bg-[#01704e] text-white py-3.5 px-12 rounded-full font-bold self-start w-full max-w-[240px] transition-all active:scale-95 text-lg shadow-md pointer-events-none">설치</button>
                </ActionTarget>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="text-2xl font-bold mb-4">추천 게임 및 앱</div>
            <div className="text-sm text-gray-500 mb-6">아래 앱을 설치해보세요. 설치 후 홈 화면과 앱 서랍에 추가돼요.</div>
            <div className="space-y-3">
              {PLAYSTORE_APPS.map(app => {
                const installed = installedApps.includes(app.id);
                return (
                  <div key={app.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-md shrink-0" style={{ background: app.color }}>{app.label}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-bold truncate">{app.name}</div>
                      <div className="text-xs text-gray-500 truncate">{app.dev} · 4.{Math.floor(Math.random()*9)+1} ★</div>
                    </div>
                    <button
                      onClick={() => {
                        if (installed) {
                          setInstalledApps(prev => prev.filter(x => x !== app.id));
                        } else {
                          setInstalledApps(prev => [...prev, app.id]);
                        }
                      }}
                      className={`px-6 py-2 rounded-full font-bold text-sm transition-all active:scale-95 shrink-0 ${installed ? 'bg-gray-200 text-gray-700' : 'bg-[#01875f] text-white hover:bg-[#01704e]'}`}
                    >{installed ? '제거' : '설치'}</button>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 text-center text-xs text-gray-400">상단 검색창에서 '똑똑수학탐험대'를 검색할 수도 있어요.</div>
          </div>
        )}

      </div>
      {renderVirtualKeyboard()}
    </div>
    );
};

export default PlayStoreApp;
