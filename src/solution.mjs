import { calculateInventoryDashboard } from './inventory.mjs';

const fallbackQuestions = [
  '현재 입고부터 생산투입까지 수량을 누가, 언제, 어디에 기록하나요?',
  '생산계획 대비 자재 부족이나 긴급발주가 최근 발생했나요?',
  '재고 오차·긴급구매·생산중단으로 발생한 비용을 측정할 수 있나요?',
  '1개 공장 또는 1개 생산라인으로 PoC를 시작할 수 있나요?',
];

export function buildSolutionProposal(customer = {}) {
  const inventory = { items: [], transactions: [], productionPlans: [], bomLines: [], supplierOrders: [], supplierReceipts: [], ...(customer.inventory ?? {}) };
  const dashboard = calculateInventoryDashboard(inventory);
  const results = customer.results ?? [];
  const asIs = results.filter((item) => item.category?.startsWith('As-Is'));
  const confirmedPainPoints = results.filter((item) => item.category?.includes('문제') || item.category?.includes('Pain'));
  const operationalPainPoints = dashboard.requirements.filter((item) => item.netShortage > 0).map((item) => ({
    category: '운영 데이터 기반 Pain Point',
    statement: `${item.code} 부품은 생산계획 기준 필요량 ${item.requiredQuantity} 대비 순부족량 ${item.netShortage}가 계산되었습니다.`,
    status: '운영 데이터',
    sourceType: '재고·생산 계산',
  }));
  if (!operationalPainPoints.length && dashboard.atRiskCount > 0) operationalPainPoints.push({ category: '운영 데이터 기반 Pain Point', statement: '안전재고 또는 Lead Time 기준 발주 검토 품목이 존재합니다.', status: '운영 데이터', sourceType: '재고·생산 계산' });

  return {
    companyName: customer.companyName ?? '',
    industry: customer.industry ?? '',
    summary: `${customer.companyName ?? '고객사'}의 재고·생산 흐름을 분석해 생산중단 위험과 데이터 연결 수준을 확인합니다.`,
    evidence: results.filter((item) => item.status === '확인됨').slice(0, 6),
    painPoints: [...confirmedPainPoints, ...operationalPainPoints].length ? [...confirmedPainPoints, ...operationalPainPoints] : [{ category: '고객 확인 필요', statement: '재고 정확도, 자재 부족, 수기 입력 중 우선순위가 높은 문제를 확인해야 합니다.', status: '확인 필요', sourceType: '추가 인터뷰' }],
    asIs: asIs.length ? asIs : [{ category: 'As-Is 업무', statement: inventory.items.length ? '현재 재고·생산 데이터는 입력되었으나 실제 담당자별 처리 흐름 확인이 필요합니다.' : '재고 입고·생산투입·출고·실사 업무 흐름을 확인해야 합니다.', status: '확인 필요', sourceType: '추가 인터뷰' }],
    toBe: [{ category: 'To-Be 업무', statement: '생산계획과 BOM을 기준으로 부품 필요량·현재고·발주·입고를 연결하고 부족 위험을 사전에 공유합니다.', status: '제안', sourceType: 'Solution 설계' }],
    solution: [{ category: 'Solution 구성', statement: '품목·재고거래·생산계획·BOM·발주·입고를 하나의 고객사 플랫폼에서 관리합니다.', status: '제안', sourceType: 'Solution 설계' }],
    expectedBenefits: ['생산중단 위험 사전탐지', '수기 재고 계산 감소', '발주·입고 판단 근거 통합', '재고 정확도와 대응속도 개선'],
    roi: customer.roi?.investment && customer.roi?.annualBenefit ? { ...customer.roi, status: '확인됨', sourceType: '담당자 입력' } : { status: '추가 입력 필요', sourceType: 'ROI 입력', requiredInputs: ['초기 구축비', '재고절감 목표', '긴급구매·특급운송 비용', '수기 처리시간', '생산중단 손실액'] },
    poc: customer.poc ? { ...customer.poc, status: '확인됨', sourceType: '담당자 입력' } : { status: '초안', targetProcess: '입고·재고실사·생산투입', scope: '1개 공장 또는 1개 생산라인', duration: '4~8주', successMetric: '재고 정확도·부족 사전탐지율·수기처리시간 측정' },
    followUpQuestions: [...new Set([...results.map((item) => item.followUpQuestion).filter(Boolean), ...fallbackQuestions])].slice(0, 6),
    metrics: { itemCount: dashboard.totalItems, atRiskCount: dashboard.atRiskCount, materialShortageCount: dashboard.requirements.filter((item) => item.netShortage > 0).length, transactionCount: inventory.transactions.length },
  };
}
