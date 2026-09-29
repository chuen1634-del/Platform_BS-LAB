export function nextStepForResult(item = {}) {
  if (item.status !== '확인 필요') return null;
  return {
    action: 'material',
    label: '미팅·현장 자료 추가',
    title: item.category || '추가 확인',
    question: item.followUpQuestion || '관련 업무 흐름과 영향 범위를 확인해 주세요.',
    guidance: '미팅 기록이나 현장 메모를 추가하면 이 항목을 근거 기반 분석으로 업데이트할 수 있습니다.',
  };
}

export function buildNextActions(customer = {}) {
  const actions = (customer.results ?? []).map(nextStepForResult).filter(Boolean);
  if (!customer.roi) actions.push({ action: 'business-case', label: 'ROI 입력 계획 세우기', title: 'ROI 수치 확인 필요', question: '초기 투자비, 절감액, 결품·긴급대응 비용을 아직 파악하지 못했다면 측정 계획부터 등록합니다.', guidance: 'ROI 입력 화면에서 실제 수치 대신 확인할 KPI와 수집 대상을 정할 수 있습니다.' });
  if (!customer.poc) actions.push({ action: 'business-case', label: 'PoC 초안 확정하기', title: 'PoC 범위 확인 필요', question: '검증할 공장·라인·업무와 성공 기준을 정하지 않았다면 표준 초안을 저장합니다.', guidance: '4~8주 범위의 작은 검증 단위로 시작해 실제 데이터를 확보합니다.' });
  return actions;
}

export function createDemoBlueprint() {
  return {
    project: { companyName: '[데모] 한빛전자', industry: '전자부품 제조', contactStage: 'basic' },
    materials: [
      { title: '데모 회사소개서', sourceType: '회사소개서', content: '한빛전자는 전자부품을 생산하며 재고와 생산계획을 부서별 Excel로 관리하고 있습니다.' },
      { title: '데모 현장 미팅 메모', sourceType: '현장 메모', content: '입고 수량은 창고에서 수기로 적고 나중에 Excel에 입력합니다. 생산계획 변경 시 자재 부족을 다시 확인하며, 발주 납기도 한 화면에서 보기 어렵습니다.' },
    ],
    inventory: {
      items: [
        { code: 'FG-001', name: '제어보드', unit: 'EA', currentStock: 5, unitCost: 10000, safetyStock: 2, dailyUsage: 1, leadTimeDays: 3 },
        { code: 'MAT-001', name: '커넥터', unit: 'EA', currentStock: 10, unitCost: 1200, safetyStock: 5, dailyUsage: 3, leadTimeDays: 7 },
      ],
      transactions: [{ code: 'MAT-001', type: '입고', quantity: 10, note: '데모 초기 입고' }],
      productionPlans: [{ date: '2026-10-15', itemCode: 'FG-001', plannedQuantity: 10, status: '계획' }],
      bomLines: [{ parentItemCode: 'FG-001', componentItemCode: 'MAT-001', quantityRequired: 2 }],
      supplierOrders: [{ supplierId: 'SUP-001', itemCode: 'MAT-001', quantity: 4, expectedDate: '2026-10-20', status: '발주' }],
      supplierReceipts: [{ orderId: 'DEMO-ORDER-001', itemCode: 'MAT-001', quantity: 2, receivedDate: '2026-10-05', status: '입고' }],
    },
    businessCase: null,
  };
}
