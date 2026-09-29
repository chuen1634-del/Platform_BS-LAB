const CHECKLIST = [
  ['현재 업무·기록 방식', '재고거래'],
  ['재고 수량 차이·오류', '재고 정확도 KPI'],
  ['생산계획·생산량', '생산계획'],
  ['제품 구성·부품 사용량', 'BOM'],
  ['발주·납기·입고 문제', '발주·입고'],
];

export function mapMeetingInfoToInventory(results = []) {
  const source = results.map((item) => `${item.category ?? ''} ${item.statement ?? ''}`.toLowerCase());
  const mapped = [];
  const add = (label, target, keywords, result) => {
    const index = source.findIndex((text) => keywords.some((keyword) => text.includes(keyword)));
    mapped.push({ source: label, target, status: index >= 0 ? (results[index].status === '확인됨' ? '연결 가능' : '추가 확인') : '추가 확인', statement: index >= 0 ? results[index].statement : '미팅에서 이 항목을 확인하세요.' });
  };
  add('현재 업무·기록 방식', '재고거래', ['입고', '출고', '수기', '엑셀', '재고'], results);
  add('재고 수량 차이·오류', '재고 정확도 KPI', ['오류', '차이', '불일치', '실사'], results);
  add('생산계획·생산량', '생산계획·BOM·발주', ['생산계획', '생산량', '생산'], results);
  add('제품 구성·부품 사용량', 'BOM', ['부품', 'bom', '구성', '소요'], results);
  add('발주·납기·입고 문제', '발주·입고', ['발주', '납기', '입고', '공급사'], results);
  return mapped;
}
