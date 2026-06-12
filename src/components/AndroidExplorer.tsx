// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi, Bluetooth, Volume2, VolumeX, Vibrate,
  Sun, Camera, Settings, Play, Search,
  ChevronLeft, BatteryMedium, Signal, Check, Trash2, X, GripHorizontal,
  Mic, MoreHorizontal, RefreshCcw, Plane, Flashlight, MapPin,
  MonitorPlay, ShieldCheck, User, Bell, ImageIcon, Home,
  Lock, ShieldAlert, AlertTriangle, HeartPulse, BatteryCharging,
  Grid, Sliders, Smartphone, PaintBucket, Moon, Type, ChevronUp,
  Cloud, MessageSquare, Power, Minus, Share2, Edit3, Heart, Zap, Menu
} from 'lucide-react';
import iconStore from '@/assets/icons/store.png';
import iconGallery from '@/assets/icons/gallery.png';
import iconPlayStore from '@/assets/icons/playstore.png';
import iconFolder from '@/assets/icons/folder.png';
import iconMessages from '@/assets/icons/messages.png';
import iconInternet from '@/assets/icons/internet.png';
import iconCamera from '@/assets/icons/camera.png';
import iconPhone from '@/assets/icons/phone.png';

const APP_ICON_IMAGES: Record<string, string> = {
  Store: iconStore,
  Gallery: iconGallery,
  PlayStore: iconPlayStore,
  Folder: iconFolder,
  Messages: iconMessages,
  Internet: iconInternet,
  Camera: iconCamera,
  Phone: iconPhone,
};

const QUESTS = [
  { id: 0, text: "갤럭시탭이 잠겨있어요. 잠금화면을 위로 밀어 올려 잠금을 해제하세요.", targetId: 'lock-swipe', exp: 10 },
  { id: 1, text: "상단 표시줄을 드래그하여 퀵패널을 여세요.", targetId: 'swipe-trigger', exp: 20 },
  { id: 2, text: "와이파이 아이콘의 이름을 눌러 와이파이 설정을 켜세요.", targetId: 'quick-wifi-toggle', exp: 20 },
  { id: 3, text: "'탐험대_WiFi' 네트워크를 선택하세요.", targetId: 'wifi-net-0', exp: 20 },
  { id: 4, text: "비밀번호 입력칸을 누르고 아무 비밀번호나 입력하세요.", targetId: 'wifi-pw-input', exp: 10 },
  { id: 5, text: "연결 버튼을 누르세요.", targetId: 'wifi-connect-btn', exp: 30 },
  { id: 6, text: "빈 곳을 터치하거나 위로 올려 퀵패널을 닫으세요.", targetId: 'quick-panel-bg', exp: 10 },
  { id: 7, text: "설정 앱을 실행하세요.", targetId: 'app-icon-Settings', exp: 20 },
  { id: 8, text: "좌측 메뉴에서 '디스플레이'를 찾아 선택하세요.", targetId: 'settings-menu-display', exp: 20 },
  { id: 9, text: "우측 화면의 밝기 조절 바를 움직여 밝기를 조절해보세요.", targetId: 'settings-brightness-slider', exp: 20 },
  { id: 10, text: "좌측 메뉴를 위로 올려 '배경화면 및 스타일'을 선택하세요.", targetId: 'settings-menu-wallpaper', exp: 20 },
  { id: 11, text: "우측 화면에서 새로운 배경화면 색상을 선택하세요.", targetId: 'settings-wallpaper-change', exp: 30 },
  { id: 12, text: "하단의 둥근 사각형(홈) 버튼을 눌러 바탕화면으로 가세요.", targetId: 'nav-home', exp: 10 },
  { id: 13, text: "바탕화면의 '카메라' 앱을 1초 이상 꾹~ 길게 누르세요.", targetId: 'app-icon-Camera-long-press', exp: 30 },
  { id: 14, text: "아이콘이 깜빡거리면 카메라 앱을 드래그하여 다른 위치로 옮기세요.", targetId: 'drag-camera', exp: 30 },
  { id: 15, text: "이동된 '카메라' 앱을 클릭하여 실행하세요.", targetId: 'app-icon-Camera', exp: 20 },
  { id: 16, text: "하단 중앙의 둥근 셔터 버튼을 눌러 학생 사진을 촬영하세요.", targetId: 'camera-shutter', exp: 30 },
  { id: 17, text: "하단의 홈 버튼을 눌러 바탕화면으로 가세요.", targetId: 'nav-home', exp: 10 },
  { id: 18, text: "갤러리 앱을 실행하세요.", targetId: 'app-icon-Gallery', exp: 20 },
  { id: 19, text: "방금 찍은 사진을 선택하세요.", targetId: 'gallery-photo-0', exp: 20 },
  { id: 20, text: "하단 휴지통 아이콘을 눌러 사진을 삭제하세요.", targetId: 'gallery-delete', exp: 20 },
  { id: 21, text: "삭제 확인(이동) 버튼을 누르세요.", targetId: 'gallery-delete-confirm', exp: 10 },
  { id: 22, text: "하단의 홈 버튼을 눌러 바탕화면으로 가세요.", targetId: 'nav-home', exp: 10 },
  { id: 23, text: "앱 마켓 앱을 실행하세요.", targetId: 'app-icon-PlayStore', exp: 20 },
  { id: 24, text: "상단 검색창을 클릭하세요.", targetId: 'playstore-search-bar', exp: 10 },
  { id: 25, text: "가상 키보드에서 파란색 자판을 순서대로 눌러 '똑똑수학탐험대'를 완성하세요.", targetId: 'playstore-search-input', exp: 20 },
  { id: 26, text: "키보드의 파란색 '검색' 버튼을 누르세요.", targetId: 'playstore-search-submit', exp: 10 },
  { id: 27, text: "'똑똑수학탐험대' 앱의 설치 버튼을 누르세요.", targetId: 'playstore-install-btn', exp: 30 },
  { id: 28, text: "홈 버튼을 눌러 바탕화면으로 돌아가세요.", targetId: 'nav-home', exp: 10 },
  { id: 29, text: "방금 설치한 '수학탐험대' 앱을 바탕화면에서 실행해보세요.", targetId: 'app-icon-math', exp: 20 },
  { id: 30, text: "홈 버튼을 눌러 다시 바탕화면으로 가세요.", targetId: 'nav-home', exp: 10 },
  { id: 31, text: "상단을 드래그하여 퀵패널을 여세요.", targetId: 'swipe-trigger', exp: 10 },
  { id: 32, text: "음량 슬라이더를 움직여 소리 크기를 조절해보세요.", targetId: 'quick-volume-slider', exp: 20 },
  { id: 33, text: "소리 모드 버튼에서 '진동'을 눌러보세요.", targetId: 'quick-sound-vibrate', exp: 20 },
  { id: 34, text: "비행기 탑승 모드를 켜보세요. (공공장소·비행 시 사용)", targetId: 'quick-airplane', exp: 20 },
  { id: 35, text: "'스크린샷' 버튼을 눌러 화면을 캡처해보세요.", targetId: 'quick-screenshot', exp: 20 },
  { id: 36, text: "'다크 모드' 버튼을 눌러 어두운 화면으로 바꿔보세요.", targetId: 'quick-darkmode', exp: 20 },
  { id: 37, text: "'블루투스' 버튼을 눌러 켜고 기기 목록을 여세요.", targetId: 'quick-bluetooth', exp: 20 },
  { id: 38, text: "'무선 이어버드'를 선택해 페어링하세요.", targetId: 'bt-device-buds', exp: 30 },
  { id: 39, text: "홈 버튼을 눌러 바탕화면으로 가세요.", targetId: 'nav-home', exp: 10 },
  { id: 40, text: "'메모' (빨간 아이콘) 앱을 실행하세요.", targetId: 'app-icon-Notes', exp: 20 },
  { id: 41, text: "오른쪽 아래 '+' 버튼을 눌러 새 메모를 만드세요.", targetId: 'notes-new', exp: 20 },
  { id: 42, text: "흰 캔버스 위에 손가락이나 마우스로 자유롭게 그려보세요.", targetId: 'notes-draw', exp: 30 },
  { id: 43, text: "오른쪽 위 '저장' 버튼을 눌러 메모를 보관하세요.", targetId: 'notes-save', exp: 20 },
  { id: 44, text: "홈 버튼을 눌러 바탕화면으로 가세요.", targetId: 'nav-home', exp: 10 },
  { id: 45, text: "설정 앱을 다시 실행하세요.", targetId: 'app-icon-Settings', exp: 10 },
  { id: 46, text: "'디스플레이' 메뉴를 선택하세요.", targetId: 'settings-menu-display', exp: 10 },
  { id: 47, text: "글자 크기 슬라이더를 움직여 글자를 크게 만들어보세요.", targetId: 'settings-fontsize-slider', exp: 20 },
  // ===== 알림 확인 및 지우기 =====
  { id: 48, text: "홈 버튼을 눌러 바탕화면으로 가세요.", targetId: 'nav-home', exp: 10 },
  { id: 49, text: "상단 표시줄을 다시 드래그하여 퀵패널(알림)을 여세요.", targetId: 'swipe-trigger', exp: 10 },
  { id: 50, text: "톡톡 알림을 탭하여 메시지를 확인하세요.", targetId: 'notif-tap-1', exp: 20 },
  { id: 51, text: "메시지 알림을 옆으로 스와이프(드래그)해서 지우세요.", targetId: 'notif-dismiss-2', exp: 20 },
  { id: 52, text: "'모두 지우기' 버튼을 눌러 남은 알림을 정리하세요.", targetId: 'notif-clear-all', exp: 20 },
  // ===== 앱 권한 관리 =====
  { id: 53, text: "설정 앱을 실행하세요.", targetId: 'app-icon-Settings', exp: 10 },
  { id: 54, text: "좌측 메뉴에서 '개인정보 보호'를 선택하세요.", targetId: 'settings-menu-privacy', exp: 20 },
  { id: 55, text: "톡톡 카드의 '위치' 권한 스위치를 켜주세요.", targetId: 'perm-KakaoTalk-위치', exp: 30 },
  // ===== 구글 계정 추가 및 동기화 =====
  { id: 56, text: "홈 버튼을 눌러 바탕화면으로 가세요.", targetId: 'nav-home', exp: 10 },
  { id: 57, text: "설정 앱을 다시 실행하세요.", targetId: 'app-icon-Settings', exp: 10 },
  { id: 58, text: "'계정 및 백업' 메뉴를 선택하세요.", targetId: 'settings-menu-account', exp: 20 },
  { id: 59, text: "'계정 추가' 버튼을 누르세요.", targetId: 'account-add-btn', exp: 20 },
  { id: 60, text: "계정 종류에서 '탐험대'를 선택하세요.", targetId: 'account-google', exp: 20 },
  { id: 61, text: "이메일 입력칸에 'wttest@tamhem.com' 을 입력 후 '다음'을 누르세요.", targetId: 'google-email-next', exp: 30 },
  { id: 62, text: "비밀번호에 'Ghkdlxld1!' 을 입력 후 '다음'을 누르세요.", targetId: 'google-password-next', exp: 30 },
  { id: 63, text: "약관에 동의(체크) 후 '동의함'을 누르세요.", targetId: 'google-consent-agree', exp: 20 },
  { id: 64, text: "동기화 완료 화면에서 '확인'을 누르세요.", targetId: 'google-done', exp: 30 },
  // ===== 앱 업데이트 =====
  { id: 65, text: "앱 마켓 앱을 실행하세요.", targetId: 'app-icon-PlayStore', exp: 10 },
  { id: 66, text: "우측 상단의 프로필 아바타를 누르세요.", targetId: 'playstore-avatar', exp: 20 },
  { id: 67, text: "메뉴에서 '앱 및 기기 관리'를 선택하세요.", targetId: 'playstore-manage', exp: 20 },
  { id: 68, text: "'모두 업데이트' 버튼을 눌러 앱을 최신으로 만들어보세요.", targetId: 'playstore-update-all', exp: 30 },
  // ===== 계정 전환 / 로그아웃 =====
  { id: 69, text: "홈 버튼을 눌러 바탕화면으로 가세요.", targetId: 'nav-home', exp: 10 },
  { id: 70, text: "설정 앱을 실행하세요.", targetId: 'app-icon-Settings', exp: 10 },
  { id: 71, text: "'계정 및 백업' 메뉴로 다시 이동하세요.", targetId: 'settings-menu-account', exp: 10 },
  { id: 72, text: "탐험대 계정 카드의 '로그아웃' 버튼을 누르세요.", targetId: 'google-logout-btn', exp: 20 },
  { id: 73, text: "확인 창에서 '로그아웃'을 눌러 정말로 로그아웃하세요.", targetId: 'google-logout-confirm', exp: 20 },
  { id: 74, text: "'계정 추가' 버튼을 눌러 다른 계정으로 다시 로그인해보세요.", targetId: 'account-add-btn', exp: 20 },
  // ===== 블루투스 페어링 PIN =====
  { id: 75, text: "페어링 코드를 확인하고 '페어링' 버튼을 눌러 연결을 완료하세요.", targetId: 'bt-pair-confirm', exp: 20 },
  // ===== 계산기로 12 × 8 = 96 =====
  { id: 76, text: "홈 버튼을 눌러 바탕화면으로 가세요.", targetId: 'nav-home', exp: 10 },
  { id: 77, text: "'계산기' 앱을 실행하세요.", targetId: 'app-icon-Calculator', exp: 10 },
  { id: 78, text: "숫자 '1' 을 누르세요.", targetId: 'calc-key-1', exp: 10 },
  { id: 79, text: "숫자 '2' 를 누르세요.", targetId: 'calc-key-2', exp: 10 },
  { id: 80, text: "곱하기(×) 버튼을 누르세요.", targetId: 'calc-key-mul', exp: 10 },
  { id: 81, text: "숫자 '8' 을 누르세요.", targetId: 'calc-key-8', exp: 10 },
  { id: 82, text: "'=' 버튼을 눌러 결과(96)를 확인하세요.", targetId: 'calc-result-96', exp: 30 },
  // ===== 갤러리 사진 확대/축소 =====
  { id: 83, text: "홈 버튼을 눌러 바탕화면으로 가세요.", targetId: 'nav-home', exp: 10 },
  { id: 84, text: "갤러리 앱을 실행하세요.", targetId: 'app-icon-Gallery', exp: 10 },
  { id: 85, text: "사진 한 장을 선택해 크게 보세요.", targetId: 'gallery-photo-0', exp: 10 },
  { id: 86, text: "'+' 버튼을 눌러 사진을 확대하세요.", targetId: 'photo-zoom-in', exp: 20 },
  { id: 87, text: "'−' 버튼을 눌러 사진을 다시 축소하세요.", targetId: 'photo-zoom-out', exp: 20 },
  // ===== 인터넷 & 검색 (삼성 인터넷) =====
  { id: 88, text: "홈 버튼을 눌러 바탕화면으로 가세요.", targetId: 'nav-home', exp: 10 },
  { id: 89, text: "바탕화면에서 '인터넷' 앱을 실행하세요.", targetId: 'app-icon-Internet', exp: 20 },
  { id: 90, text: "상단 주소창을 눌러 입력창을 여세요.", targetId: 'internet-address-bar', exp: 20 },
  { id: 91, text: "키보드로 'naver.com'을 입력하고 '이동'을 누르세요.", targetId: 'internet-url-go', exp: 40 },
  { id: 92, text: "← 뒤로가기 버튼을 눌러 이전 페이지로 가세요.", targetId: 'internet-back', exp: 20 },
  { id: 93, text: "주소창을 다시 눌러 검색을 시작하세요.", targetId: 'internet-address-bar', exp: 10 },
  { id: 94, text: "추천 검색어 '초등학교'를 눌러 검색하세요.", targetId: 'internet-search-suggest', exp: 30 },
  { id: 95, text: "주소창 옆 별(☆) 아이콘을 눌러 이 페이지를 즐겨찾기에 추가하세요.", targetId: 'internet-bookmark-add', exp: 30 },
  { id: 96, text: "메뉴(☰) 버튼을 눌러 즐겨찾기 목록을 여세요.", targetId: 'internet-menu-open', exp: 20 },
  { id: 97, text: "즐겨찾기 목록에서 항목을 눌러 페이지를 여세요.", targetId: 'internet-bookmark-open', exp: 30 },
  { id: 98, text: "메뉴를 다시 열고 🗑 버튼으로 즐겨찾기를 삭제하세요.", targetId: 'internet-bookmark-delete', exp: 30 },
  { id: 99, text: "하단의 탭(□) 버튼을 눌러 탭 목록을 여세요.", targetId: 'internet-tabs-button', exp: 20 },
  { id: 100, text: "'+ 새 탭' 버튼을 눌러 새로운 탭을 여세요.", targetId: 'internet-newtab', exp: 20 },
  { id: 101, text: "첫 번째 탭의 'X' 버튼을 눌러 탭을 닫으세요.", targetId: 'internet-tab-close-1', exp: 20 },
  { id: 102, text: "모든 임무 완료! 훌륭한 안드로이드 탐험가입니다 🎉", targetId: null, exp: 50 },

];




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

const CuteStudent = ({ seed }) => {
  const isGirl = seed % 2 === 0;
  const skinColors = ['#fef08a', '#ffedd5', '#fde047', '#fed7aa'];
  const skin = skinColors[(seed % 4 + 4) % 4];
  if (isGirl) {
    return (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl transition-all duration-300">
        <rect width="100" height="100" fill="#fbcfe8" rx="20"/>
        <path d="M 20 50 Q 50 10 80 50 L 70 80 Q 50 90 30 80 Z" fill="#3f3f46"/>
        <circle cx="50" cy="48" r="24" fill={skin}/>
        <path d="M 26 40 Q 50 20 74 40 Q 50 30 26 40" fill="#3f3f46"/>
        <circle cx="40" cy="50" r="4.5" fill="#18181b"/><circle cx="60" cy="50" r="4.5" fill="#18181b"/>
        <circle cx="41.5" cy="48.5" r="1.5" fill="#fff"/><circle cx="61.5" cy="48.5" r="1.5" fill="#fff"/>
        <circle cx="34" cy="56" r="3.5" fill="#f87171" opacity="0.5"/><circle cx="66" cy="56" r="3.5" fill="#f87171" opacity="0.5"/>
        <path d="M 46 60 Q 50 66 54 60" fill="#e11d48"/>
        <path d="M 25 100 Q 25 80 50 80 Q 75 80 75 100" fill="#ec4899"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl transition-all duration-300">
      <rect width="100" height="100" fill="#e0f2fe" rx="20"/>
      <path d="M 26 45 Q 50 0 74 45" fill="#1e3a8a"/>
      <circle cx="50" cy="48" r="24" fill={skin}/>
      <path d="M 26 38 Q 50 18 74 38 Q 60 25 50 32 Q 40 25 26 38" fill="#1e3a8a"/>
      <circle cx="40" cy="49" r="4" fill="#0f172a"/><circle cx="60" cy="49" r="4" fill="#0f172a"/>
      <circle cx="34" cy="55" r="3" fill="#fca5a5" opacity="0.6"/><circle cx="66" cy="55" r="3" fill="#fca5a5" opacity="0.6"/>
      <path d="M 44 60 Q 50 65 56 60" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M 25 100 Q 25 80 50 80 Q 75 80 75 100" fill="#0284c7"/>
    </svg>
  );
};

const ActionTarget = ({
  id, children, onClick, onTouchStart, onTouchEnd, onTouchMove,
  onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onPointerDown, onPointerMove, onPointerUp,
  className = "", style = {}, currentTargetId, advanceQuest, disableClickAdvance,
  extraTargetIds = [], tooltipPosition = 'top', tooltipText = '여기를 누르세요!'
}) => {
  const isTarget = currentTargetId === id || extraTargetIds.includes(currentTargetId);
  const tooltipClasses =
    tooltipPosition === 'bottom' ? 'absolute -bottom-12 left-1/2 transform -translate-x-1/2'
    : tooltipPosition === 'left' ? 'absolute top-1/2 right-full mr-3 -translate-y-1/2'
    : tooltipPosition === 'top-left' ? 'absolute -top-12 right-0'
    : 'absolute -top-12 left-1/2 transform -translate-x-1/2';
  const arrowClasses =
    tooltipPosition === 'bottom' ? 'absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-blue-600'
    : tooltipPosition === 'left' ? 'absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-blue-600'
    : tooltipPosition === 'top-left' ? 'absolute bottom-0 right-6 translate-y-1/2 rotate-45 w-3 h-3 bg-blue-600'
    : 'absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-blue-600';
  return (
    <div
      onClick={(e) => { if(onClick) onClick(e); if(!disableClickAdvance) advanceQuest(id); }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchMove={onTouchMove}
      onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      className={`relative ${className} ${isTarget ? 'ring-4 ring-yellow-400 animate-pulse z-[70] rounded-2xl bg-yellow-400/20' : ''}`}
      style={style}
    >
      {isTarget && (
        <div className={`${tooltipClasses} bg-blue-600 text-white text-[13px] px-4 py-2 rounded-xl shadow-xl whitespace-nowrap z-[110] pointer-events-none font-bold`}>
          {tooltipText}
          <div className={arrowClasses}></div>
        </div>
      )}
      {children}
    </div>
  );
};


const LS_KEY = 'android-explorer-v2';
const loadLS = (): any => {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
};

const DEFAULT_WALLPAPER = 'radial-gradient(ellipse at 20% 0%, #a78bfa 0%, transparent 55%), radial-gradient(ellipse at 100% 20%, #38bdf8 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, #f472b6 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, #6366f1 0%, transparent 60%), #0f172a';

const DEFAULT_HOME_APPS = (() => {
  // 8 columns × 5 rows tablet layout
  const a = Array(40).fill(null);
  // Row 1
  a[0] = 'PlayStore'; a[1] = 'Store'; a[2] = 'Notes'; a[3] = 'Folder';
  a[4] = 'Internet'; a[5] = 'GameLauncher'; a[6] = 'Camera'; a[7] = 'Gallery';
  // Row 2
  a[8] = 'Messages'; a[9] = 'KakaoTalk'; a[10] = 'YouTube'; a[11] = 'Naver';
  a[12] = 'Calculator'; a[13] = 'Calendar'; a[14] = 'Clock'; a[15] = 'Settings';
  // Row 3
  a[16] = 'Health'; a[17] = 'Wearable'; a[18] = 'Gmail';
  return a;
})();


export default function AndroidExplorer() {
  const [time, setTime] = useState<Date | null>(null);
  const [isPhone, setIsPhone] = useState<boolean>(false);
  useEffect(() => {
    const mql = typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)') : null;
    if (!mql) return;
    const apply = () => setIsPhone(mql.matches);
    apply();
    mql.addEventListener?.('change', apply);
    return () => mql.removeEventListener?.('change', apply);
  }, []);


  const [wifi, setWifi] = useState(false);
  const [wifiConnected, setWifiConnected] = useState(null);
  const [bluetooth, setBluetooth] = useState(false);
  const [airplane, setAirplane] = useState(false);
  const [soundMode, setSoundMode] = useState('sound');
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(70);
  const [photos, setPhotos] = useState([]);
  const [installedApps, setInstalledApps] = useState<string[]>([]);
  const [currentCameraSeed, setCurrentCameraSeed] = useState(Date.now());
  const [wallpaper, setWallpaper] = useState<string>(DEFAULT_WALLPAPER);
  const [mathAppOpen, setMathAppOpen] = useState(false);
  const [mathInstallProgress, setMathInstallProgress] = useState<number | null>(null);

  const [homePages, setHomePages] = useState<any[][]>([DEFAULT_HOME_APPS, Array(40).fill(null)]);
  const [currentPage, setCurrentPage] = useState(0);
  const homeApps = homePages[currentPage] ?? Array(40).fill(null);
  const setHomeApps: any = (updater: any) => {
    setHomePages(prev => {
      const next = prev.map(p => [...p]);
      const idx = Math.min(currentPage, next.length - 1);
      next[idx] = typeof updater === 'function' ? updater(prev[idx]) : updater;
      return next;
    });
  };
  const [pageSwipeStart, setPageSwipeStart] = useState<{ x: number; y: number } | null>(null);
  const [pageSwipeDX, setPageSwipeDX] = useState(0);
  const [homeFlashKey, setHomeFlashKey] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [appContextMenu, setAppContextMenu] = useState<{ appName: string; index: number } | null>(null);
  const pressTimer = useRef<any>(null);



  const [dragInfo, setDragInfo] = useState({ isDragging: false, index: null, x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const [hoverIndex, setHoverIndex] = useState(null);

  const [currentApp, setCurrentApp] = useState(null);
  const [settingsMenu, setSettingsMenu] = useState('connections');
  const [quickPanelOpen, setQuickPanelOpen] = useState(false);
  const [wifiModalOpen, setWifiModalOpen] = useState(false);
  const [wifiPasswordInput, setWifiPasswordInput] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');

  const [searchText, setSearchText] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardShift, setKeyboardShift] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);

  // 삼성 인터넷 앱
  type InternetView = 'newtab' | 'results' | 'site';
  type InternetHist = { title: string; url: string; view: InternetView };
  type InternetTab = { id: number; title: string; url: string; view: InternetView; history: InternetHist[]; historyIndex: number };
  const makeInternetTab = (id: number): InternetTab => ({ id, title: '새 탭', url: '', view: 'newtab', history: [{ title: '새 탭', url: '', view: 'newtab' }], historyIndex: 0 });
  const [internetTabs, setInternetTabs] = useState<InternetTab[]>([makeInternetTab(1)]);
  const [internetActiveTabId, setInternetActiveTabId] = useState<number>(1);
  const [internetUrlPanelOpen, setInternetUrlPanelOpen] = useState(false);
  const [internetTabSwitcherOpen, setInternetTabSwitcherOpen] = useState(false);
  const [internetBookmarks, setInternetBookmarks] = useState<{ title: string; url: string }[]>([]);
  const [internetMenuOpen, setInternetMenuOpen] = useState(false);
  const [internetKbInput, setInternetKbInput] = useState('');
  const [internetKbShift, setInternetKbShift] = useState(false);

  const [viewPhoto, setViewPhoto] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<number[]>([]);

  // 신규 상태들
  const [locked, setLocked] = useState(true);
  const [lockSwipeY, setLockSwipeY] = useState<number | null>(null);
  const [lockOffset, setLockOffset] = useState(0);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [fontScale, setFontScale] = useState<number>(1);
  const [widgetPages, setWidgetPages] = useState<string[][]>([['clock', 'weather', 'calendar'], []]);
  const widgets = widgetPages[currentPage] ?? [];
  const setWidgets: any = (updater: any) => {
    setWidgetPages(prev => {
      const next = prev.map(p => [...p]);
      const idx = Math.min(currentPage, next.length - 1);
      next[idx] = typeof updater === 'function' ? updater(prev[idx]) : updater;
      return next;
    });
  };
  const [widgetSizes, setWidgetSizes] = useState<Record<string, 'sm' | 'md' | 'lg'>>({});

  const [widgetPickerOpen, setWidgetPickerOpen] = useState(false);
  const [homeMenuOpen, setHomeMenuOpen] = useState(false);
  const [homeLongPressTimer, setHomeLongPressTimer] = useState<any>(null);
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const [drawerSwipeStart, setDrawerSwipeStart] = useState<number | null>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, app: 'KakaoTalk', appName: '톡톡', title: '엄마', body: '학교 끝나면 바로 와~', color: 'bg-yellow-400' },
    { id: 2, app: 'Messages', appName: '메시지', title: '010-1234-5678', body: '[Web발신] 택배가 도착했습니다.', color: 'bg-blue-500' },
    { id: 3, app: 'Gmail', appName: '메일', title: '탐험대', body: '새로운 기기에서 로그인되었습니다.', color: 'bg-red-500' },
  ]);
  const [notifDrag, setNotifDrag] = useState<{ id: number; startX: number; dx: number } | null>(null);
  const [readNotifIds, setReadNotifIds] = useState<number[]>([]);
  // 탐험대 계정 로그인
  const [googleLoginOpen, setGoogleLoginOpen] = useState(false);
  const [googleLoginStep, setGoogleLoginStep] = useState<'email' | 'password' | 'consent' | 'syncing' | 'done'>('email');
  const [googleEmail, setGoogleEmail] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [googleError, setGoogleError] = useState('');
  const [googleConsent, setGoogleConsent] = useState(false);
  const [googleAccount, setGoogleAccount] = useState<string | null>(null);
  const [accountAddOpen, setAccountAddOpen] = useState(false);
  const [googleShake, setGoogleShake] = useState(0);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const googleEmailRef = useRef<HTMLInputElement>(null);
  const googlePasswordRef = useRef<HTMLInputElement>(null);
  // Play Store 업데이트
  const [playStoreView, setPlayStoreView] = useState<'home' | 'manage'>('home');
  const [playStoreProfileOpen, setPlayStoreProfileOpen] = useState(false);
  const [updatingAll, setUpdatingAll] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [appsUpdated, setAppsUpdated] = useState(false);
  // 앱별 업데이트 진행 상태
  const [appUpdateStatus, setAppUpdateStatus] = useState<Record<string, 'pending'|'downloading'|'installing'|'done'>>({});
  const [appUpdateProgress, setAppUpdateProgress] = useState<Record<string, number>>({});
  const [cameraPermissionAsked, setCameraPermissionAsked] = useState(false);
  const [cameraPermissionPrompt, setCameraPermissionPrompt] = useState(false);
  const [settingsSearch, setSettingsSearch] = useState('');
  const [uninstallTarget, setUninstallTarget] = useState<string | null>(null);
  const [drawerLongPressTimer, setDrawerLongPressTimer] = useState<any>(null);

  const [themeColor, setThemeColor] = useState<string>('#3b82f6');
  const [recentAppsOpen, setRecentAppsOpen] = useState(false);
  const [recentApps, setRecentApps] = useState<string[]>([]);
  const [splitScreen, setSplitScreen] = useState<{ top: string; bottom: string } | null>(null);
  const [appPermissions, setAppPermissions] = useState<Record<string, Record<string, boolean>>>({
    Camera: { 카메라: true, 마이크: true, 위치: false, 저장공간: true },
    Gallery: { 카메라: false, 마이크: false, 위치: false, 저장공간: true },
    Messages: { 카메라: false, 마이크: false, 위치: false, 연락처: true },
    PlayStore: { 카메라: false, 마이크: false, 위치: true, 저장공간: true },
    KakaoTalk: { 카메라: true, 마이크: true, 위치: false, 연락처: true },
  });
  const [playStoreQuery, setPlayStoreQuery] = useState('');

  // 신규: 블루투스 기기 / 노트
  const [bluetoothModalOpen, setBluetoothModalOpen] = useState(false);
  const [connectedBtDevice, setConnectedBtDevice] = useState<string | null>(null);
  const [btPairingDevice, setBtPairingDevice] = useState<{ id: string; name: string; icon: string } | null>(null);
  const [btPairingPin, setBtPairingPin] = useState<string>('');
  const [notes, setNotes] = useState<{ id: number; paths: string[] }[]>([]);
  const [notesEditing, setNotesEditing] = useState<{ paths: string[]; current: string } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Calculator
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrev, setCalcPrev] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [calcJustEvaluated, setCalcJustEvaluated] = useState(false);

  // Photo viewer zoom
  const [photoZoom, setPhotoZoom] = useState(1);

  const [questIdx, setQuestIdx] = useState<number>(0);
  const [exp, setExp] = useState<number>(0);
  const [completedQuests, setCompletedQuests] = useState<number[]>([]);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState('');
  const [appLaunchKey, setAppLaunchKey] = useState(0);
  const [showExpMenu, setShowExpMenu] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [expPos, setExpPos] = useState({ x: 20, y: 60 });
  const [isDraggingExp, setIsDraggingExp] = useState(false);
  const dragRefExp = useRef(null);
  const expMenuRef = useRef(null);
  const [touchStartY, setTouchStartY] = useState(null);

  // 미션 리스트 팝업 (12번)
  const [missionListOpen, setMissionListOpen] = useState(false);
  const [missionListCompact, setMissionListCompact] = useState(false);
  const [missionListPos, setMissionListPos] = useState({ x: 420, y: 60 });
  const [isDraggingList, setIsDraggingList] = useState(false);
  const dragRefList = useRef<any>(null);
  const missionListRef = useRef<any>(null);

  // 리워드 (3번) - confetti + level-up flash
  const [confettiKey, setConfettiKey] = useState(0);
  const [rewardToast, setRewardToast] = useState<{ exp: number; key: number } | null>(null);
  const [levelUpFlash, setLevelUpFlash] = useState(0);
  const prevLevelRef = useRef<number>(1);

  // 측면 하드웨어 버튼: 음량 패널 / 전원 메뉴
  const [volumePanelOpen, setVolumePanelOpen] = useState(false);
  const [volumePanelType, setVolumePanelType] = useState<'media' | 'ring' | 'notif'>('media');
  const [mediaVolume, setMediaVolume] = useState(70);
  const [ringVolume, setRingVolume] = useState(60);
  const [notifVolume, setNotifVolume] = useState(50);
  const volumeCloseTimer = useRef<any>(null);
  const [powerMenuOpen, setPowerMenuOpen] = useState(false);
  const [powerOff, setPowerOff] = useState(false);
  const showVolumePanel = (type: 'media' | 'ring' | 'notif', delta: number) => {
    setVolumePanelType(type);
    setVolumePanelOpen(true);
    if (type === 'media') setMediaVolume(v => Math.max(0, Math.min(100, v + delta)));
    if (type === 'ring') setRingVolume(v => Math.max(0, Math.min(100, v + delta)));
    if (type === 'notif') setNotifVolume(v => Math.max(0, Math.min(100, v + delta)));
    if (volumeCloseTimer.current) clearTimeout(volumeCloseTimer.current);
    volumeCloseTimer.current = setTimeout(() => setVolumePanelOpen(false), 2400);
  };

  // 최근 앱 카드 스와이프(위로 밀어 닫기)
  const [recentSwipe, setRecentSwipe] = useState<{ index: number; startY: number; dy: number } | null>(null);






  const currentTargetId = QUESTS[questIdx]?.targetId;

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const saved = loadLS();
    setInstalledApps(saved.installedApps ?? []);
    setWallpaper(saved.wallpaper ?? DEFAULT_WALLPAPER);
    const loadedPages = saved.homePages ?? (saved.homeApps ? [saved.homeApps, Array(40).fill(null)] : [DEFAULT_HOME_APPS, Array(40).fill(null)]);
    setHomePages(loadedPages);
    setDarkMode(saved.darkMode ?? false);
    setFontScale(saved.fontScale ?? 1);
    const loadedWPages = saved.widgetPages ?? (saved.widgets ? [saved.widgets, []] : [['clock', 'weather', 'calendar'], []]);
    setWidgetPages(loadedWPages);
    setWidgetSizes(saved.widgetSizes ?? {});
    setThemeColor(saved.themeColor ?? '#3b82f6');
    setQuestIdx(saved.questIdx ?? 0);
    setExp(saved.exp ?? 0);
    setCompletedQuests(saved.completedQuests ?? []);
    setIsStorageReady(true);
  }, []);

  const timeStr = time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--';
  const dateStr = time ? time.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }) : '';

  // 다중 선택 미션 도달 시 샘플 사진 자동 추가
  useEffect(() => {
    if (questIdx === 21 && photos.length < 3) {
      setPhotos([
        { id: Date.now() + 1, seed: 1001 },
        { id: Date.now() + 2, seed: 1002 },
        { id: Date.now() + 3, seed: 1003 },
      ]);
    }
  }, [questIdx]);

  // 최근 사용 앱 추적
  useEffect(() => {
    if (currentApp) {
      setRecentApps(prev => [currentApp, ...prev.filter(a => a !== currentApp)].slice(0, 5));
    }
  }, [currentApp]);

  // 앱 전환 애니메이션 트리거
  useEffect(() => { setAppLaunchKey(k => k + 1); }, [currentApp]);

  // 사진 뷰어 진입 시 줌 리셋
  useEffect(() => { setPhotoZoom(1); }, [viewPhoto]);


  // Google 로그인 입력 자동 포커스 (단계 변경/오류 시)
  useEffect(() => {
    if (!googleLoginOpen) return;
    const t = setTimeout(() => {
      if (googleLoginStep === 'email') googleEmailRef.current?.focus();
      else if (googleLoginStep === 'password') googlePasswordRef.current?.focus();
    }, 80);
    return () => clearTimeout(t);
  }, [googleLoginOpen, googleLoginStep, googleShake]);

  // 진행도 localStorage 저장
  useEffect(() => {
    if (!isStorageReady) return;
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        questIdx, exp, completedQuests, installedApps, homePages, widgetPages, widgetSizes,
        wallpaper, darkMode, fontScale, themeColor,
      }));
    } catch {}
  }, [isStorageReady, questIdx, exp, completedQuests, installedApps, homePages, widgetPages, widgetSizes, wallpaper, darkMode, fontScale, themeColor]);






  const advanceQuest = (targetId) => {
    if (QUESTS[questIdx]?.targetId === targetId) {
      if (!completedQuests.includes(questIdx)) {
        const gained = QUESTS[questIdx].exp;
        const newExp = exp + gained;
        setExp(newExp);
        setCompletedQuests(prev => prev.includes(questIdx) ? prev : [...prev, questIdx]);
        // 리워드 효과
        setConfettiKey(k => k + 1);
        setRewardToast({ exp: gained, key: Date.now() });
        setTimeout(() => setRewardToast(null), 3400);
        // 레벨업 감지
        const newLevel = Math.floor(newExp / 100) + 1;
        if (newLevel > prevLevelRef.current) {
          prevLevelRef.current = newLevel;
          setLevelUpFlash(f => f + 1);
        }
      }
      setQuestIdx(q => Math.min(q + 1, QUESTS.length - 1));
    }
  };


  const resetProgress = () => {
    if (typeof window !== 'undefined') {
      try { localStorage.removeItem(LS_KEY); } catch {}
    }
    setQuestIdx(0); setExp(0); setCompletedQuests([]);
    setInstalledApps([]); setHomePages([DEFAULT_HOME_APPS, Array(40).fill(null)]); setCurrentPage(0); setWallpaper(DEFAULT_WALLPAPER);
    setDarkMode(false); setFontScale(1); setWidgetPages([['clock', 'weather', 'calendar'], []]); setWidgetSizes({});
    setThemeColor('#3b82f6'); setLocked(true);
  };
  const gotoQuest = (idx: number) => {
    const clamped = Math.max(0, Math.min(QUESTS.length - 1, idx));
    if (clamped > questIdx && !completedQuests.includes(questIdx)) return;
    setQuestIdx(clamped);
  };


  const handleDragStartExp = (e) => {
    setIsDraggingExp(true);
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    dragRefExp.current = { startX: clientX, startY: clientY, initX: expPos.x, initY: expPos.y };
  };

  const handleDragStartList = (e) => {
    setIsDraggingList(true);
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    dragRefList.current = { startX: clientX, startY: clientY, initX: missionListPos.x, initY: missionListPos.y };
  };

  const handleGlobalMove = (e) => {
    if (isDraggingExp && expMenuRef.current && dragRefExp.current) {
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragRefExp.current.startX;
      const dy = clientY - dragRefExp.current.startY;
      expMenuRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      expMenuRef.current.style.willChange = 'transform';
      dragRefExp.current.lastDx = dx;
      dragRefExp.current.lastDy = dy;
    }
    if (isDraggingList && missionListRef.current && dragRefList.current) {
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragRefList.current.startX;
      const dy = clientY - dragRefList.current.startY;
      missionListRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      missionListRef.current.style.willChange = 'transform';
      dragRefList.current.lastDx = dx;
      dragRefList.current.lastDy = dy;
    }
    if (touchStartY !== null && !dragInfo.isDragging) {
      const currentY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      if (!quickPanelOpen && currentY - touchStartY > 15) {
        setQuickPanelOpen(true);
        advanceQuest('swipe-trigger');
        setTouchStartY(null);
      } else if (quickPanelOpen && touchStartY - currentY > 15) {
        setQuickPanelOpen(false);
        advanceQuest('quick-panel-bg');
        setTouchStartY(null);
      }
    }
  };



  const handleGlobalEnd = () => {
    if (isDraggingExp && expMenuRef.current && dragRefExp.current) {
      const dx = dragRefExp.current.lastDx || 0;
      const dy = dragRefExp.current.lastDy || 0;
      expMenuRef.current.style.transition = 'none';
      expMenuRef.current.style.transform = 'none';
      expMenuRef.current.style.willChange = '';
      setExpPos({
        x: dragRefExp.current.initX + dx,
        y: dragRefExp.current.initY + dy
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (expMenuRef.current) {
            expMenuRef.current.style.transition = '';
          }
        });
      });
    }
    if (isDraggingList && missionListRef.current && dragRefList.current) {
      const dx = dragRefList.current.lastDx || 0;
      const dy = dragRefList.current.lastDy || 0;
      missionListRef.current.style.transition = 'none';
      missionListRef.current.style.transform = 'none';
      missionListRef.current.style.willChange = '';
      setMissionListPos({
        x: dragRefList.current.initX + dx,
        y: dragRefList.current.initY + dy
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (missionListRef.current) {
            missionListRef.current.style.transition = '';
          }
        });
      });
    }
    setIsDraggingExp(false);
    setIsDraggingList(false);
    setTouchStartY(null);
  };

  const handleSwipeStart = (e) => { setTouchStartY(e.type.includes('touch') ? e.touches[0].clientY : e.clientY); };

  const handleAppPressStart = (appName, index?: number) => {
    if (isEditMode) return;
    pressTimer.current = setTimeout(() => {
      setIsEditMode(true);
      if (appName === 'Camera' && currentTargetId === 'app-icon-Camera-long-press') {
        advanceQuest('app-icon-Camera-long-press');
      }
    }, 550);
  };

  const handleAppPressEnd = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };

  const onPointerDown = (e, index) => {
    if (!isEditMode || !homeApps[index]) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragInfo({ isDragging: true, index, x: e.clientX, y: e.clientY, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top });
  };
  const onPointerMove = (e) => {
    if (!dragInfo.isDragging) return;
    setDragInfo(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
    const ghost = document.getElementById('drag-ghost');
    if (ghost) ghost.style.visibility = 'hidden';
    const elem = document.elementFromPoint(e.clientX, e.clientY);
    if (ghost) ghost.style.visibility = 'visible';
    const slot = elem?.closest('[data-slot-idx]');
    if (slot) setHoverIndex(parseInt(slot.getAttribute('data-slot-idx')));
    else setHoverIndex(null);
  };
  const onPointerUp = (e) => {
    if (!dragInfo.isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (hoverIndex !== null && hoverIndex !== dragInfo.index) {
      const newApps = [...homeApps];
      const temp = newApps[hoverIndex];
      newApps[hoverIndex] = newApps[dragInfo.index];
      newApps[dragInfo.index] = temp;
      setHomeApps(newApps);
      if (newApps[hoverIndex] === 'Camera' || newApps[dragInfo.index] === 'Camera') {
        advanceQuest('drag-camera');
        setIsEditMode(false);
      }
    }
    setDragInfo({ isDragging: false, index: null, x: 0, y: 0, offsetX: 0, offsetY: 0 });
    setHoverIndex(null);
  };

  const renderAppIcon = (appName, index) => {
    let content = null;
    let name = '';
    // One UI 7 / Android 15 풍 squircle (스쿼클) 공통 클래스
    const sq = "w-full h-full rounded-[22%] flex items-center justify-center shadow-[0_6px_14px_rgba(0,0,0,0.25)] overflow-hidden";
    switch(appName) {
      case 'Calculator': name = '계산기';
        content = (<div className={sq} style={{ background: 'linear-gradient(135deg,#1f2937 0%,#0f172a 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-[68%] h-[68%]">
            <rect x="18" y="10" width="64" height="80" rx="10" fill="#f8fafc"/>
            <rect x="24" y="16" width="52" height="18" rx="3" fill="#0f172a"/>
            <text x="71" y="29" textAnchor="end" fill="#fbbf24" fontSize="13" fontFamily="monospace" fontWeight="700">96</text>
            {[0,1,2,3].map(r => [0,1,2,3].map(c => {
              const isOp = c === 3;
              return <rect key={`${r}-${c}`} x={24+c*14} y={40+r*12} width="11" height="9" rx="2" fill={isOp ? '#f97316' : '#e2e8f0'}/>;
            }))}
          </svg></div>); break;

      case 'GameLauncher': name = 'Game Launcher';
        content = (<div className={`${sq}`} style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
            <rect x="10" y="35" width="55" height="35" rx="17" fill="#fff" opacity="0.95"/>
            <circle cx="25" cy="52" r="4" fill="#7c3aed"/><circle cx="38" cy="52" r="4" fill="#7c3aed"/>
            <circle cx="78" cy="40" r="6" fill="#fff"/><circle cx="85" cy="58" r="6" fill="#fff"/>
          </svg></div>); break;
      case 'Store': name = 'Galaxy Store';
        content = (<div className={sq} style={{ background: 'linear-gradient(135deg,#a855f7 0%,#ec4899 50%,#f97316 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
            <path d="M 20 45 Q 50 -5 80 45 L 80 80 Q 50 95 20 80 Z" fill="#fff"/>
            <path d="M 35 60 L 50 75 L 70 50" stroke="#a855f7" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg></div>); break;
      case 'Camera': name = '카메라';
        content = (<div className={sq} style={{ background: 'linear-gradient(160deg,#f8fafc 0%,#cbd5e1 100%)' }}>
          <div className="relative w-[62%] h-[62%]">
            <div className="absolute inset-0 rounded-full bg-[#1f2937] shadow-inner flex items-center justify-center">
              <div className="w-[55%] h-[55%] rounded-full bg-gradient-to-br from-[#60a5fa] to-[#1e3a8a] border-2 border-[#0f172a]"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#fbbf24] rounded-full shadow"></div>
          </div>
        </div>); break;
      case 'Gallery': name = '갤러리';
        content = (<div className={sq} style={{ background: '#fff' }}>
          <svg viewBox="0 0 100 100" className="w-[78%] h-[78%]">
            <g transform="translate(50,50)">
              <ellipse cx="0" cy="-26" rx="14" ry="22" fill="#fbbf24"/>
              <ellipse cx="0" cy="26" rx="14" ry="22" fill="#ec4899"/>
              <ellipse cx="-26" cy="0" rx="22" ry="14" fill="#3b82f6"/>
              <ellipse cx="26" cy="0" rx="22" ry="14" fill="#22c55e"/>
              <circle cx="0" cy="0" r="9" fill="#fff"/>
            </g>
          </svg></div>); break;
      case 'Wearable': name = 'Galaxy Wear';
        content = (<div className={sq} style={{ background: 'linear-gradient(135deg,#1e293b 0%,#475569 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
            <rect x="28" y="22" width="44" height="56" rx="14" fill="none" stroke="#fff" strokeWidth="6"/>
            <circle cx="50" cy="50" r="10" fill="#3b82f6"/>
          </svg></div>); break;
      case 'Calendar': name = '캘린더';
        content = (<div className={`${sq} flex-col`} style={{ background: '#fff' }}>
          <div className="w-full h-[28%] bg-[#ef4444] flex items-center justify-center">
            <span className="text-white text-[10px] font-bold tracking-wider">{time ? time.toLocaleDateString('ko-KR', { weekday: 'short' }).toUpperCase() : 'SUN'}</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-[#111] font-black text-[28px] leading-none">{time ? time.getDate() : 1}</span>
          </div></div>); break;
      case 'Clock': name = '시계';
        content = (<div className={sq} style={{ background: '#fff' }}>
          <svg viewBox="0 0 100 100" className="w-[78%] h-[78%]">
            <circle cx="50" cy="50" r="44" fill="#fff" stroke="#111" strokeWidth="5"/>
            {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
              const a = (i*30)*Math.PI/180; const x1 = 50+Math.sin(a)*38; const y1 = 50-Math.cos(a)*38;
              const x2 = 50+Math.sin(a)*42; const y2 = 50-Math.cos(a)*42;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#111" strokeWidth="2"/>;
            })}
            <line x1="50" y1="50" x2="50" y2="22" stroke="#111" strokeWidth="5" strokeLinecap="round"/>
            <line x1="50" y1="50" x2="72" y2="62" stroke="#111" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="50" y1="50" x2="34" y2="68" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="3.5" fill="#ef4444"/></svg></div>); break;
      case 'Health': name = '건강';
        content = (<div className={sq} style={{ background: 'linear-gradient(135deg,#fff 0%,#f1f5f9 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]">
            <path d="M 50 82 C 18 60, 18 30, 38 28 C 46 28, 50 34, 50 38 C 50 34, 54 28, 62 28 C 82 30, 82 60, 50 82 Z" fill="#f97316"/>
            <path d="M 25 55 L 38 55 L 44 42 L 52 68 L 58 50 L 75 50" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg></div>); break;
      case 'Folder': name = '탐험대';
        content = (<div className={`${sq} grid grid-cols-2 grid-rows-2 gap-1.5 p-3.5`} style={{ background: '#fff' }}>
          <div className="rounded-full" style={{ background: '#4285F4' }}></div>
          <div className="rounded-full" style={{ background: '#EA4335' }}></div>
          <div className="rounded-full" style={{ background: '#FBBC05' }}></div>
          <div className="rounded-full" style={{ background: '#34A853' }}></div></div>); break;
      case 'Notes': name = '메모';
        content = (<div className={sq} style={{ background: 'linear-gradient(160deg,#fde68a 0%,#fbbf24 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-[62%] h-[62%]">
            <path d="M 22 12 L 62 12 L 82 32 L 82 88 L 22 88 Z" fill="#fff"/>
            <path d="M 62 12 L 62 32 L 82 32 Z" fill="#fcd34d"/>
            <path d="M 32 48 L 70 48 M 32 60 L 70 60 M 32 72 L 58 72" stroke="#92400e" strokeWidth="4.5" strokeLinecap="round"/>
          </svg></div>); break;
      case 'Messages': name = '메시지';
        content = (<div className={sq} style={{ background: 'linear-gradient(135deg,#22c55e 0%,#16a34a 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-[68%] h-[68%]">
            <path d="M 14 36 Q 14 14 50 14 Q 86 14 86 36 L 86 58 Q 86 78 50 78 L 32 88 L 36 76 Q 14 70 14 36 Z" fill="#ffffff"/>
            <circle cx="34" cy="46" r="5.5" fill="#22c55e"/><circle cx="50" cy="46" r="5.5" fill="#22c55e"/><circle cx="66" cy="46" r="5.5" fill="#22c55e"/>
          </svg></div>); break;
      case 'Internet': name = '인터넷';
        content = (<div className={sq} style={{ background: 'linear-gradient(135deg,#3b82f6 0%,#6366f1 100%)' }}>
          <svg viewBox="0 0 100 100" className="w-[72%] h-[72%]">
            <circle cx="50" cy="50" r="30" fill="#fff"/>
            <ellipse cx="50" cy="50" rx="30" ry="12" fill="none" stroke="#3b82f6" strokeWidth="3"/>
            <ellipse cx="50" cy="50" rx="12" ry="30" fill="none" stroke="#3b82f6" strokeWidth="3"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#3b82f6" strokeWidth="3"/>
          </svg></div>); break;
      case 'PlayStore': name = '앱 마켓';
        content = (<div className={sq} style={{ background: '#fff' }}>
          <svg viewBox="0 0 100 100" className="w-[60%] h-[60%]">
            <defs>
              <linearGradient id="ps-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#00C2A8"/><stop offset="1" stopColor="#00897B"/>
              </linearGradient>
              <linearGradient id="ps-b" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#2196F3"/><stop offset="1" stopColor="#0D47A1"/>
              </linearGradient>
              <linearGradient id="ps-r" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#EA4335"/><stop offset="1" stopColor="#C62828"/>
              </linearGradient>
              <linearGradient id="ps-y" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#FBBC05"/><stop offset="1" stopColor="#F57F17"/>
              </linearGradient>
            </defs>
            <path d="M 20 10 L 55 50 L 20 90 Z" fill="url(#ps-b)"/>
            <path d="M 20 10 L 85 50 L 70 58 Z" fill="url(#ps-r)"/>
            <path d="M 20 90 L 85 50 L 70 42 Z" fill="url(#ps-y)"/>
            <path d="M 55 50 L 70 42 L 85 50 L 70 58 Z" fill="url(#ps-g)"/>
          </svg></div>); break;
      case 'YouTube': name = '튜브';
        content = (<div className={sq} style={{ background: '#fff' }}>
          <svg viewBox="0 0 100 100" className="w-[78%] h-[78%]">
            <rect x="8" y="26" width="84" height="48" rx="14" fill="#FF0000"/>
            <path d="M 42 38 L 66 50 L 42 62 Z" fill="#fff"/>
          </svg></div>); break;
      case 'KakaoTalk': name = '톡톡';
        content = (<div className={sq} style={{ background: '#FAE100' }}>
          <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]">
            <path d="M 50 18 C 26 18, 12 32, 12 48 C 12 60, 20 70, 32 75 L 28 88 L 44 80 C 46 80, 48 80, 50 80 C 74 80, 88 66, 88 50 C 88 32, 74 18, 50 18 Z" fill="#3A1D1D"/>
          </svg></div>); break;
      case 'Naver': name = '검색';
        content = (<div className={sq} style={{ background: '#03C75A' }}>
          <svg viewBox="0 0 100 100" className="w-[60%] h-[60%]">
            <path d="M 22 22 L 42 22 L 60 56 L 60 22 L 78 22 L 78 78 L 58 78 L 40 44 L 40 78 L 22 78 Z" fill="#fff"/>
          </svg></div>); break;
      case 'Settings': name = '설정';
        content = (<div className={sq} style={{ background: 'linear-gradient(135deg,#e0e7ff 0%,#c7d2fe 100%)' }}>
          <Settings size={42} className="text-[#1e3a8a]" strokeWidth={2}/></div>); break;
    }
    // 이미지 아이콘이 있는 앱은 SVG 대신 생성된 이미지로 대체
    if (APP_ICON_IMAGES[appName]) {
      content = (
        <img
          src={APP_ICON_IMAGES[appName]}
          alt={name || appName}
          loading="lazy"
          width={512}
          height={512}
          draggable={false}
          className="w-full h-full object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)] select-none pointer-events-none"
        />
      );
    }
    if (!content) return null;
    const hasNotif = appName === 'KakaoTalk' && notifications.some(n => n.app === 'KakaoTalk');
    return (
      <ActionTarget
        key={index}
        id={`app-icon-${appName}`} currentTargetId={currentTargetId} advanceQuest={advanceQuest}
        extraTargetIds={appName === 'Camera' ? ['app-icon-Camera-long-press', 'drag-camera'] : []}
        tooltipText={
          appName === 'Camera' && currentTargetId === 'app-icon-Camera-long-press' ? '꾹~ 길게 누르세요'
          : appName === 'Camera' && currentTargetId === 'drag-camera' ? '다른 칸으로 끌어 옮기세요'
          : '여기를 누르세요!'
        }
        onClick={() => {
          if (isEditMode) return;
          if (appName === 'PlayStore') { setIsSearched(false); setSearchText(''); setKeyboardOpen(false); setTypingIndex(0); setKeyboardShift(false); }
          setCurrentApp(appName);
        }}

        onPointerDown={(e) => onPointerDown(e, index)}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onTouchStart={() => handleAppPressStart(appName, index)} onTouchEnd={handleAppPressEnd}
        onMouseDown={() => handleAppPressStart(appName, index)} onMouseUp={handleAppPressEnd} onMouseLeave={handleAppPressEnd}

        className={`flex flex-col items-center gap-3 cursor-pointer group w-[72px] md:w-20 ${isEditMode ? 'animate-wiggle touch-none' : ''}`}
      >
        <div
          className={`relative w-[72px] h-[72px] md:w-20 md:h-20 transition-transform ${!isEditMode ? 'group-hover:scale-105 active:scale-95' : 'ring-2 ring-white/50 rounded-[1.25rem] bg-white/10'}`}
          style={{ visibility: dragInfo.isDragging && dragInfo.index === index ? 'hidden' : 'visible' }}
        >
          {content}
          {hasNotif && !isEditMode && (
            <div className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center shadow-lg border-2 border-white/80 z-10">
              {notifications.filter(n => n.app === 'KakaoTalk').length}
            </div>
          )}
        </div>
        <span className="text-white text-[13px] md:text-sm font-medium drop-shadow-md truncate w-full text-center">{name}</span>
      </ActionTarget>
    );
  };


  const cycleWidgetSize = (id: string) => {
    setWidgetSizes(prev => {
      const cur = prev[id] ?? 'sm';
      const next = cur === 'sm' ? 'md' : cur === 'md' ? 'lg' : 'sm';
      return { ...prev, [id]: next };
    });
  };
  const widgetSizeClass = (id: string) => {
    const s = widgetSizes[id] ?? 'sm';
    if (s === 'lg') return 'scale-125 origin-top-left';
    if (s === 'md') return 'scale-110 origin-top-left';
    return '';
  };

  const renderHome = () => (
    <div
      key={`home-flash-${homeFlashKey}`}
      className="flex-1 pt-10 md:pt-12 px-2 md:px-4 pb-2 relative flex flex-col transition-all duration-500 overflow-hidden min-h-0 animate-app-enter"
      style={{ background: wallpaper, backgroundSize: 'cover' }}
      onContextMenu={(e) => { e.preventDefault(); setHomeMenuOpen(true); }}
      onMouseDown={(e) => {
        if (isEditMode) return;
        const target = e.target as HTMLElement;
        if (target.closest('[data-slot-idx]') || target.closest('button')) return;
        setPageSwipeStart({ x: e.clientX, y: e.clientY });
        if (homeLongPressTimer) clearTimeout(homeLongPressTimer);
        const t = setTimeout(() => setHomeMenuOpen(true), 700);
        setHomeLongPressTimer(t);
      }}
      onMouseMove={(e) => {
        if (pageSwipeStart) setPageSwipeDX(e.clientX - pageSwipeStart.x);
      }}
      onMouseUp={() => {
        if (homeLongPressTimer) { clearTimeout(homeLongPressTimer); setHomeLongPressTimer(null); }
        if (pageSwipeStart && Math.abs(pageSwipeDX) > 90) {
          if (pageSwipeDX < 0 && currentPage < homePages.length - 1) setCurrentPage(currentPage + 1);
          else if (pageSwipeDX > 0 && currentPage > 0) setCurrentPage(currentPage - 1);
        }
        setPageSwipeStart(null); setPageSwipeDX(0);
      }}
      onMouseLeave={() => {
        if (homeLongPressTimer) { clearTimeout(homeLongPressTimer); setHomeLongPressTimer(null); }
        setPageSwipeStart(null); setPageSwipeDX(0);
      }}
      onTouchStart={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('button')) return;
        setPageSwipeStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        if (isEditMode) return;
        if (target.closest('[data-slot-idx]')) return;
        if (homeLongPressTimer) clearTimeout(homeLongPressTimer);
        const t = setTimeout(() => setHomeMenuOpen(true), 700);
        setHomeLongPressTimer(t);
      }}
      onTouchMove={(e) => {
        if (pageSwipeStart) {
          const dx = e.touches[0].clientX - pageSwipeStart.x;
          const dy = e.touches[0].clientY - pageSwipeStart.y;
          if (Math.abs(dx) > Math.abs(dy)) setPageSwipeDX(dx);
        }
      }}
      onTouchEnd={() => {
        if (homeLongPressTimer) { clearTimeout(homeLongPressTimer); setHomeLongPressTimer(null); }
        if (pageSwipeStart && Math.abs(pageSwipeDX) > 60) {
          if (pageSwipeDX < 0 && currentPage < homePages.length - 1) setCurrentPage(currentPage + 1);
          else if (pageSwipeDX > 0 && currentPage > 0) setCurrentPage(currentPage - 1);
        }
        setPageSwipeStart(null); setPageSwipeDX(0);
      }}
    >
      {/* Edit mode top bar */}
      {isEditMode && (
        <div className="absolute top-2 left-0 right-0 z-[20] flex items-center justify-center gap-2 px-3 animate-[fadeIn_0.2s_ease-out]">
          <button onClick={() => setWidgetPickerOpen(true)} className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-white text-xs font-medium active:scale-95">＋ 위젯</button>
          <button onClick={() => { setHomePages(p => [...p, Array(40).fill(null)]); setWidgetPages(p => [...p, []]); setCurrentPage(homePages.length); }} className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-white text-xs font-medium active:scale-95">＋ 페이지</button>
          {homePages.length > 1 && (
            <button onClick={() => {
              const idx = currentPage;
              setHomePages(p => p.filter((_, i) => i !== idx));
              setWidgetPages(p => p.filter((_, i) => i !== idx));
              setCurrentPage(Math.max(0, idx - 1));
            }} className="px-3 py-1.5 rounded-full bg-red-500/80 text-white text-xs font-medium active:scale-95">페이지 삭제</button>
          )}
          <button onClick={() => setIsEditMode(false)} className="px-4 py-1.5 rounded-full bg-blue-500 text-white text-xs font-bold active:scale-95">완료</button>
        </div>
      )}

      {/* Page slider wrapper — animates between pages */}
      <div
        className="absolute inset-0 flex flex-col transition-transform"
        style={{
          transform: `translateX(${pageSwipeStart ? pageSwipeDX * 0.4 : 0}px)`,
          transitionDuration: pageSwipeStart ? '0ms' : '250ms',
        }}
      >
      {/* Home widgets row */}
      <div className={`absolute top-12 md:top-16 left-3 md:left-8 right-3 md:right-8 flex gap-2 md:gap-4 flex-wrap z-[5] ${isEditMode ? '' : 'pointer-events-none'}`}>
        {widgets.includes('clock') && (
          <div onClick={() => isEditMode && cycleWidgetSize('clock')} className={`group relative bg-white/15 backdrop-blur-md rounded-2xl md:rounded-3xl px-4 md:px-6 py-2 md:py-3 shadow-xl border border-white/20 flex flex-col text-white pointer-events-auto transition-transform ${widgetSizeClass('clock')} ${isEditMode ? 'cursor-pointer animate-wiggle' : ''}`}>
            <div className="text-2xl md:text-4xl font-light tracking-tight leading-none drop-shadow-lg tabular-nums">{timeStr}</div>
            <div className="text-[10px] md:text-xs mt-1 opacity-90 font-medium truncate">{dateStr}</div>
            {isEditMode && <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-lg" onClick={(e) => { e.stopPropagation(); setWidgets(w => w.filter(x => x !== 'clock')); }}>×</button>}
          </div>
        )}
        {widgets.includes('weather') && (
          <div onClick={() => isEditMode && cycleWidgetSize('weather')} className={`group relative bg-gradient-to-br from-sky-400/40 to-blue-600/40 backdrop-blur-md rounded-2xl md:rounded-3xl px-3 md:px-5 py-2 md:py-3 shadow-xl border border-white/20 flex items-center gap-2 md:gap-3 text-white pointer-events-auto transition-transform ${widgetSizeClass('weather')} ${isEditMode ? 'cursor-pointer animate-wiggle' : ''}`}>
            <Sun size={28} className="text-yellow-300 drop-shadow-md"/>
            <div>
              <div className="text-lg md:text-2xl font-bold leading-none">21°</div>
              <div className="text-[10px] opacity-90 mt-0.5">서울 · 맑음</div>
            </div>
            {isEditMode && <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-lg" onClick={(e) => { e.stopPropagation(); setWidgets(w => w.filter(x => x !== 'weather')); }}>×</button>}
          </div>
        )}
        {widgets.includes('calendar') && (
          <div onClick={() => isEditMode && cycleWidgetSize('calendar')} className={`group relative bg-white/15 backdrop-blur-md rounded-2xl px-3 py-2 shadow-xl border border-white/20 text-white pointer-events-auto transition-transform ${widgetSizeClass('calendar')} ${isEditMode ? 'cursor-pointer animate-wiggle' : ''}`}>
            <div className="text-[10px] opacity-80">{time ? time.toLocaleDateString('ko-KR', { weekday: 'long' }) : ''}</div>
            <div className="text-2xl font-bold leading-none">{time ? time.getDate() : ''}</div>
            {isEditMode && <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-lg" onClick={(e) => { e.stopPropagation(); setWidgets(w => w.filter(x => x !== 'calendar')); }}>×</button>}
          </div>
        )}
        {widgets.includes('music') && (
          <div onClick={() => isEditMode && cycleWidgetSize('music')} className={`group relative bg-gradient-to-br from-pink-500/40 to-purple-600/40 backdrop-blur-md rounded-2xl px-3 py-2 shadow-xl border border-white/20 text-white pointer-events-auto flex items-center gap-2 transition-transform ${widgetSizeClass('music')} ${isEditMode ? 'cursor-pointer animate-wiggle' : ''}`}>
            <div className="text-2xl">🎵</div><div className="text-xs">재생 중</div>
            {isEditMode && <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-lg" onClick={(e) => { e.stopPropagation(); setWidgets(w => w.filter(x => x !== 'music')); }}>×</button>}
          </div>
        )}
        {widgets.includes('fitness') && (
          <div onClick={() => isEditMode && cycleWidgetSize('fitness')} className={`group relative bg-gradient-to-br from-green-500/40 to-emerald-600/40 backdrop-blur-md rounded-2xl px-3 py-2 shadow-xl border border-white/20 text-white pointer-events-auto flex items-center gap-2 transition-transform ${widgetSizeClass('fitness')} ${isEditMode ? 'cursor-pointer animate-wiggle' : ''}`}>
            <div className="text-2xl">👟</div><div className="text-xs">5,280 걸음</div>
            {isEditMode && <button className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-lg" onClick={(e) => { e.stopPropagation(); setWidgets(w => w.filter(x => x !== 'fitness')); }}>×</button>}
          </div>
        )}
      </div>

      {/* App grid — fills the screen like real tablet */}
      <div key={`page-${currentPage}`} className="flex-1 flex flex-col justify-center pt-8 md:pt-20 pb-4 min-h-0 animate-[fadeIn_0.25s_ease-out]">
        <div className={`grid gap-y-3 md:gap-y-5 gap-x-1 md:gap-x-2 px-2 md:px-6 w-full max-w-[1200px] justify-items-center self-center ${isPhone ? 'grid-cols-4' : 'grid-cols-4 md:grid-cols-8'}`}>
          {(() => {
            const slots: any[] = [...homeApps];
            const extras: string[] = [];
            if (currentPage === 0 && installedApps.includes('math') && !isEditMode) extras.push('__math');
            if (currentPage === 0) PLAYSTORE_APPS.forEach(a => { if (installedApps.includes(a.id)) extras.push(`__ps:${a.id}`); });
            for (const ex of extras) {
              const i = slots.indexOf(null);
              if (i >= 0) slots[i] = ex; else slots.push(ex);
            }
            return slots.map((appName, index) => {
              if (appName === '__math') {
                return (
                  <ActionTarget
                    key={`math-${index}`} id="app-icon-math" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                    onClick={() => setMathAppOpen(true)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer group w-[64px] md:w-[88px]"
                  >
                    <div className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] bg-yellow-400 rounded-[1.25rem] flex items-center justify-center shadow-lg font-black text-white text-2xl transition-transform group-hover:scale-105 active:scale-95">1+2</div>
                    <span className="text-white text-[11px] md:text-[12px] font-medium drop-shadow-md truncate w-full text-center">수학탐험대</span>
                  </ActionTarget>
                );
              }
              if (typeof appName === 'string' && appName.startsWith('__ps:')) {
                const id = appName.slice(5);
                const app = PLAYSTORE_APPS.find(a => a.id === id);
                if (!app) return null;
                return (
                  <div key={`ps-${index}`} onClick={() => alert(`${app.name} 앱이 실행되었어요! (시뮬레이션)`)} className="flex flex-col items-center gap-1.5 cursor-pointer group w-[64px] md:w-[88px] active:scale-95 transition-transform">
                    <div className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] rounded-[1.25rem] flex items-center justify-center shadow-lg font-black text-white text-2xl group-hover:scale-105 transition-transform" style={{ background: app.color }}>{app.label}</div>
                    <span className="text-white text-[11px] md:text-[12px] font-medium drop-shadow-md truncate w-full text-center">{app.name}</span>
                  </div>
                );
              }
              if (appName) return <div key={index} data-slot-idx={index}>{renderAppIcon(appName, index)}</div>;
              return (
                <ActionTarget
                  key={index} id={`empty-slot-${index}`} currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                  className={`w-[56px] h-[56px] md:w-[64px] md:h-[64px] ${isEditMode ? 'border-2 border-dashed border-white/50 rounded-[1.25rem] bg-white/10 transition-colors' : ''}`}
                ><div data-slot-idx={index} className="w-full h-full"></div></ActionTarget>
              );
            });
          })()}
        </div>
      </div>

      {/* Bottom search bar (Samsung Finder style) */}
      <div className="w-full max-w-xl mx-auto mb-3 bg-white/90 rounded-full h-11 md:h-12 flex items-center px-5 shadow-lg shrink-0 transition-transform active:scale-[0.98]">
        <span className="text-gray-500 text-sm flex-1">검색</span>
        <Mic size={18} className="text-gray-500" />
      </div>

      <div className="absolute bottom-14 w-full flex justify-center gap-2 left-0">
        {homePages.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrentPage(i); }}
            className={`h-2 rounded-full transition-all ${i === currentPage ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
          />
        ))}
      </div>
      </div>



      {/* App drawer pull-up handle */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 flex flex-col items-center justify-end pb-1 cursor-pointer group"
        onClick={() => setAppDrawerOpen(true)}
        onTouchStart={(e) => setDrawerSwipeStart(e.touches[0].clientY)}
        onTouchMove={(e) => {
          if (drawerSwipeStart !== null && drawerSwipeStart - e.touches[0].clientY > 60) {
            setAppDrawerOpen(true);
            setDrawerSwipeStart(null);
          }
        }}
        onTouchEnd={() => setDrawerSwipeStart(null)}
      >
        <ChevronUp size={28} className="text-white/70 group-hover:text-white animate-pulse-up" />
        <div className="text-white/60 text-[11px] -mt-1">앱 서랍</div>
      </div>

      {dragInfo.isDragging && (
        <div id="drag-ghost" className="fixed pointer-events-none z-[200] opacity-80" style={{ left: dragInfo.x - dragInfo.offsetX, top: dragInfo.y - dragInfo.offsetY }}>
          {renderAppIcon(homeApps[dragInfo.index], dragInfo.index)}
        </div>
      )}

      {/* App Drawer overlay */}
      {appDrawerOpen && (
        <div className="absolute inset-0 z-[90] bg-black/85 backdrop-blur-xl animate-[slideUp_0.3s_ease-out] flex flex-col pt-6">
          <div className="flex items-center justify-between px-8 mb-3">
            <div className="text-white text-2xl font-bold">앱 서랍</div>
            <button
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-90 transition-all"
              onClick={() => { setAppDrawerOpen(false); setDrawerSearch(''); }}
            >
              <X size={20}/>
            </button>
          </div>
          <div className="px-8 mb-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"/>
              <input
                value={drawerSearch}
                onChange={(e) => setDrawerSearch(e.target.value)}
                placeholder="앱 검색…"
                className="w-full bg-white/10 border border-white/15 text-white placeholder-white/40 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:bg-white/15"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-8">
            {(() => {
              const all = homeApps.filter(Boolean).concat(installedApps.includes('math') ? ['math'] : []);
              const filtered = drawerSearch
                ? all.filter(a => a.toLowerCase().includes(drawerSearch.toLowerCase()))
                : all;
              return (
            <div className="grid grid-cols-6 md:grid-cols-8 gap-y-8 gap-x-4 justify-items-center">
              {filtered.map((appName, i) => (
                <div
                  key={`drawer-${appName}-${i}`}
                  className="flex flex-col items-center gap-2 cursor-pointer group w-[72px] active:scale-95 transition-transform"
                  onClick={() => {
                    if (drawerLongPressTimer) { clearTimeout(drawerLongPressTimer); setDrawerLongPressTimer(null); }
                    if (appName === 'math') { setMathAppOpen(true); setAppDrawerOpen(false); return; }
                    setCurrentApp(appName);
                    setAppDrawerOpen(false);
                  }}
                  onMouseDown={() => {
                    const t = setTimeout(() => setUninstallTarget(appName), 600);
                    setDrawerLongPressTimer(t);
                  }}
                  onMouseUp={() => { if (drawerLongPressTimer) { clearTimeout(drawerLongPressTimer); setDrawerLongPressTimer(null); } }}
                  onMouseLeave={() => { if (drawerLongPressTimer) { clearTimeout(drawerLongPressTimer); setDrawerLongPressTimer(null); } }}
                  onTouchStart={() => {
                    const t = setTimeout(() => setUninstallTarget(appName), 600);
                    setDrawerLongPressTimer(t);
                  }}
                  onTouchEnd={() => { if (drawerLongPressTimer) { clearTimeout(drawerLongPressTimer); setDrawerLongPressTimer(null); } }}
                >
                  <div className="w-[72px] h-[72px] pointer-events-none">
                    {appName === 'math' ? (
                      <div className="w-full h-full bg-yellow-400 rounded-[1.25rem] flex items-center justify-center shadow-lg font-black text-white text-3xl">1+2</div>
                    ) : renderAppIcon(appName, -1)}
                  </div>
                </div>
              ))}
            </div>
              );
            })()}
            <div className="text-center text-white/50 text-xs mt-8">아이콘을 꾹 누르면 앱을 삭제할 수 있어요 · 총 {homeApps.filter(Boolean).length + (installedApps.includes('math') ? 1 : 0)}개</div>
          </div>


          {/* Uninstall confirm */}
          {uninstallTarget && (
            <div className="absolute inset-0 z-[95] bg-black/60 flex items-center justify-center animate-[fadeIn_0.2s_ease-out]" onClick={() => setUninstallTarget(null)}>
              <div className="bg-[#1c1c1e] text-white rounded-3xl p-6 w-[340px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-3">
                  <Trash2 size={24} className="text-red-400"/>
                  <div className="text-lg font-bold">앱 삭제</div>
                </div>
                <div className="text-sm text-gray-300 mb-6 leading-relaxed">
                  <span className="font-bold text-white">{uninstallTarget}</span> 앱을 정말 삭제하시겠어요? 시스템 앱은 사용 중지됩니다.
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all font-medium"
                    onClick={() => setUninstallTarget(null)}
                  >취소</button>
                  <button
                    className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 transition-all font-bold"
                    onClick={() => {
                      if (uninstallTarget === 'math') {
                        setInstalledApps(prev => prev.filter(a => a !== 'math'));
                      } else {
                        setHomeApps(prev => prev.map(a => a === uninstallTarget ? null : a));
                      }
                      setUninstallTarget(null);
                    }}
                  >삭제</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
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

  const renderStatusBar = () => (
    <>
      <ActionTarget
        id="swipe-trigger" currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance={true}
        onTouchStart={handleSwipeStart} onMouseDown={handleSwipeStart}
        onClick={() => { if (!quickPanelOpen) { setQuickPanelOpen(true); advanceQuest('swipe-trigger'); } }}
        tooltipPosition="bottom"
        tooltipText="↓ 아래로 드래그(또는 탭)하세요"
        className="absolute top-0 w-full h-8 px-6 flex justify-between items-center text-white text-sm cursor-ns-resize z-[80] select-none bg-gradient-to-b from-black/40 to-transparent"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold drop-shadow-md tracking-tight">{timeStr}</span>
          {notifications.length > 0 && (
            <div className="flex items-center gap-1 bg-red-500/90 px-1.5 rounded-full text-[10px] font-bold leading-none py-0.5">
              <Bell size={9} strokeWidth={3}/> {notifications.length}
            </div>
          )}
        </div>
        <div className="flex space-x-1.5 items-center drop-shadow-md">
          {airplane && <Plane size={14} strokeWidth={2.5} />}
          {wifiConnected && !airplane && <Wifi size={14} strokeWidth={2.5} />}
          {bluetooth && <Bluetooth size={14} strokeWidth={2.5} />}
          {soundMode === 'vibrate' && <Vibrate size={14} strokeWidth={2.5} />}
          {soundMode === 'mute' && <VolumeX size={14} strokeWidth={2.5} />}
          {!airplane && (
            <>
              <Signal size={14} strokeWidth={2.5} />
              <span className="text-[10px] font-bold tracking-wider">LTE</span>
            </>
          )}
          <span className="text-[11px] font-bold ml-1 tabular-nums">98%</span>
          {/* 배터리 아이콘 — 깔끔한 캡슐 형태 + 충전 번개 */}
          <div className="relative flex items-center ml-0.5">
            <div className="relative w-[26px] h-[12px] border-[1.5px] border-white/95 rounded-[3px] p-[1.5px] bg-transparent">
              <div className="h-full bg-white rounded-[1.5px]" style={{ width: '92%' }}></div>
              <Zap size={8} strokeWidth={3} className="absolute inset-0 m-auto text-[#0f172a] fill-[#0f172a]" />
            </div>
            <div className="w-[2px] h-[5px] bg-white/95 rounded-r-[1px] -ml-px"></div>
          </div>
        </div>
      </ActionTarget>

      {currentTargetId === 'swipe-trigger' && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[110] pointer-events-none flex flex-col items-center animate-bounce">
          <div className="w-1 h-10 bg-yellow-400 rounded-full"></div>
          <div className="w-4 h-4 border-r-4 border-b-4 border-yellow-400 rotate-45 -mt-2"></div>
        </div>
      )}
    </>
  );


  const renderQuickPanel = () => (
    <div
      className={`absolute inset-0 z-50 transition-opacity duration-300 ${quickPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{ background: 'radial-gradient(ellipse at top, rgba(60,60,60,0.55) 0%, rgba(0,0,0,0.65) 70%)', backdropFilter: 'blur(28px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) { setQuickPanelOpen(false); advanceQuest('quick-panel-bg'); } }}
    >

      {/* 상단 상태 줄 + 액션 아이콘 */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-8 py-5 text-white/95 z-10">
        <span className="text-sm font-medium tracking-tight drop-shadow">{airplane ? '비행기 탑승 모드' : 'SIM 카드 없음 · 제한구역서비스'}</span>
        <div className="flex items-center gap-5">
          <div className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center text-base shadow-md">🙂</div>
          <button className="p-1.5 rounded-full hover:bg-white/10 active:scale-90 transition" title="편집"><Sliders size={20}/></button>
          <button className="p-1.5 rounded-full hover:bg-white/10 active:scale-90 transition" title="전원"><Power size={20}/></button>
          <button
            className="p-1.5 rounded-full hover:bg-white/10 active:scale-90 transition"
            title="설정"
            onClick={() => { setCurrentApp('Settings'); setSettingsMenu('connections'); setQuickPanelOpen(false); }}
          ><Settings size={20}/></button>
        </div>
      </div>

      {/* 메인 패널 (스크롤 가능) */}
      <div className="w-full h-full pt-16 pb-8 px-4 md:px-12 overflow-y-auto flex flex-col items-center gap-3">
        <div className="w-full max-w-3xl flex flex-col gap-3">

          {/* 알림 영역 */}
          {notifications.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-2 mb-0.5">
                <span className="text-white/80 text-xs font-semibold tracking-wide">알림 {notifications.length}</span>
                <ActionTarget
                  id="notif-clear-all" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                  onClick={() => { setNotifications([]); setTimeout(() => { setQuickPanelOpen(false); }, 400); }}
                  tooltipPosition="left"
                  tooltipText="모두 지우기"
                  className="text-white/80 text-xs font-medium px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 cursor-pointer transition"
                >
                  모두 지우기
                </ActionTarget>
              </div>
              {notifications.map(n => {
                const drag = notifDrag && notifDrag.id === n.id ? notifDrag.dx : 0;
                const opacity = Math.max(0, 1 - Math.abs(drag) / 200);
                const isRead = readNotifIds.includes(n.id);
                return (
                  <ActionTarget
                    key={n.id}
                    id={`notif-tap-${n.id}`}
                    currentTargetId={currentTargetId}
                    advanceQuest={advanceQuest}
                    extraTargetIds={[`notif-dismiss-${n.id}`]}
                    disableClickAdvance={true}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (Math.abs(drag) > 5) return;
                      setReadNotifIds(prev => prev.includes(n.id) ? prev : [...prev, n.id]);
                      advanceQuest(`notif-tap-${n.id}`);
                    }}
                    tooltipPosition="bottom"
                    tooltipText={currentTargetId === `notif-dismiss-${n.id}` ? '← 옆으로 스와이프해서 지우기' : '탭해서 확인'}
                    onPointerDown={(e: any) => {
                      e.stopPropagation();
                      setNotifDrag({ id: n.id, startX: e.clientX, dx: 0 });
                    }}
                    onPointerMove={(e: any) => {
                      if (!notifDrag || notifDrag.id !== n.id) return;
                      setNotifDrag({ ...notifDrag, dx: e.clientX - notifDrag.startX });
                    }}
                    onPointerUp={(e: any) => {
                      if (!notifDrag || notifDrag.id !== n.id) { setNotifDrag(null); return; }
                      const d = notifDrag.dx;
                      setNotifDrag(null);
                      if (Math.abs(d) > 100) {
                        setNotifications(prev => prev.filter(x => x.id !== n.id));
                        advanceQuest(`notif-dismiss-${n.id}`);
                      }
                    }}
                    className="bg-white/95 text-gray-900 rounded-2xl px-4 py-3 shadow-lg flex items-start gap-3 cursor-pointer select-none touch-none"
                    style={{ transform: `translateX(${drag}px)`, opacity, transition: notifDrag && notifDrag.id === n.id ? 'none' : 'transform 0.2s, opacity 0.2s' }}
                  >
                    <div className={`w-8 h-8 rounded-lg ${n.color} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow`}>
                      {n.app === 'KakaoTalk' ? '💬' : n.app === 'Messages' ? '✉️' : n.app === 'Gmail' ? 'M' : '!'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-0.5">
                        <span className="font-semibold">{n.appName}</span>
                        <span>· 방금 전</span>
                        {isRead && <span className="text-blue-500 font-medium">· 읽음</span>}
                      </div>
                      <div className="text-sm font-bold truncate">{n.title}</div>
                      <div className="text-[13px] text-gray-700 truncate">{n.body}</div>
                    </div>
                  </ActionTarget>
                );
              })}
            </div>
          )}



          {/* Wi-Fi / 블루투스 대형 알약 */}
          <div className="grid grid-cols-2 gap-3">
            <ActionTarget
              id="quick-wifi-toggle" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={() => {
                if(!wifi) { setWifi(true); setTimeout(() => setWifiModalOpen(true), 300); }
                else { setWifi(false); setWifiConnected(null); }
              }}
              className={`h-20 px-6 rounded-full flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer ${wifi ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/15 text-white backdrop-blur-md'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${wifi ? 'bg-white/20' : 'bg-white/15'}`}><Wifi size={24}/></div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-semibold text-base">Wi-Fi</span>
                <span className="text-xs opacity-80 truncate">{wifiConnected || (wifi ? '연결 대기' : '사용 안 함')}</span>
              </div>
            </ActionTarget>

            <ActionTarget
              id="quick-bluetooth" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={() => {
                if (!bluetooth) { setBluetooth(true); setBluetoothModalOpen(true); }
                else { setBluetoothModalOpen(true); }
              }}
              className={`h-20 px-6 rounded-full flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer ${bluetooth ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/15 text-white backdrop-blur-md'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bluetooth ? 'bg-white/20' : 'bg-white/15'}`}><Bluetooth size={24}/></div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-semibold text-base">블루투스</span>
                <span className="text-xs opacity-80 truncate">{connectedBtDevice || (bluetooth ? '켜짐' : '꺼짐')}</span>
              </div>
            </ActionTarget>
          </div>

          {/* 둥근 아이콘 캡슐 그리드 (2행 x 5열) */}
          <div className="bg-white/12 backdrop-blur-md rounded-[2rem] p-5">
            <div className="grid grid-cols-5 gap-y-5 justify-items-center">
              {[
                { key: 'rotate', icon: <RefreshCcw size={22}/>, on: true, label: '자동회전' },
                { key: 'airplane', icon: <Plane size={22}/>, on: airplane, label: '비행기', target: 'quick-airplane', onClick: () => setAirplane(!airplane) },
                { key: 'flash', icon: <Flashlight size={22}/>, on: false, label: '손전등' },
                { key: 'data', icon: <Signal size={22}/>, on: !airplane, label: '모바일' },
                { key: 'hotspot', icon: <Cloud size={22}/>, on: false, label: '핫스팟' },
                { key: 'battery', icon: <BatteryCharging size={22}/>, on: false, label: '절전' },
                { key: 'eye', icon: <ImageIcon size={22}/>, on: false, label: '눈편함' },
                { key: 'sync', icon: <RefreshCcw size={22}/>, on: true, label: '동기화' },
                { key: 'darkmode', icon: <Moon size={22}/>, on: darkMode, label: '다크모드', target: 'quick-darkmode', onClick: () => setDarkMode(!darkMode) },
                { key: 'location', icon: <MapPin size={22}/>, on: true, label: '위치' },
              ].map((it: any) => {
                const inner = (
                  <div className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${it.on ? 'bg-white text-black' : 'bg-white/15 text-white'}`}>
                      {it.icon}
                    </div>
                    <span className="text-[10px] text-white/85">{it.label}</span>
                  </div>
                );
                return it.target ? (
                  <ActionTarget key={it.key} id={it.target} currentTargetId={currentTargetId} advanceQuest={advanceQuest} onClick={it.onClick}>
                    {inner}
                  </ActionTarget>
                ) : (
                  <div key={it.key} onClick={it.onClick}>{inner}</div>
                );
              })}
            </div>
          </div>

          {/* 밝기 / 음량 슬라이더 (캡슐) */}
          <div className="flex flex-col gap-2.5">
            <div className="bg-white/12 backdrop-blur-md rounded-full h-14 flex items-center px-5 gap-4">
              <Sun size={20} className="text-white/90 shrink-0"/>
              <input type="range" min="10" max="100" value={brightness}
                onChange={(e) => setBrightness(e.target.value)}
                className="flex-1 accent-white h-2 bg-white/25 rounded-full appearance-none cursor-pointer"/>
              <Moon size={20} className="text-white/90 shrink-0"/>
            </div>
            <ActionTarget id="quick-volume-slider" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              className="bg-white/12 backdrop-blur-md rounded-full h-14 flex items-center px-5 gap-4">
              <VolumeX size={20} className="text-white/90 shrink-0"/>
              <input type="range" min="0" max="100" value={volume}
                onChange={(e) => { setVolume(e.target.value); advanceQuest('quick-volume-slider'); }}
                className="flex-1 accent-white h-2 bg-white/25 rounded-full appearance-none cursor-pointer"/>
              <Volume2 size={20} className="text-white/90 shrink-0"/>
            </ActionTarget>
          </div>

          {/* 음악 재생 + 미디어 출력 */}
          <div className="bg-white/12 backdrop-blur-md rounded-full h-14 flex items-center justify-between pl-6 pr-2">
            <div className="flex items-center gap-3 text-white">
              <Play size={18}/>
              <span className="text-sm font-medium">음악 재생</span>
            </div>
            <button className="bg-white/15 hover:bg-white/25 rounded-full h-10 px-5 text-xs text-white font-medium active:scale-95 transition">미디어 출력</button>
          </div>

          {/* 소리 모드 (간소) */}
          <div className="grid grid-cols-3 gap-3">
            <div onClick={() => setSoundMode('sound')} className={`h-14 rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition ${soundMode === 'sound' ? 'bg-blue-500 text-white' : 'bg-white/12 text-white/90'}`}>
              <Volume2 size={18}/><span className="text-xs font-medium">소리</span>
            </div>
            <ActionTarget id="quick-sound-vibrate" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={() => setSoundMode('vibrate')}
              className={`h-14 rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition ${soundMode === 'vibrate' ? 'bg-blue-500 text-white' : 'bg-white/12 text-white/90'}`}
            >
              <Vibrate size={18}/><span className="text-xs font-medium">진동</span>
            </ActionTarget>
            <div onClick={() => setSoundMode('mute')} className={`h-14 rounded-full flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition ${soundMode === 'mute' ? 'bg-blue-500 text-white' : 'bg-white/12 text-white/90'}`}>
              <VolumeX size={18}/><span className="text-xs font-medium">무음</span>
            </div>
          </div>

          {/* 하단 카드 2x2 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/12 backdrop-blur-md rounded-3xl h-20 flex items-center gap-4 px-5 cursor-pointer active:scale-[0.98] transition">
              <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center text-white"><Smartphone size={22}/></div>
              <span className="text-sm font-semibold text-white">주변 기기 연결</span>
            </div>
            <div className="bg-white/12 backdrop-blur-md rounded-3xl h-20 flex flex-col justify-center gap-0.5 px-5 cursor-pointer active:scale-[0.98] transition">
              <div className="flex items-center gap-2 text-white"><span className="text-base">✻</span><span className="text-sm font-semibold">SmartThings</span></div>
              <span className="text-[11px] text-white/70 pl-7">기기 제어</span>
            </div>
            <ActionTarget id="quick-screenshot" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={() => {
                const flash = document.createElement('div');
                flash.className = 'fixed inset-0 bg-white z-[200] pointer-events-none opacity-90';
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 200);
                setPhotos(prev => [...prev, { id: Date.now(), seed: Math.floor(Math.random()*1000) }]);
              }}
              className="bg-white/12 backdrop-blur-md rounded-3xl h-20 flex items-center gap-4 px-5 cursor-pointer active:scale-[0.98] transition"
            >
              <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center text-white"><Camera size={22}/></div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">스크린샷</span>
                <span className="text-[11px] text-white/70">화면 캡처</span>
              </div>
            </ActionTarget>
            <div className="bg-white/12 backdrop-blur-md rounded-3xl h-20 flex items-center gap-4 px-5 cursor-pointer active:scale-[0.98] transition">
              <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center text-white"><MonitorPlay size={22}/></div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Smart View</span>
                <span className="text-[11px] text-white/70">화면 미러링</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {quickPanelOpen && (
        <ActionTarget
          id="quick-panel-bg"
          currentTargetId={currentTargetId}
          advanceQuest={advanceQuest}
          onClick={() => setQuickPanelOpen(false)}
          tooltipPosition="top"
          tooltipText="여기를 눌러 퀵패널 닫기"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-6 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-sm font-medium flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg"
        >
          <ChevronUp size={16} /> 닫기 (위로 스와이프)
        </ActionTarget>
      )}



      {wifiModalOpen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#1c1c1e] rounded-3xl p-6 text-[#f5f5f5] shadow-2xl z-50 border border-gray-700/50 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl tracking-wide">Wi-Fi</h3>
            <X size={24} onClick={() => setWifiModalOpen(false)} className="cursor-pointer text-gray-400 hover:text-white bg-gray-800 rounded-full p-1 active:scale-90 transition-transform" />
          </div>
          {wifiConnected ? (
            <div className="p-4 bg-[#2c2c2e] rounded-2xl mb-2 flex items-center text-blue-400">
              <Wifi size={20} className="mr-4" />
              <div className="flex-1"><div className="font-semibold">탐험대_WiFi</div><div className="text-sm text-blue-400/80">연결됨</div></div>
            </div>
          ) : (
            <div className="space-y-3 h-64 overflow-y-auto pr-2">
              {WIFI_NETWORKS.map((net, i) => (
                <ActionTarget
                  key={i} id={net.id} currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                  onClick={() => { if (net.id === 'wifi-net-0') { setWifiPasswordInput('open'); setWifiPassword(''); } }}
                  className="p-4 bg-[#2c2c2e] rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-[#3a3a3c] transition-all active:scale-[0.98]"
                >
                  <Wifi size={22} className="text-gray-300" />
                  <div className="flex-1"><div className="font-semibold text-[17px]">{net.name}</div><div className="text-sm text-gray-400">{net.secure ? '비밀번호로 보호됨' : '저장됨'}</div></div>
                </ActionTarget>
              ))}
            </div>
          )}

          {wifiPasswordInput === 'open' && (
            <div className="absolute inset-0 p-6 bg-[#1c1c1e] rounded-3xl z-10 flex flex-col justify-center animate-[fadeIn_0.2s_ease-out]">
              <h3 className="font-bold text-xl mb-4">탐험대_WiFi</h3>
              <div className="text-sm mb-2 text-gray-400 font-medium">비밀번호 입력</div>
              <div className="mb-8 w-full">
                <ActionTarget id="wifi-pw-input" currentTargetId={currentTargetId} advanceQuest={advanceQuest} className="w-full block">
                  <input type="password" value={wifiPassword}
                    onChange={(e) => { setWifiPassword(e.target.value); if (e.target.value.length > 0) advanceQuest('wifi-pw-input'); }}
                    placeholder="비밀번호 타이핑"
                    className="w-full bg-[#2c2c2e] border border-blue-500/50 rounded-xl p-4 text-white outline-none text-lg shadow-inner focus:ring-2 focus:ring-blue-500 m-0 block transition-all" />
                </ActionTarget>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 py-4 bg-[#3a3a3c] hover:bg-[#4a4a4c] active:scale-95 rounded-xl font-bold text-lg transition-all" onClick={() => setWifiPasswordInput('')}>취소</button>
                <ActionTarget
                  id="wifi-connect-btn" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                  disableClickAdvance={wifiPassword.length === 0}
                  className={`flex-1 ${wifiPassword.length === 0 ? 'pointer-events-none' : ''}`}
                  onClick={() => { if (wifiPassword.length > 0) { setWifiConnected('탐험대_WiFi'); setWifiPasswordInput(''); setTimeout(() => setWifiModalOpen(false), 800); } }}
                >
                  <button className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${wifiPassword.length > 0 ? 'bg-blue-600 text-white active:scale-95 cursor-pointer' : 'bg-gray-600 text-gray-400 pointer-events-none'}`}>연결</button>
                </ActionTarget>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderCamera = () => (
    <div className="flex-1 bg-black relative flex flex-col overflow-hidden min-h-0 animate-[fadeIn_0.3s_ease-out]">
      {!cameraPermissionAsked && (
        <div className="absolute inset-0 z-[120] bg-black/85 flex items-center justify-center backdrop-blur">
          <div className="bg-[#1c1c1e] text-white rounded-3xl p-6 mx-4 w-full max-w-[360px] shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0"><Camera size={24} className="text-blue-400"/></div>
              <div>
                <div className="font-bold text-lg">카메라 권한</div>
                <div className="text-xs text-gray-400">카메라 앱이 다음을 요청합니다</div>
              </div>
            </div>
            <div className="text-sm text-gray-300 leading-relaxed mb-6">
              사진을 찍고 동영상을 녹화할 수 있도록 <span className="font-bold text-white">카메라</span>에 액세스 권한을 허용하시겠어요?
            </div>
            <div className="flex flex-col gap-2">
              <button className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all font-bold" onClick={() => setCameraPermissionAsked(true)}>앱 사용 중에만 허용</button>
              <button className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all font-medium" onClick={() => setCameraPermissionAsked(true)}>이번만 허용</button>
              <button className="w-full py-2 text-red-400 active:scale-95 text-sm" onClick={() => { setCameraPermissionAsked(true); setCurrentApp(null); }}>허용 안 함</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 relative flex items-center justify-center overflow-hidden pt-8 bg-[#111]">
        <div className="w-80 h-80 opacity-95"><CuteStudent seed={currentCameraSeed} /></div>
        <div className="absolute top-6 right-6 flex flex-col gap-6 text-white"><Settings size={28} className="drop-shadow-md cursor-pointer active:scale-90 transition-transform"/></div>
        <div className="absolute inset-0 border border-white/20 m-12 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-px h-full bg-white/20"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-white/20"></div>
          <div className="absolute top-1/3 left-0 w-full h-px bg-white/20"></div>
          <div className="absolute bottom-1/3 left-0 w-full h-px bg-white/20"></div>
        </div>
      </div>
      <div className="h-40 bg-black flex justify-around items-center px-12 pb-4 shrink-0">
        <div className="w-16 h-16 rounded-full border border-gray-600 bg-gray-800 overflow-hidden cursor-pointer flex-shrink-0 active:scale-95 transition-transform" onClick={() => setCurrentApp('Gallery')}>
          {photos.length > 0 && <div className="w-full h-full bg-[#111] flex items-center justify-center p-1"><CuteStudent seed={photos[photos.length-1].seed} /></div>}
        </div>
        <ActionTarget
          id="camera-shutter" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
          onClick={() => {
            const flash = document.createElement('div');
            flash.className = 'fixed inset-0 bg-white z-[200] pointer-events-none opacity-70';
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 200);
            setPhotos([...photos, { id: Date.now(), seed: currentCameraSeed }]);
            setCurrentCameraSeed(Date.now());
          }}
        >
          <div className="w-24 h-24 rounded-full border-[6px] border-white p-1 cursor-pointer hover:scale-105 active:scale-95 transition-all">
            <div className="w-full h-full bg-white rounded-full"></div>
          </div>
        </ActionTarget>
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-white flex-shrink-0 hover:bg-gray-700 active:scale-95 transition-all cursor-pointer"><Camera size={26} /></div>
      </div>
    </div>
  );

  const renderGallery = () => {
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

  const renderPlayStore = () => {
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

  const renderCalculator = () => {
    const apply = (a: number, b: number, op: string) => {
      if (op === '+') return a + b;
      if (op === '−') return a - b;
      if (op === '×') return a * b;
      if (op === '÷') return b === 0 ? 0 : a / b;
      return b;
    };
    const inputDigit = (d: string) => {
      if (calcJustEvaluated) { setCalcDisplay(d); setCalcJustEvaluated(false); return; }
      setCalcDisplay(prev => prev === '0' ? d : prev + d);
    };
    const inputDot = () => {
      if (calcJustEvaluated) { setCalcDisplay('0.'); setCalcJustEvaluated(false); return; }
      if (!calcDisplay.includes('.')) setCalcDisplay(calcDisplay + '.');
    };
    const chooseOp = (op: string) => {
      const cur = parseFloat(calcDisplay);
      if (calcPrev !== null && calcOp && !calcJustEvaluated) {
        const r = apply(calcPrev, cur, calcOp);
        setCalcPrev(r);
        setCalcDisplay(String(r));
      } else {
        setCalcPrev(cur);
      }
      setCalcOp(op);
      setCalcJustEvaluated(true);
    };
    const equals = () => {
      if (calcPrev === null || !calcOp) return;
      const cur = parseFloat(calcDisplay);
      const r = apply(calcPrev, cur, calcOp);
      setCalcDisplay(String(r));
      setCalcPrev(null);
      setCalcOp(null);
      setCalcJustEvaluated(true);
      if (Math.abs(r - 96) < 1e-9) advanceQuest('calc-result-96');
    };
    const clear = () => { setCalcDisplay('0'); setCalcPrev(null); setCalcOp(null); setCalcJustEvaluated(false); };
    const Btn = ({ label, onPress, variant = 'num', targetId }: any) => (
      <ActionTarget id={targetId || `calc-btn-${label}`} currentTargetId={currentTargetId} advanceQuest={advanceQuest}
        disableClickAdvance={!targetId}
        onClick={onPress}
        className={`h-16 rounded-2xl text-2xl font-medium flex items-center justify-center active:scale-95 transition-all cursor-pointer select-none ${
          variant === 'op' ? 'bg-orange-500 text-white' :
          variant === 'fn' ? 'bg-[#a6a6a6] text-black' :
          'bg-[#333333] text-white'
        }`}
      >
        {label}
      </ActionTarget>
    );
    return (
      <div className="flex-1 bg-black text-white flex flex-col pt-10 px-4 pb-4 animate-[fadeIn_0.3s_ease-out] overflow-hidden min-h-0">
        <div className="text-right text-7xl md:text-8xl font-extralight px-4 pb-6 truncate tabular-nums" aria-live="polite">{calcDisplay}</div>
        <div className="grid grid-cols-4 gap-3">
          <Btn label="AC" variant="fn" onPress={clear}/>
          <Btn label="±" variant="fn" onPress={() => setCalcDisplay(d => d.startsWith('-') ? d.slice(1) : (d === '0' ? d : '-' + d))}/>
          <Btn label="%" variant="fn" onPress={() => setCalcDisplay(String(parseFloat(calcDisplay) / 100))}/>
          <Btn label="÷" variant="op" onPress={() => chooseOp('÷')}/>
          <Btn label="7" onPress={() => inputDigit('7')}/>
          <Btn label="8" onPress={() => inputDigit('8')} targetId="calc-key-8"/>
          <Btn label="9" onPress={() => inputDigit('9')}/>
          <Btn label="×" variant="op" onPress={() => chooseOp('×')} targetId="calc-key-mul"/>
          <Btn label="4" onPress={() => inputDigit('4')}/>
          <Btn label="5" onPress={() => inputDigit('5')}/>
          <Btn label="6" onPress={() => inputDigit('6')}/>
          <Btn label="−" variant="op" onPress={() => chooseOp('−')}/>
          <Btn label="1" onPress={() => inputDigit('1')} targetId="calc-key-1"/>
          <Btn label="2" onPress={() => inputDigit('2')} targetId="calc-key-2"/>
          <Btn label="3" onPress={() => inputDigit('3')}/>
          <Btn label="+" variant="op" onPress={() => chooseOp('+')}/>
          <ActionTarget id="calc-key-0" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
            onClick={() => inputDigit('0')}
            className="col-span-2 h-16 rounded-2xl text-2xl font-medium flex items-center justify-start pl-7 active:scale-95 transition-all cursor-pointer select-none bg-[#333333] text-white"
          >0</ActionTarget>
          <Btn label="." onPress={inputDot}/>
          <Btn label="=" variant="op" onPress={equals} targetId="calc-key-eq"/>
        </div>
      </div>
    );
  };

  const renderNotes = () => {

    const startDraw = (e: any) => {
      if (!notesEditing) return;
      const svg = e.currentTarget as SVGSVGElement;
      const rect = svg.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      const x = ((cx - rect.left) / rect.width) * 100;
      const y = ((cy - rect.top) / rect.height) * 100;
      setIsDrawing(true);
      setNotesEditing({ ...notesEditing, current: `M ${x.toFixed(2)} ${y.toFixed(2)}` });
    };
    const moveDraw = (e: any) => {
      if (!isDrawing || !notesEditing) return;
      const svg = e.currentTarget as SVGSVGElement;
      const rect = svg.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      const x = ((cx - rect.left) / rect.width) * 100;
      const y = ((cy - rect.top) / rect.height) * 100;
      setNotesEditing({ ...notesEditing, current: `${notesEditing.current} L ${x.toFixed(2)} ${y.toFixed(2)}` });
    };
    const endDraw = () => {
      if (!isDrawing || !notesEditing) return;
      setIsDrawing(false);
      if (notesEditing.current) {
        const paths = [...notesEditing.paths, notesEditing.current];
        setNotesEditing({ paths, current: '' });
        advanceQuest('notes-draw');
      }
    };

    if (notesEditing) {
      return (
        <div className="flex-1 bg-white flex flex-col pt-8 overflow-hidden min-h-0 animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 shrink-0">
            <button onClick={() => setNotesEditing(null)} className="flex items-center gap-1 text-gray-700 active:scale-95">
              <ChevronLeft size={24}/> <span className="font-medium">취소</span>
            </button>
            <div className="font-bold text-lg text-gray-900">새 메모</div>
            <ActionTarget id="notes-save" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
              onClick={() => {
                const all = [...notesEditing.paths, notesEditing.current].filter(Boolean);
                if (all.length > 0) setNotes(prev => [...prev, { id: Date.now(), paths: all }]);
                setNotesEditing(null);
              }}>
              <button className="px-4 py-2 rounded-full bg-red-500 text-white font-bold text-sm active:scale-95">저장</button>
            </ActionTarget>
          </div>
          <div className="flex-1 p-4 bg-[#fafafa] overflow-hidden min-h-0">
            <ActionTarget id="notes-draw" currentTargetId={currentTargetId} advanceQuest={advanceQuest} disableClickAdvance={true} className="w-full h-full block">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full bg-white rounded-2xl shadow-inner border border-gray-200 touch-none cursor-crosshair"
                onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
                onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}
              >
                {notesEditing.paths.map((d, i) => (
                  <path key={i} d={d} stroke="#1f2937" strokeWidth="0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 2 }}/>
                ))}
                {notesEditing.current && (
                  <path d={notesEditing.current} stroke="#ef4444" strokeWidth="0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 2 }}/>
                )}
              </svg>
            </ActionTarget>
          </div>
          <div className="flex items-center justify-center gap-3 py-3 bg-white border-t border-gray-200 shrink-0">
            <div className="w-8 h-8 rounded-full bg-black"/>
            <div className="w-8 h-8 rounded-full bg-red-500"/>
            <div className="w-8 h-8 rounded-full bg-blue-500"/>
            <div className="w-8 h-8 rounded-full bg-green-500"/>
            <button onClick={() => setNotesEditing({ paths: [], current: '' })} className="ml-4 text-sm text-gray-500 active:scale-95">전체 지우기</button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 bg-white flex flex-col pt-8 overflow-hidden min-h-0 animate-[fadeIn_0.3s_ease-out] relative">
        <div className="px-6 py-4 border-b border-gray-200 shrink-0">
          <div className="text-3xl font-bold text-gray-900">메모</div>
          <div className="text-sm text-gray-500 mt-1">{notes.length}개의 메모</div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-6xl mb-3">📝</div>
              <div className="text-sm">메모가 없어요. 오른쪽 아래 + 버튼으로 새 메모를 만들어보세요.</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {notes.map(n => (
                <div key={n.id} className="aspect-square bg-yellow-50 border border-yellow-200 rounded-2xl p-2 shadow-sm">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                    {n.paths.map((d, i) => (
                      <path key={i} d={d} stroke="#1f2937" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 2 }}/>
                    ))}
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>
        <ActionTarget id="notes-new" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
          onClick={() => setNotesEditing({ paths: [], current: '' })}
          tooltipPosition="top-left"
          tooltipText="+ 버튼을 누르세요!"
          className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-2xl active:scale-90 transition-all cursor-pointer text-4xl font-light"
        >
          <span>+</span>
        </ActionTarget>
      </div>
    );
  };

  const renderInternet = () => {
    const activeTab = internetTabs.find(t => t.id === internetActiveTabId) || internetTabs[0];
    const isBookmarked = activeTab && internetBookmarks.some(b => b.url === activeTab.url);

    const performSearch = (query: string) => {
      setInternetTabs(tabs => tabs.map(t =>
        t.id === internetActiveTabId
          ? { ...t, title: `${query} - 검색`, url: `https://search.tamhem.com/?q=${encodeURIComponent(query)}`, view: 'results' }
          : t
      ));
      setInternetUrlPanelOpen(false);
    };

    const addNewTab = () => {
      const newId = Math.max(0, ...internetTabs.map(t => t.id)) + 1;
      setInternetTabs(tabs => [...tabs, { id: newId, title: '새 탭', url: '', view: 'newtab' }]);
      setInternetActiveTabId(newId);
      setInternetTabSwitcherOpen(false);
    };

    const closeTab = (id: number) => {
      setInternetTabs(tabs => {
        const next = tabs.filter(t => t.id !== id);
        if (next.length === 0) {
          const fresh: InternetTab = { id: 1, title: '새 탭', url: '', view: 'newtab' };
          setInternetActiveTabId(1);
          return [fresh];
        }
        if (id === internetActiveTabId) setInternetActiveTabId(next[0].id);
        return next;
      });
    };

    const SEARCH_RESULTS = [
      { title: '초등학교 - 위키백과', url: 'wiki.tamhem.com › 초등학교', desc: '초등학교(初等學校)는 만 6세부터 12세까지의 어린이를 대상으로 기초 교육을 실시하는 학교이다. 한국에서는 6년제로 운영된다…' },
      { title: '우리 동네 초등학교 찾기 | 교육부', url: 'school.moe.go.kr', desc: '주소를 입력하면 가까운 초등학교를 찾을 수 있습니다. 학구도와 학교 정보를 한눈에 확인하세요.' },
      { title: '초등학교 입학 준비물 BEST 10', url: 'blog.tamhem.com › 초등입학', desc: '예비 초등학생을 위한 입학 준비물과 학습 준비 팁을 정리했습니다. 책가방, 실내화, 학용품…' },
      { title: '전국 초등학교 목록', url: 'edu.tamhem.com › list', desc: '전국 초등학교 6,200여 개의 위치와 학급 수를 한 번에 확인할 수 있는 페이지입니다.' },
    ];

    return (
      <div className="flex-1 bg-[#f1f3f4] flex flex-col pt-8 overflow-hidden min-h-0 animate-[fadeIn_0.3s_ease-out] relative">
        {/* 상단 주소창 */}
        <div className="shrink-0 bg-white border-b border-gray-200 px-3 py-2 flex items-center gap-2 shadow-sm">
          <button className="w-9 h-9 rounded-full hover:bg-gray-100 active:scale-90 flex items-center justify-center text-gray-700" title="뒤로">
            <ChevronLeft size={22}/>
          </button>
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
          <button onClick={() => setInternetMenuOpen(o => !o)} className="w-9 h-9 rounded-full hover:bg-gray-100 active:scale-90 flex items-center justify-center text-gray-700" title="메뉴">
            <Menu size={20}/>
          </button>
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
                {internetBookmarks.map((b, i) => (
                  <div key={i} className="px-3 py-2 hover:bg-gray-50 flex items-center gap-2 group">
                    <button
                      className="flex-1 text-left min-w-0"
                      onClick={() => {
                        setInternetTabs(tabs => tabs.map(t => t.id === internetActiveTabId ? { ...t, title: b.title, url: b.url, view: 'results' } : t));
                        setInternetMenuOpen(false);
                      }}
                    >
                      <div className="text-sm font-medium text-gray-800 truncate">★ {b.title}</div>
                      <div className="text-[11px] text-gray-500 truncate">{b.url}</div>
                    </button>
                    <button
                      className="shrink-0 w-8 h-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center opacity-60 group-hover:opacity-100"
                      title="삭제"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInternetBookmarks(bm => bm.filter(x => x.url !== b.url));
                      }}
                    >
                      🗑
                    </button>
                  </div>
                ))}
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
                {SEARCH_RESULTS.map((r, i) => (
                  <div key={i} className="cursor-pointer group">
                    <div className="text-[12px] text-gray-600 truncate">{r.url}</div>
                    <div className="text-[18px] text-[#1a0dab] font-medium group-hover:underline truncate">{r.title}</div>
                    <div className="text-[13px] text-gray-700 mt-0.5 line-clamp-2">{r.desc}</div>
                  </div>
                ))}
              </div>
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
                      <div key={i} className="p-2 rounded-lg hover:bg-gray-50 text-sm text-gray-800 truncate">★ {b.title}</div>
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

        {/* 주소창 패널 (검색 제안) */}
        {internetUrlPanelOpen && (
          <div className="absolute inset-0 z-[90] bg-white animate-[fadeIn_0.18s_ease-out] flex flex-col pt-8">
            <div className="shrink-0 bg-white border-b border-gray-200 px-3 py-2 flex items-center gap-2">
              <button onClick={() => setInternetUrlPanelOpen(false)} className="w-9 h-9 rounded-full hover:bg-gray-100 active:scale-90 flex items-center justify-center text-gray-700">
                <ChevronLeft size={22}/>
              </button>
              <div className="flex-1 h-10 bg-[#f1f3f4] rounded-full flex items-center gap-2 px-4">
                <Search size={16} className="text-gray-500 shrink-0"/>
                <div className="flex-1 text-[14px] text-gray-400">검색어 또는 웹 주소 입력</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="text-[11px] font-bold text-gray-500 px-3 pt-2 pb-1">추천 검색어</div>
              {['초등학교', '날씨', '튜브', '동요 모음'].map((s, i) => (
                i === 0 ? (
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
          </div>
        )}

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

  const renderNavigationBar = () => (
    <div className="h-14 bg-black flex justify-around items-center px-8 sm:px-32 z-40 w-full border-t border-gray-900 shrink-0 pb-2">

      <div onClick={() => setRecentAppsOpen(true)} className="w-20 h-full flex justify-center items-center cursor-pointer opacity-70 hover:opacity-100 active:scale-90 transition-all">
        <div className="flex gap-1"><div className="w-1 h-5 bg-white rounded-full"></div><div className="w-1 h-5 bg-white rounded-full"></div><div className="w-1 h-5 bg-white rounded-full"></div></div>
      </div>

      <ActionTarget
        id="nav-home" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
        onClick={() => {
          setCurrentApp(null); setQuickPanelOpen(false); setIsEditMode(false); setKeyboardOpen(false);
          setSearchText(''); setIsSearched(false); setTypingIndex(0); setKeyboardShift(false); setMathAppOpen(false);
          setPlayStoreView('home'); setPlayStoreProfileOpen(false);
          setCurrentPage(0); setHomeFlashKey(k => k + 1); setAppLaunchKey(k => k + 1);
        }}
        className="w-24 h-full flex justify-center items-center cursor-pointer opacity-70 hover:opacity-100 active:scale-90 transition-all"
      >
        <div className="w-6 h-6 border-[3px] border-white rounded-[6px]"></div>
      </ActionTarget>
      <div className="w-20 h-full flex justify-center items-center cursor-pointer opacity-70 hover:opacity-100 active:scale-90 transition-all">
        <ChevronLeft size={28} strokeWidth={3} className="text-white" />
      </div>
    </div>
  );

  const handleLockSwipeStart = (e: any) => {
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    setLockSwipeY(y);
  };
  const handleLockSwipeMove = (e: any) => {
    if (lockSwipeY === null) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = Math.max(0, lockSwipeY - y);
    setLockOffset(delta);
  };
  const handleLockSwipeEnd = () => {
    if (lockSwipeY === null) return;
    if (lockOffset > 100) {
      setLocked(false);
      setLockOffset(0);
      if (currentTargetId === 'lock-swipe') advanceQuest('lock-swipe');
    } else {
      setLockOffset(0);
    }
    setLockSwipeY(null);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center overflow-hidden select-none font-sans p-4" onMouseMove={(e) => { handleGlobalMove(e); handleLockSwipeMove(e); }} onTouchMove={(e) => { handleGlobalMove(e); handleLockSwipeMove(e); }} onMouseUp={(e) => { handleGlobalEnd(e); handleLockSwipeEnd(); }} onTouchEnd={(e) => { handleGlobalEnd(e); handleLockSwipeEnd(); }} onMouseLeave={(e) => { handleGlobalEnd(e); handleLockSwipeEnd(); }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes wiggle { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
        @keyframes pulseUp { 0%,100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-10px); opacity: 1; } }
        @keyframes appEnter { from { transform: scale(0.86); opacity: 0; filter: blur(6px); } to { transform: scale(1); opacity: 1; filter: blur(0); } }
        @keyframes confettiFall {
          0% { transform: translate3d(0,-20vh,0) rotate(0deg); opacity: 1; }
          100% { transform: translate3d(var(--cx, 0px), 110vh, 0) rotate(720deg); opacity: 0; }
        }
        @keyframes rewardPop {
          0% { transform: translate(-50%, -10%) scale(0.5); opacity: 0; }
          12% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
          88% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -90%) scale(0.95); opacity: 0; }
        }
        @keyframes levelUpFlash {
          0% { opacity: 0; transform: scale(0.5); }
          15% { opacity: 1; transform: scale(1.2); }
          70% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.4); }
        }
        @keyframes starPop {
          0% { transform: scale(0) rotate(-30deg); opacity: 0; }
          60% { transform: scale(1.3) rotate(10deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        .animate-wiggle { animation: wiggle 0.25s ease-in-out infinite; }
        .animate-pulse-up { animation: pulseUp 1.6s ease-in-out infinite; }
        .animate-app-enter { animation: appEnter 0.32s cubic-bezier(0.2, 0.8, 0.2, 1); transform-origin: center; }
        .animate-star-pop { animation: starPop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
      `}</style>



      {/* Galaxy Tab S10 Ultra bezel frame */}
      <div className={`relative w-full h-full bg-black shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_0_2px_#1f2937] md:shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_0_2px_#1f2937] ${isPhone ? 'max-w-[420px] max-h-[860px] aspect-[9/19.5] rounded-[44px] p-[10px] mx-auto' : 'md:max-w-[1600px] md:max-h-[1080px] md:aspect-[16/10] rounded-[20px] md:rounded-[36px] p-[6px] md:p-[14px]'}`}>
        {/* front camera dot */}
        {isPhone ? (
          <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full z-[180]"></div>
        ) : (
          <div className="absolute top-1/2 -translate-y-1/2 left-[6px] w-1.5 h-1.5 bg-gray-700 rounded-full"></div>
        )}

        {/* 측면 하드웨어 버튼 — 우측 상단 */}
        <button
          title="전원"
          onClick={() => setPowerMenuOpen(true)}
          className="absolute right-[-3px] top-[18%] w-[6px] h-14 bg-gradient-to-b from-gray-700 to-gray-900 rounded-r-md hover:from-gray-600 active:translate-x-[1px] transition-all shadow-md z-[170]"
        />
        <button
          title="음량 +"
          onClick={() => showVolumePanel('media', 10)}
          className="absolute right-[-3px] top-[38%] w-[6px] h-12 bg-gradient-to-b from-gray-700 to-gray-900 rounded-r-md hover:from-gray-600 active:translate-x-[1px] transition-all shadow-md z-[170]"
        />
        <button
          title="음량 -"
          onClick={() => showVolumePanel('media', -10)}
          className="absolute right-[-3px] top-[51%] w-[6px] h-12 bg-gradient-to-b from-gray-700 to-gray-900 rounded-r-md hover:from-gray-600 active:translate-x-[1px] transition-all shadow-md z-[170]"
        />

        <div className={`relative w-full h-full overflow-hidden bg-black flex flex-col ${isPhone ? 'rounded-[34px]' : 'rounded-[14px] md:rounded-[24px]'}`} style={{ fontSize: `${fontScale}rem` }}>

          <div className="absolute inset-0 bg-black pointer-events-none z-[60] transition-opacity duration-300" style={{ opacity: 1 - (brightness / 100) }}></div>
          {darkMode && <div className="absolute inset-0 bg-indigo-950/40 pointer-events-none z-[59] mix-blend-multiply"></div>}

          {renderStatusBar()}

          <div className="flex-1 relative flex flex-col bg-black overflow-hidden min-h-0 z-0">
            <div key={`app-${appLaunchKey}`} className="absolute inset-0 flex flex-col animate-app-enter">
              {currentApp === null && renderHome()}
              {currentApp === 'Settings' && renderSettings()}
              {currentApp === 'Camera' && renderCamera()}
              {currentApp === 'Gallery' && renderGallery()}
              {currentApp === 'PlayStore' && renderPlayStore()}
              {currentApp === 'Notes' && renderNotes()}
              {currentApp === 'Calculator' && renderCalculator()}
              {currentApp === 'Internet' && renderInternet()}

            </div>
          </div>


          <div className="shrink-0 z-40">{renderNavigationBar()}</div>

          {renderQuickPanel()}

          {/* 음량 슬라이더 패널 (측면 볼륨 버튼으로 호출) */}
          {volumePanelOpen && (
            <div
              className="absolute right-3 top-12 z-[150] w-[78px] bg-[#1c1c1e]/95 backdrop-blur-md rounded-3xl p-3 shadow-2xl border border-white/10 animate-[fadeIn_0.18s_ease-out] flex flex-col items-center gap-3"
              onMouseEnter={() => { if (volumeCloseTimer.current) clearTimeout(volumeCloseTimer.current); }}
              onMouseLeave={() => { volumeCloseTimer.current = setTimeout(() => setVolumePanelOpen(false), 1400); }}
            >
              {(() => {
                const cur = volumePanelType === 'media' ? mediaVolume : volumePanelType === 'ring' ? ringVolume : notifVolume;
                const setCur = (v: number) => {
                  if (volumePanelType === 'media') setMediaVolume(v);
                  else if (volumePanelType === 'ring') setRingVolume(v);
                  else setNotifVolume(v);
                };
                const icon = volumePanelType === 'media' ? '🎵' : volumePanelType === 'ring' ? '🔔' : '📩';
                return (
                  <>
                    <div className="text-white text-lg leading-none">{icon}</div>
                    <div className="relative w-3 h-40 bg-white/15 rounded-full overflow-hidden">
                      <div className="absolute bottom-0 left-0 right-0 bg-white transition-all" style={{ height: `${cur}%` }}/>
                    </div>
                    <div className="text-white/80 text-[11px] font-medium tabular-nums">{cur}</div>
                    <div className="flex flex-col gap-1 w-full">
                      {[
                        { id: 'media', icon: '🎵', label: '미디어' },
                        { id: 'ring', icon: '🔔', label: '벨소리' },
                        { id: 'notif', icon: '📩', label: '알림' },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setVolumePanelType(t.id as any)}
                          className={`w-full py-1.5 rounded-xl text-[10px] flex flex-col items-center gap-0.5 transition ${volumePanelType === t.id ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'}`}
                        >
                          <span className="text-sm leading-none">{t.icon}</span>
                          <span className="leading-none">{t.label}</span>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setCur(cur === 0 ? 70 : 0)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-base active:scale-90 transition">
                      {cur === 0 ? '🔇' : '🔊'}
                    </button>
                  </>
                );
              })()}
            </div>
          )}

          {/* 전원 메뉴 */}
          {powerMenuOpen && (
            <div className="absolute inset-0 z-[160] bg-black/70 flex items-center justify-center animate-[fadeIn_0.2s_ease-out]" onClick={() => setPowerMenuOpen(false)}>
              <div className="bg-[#1c1c1e] rounded-3xl p-6 w-72 text-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="text-center font-bold text-lg mb-5">전원</div>
                <div className="flex justify-around mb-2">
                  <button
                    onClick={() => { setPowerMenuOpen(false); setPowerOff(true); setTimeout(() => { setPowerOff(false); setLocked(true); }, 1800); }}
                    className="flex flex-col items-center gap-2 active:scale-95"
                  >
                    <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-2xl">⏻</div>
                    <div className="text-xs">전원 끄기</div>
                  </button>
                  <button
                    onClick={() => { setPowerMenuOpen(false); setPowerOff(true); setTimeout(() => { setPowerOff(false); setLocked(true); }, 1500); }}
                    className="flex flex-col items-center gap-2 active:scale-95"
                  >
                    <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-2xl">↻</div>
                    <div className="text-xs">다시 시작</div>
                  </button>
                  <button
                    onClick={() => setPowerMenuOpen(false)}
                    className="flex flex-col items-center gap-2 active:scale-95"
                  >
                    <div className="w-14 h-14 rounded-full bg-gray-600 flex items-center justify-center text-2xl">📞</div>
                    <div className="text-xs">긴급전화</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 전원 OFF 페이드 */}
          {powerOff && (
            <div className="absolute inset-0 z-[200] bg-black flex items-center justify-center animate-[fadeIn_0.3s_ease-out]">
              <div className="text-white/70 text-sm tracking-widest">SAMSUNG</div>
            </div>
          )}



          {mathAppOpen && (
            <div className="absolute left-0 right-0 top-0 bottom-14 z-[80] bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-400 flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease-out] pt-8 pb-4">
              <div className="text-white text-7xl font-black drop-shadow-lg mb-4">1 + 2 = ?</div>
              <div className="text-white text-2xl font-bold mb-10 drop-shadow">똑똑수학탐험대에 오신 걸 환영해요!</div>
              <div className="flex gap-6">
                {[2, 3, 4].map(n => (
                  <div key={n} className={`w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-black shadow-xl cursor-pointer active:scale-90 transition-all ${n===3 ? 'bg-white text-green-600' : 'bg-white/80 text-gray-700'}`}>{n}</div>
                ))}
              </div>
              <div className="mt-10 text-white text-sm opacity-80">홈 버튼을 눌러 종료하세요</div>
            </div>
          )}

          {/* Split-screen overlay */}
          {splitScreen && (
            <div className="absolute inset-0 z-[85] flex flex-col bg-black pt-8 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex-1 border-b-2 border-white/20 relative overflow-hidden flex items-center justify-center" style={{ background: PLAYSTORE_APPS.find(a => a.id === splitScreen.top)?.color || '#1f2937' }}>
                <div className="text-white text-center">
                  <div className="text-5xl font-black mb-3">{PLAYSTORE_APPS.find(a => a.id === splitScreen.top)?.label || splitScreen.top[0]}</div>
                  <div className="text-xl font-bold">{PLAYSTORE_APPS.find(a => a.id === splitScreen.top)?.name || splitScreen.top}</div>
                  <div className="text-xs opacity-70 mt-1">상단 화면</div>
                </div>
                <button onClick={() => setSplitScreen(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white text-xs">×</button>
              </div>
              <div className="h-1.5 bg-white/30 flex items-center justify-center"><div className="w-12 h-1 bg-white/60 rounded-full"/></div>
              <div className="flex-1 relative overflow-hidden flex items-center justify-center" style={{ background: PLAYSTORE_APPS.find(a => a.id === splitScreen.bottom)?.color || '#374151' }}>
                <div className="text-white text-center">
                  <div className="text-5xl font-black mb-3">{PLAYSTORE_APPS.find(a => a.id === splitScreen.bottom)?.label || splitScreen.bottom[0]}</div>
                  <div className="text-xl font-bold">{PLAYSTORE_APPS.find(a => a.id === splitScreen.bottom)?.name || splitScreen.bottom}</div>
                  <div className="text-xs opacity-70 mt-1">하단 화면</div>
                </div>
              </div>
            </div>
          )}

          {/* Recent apps overlay */}
          {recentAppsOpen && (
            <div className="absolute inset-0 z-[88] bg-black/90 backdrop-blur-md flex flex-col pt-12 px-6 animate-[fadeIn_0.2s_ease-out]" onClick={() => setRecentAppsOpen(false)}>
              <div className="text-white text-xl font-bold mb-4 px-2">최근 사용한 앱</div>
              {recentApps.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-white/60">최근 사용한 앱이 없습니다</div>
              ) : (
                <div className="flex-1 overflow-x-auto flex gap-4 pb-8 items-start" onClick={(e) => e.stopPropagation()}>
                  {recentApps.map((app, i) => {
                    const psApp = PLAYSTORE_APPS.find(a => a.id === app);
                    const bg = psApp?.color || ['#1e3a8a','#7c2d12','#065f46','#581c87','#7f1d1d'][i%5];
                    const label = psApp?.label || app[0];
                    const name = psApp?.name || app;
                    const isSwiping = recentSwipe?.index === i;
                    const dy = isSwiping ? Math.min(0, recentSwipe!.dy) : 0;
                    return (
                      <div
                        key={`${app}-${i}`}
                        className="w-[200px] shrink-0 flex flex-col items-center gap-3 transition-transform"
                        style={{ transform: `translateY(${dy}px)`, opacity: 1 + dy / 400 }}
                        onPointerDown={(e) => { setRecentSwipe({ index: i, startY: e.clientY, dy: 0 }); }}
                        onPointerMove={(e) => {
                          if (recentSwipe?.index !== i) return;
                          setRecentSwipe({ index: i, startY: recentSwipe.startY, dy: e.clientY - recentSwipe.startY });
                        }}
                        onPointerUp={() => {
                          if (recentSwipe?.index === i && recentSwipe.dy < -120) {
                            setRecentApps(prev => prev.filter((_, idx) => idx !== i));
                          }
                          setRecentSwipe(null);
                        }}
                        onPointerCancel={() => setRecentSwipe(null)}
                      >
                        <div className="w-full h-[300px] rounded-2xl shadow-2xl flex flex-col items-center justify-center text-white relative" style={{ background: bg }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setRecentApps(prev => prev.filter((_, idx) => idx !== i)); }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center text-sm active:scale-90"
                          >×</button>
                          <div className="text-7xl font-black mb-3">{label}</div>
                          <div className="text-lg font-bold">{name}</div>
                          <div className="absolute bottom-3 text-[10px] opacity-60">위로 밀어 닫기</div>
                        </div>
                        <div className="flex gap-2 w-full">
                          <button onClick={() => { setCurrentApp(app); setRecentAppsOpen(false); }} className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold active:scale-95">열기</button>
                          <button
                            onClick={() => {
                              const other = recentApps.find(a => a !== app) || PLAYSTORE_APPS[0].id;
                              setSplitScreen({ top: app, bottom: other });
                              setRecentAppsOpen(false);
                            }}
                            className="flex-1 py-2 rounded-xl bg-purple-600 text-white text-sm font-bold active:scale-95"
                          >분할</button>
                        </div>
                      </div>
                    );
                  })}

                </div>
              )}
              <div className="flex gap-3 justify-center pb-6">
                <button onClick={(e) => { e.stopPropagation(); setRecentApps([]); setRecentAppsOpen(false); }} className="px-6 py-2 rounded-full bg-white/10 text-white text-sm font-medium active:scale-95">모두 닫기</button>
                <button onClick={() => setRecentAppsOpen(false)} className="px-6 py-2 rounded-full bg-white/10 text-white text-sm font-medium active:scale-95">취소</button>
              </div>
            </div>
          )}

          {/* Home long-press menu */}
          {homeMenuOpen && (
            <div className="absolute inset-0 z-[92] bg-black/60 flex items-end animate-[fadeIn_0.2s_ease-out]" onClick={() => setHomeMenuOpen(false)}>
              <div className="w-full bg-[#1c1c1e] text-white rounded-t-3xl p-6 animate-[slideUp_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-6"/>
                <div className="grid grid-cols-3 gap-4">
                  <button onClick={() => { setHomeMenuOpen(false); setWidgetPickerOpen(true); }} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#2c2c2e] active:scale-95">
                    <div className="text-3xl">🧩</div><div className="text-sm font-medium">위젯</div>
                  </button>
                  <button onClick={() => { setHomeMenuOpen(false); setCurrentApp('Settings'); setSettingsMenu('wallpaper'); }} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#2c2c2e] active:scale-95">
                    <div className="text-3xl">🖼️</div><div className="text-sm font-medium">배경화면</div>
                  </button>
                  <button onClick={() => { setHomeMenuOpen(false); setCurrentApp('Settings'); setSettingsMenu('wallpaper'); }} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#2c2c2e] active:scale-95">
                    <div className="text-3xl">🎨</div><div className="text-sm font-medium">테마</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Widget picker */}
          {widgetPickerOpen && (
            <div className="absolute inset-0 z-[93] bg-black/70 flex items-end animate-[fadeIn_0.2s_ease-out]" onClick={() => setWidgetPickerOpen(false)}>
              <div className="w-full bg-[#1c1c1e] text-white rounded-t-3xl p-6 max-h-[70%] overflow-y-auto animate-[slideUp_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-4"/>
                <div className="text-xl font-bold mb-4">위젯 추가</div>
                <div className="grid grid-cols-2 gap-3">
                  {WIDGET_CATALOG.map(w => {
                    const added = widgets.includes(w.id);
                    return (
                      <div key={w.id} className="bg-[#2c2c2e] rounded-2xl p-4 flex items-center gap-3">
                        <div className="text-3xl">{w.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">{w.name}</div>
                          <div className="text-[11px] text-gray-400 truncate">{w.desc}</div>
                        </div>
                        <button
                          onClick={() => setWidgets(prev => added ? prev.filter(x => x !== w.id) : [...prev, w.id])}
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg active:scale-90 transition-all ${added ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
                        >{added ? '−' : '+'}</button>
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => setWidgetPickerOpen(false)} className="w-full mt-6 py-3 rounded-2xl bg-blue-600 font-bold active:scale-95">완료</button>
              </div>
            </div>
          )}


          {/* Bluetooth devices modal */}
          {bluetoothModalOpen && (
            <div className="absolute inset-0 z-[94] bg-black/70 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]" onClick={() => setBluetoothModalOpen(false)}>
              <div className="bg-[#1c1c1e] text-white rounded-3xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3"><Bluetooth size={22} className="text-blue-400"/><div className="font-bold text-xl">블루투스</div></div>
                  <X size={22} className="cursor-pointer text-gray-400" onClick={() => setBluetoothModalOpen(false)}/>
                </div>
                <div className="text-sm text-gray-400 mb-4">사용 가능한 기기를 검색했어요. 연결할 기기를 선택하세요.</div>
                <div className="space-y-2">
                  {[
                    { id: 'bt-device-buds', name: '무선 이어버드', sub: '오디오 · 미연결', icon: '🎧' },
                    { id: 'bt-device-keyboard', name: '무선 키보드', sub: '키보드 · 미연결', icon: '⌨️' },
                    { id: 'bt-device-watch', name: '스마트워치', sub: '웨어러블 · 미연결', icon: '⌚' },
                    { id: 'bt-device-speaker', name: '블루투스 스피커', sub: '오디오 · 미연결', icon: '🔈' },
                  ].map(dev => {
                    const connected = connectedBtDevice === dev.name;
                    return (
                      <ActionTarget key={dev.id} id={dev.id} currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                        onClick={() => {
                          if (connected) return;
                          // PIN 페어링 단계로 진입
                          const pin = String(Math.floor(1000 + Math.random() * 9000));
                          setBtPairingDevice(dev);
                          setBtPairingPin(pin);
                        }}
                        className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all ${connected ? 'bg-blue-600' : 'bg-[#2c2c2e] hover:bg-[#3a3a3c]'}`}
                      >
                        <div className="text-3xl">{dev.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{dev.name}</div>
                          <div className="text-xs text-gray-400 truncate">{connected ? '연결됨' : dev.sub}</div>
                        </div>
                        {connected && <Check size={20} className="text-white"/>}
                      </ActionTarget>
                    );
                  })}
                </div>
                <button onClick={() => { setBluetooth(false); setConnectedBtDevice(null); setBluetoothModalOpen(false); }} className="w-full mt-4 py-3 rounded-2xl bg-white/10 text-sm font-medium active:scale-95">블루투스 끄기</button>
              </div>
            </div>
          )}

          {/* Bluetooth pairing PIN dialog */}
          {btPairingDevice && (
            <div className="absolute inset-0 z-[120] bg-black/80 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]" onClick={() => setBtPairingDevice(null)}>
              <div className="bg-[#1c1c1e] text-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-4xl">{btPairingDevice.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg truncate">{btPairingDevice.name}</div>
                    <div className="text-xs text-gray-400">Bluetooth 페어링 요청</div>
                  </div>
                </div>
                <div className="text-sm text-gray-300 mb-4 leading-relaxed">
                  상대 기기에 표시된 코드가 아래와 같은지 확인하세요. 같다면 <span className="text-blue-400 font-semibold">페어링</span> 을 누르세요.
                </div>
                <div className="bg-black/40 rounded-2xl py-5 mb-5 flex items-center justify-center">
                  <div className="text-5xl font-bold tracking-[0.4em] tabular-nums text-white">{btPairingPin}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBtPairingDevice(null)}
                    className="flex-1 py-3 rounded-2xl bg-[#2c2c2e] hover:bg-[#3a3a3c] active:scale-95 font-bold text-sm transition"
                  >취소</button>
                  <ActionTarget id="bt-pair-confirm" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                    onClick={() => {
                      const dev = btPairingDevice;
                      setBtPairingDevice(null);
                      if (dev) {
                        setConnectedBtDevice(dev.name);
                        advanceQuest(dev.id);
                        setTimeout(() => setBluetoothModalOpen(false), 700);
                      }
                    }}
                    className="flex-1"
                  >
                    <button className="w-full py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 active:scale-95 font-bold text-sm transition">페어링</button>
                  </ActionTarget>
                </div>
              </div>
            </div>
          )}



          {/* Google 로그인 (실제와 유사한 풀스크린) */}
          {googleLoginOpen && (
            <div className="absolute inset-0 z-[180] bg-white flex flex-col text-[#202124] animate-[fadeIn_0.25s_ease-out] overflow-y-auto" style={{ fontFamily: 'Roboto, "Noto Sans KR", system-ui, -apple-system, sans-serif' }}>
              <div className="flex items-center justify-between px-6 pt-12 pb-4">
                <svg viewBox="0 0 272 92" className="h-7">
                  <path fill="#4285F4" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18S71.25 59.95 71.25 47.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                  <path fill="#EA4335" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                  <path fill="#FBBC05" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
                  <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
                  <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
                  <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
                </svg>
                <button onClick={() => setGoogleLoginOpen(false)} className="text-gray-500 active:scale-90 transition"><X size={22}/></button>
              </div>

              {/* Step Indicator */}
              {(() => {
                const steps = [
                  { key: 'email', label: '이메일' },
                  { key: 'password', label: '비밀번호' },
                  { key: 'consent', label: '약관' },
                  { key: 'syncing', label: '동기화' },
                  { key: 'done', label: '완료' },
                ];
                const order = ['email','password','consent','syncing','done'];
                const curIdx = order.indexOf(googleLoginStep);
                return (
                  <div className="max-w-md w-full mx-auto px-8 mb-6">
                    <div className="flex items-center">
                      {steps.map((s, i) => {
                        const done = i < curIdx;
                        const active = i === curIdx;
                        return (
                          <React.Fragment key={s.key}>
                            <div className="flex flex-col items-center">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${done ? 'bg-blue-600 text-white' : active ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-200 text-gray-500'}`}>
                                {done ? <Check size={14} strokeWidth={3}/> : i + 1}
                              </div>
                              <div className={`text-[10px] mt-1 ${active ? 'text-blue-600 font-medium' : done ? 'text-gray-700' : 'text-gray-400'}`}>{s.label}</div>
                            </div>
                            {i < steps.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-1 mt-[-14px] ${i < curIdx ? 'bg-blue-600' : 'bg-gray-200'}`}/>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="flex-1 max-w-md w-full mx-auto px-8 pb-10">
                {googleLoginStep === 'email' && (
                  <div>
                    <h1 className="text-[28px] leading-tight font-normal mb-2">로그인</h1>
                    <p className="text-base text-gray-700 mb-8">탐험대 계정 사용</p>
                    <div className="mb-2" key={`email-${googleShake}`} style={googleError ? { animation: 'shake 0.4s ease-in-out' } : undefined}>
                      <input
                        ref={googleEmailRef}
                        type="email"
                        value={googleEmail}
                        onChange={(e) => { setGoogleEmail(e.target.value); setGoogleError(''); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('google-email-next-btn')?.click(); }}
                        placeholder="이메일 또는 휴대전화"
                        className={`w-full border-2 rounded text-base px-3 py-3.5 outline-none transition-colors ${googleError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-600'}`}
                      />
                      {googleError && (
                        <div className="flex items-center gap-1.5 text-red-600 text-sm mt-2">
                          <AlertTriangle size={14}/> {googleError}
                        </div>
                      )}
                    </div>
                    <button className="text-blue-600 text-sm font-medium mt-3 px-3 py-2 -ml-3 rounded">이메일을 잊으셨나요?</button>
                    <p className="text-sm text-gray-600 mt-6 leading-relaxed">내 컴퓨터가 아닌가요? 게스트 모드를 사용해 비공개로 로그인하세요. <span className="text-blue-600 font-medium">자세히 알아보기</span></p>
                    <div className="flex justify-between items-center mt-10">
                      <button className="text-blue-600 text-sm font-medium px-3 py-2 -ml-3 rounded">계정 만들기</button>
                      <ActionTarget
                        id="google-email-next" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                        disableClickAdvance={true}
                        onClick={() => {
                          if (googleEmail.trim().toLowerCase() === 'wttest@tamhem.com') {
                            setGoogleError(''); setGoogleLoginStep('password');
                            advanceQuest('google-email-next');
                          } else {
                            setGoogleError('탐험대 계정을 찾을 수 없습니다. 이메일을 다시 확인하세요.');
                            setGoogleShake(s => s + 1);
                            setTimeout(() => googleEmailRef.current?.focus(), 50);
                          }
                        }}
                      >
                        <button id="google-email-next-btn" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded text-sm active:scale-95 transition">다음</button>
                      </ActionTarget>
                    </div>
                  </div>
                )}

                {googleLoginStep === 'password' && (
                  <div>
                    <h1 className="text-[28px] leading-tight font-normal mb-2">환영합니다</h1>
                    <div className="inline-flex items-center gap-2 mb-8 mt-3 border border-gray-300 rounded-full pl-1 pr-3 py-1 max-w-full cursor-pointer hover:bg-gray-50" onClick={() => { setGoogleLoginStep('email'); setGoogleError(''); setGooglePassword(''); }}>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{googleEmail[0]?.toUpperCase() || 'W'}</div>
                      <span className="text-sm truncate">{googleEmail}</span>
                      <ChevronLeft size={14} className="rotate-[-90deg] text-gray-600"/>
                    </div>
                    <div className="mb-2" key={`pw-${googleShake}`} style={googleError ? { animation: 'shake 0.4s ease-in-out' } : undefined}>
                      <input
                        ref={googlePasswordRef}
                        type="password"
                        value={googlePassword}
                        onChange={(e) => { setGooglePassword(e.target.value); setGoogleError(''); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('google-password-next-btn')?.click(); }}
                        placeholder="비밀번호 입력"
                        className={`w-full border-2 rounded text-base px-3 py-3.5 outline-none transition-colors ${googleError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-600'}`}
                      />
                      {googleError && (
                        <div className="flex items-center gap-1.5 text-red-600 text-sm mt-2">
                          <AlertTriangle size={14}/> {googleError}
                        </div>
                      )}
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 mt-4 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4"/> 비밀번호 표시
                    </label>
                    <div className="flex justify-between items-center mt-10">
                      <button onClick={() => { setGoogleLoginStep('email'); setGoogleError(''); }} className="flex items-center gap-1 text-blue-600 text-sm font-medium px-3 py-2 -ml-3 rounded"><ChevronLeft size={16}/> 뒤로</button>
                      <ActionTarget
                        id="google-password-next" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                        disableClickAdvance={true}
                        onClick={() => {
                          if (googlePassword === 'Ghkdlxld1!') {
                            setGoogleError(''); setGoogleLoginStep('consent');
                            advanceQuest('google-password-next');
                          } else {
                            setGoogleError('비밀번호가 올바르지 않습니다. 다시 시도하세요.');
                            setGoogleShake(s => s + 1);
                            setGooglePassword('');
                            setTimeout(() => googlePasswordRef.current?.focus(), 50);
                          }
                        }}
                      >
                        <button id="google-password-next-btn" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded text-sm active:scale-95 transition">다음</button>
                      </ActionTarget>
                    </div>
                  </div>
                )}

                {googleLoginStep === 'consent' && (
                  <div>
                    <h1 className="text-[26px] leading-tight font-normal mb-3">탐험대 서비스 약관</h1>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      탐험대 계정을 추가하면 메일, 튜브, Drive 등 탐험대 서비스의 데이터가 이 기기와 동기화됩니다.
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5 max-h-40 overflow-y-auto text-xs text-gray-600 leading-relaxed">
                      탐험대 서비스를 사용함으로써 귀하는 본 약관을 따르고 탐험대 개인정보처리방침에 따라 데이터가 처리되는 데 동의합니다. 동기화 가능한 항목: 연락처 · 캘린더 · 메일 · 드라이브 · 사진 · 앱 데이터. 언제든지 설정에서 동기화를 해제할 수 있습니다.
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={googleConsent} onChange={(e) => { setGoogleConsent(e.target.checked); setGoogleError(''); }} className="w-5 h-5 mt-0.5"/>
                      <span className="text-sm text-gray-800">위 약관에 동의하며, 기기 백업과 동기화를 허용합니다.</span>
                    </label>
                    {googleError && (
                      <div className="flex items-center gap-1.5 text-red-600 text-sm mt-3" key={`consent-${googleShake}`} style={{ animation: 'shake 0.4s ease-in-out' }}>
                        <AlertTriangle size={14}/> {googleError}
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-10">
                      <button onClick={() => { setGoogleLoginStep('password'); setGoogleError(''); }} className="flex items-center gap-1 text-blue-600 text-sm font-medium px-3 py-2 -ml-3 rounded"><ChevronLeft size={16}/> 뒤로</button>
                      <ActionTarget
                        id="google-consent-agree" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                        disableClickAdvance={true}
                        onClick={() => {
                          if (!googleConsent) { setGoogleError('동의 체크박스를 선택하세요.'); setGoogleShake(s => s + 1); return; }
                          setGoogleError(''); setGoogleLoginStep('syncing');
                          advanceQuest('google-consent-agree');
                          setTimeout(() => setGoogleLoginStep('done'), 1800);
                        }}
                      >
                        <button className={`font-medium px-6 py-2.5 rounded text-sm transition ${googleConsent ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95' : 'bg-gray-200 text-gray-400'}`}>동의함</button>
                      </ActionTarget>
                    </div>
                  </div>
                )}

                {googleLoginStep === 'syncing' && (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <div className="text-lg font-medium">탐험대 계정 동기화 중…</div>
                    <div className="text-sm text-gray-500 mt-2">메일 · 연락처 · 캘린더 · 드라이브</div>
                    <div className="mt-6 space-y-1.5 text-xs text-gray-600">
                      {['연락처','캘린더','메일','드라이브'].map(s => (
                        <div key={s} className="flex items-center gap-2"><Check size={12} className="text-green-600"/> {s} 동기화 완료</div>
                      ))}
                    </div>
                  </div>
                )}

                {googleLoginStep === 'done' && (
                  <div className="flex flex-col items-center text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5 animate-[fadeIn_0.3s_ease-out]">
                      <Check size={42} className="text-green-600" strokeWidth={3}/>
                    </div>
                    <h1 className="text-2xl font-normal mb-2">환영합니다, {googleEmail}</h1>
                    <p className="text-sm text-gray-600 mb-8 max-w-xs">탐험대 계정이 이 기기에 추가되었어요. 메일, 튜브 등에 자동으로 로그인됩니다.</p>
                    <ActionTarget
                      id="google-done" currentTargetId={currentTargetId} advanceQuest={advanceQuest}
                      onClick={() => {
                        setGoogleAccount(googleEmail);
                        setGoogleLoginOpen(false);
                      }}
                    >
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-10 py-2.5 rounded text-sm active:scale-95 transition">확인</button>
                    </ActionTarget>
                  </div>
                )}

                {(googleLoginStep === 'email' || googleLoginStep === 'password') && (
                  <div className="mt-8 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                    <div className="font-bold mb-1">💡 학습용 안내</div>
                    아이디: <span className="font-mono font-bold">wttest@tamhem.com</span><br/>
                    비밀번호: <span className="font-mono font-bold">Ghkdlxld1!</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center px-6 py-4 text-xs text-gray-500 border-t border-gray-100">
                <select className="bg-transparent outline-none"><option>한국어</option></select>
                <div className="flex gap-5">
                  <span>도움말</span><span>개인정보처리방침</span><span>약관</span>
                </div>
              </div>
            </div>
          )}



          {/* Lock screen overlay */}
          {locked && (
            <div
              className="absolute inset-0 z-[150] cursor-grab active:cursor-grabbing overflow-hidden"
              style={{
                background: wallpaper,
                backgroundSize: 'cover',
                transform: `translateY(${-lockOffset}px)`,
                transition: lockSwipeY === null ? 'transform 0.3s ease-out' : 'none',
              }}
              onMouseDown={handleLockSwipeStart}
              onTouchStart={handleLockSwipeStart}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                <Lock size={40} className="mb-4 opacity-80" />
                <div className="text-[120px] font-thin leading-none drop-shadow-lg tabular-nums">{timeStr}</div>
                <div className="text-2xl mt-3 opacity-90 drop-shadow">{dateStr}</div>
                <div className="absolute bottom-20 flex flex-col items-center pointer-events-none">
                  <ChevronUp size={48} className={`text-white/80 ${currentTargetId === 'lock-swipe' ? 'animate-pulse-up' : 'opacity-60'}`} />
                  <div className="text-white/90 text-lg mt-2 font-medium drop-shadow">위로 밀어 잠금해제</div>
                </div>
                {currentTargetId === 'lock-swipe' && (
                  <div className="absolute top-24 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl shadow-xl font-bold pointer-events-none animate-bounce">
                    👆 여기서부터 위로 스와이프!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showExpMenu && (
        <div ref={expMenuRef} className="fixed md:absolute z-[300] bg-white rounded-2xl md:rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border w-[calc(100vw-16px)] max-w-[380px] overflow-hidden transition-all duration-300" style={{ top: expPos.y, left: expPos.x, borderColor: `${themeColor}55` }}>
          <div className="text-white p-3 md:p-4 flex justify-between items-center cursor-move" style={{ background: themeColor }} onMouseDown={handleDragStartExp} onTouchStart={handleDragStartExp}>
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
      )}

      {/* App icon long-press context menu */}
      {appContextMenu && (
        <div
          className="fixed inset-0 z-[310] bg-black/40 flex items-center justify-center animate-[fadeIn_0.15s_ease-out]"
          onClick={() => setAppContextMenu(null)}
        >
          <div className="bg-[#1c1c1e] text-white rounded-3xl w-[280px] overflow-hidden shadow-2xl animate-[slideUp_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-white/10 flex items-center gap-3">
              <div className="w-12 h-12">{renderAppIcon(appContextMenu.appName, -99)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{appContextMenu.appName}</div>
                <div className="text-[11px] text-white/50">길게 눌러서 옵션 표시</div>
              </div>
            </div>
            <div className="py-2">
              <button
                className="w-full px-5 py-3 text-left text-sm hover:bg-white/5 active:bg-white/10 flex items-center gap-3 transition-colors"
                onClick={() => { setIsEditMode(true); setAppContextMenu(null); }}
              >
                <GripHorizontal size={18} className="text-blue-400"/> 이동
              </button>
              <button
                className="w-full px-5 py-3 text-left text-sm hover:bg-white/5 active:bg-white/10 flex items-center gap-3 transition-colors"
                onClick={() => { setAppContextMenu(null); setWidgetPickerOpen(true); }}
              >
                <span className="text-blue-400">🧩</span> 위젯 추가
              </button>
              <button
                className="w-full px-5 py-3 text-left text-sm hover:bg-white/5 active:bg-white/10 flex items-center gap-3 transition-colors"
                onClick={() => { setAppContextMenu(null); setCurrentApp('Settings'); setSettingsMenu('apps'); }}
              >
                <Settings size={18} className="text-gray-300"/> 앱 정보
              </button>
              <button
                className="w-full px-5 py-3 text-left text-sm hover:bg-white/5 active:bg-white/10 flex items-center gap-3 transition-colors text-red-400"
                onClick={() => { setUninstallTarget(appContextMenu.appName); setAppContextMenu(null); }}
              >
                <Trash2 size={18}/> 삭제
              </button>
            </div>
            <button
              className="w-full py-3 border-t border-white/10 text-sm font-medium text-white/70 hover:bg-white/5 active:bg-white/10 transition-colors"
              onClick={() => setAppContextMenu(null)}
            >취소</button>
          </div>
        </div>
      )}


      {!showExpMenu && (
        <div className="fixed md:absolute bottom-4 right-4 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:bg-blue-700 active:scale-90 transition-all z-[300] animate-bounce" onClick={() => setShowExpMenu(true)}>
          <Check size={28} className="text-white" />
        </div>
      )}

      {/* === 미션 목록 팝업 (12번) === */}
      {missionListOpen && (
        <div
          ref={missionListRef}
          className="fixed md:absolute z-[305] bg-white rounded-2xl md:rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border overflow-hidden transition-all duration-300 animate-[fadeIn_0.2s_ease-out]"
          style={{
            top: missionListPos.y,
            left: missionListPos.x,
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
      )}

      {/* === 미션 목록 플로팅 버튼 (미션 센터가 닫혀 있을 때) === */}
      {!showExpMenu && !missionListOpen && (
        <button
          onClick={() => setMissionListOpen(true)}
          className="fixed md:absolute bottom-4 right-[5.5rem] md:bottom-8 md:right-28 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl cursor-pointer active:scale-90 transition-all z-[300] text-white"
          style={{ background: themeColor }}
          title="미션 목록"
        >
          <Grid size={22} />
        </button>
      )}

      {/* === Reward Toast (미션 완료 시) === */}
      {rewardToast && (
        <div
          key={rewardToast.key}
          className="fixed inset-0 pointer-events-none z-[400] flex items-center justify-center"
        >
          <div
            className="px-6 py-4 rounded-3xl font-black text-white text-2xl md:text-4xl shadow-2xl whitespace-nowrap"
            style={{
              background: `linear-gradient(135deg, ${themeColor}, #10b981)`,
              animation: 'rewardPop 3.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
              position: 'absolute',
              left: '50%',
              top: '50%',
            }}
          >
            ⭐ +{rewardToast.exp} EXP!
          </div>
        </div>
      )}

      {/* === Confetti (미션 완료 시) === */}
      {confettiKey > 0 && (
        <div key={confettiKey} className="fixed inset-0 pointer-events-none z-[399] overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => {
            const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#a855f7', '#06b6d4', '#ef4444'];
            const left = Math.random() * 100;
            const cx = (Math.random() - 0.5) * 200;
            const delay = Math.random() * 0.3;
            const duration = 1.4 + Math.random() * 1.0;
            const size = 6 + Math.random() * 8;
            const color = colors[i % colors.length];
            const shape = i % 3 === 0 ? '50%' : i % 3 === 1 ? '2px' : '0';
            return (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: '-5vh',
                  width: size,
                  height: size,
                  background: color,
                  borderRadius: shape,
                  animation: `confettiFall ${duration}s ease-out ${delay}s forwards`,
                  ['--cx' as any]: `${cx}px`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* === Level-up flash === */}
      {levelUpFlash > 0 && (
        <div
          key={`lvl-${levelUpFlash}`}
          className="fixed inset-0 pointer-events-none z-[401] flex items-center justify-center"
        >
          <div
            className="px-8 py-6 rounded-3xl font-black text-white text-3xl md:text-5xl shadow-[0_0_80px_rgba(255,200,0,0.8)] whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #ef4444)',
              animation: 'levelUpFlash 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
              transformOrigin: 'center',
            }}
          >
            🎉 LEVEL UP! 🎉
          </div>
        </div>
      )}



    </div>
  );
}
