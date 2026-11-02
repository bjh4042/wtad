/** Adapt only tablet-specific wording; the actual left/right swipe instructions stay intact. */
export function formatLessonText(text: string | undefined, isPhone: boolean): string | undefined {
  if (!text || !isPhone) return text;
  return text
    .replaceAll('갤럭시탭', '갤럭시 스마트폰')
    .replaceAll('태블릿', '스마트폰')
    .replaceAll('좌측 메뉴를', '설정 목록을')
    .replaceAll('좌측 메뉴', '설정 목록')
    .replaceAll('우측 화면의', '화면의')
    .replaceAll('우측 화면에서', '화면에서')
    .replaceAll('왼쪽의 디바이스 케어', '설정 목록의 디바이스 케어');
}
