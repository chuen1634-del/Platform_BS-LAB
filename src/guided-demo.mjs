export const GUIDED_DEMO_STEPS = [
  { id: 'plan', number: '01', title: '생산계획 확인', action: '2026-05-01 · 89840B1000RRY · 생산 167개 계획을 선택합니다.', result: '생산계획이 재고 계산의 시작점이 됩니다.' },
  { id: 'bom', number: '02', title: 'BOM 자재 전개', action: '완제품 1개당 필요한 4개 구성품을 연결합니다.', result: '생산수량 × BOM 소요량으로 자재 필요량을 계산합니다.' },
  { id: 'stock', number: '03', title: '예상재고 계산', action: '기초재고·입고·생산투입 내역과 생산계획을 비교합니다.', result: '생산 후 예상재고가 품목별로 표시됩니다.' },
  { id: 'risk', number: '04', title: '부족 위험 판정', action: '안전재고와 발주잔량을 함께 비교합니다.', result: '생산중단 위험과 부족수량을 우선순위로 보여줍니다.' },
  { id: 'proposal', number: '05', title: '제안서 연결', action: '계산 결과를 재고관리 Solution 제안 근거로 연결합니다.', result: '운영 데이터 기반의 To-Be·PoC·ROI 확인 항목으로 이어집니다.' },
];

export function getGuidedDemoStep(index) {
  return GUIDED_DEMO_STEPS[Math.min(Math.max(Number(index) || 0, 0), GUIDED_DEMO_STEPS.length - 1)];
}
