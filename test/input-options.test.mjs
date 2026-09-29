import test from 'node:test';
import assert from 'node:assert/strict';
import { INPUT_OPTIONS, normalizeOtherValue } from '../src/input-options.mjs';

test('주요 입력 메뉴는 기타 선택지를 포함한다', () => {
  for (const options of Object.values(INPUT_OPTIONS)) assert.ok(options.includes('기타'));
});

test('기타 선택 시 사용자가 입력한 상세값을 보존한다', () => {
  assert.equal(normalizeOtherValue('기타', '현장별 별도 처리'), '기타 · 현장별 별도 처리');
  assert.equal(normalizeOtherValue('입고', ''), '입고');
});
