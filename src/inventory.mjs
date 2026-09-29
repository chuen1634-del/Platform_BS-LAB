const INBOUND_TYPES = new Set(['입고', '생산완료']);
const OUTBOUND_TYPES = new Set(['출고', '생산투입', '폐기']);

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function inputParts(input = []) {
  return Array.isArray(input) ? { items: input, transactions: [] } : input;
}

function itemCode(item) {
  return item.code ?? item.itemCode ?? item.itemId;
}

export function calculateItemStock(item, transactions = []) {
  const openingStock = number(item.openingStock ?? item.currentStock);
  return transactions
    .filter((transaction) => itemCode(transaction) === itemCode(item))
    .reduce((stock, transaction) => {
      const quantity = number(transaction.quantity);
      if (INBOUND_TYPES.has(transaction.type)) return stock + quantity;
      if (OUTBOUND_TYPES.has(transaction.type)) return stock - quantity;
      if (transaction.type === '조정') return stock + quantity;
      return stock;
    }, openingStock);
}

export function calculateInventoryRisk(item, context = {}) {
  const currentStock = number(item.currentStock);
  const dailyUsage = number(item.dailyUsage);
  const safetyStock = number(item.safetyStock);
  const leadTimeDays = number(item.leadTimeDays);
  const stockoutDays = dailyUsage > 0 ? Math.floor(currentStock / dailyUsage) : null;
  const reorderPoint = safetyStock + (dailyUsage * leadTimeDays);
  const risk = dailyUsage === 0 ? '계산 불가' : currentStock <= safetyStock ? '긴급' : currentStock <= reorderPoint ? '발주 검토' : '정상';
  return {
    ...item,
    currentStock,
    dailyUsage,
    safetyStock,
    leadTimeDays,
    stockoutDays,
    reorderPoint,
    risk,
    needsReorder: currentStock <= reorderPoint && dailyUsage > 0,
    requiredQuantity: number(context.requiredQuantity),
    openOrderQuantity: number(context.openOrderQuantity),
    netShortage: number(context.netShortage),
  };
}

export function calculateMaterialRequirements({ productionPlans = [], bomLines = [], items = [], transactions = [], supplierOrders = [], supplierReceipts = [] } = {}) {
  const required = new Map();
  for (const plan of productionPlans) {
    const quantity = number(plan.plannedQuantity ?? plan.quantity);
    for (const line of bomLines.filter((entry) => entry.parentItemCode === (plan.itemCode ?? plan.parentItemCode))) {
      const code = line.componentItemCode ?? line.itemCode;
      required.set(code, (required.get(code) ?? 0) + quantity * number(line.quantityRequired));
    }
  }

  return [...required.entries()].map(([code, requiredQuantity]) => {
    const item = items.find((entry) => itemCode(entry) === code) ?? { code, name: code, safetyStock: 0 };
    const currentStock = calculateItemStock(item, transactions);
    const ordered = supplierOrders.filter((order) => itemCode(order) === code).reduce((sum, order) => sum + number(order.quantity ?? order.orderedQuantity), 0);
    const received = supplierReceipts.filter((receipt) => itemCode(receipt) === code).reduce((sum, receipt) => sum + number(receipt.quantity ?? receipt.receivedQuantity), 0);
    const openOrderQuantity = Math.max(0, ordered - received);
    const netShortage = Math.max(0, requiredQuantity + number(item.safetyStock) - currentStock - openOrderQuantity);
    return { ...item, code, requiredQuantity, currentStock, openOrderQuantity, netShortage, needsOrder: netShortage > 0 };
  }).sort((a, b) => b.netShortage - a.netShortage);
}

export function calculateInventoryDashboard(input = []) {
  const { items = [], transactions = [], productionPlans = [], bomLines = [], supplierOrders = [], supplierReceipts = [] } = inputParts(input);
  const requirements = calculateMaterialRequirements({ productionPlans, bomLines, items, transactions, supplierOrders, supplierReceipts });
  const analyzed = items.map((item) => {
    const requirement = requirements.find((entry) => itemCode(entry) === itemCode(item));
    const currentStock = calculateItemStock(item, transactions);
    return calculateInventoryRisk({ ...item, currentStock }, requirement ?? {});
  });
  return {
    totalItems: analyzed.length,
    atRiskCount: analyzed.filter((item) => item.needsReorder || item.netShortage > 0).length,
    totalUnits: analyzed.reduce((sum, item) => sum + item.currentStock, 0),
    totalValue: analyzed.reduce((sum, item) => sum + (item.currentStock * number(item.unitCost)), 0),
    requirements,
    items: analyzed,
  };
}
