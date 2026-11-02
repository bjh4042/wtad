import React from 'react';
import camera from '@/assets/oneui/camera.webp';
import gallery from '@/assets/oneui/gallery.webp';
import settings from '@/assets/oneui/settings.webp';
import calendar from '@/assets/oneui/calendar.webp';
import notes from '@/assets/oneui/notes.webp';
import folder from '@/assets/oneui/folder.webp';
import internet from '@/assets/oneui/internet.webp';
import messages from '@/assets/oneui/messages.webp';
import phone from '@/assets/oneui/phone.webp';
import wearable from '@/assets/oneui/wearable.webp';
import health from '@/assets/oneui/health.webp';
import calculator from '@/assets/oneui/calculator.png';
import clock from '@/assets/oneui/clock.png';
import gmail from '@/assets/oneui/gmail.png';
import google from '@/assets/oneui/google.png';
import chrome from '@/assets/oneui/chrome.png';
import youtube from '@/assets/oneui/youtube.png';
import kakaotalk from '@/assets/oneui/kakaotalk.png';
import naver from '@/assets/oneui/naver.png';
import math from '@/assets/oneui/math.png';
import gamingHub from '@/assets/oneui/gamelauncher.png';
import store from '@/assets/oneui/store.png';
import playStoreSymbol from '@/assets/oneui/playstore-symbol.svg';

/** Samsung/Google publisher artwork. Provenance is recorded in assets/oneui/sources.json. */
const ARTWORK: Record<string, string> = {
  Settings: settings, Camera: camera, Gallery: gallery, Calendar: calendar,
  Notes: notes, Folder: folder, Internet: internet, Messages: messages,
  Phone: phone, Wearable: wearable, Health: health, Calculator: calculator,
  Clock: clock, Gmail: gmail, Google: google, Chrome: chrome, YouTube: youtube,
  KakaoTalk: kakaotalk, Naver: naver, GameLauncher: gamingHub, Store: store, math,
};

export const GALAXY_APP_LABELS: Record<string, string> = {
  Settings: '설정', Camera: '카메라', Gallery: '갤러리', PlayStore: 'Play 스토어',
  Notes: 'Samsung Notes', Calculator: '계산기', Internet: '인터넷', Folder: '내 파일',
  Clock: '시계', Calendar: '캘린더', Store: 'Galaxy Store', Messages: '메시지',
  Phone: '전화', Gmail: 'Gmail', Google: 'Google', Chrome: 'Chrome', YouTube: 'YouTube', KakaoTalk: '카카오톡',
  Naver: '네이버', Wearable: 'Galaxy Wearable', Health: 'Samsung Health',
  GameLauncher: 'Gaming Hub', math: '수학탐험대', duolingo: '링고학습',
  minecraft: '블록월드', classting: '학교톡', toss: '간편페이', melon: '뮤직박스',
};

// The five catalog practice apps are fictional. Their vector artwork is intentionally
// distinct from real app brands and uses the same occupied canvas as the device apps.
const PRACTICE_COLORS: Record<string, string> = {
  duolingo: '#42ad46', minecraft: '#378b51', classting: '#f58238',
  toss: '#3273df', melon: '#19a98e',
};

function PracticeGlyph({ appName }: { appName: string }) {
  switch (appName) {
    case 'duolingo':
      return <g fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 29h25c5 0 8 3 8 8v36c-5-5-8-6-15-6H23z"/><path d="M77 29H60c-4 0-7 2-7 6M57 73c5-5 8-6 15-6h5V29"/><path d="M32 42h12M32 52h12M65 42h4M65 52h4"/></g>;
    case 'minecraft':
      return <g stroke="#fff" strokeWidth="4" strokeLinejoin="round"><path d="m50 20 28 16-28 16-28-16z" fill="#c6e9a0"/><path d="M22 36v29l28 16V52z" fill="#98ca70"/><path d="M78 36v29L50 81V52z" fill="#5eae67"/></g>;
    case 'classting':
      return <g fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><path d="M26 28h48v37H49L35 77V65h-9z"/><path d="M37 42h26M37 52h18"/></g>;
    case 'toss':
      return <g fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><rect x="21" y="29" width="58" height="43" rx="10"/><path d="M22 42h56M31 60h12"/></g>;
    case 'melon':
      return <g fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"><path d="M42 67V29l28-6v37M42 43l28-6"/><ellipse cx="33" cy="68" rx="10" ry="7" fill="#fff" stroke="none"/><ellipse cx="61" cy="61" rx="10" ry="7" fill="#fff" stroke="none"/></g>;
    default:
      return null;
  }
}

export interface GalaxyAppIconProps {
  appName: string;
  time?: Date | null;
  className?: string;
  style?: React.CSSProperties;
}

/** A single 100 × 100 Samsung squircle for every app surface, independent of glyph padding. */
export function GalaxyAppIcon({ appName, time, className = '', style }: GalaxyAppIconProps) {
  const clipId = `galaxy-icon-${React.useId().replace(/:/g, '')}`;
  const src = ARTWORK[appName];
  const date = time?.getDate() ?? 3;
  const weekday = time ? ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][time.getDay()] : 'MON';
  return (
    <svg
      viewBox="0 0 100 100" width="100%" height="100%"
      className={`galaxy-app-icon block shrink-0 select-none ${className}`}
      style={style} aria-hidden="true" focusable="false" data-app-icon={appName}
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M50 0C86 0 100 14 100 50S86 100 50 100S0 86 0 50S14 0 50 0Z"/>
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {appName === 'PlayStore' ? (
          <>
            <rect width="100" height="100" fill="#fff"/>
            <image href={playStoreSymbol} x="18" y="18" width="64" height="64"/>
          </>
        ) : appName === 'Calendar' ? (
          <>
            <rect width="100" height="100" fill="#fff"/>
            <rect width="100" height="33.5" fill="#06b9b3"/>
            <path d="M15 30v8M85 30v8" stroke="#06b9b3" strokeWidth="5.5" strokeLinecap="round"/>
            <text x="50" y="25.5" fill="#fff" fontSize="18" fontWeight="500" fontFamily="Arial, sans-serif" textAnchor="middle">{weekday}</text>
            <text x="50" y="81.5" fill="#080909" fontSize="53" fontWeight="500" fontFamily="Arial, sans-serif" textAnchor="middle">{date}</text>
          </>
        ) : src ? <image href={src} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid meet"/> : (
          <>
            <rect width="100" height="100" fill={PRACTICE_COLORS[appName] ?? '#596774'}/>
            {PRACTICE_COLORS[appName] ? <PracticeGlyph appName={appName}/> : <g fill="#fff">{[29, 56].flatMap(x => [29, 56].map(y => <rect key={`${x}-${y}`} x={x} y={y} width="16" height="16" rx="4"/>))}</g>}
          </>
        )}
      </g>
    </svg>
  );
}

export default GalaxyAppIcon;
