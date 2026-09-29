import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateInventoryDashboard, calculateMaterialRequirements } from '../src/inventory.mjs';

test('calculates stockout risk and reorder needs from inventory assumptions', () => {
  const dashboard = calculateInventoryDashboard([
    { code: 'MAT-001', name: '알루미늄 판재', unit: 'EA', currentStock: 528, safetyStock: 176, dailyUsage: 176, leadTimeDays: 14 },
    { code: 'MAT-002', name: '포장재', unit: 'BOX', currentStock: 1000, safetyStock: 100, dailyUsage: 10, leadTimeDays: 3 },
  ]);

  assert.equal(dashboard.totalItems, 2);
  assert.equal(dashboard.atRiskCount, 1);
  assert.equal(dashboard.items[0].stockoutDays, 3);
  assert.equal(dashboard.items[0].needsReorder, true);
  assert.equal(dashboard.items[1].needsReorder, false);
});

test('calculates current stock from transactions instead of trusting a mutable balance', () => {
  const dashboard = calculateInventoryDashboard({
    items: [{ code: 'MAT-001', name: '판재', unit: 'EA', openingStock: 100, safetyStock: 20, dailyUsage: 10, leadTimeDays: 5 }],
    transactions: [
      { itemCode: 'MAT-001', type: '입고', quantity: 30 },
      { itemCode: 'MAT-001', type: '생산투입', quantity: 25 },
      { itemCode: 'MAT-001', type: '조정', quantity: -5 },
    ],
  });

  assert.equal(dashboard.items[0].currentStock, 100);
  assert.equal(dashboard.items[0].stockoutDays, 10);
});

test('aggregates BOM requirements across multiple finished goods and subtracts open supply', () => {
  const result = calculateMaterialRequirements({
    productionPlans: [
      { itemCode: 'FG-A', plannedQuantity: 10 },
      { itemCode: 'FG-B', plannedQuantity: 5 },
    ],
    bomLines: [
      { parentItemCode: 'FG-A', componentItemCode: 'MAT-001', quantityRequired: 2 },
      { parentItemCode: 'FG-B', componentItemCode: 'MAT-001', quantityRequired: 3 },
    ],
    items: [{ code: 'MAT-001', safetyStock: 10, openingStock: 20 }],
    transactions: [{ itemCode: 'MAT-001', type: '출고', quantity: 5 }],
    supplierOrders: [{ id: 'PO-1', itemCode: 'MAT-001', quantity: 15 }],
    supplierReceipts: [{ orderId: 'PO-1', itemCode: 'MAT-001', quantity: 5 }],
  });

  assert.equal(result[0].requiredQuantity, 35);
  assert.equal(result[0].currentStock, 15);
  assert.equal(result[0].openOrderQuantity, 10);
  assert.equal(result[0].netShortage, 20);
  assert.equal(result[0].needsOrder, true);
});

test('does not invent stockout days when daily usage is zero', () => {
  const dashboard = calculateInventoryDashboard({
    items: [{ code: 'MAT-002', name: '포장재', unit: 'BOX', openingStock: 100, dailyUsage: 0 }],
    transactions: [],
  });

  assert.equal(dashboard.items[0].stockoutDays, null);
  assert.equal(dashboard.items[0].risk, '계산 불가');
});
