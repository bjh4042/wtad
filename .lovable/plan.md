# 작업 계획 — 오류 수정 + 구조 안정화

전체 4300줄 규모의 `AndroidExplorer.tsx`를 한 번에 리팩토링하면 회귀 위험이 매우 큽니다. 요청하신 3개 작업을 **3턴에 걸쳐 순차 진행**하는 것을 제안드립니다. 각 턴 끝에 빌드/동작을 확인하고 다음으로 넘어갑니다.

---

## 턴 1 — 심각한 기능 오류 수정 (이번 승인 시 바로 시작)

**수정 대상 (UI/문구/경험치 변경 없음, 최소 침습)**

1. **블루투스 페어링 흐름 재정렬**
   - 기기 선택 퀘스트 바로 다음에 페어링 PIN 확인 퀘스트가 오도록 QUESTS 배열 내 순서만 최소 조정
2. **마지막 퀘스트 완료/최종 경험치 미지급 문제**
   - `advanceQuest` / 최종 인덱스 경계 조건 점검, 완료 미션(요약 화면)이 EXP 지급 로직을 스킵하는지 확인
3. **경험치 중복 지급 방지**
   - `completed` set에 이미 포함된 id면 EXP 가산·토스트를 건너뛰도록 가드 추가
4. **google.com 잘못된 라우팅**
   - `.com` URL 입력 시 도메인별로 분기 (`google.com` → 구글 모의 화면, `naver.com` → 네이버 모의 화면). 현재 어떤 URL이든 NAVER로 가는 분기 수정
   - 필요 시 `google.com` mock 페이지 최소 컴포넌트 하나 추가 (기존 네이버 페이지 스타일 그대로)
5. **사진 삭제 퀘스트 진입 시 촬영 사진 리셋 문제**
   - 삭제 미션 진입 시점의 사진 배열 초기화 로직을 "부족한 개수만 샘플로 채움"으로 변경
6. **targetId 전수 점검**
   - QUESTS의 모든 `targetId`가 현재 렌더 트리에 존재하는지 grep으로 확인, 없는 경우만 최소 수정
7. **null/undefined 참조 가드** 최소 추가

**변경 파일**: `src/components/AndroidExplorer.tsx` (단일 파일)
**변경 금지**: UI 디자인, 퀘스트 문구, EXP 수치, 앱 기능

---

## 턴 2 — 퀘스트 데이터 분리 (턴 1 검증 후 진행)

- `src/types/quest.ts` — 실제 사용 필드 기반 `Quest` 타입 정의 (any 최소화)
- `src/data/quests.ts` — 현재 QUESTS 배열을 그대로 이동 (문구/순서/EXP 무변경)
- `AndroidExplorer.tsx` 상단 `const QUESTS = [...]` 를 `import { QUESTS } from '@/data/quests'` 로 대체
- localStorage 키/구조 무변경 → 기존 진행 데이터 그대로 호환
- 카테고리별 세분화(basic.ts, connection.ts 등)는 이번엔 보류, 우선 단일 파일로 안전하게 분리

---

## 턴 3 — 상태/로직 훅 분리 (턴 2 검증 후 진행)

**단계적 분리** (한 번에 전역화하지 않음):

1. `src/hooks/useProgressStorage.ts`
   - `completed`, `currentQuest`, `exp`, `level`, `installedApps`, `photos`, `notes`, `wallpaper`, `homePages` 등 **localStorage 저장/복원 전담**
   - 기존 저장 키 유지, 필요 시 버전 마이그레이션 헬퍼
2. `src/hooks/useQuestEngine.ts`
   - `advanceQuest`, `completeQuest(id)`, 중복 방지 가드, 레벨업 계산
   - UI에서는 `engine.complete(targetId)` 같은 단일 API 호출로 축소
3. `src/hooks/useDeviceState.ts` (선택적, 시간 되면)
   - Wi-Fi/BT/밝기/음량/앱설치/설치앱 상태 묶음

**원칙**: UI 컴포넌트는 표시·이벤트 전달만. `@ts-nocheck`는 새 파일에서는 사용하지 않고, 기존 파일의 `@ts-nocheck` 제거는 안정화 후 별도 판단.

---

## 검증

각 턴 종료 시:
- `bun run build` 성공
- 콘솔 오류 0
- 첫 미션 → BT 페어링 → 사진 삭제 → 인터넷 미션 → 최종 미션까지 스모크 테스트
- 새로고침 후 진행률 유지 확인

---

## 남아있을 수 있는 위험

- 4300줄 단일 파일의 상태 결합도가 높아, 훅 분리(턴 3) 시 렌더 타이밍 회귀 가능성 있음 → 훅 도입은 저장/엔진부터 좁게 시작
- 마지막 퀘스트 EXP 문제 원인이 로직 버그가 아니라 "완료 미션은 원래 EXP 0" 설계일 수 있음 → 턴 1에서 확인 후 보고

**이 계획대로 턴 1(오류 수정)부터 진행해도 될까요?** 승인 주시면 바로 작업 시작하겠습니다.
