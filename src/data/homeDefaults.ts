/** 홈 화면 기본 배치 / 기본 배경화면 (UI·기능 변경 없음, 값 그대로 이동) */

export const DEFAULT_WALLPAPER =
  'radial-gradient(ellipse at 20% 0%, #a78bfa 0%, transparent 55%), radial-gradient(ellipse at 100% 20%, #38bdf8 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, #f472b6 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, #6366f1 0%, transparent 60%), #0f172a';

export const DEFAULT_HOME_APPS: (string | null)[] = (() => {
  // 8 columns × 5 rows tablet layout
  const a: (string | null)[] = Array(40).fill(null);
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

export const DEFAULT_WIDGETS: string[][] = [['clock', 'weather', 'calendar'], []];

export const emptyHomePage = (): (string | null)[] => Array(40).fill(null);
