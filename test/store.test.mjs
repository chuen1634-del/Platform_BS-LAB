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

test('stores inventory items and transactions only on the selected customer', () => {
  const store = createStore({ storage: new Map() });
  const project = store.createProject({ companyName: '한빛전자', industry: '제조', contactStage: 'pre-contact' });
  const second = store.createCustomer(project.id, { companyName: '미래정밀', industry: '정밀 제조' });
  store.addInventoryItem(project.id, second.id, { code: 'MAT-001', name: '알루미늄 판재', unit: 'EA', currentStock: 100, safetyStock: 20, dailyUsage: 10, leadTimeDays: 5 });
  store.recordInventoryTransaction(project.id, second.id, { code: 'MAT-001', type: '출고', quantity: 10, note: '생산 투입' });

  const selected = store.getCustomer(project.id, second.id);
  const first = store.getCustomer(project.id, project.customers[0].id);
  assert.equal(selected.inventory.items[0].currentStock, 90);
  assert.equal(selected.inventory.transactions.length, 1);
  assert.equal(first.inventory.items.length, 0);
});

test('stores production, BOM, purchase order, and receipt data per customer', () => {
  const store = createStore({ storage: new Map() });
  const project = store.createProject({ companyName: '한빛전자', industry: '제조', contactStage: 'pre-contact' });
  const second = store.createCustomer(project.id, { companyName: '미래정밀', industry: '정밀 제조' });

  store.addProductionPlan(project.id, second.id, { date: '2026-10-01', itemCode: 'FG-001', plannedQuantity: 100 });
  store.addBomLine(project.id, second.id, { parentItemCode: 'FG-001', componentItemCode: 'MAT-001', quantityRequired: 2 });
  store.addSupplierOrder(project.id, second.id, { id: 'PO-001', itemCode: 'MAT-001', quantity: 150, expectedDate: '2026-09-29' });
  store.recordSupplierReceipt(project.id, second.id, { orderId: 'PO-001', itemCode: 'MAT-001', quantity: 50 });

  const selected = store.getCustomer(project.id, second.id);
  const first = store.getCustomer(project.id, project.customers[0].id);
  assert.equal(selected.inventory.productionPlans[0].plannedQuantity, 100);
  assert.equal(selected.inventory.bomLines[0].quantityRequired, 2);
  assert.equal(selected.inventory.supplierOrders[0].quantity, 150);
  assert.equal(selected.inventory.supplierReceipts[0].quantity, 50);
  assert.equal(first.inventory.productionPlans.length, 0);
});

test('rejects invalid negative operational quantities', () => {
  const store = createStore({ storage: new Map() });
  const project = store.createProject({ companyName: '한빛전자', industry: '제조', contactStage: 'pre-contact' });
  assert.throws(() => store.addProductionPlan(project.id, project.customers[0].id, { date: '2026-10-01', itemCode: 'FG-001', plannedQuantity: -1 }), /수량/);
  assert.throws(() => store.addSupplierOrder(project.id, project.customers[0].id, { id: 'PO-1', itemCode: 'MAT-001', quantity: -1 }), /수량/);
});
