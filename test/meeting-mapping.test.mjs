import test from 'node:test';
import assert from 'node:assert/strict';
import { mapMeetingInfoToInventory } from '../src/meeting-mapping.mjs';

test('maps meeting statements to inventory system fields', () => {
  const mapping = mapMeetingInfoToInventory([
    { category: '고객 발언', statement: '입고 수량을 종이에 쓰고 오후에 Excel에 다시 입력한다.', status: '확인됨' },
    { category: '문제 영향', statement: '생산팀과 구매팀의 재고 수량이 자주 다르다.', status: '확인됨' },
    { category: '고객 요구', statement: '생산계획과 발주를 자동으로 연결하고 싶다.', status: '추정' },
  ]);

  assert.equal(mapping[0].target, '재고거래');
  assert.equal(mapping[1].target, '재고 정확도 KPI');
  assert.equal(mapping[2].target, '생산계획·BOM·발주');
});

test('returns a useful checklist when meeting notes do not contain recognizable fields', () => {
  const mapping = mapMeetingInfoToInventory([]);
  assert.equal(mapping.length, 5);
  assert.equal(mapping.every((item) => item.status === '추가 확인'), true);
});
