import test from 'node:test';
import assert from 'node:assert/strict';
import { BUSINESS_LAB_MODULES, PRE_MEETING_CHECKLIST, COMMERCIALIZATION_STAGES } from '../src/business-lab-modules.mjs';

test('사업개발 전체 흐름을 담당하는 모듈이 정의되어 있다', () => {
  assert.deepEqual(BUSINESS_LAB_MODULES.map((module) => module.id), ['intake', 'pre-meeting', 'research', 'inventory-demo', 'proposal', 'launch']);
  assert.ok(BUSINESS_LAB_MODULES.every((module) => module.title && module.description && module.action));
});

test('초기 미팅 전 준비 체크리스트가 고객 정보부터 자료 수집까지 포함한다', () => {
  assert.ok(PRE_MEETING_CHECKLIST.some((item) => item.id === 'company-profile'));
  assert.ok(PRE_MEETING_CHECKLIST.some((item) => item.id === 'inventory-hypothesis'));
  assert.ok(PRE_MEETING_CHECKLIST.some((item) => item.id === 'meeting-questions'));
  assert.ok(PRE_MEETING_CHECKLIST.length >= 6);
});

test('PoC에서 표준 상품으로 전환하는 사업화 단계가 정의되어 있다', () => {
  assert.deepEqual(COMMERCIALIZATION_STAGES.map((stage) => stage.id), ['discover', 'poc', 'standardize', 'launch', 'expand']);
});
