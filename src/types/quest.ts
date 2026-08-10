export interface Quest {
  /** 저장 데이터 호환의 기준이 되는 고유 id (배열 순서와 무관하게 유지) */
  id: number;
  /** 미션 안내 문구 */
  text: string;
  /** 완료 판정용 UI 요소 id. null 이면 자동 완료(요약) 미션 */
  targetId: string | null;
  /** 완료 시 지급 경험치 */
  exp: number;
}
