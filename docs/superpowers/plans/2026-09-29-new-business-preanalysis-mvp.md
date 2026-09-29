# 신규 사업 사전 분석 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 신규 사업 담당자가 회사소개서 중심으로 고객사 사전 분석 프로젝트를 생성하고 검토하는 내부 MVP를 구축한다.

**Architecture:** 기존 저장소 구조가 비어 있으므로, 먼저 실행 가능한 최소 웹 앱 골격을 만들고 프로젝트·자료·분석 결과를 명확한 데이터 모델로 분리한다. 분석 엔진은 초기에는 결정론적 템플릿 기반으로 구현해 사실/추정/확인 필요 상태를 보장하고, 이후 AI 분석으로 교체할 수 있는 경계를 둔다.

**Tech Stack:** 저장소에 이미 정해진 스택이 없으므로 구현 시 가장 단순한 로컬 실행 웹 스택을 선택한다. 선택한 스택과 실행 명령은 README에 고정한다.

**Spec:** `docs/superpowers/specs/2026-09-29-new-business-preanalysis-design.md`

## Global Constraints

- 주 사용자는 사내 신규 사업 담당자다.
- MVP는 사전 분석 모드만 포함한다.
- 분석 결과는 `확인됨`, `추정`, `확인 필요`를 구분한다.
- 미팅 분석, 현장 진단, ROI, PoC, 제안서 자동 생성은 이번 범위에서 제외한다.
- 모든 데이터는 프로젝트 단위로 다시 열람할 수 있어야 한다.

## Review Focus

- 회사소개서 없이 텍스트만 입력하는 경우에도 프로젝트를 만들 수 있어야 한다.
- 분석 결과가 비어 있거나 부분적으로 생성되어도 화면이 깨지지 않아야 한다.
- 추정과 확인 필요 항목이 확인된 사실과 시각적으로 구분되어야 한다.
- 긴 파일명과 긴 분석 문장이 레이아웃을 깨뜨리지 않아야 한다.
- 새로고침 후에도 프로젝트와 결과가 유지되어야 한다.

### Task 1: 실행 골격과 저장 모델

**Files:**
- Create: 프로젝트 표준 파일 및 `README.md`
- Test: 저장 모델의 생성·조회 테스트

**Interfaces:**
- Produces: `Project`, `SourceMaterial`, `AnalysisResult` 데이터 구조와 프로젝트 생성·조회 인터페이스

- [ ] **Step 1: 저장 모델 테스트 작성** — 프로젝트 생성, 자료 등록, 분석 결과 저장·조회 요구를 고정한다.
- [ ] **Step 2: 테스트가 실패하는지 확인** — 선택한 테스트 명령으로 정의되지 않은 저장 인터페이스 실패를 확인한다.
- [ ] **Step 3: 최소 저장 모델 구현** — 로컬 MVP에서 재실행 가능한 저장 방식을 사용한다.
- [ ] **Step 4: 테스트 통과 확인** — 모델 테스트를 실행한다.
- [ ] **Step 5: 실행 방법 문서화** — 설치·실행·테스트 명령을 README에 기록한다.

### Task 2: 프로젝트 생성과 자료 등록 화면

**Files:**
- Create: 프로젝트 목록·생성·상세 화면 파일
- Modify: 앱 라우팅 및 저장 연결 파일
- Test: 프로젝트 생성과 자료 등록 흐름 테스트

**Interfaces:**
- Consumes: Task 1의 프로젝트·자료 저장 인터페이스
- Produces: 신규 프로젝트 생성, 고객 기본정보 입력, 파일 또는 텍스트 자료 등록 UI

- [ ] **Step 1: 화면 흐름 테스트 작성** — 고객명과 회사소개서 텍스트를 입력하면 프로젝트가 생성되는지 검증한다.
- [ ] **Step 2: 테스트 실패 확인**
- [ ] **Step 3: 프로젝트 목록·생성·자료 등록 구현** — 사전 분석 모드 선택과 출처 유형 기록을 포함한다.
- [ ] **Step 4: 테스트 통과 확인**
- [ ] **Step 5: 빈 상태·오류 상태를 추가하고 테스트한다.**

### Task 3: 사전 분석 결과 생성

**Files:**
- Create: 사전 분석 서비스와 결과 카드 컴포넌트
- Modify: 프로젝트 상세 화면
- Test: 사실·추정·확인 필요 분류 및 결과 표시 테스트

**Interfaces:**
- Consumes: `Project`, `SourceMaterial`
- Produces: `AnalysisResult[]` with category, statement, status, sourceType, and followUpQuestion

- [ ] **Step 1: 분석 분류 테스트 작성** — 입력자료에서 확인된 정보, 추정 정보, 추가 확인 질문이 각각 올바른 상태로 반환되는지 검증한다.
- [ ] **Step 2: 테스트 실패 확인**
- [ ] **Step 3: 템플릿 기반 분석 서비스 구현** — 회사 개요, 업종 특성, 예상 업무, 예상 Pain Point, 확인 질문 카테고리를 생성한다.
- [ ] **Step 4: 결과 저장 연결**
- [ ] **Step 5: 테스트 통과 확인**

### Task 4: 분석 대시보드와 최종 검증

**Files:**
- Modify: 프로젝트 상세·분석 대시보드·스타일 파일
- Test: 새로고침 복원과 상태 구분에 대한 통합 테스트

**Interfaces:**
- Consumes: Task 1~3의 저장 및 분석 인터페이스
- Produces: 프로젝트 자료, 분석 결과, 신뢰도 상태, 후속 질문을 한 화면에서 검토하는 MVP

- [ ] **Step 1: 통합 테스트 작성** — 프로젝트 재진입 시 입력자료와 분석 결과가 복원되는지 검증한다.
- [ ] **Step 2: 테스트 실패 확인**
- [ ] **Step 3: 분석 대시보드 구현** — 상태별 색상·라벨과 출처를 노출하고 확인 필요 질문을 별도 영역에 표시한다.
- [ ] **Step 4: 전체 테스트와 수동 실행 검증**
- [ ] **Step 5: 구현 결과와 제외 범위를 README에 정리한다.**
