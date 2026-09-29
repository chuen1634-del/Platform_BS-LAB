# 제조업 재고·생산 연계 플랫폼 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 고객사별로 품목·BOM·생산계획·재고거래·발주·입고를 입력하고, 시스템이 자재소요량·현재고·부족량·발주위험을 자동 계산하는 내부 제조 재고관리 플랫폼을 구현한다.

**Architecture:** 기존 정적 바닐라 JS 앱의 고객사별 저장 모델을 유지하고, 순수 계산 모듈을 먼저 확장한다. 저장소는 고객사별 도메인 데이터를 보존하고, 화면은 입력 이벤트 후 계산 결과를 다시 렌더링한다. Excel은 시스템 입력의 대체가 아니라 템플릿 기반 가져오기·내보내기 보조 기능으로 분리한다.

**Tech Stack:** Vanilla JavaScript ES modules, localStorage/Map 테스트 저장소, Node built-in test runner, 기존 HTML/CSS.

**Spec:** `docs/superpowers/specs/2026-09-29-inventory-production-platform-design.md`

## Global Constraints

- 시스템이 기준 데이터이며 Excel은 보조 입력·마이그레이션 수단이다.
- 모든 데이터는 `projectId`와 `customerId`에 귀속된다.
- 현재고는 거래이력에서 계산하고 직접 수정은 조정거래로 기록한다.
- 생산계획·BOM·재고거래·발주·입고예정 변경 후 계산 결과가 갱신된다.
- 기존 고객사 분석·ROI·PoC 기능을 깨뜨리지 않는다.
- 외부 ERP/MES/WMS API, 바코드/RFID, 공급사 포털은 이번 범위에 포함하지 않는다.

## Review Focus

- 생산계획이 없는 품목은 BOM 소요량과 부족량을 0으로 계산하고 기존 재고위험은 유지한다.
- 동일 부품이 여러 완제품 BOM에 포함되면 부품 기준으로 필요량을 합산한다.
- 입고·출고·생산투입·조정 거래가 현재고에 정확히 반영되고 고객사 간 섞이지 않는다.
- 발주잔량과 입고예정량을 중복 차감하지 않는다.
- 일사용량이 0이면 소진예상일을 숫자로 표시하지 않는다.

### Task 1: 생산·재고 계산 엔진 확장

**Files:**
- Modify: `src/inventory.mjs`
- Test: `test/inventory.test.mjs`

**Interfaces:**
- Consumes: `items`, `transactions`, `productionPlans`, `bomLines`, `supplierOrders`, `supplierReceipts`
- Produces: `calculateInventoryDashboard(input)`, `calculateMaterialRequirements(input)`, `calculateInventoryRisk(item, context)`

- [ ] **Step 1: 실패 테스트 작성** — 거래 기반 현재고, BOM 다중 완제품 합산, 순부족량, 발주위험, 일사용량 0 케이스를 고정한다.
- [ ] **Step 2: 테스트 실패 확인** — `npm test -- test/inventory.test.mjs` 실행 시 새 함수 부재 또는 기대값 불일치로 실패하는 것을 확인한다.
- [ ] **Step 3: 최소 계산 구현** — 날짜·상태 필터를 과도하게 추가하지 않고, 순수 입력으로 계산 가능한 결과만 반환한다.
- [ ] **Step 4: 계산 테스트 통과** — 해당 테스트와 기존 전체 테스트를 실행한다.
- [ ] **Step 5: 커밋** — `feat: add production material planning calculations`

### Task 2: 고객사별 도메인 저장 모델 확장

**Files:**
- Modify: `src/store.mjs`
- Test: `test/store.test.mjs`

**Interfaces:**
- Consumes: Task 1 계산 입력 모델
- Produces: `addProductionPlan`, `addBomLine`, `addSupplierOrder`, `recordSupplierReceipt`, `recordInventoryTransaction` 확장 API와 고객사별 도메인 기본값

- [ ] **Step 1: 실패 테스트 작성** — 고객사별 기준정보·계획·BOM·발주·입고 저장과 복원, 고객사 격리를 검증한다.
- [ ] **Step 2: 테스트 실패 확인** — `npm test -- test/store.test.mjs` 실행 결과 새 저장 API가 없어서 실패하는 것을 확인한다.
- [ ] **Step 3: 저장 모델 구현** — 기존 단일 고객/레거시 마이그레이션을 유지하면서 `inventory` 하위에 생산·BOM·구매 컬렉션을 추가한다.
- [ ] **Step 4: 저장 테스트 통과** — 해당 테스트와 전체 테스트를 실행한다.
- [ ] **Step 5: 커밋** — `feat: persist production planning domain data`

### Task 3: 재고 플랫폼 입력 화면 연결

**Files:**
- Modify: `src/app.mjs`
- Modify: `styles.css`
- Test: `test/inventory.test.mjs` 또는 계산 입력 변환 테스트 추가

**Interfaces:**
- Consumes: Task 1 계산 API, Task 2 저장 API
- Produces: 고객사 선택 후 품목·재고거래·생산계획·BOM·발주·입고를 입력하는 화면과 저장 이벤트

- [ ] **Step 1: 실패 테스트 작성** — 입력 payload가 도메인 저장 API에 필요한 필드로 변환되는 핵심 변환을 테스트한다.
- [ ] **Step 2: 테스트 실패 확인**
- [ ] **Step 3: 화면 구현** — 기존 재고 화면을 유지하면서 탭 또는 섹션으로 생산계획, BOM, 발주·입고 입력을 추가한다.
- [ ] **Step 4: 화면 입력 변환 테스트 통과**
- [ ] **Step 5: 브라우저 수동 검증** — 고객사 선택, 품목 등록, 생산계획 입력, BOM 입력, 거래·발주·입고 입력 후 화면이 갱신되는지 확인한다.
- [ ] **Step 6: 커밋** — `feat: connect inventory production input workflows`

### Task 4: 자동 계산 대시보드와 오류 상태

**Files:**
- Modify: `src/app.mjs`
- Modify: `styles.css`
- Modify: `README.md`
- Test: `test/inventory.test.mjs`

**Interfaces:**
- Consumes: Task 1~3 결과
- Produces: 총 재고·재고금액·필요량·순부족·발주위험·입고지연·생산계획 요약과 빈 상태·검증 오류 표시

- [ ] **Step 1: 실패 테스트 작성** — 빈 생산계획, 미등록 품목, 음수 수량, 일사용량 0의 출력 상태를 고정한다.
- [ ] **Step 2: 테스트 실패 확인**
- [ ] **Step 3: 대시보드 구현** — 저장 직후 선택 고객사 데이터로 계산하고, 위험도와 계산 근거를 표시한다.
- [ ] **Step 4: 오류·빈 상태 테스트 통과**
- [ ] **Step 5: 전체 테스트·브라우저 검증** — `npm test` 및 로컬 화면 주요 흐름을 확인한다.
- [ ] **Step 6: 커밋** — `feat: add inventory planning risk dashboard`

### Task 5: Excel 보조 가져오기·내보내기

**Files:**
- Create: `src/inventory-import.mjs`
- Modify: `src/app.mjs`
- Modify: `README.md`
- Test: `test/inventory-import.test.mjs`

**Interfaces:**
- Consumes: 표준 CSV/TSV 또는 브라우저에서 읽은 Excel-compatible 행 데이터
- Produces: 품목·BOM·생산계획·재고거래의 검증된 저장 payload, 오류 행 목록, 계산 결과 내보내기 데이터

- [ ] **Step 1: 실패 테스트 작성** — 필수 컬럼 누락, 미등록 참조, 날짜·수량 오류와 정상 행 변환을 검증한다.
- [ ] **Step 2: 테스트 실패 확인**
- [ ] **Step 3: 가져오기 검증 구현** — 전체 반영 전 행 단위 오류를 반환하고 정상 행만 저장할 수 있도록 한다.
- [ ] **Step 4: 테스트 통과 확인**
- [ ] **Step 5: UI 연결** — Excel/CSV 업로드는 별도 보조 메뉴로 제공하고 템플릿 다운로드를 추가한다.
- [ ] **Step 6: 전체 회귀 테스트·README 갱신**
- [ ] **Step 7: 커밋** — `feat: add optional inventory data import export`

## Verification

- 각 Task의 대상 테스트를 먼저 실행하고 전체 `npm test`를 마지막에 실행한다.
- `node --check`로 변경된 ES module을 확인한다.
- `npm run dev`로 로컬 화면을 띄운 뒤 고객사 선택부터 자동 계산까지 수동 검증한다.
- 구현 완료 주장 전 검증 결과와 남은 범위를 기록한다.
