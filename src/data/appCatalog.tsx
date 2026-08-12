import React from 'react';
import {
  Wifi, Volume2, Sun, Settings,
  ShieldCheck, User, Bell,
  Lock, ShieldAlert, AlertTriangle, HeartPulse, BatteryCharging,
  Grid, Sliders, PaintBucket, MapPin, Home
} from 'lucide-react';

const SETTINGS_MENUS = [
  { id: 'account', icon: <User size={20} className="text-white"/>, title: '계정 및 백업', sub: '계정 관리 · Smart Switch', bg: 'bg-blue-500' },
  { id: 'connections', icon: <Wifi size={20} className="text-white"/>, title: '연결', sub: 'Wi-Fi · 블루투스 · 비행기 탑승 모드', bg: 'bg-blue-500' },
  { id: 'sounds', icon: <Volume2 size={20} className="text-white"/>, title: '소리 및 진동', sub: '소리 모드 · 벨소리', bg: 'bg-purple-500' },
  { id: 'notifications', icon: <Bell size={20} className="text-white"/>, title: '알림', sub: '앱 알림 · 상태표시줄', bg: 'bg-orange-500' },
  { id: 'display', icon: <Sun size={20} className="text-white"/>, title: '디스플레이', sub: '밝기 · 화면 보호', bg: 'bg-green-500' },
  { id: 'wallpaper', icon: <PaintBucket size={20} className="text-white"/>, title: '배경화면 및 스타일', sub: '배경화면 · 컬러 팔레트', bg: 'bg-pink-500' },
  { id: 'home', icon: <Home size={20} className="text-white"/>, title: '홈 화면', sub: '레이아웃 · 앱 아이콘 배지', bg: 'bg-blue-400' },
  { id: 'lock', icon: <Lock size={20} className="text-white"/>, title: '잠금화면', sub: '화면 잠금 방식', bg: 'bg-teal-500' },
  { id: 'security', icon: <ShieldCheck size={20} className="text-white"/>, title: '생체 인식 및 보안', sub: '얼굴 인식 · 지문', bg: 'bg-indigo-500' },
  { id: 'privacy', icon: <ShieldAlert size={20} className="text-white"/>, title: '개인정보 보호', sub: '권한 사용 · 권한 관리자', bg: 'bg-green-600' },
  { id: 'location', icon: <MapPin size={20} className="text-white"/>, title: '위치', sub: '위치 요청', bg: 'bg-green-400' },
  { id: 'safety', icon: <AlertTriangle size={20} className="text-white"/>, title: '안전 및 긴급', sub: '의료정보 · 재난문자', bg: 'bg-red-500' },
  { id: 'advanced', icon: <Settings size={20} className="text-white"/>, title: '유용한 기능', sub: 'Android Auto · 실험실 · 측면 버튼', bg: 'bg-orange-400' },
  { id: 'digital', icon: <HeartPulse size={20} className="text-white"/>, title: '디지털 웰빙 및 자녀 보호 기능', sub: '사용 시간 · 앱 타이머', bg: 'bg-green-500' },
  { id: 'battery', icon: <BatteryCharging size={20} className="text-white"/>, title: '배터리 및 디바이스 케어', sub: '저장공간 · RAM · 디바이스 보호', bg: 'bg-teal-500' },
  { id: 'apps', icon: <Grid size={20} className="text-white"/>, title: '애플리케이션', sub: '기본 앱 · 애플리케이션 설정', bg: 'bg-blue-500' },
  { id: 'general', icon: <Sliders size={20} className="text-white"/>, title: '일반', sub: '언어 및 키보드 · 날짜 및 시간', bg: 'bg-gray-500' },
];

const WIFI_NETWORKS = [
  { id: 'wifi-net-0', name: '탐험대_WiFi', secure: true, signal: 4 },
  { id: 'wifi-net-1', name: 'Home_Guest', secure: false, signal: 3 },
  { id: 'wifi-net-2', name: 'iptime_5G', secure: true, signal: 4 },
  { id: 'wifi-net-3', name: 'STARBUCKS_WIFI', secure: false, signal: 2 },
  { id: 'wifi-net-4', name: 'AndroidHotspot', secure: true, signal: 3 },
];

const PLAYSTORE_APPS = [
  { id: 'duolingo', name: '링고학습', dev: '링고', color: '#22c55e', label: '🦉' },
  { id: 'minecraft', name: '블록월드', dev: '블록스튜디오', color: '#15803d', label: '⛏️' },
  { id: 'classting', name: '학교톡', dev: '교실연구소', color: '#f97316', label: 'C' },
  { id: 'toss', name: '간편페이', dev: '페이랩', color: '#2563eb', label: 'T' },
  { id: 'melon', name: '뮤직박스', dev: '톡톡뮤직', color: '#10b981', label: '♪' },
];

const WIDGET_CATALOG = [
  { id: 'clock', name: '시계', desc: '큰 시간 표시', icon: '🕐' },
  { id: 'weather', name: '날씨', desc: '현재 날씨', icon: '☀️' },
  { id: 'calendar', name: '캘린더', desc: '오늘 날짜', icon: '📅' },
  { id: 'music', name: '음악', desc: '재생 컨트롤', icon: '🎵' },
  { id: 'fitness', name: '걸음 수', desc: '오늘의 활동', icon: '👟' },
];

const PERMISSION_ICONS: Record<string, string> = { 카메라: '📷', 마이크: '🎙️', 위치: '📍', 저장공간: '💾', 연락처: '👥' };


const TARGET_SEQUENCE = [
  { key: 'Shift', display: '' }, { key: 'ㄸ', display: 'ㄸ' }, { key: 'ㅗ', display: '또' }, { key: 'ㄱ', display: '똑' },
  { key: 'Shift', display: '똑' }, { key: 'ㄸ', display: '똑ㄸ' }, { key: 'ㅗ', display: '똑또' }, { key: 'ㄱ', display: '똑똑' },
  { key: 'ㅅ', display: '똑똑ㅅ' }, { key: 'ㅜ', display: '똑똑수' },
  { key: 'ㅎ', display: '똑똑수ㅎ' }, { key: 'ㅏ', display: '똑똑수하' }, { key: 'ㄱ', display: '똑똑수학' },
  { key: 'ㅌ', display: '똑똑수학ㅌ' }, { key: 'ㅏ', display: '똑똑수학타' }, { key: 'ㅁ', display: '똑똑수학탐' },
  { key: 'ㅎ', display: '똑똑수학탐ㅎ' }, { key: 'ㅓ', display: '똑똑수학탐허' }, { key: 'ㅁ', display: '똑똑수학탐험' },
  { key: 'ㄷ', display: '똑똑수학탐험ㄷ' }, { key: 'ㅐ', display: '똑똑수학탐험대' }
];
