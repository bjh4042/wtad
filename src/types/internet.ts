export type InternetView = 'newtab' | 'results' | 'site' | 'naver' | 'google';
export type InternetHist = { title: string; url: string; view: InternetView };
export type InternetTab = { id: number; title: string; url: string; view: InternetView; history: InternetHist[]; historyIndex: number };
export const makeInternetTab = (id: number): InternetTab => ({ id, title: '새 탭', url: '', view: 'newtab', history: [{ title: '새 탭', url: '', view: 'newtab' }], historyIndex: 0 });
