import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Menu, Search, Home, X, ShieldCheck, Info, RotateCw, Star, Plus, Trash2, School, CloudSun, Music2, Globe, ArrowBigUp, Delete } from 'lucide-react';
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
  networkAvailable?: boolean;
}

/** This browser never loads a remote page. URLs are learning data only. */
export function resolvePracticeAddress(value: string): InternetHist | null {
  const text = value.trim();
  if (!text || /^(?:javascript|data|file):/i.test(text)) return null;
  if (!text.includes('.') || /\s/.test(text)) {
    return { title: `${text} - 검색`, url: `https://search.example/?q=${encodeURIComponent(text)}`, view: 'results' };
  }
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) return null;
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    const view = host === 'naver.com' ? 'naver' : host === 'google.com' ? 'google' : 'site';
    return { title: host === 'naver.com' ? 'NAVER' : host === 'google.com' ? 'Google' : host, url: url.href, view };
  } catch { return null; }
}

const InternetApp = (props: InternetAppProps) => {
  const { currentTargetId, advanceQuest, internetTabs, setInternetTabs, internetActiveTabId, setInternetActiveTabId,
    internetUrlPanelOpen, setInternetUrlPanelOpen, internetTabSwitcherOpen, setInternetTabSwitcherOpen,
    internetBookmarks, setInternetBookmarks, internetMenuOpen, setInternetMenuOpen,
    internetKbInput, setInternetKbInput, internetKbShift, setInternetKbShift, networkAvailable = true } = props;
  const [message, setMessage] = useState('');
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [safetyFeedback, setSafetyFeedback] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const activeTab = internetTabs.find(t => t.id === internetActiveTabId) || internetTabs[0];
  const activeId = activeTab?.id;
  const isBookmarked = !!activeTab?.url && internetBookmarks.some(b => b.url === activeTab.url);
  const canGoBack = (activeTab?.historyIndex ?? 0) > 0;
  const canGoForward = !!activeTab && activeTab.historyIndex < activeTab.history.length - 1;
  const Target = ({ id, children, onClick, className = '', manual = false }: { id: string; children: React.ReactNode; onClick?: (e: React.MouseEvent) => void | boolean; className?: string; manual?: boolean }) => (
    <ActionTarget id={id} currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance={manual} onClick={onClick} className={className}>{children}</ActionTarget>
  );
  const navigate = (next: InternetHist) => {
    if (!networkAvailable) { setMessage('Wi-Fi에 연결한 뒤 다시 시도하세요. 빠른 설정에서 연결 상태를 확인할 수 있어요.'); return false; }
    setInternetTabs(tabs => tabs.map(t => {
      if (t.id !== activeId) return t;
      const history = [...t.history.slice(0, t.historyIndex + 1), next];
      return { ...t, ...next, history, historyIndex: history.length - 1 };
    }));
    setMessage('');
    return true;
  };
  const goHistory = (step: number) => {
    if (!activeTab || activeTab.historyIndex + step < 0 || activeTab.historyIndex + step >= activeTab.history.length) return false;
    setInternetTabs(tabs => tabs.map(t => {
      if (t.id !== activeId) return t;
      const historyIndex = t.historyIndex + step;
      return { ...t, ...t.history[historyIndex], historyIndex };
    }));
    if (step < 0) advanceQuest('internet-back');
    return true;
  };
  const search = (query: string) => {
    const q = query.trim();
    if (!q) return false;
    if (!navigate({ title: `${q} - 검색`, url: `https://search.example/?q=${encodeURIComponent(q)}`, view: 'results' })) return false;
    setInternetUrlPanelOpen(false); setInternetKbInput('');
    if (q === '네이버') advanceQuest('internet-search-suggest');
    return true;
  };
  const submitAddress = () => {
    const next = resolvePracticeAddress(internetKbInput);
    if (!next) { setMessage('주소 또는 검색어를 확인해 주세요. 예: naver.com'); return false; }
    if (!navigate(next)) return false;
    setInternetUrlPanelOpen(false); setInternetKbInput('');
    if (next.view === 'naver') advanceQuest('internet-url-go');
    else if (currentTargetId === 'internet-url-go') setMessage('이번 미션에서는 naver.com을 입력해 주소로 이동하는 방법을 연습해요.');
    return true;
  };
  const openAddress = (prefill = false) => { setInternetKbInput(prefill ? activeTab?.url || '' : ''); setInternetUrlPanelOpen(true); setMessage(''); };
  const openBookmark = (bookmark: {title: string; url: string}) => {
    const next = resolvePracticeAddress(bookmark.url);
    if (!next || !navigate({ ...next, title: bookmark.title })) return false;
    setInternetMenuOpen(false);
    if (next.view === 'naver') advanceQuest('internet-bookmark-open');
    return true;
  };
  const addBookmark = () => {
    if (!activeTab?.url) { setMessage('먼저 주소를 입력해 페이지를 연 뒤 즐겨찾기에 추가하세요.'); return false; }
    if (isBookmarked) { setMessage('이미 즐겨찾기에 있어요. 메뉴에서 열거나 삭제할 수 있어요.'); return false; }
    setInternetBookmarks(b => [...b, { title: activeTab.title, url: activeTab.url }]);
    advanceQuest('internet-bookmark-add');
    setMessage('즐겨찾기에 저장했어요.');
    return true;
  };
  const addTab = () => {
    const newId = Math.max(0, ...internetTabs.map(t => t.id)) + 1;
    setInternetTabs(tabs => [...tabs, makeInternetTab(newId)]); setInternetActiveTabId(newId);
    // Keep the overview visible so a learner can compare and close tabs.
    setInternetTabSwitcherOpen(true); advanceQuest('internet-newtab');
  };
  const closeTab = (id: number) => {
    const next = internetTabs.filter(t => t.id !== id);
    if (!next.length) { const replacement = makeInternetTab(Math.max(...internetTabs.map(t => t.id), 0) + 1); setInternetTabs([replacement]); setInternetActiveTabId(replacement.id); }
    else { setInternetTabs(next); if (id === activeId) setInternetActiveTabId(next[0].id); }
    if (id === internetTabs[0]?.id) advanceQuest('internet-tab-close-1');
  };
  let query = '';
  if (activeTab?.view === 'results') { try { query = new URL(activeTab.url).searchParams.get('q') || ''; } catch { query = activeTab.title.replace(' - 검색', ''); } }
  const results = query === '네이버'
    ? [{ title: 'NAVER - 네이버', url: 'https://www.naver.com/', description: '주소의 철자가 naver.com인지 확인하고 열어 보세요.', target: 'internet-result-naver' }, { title: '주소를 꼼꼼히 확인해요', url: 'https://search.example/address-check', description: '검색 결과의 제목만 보지 말고 실제 주소도 함께 확인해요.' }]
    : [{ title: `${query} · 어린이 탐구 자료`, url: 'https://learning.example/topic', description: '작성한 사람, 날짜, 근거가 있는지 확인하고 다른 자료와 비교해요.' }, { title: `${query} · 우리 반 자료실`, url: 'https://class.example/resources', description: '선생님이 안내한 사이트인지 확인하고 활용해요.' }];
  const keyRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
  const iconButton = 'min-w-11 h-11 rounded-full hover:bg-slate-100 active:bg-slate-200 flex items-center justify-center disabled:opacity-30';
  useEffect(() => {
    const onDeviceBack = (event: Event) => {
      if (safetyOpen) { setSafetyOpen(false); event.preventDefault(); }
      else if (internetUrlPanelOpen) { setInternetUrlPanelOpen(false); event.preventDefault(); }
      else if (internetMenuOpen) { setInternetMenuOpen(false); event.preventDefault(); }
      else if (internetTabSwitcherOpen) { setInternetTabSwitcherOpen(false); event.preventDefault(); }
      else if (canGoBack) { goHistory(-1); event.preventDefault(); }
      // At the first page the device handles Back by returning to its home screen.
    };
    window.addEventListener('android-explorer-internet-back', onDeviceBack);
    return () => window.removeEventListener('android-explorer-internet-back', onDeviceBack);
  });

  return <div className="flex-1 min-h-0 bg-[#f5f6f8] text-slate-800 flex flex-col pt-8 overflow-hidden relative">
    <div className="bg-white border-b px-2 py-2 flex gap-1 items-center shrink-0">
      <Target id="internet-back" manual onClick={() => goHistory(-1)}><button aria-label="이전 페이지" className={iconButton} disabled={!canGoBack}><ChevronLeft size={22}/></button></Target>
      <Target id="internet-address-bar" onClick={() => openAddress(true)} className="flex-1 min-w-0"><button className="w-full min-h-11 rounded-full bg-slate-100 flex gap-2 items-center px-3 text-left text-sm" aria-label="주소 또는 검색어 입력"><Info size={16} className="shrink-0"/><span className="truncate">{activeTab?.url || '검색어 또는 웹 주소 입력'}</span></button></Target>
      <Target id="internet-bookmark-add" manual onClick={addBookmark}><button className={iconButton} aria-label="즐겨찾기 추가"><Star size={21} fill={isBookmarked ? '#f59e0b' : 'none'} className={isBookmarked ? 'text-amber-500' : ''}/></button></Target>
      <Target id="internet-menu-open" onClick={() => setInternetMenuOpen(o => !o)}><button className={iconButton} aria-label="인터넷 메뉴"><Menu size={22}/></button></Target>
    </div>
    <div className="shrink-0 px-4 py-1.5 text-[11px] text-slate-500 bg-slate-50 flex flex-wrap justify-between gap-1"><span>삼성 인터넷 사용법 · 모의 페이지</span><button onClick={() => { setSafetyOpen(true); setSafetyFeedback(''); }} className="text-blue-700 font-semibold flex items-center gap-1"><ShieldCheck size={13}/> 안전하게 검색하기</button></div>
    {message && <div role="status" className="shrink-0 bg-blue-50 text-blue-900 px-4 py-2 text-sm flex gap-2 items-center"><span className="flex-1">{message}</span><button className="p-2" aria-label="안내 닫기" onClick={() => setMessage('')}><X size={16}/></button></div>}
    <main className="flex-1 min-h-0 overflow-y-auto bg-white">
      {activeTab?.view === 'results' ? <div className="max-w-3xl mx-auto p-6"><p className="text-xs text-slate-500 mb-4">“{query}” 학습용 예시 검색 결과 · 실제 검색 결과가 아니에요</p>{results.map(result => <Target key={result.url} id={result.target || 'internet-example-result'} onClick={() => { const next = resolvePracticeAddress(result.url); return !!next && navigate(next); }} className="mb-5"><button className="text-left w-full rounded-xl p-3 hover:bg-slate-50"><span className="block text-xs text-slate-500">{result.url}</span><span className="block text-xl text-blue-700 my-1">{result.title}</span><span className="block text-sm leading-relaxed text-slate-600">{result.description}</span></button></Target>)}</div>
      : ['newtab', 'naver', 'google'].includes(activeTab?.view || 'newtab') ? <div className="max-w-2xl mx-auto px-6 py-8 sm:py-12"><h1 className={`text-center text-4xl font-bold mb-2 ${activeTab?.view === 'naver' ? 'text-[#03c75a]' : 'text-slate-800'}`}>{activeTab?.view === 'naver' ? 'NAVER' : activeTab?.view === 'google' ? 'Google' : '인터넷'}</h1><p className="text-center text-sm text-slate-500 mb-7">주소로 이동하거나 궁금한 것을 검색해 보세요.</p><Target id={activeTab?.view === 'naver' ? 'naver-search-bar' : 'internet-home-search'} onClick={() => openAddress()}><button className="w-full rounded-full border-2 border-blue-300 p-4 flex items-center gap-3 text-slate-400 text-left"><Search size={22}/> 검색어를 입력하세요</button></Target><div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">{['초등학교', '날씨', '동요 모음', '네이버'].map((label, i) => <button key={label} onClick={() => search(label)} className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50"><span className="flex justify-center mb-2 text-slate-600">{React.createElement([School, CloudSun, Music2, Search][i], { size: 28, strokeWidth: 1.7, 'aria-hidden': true })}</span><span className="text-sm">{label}</span></button>)}</div><div className="mt-7 rounded-2xl bg-blue-50 p-4 text-sm leading-relaxed text-blue-950"><strong>주소와 검색어는 달라요.</strong><p className="mt-1">naver.com은 사이트 주소예요. “바다 동물”은 찾고 싶은 내용을 나타내는 검색어예요. 주소창에 둘 다 입력할 수 있어요.</p></div>{internetBookmarks.length > 0 && <div className="mt-6"><h2 className="text-sm font-bold mb-2">즐겨찾기</h2>{internetBookmarks.map(b => <button key={b.url} onClick={() => openBookmark(b)} className="flex items-center gap-3 p-3 w-full text-left rounded-xl hover:bg-slate-50"><Star size={18} strokeWidth={1.7} className="shrink-0 text-amber-500"/><span className="truncate">{b.title}</span></button>)}</div>}</div>
      : <div className="max-w-2xl mx-auto p-7"><Globe size={36} strokeWidth={1.6} className="text-slate-500 mb-4" aria-hidden="true"/><h1 className="text-2xl font-bold break-words">{activeTab?.title}</h1><p className="text-sm text-slate-500 break-all mt-2">{activeTab?.url}</p><div className="p-5 mt-6 rounded-2xl bg-slate-50 text-sm leading-relaxed"><strong>학습용 페이지에 도착했어요.</strong><p className="mt-2">실제 사이트 내용은 불러오지 않아요. 이 화면에서 즐겨찾기, 뒤로 가기, 탭을 연습할 수 있어요.</p><p className="mt-2">낯선 사이트가 개인정보나 앱 설치를 요구하면 멈추고 선생님께 확인하세요. 주소에 HTTPS가 있어도 내용이 모두 안전하다는 뜻은 아니에요.</p></div><button onClick={() => { setSafetyOpen(true); setSafetyFeedback(''); }} className="mt-5 rounded-full bg-blue-600 text-white px-5 py-3 font-semibold">안전한 행동 연습</button></div>}
    </main>
    <nav className="shrink-0 bg-white border-t px-3 py-1 flex justify-around items-center" aria-label="인터넷 탐색"><button aria-label="뒤로 가기" disabled={!canGoBack} className={iconButton} onClick={() => goHistory(-1)}><ChevronLeft size={22}/></button><button aria-label="앞으로 가기" disabled={!canGoForward} className={iconButton} onClick={() => goHistory(1)}><ChevronRight size={22}/></button><button aria-label="인터넷 홈" className={iconButton} onClick={() => navigate({ title: '새 탭', url: '', view: 'newtab' })}><Home size={21}/></button><button aria-label="새로고침" className={iconButton} onClick={() => setMessage(networkAvailable ? '학습용 페이지를 새로고침했어요.' : 'Wi-Fi 연결 상태를 확인해 주세요.')}><RotateCw size={19}/></button><Target id="internet-tabs-button" onClick={() => setInternetTabSwitcherOpen(true)}><button className={iconButton} aria-label={`탭 목록 ${internetTabs.length}개`}><span className="w-6 h-6 border-2 rounded-md flex justify-center items-center text-xs font-bold">{internetTabs.length}</span></button></Target></nav>

    {internetMenuOpen && <div className="absolute right-3 top-[88px] z-[80] w-80 max-w-[92%] bg-white rounded-3xl shadow-2xl border overflow-hidden"><div className="flex items-center p-4 border-b"><h2 className="font-bold flex-1">즐겨찾기 {internetBookmarks.length}개</h2><button onClick={() => setInternetMenuOpen(false)} className="p-2" aria-label="메뉴 닫기"><X size={18}/></button></div><div className="max-h-72 overflow-y-auto p-2">{!internetBookmarks.length && <p className="p-4 text-sm text-slate-500">주소창 옆 별 모양을 눌러 페이지를 저장해요.</p>}{internetBookmarks.map(b => <div key={b.url} className="flex items-center gap-1"><Target id="internet-bookmark-open" manual onClick={() => openBookmark(b)} className="flex-1 min-w-0"><button className="p-3 w-full text-left rounded-xl hover:bg-slate-50"><span className="block truncate font-medium">{b.title}</span><span className="block truncate text-xs text-slate-500">{b.url}</span></button></Target><Target id="internet-bookmark-delete" onClick={() => { setInternetBookmarks(items => items.filter(item => item.url !== b.url)); setInternetMenuOpen(false); }}><button className="p-3 text-red-600" aria-label={`${b.title} 즐겨찾기 삭제`}><Trash2 size={18}/></button></Target></div>)}</div><button className="border-t p-4 w-full text-left text-blue-700 text-sm font-semibold" onClick={() => { setInternetMenuOpen(false); setSafetyOpen(true); setSafetyFeedback(''); }}>안전하게 검색하기</button></div>}

    {internetUrlPanelOpen && <div className="absolute inset-0 z-[90] bg-white flex flex-col pt-8"><form onSubmit={e => { e.preventDefault(); submitAddress(); }} className="p-3 border-b flex gap-2 items-center"><button type="button" aria-label="주소 입력 닫기" className={iconButton} onClick={() => setInternetUrlPanelOpen(false)}><ChevronLeft size={22}/></button><input autoFocus aria-label="검색어 또는 웹 주소" className="flex-1 min-w-0 rounded-full bg-slate-100 px-4 py-3 text-base outline-blue-500" value={internetKbInput} onChange={e => setInternetKbInput(e.target.value)} placeholder="naver.com 또는 검색어" autoCapitalize="none" autoComplete="off" spellCheck={false}/><Target id="internet-url-go" manual><button className="rounded-full px-4 py-3 bg-blue-600 text-white font-semibold disabled:opacity-40" disabled={!internetKbInput.trim()} type="submit">이동</button></Target></form>{message && <p role="alert" className="px-5 py-3 text-sm text-amber-800 bg-amber-50">{message}</p>}<div className="flex-1 min-h-0 overflow-y-auto p-4"><p className="text-xs text-slate-500 mb-2">추천 검색어</p>{['네이버', '초등학교', '날씨', '동요 모음'].map(s => <Target key={s} id={s === '네이버' ? 'internet-search-suggest' : `search-${s}`} manual onClick={() => search(s)}><button className="w-full p-3 rounded-xl hover:bg-slate-50 flex gap-3 items-center text-left"><Search size={17} className="text-slate-400"/>{s}</button></Target>)}<p className="mt-4 text-xs text-slate-500 leading-relaxed">실제 키보드로 한글·영어를 입력할 수 있어요. 잘못 쓴 글자는 지우고 다시 입력하세요.</p></div><button className="shrink-0 py-2 text-sm text-blue-700 border-t" onClick={() => setKeyboardVisible(v => !v)}>{keyboardVisible ? '연습용 영문 자판 접기' : '연습용 영문 자판 펼치기'}</button>{keyboardVisible && <div className="shrink-0 p-2 bg-slate-200 select-none">{keyRows.map(row => <div key={row} className="flex gap-1 mb-1 justify-center">{[...row].map(k => <button key={k} type="button" onClick={() => setInternetKbInput(v => v + (internetKbShift ? k.toUpperCase() : k))} className="flex-1 max-w-14 h-10 bg-white rounded-md shadow-sm">{internetKbShift ? k.toUpperCase() : k}</button>)}</div>)}<div className="flex gap-1"><button className="h-11 px-2 sm:px-4 bg-white rounded-md" aria-label="대소문자 전환" onClick={() => setInternetKbShift(v => !v)}><ArrowBigUp size={21} strokeWidth={1.7}/></button><button className="h-11 px-2 sm:px-4 bg-white rounded-md" onClick={() => setInternetKbInput(v => v + '.')}>.</button><button className="flex-1 min-w-0 h-11 bg-white rounded-md text-sm" onClick={() => setInternetKbInput(v => v + ' ')}>스페이스</button><button className="h-11 px-2 sm:px-4 bg-white rounded-md" aria-label="한 글자 지우기" onClick={() => setInternetKbInput(v => v.slice(0, -1))}><Delete size={21} strokeWidth={1.7}/></button><button className="h-11 px-2 sm:px-4 bg-blue-600 text-white rounded-md" onClick={submitAddress}>이동</button></div></div>}</div>}

    {internetTabSwitcherOpen && <div className="absolute inset-0 z-[95] bg-slate-100 flex flex-col pt-8"><header className="p-4 flex items-center justify-between"><button onClick={() => setInternetTabSwitcherOpen(false)} className="px-3 py-2 text-blue-700">완료</button><strong>탭 {internetTabs.length}개</strong><Target id="internet-newtab" manual onClick={addTab}><button className="flex items-center gap-1 px-3 py-2 text-blue-700"><Plus size={20}/> 새 탭</button></Target></header><div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 gap-4 content-start">{internetTabs.map((tab, index) => <div key={tab.id} className={`rounded-2xl bg-white overflow-hidden border-2 ${tab.id === activeId ? 'border-blue-500' : 'border-transparent'}`}><div className="flex gap-1 items-center p-2 border-b"><span className="flex-1 truncate text-sm font-semibold">{tab.title}</span><Target id={index === 0 ? 'internet-tab-close-1' : `internet-tab-close-${tab.id}`} manual onClick={() => closeTab(tab.id)}><button className="p-2 rounded-full hover:bg-slate-100" aria-label={`${tab.title} 탭 닫기`}><X size={18}/></button></Target></div><button onClick={() => { setInternetActiveTabId(tab.id); setInternetTabSwitcherOpen(false); }} className="h-36 w-full flex flex-col gap-3 items-center justify-center p-4"><span className="text-slate-500">{tab.view === 'results' ? <Search size={30} strokeWidth={1.7}/> : <Globe size={30} strokeWidth={1.7}/>}</span><span className="text-xs text-slate-500 break-all line-clamp-2">{tab.url || '새 탭'}</span></button></div>)}</div></div>}

    {safetyOpen && <div className="absolute inset-0 z-[100] bg-slate-900/50 flex items-center justify-center p-4"><section role="dialog" aria-modal="true" aria-labelledby="internet-safety-title" className="max-w-lg w-full max-h-full overflow-y-auto bg-white rounded-3xl p-6"><div className="flex items-center gap-3"><ShieldCheck className="text-blue-600"/><h2 id="internet-safety-title" className="text-xl font-bold flex-1">이럴 때는 어떻게 할까요?</h2><button onClick={() => setSafetyOpen(false)} aria-label="안전 연습 닫기" className="p-2"><X size={20}/></button></div><div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 my-5 text-sm"><strong>낯선 팝업이 나타났어요.</strong><p className="mt-2">“무료 선물 당첨! 이 앱 파일을 설치하고 계정 비밀번호를 입력하세요.”</p></div><button className="w-full p-3 border rounded-xl text-left mb-2" onClick={() => setSafetyFeedback('비밀번호는 다른 사람에게 알려주지 않아요. 주소가 낯설거나 앱 파일 설치를 요구하면 먼저 멈춰요.')}>선물을 받기 위해 설치하고 입력한다</button><Target id="internet-safety-report" onClick={() => { setSafetyFeedback('잘했어요! 팝업을 닫고 선생님께 알려요. 공식 스토어에서도 선생님이 안내한 앱인지 확인한 뒤 설치해요.'); }}><button className="w-full p-3 border rounded-xl text-left hover:bg-blue-50">팝업을 닫고 선생님께 확인한다</button></Target>{safetyFeedback && <p role="status" className="mt-4 p-4 bg-blue-50 text-blue-900 rounded-xl text-sm leading-relaxed">{safetyFeedback}</p>}<button onClick={() => setSafetyOpen(false)} className="mt-5 px-5 py-3 bg-blue-600 text-white rounded-full w-full">인터넷으로 돌아가기</button></section></div>}
  </div>;
};
export default InternetApp;
