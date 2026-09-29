import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSolutionProposal } from '../src/solution.mjs';

test('builds an inventory-backed solution proposal from customer evidence', () => {
  const proposal = buildSolutionProposal({
    companyName: '한빛전자',
    industry: '전자부품 제조',
    results: [{ category: 'As-Is 업무', statement: '입고 수량을 종이에 적고 나중에 Excel에 입력한다.', status: '확인됨', sourceType: '현장 메모' }],
    roi: { investment: 100, annualBenefit: 250, roiPercent: 150, paybackMonths: 5 },
    poc: { targetProcess: '입고·재고실사', scope: '1개 공장', successMetric: '재고 오차율 30% 감소', duration: '8주' },
    inventory: {
      items: [{ code: 'MAT-001', name: '판재', unit: 'EA', openingStock: 10, safetyStock: 5, dailyUsage: 3, leadTimeDays: 3 }],
      transactions: [],
      productionPlans: [{ itemCode: 'FG-001', plannedQuantity: 10 }],
      bomLines: [{ parentItemCode: 'FG-001', componentItemCode: 'MAT-001', quantityRequired: 2 }],
      supplierOrders: [],
      supplierReceipts: [],
    },
  });

  assert.equal(proposal.companyName, '한빛전자');
  assert.equal(proposal.painPoints.some((item) => item.status === '운영 데이터'), true);
  assert.equal(proposal.asIs[0].status, '확인됨');
  assert.equal(proposal.roi.status, '확인됨');
  assert.equal(proposal.poc.status, '확인됨');
});

test('provides fallback questions and templates when As-Is, To-Be, and ROI are missing', () => {
  const proposal = buildSolutionProposal({ companyName: '미래정밀', industry: '정밀 제조', results: [], roi: null, poc: null, inventory: { items: [], transactions: [] } });

  assert.equal(proposal.asIs[0].status, '확인 필요');
  assert.equal(proposal.toBe[0].status, '제안');
  assert.equal(proposal.roi.status, '추가 입력 필요');
  assert.equal(proposal.poc.status, '초안');
  assert.ok(proposal.followUpQuestions.length >= 3);
});
