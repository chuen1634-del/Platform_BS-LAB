const JOYSON_SOURCE_SUMMARY = '88810D2100NVH.xlsx · 898503X500RY.xlsx · SDS_SYSTEM.xlsx';

export function createJoysonSafetyBlueprint() {
  return {
    project: {
      companyName: '조이슨세이프티',
      industry: '자동차부품 제조',
      contactStage: 'basic',
    },
    materials: [
      {
        title: '88810D2100NVH.xlsx · 생산·출하 계획',
        sourceType: 'Excel 원본',
        content: '88810D2100NVH 품목의 월간·일간 처리 시트에서 생산계획, 작업일, 생산수량, 출하수량, 안전재고, 생산라인 FS-F03 흐름을 확인했습니다. 현재고 기준값은 원본 산식 확인이 필요합니다.',
      },
      {
        title: '898503X500RY.xlsx · 생산·BOM·발주 계획',
        sourceType: 'Excel 원본',
        content: '89840B1000RRY 품목의 생산·출하·안전재고와 AB-F3 생산라인을 확인했습니다. X:AJ 영역에서 완제품과 구성품의 소요량 관계를 확인하고 자재 부족 계산에 연결했습니다.',
      },
      {
        title: 'SDS_SYSTEM.xlsx · 업무 구조·테이블 카탈로그',
        sourceType: 'Excel 원본',
        content: '월간·일간 생산계획, 출하, 생산, 자재소요, 발주, 창고, 공급업체, 고객품목, 재고실적, MES 연계 구조를 재고관리 플랫폼의 업무 흐름으로 정리했습니다. 접속정보와 경로는 저장하지 않습니다.',
      },
    ],
    results: [
      { category: '운영구조', status: '확인됨', statement: 'Excel에서 생산계획·출하·안전재고·자재소요·발주·창고 업무가 별도 영역으로 관리되고 있습니다.', sourceType: 'Excel 원본', followUpQuestion: '현재고와 실사 결과를 시스템에서 연결할 기준을 확인해야 합니다.' },
      { category: 'Pain Point', status: '추정', statement: '생산계획과 BOM 소요량을 현재고·발주잔량과 함께 비교하지 않으면 생산중단 위험을 사전에 판단하기 어렵습니다.', sourceType: 'Excel 원본', followUpQuestion: '품목별 결품·긴급발주 사례와 담당자 승인 절차를 확인해야 합니다.' },
      { category: '플랫폼 기회', status: '제안', statement: '생산계획을 등록하면 BOM 기준 자재 필요량, 현재고, 발주잔량, 순부족량을 자동 계산하는 재고관리 플랫폼으로 확장할 수 있습니다.', sourceType: 'Excel 원본', followUpQuestion: '우선 적용할 공장·라인·품목 범위를 정해야 합니다.' },
    ],
    inventory: {
      sourceSummary: JOYSON_SOURCE_SUMMARY,
      items: [
        { code: '88810D2100NVH', name: '88810D2100NVH 완제품', unit: 'EA', currentStock: 0, unitCost: 0, safetyStock: 48, dailyUsage: 43, leadTimeDays: 1 },
        { code: '89840B1000RRY', name: '89840B1000RRY 완제품', unit: 'EA', currentStock: 0, unitCost: 0, safetyStock: 528, dailyUsage: 176, leadTimeDays: 1 },
        { code: '1027316-AA', name: '1027316-AA 구성품', unit: 'EA', currentStock: 0, unitCost: 0, safetyStock: 0, dailyUsage: 0, leadTimeDays: 1 },
        { code: '1028393-AA', name: '1028393-AA 구성품', unit: 'EA', currentStock: 0, unitCost: 0, safetyStock: 0, dailyUsage: 0, leadTimeDays: 1 },
        { code: '1030896-AA', name: '1030896-AA 구성품', unit: 'EA', currentStock: 0, unitCost: 0, safetyStock: 0, dailyUsage: 0, leadTimeDays: 1 },
        { code: '1079543U85-AC', name: '1079543U85-AC 구성품', unit: 'EA', currentStock: 0, unitCost: 0, safetyStock: 0, dailyUsage: 0, leadTimeDays: 1 },
      ],
      transactions: [
        { code: '88810D2100NVH', type: '출하', quantity: 43, note: '88810D2100NVH · Excel 일간처리 예시 · 2026-03-02' },
        { code: '89840B1000RRY', type: '출하', quantity: 176, note: '89840B1000RRY · Excel 월간처리 예시 · 2026-05-01' },
      ],
      productionPlans: [
        { date: '2026-03-01', itemCode: '88810D2100NVH', plannedQuantity: 116, status: 'Excel 계획' },
        { date: '2026-03-02', itemCode: '88810D2100NVH', plannedQuantity: 6, status: 'Excel 계획' },
        { date: '2026-05-01', itemCode: '89840B1000RRY', plannedQuantity: 167, status: 'Excel 계획' },
        { date: '2026-05-06', itemCode: '89840B1000RRY', plannedQuantity: 175, status: 'Excel 계획' },
      ],
      bomLines: [
        { parentItemCode: '89840B1000RRY', componentItemCode: '1027316-AA', quantityRequired: 1, effectiveFrom: '2026-05-01' },
        { parentItemCode: '89840B1000RRY', componentItemCode: '1028393-AA', quantityRequired: 1, effectiveFrom: '2026-05-01' },
        { parentItemCode: '89840B1000RRY', componentItemCode: '1030896-AA', quantityRequired: 1, effectiveFrom: '2026-05-01' },
        { parentItemCode: '89840B1000RRY', componentItemCode: '1079543U85-AC', quantityRequired: 1, effectiveFrom: '2026-05-01' },
      ],
      supplierOrders: [],
      supplierReceipts: [],
    },
  };
}

export { JOYSON_SOURCE_SUMMARY };
