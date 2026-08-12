import React from 'react';
import { ChevronLeft, Menu, Search, Home, X } from 'lucide-react';
import { ActionTarget } from './shared';
import type { InternetHist, InternetTab } from '@/types/internet';
import { makeInternetTab } from '@/types/internet';

export interface InternetAppProps {
  currentTargetId: string | null;
  advanceQuest: (id: string) => void;
  internetTabs: InternetTab[];
  setInternetTabs: React.Dispatch<React.SetStateAction<InternetTab[]>>;
  internetActiveTabId: number;
  setInternetActiveTabId: (v: number) => void;
  internetUrlPanelOpen: boolean;
  setInternetUrlPanelOpen: (v: boolean) => void;
  internetTabSwitcherOpen: boolean;
  setInternetTabSwitcherOpen: (v: boolean) => void;
  internetBookmarks: { title: string; url: string }[];
  setInternetBookmarks: React.Dispatch<React.SetStateAction<{ title: string; url: string }[]>>;
  internetMenuOpen: boolean;
  setInternetMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  internetKbInput: string;
  setInternetKbInput: React.Dispatch<React.SetStateAction<string>>;
  internetKbShift: boolean;
  setInternetKbShift: React.Dispatch<React.SetStateAction<boolean>>;
}

const InternetApp = (props: InternetAppProps) => {
  const {
    currentTargetId, advanceQuest, internetTabs, setInternetTabs,
    internetActiveTabId, setInternetActiveTabId, internetUrlPanelOpen, setInternetUrlPanelOpen,
    internetTabSwitcherOpen, setInternetTabSwitcherOpen, internetBookmarks, setInternetBookmarks,
    internetMenuOpen, setInternetMenuOpen, internetKbInput, setInternetKbInput,
    internetKbShift, setInternetKbShift,
  } = props;
    const activeTab = internetTabs.find(t => t.id === internetActiveTabId) || internetTabs[0];
    const isBookmarked = activeTab && internetBookmarks.some(b => b.url === activeTab.url);

    const navigateActive = (next: InternetHist) => {
      setInternetTabs(tabs => tabs.map(t => {
        if (t.id !== internetActiveTabId) return t;
        const trimmed = t.history.slice(0, t.historyIndex + 1);
        const newHist = [...trimmed, next];
        return { ...t, ...next, history: newHist, historyIndex: newHist.length - 1 };
      }));
    };

    const goBack = () => {
      setInternetTabs(tabs => tabs.map(t => {
        if (t.id !== internetActiveTabId) return t;
        if (t.historyIndex <= 0) return t;
        const idx = t.historyIndex - 1;
        const h = t.history[idx];
        return { ...t, ...h, historyIndex: idx };
      }));
    };

    const canGoBack = (activeTab?.historyIndex ?? 0) > 0;

    const performSearch = (query: string) => {
      navigateActive({ title: `${query} - 검색`, url: `https://search.tamhem.com/?q=${encodeURIComponent(query)}`, view: 'results' });
      setInternetUrlPanelOpen(false);
      setInternetKbInput('');
    };

    const performUrlGo = () => {
      const text = internetKbInput.trim();
      if (!text) return;
      if (text.includes('.') && !text.includes(' ')) {
        const host = text.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
        if (host === 'naver.com' || host === 'www.naver.com') {
          navigateActive({ title: 'NAVER', url: 'www.naver.com', view: 'naver' });
        } else if (host === 'google.com' || host === 'www.google.com') {
          navigateActive({ title: 'Google', url: 'www.google.com', view: 'google' });
        } else {
          const url = text.startsWith('http') ? text : `https://${text}`;
          navigateActive({ title: host, url, view: 'site' });
        }
      } else {
        performSearch(text);
        return;
      }
      setInternetUrlPanelOpen(false);
      setInternetKbInput('');
    };

    const addNewTab = () => {
      const newId = Math.max(0, ...internetTabs.map(t => t.id)) + 1;
      setInternetTabs(tabs => [...tabs, makeInternetTab(newId)]);
      setInternetActiveTabId(newId);
      setInternetTabSwitcherOpen(false);
    };

    const closeTab = (id: number) => {
      setInternetTabs(tabs => {
        const next = tabs.filter(t => t.id !== id);
        if (next.length === 0) {
          setInternetActiveTabId(1);
          return [makeInternetTab(1)];
        }
        if (id === internetActiveTabId) setInternetActiveTabId(next[0].id);
        return next;
      });
    };

    const openBookmark = (b: { title: string; url: string }) => {
      navigateActive({ title: b.title, url: b.url, view: 'site' });
    };

    const isNaverQuery = !!activeTab && /네이버/.test(activeTab.title);
    const SEARCH_RESULTS = isNaverQuery ? [
      { title: 'NAVER - 네이버', url: 'www.naver.com', desc: '대한민국 대표 검색 포털. 뉴스·메일·카페·블로그·지식인·쇼핑·웹툰 등 다양한 서비스를 제공합니다.', naver: true },
      { title: '네이버 - 위키백과', url: 'wiki.tamhem.com › 네이버', desc: '네이버(NAVER)는 1999년에 설립된 대한민국의 인터넷 기업이다. 국내 최대 규모의 포털 사이트를 운영하고 있다…' },
      { title: '네이버 뉴스', url: 'news.naver.com', desc: '실시간 주요 뉴스와 분야별 기사를 한눈에 모아보는 뉴스 포털.' },
      { title: '네이버 지도', url: 'map.naver.com', desc: '길찾기, 대중교통, 거리뷰까지 — 우리 동네부터 전국까지 네이버 지도로 한 번에.' },
    ] : [
      { title: '초등학교 - 위키백과', url: 'wiki.tamhem.com › 초등학교', desc: '초등학교(初等學校)는 만 6세부터 12세까지의 어린이를 대상으로 기초 교육을 실시하는 학교이다. 한국에서는 6년제로 운영된다…' },
      { title: '우리 동네 초등학교 찾기 | 교육부', url: 'school.moe.go.kr', desc: '주소를 입력하면 가까운 초등학교를 찾을 수 있습니다. 학구도와 학교 정보를 한눈에 확인하세요.' },
      { title: '초등학교 입학 준비물 BEST 10', url: 'blog.tamhem.com › 초등입학', desc: '예비 초등학생을 위한 입학 준비물과 학습 준비 팁을 정리했습니다. 책가방, 실내화, 학용품…' },
      { title: '전국 초등학교 목록', url: 'edu.tamhem.com › list', desc: '전국 초등학교 6,200여 개의 위치와 학급 수를 한 번에 확인할 수 있는 페이지입니다.' },
    ];

    return (
      <div className="flex-1 bg-[#f1f3f4] flex flex-col pt-8 overflow-hidden min-h-0 animate-[fadeIn_0.3s_ease-out] relative">
        {/* 상단 주소창 */}
        <div className="shrink-0 bg-white border-b border-gray-200 px-3 py-2 flex items-center gap-2 shadow-sm">
          <ActionTarget id="internet-back" currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={goBack}>
            <button
              disabled={!canGoBack}
              className={`w-9 h-9 rounded-full hover:bg-gray-100 active:scale-90 flex items-center justify-center ${canGoBack ? 'text-gray-700' : 'text-gray-300'}`}
              title="뒤로"
            >
              <ChevronLeft size={22}/>
            </button>
          </ActionTarget>
          <ActionTarget
            id="internet-address-bar" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
            onClick={() => setInternetUrlPanelOpen(true)}
            className="flex-1"
          >
            <div className="w-full h-10 bg-[#f1f3f4] rounded-full flex items-center gap-2 px-4 cursor-text">
              <div className="text-[#5f6368] shrink-0">🔒</div>
              <div className="flex-1 text-[14px] text-gray-700 truncate">
                {activeTab?.url || '검색어 또는 웹 주소 입력'}
              </div>
            </div>
          </ActionTarget>
          <ActionTarget
            id="internet-bookmark-add" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
            onClick={() => {
              if (!activeTab || !activeTab.url) return;
              if (isBookmarked) {
                setInternetBookmarks(bm => bm.filter(b => b.url !== activeTab.url));
              } else {
                setInternetBookmarks(bm => [...bm, { title: activeTab.title, url: activeTab.url }]);
              }
            }}
          >
            <button className={`w-9 h-9 rounded-full hover:bg-gray-100 active:scale-90 flex items-center justify-center text-xl ${isBookmarked ? 'text-yellow-500' : 'text-gray-600'}`} title="즐겨찾기">
              {isBookmarked ? '★' : '☆'}
            </button>
          </ActionTarget>
          <ActionTarget id="internet-menu-open" currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={() => setInternetMenuOpen(o => !o)}>
            <button className="w-9 h-9 rounded-full hover:bg-gray-100 active:scale-90 flex items-center justify-center text-gray-700" title="메뉴">
              <Menu size={20}/>
            </button>
          </ActionTarget>
        </div>

        {/* 메뉴 드롭다운 (즐겨찾기 목록) */}
        {internetMenuOpen && (
          <div className="absolute right-3 top-[88px] z-[80] w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-[fadeIn_0.15s_ease-out]">
            <div className="p-3 border-b border-gray-100 text-xs text-gray-500 flex items-center justify-between">
              <span>★ 즐겨찾기 ({internetBookmarks.length})</span>
              <button onClick={() => setInternetMenuOpen(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            {internetBookmarks.length === 0 ? (
              <div className="p-4 text-sm text-gray-400 text-center">아직 즐겨찾기가 없어요.<br/>주소창 옆 ☆ 를 눌러 추가해 보세요.</div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {internetBookmarks.map((b, i) => {
                  const openTarget = i === 0 ? 'internet-bookmark-open' : `internet-bookmark-open-${i}`;
                  const delTarget = i === 0 ? 'internet-bookmark-delete' : `internet-bookmark-delete-${i}`;
                  return (
                    <div key={i} className="px-3 py-2 hover:bg-gray-50 flex items-center gap-2 group">
                      <ActionTarget id={openTarget} currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={() => openBookmark(b)} className="flex-1 min-w-0">
                        <button className="w-full text-left min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate">★ {b.title}</div>
                          <div className="text-[11px] text-gray-500 truncate">{b.url}</div>
                        </button>
                      </ActionTarget>
                      <ActionTarget id={delTarget} currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                        onClick={(e: any) => { e.stopPropagation?.(); setInternetBookmarks(bm => bm.filter(x => x.url !== b.url)); setInternetMenuOpen(false); }}>
                        <button
                          className="shrink-0 w-8 h-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center opacity-60 group-hover:opacity-100"
                          title="삭제"
                        >
                          🗑
                        </button>
                      </ActionTarget>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto bg-white min-h-0">
          {activeTab?.view === 'results' ? (
            <div className="max-w-3xl mx-auto px-5 py-4 animate-[fadeIn_0.25s_ease-out]">
              <div className="text-xs text-gray-500 mb-3">검색결과 약 1,240,000개 (0.42초)</div>
              <div className="space-y-5">
                {SEARCH_RESULTS.map((r: any, i) => {
                  const inner = (
                    <div className="cursor-pointer group">
                      <div className="text-[12px] text-gray-600 truncate">{r.url}</div>
                      <div className="text-[18px] text-[#1a0dab] font-medium group-hover:underline truncate">{r.title}</div>
                      <div className="text-[13px] text-gray-700 mt-0.5 line-clamp-2">{r.desc}</div>
                    </div>
                  );
                  if (r.naver) {
                    return (
                      <ActionTarget key={i} id="internet-result-naver" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                        onClick={() => navigateActive({ title: 'NAVER', url: 'www.naver.com', view: 'site' })} className="block">
                        {inner}
                      </ActionTarget>
                    );
                  }
                  return <div key={i} onClick={() => navigateActive({ title: r.title, url: r.url, view: 'site' })}>{inner}</div>;
                })}
              </div>
            </div>
          ) : activeTab?.view === 'google' ? (
            <div className="max-w-2xl mx-auto px-5 py-16 animate-[fadeIn_0.25s_ease-out]">
              <div className="text-center text-5xl font-light tracking-tight mb-8 text-gray-700">
                google.com
              </div>
              <div onClick={() => setInternetUrlPanelOpen(true)} className="max-w-lg mx-auto">
                <div className="w-full h-12 rounded-full border border-gray-300 bg-white flex items-center gap-3 px-5 cursor-text shadow-sm hover:shadow-md transition-shadow">
                  <Search size={18} className="text-gray-400"/>
                  <div className="flex-1 text-[14px] text-gray-400">검색어 또는 URL 입력</div>
                </div>
                <div className="flex justify-center gap-3 mt-6">
                  <div className="px-4 py-2 rounded-md bg-gray-100 text-xs text-gray-700 font-medium">검색</div>
                  <div className="px-4 py-2 rounded-md bg-gray-100 text-xs text-gray-700 font-medium">오늘의 운세</div>
                </div>
              </div>
              <div className="mt-10 text-center text-xs text-gray-400">탐험 브라우저 · google.com 모의 페이지</div>
            </div>
          ) : activeTab?.view === 'naver' ? (
            <div className="max-w-2xl mx-auto px-5 py-10 animate-[fadeIn_0.25s_ease-out]">
              <div className="text-center text-5xl font-black tracking-tight mb-6">
                <span className="text-[#03C75A]">N</span><span className="text-gray-800">AVER</span>
              </div>
              <ActionTarget id="naver-search-bar" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                onClick={() => setInternetUrlPanelOpen(true)} className="block">
                <div className="w-full h-12 rounded-xl border-2 border-[#03C75A] bg-white flex items-center gap-2 px-4 cursor-text shadow-sm">
                  <Search size={18} className="text-[#03C75A]"/>
                  <div className="flex-1 text-[14px] text-gray-400">검색어를 입력하세요</div>
                  <div className="text-xs text-white bg-[#03C75A] rounded-md px-2 py-1 font-bold">검색</div>
                </div>
              </ActionTarget>
              <div className="mt-6 grid grid-cols-4 gap-3 text-center">
                {[
                  { icon: '📧', label: '메일' },
                  { icon: '📰', label: '뉴스' },
                  { icon: '🗺', label: '지도' },
                  { icon: '🛒', label: '쇼핑' },
                  { icon: '💬', label: '카페' },
                  { icon: '📚', label: '블로그' },
                  { icon: '🎬', label: 'TV' },
                  { icon: '☁️', label: '날씨' },
                ].map((q) => (
                  <div key={q.label} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-50">
                    <div className="text-2xl">{q.icon}</div>
                    <div className="text-[11px] text-gray-700">{q.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div className="text-[11px] font-bold text-gray-500 mb-2">실시간 급상승</div>
                {['1. 오늘의 날씨', '2. 학교 알리미', '3. 어린이 동요', '4. 방학 숙제'].map((t) => (
                  <div key={t} className="text-sm text-gray-700 py-1">{t}</div>
                ))}
              </div>
            </div>
          ) : activeTab?.view === 'site' ? (
            <div className="max-w-2xl mx-auto px-5 py-10 text-center animate-[fadeIn_0.25s_ease-out]">
              <div className="text-6xl mb-4">🌐</div>
              <div className="text-2xl font-bold text-gray-800">{activeTab.title}</div>
              <div className="text-xs text-gray-500 mt-1 truncate">{activeTab.url}</div>
              <div className="mt-8 grid grid-cols-2 gap-3 text-left">
                {['공지사항', '인기 뉴스', '오늘의 날씨', '인기 영상'].map((s, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                    <div className="text-xs text-gray-500">{s}</div>
                    <div className="text-sm font-medium text-gray-800 mt-1">샘플 콘텐츠 {i + 1}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-xs text-gray-400">탐험 브라우저 · {activeTab.url}</div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto px-5 py-8 text-center">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-2">탐험 검색</div>
              <div className="text-sm text-gray-500 mb-6">주소창을 눌러 검색해 보세요</div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: '🏫', label: '초등학교' },
                  { icon: '📰', label: '뉴스' },
                  { icon: '🎬', label: '동영상' },
                  { icon: '🗺', label: '지도' },
                  { icon: '🎮', label: '게임' },
                  { icon: '📚', label: '도서' },
                  { icon: '☁️', label: '날씨' },
                  { icon: '⚽', label: '스포츠' },
                ].map(q => (
                  <div key={q.label} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                    <div className="text-2xl">{q.icon}</div>
                    <div className="text-[11px] text-gray-700">{q.label}</div>
                  </div>
                ))}
              </div>
              {internetBookmarks.length > 0 && (
                <div className="mt-8 text-left">
                  <div className="text-xs font-bold text-gray-600 mb-2">즐겨찾기</div>
                  <div className="space-y-1">
                    {internetBookmarks.map((b, i) => (
                      <div key={i} onClick={() => openBookmark(b)} className="p-2 rounded-lg hover:bg-gray-50 text-sm text-gray-800 truncate cursor-pointer">★ {b.title}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 하단 탐색 바 */}
        <div className="shrink-0 bg-white border-t border-gray-200 px-2 py-1.5 flex items-center justify-around">
          <button className="w-12 h-10 rounded-lg hover:bg-gray-100 active:scale-90 flex items-center justify-center text-gray-600">
            <ChevronLeft size={22}/>
          </button>
          <button className="w-12 h-10 rounded-lg hover:bg-gray-100 active:scale-90 flex items-center justify-center text-gray-600 rotate-180">
            <ChevronLeft size={22}/>
          </button>
          <button className="w-12 h-10 rounded-lg hover:bg-gray-100 active:scale-90 flex items-center justify-center text-gray-600" onClick={() => {
            setInternetTabs(tabs => tabs.map(t => t.id === internetActiveTabId ? { ...t, view: 'newtab', url: '', title: '새 탭' } : t));
          }}>
            <Home size={20}/>
          </button>
          <ActionTarget
            id="internet-tabs-button" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
            onClick={() => setInternetTabSwitcherOpen(true)}
          >
            <div className="w-12 h-10 rounded-lg hover:bg-gray-100 active:scale-90 flex items-center justify-center text-gray-700 relative">
              <div className="w-6 h-6 rounded border-2 border-current flex items-center justify-center text-[10px] font-bold">{internetTabs.length}</div>
            </div>
          </ActionTarget>
          <button onClick={() => setInternetMenuOpen(o => !o)} className="w-12 h-10 rounded-lg hover:bg-gray-100 active:scale-90 flex items-center justify-center text-gray-600">
            <Menu size={20}/>
          </button>
        </div>

        {/* 주소창 패널 (가상 키보드 + 검색 제안) */}
        {internetUrlPanelOpen && (() => {
          const rows = internetKbShift
            ? [['Q','W','E','R','T','Y','U','I','O','P'], ['A','S','D','F','G','H','J','K','L'], ['Z','X','C','V','B','N','M']]
            : [['q','w','e','r','t','y','u','i','o','p'], ['a','s','d','f','g','h','j','k','l'], ['z','x','c','v','b','n','m']];
          const appendKb = (ch: string) => setInternetKbInput(v => v + ch);
          const backspaceKb = () => setInternetKbInput(v => v.slice(0, -1));
          return (
            <div className="absolute inset-0 z-[90] bg-white animate-[fadeIn_0.18s_ease-out] flex flex-col pt-8">
              <div className="shrink-0 bg-white border-b border-gray-200 px-3 py-2 flex items-center gap-2">
                <button onClick={() => { setInternetUrlPanelOpen(false); setInternetKbInput(''); }} className="w-9 h-9 rounded-full hover:bg-gray-100 active:scale-90 flex items-center justify-center text-gray-700">
                  <ChevronLeft size={22}/>
                </button>
                <div className="flex-1 h-10 bg-[#f1f3f4] rounded-full flex items-center gap-2 px-4">
                  <Search size={16} className="text-gray-500 shrink-0"/>
                  <div className="flex-1 text-[14px] text-gray-800 truncate">
                    {internetKbInput || <span className="text-gray-400">검색어 또는 웹 주소 입력</span>}
                    <span className="inline-block w-[1px] h-4 bg-gray-700 align-middle ml-0.5 animate-pulse"/>
                  </div>
                  {internetKbInput && (
                    <button onClick={() => setInternetKbInput('')} className="text-gray-400 hover:text-gray-700 text-sm">✕</button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 min-h-0">
                <div className="text-[11px] font-bold text-gray-500 px-3 pt-2 pb-1">추천 검색어</div>
                {['네이버', '초등학교', '날씨', '동요 모음'].map((s) => (
                  s === '네이버' ? (
                    <ActionTarget key={s} id="internet-search-suggest" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                      onClick={() => performSearch(s)} className="block">
                      <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 cursor-pointer">
                        <Search size={18} className="text-gray-500"/>
                        <div className="text-[15px] text-gray-800 flex-1">{s}</div>
                        <div className="text-[11px] text-blue-600">검색</div>
                      </div>
                    </ActionTarget>
                  ) : (
                    <div key={s} onClick={() => performSearch(s)} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 cursor-pointer">
                      <Search size={18} className="text-gray-500"/>
                      <div className="text-[15px] text-gray-800 flex-1">{s}</div>
                    </div>
                  )
                ))}
              </div>

              {/* 가상 키보드 */}
              <div className="shrink-0 bg-[#d1d5db] px-1.5 pt-2 pb-2 select-none">
                {rows.map((row, ri) => (
                  <div key={ri} className={`flex gap-1 mb-1 ${ri === 1 ? 'px-3' : ri === 2 ? 'px-1' : ''}`}>
                    {ri === 2 && (
                      <button onClick={() => setInternetKbShift(s => !s)} className={`flex-[1.4] h-9 rounded-md text-xs font-bold active:scale-95 ${internetKbShift ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'}`}>⇧</button>
                    )}
                    {row.map(ch => (
                      <button key={ch} onClick={() => { appendKb(ch); if (internetKbShift) setInternetKbShift(false); }} className="flex-1 h-9 rounded-md bg-white text-gray-800 text-sm font-medium active:bg-gray-200 shadow-sm">{ch}</button>
                    ))}
                    {ri === 2 && (
                      <button onClick={backspaceKb} className="flex-[1.4] h-9 rounded-md bg-gray-400 text-white text-sm font-bold active:scale-95">⌫</button>
                    )}
                  </div>
                ))}
                <div className="flex gap-1">
                  <button onClick={() => appendKb('.')} className="w-10 h-10 rounded-md bg-gray-400 text-white text-sm font-bold active:scale-95">.</button>
                  <button onClick={() => appendKb('/')} className="w-10 h-10 rounded-md bg-gray-400 text-white text-sm font-bold active:scale-95">/</button>
                  <button onClick={() => appendKb(' ')} className="flex-1 h-10 rounded-md bg-white text-gray-700 text-xs active:bg-gray-200 shadow-sm">스페이스</button>
                  <button onClick={() => appendKb('.com')} className="w-14 h-10 rounded-md bg-gray-400 text-white text-xs font-bold active:scale-95">.com</button>
                  <ActionTarget id="internet-url-go" currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={performUrlGo}>
                    <button disabled={!internetKbInput.trim()} className={`w-14 h-10 rounded-md text-white text-sm font-bold active:scale-95 ${internetKbInput.trim() ? 'bg-blue-500' : 'bg-blue-300'}`}>이동</button>
                  </ActionTarget>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 탭 스위처 */}
        {internetTabSwitcherOpen && (
          <div className="absolute inset-0 z-[95] bg-[#1f1f1f]/95 backdrop-blur-sm animate-[fadeIn_0.18s_ease-out] flex flex-col pt-8">
            <div className="shrink-0 flex items-center justify-between px-4 py-3 text-white">
              <button onClick={() => setInternetTabSwitcherOpen(false)} className="text-sm font-medium active:scale-95">완료</button>
              <div className="text-sm font-bold">탭 {internetTabs.length}개</div>
              <ActionTarget id="internet-newtab" currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={addNewTab}>
                <button className="text-2xl font-light active:scale-90 px-2">+ 새 탭</button>
              </ActionTarget>
            </div>
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3">
              {internetTabs.map((t, idx) => (
                <div key={t.id}
                  onClick={() => { setInternetActiveTabId(t.id); setInternetTabSwitcherOpen(false); }}
                  className={`rounded-2xl overflow-hidden bg-white shadow-lg cursor-pointer active:scale-95 transition-transform relative ${t.id === internetActiveTabId ? 'ring-4 ring-blue-500' : ''}`}>
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b border-gray-200">
                    <div className="text-[12px] font-medium text-gray-800 truncate flex-1">{t.title}</div>
                    {idx === 0 ? (
                      <ActionTarget id="internet-tab-close-1" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                        onClick={(e: any) => { e.stopPropagation(); closeTab(t.id); }}>
                        <button className="w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-600"><X size={14}/></button>
                      </ActionTarget>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); closeTab(t.id); }} className="w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-600"><X size={14}/></button>
                    )}
                  </div>
                  <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-3xl">
                    {t.view === 'results' ? '🔎' : '🌐'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
};

export default InternetApp;
