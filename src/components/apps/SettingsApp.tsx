import React from 'react';
import { Search, X, User, ChevronLeft, Sun, Moon, Type, Check } from 'lucide-react';
import { ActionTarget, CuteStudent } from './shared';
import { SETTINGS_MENUS, PERMISSION_ICONS } from '@/data/appCatalog';
import type { PhotoItem } from '@/hooks/useDeviceState';

export interface SettingsAppProps {
  currentTargetId: string | null;
  advanceQuest: (id: string) => void;
  settingsSearch: string;
  setSettingsSearch: (v: string) => void;
  settingsMenu: string;
  setSettingsMenu: (v: string) => void;
  wifi: boolean;
  setWifi: (v: boolean) => void;
  wifiConnected: string | null;
  bluetooth: boolean;
  setBluetooth: (v: boolean) => void;
  airplane: boolean;
  setAirplane: (v: boolean) => void;
  brightness: number;
  setBrightness: (v: any) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  fontScale: number;
  setFontScale: (v: number) => void;
  wallpaper: string;
  setWallpaper: (v: string) => void;
  themeColor: string;
  setThemeColor: (v: string) => void;
  photos: PhotoItem[];
  appPermissions: Record<string, Record<string, boolean>>;
  setAppPermissions: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>;
  googleAccount: string | null;
  setGoogleAccount: (v: string | null) => void;
  logoutConfirmOpen: boolean;
  setLogoutConfirmOpen: (v: boolean) => void;
  accountAddOpen: boolean;
  setAccountAddOpen: (v: boolean) => void;
  setGoogleEmail: (v: string) => void;
  setGooglePassword: (v: string) => void;
  setGoogleConsent: (v: boolean) => void;
  setGoogleError: (v: string) => void;
  setGoogleLoginStep: (v: 'email' | 'password' | 'consent' | 'syncing' | 'done') => void;
  setGoogleLoginOpen: (v: boolean) => void;
}

const SettingsApp = (props: SettingsAppProps) => {
  const {
    currentTargetId, advanceQuest, settingsSearch, setSettingsSearch, settingsMenu, setSettingsMenu,
    wifi, setWifi, wifiConnected, bluetooth, setBluetooth, airplane, setAirplane,
    brightness, setBrightness, darkMode, setDarkMode, fontScale, setFontScale,
    wallpaper, setWallpaper, themeColor, setThemeColor, photos,
    appPermissions, setAppPermissions, googleAccount, setGoogleAccount,
    logoutConfirmOpen, setLogoutConfirmOpen, accountAddOpen, setAccountAddOpen,
    setGoogleEmail, setGooglePassword, setGoogleConsent, setGoogleError,
    setGoogleLoginStep, setGoogleLoginOpen,
  } = props;
  return (
    <div className="flex-1 bg-[#000000] text-white flex pt-8 overflow-hidden min-h-0 animate-[fadeIn_0.3s_ease-out]">
      <div className="w-1/3 md:w-1/4 border-r border-gray-800 bg-[#000000] flex flex-col py-4 overflow-y-auto min-h-0 shrink-0">

        <div className="px-3 md:px-6 mb-3">
          <div className="text-2xl md:text-3xl font-light mb-3">설정</div>
          <div className="flex items-center gap-2 bg-[#1c1c1e] rounded-full px-3 py-2">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              value={settingsSearch}
              onChange={(e) => setSettingsSearch(e.target.value)}
              placeholder="검색"
              className="bg-transparent outline-none text-sm text-white w-full min-w-0"
            />
            {settingsSearch && (
              <X size={14} className="text-gray-400 cursor-pointer shrink-0" onClick={() => setSettingsSearch('')}/>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 px-2 pb-10">
          <div className="px-3 py-2.5 flex items-center gap-3 bg-[#1c1c1e] rounded-2xl mb-2 cursor-pointer active:scale-[0.98] transition-transform">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shrink-0"><User size={18} className="text-white"/></div>
            <div className="flex flex-col min-w-0"><span className="font-semibold text-sm truncate">내 계정</span><span className="text-[11px] text-gray-400 truncate">탐험대 계정</span></div>
          </div>
          {SETTINGS_MENUS.filter(m => !settingsSearch || m.title.includes(settingsSearch) || m.sub.includes(settingsSearch)).map((menu) => (
            <ActionTarget
              key={menu.id} id={`settings-menu-${menu.id}`} currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={() => setSettingsMenu(menu.id)}
              className={`px-3 py-2.5 flex items-center gap-3 rounded-2xl cursor-pointer transition-all active:scale-[0.98] ${settingsMenu === menu.id ? 'bg-[#1c1c1e]' : 'hover:bg-[#1c1c1e]/50'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${menu.bg}`}>{menu.icon}</div>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className={`text-xs md:text-sm font-medium truncate ${settingsMenu === menu.id ? 'text-blue-400' : 'text-gray-200'}`}>{menu.title}</span>
                <span className="text-[10px] text-gray-500 truncate hidden md:block">{menu.sub}</span>
              </div>
            </ActionTarget>
          ))}
          {settingsSearch && SETTINGS_MENUS.filter(m => m.title.includes(settingsSearch) || m.sub.includes(settingsSearch)).length === 0 && (
            <div className="text-center text-gray-500 text-xs py-8">검색 결과 없음</div>
          )}
        </div>
      </div>



      <div className="flex-1 p-10 bg-[#000000] overflow-y-auto min-h-0">
        {settingsMenu === 'connections' && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <h2 className="text-3xl font-medium mb-10 text-gray-100 flex items-center gap-4"><ChevronLeft size={28} className="text-gray-400 cursor-pointer active:scale-90 transition-transform" /> 연결</h2>
            <div className="bg-[#1c1c1e] rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-800 transition-colors active:bg-gray-700">
                <div>
                  <div className="text-xl mb-1 font-medium">Wi-Fi</div>
                  <div className="text-base text-blue-400">{wifiConnected || '사용 안 함'}</div>
                </div>
                <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${wifi ? 'bg-blue-500' : 'bg-gray-600'}`} onClick={() => setWifi(!wifi)}>
                  <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${wifi ? 'translate-x-6' : ''} shadow-md`}></div>
                </div>
              </div>
              <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <div><div className="text-xl mb-1 font-medium">블루투스</div><div className="text-base text-gray-400">{bluetooth ? '켜짐' : '꺼짐'}</div></div>
                <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${bluetooth ? 'bg-blue-500' : 'bg-gray-600'}`} onClick={() => setBluetooth(!bluetooth)}>
                  <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${bluetooth ? 'translate-x-6' : ''} shadow-md`}></div>
                </div>
              </div>
              <div className="p-6 flex justify-between items-center">
                <div><div className="text-xl mb-1 font-medium">비행기 탑승 모드</div><div className="text-base text-gray-400">{airplane ? '모든 통신 꺼짐' : '꺼짐'}</div></div>
                <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${airplane ? 'bg-blue-500' : 'bg-gray-600'}`} onClick={() => setAirplane(!airplane)}>
                  <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${airplane ? 'translate-x-6' : ''} shadow-md`}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {settingsMenu === 'display' && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <h2 className="text-3xl font-medium mb-10 text-gray-100 flex items-center gap-4"><ChevronLeft size={28} className="text-gray-400 cursor-pointer active:scale-90 transition-transform" /> 디스플레이</h2>
            <div className="bg-[#1c1c1e] rounded-3xl overflow-hidden p-8 mb-4">
              <div className="text-xl font-medium mb-6">밝기</div>
              <div className="flex items-center gap-6">
                <Sun size={28} className="text-gray-400" />
                <ActionTarget id="settings-brightness-slider" currentTargetId={currentTargetId} advanceQuest={advanceQuest} className="flex-1">
                  <input type="range" min="10" max="100" value={brightness}
                    onChange={(e) => { setBrightness(e.target.value); advanceQuest('settings-brightness-slider'); }}
                    className="w-full accent-blue-500 h-4 bg-gray-700 rounded-full appearance-none cursor-pointer" />
                </ActionTarget>
              </div>
            </div>
            <div className="bg-[#1c1c1e] rounded-3xl overflow-hidden p-6 md:p-8 mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Moon size={24} className="text-blue-300 shrink-0"/>
                <div className="min-w-0">
                  <div className="text-lg md:text-xl font-medium">다크 모드</div>
                  <div className="text-xs md:text-sm text-gray-400 mt-1">눈이 편안한 어두운 화면</div>
                </div>
              </div>
              <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors shrink-0 ${darkMode ? 'bg-blue-500' : 'bg-gray-600'}`} onClick={() => setDarkMode(!darkMode)}>
                <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${darkMode ? 'translate-x-6' : ''} shadow-md`}></div>
              </div>
            </div>
            <div className="bg-[#1c1c1e] rounded-3xl overflow-hidden p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Type size={22} className="text-gray-400"/>
                <div className="text-lg md:text-xl font-medium">글자 크기</div>
              </div>
              <div className="text-white mb-4 truncate" style={{ fontSize: `${fontScale * 16}px` }}>안드로이드 탐험대</div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">가</span>
                <ActionTarget id="settings-fontsize-slider" currentTargetId={currentTargetId} advanceQuest={advanceQuest} className="flex-1">
                  <input type="range" min="0.8" max="1.4" step="0.1" value={fontScale}
                    onChange={(e) => { setFontScale(parseFloat(e.target.value)); advanceQuest('settings-fontsize-slider'); }}
                    className="w-full accent-blue-500 h-3 bg-gray-700 rounded-full appearance-none cursor-pointer" />
                </ActionTarget>
                <span className="text-2xl text-gray-300">가</span>
              </div>
            </div>
          </div>
        )}

        {settingsMenu === 'wallpaper' && (() => {
          const wallpaperPresets = [
            { name: '기본 보라', value: 'radial-gradient(circle at 100% 30%, #c7d2fe 0%, #818cf8 30%, transparent 60%), radial-gradient(circle at 0% 100%, #e879f9 0%, #818cf8 40%, transparent 70%), #1e3a8a', theme: '#818cf8', tutorial: true },
            { name: '숲 그린', value: 'linear-gradient(135deg, #065f46 0%, #166534 100%)', theme: '#10b981' },
            { name: '와인 레드', value: 'linear-gradient(135deg, #7f1d1d 0%, #9f1239 100%)', theme: '#ef4444' },
            { name: '오션 블루', value: 'linear-gradient(180deg, #0ea5e9 0%, #0c4a6e 100%)', theme: '#0ea5e9' },
            { name: '선셋', value: 'linear-gradient(135deg, #f97316 0%, #db2777 60%, #581c87 100%)', theme: '#f97316' },
            { name: '미드나잇', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)', theme: '#6366f1' },
            { name: '파스텔', value: 'linear-gradient(135deg, #fbcfe8 0%, #c7d2fe 50%, #bae6fd 100%)', theme: '#ec4899' },
            { name: '미니멀 그레이', value: 'linear-gradient(135deg, #4b5563 0%, #1f2937 100%)', theme: '#64748b' },
          ];
          const themes = ['#3b82f6', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];
          const applyWallpaper = (wp: any) => { setWallpaper(wp.value); if (wp.theme) setThemeColor(wp.theme); };
          return (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-3xl font-medium mb-10 text-gray-100 flex items-center gap-4"><ChevronLeft size={28} className="text-gray-400 cursor-pointer active:scale-90 transition-transform" /> 배경화면 및 스타일</h2>
              <div className="bg-[#1c1c1e] rounded-3xl overflow-hidden p-6 md:p-8 mb-4">
                <div className="text-xl font-medium mb-2">배경화면 선택</div>
                <div className="text-sm text-gray-400 mb-6">배경을 바꾸면 시스템 테마 색도 자동으로 어울리게 바뀝니다 (Material You)</div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                  {wallpaperPresets.map((wp, i) => {
                    const selected = wallpaper === wp.value;
                    const node = (
                      <div onClick={() => applyWallpaper(wp)} className={`relative aspect-[10/16] rounded-2xl cursor-pointer active:scale-95 transition-all ${selected ? 'ring-4' : 'hover:ring-2 ring-white/40'}`} style={{ background: wp.value, ...(selected ? { boxShadow: `0 0 0 4px ${wp.theme || themeColor}` } : {}) }}>
                        {selected && <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: wp.theme || themeColor }}><Check size={12} className="text-white"/></div>}
                        <div className="absolute bottom-1 inset-x-1 text-[10px] text-white/90 bg-black/30 rounded px-1 py-0.5 text-center truncate">{wp.name}</div>
                      </div>
                    );
                    if (wp.tutorial) {
                      return (
                        <ActionTarget key={i} id="settings-wallpaper-change" currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={() => applyWallpaper(wp)}>
                          {node}
                        </ActionTarget>
                      );
                    }
                    return <div key={i}>{node}</div>;
                  })}


                  {photos.slice(0, 4).map(p => (
                    <div key={p.id} onClick={() => setWallpaper('#1f2937')} className="relative aspect-[10/16] rounded-2xl cursor-pointer active:scale-95 ring-2 ring-white/40 overflow-hidden bg-[#1a1a1a] p-1">
                      <CuteStudent seed={p.seed}/>
                      <div className="absolute bottom-1 inset-x-1 text-[10px] text-white bg-black/40 rounded px-1 text-center">내 사진</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#1c1c1e] rounded-3xl p-6 md:p-8">
                <div className="text-xl font-medium mb-2">테마 색상</div>
                <div className="text-sm text-gray-400 mb-6">앱 강조 색상을 선택하세요</div>
                <div className="flex gap-4 flex-wrap">
                  {themes.map(c => (
                    <div key={c} onClick={() => setThemeColor(c)} className={`w-14 h-14 rounded-full cursor-pointer active:scale-90 transition-all shadow-lg ${themeColor === c ? 'ring-4 ring-white' : ''}`} style={{ background: c }}>
                      {themeColor === c && <div className="w-full h-full flex items-center justify-center"><Check size={22} className="text-white"/></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {settingsMenu === 'privacy' && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <h2 className="text-3xl font-medium mb-8 text-gray-100 flex items-center gap-4"><ChevronLeft size={28} className="text-gray-400"/> 권한 관리자</h2>
            <div className="text-sm text-gray-400 mb-6">앱별로 카메라·위치·마이크 등 권한을 켜거나 끌 수 있어요.</div>
            <div className="space-y-3">
              {Object.entries(appPermissions).map(([appName, perms]) => {
                const APP_DISPLAY: Record<string, string> = { KakaoTalk: '톡톡', PlayStore: '앱 마켓', YouTube: '튜브', Chrome: '웹브라우저', Gmail: '메일' };
                const display = APP_DISPLAY[appName] || appName;
                return (
                <div key={appName} className="bg-[#1c1c1e] rounded-3xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-gray-700 flex items-center justify-center font-bold">{display[0]}</div>
                    <div className="font-bold text-lg">{display}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(perms).map(([pname, enabled]) => {
                      const toggle = (
                        <div className="flex items-center justify-between bg-[#2c2c2e] rounded-xl px-3 py-2">
                          <span className="text-sm flex items-center gap-2"><span>{PERMISSION_ICONS[pname] || '•'}</span>{pname}</span>
                          <div
                            onClick={() => setAppPermissions(prev => ({ ...prev, [appName]: { ...prev[appName], [pname]: !enabled } }))}
                            className={`w-10 h-6 rounded-full p-0.5 cursor-pointer transition-colors ${enabled ? 'bg-blue-500' : 'bg-gray-600'}`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${enabled ? 'translate-x-4' : ''} shadow-md`}></div>
                          </div>
                        </div>
                      );
                      return (
                        <ActionTarget
                          key={pname}
                          id={`perm-${appName}-${pname}`}
                          currentTargetId={currentTargetId}
                          advanceQuest={advanceQuest}
                          onClick={() => setAppPermissions(prev => ({ ...prev, [appName]: { ...prev[appName], [pname]: !enabled } }))}
                        >
                          {toggle}
                        </ActionTarget>
                      );
                    })}
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        )}

        {settingsMenu === 'account' && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <h2 className="text-3xl font-medium mb-8 text-gray-100 flex items-center gap-4"><ChevronLeft size={28} className="text-gray-400"/> 계정 및 백업</h2>
            <div className="bg-[#1c1c1e] rounded-3xl overflow-hidden mb-4">
              <div className="p-6 border-b border-gray-800">
                <div className="text-sm text-gray-400 mb-1">탐험대 계정</div>
                <div className="text-lg font-medium">로그인되지 않음</div>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-400 mb-3">탐험대 계정</div>
                {googleAccount ? (
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">{googleAccount[0].toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{googleAccount}</div>
                      <div className="text-xs text-green-400 flex items-center gap-1"><Check size={12}/> 동기화 켜짐</div>
                    </div>
                    <ActionTarget
                      id="google-logout-btn" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                      onClick={() => setLogoutConfirmOpen(true)}
                    >
                      <button className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-sm font-bold border border-red-500/40 hover:bg-red-500/30 active:scale-95 transition">로그아웃</button>
                    </ActionTarget>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">등록된 탐험대 계정이 없습니다.</div>
                )}
              </div>
            </div>

            {logoutConfirmOpen && (
              <div className="fixed inset-0 z-[210] bg-black/70 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]" onClick={() => setLogoutConfirmOpen(false)}>
                <div className="bg-[#1c1c1e] text-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <div className="text-xl font-bold mb-2">로그아웃 하시겠어요?</div>
                  <div className="text-sm text-gray-400 mb-6">로그아웃하면 이 기기에서 메일, 튜브 등 탐험대 서비스 동기화가 중지됩니다. 언제든 다시 로그인할 수 있어요.</div>
                  <div className="flex gap-2">
                    <button onClick={() => setLogoutConfirmOpen(false)} className="flex-1 py-3 rounded-2xl bg-[#2c2c2e] hover:bg-[#3a3a3c] active:scale-95 font-bold text-sm transition">취소</button>
                    <ActionTarget
                      id="google-logout-confirm" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                      onClick={() => {
                        setGoogleAccount(null);
                        setGoogleEmail(''); setGooglePassword(''); setGoogleConsent(false);
                        setGoogleLoginStep('email');
                        setLogoutConfirmOpen(false);
                      }}
                      className="flex-1"
                    >
                      <button className="w-full py-3 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 font-bold text-sm transition">로그아웃</button>
                    </ActionTarget>
                  </div>
                </div>
              </div>
            )}
            <ActionTarget
              id="account-add-btn" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={() => setAccountAddOpen(true)}
              className="bg-[#1c1c1e] rounded-3xl p-6 flex items-center gap-4 cursor-pointer hover:bg-[#2c2c2e] active:scale-[0.99] transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-light">+</div>
              <div>
                <div className="font-medium text-lg">계정 추가</div>
                <div className="text-xs text-gray-400">탐험대 · 삼성 · MS 등</div>
              </div>
            </ActionTarget>

            {accountAddOpen && (
              <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]" onClick={() => setAccountAddOpen(false)}>
                <div className="bg-[#1c1c1e] text-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xl font-bold">계정 추가</div>
                    <X size={22} className="cursor-pointer text-gray-400" onClick={() => setAccountAddOpen(false)}/>
                  </div>
                  <div className="space-y-2">
                    <ActionTarget
                      id="account-google" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                      onClick={() => {
                        setAccountAddOpen(false);
                        setGoogleLoginOpen(true);
                        setGoogleLoginStep('email');
                        setGoogleEmail(''); setGooglePassword(''); setGoogleError(''); setGoogleConsent(false);
                      }}
                      className="p-4 rounded-2xl bg-[#2c2c2e] hover:bg-[#3a3a3c] flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all"
                    >
                      <svg viewBox="0 0 48 48" className="w-7 h-7">
                        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
                        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
                        <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.4l-6.5-5.5c-2 1.5-4.6 2.4-7.5 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.4 39.6 16.1 44 24 44z"/>
                        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.5 5.5C41.4 35.4 44 30 44 24c0-1.3-.1-2.4-.4-3.5z"/>
                      </svg>
                      <div className="flex-1"><div className="font-semibold">탐험대</div><div className="text-xs text-gray-400">메일 · 튜브 · 드라이브</div></div>
                    </ActionTarget>
                    {['삼성', 'MS', '아웃룩'].map(s => (
                      <div key={s} className="p-4 rounded-2xl bg-[#2c2c2e] flex items-center gap-4 opacity-60">
                        <div className="w-7 h-7 rounded-lg bg-gray-600 flex items-center justify-center text-xs font-bold">{s[0]}</div>
                        <div className="flex-1"><div className="font-semibold">{s}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}



      </div>
    </div>
  );
};

export default SettingsApp;
