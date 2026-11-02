/** 홈 화면 기본 배치 / 기본 배경화면 (UI·기능 변경 없음, 값 그대로 이동) */

export const DEFAULT_WALLPAPER =
  'radial-gradient(ellipse at 20% 0%, #a78bfa 0%, transparent 55%), radial-gradient(ellipse at 100% 20%, #38bdf8 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, #f472b6 0%, transparent 55%), radial-gradient(ellipse at 0% 100%, #6366f1 0%, transparent 60%), #0f172a';

export const DEFAULT_HOME_APPS: (string | null)[] = (() => {
  // 8 columns × 5 rows tablet layout
  const a: (string | null)[] = Array(40).fill(null);
  a[0] = 'PlayStore'; a[1] = 'Notes'; a[2] = 'Folder'; a[3] = 'Internet';
  a[4] = 'Camera'; a[5] = 'Gallery'; a[6] = 'Calculator'; a[7] = 'Settings';
  a[8] = 'Calendar'; a[9] = 'Clock';
  return a;
})();

export const DEFAULT_WIDGETS: string[][] = [['clock', 'weather', 'calendar'], []];

export const emptyHomePage = (): (string | null)[] => Array(40).fill(null);
