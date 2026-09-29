export const BUSINESS_LAB_MODULES = [
  { id: 'intake', number: '01', title: '고객사 정보 수집·분석', description: '회사소개서·미팅·현장자료를 사실, 가설, 확인 필요로 구조화합니다.', action: 'open-analysis', cta: '고객 분석 열기' },
  { id: 'pre-meeting', number: '02', title: '초기 미팅 준비', description: '미팅 전 확인할 회사·업무·시스템·재고관리 질문과 수집자료를 준비합니다.', action: 'pre-meeting', cta: '미팅 준비하기' },
  { id: 'research', number: '03', title: '업종·시장·Reference 조사', description: '산업 업무 방식, 시장과 경쟁 환경, 유사 사례를 제안 근거로 정리합니다.', action: 'research', cta: '조사 구조 보기' },
  { id: 'inventory-demo', number: '04', title: '재고관리 데모 플랫폼', description: '조이슨세이프티 Excel 기준 생산계획·BOM·재고·부족 위험을 직접 확인합니다.', action: 'open-inventory-demo', cta: '데모 환경 열기' },
  { id: 'proposal', number: '05', title: 'Solution 제안서 제작', description: 'Pain Point, As-Is·To-Be, ROI, PoC, 추진 일정을 하나의 제안으로 연결합니다.', action: 'open-solution', cta: '제안서 열기' },
  { id: 'launch', number: '06', title: '신규 사업·상품 런칭', description: '표준 상품, 고객별 커스터마이징, PoC 전환, 확장 사업 모델을 정의합니다.', action: 'launch', cta: '사업화 구조 보기' },
];

export const MODULE_NAV_ITEMS = [
  { label: '홈', action: 'home' },
  { label: '고객 분석', action: 'open-analysis' },
  { label: '미팅 준비', action: 'pre-meeting' },
  { label: '업종 조사', action: 'research' },
  { label: '재고 데모', action: 'open-inventory-demo' },
  { label: '제안서', action: 'open-solution' },
  { label: '사업화', action: 'launch' },
];

export const PRE_MEETING_CHECKLIST = [
  { id: 'company-profile', title: '회사·사업 기본정보', description: '회사 규모, 주요 사업, 생산거점, 고객군, 조직 구조를 회사소개서에서 먼저 정리합니다.', source: '회사소개서·공개자료' },
  { id: 'system-environment', title: '시스템 환경 가설', description: 'ERP·MES·WMS·Excel 사용 여부와 데이터가 끊기는 구간을 질문 후보로 준비합니다.', source: '공개자료·사전 가설' },
  { id: 'inventory-hypothesis', title: '재고관리 업무 가설', description: '입고·보관·생산투입·출고·실사·발주·납기·불용재고 흐름을 사전 점검합니다.', source: '업종 지식·재고 데모' },
  { id: 'pain-points', title: 'Pain Point 질문', description: '재입력, 재고차이, 결품, 긴급발주, 납기지연, 생산중단 사례를 확인할 질문을 준비합니다.', source: '미팅 질문지' },
  { id: 'meeting-questions', title: '담당자·프로세스 질문', description: '업무 담당자, 승인자, 처리시간, 예외 처리, 개선 우선순위를 확인합니다.', source: '미팅 아젠다' },
  { id: 'evidence-plan', title: '후속자료 수집계획', description: '재고 Excel, 생산계획, BOM, 발주·입고, 실사결과를 요청할 순서를 정합니다.', source: '자료 요청 목록' },
  { id: 'next-step', title: '미팅 후 다음 단계', description: '확인됨·추정·확인 필요를 나누고 현장진단, 데이터분석, PoC 범위를 정합니다.', source: '분석·제안서 연결' },
];

export const COMMERCIALIZATION_STAGES = [
  { id: 'discover', title: '문제 발견', output: '고객군·업무 Pain Point·적용 가설' },
  { id: 'poc', title: 'PoC 검증', output: '1개 공장·라인·업무의 데이터 기반 검증' },
  { id: 'standardize', title: '표준 상품화', output: '재고·생산·BOM·발주·입고 표준 기능' },
  { id: 'launch', title: '정식 런칭', output: '가격·추진일정·운영지원·제안 패키지' },
  { id: 'expand', title: '고객 확장', output: '다른 제조업 고객·라인·거점으로 확장' },
];
