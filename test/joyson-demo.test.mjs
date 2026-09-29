import test from 'node:test';
import assert from 'node:assert/strict';
import { createJoysonSafetyBlueprint } from '../src/joyson-safety-demo.mjs';

test('조이슨세이프티 데모는 Excel 근거 자료와 재고 흐름을 함께 제공한다', () => {
  const blueprint = createJoysonSafetyBlueprint();

  assert.equal(blueprint.project.companyName, '조이슨세이프티');
  assert.equal(blueprint.project.industry, '자동차부품 제조');
  assert.equal(blueprint.materials.length, 3);
  assert.ok(blueprint.materials.every((material) => material.sourceType === 'Excel 원본'));
  assert.ok(blueprint.inventory.items.some((item) => item.code === '88810D2100NVH'));
  assert.ok(blueprint.inventory.items.some((item) => item.code === '89840B1000RRY'));
  assert.ok(blueprint.inventory.productionPlans.length >= 2);
  assert.ok(blueprint.inventory.bomLines.length >= 3);
  assert.ok(blueprint.inventory.transactions.some((transaction) => transaction.type === '출하'));
  assert.ok(blueprint.inventory.sourceSummary.includes('SDS_SYSTEM.xlsx'));
});

test('조이슨세이프티 데모는 민감한 접속정보를 포함하지 않는다', () => {
  const blueprint = createJoysonSafetyBlueprint();
  const serialized = JSON.stringify(blueprint);

  assert.doesNotMatch(serialized, /password|비밀번호|TKSDS|Program Files|######|\*{4,}/i);
});
