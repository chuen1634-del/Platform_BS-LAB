import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeMeeting, analyzePreContact } from '../src/analysis.mjs';

test('each newly added material produces results that can be appended for the selected customer', () => {
  const customer = { companyName: '미래정밀', industry: '정밀 제조' };
  const companyMaterial = { sourceType: '회사소개서', content: '정밀 부품을 제조한다.' };
  const meetingMaterial = { sourceType: '미팅 기록', content: '재고를 엑셀로 관리한다.' };
  const first = analyzePreContact({ ...customer, materials: [companyMaterial] });
  const second = analyzeMeeting({ ...customer, material: meetingMaterial });

  assert.ok(first.length > 0);
  assert.ok(second.length > 0);
  assert.notEqual(first[0].sourceType, second[0].sourceType);
});
