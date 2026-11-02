import React, { useEffect, useRef, useState } from 'react';
import { Search, ChevronLeft, Check, ShieldCheck, X, Trash2, ArrowBigUp, Delete } from 'lucide-react';
import { ActionTarget } from './shared';
import { PLAYSTORE_APPS, TARGET_SEQUENCE } from '@/data/appCatalog';
import { GalaxyAppIcon } from '@/components/device/GalaxyAppIcon';

export type AppUpdateStatus = 'pending' | 'downloading' | 'installing' | 'done';

export interface PlayStoreAppProps {
  onOpenApp?: (id: string) => void;
  networkAvailable?: boolean;
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

type StoreApp = { id: string; name: string; dev: string; color: string; label: React.ReactNode };
const MATH_APP: StoreApp = { id: 'math', name: '똑똑수학탐험대', dev: '한국교육학술정보원(KERIS)', color: '#f7bf36', label: <GalaxyAppIcon appName="math"/> };
const CATALOG = [MATH_APP, ...PLAYSTORE_APPS.filter(a=>a.id!=='toss')];
const UPDATE_APPS = [{id:'internet',name:'삼성 인터넷',iconName:'Internet'}, {id:'notes',name:'Samsung Notes',iconName:'Notes'}, {id:'gallery',name:'갤러리',iconName:'Gallery'}];

const PlayStoreApp = (props: PlayStoreAppProps) => {
  const { currentTargetId, advanceQuest, searchText, setSearchText, isSearched, setIsSearched, keyboardOpen, setKeyboardOpen, keyboardShift, setKeyboardShift, typingIndex, setTypingIndex, googleAccount, playStoreProfileOpen, setPlayStoreProfileOpen, playStoreView, setPlayStoreView, appsUpdated, setAppsUpdated, updatingAll, setUpdatingAll, updateProgress, setUpdateProgress, appUpdateStatus, setAppUpdateStatus, appUpdateProgress, setAppUpdateProgress, installedApps, setInstalledApps, mathInstallProgress, setMathInstallProgress, onOpenApp, networkAvailable = true } = props;
  const [notice,setNotice] = useState('');
  const [detail,setDetail] = useState<StoreApp | null>(null);
  const [safety,setSafety] = useState<[boolean,boolean,boolean]>([false,false,false]);
  const [removeApp,setRemoveApp] = useState<StoreApp | null>(null);
  const [installing,setInstalling] = useState<string | null>(null);
  const [installPercent,setInstallPercent] = useState(0);
  const [keyboardError,setKeyboardError] = useState('');
  const [help,setHelp] = useState<string | null>(null);
  const timers = useRef(new Set<ReturnType<typeof setInterval>>());
  const networkRef = useRef(networkAvailable);
  networkRef.current = networkAvailable;
  const advanceRef = useRef(advanceQuest); advanceRef.current = advanceQuest;
  useEffect(()=>()=>{timers.current.forEach(clearInterval);setMathInstallProgress(null);setUpdatingAll(false);},[]);
  useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(''),5000);return()=>clearTimeout(t);},[notice]);
  useEffect(()=>{ if (['playstore-manage','playstore-update-all','playstore-uninstall','playstore-uninstall-confirm'].includes(currentTargetId || '') && currentTargetId !== 'playstore-manage') setPlayStoreView('manage'); },[currentTargetId]);
  const run = (id:string, fn:()=>void, children:React.ReactNode, className='') => <ActionTarget id={id} currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance className={className}><button onClick={fn} className="min-h-11 px-4 py-2 rounded-full font-semibold text-sm hover:bg-black/5 w-full">{children}</button></ActionTarget>;
  const submitSearch = () => {
    if (!searchText.trim()) {setNotice('앱 이름을 입력해 주세요.');return;}
    if (!networkAvailable) {setNotice('Wi-Fi를 연결한 뒤 다시 검색해 주세요.');return;}
    setIsSearched(true);setKeyboardOpen(false);setPlayStoreView('home');
    if(searchText.replace(/\s|!/g,'')==='똑똑수학탐험대') advanceQuest('playstore-search-submit');
  };
  const inputText = (value:string) => {
    setSearchText(value);setIsSearched(false);setKeyboardError('');
    if(value.replace(/\s|!/g,'')==='똑똑수학탐험대') advanceQuest('playstore-search-input');
  };
  const review = (app: StoreApp) => {setDetail(app);setSafety([false,false,false]);};
  const startInstall = () => {
    if(!detail||!safety.every(Boolean)||installing)return;
    if(!networkAvailable){setNotice('Wi-Fi 연결이 필요해요. 연결 후 다시 설치하세요.');return;}
    const app=detail;setDetail(null);setInstalling(app.id);setInstallPercent(0);if(app.id==='math')setMathInstallProgress(0);
    let progress=0;
    const timer=setInterval(()=>{
      if(!networkRef.current){clearInterval(timer);timers.current.delete(timer);setInstalling(null);setMathInstallProgress(null);setNotice('연결이 끊겨 설치가 중단됐어요. Wi-Fi 연결 후 다시 시도하세요.');return;}
      progress=Math.min(100,progress+20);setInstallPercent(progress);if(app.id==='math')setMathInstallProgress(progress);
      if(progress===100){clearInterval(timer);timers.current.delete(timer);setInstalledApps(prev=>prev.includes(app.id)?prev:[...prev,app.id]);setInstalling(null);setMathInstallProgress(null);setNotice(`${app.name} 설치가 완료됐어요.`);if(app.id==='math')advanceRef.current('playstore-install-btn');}
    },300);timers.current.add(timer);
  };
  const updateApps = (ids: string[]) => {
    if(updatingAll)return;
    if(!networkAvailable){setNotice('업데이트 전에 Wi-Fi를 연결해 주세요.');return;}
    setUpdatingAll(true);setUpdateProgress(0);setAppUpdateStatus(s=>({...s,...Object.fromEntries(ids.map(id=>[id,'downloading']))}));
    let progress=0;
    const timer=setInterval(()=>{
      if(!networkRef.current){clearInterval(timer);timers.current.delete(timer);setUpdatingAll(false);setAppUpdateStatus(s=>({...s,...Object.fromEntries(ids.map(id=>[id,'pending']))}));setNotice('네트워크 연결이 끊겼어요. 연결 후 업데이트를 다시 눌러 주세요.');return;}
      progress=Math.min(100,progress+10);setUpdateProgress(progress);setAppUpdateProgress(s=>({...s,...Object.fromEntries(ids.map(id=>[id,progress]))}));
      if(progress===80)setAppUpdateStatus(s=>({...s,...Object.fromEntries(ids.map(id=>[id,'installing']))}));
      if(progress===100){clearInterval(timer);timers.current.delete(timer);setUpdatingAll(false);setAppUpdateStatus(s=>({...s,...Object.fromEntries(ids.map(id=>[id,'done']))}));const allDone=UPDATE_APPS.every(a=>ids.includes(a.id)||appUpdateStatus[a.id]==='done');if(allDone){setAppsUpdated(true);advanceRef.current('playstore-update-all');}setNotice('업데이트가 완료됐어요.');}
    },200);timers.current.add(timer);
  };
  const uninstall = () => {
    if(!removeApp||!installedApps.includes(removeApp.id))return;
    setInstalledApps(prev=>prev.filter(id=>id!==removeApp.id));setNotice(`${removeApp.name} 앱을 제거했어요. 홈 화면에서 아이콘만 없애는 것과 달라요.`);setRemoveApp(null);advanceQuest('playstore-uninstall-confirm');
  };
  const openApp = (app:StoreApp) => {if(onOpenApp)onOpenApp(app.id);else setNotice('홈 화면으로 돌아가 설치한 앱 아이콘을 눌러 주세요.');};
  const renderApp = (app:StoreApp) => {
    const installed=installedApps.includes(app.id); const busy=installing===app.id;
    return <article key={app.id} className="flex gap-3 items-center border-b border-gray-100 py-4">
      <button aria-label={`${app.name} 앱 정보`} onClick={()=>review(app)} className="w-14 h-14 shrink-0"><GalaxyAppIcon appName={app.id}/></button>
      <button onClick={()=>review(app)} className="min-w-0 flex-1 text-left"><h3 className="font-bold text-base sm:text-lg">{app.name}</h3><p className="text-xs text-gray-500 mt-1">{app.dev}</p><p className="text-xs text-gray-500">{installed?'설치됨':'교육용 설치 연습 · 무료'}</p></button>
      {busy?<span className="text-green-700 text-sm font-bold">{installPercent}%</span>:installed?<div className="flex flex-col gap-1"><button className="text-green-700 bg-green-50 rounded-full px-4 py-2 text-sm font-bold min-h-11" onClick={()=>openApp(app)}>열기</button>{run('playstore-uninstall',()=>{setRemoveApp(app);advanceQuest('playstore-uninstall');},'제거')}</div>:<ActionTarget id={app.id==='math'?'playstore-install-btn':`playstore-install-${app.id}`} currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance><button disabled={!!installing} onClick={()=>review(app)} className="bg-[#087f5b] text-white rounded-full px-4 py-2 font-bold min-h-11 disabled:opacity-40">설치</button></ActionTarget>}
    </article>;
  };
  const matches=CATALOG.filter(a=>a.name.replace(/\s|!/g,'').includes(searchText.replace(/\s|!/g,'')));
  const keyInput = (key:string) => {
    const target=TARGET_SEQUENCE[typingIndex];
    if(key==='⌫'){const next=Math.max(0,typingIndex-1);setTypingIndex(next);setSearchText(next?TARGET_SEQUENCE[next-1].display:'');setKeyboardError('');return;}
    if(key==='Shift'){setKeyboardShift(!keyboardShift);if(target?.key==='Shift')setTypingIndex(i=>i+1);return;}
    if(key!==target?.key){setKeyboardError('파란색 자판을 찾아 보세요. 직접 입력하려면 위 검색창을 사용하세요.');return;}
    setKeyboardError('');setSearchText(target.display);setTypingIndex(i=>i+1);if(['ㄸ','ㅃ','ㅉ','ㄲ','ㅆ'].includes(key))setKeyboardShift(false);if(typingIndex+1===TARGET_SEQUENCE.length)advanceQuest('playstore-search-input');
  };
  return <div className="flex-1 min-h-0 flex flex-col pt-8 bg-[#fdfdfd] text-[#202124] relative overflow-hidden">
    {notice&&<div role="status" className="absolute top-10 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-[#263238] text-white p-3 rounded-2xl z-[100] text-sm shadow-lg text-center">{notice}</div>}
    <header className="px-3 sm:px-6 py-3 border-b border-gray-100 flex items-center gap-3 shrink-0">
      <Search size={23} className="text-gray-500 shrink-0"/>
      <ActionTarget id="playstore-search-bar" currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance className="flex-1 min-w-0"><form onSubmit={e=>{e.preventDefault();submitSearch();}}><input aria-label="앱 및 게임 검색" value={searchText} className="w-full bg-gray-100 rounded-full px-4 py-3 outline-none text-base" placeholder="앱 및 게임 검색" onFocus={()=>advanceQuest('playstore-search-bar')} onChange={e=>inputText(e.target.value)} /></form></ActionTarget>
      {run('playstore-avatar',()=>{setPlayStoreProfileOpen(true);advanceQuest('playstore-avatar');},<span aria-label="프로필" className="w-9 h-9 bg-[#d5e5ef] text-[#1b5268] flex items-center justify-center rounded-full">{googleAccount?.[0]?.toUpperCase()||'연'}</span>)}
    </header>
    <div className="px-4 py-2 flex items-center justify-between text-xs bg-[#f0f6f3] text-[#426353] gap-2 shrink-0"><span>Play 스토어 · 학습용 시뮬레이션</span><span>{networkAvailable?'Wi-Fi 연결됨':'오프라인'}</span></div>
    <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-7">
      {playStoreView==='manage'?<div className="max-w-3xl mx-auto"><button onClick={()=>setPlayStoreView('home')} className="flex gap-1 items-center min-h-11 text-gray-500 mb-3"><ChevronLeft size={20}/> Play 스토어</button><h2 className="text-2xl font-bold mb-5">앱 및 기기 관리</h2>
        <div className="p-5 rounded-3xl bg-[#edf6ef] mb-5"><div className="flex gap-3 items-center"><ShieldCheck className="text-green-700"/><strong>Play 프로텍트</strong></div><p className="text-sm mt-2">공식 스토어를 사용하고, 모르는 APK 파일은 설치하지 않아요.</p></div>
        <div className="flex items-center justify-between gap-3 mb-3"><div><h3 className="font-bold text-lg">{appsUpdated?'모든 앱이 최신 상태예요':'업데이트 사용 가능'}</h3><p className="text-xs text-gray-500 mt-1">{updatingAll?`업데이트 중 ${updateProgress}%`:'충전 상태와 Wi-Fi를 확인해요.'}</p></div>{!appsUpdated&&!updatingAll&&run('playstore-update-all',()=>updateApps(UPDATE_APPS.filter(a=>appUpdateStatus[a.id]!=='done').map(a=>a.id)),<span className="text-[#087f5b]">모두 업데이트</span>)}</div>
        {UPDATE_APPS.map(app=><div key={app.id} className="flex items-center gap-3 py-3 border-b border-gray-100"><span className="w-11 h-11 shrink-0"><GalaxyAppIcon appName={app.iconName}/></span><div className="flex-1"><strong className="text-sm">{app.name}</strong><p className="text-xs text-gray-500">{appsUpdated||appUpdateStatus[app.id]==='done'?'최신 버전':appUpdateStatus[app.id]==='installing'?'설치 중…':appUpdateStatus[app.id]==='downloading'?`다운로드 중 ${appUpdateProgress[app.id]||0}%`:'업데이트 가능'}</p></div>{appsUpdated||appUpdateStatus[app.id]==='done'?<Check className="text-green-600"/>:<button disabled={updatingAll} className="text-green-700 text-sm min-h-11 px-3 disabled:opacity-40" onClick={()=>updateApps([app.id])}>업데이트</button>}</div>)}
        <h3 className="text-lg font-bold mt-7">설치한 연습 앱</h3>{CATALOG.filter(a=>installedApps.includes(a.id)).map(renderApp)}{!CATALOG.some(a=>installedApps.includes(a.id))&&<p className="py-5 text-gray-500 text-sm">설치한 연습 앱이 없어요. 검색창에서 앱을 찾아 설치해 보세요.</p>}
      </div>:<div className="max-w-3xl mx-auto"><h2 className="text-2xl font-bold mb-2">{isSearched?'검색 결과':'앱에서 시작하는 배움'}</h2><p className="text-sm text-gray-500 mb-5">이름과 개발자를 확인하고 선생님이 허용한 앱을 설치해요.</p>{(isSearched?matches:CATALOG).map(renderApp)}{isSearched&&!matches.length&&<p className="py-8 text-center text-gray-500">검색 결과가 없어요. 앱 이름을 다시 확인해 주세요.</p>}<div className="flex flex-wrap gap-2 mt-5">{run('playstore-search-submit',submitSearch,'검색')}<button onClick={()=>{setKeyboardOpen(!keyboardOpen);setTypingIndex(0);setSearchText('');setKeyboardShift(false);}} className="text-blue-700 min-h-11 px-3 text-sm">따라쓰기 키보드</button></div><p className="text-xs text-gray-400 mt-5">앱 정보·용량·업데이트는 학습 예시예요. 실제 스토어에서 다운로드하거나 결제하지 않아요.</p></div>}
    </main>
    {keyboardOpen&&<section aria-label="따라쓰기 키보드" className="bg-[#e3e5e9] p-2 border-t text-gray-900 shrink-0 max-h-[46%] overflow-y-auto">
      <div className="flex justify-between items-center text-xs px-2 mb-2"><span>‘똑똑수학탐험대’ 따라쓰기 · 직접 입력도 가능</span><button aria-label="키보드 닫기" className="p-2" onClick={()=>setKeyboardOpen(false)}><X size={17}/></button></div>
      {keyboardError&&<p role="status" className="text-xs text-red-700 text-center mb-1">{keyboardError}</p>}
      {[keyboardShift?['ㅃ','ㅉ','ㄸ','ㄲ','ㅆ','ㅛ','ㅕ','ㅑ','ㅒ','ㅖ']:['ㅂ','ㅈ','ㄷ','ㄱ','ㅅ','ㅛ','ㅕ','ㅑ','ㅐ','ㅔ'],['ㅁ','ㄴ','ㅇ','ㄹ','ㅎ','ㅗ','ㅓ','ㅏ','ㅣ'],['Shift','ㅋ','ㅌ','ㅊ','ㅍ','ㅠ','ㅜ','ㅡ','⌫']].map((row,i)=><div className="flex gap-1 justify-center mb-1 max-w-3xl mx-auto" key={i}>{row.map(key=><button key={key} aria-label={key==='Shift'?'쌍자음':key==='⌫'?'한 글자 지우기':key} onClick={()=>keyInput(key)} className={`flex-1 min-h-10 rounded-md shadow-sm text-lg ${TARGET_SEQUENCE[typingIndex]?.key===key?'bg-blue-500 text-white':'bg-white'}`}>{key==='Shift'?<ArrowBigUp size={21} strokeWidth={1.6} className="mx-auto" fill={keyboardShift?'currentColor':'none'}/>:key==='⌫'?<Delete size={21} strokeWidth={1.6} className="mx-auto"/>:key}</button>)}</div>)}
      {run('playstore-search-submit',submitSearch,<span className="text-blue-700">검색</span>)}
    </section>}
    {playStoreProfileOpen&&<div className="absolute inset-0 z-[80] bg-black/30 p-4 flex items-start justify-end" onClick={()=>setPlayStoreProfileOpen(false)}><section className="mt-12 bg-[#f1f5f4] rounded-3xl w-full max-w-sm p-4 shadow-xl" onClick={e=>e.stopPropagation()}><div className="flex items-center justify-between mb-4"><strong className="break-all">{googleAccount||'연습 계정'}</strong><button aria-label="프로필 닫기" className="p-3" onClick={()=>setPlayStoreProfileOpen(false)}><X size={19}/></button></div><p className="text-xs text-gray-500 mb-4">실제 계정 로그인 없이 연습 중</p>{run('playstore-manage',()=>{setPlayStoreView('manage');setPlayStoreProfileOpen(false);advanceQuest('playstore-manage');},'앱 및 기기 관리')}{['Play 프로텍트','결제 및 정기 결제','도움말'].map(title=><button key={title} className="p-3 block w-full text-left text-sm min-h-11" onClick={()=>{setPlayStoreProfileOpen(false);setHelp(title);}}>{title}</button>)}</section></div>}
    {detail&&<div role="dialog" aria-modal="true" aria-label="설치 전 앱 확인" className="absolute inset-0 z-[90] bg-black/40 flex items-center justify-center p-4"><section className="bg-white p-5 sm:p-7 rounded-3xl max-w-lg w-full max-h-[95%] overflow-y-auto shadow-2xl"><div className="flex justify-between items-center gap-3"><GalaxyAppIcon appName={detail.id} style={{width: 56, height: 56, flexShrink: 0}}/><h2 className="text-xl font-bold flex-1">{detail.name}</h2><button aria-label="앱 정보 닫기" onClick={()=>setDetail(null)} className="p-2"><X/></button></div><p className="text-sm text-green-700 my-2">{detail.dev}</p><div className="grid grid-cols-3 text-xs text-center bg-gray-50 p-3 rounded-xl my-4"><span>교육용 예시</span><span>무료</span><span>설치 연습</span></div><h3 className="font-bold">설치 전 확인</h3>{['선생님이 알려 준 앱 이름과 개발자가 맞아요.','유료 구매·광고·권한 정보를 확인했어요.','선생님이나 보호자가 설치를 허용했어요.'].map((label,i)=><label key={label} className="flex items-start gap-3 text-sm py-3"><input type="checkbox" checked={safety[i]} className="w-5 h-5 shrink-0" onChange={e=>{const next=[...safety] as [boolean,boolean,boolean];next[i]=e.target.checked;setSafety(next);if(next.every(Boolean))advanceQuest('playstore-review-safety');}}/>{label}</label>)}<p className="text-xs text-gray-500 mb-4">실제 앱에서는 ‘데이터 보안’과 필요한 권한도 살펴봐요. 필요 없는 권한은 허용하지 않아요.</p>{installedApps.includes(detail.id)?<button className="w-full bg-green-700 text-white rounded-full p-3 font-bold" onClick={()=>{const app=detail;setDetail(null);openApp(app);}}>열기</button>:<button disabled={!safety.every(Boolean)||!!installing} className="w-full bg-green-700 text-white rounded-full p-3 font-bold disabled:opacity-40" onClick={startInstall}>확인하고 설치</button>}</section></div>}
    {removeApp&&<div role="dialog" aria-modal="true" aria-label="앱 제거 확인" className="absolute inset-0 z-[90] bg-black/40 flex items-center justify-center p-5"><section className="bg-white p-6 rounded-3xl max-w-sm"><Trash2 className="text-gray-500 mb-3"/><h3 className="font-bold text-lg">{removeApp.name} 앱을 제거할까요?</h3><p className="text-sm text-gray-600 mt-3 mb-5">앱과 기기에 저장된 앱 데이터가 지워질 수 있어요. 필요한지 먼저 확인해요.</p><div className="flex justify-end gap-3"><button className="p-3" onClick={()=>setRemoveApp(null)}>취소</button>{run('playstore-uninstall-confirm',uninstall,<span className="text-green-700">제거</span>)}</div></section></div>}
    {help&&<div role="dialog" aria-modal="true" aria-label={help} className="absolute inset-0 z-[90] bg-black/40 flex items-center justify-center p-5"><section className="bg-white p-6 rounded-3xl max-w-md"><h3 className="font-bold text-xl mb-3">{help}</h3><p className="text-sm leading-7">{help==='결제 및 정기 결제'?'유료 앱과 정기 결제는 선생님이나 보호자에게 먼저 물어봐요. 무료 체험도 나중에 결제될 수 있어요. 이 연습 앱에서는 결제하지 않아요.':help==='Play 프로텍트'?'Play 프로텍트는 앱의 유해성을 검사하는 기능이에요. 공식 스토어를 이용하고, 출처를 모르는 설치 파일은 열지 않아요.':'앱 검색 → 개발자·가격·권한 확인 → 허락받고 설치 → 업데이트를 연습해요. 설치한 앱은 프로필의 앱 및 기기 관리에서 제거할 수 있어요.'}</p><button className="mt-5 p-3 w-full text-green-700 font-bold" onClick={()=>setHelp(null)}>확인</button></section></div>}
  </div>;
};
export default PlayStoreApp;
