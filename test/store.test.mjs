import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../src/store.mjs';

test('creates a project, stores source material, and restores it', () => {
  const store = createStore({ storage: new Map() });
  const project = store.createProject({
    companyName: '한빛전자',
    industry: '전자부품 제조',
    contactStage: 'pre-contact',
  });

  store.addSourceMaterial(project.id, {
    title: '한빛전자 회사소개서',
    sourceType: '회사소개서',
    content: '전자부품을 제조하며 다수의 생산 거점을 운영한다.',
  });

  const restored = store.getProject(project.id);
  assert.equal(restored.companyName, '한빛전자');
  assert.equal(restored.materials.length, 1);
  assert.equal(restored.materials[0].sourceType, '회사소개서');
});

test('appends meeting analysis without replacing pre-contact analysis', () => {
  const store = createStore({ storage: new Map() });
  const project = store.createProject({ companyName: '한빛전자', industry: '제조', contactStage: 'pre-contact' });
  store.saveResults(project.id, [{ category: '예상 Pain Point', status: '추정' }]);
  const updated = store.appendResults(project.id, [{ category: '고객 발언', status: '확인됨' }]);

  assert.equal(updated.results.length, 2);
  assert.equal(updated.results[0].status, '추정');
  assert.equal(updated.results[1].status, '확인됨');
});

test('supports multiple customers inside one project with isolated materials', () => {
  const store = createStore({ storage: new Map() });
  const project = store.createProject({ companyName: '한빛전자', industry: '제조', contactStage: 'pre-contact' });
  const second = store.createCustomer(project.id, { companyName: '미래정밀', industry: '정밀 제조', contactStage: 'pre-contact' });

  store.addSourceMaterial(project.id, second.id, { title: '미래정밀 소개서', sourceType: '회사소개서', content: '정밀 부품 제조' });

  const restored = store.getProject(project.id);
  assert.equal(restored.customers.length, 2);
  assert.equal(store.getCustomer(project.id, second.id).materials[0].title, '미래정밀 소개서');
  assert.equal(store.getCustomer(project.id, restored.customers[0].id).materials.length, 0);
});

test('stores ROI and PoC details only on the selected customer', () => {
  const store = createStore({ storage: new Map() });
  const project = store.createProject({ companyName: '한빛전자', industry: '제조', contactStage: 'pre-contact' });
  const second = store.createCustomer(project.id, { companyName: '미래정밀', industry: '정밀 제조' });
  store.saveBusinessCase(project.id, second.id, {
    roi: { investment: 12000000, annualSavings: 18000000, annualRevenueGain: 6000000 },
    poc: { targetProcess: '입고·재고실사', scope: '1개 공장', successMetric: '재고 오차율 30% 감소', duration: '8주' },
  });

  assert.equal(store.getCustomer(project.id, second.id).poc.scope, '1개 공장');
  assert.equal(store.getCustomer(project.id, project.customers[0].id).poc, null);
});
