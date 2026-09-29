import test from 'node:test';
import assert from 'node:assert/strict';
import { buildNextActions, createDemoBlueprint, nextStepForResult } from '../src/workflow.mjs';

test('maps a missing analysis result to a concrete next input step', () => {
  const next = nextStepForResult({ category: 'As-Is 업무', status: '확인 필요', followUpQuestion: '현재 담당자는 누구인가요?' });

  assert.equal(next.action, 'material');
  assert.equal(next.label, '미팅·현장 자료 추가');
  assert.equal(next.question, '현재 담당자는 누구인가요?');
});

test('builds customer next actions for missing As-Is, ROI, and PoC', () => {
  const actions = buildNextActions({
    results: [{ category: 'As-Is 업무', status: '확인 필요', followUpQuestion: '업무 흐름은?' }],
    roi: null,
    poc: null,
  });

  assert.deepEqual(actions.map((item) => item.action), ['material', 'business-case', 'business-case']);
  assert.equal(actions[1].label, 'ROI 입력 계획 세우기');
  assert.equal(actions[2].label, 'PoC 초안 확정하기');
});

test('provides one complete demo blueprint without customer data', () => {
  const demo = createDemoBlueprint();

  assert.equal(demo.project.companyName, '[데모] 한빛전자');
  assert.equal(demo.materials.length, 2);
  assert.equal(demo.inventory.items.length, 2);
  assert.equal(demo.inventory.productionPlans.length, 1);
  assert.equal(demo.inventory.bomLines.length, 1);
  assert.equal(demo.inventory.supplierOrders.length, 1);
  assert.equal(demo.inventory.supplierReceipts.length, 1);
  assert.equal(demo.businessCase, null);
});
