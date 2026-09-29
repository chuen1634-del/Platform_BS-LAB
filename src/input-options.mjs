export const INPUT_OPTIONS = {
  industries: ['자동차부품 제조', '전자부품 제조', '정밀 제조', '일반 제조', '기타'],
  contactStages: ['방문·미팅 전', '기초 자료만 보유', '미팅 완료', '현장 검증', '기타'],
  sourceTypes: ['회사소개서', '공개자료', '미팅 기록', '현장 메모', 'Excel 원본', '담당자 입력', '기타'],
  processes: ['입고', '보관', '생산투입', '출고', '재고실사', '발주·입고', '기타'],
  units: ['EA', 'BOX', 'KG', 'M', 'SET', '기타'],
  transactionTypes: ['입고', '출고', '생산투입', '생산완료', '조정', '폐기', '기타'],
  planStatuses: ['계획', 'Excel 계획', '확정', '진행 중', '완료', '기타'],
  businessScopes: ['1개 공장', '1개 생산라인', '특정 품목군', '전사 공통', '기타'],
  durations: ['4주', '6주', '8주', '12주', '기타'],
  successMetrics: ['재고 정확도', '결품 사전탐지율', '수기 처리시간', '납기 준수율', '기타'],
};

export function normalizeOtherValue(value, otherValue = '') {
  if (value !== '기타') return value;
  const detail = String(otherValue).trim();
  return detail ? `기타 · ${detail}` : '기타';
}
