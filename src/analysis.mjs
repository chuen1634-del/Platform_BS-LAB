const result = (category, statement, status, sourceType, followUpQuestion = '') => ({ category, statement, status, sourceType, followUpQuestion });

export function analyzePreContact({ companyName, industry, materials = [] }) {
  const primary = materials[0];
  const sourceType = primary?.sourceType ?? '담당자 입력';
  const content = primary?.content ?? '';
  const results = [
    result('회사 개요', `${companyName}은(는) ${industry || '업종 미지정'} 기업으로 등록되었습니다.`, '확인됨', '담당자 입력'),
    result('업종 특성', `${industry || '해당 업종'}의 생산·재고·납기 흐름을 우선 검토합니다.`, '추정', sourceType, '주요 제품과 생산 방식은 무엇인가요?'),
    result('예상 업무', '입고, 보관, 생산투입, 출고 및 재고실사 업무가 운영될 가능성이 있습니다.', '추정', '업종 분석', '재고 업무 중 가장 수작업이 많은 단계는 어디인가요?'),
    result('예상 Pain Point', '재고 정확도, 실시간 가시성, 수작업 입력과 납기 대응이 주요 확인 대상입니다.', '추정', '업종 분석', '최근 재고 오류나 납기 지연이 발생한 사례가 있나요?'),
    result('자료 확인', content ? '회사소개서 자료가 등록되어 후속 검토에 사용할 수 있습니다.' : '등록된 분석 자료가 없습니다.', content ? '확인됨' : '확인 필요', sourceType, '회사소개서나 공개자료를 추가로 등록할 수 있나요?'),
    result('고객 확인 필요', '현재 재고관리 시스템과 업무 담당자별 처리 방식은 자료만으로 확인할 수 없습니다.', '확인 필요', '고객 확인 필요', '현재 재고관리 업무를 담당하는 조직과 사용 시스템은 무엇인가요?'),
  ];
  return results;
}

export function analyzeMeeting({ companyName, industry, material }) {
  const content = material?.content?.trim() ?? '';
  const sourceType = material?.sourceType ?? '미팅 기록';
  const shortContent = content.length > 160 ? `${content.slice(0, 160)}…` : content;
  return [
    result('고객 발언', shortContent || `${companyName} 담당자의 미팅 기록이 등록되었습니다.`, '확인됨', sourceType),
    result('현재 업무', '현재 재고·생산 관련 업무가 엑셀, 수작업 또는 부서별 개별 관리로 운영되는지 확인합니다.', '확인됨', sourceType, '현재 업무를 처리하는 시스템과 담당자는 누구인가요?'),
    result('문제 영향', '재고 데이터 불일치와 실사·조정 시간으로 생산 및 구매 의사결정이 지연될 가능성이 있습니다.', '확인됨', sourceType, '이 문제로 발생한 비용이나 납기 영향이 측정되어 있나요?'),
    result('고객 요구', `${industry || '제조'} 업무의 재고 정확도와 부서 간 정보 공유 개선 요구를 우선 검토합니다.`, '추정', sourceType, '고객이 가장 먼저 개선하고 싶은 업무는 무엇인가요?'),
    result('추가 확인', '고객 발언에 나온 문제의 빈도, 영향 규모, 개선 우선순위는 추가 확인이 필요합니다.', '확인 필요', sourceType, '문제가 발생하는 빈도와 최근 대표 사례를 확인할 수 있을까요?'),
  ];
}

export function analyzeFieldVisit({ companyName, industry, material }) {
  const content = material?.content?.trim() ?? '';
  const sourceType = material?.sourceType ?? '현장 메모';
  const shortContent = content.length > 180 ? `${content.slice(0, 180)}…` : content;
  return [
    result('As-Is 업무', shortContent || `${companyName}의 현장 업무 흐름을 등록했습니다.`, '확인됨', sourceType, '업무 단계별 담당자와 처리 시간을 확인할 수 있을까요?'),
    result('As-Is 문제점', '수기 기록과 부서별 개별 재고표가 데이터 재입력과 수량 불일치를 만드는 병목으로 확인됩니다.', '확인됨', sourceType, '재입력과 수량 불일치가 하루 또는 월간 몇 건 발생하나요?'),
    result('To-Be 업무', '입고부터 생산투입까지 하나의 재고 흐름으로 연결하고, 현장 입력을 즉시 공유하는 업무로 개선합니다.', '제안', sourceType, '개선 우선순위가 가장 높은 업무 단계는 어디인가요?'),
    result('To-Be 시스템 방향', `${industry || '제조'} 현장에 모바일 입력, 재고 이력, 부서 간 공통 현황판을 적용하는 방향을 검토합니다.`, '제안', sourceType, '현재 사용 중인 ERP·MES와 연계가 필요한가요?'),
    result('기대 변화', '재입력 감소, 재고 정보 일원화, 실사·조정 시간 단축을 기대효과로 검증합니다.', '제안', sourceType, '개선 효과를 측정할 기준 지표는 무엇으로 정할까요?'),
  ];
}
