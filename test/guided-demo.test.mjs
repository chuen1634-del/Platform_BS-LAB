import test from 'node:test';
import assert from 'node:assert/strict';
import { GUIDED_DEMO_STEPS, getGuidedDemoStep } from '../src/guided-demo.mjs';

test('자동 실행 데모는 재고 흐름 순서대로 단계를 제공한다', () => {
  assert.deepEqual(GUIDED_DEMO_STEPS.map((step) => step.id), ['plan', 'bom', 'stock', 'risk', 'proposal']);
  assert.equal(getGuidedDemoStep(0).id, 'plan');
  assert.equal(getGuidedDemoStep(99).id, 'proposal');
});

test('자동 실행 데모 단계에는 사용자가 이해할 설명과 화면 행동이 있다', () => {
  assert.ok(GUIDED_DEMO_STEPS.every((step) => step.title && step.action && step.result));
});
