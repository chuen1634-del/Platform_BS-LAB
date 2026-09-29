const KEY = 'new-business-preanalysis-projects';
const INBOUND_TYPES = new Set(['입고', '생산완료']);
const OUTBOUND_TYPES = new Set(['출고', '생산투입', '폐기']);

function readStorage(storage) {
  if (storage instanceof Map) return storage.get(KEY) ?? [];
  try { return JSON.parse(storage.getItem(KEY) ?? '[]'); } catch { return []; }
}
function writeStorage(storage, projects) { if (storage instanceof Map) storage.set(KEY, projects); else storage.setItem(KEY, JSON.stringify(projects)); }
function id(prefix) { return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function emptyInventory() { return { items: [], transactions: [], productionPlans: [], shipmentPlans: [], bomLines: [], supplierOrders: [], supplierReceipts: [] }; }
function requireNonNegativeQuantity(value) { if (value === undefined || value === null || value === '') return 0; const quantity = Number(value); if (!Number.isFinite(quantity) || quantity < 0) throw new Error('수량은 0 이상이어야 합니다.'); return quantity; }
function migrateProject(project) {
  if (project.customers?.length) {
    return { ...project, customers: project.customers.map((customer) => ({ roi: null, poc: null, inventory: emptyInventory(), ...customer, inventory: { ...emptyInventory(), ...(customer.inventory ?? {}) } })) };
  }
  const customer = { id: `${project.id}-customer-legacy`, companyName: project.companyName ?? '', industry: project.industry ?? '', contactStage: project.contactStage ?? 'pre-contact', materials: project.materials ?? [], results: project.results ?? [], roi: null, poc: null, inventory: emptyInventory() };
  return { ...project, customers: [customer] };
}

export function createStore({ storage = globalThis.localStorage } = {}) {
  const list = () => readStorage(storage).map(migrateProject);
  const save = (projects) => writeStorage(storage, projects);
  const resolveCustomer = (project, customerId) => project.customers.find((customer) => customer.id === customerId) ?? project.customers[0];
  const updateProject = (projects, project) => { const first = project.customers[0]; project.updatedAt = new Date().toISOString(); project.companyName = first?.companyName ?? ''; project.industry = first?.industry ?? ''; project.materials = first?.materials ?? []; project.results = first?.results ?? []; project.contactStage = first?.contactStage ?? 'pre-contact'; save(projects); return project; };

  return {
    listProjects() { return list().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); },
    createProject(input) {
      const now = new Date().toISOString();
      const customer = { id: id('customer'), companyName: input.companyName.trim(), industry: input.industry.trim(), contactStage: input.contactStage, materials: [], results: [], roi: null, poc: null, inventory: emptyInventory() };
      const project = { id: id('project'), companyName: customer.companyName, industry: customer.industry, contactStage: customer.contactStage, createdAt: now, updatedAt: now, materials: [], results: [], customers: [customer] };
      save([project, ...list()]); return project;
    },
    createCustomer(projectId, input) {
      const projects = list(); const project = projects.find((item) => item.id === projectId); if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');
      const customer = { id: id('customer'), companyName: input.companyName.trim(), industry: input.industry.trim(), contactStage: input.contactStage ?? 'pre-contact', materials: [], results: [], roi: null, poc: null, inventory: emptyInventory() };
      project.customers.push(customer); updateProject(projects, project); return customer;
    },
    getProject(projectId) { return list().find((project) => project.id === projectId) ?? null; },
    getCustomer(projectId, customerId) { const project = this.getProject(projectId); return project ? resolveCustomer(project, customerId) : null; },
    addSourceMaterial(projectId, customerIdOrInput, maybeInput) {
      const projects = list(); const project = projects.find((item) => item.id === projectId); if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');
      const legacyCall = typeof customerIdOrInput !== 'string'; const customer = resolveCustomer(project, legacyCall ? undefined : customerIdOrInput); const input = legacyCall ? customerIdOrInput : maybeInput; if (!customer) throw new Error('고객사를 찾을 수 없습니다.');
      customer.materials.push({ id: id('material'), title: input.title.trim(), sourceType: input.sourceType, content: input.content.trim(), createdAt: new Date().toISOString() }); updateProject(projects, project); return project;
    },
    saveResults(projectId, customerIdOrResults, maybeResults) {
      const projects = list(); const project = projects.find((item) => item.id === projectId); if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');
      const legacyCall = Array.isArray(customerIdOrResults); const customer = resolveCustomer(project, legacyCall ? undefined : customerIdOrResults); const results = legacyCall ? customerIdOrResults : maybeResults; customer.results = results; updateProject(projects, project); return project;
    },
    appendResults(projectId, customerIdOrResults, maybeResults) {
      const projects = list(); const project = projects.find((item) => item.id === projectId); if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');
      const legacyCall = Array.isArray(customerIdOrResults); const customer = resolveCustomer(project, legacyCall ? undefined : customerIdOrResults); const results = legacyCall ? customerIdOrResults : maybeResults; customer.results = [...customer.results, ...results]; updateProject(projects, project); return project;
    },
    saveBusinessCase(projectId, customerId, businessCase) {
      const projects = list(); const project = projects.find((item) => item.id === projectId); if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');
      const customer = resolveCustomer(project, customerId); if (!customer) throw new Error('고객사를 찾을 수 없습니다.');
      customer.roi = businessCase.roi ?? null; customer.poc = businessCase.poc ?? null; updateProject(projects, project); return project;
    },
    addInventoryItem(projectId, customerId, input) {
      const projects = list(); const project = projects.find((item) => item.id === projectId); if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');
      const customer = resolveCustomer(project, customerId); if (!customer) throw new Error('고객사를 찾을 수 없습니다.');
      customer.inventory = { ...emptyInventory(), ...(customer.inventory ?? {}) };
      const openingStock = requireNonNegativeQuantity(input.currentStock);
      customer.inventory.items.push({ id: id('inventory-item'), code: input.code.trim(), name: input.name.trim(), unit: input.unit.trim(), openingStock, currentStock: openingStock, unitCost: requireNonNegativeQuantity(input.unitCost), safetyStock: requireNonNegativeQuantity(input.safetyStock), dailyUsage: requireNonNegativeQuantity(input.dailyUsage), leadTimeDays: requireNonNegativeQuantity(input.leadTimeDays) });
      updateProject(projects, project); return project;
    },
    recordInventoryTransaction(projectId, customerId, input) {
      const projects = list(); const project = projects.find((item) => item.id === projectId); if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');
      const customer = resolveCustomer(project, customerId); if (!customer) throw new Error('고객사를 찾을 수 없습니다.');
      customer.inventory = { ...emptyInventory(), ...(customer.inventory ?? {}) };
      const item = customer.inventory.items.find((entry) => entry.code === input.code); if (!item) throw new Error('품목을 찾을 수 없습니다.');
      const quantity = Number(input.quantity); if (input.type !== '조정') requireNonNegativeQuantity(quantity); if (!Number.isFinite(quantity) || quantity === 0) throw new Error('수량은 0이 아니어야 합니다.'); item.currentStock += INBOUND_TYPES.has(input.type) ? quantity : OUTBOUND_TYPES.has(input.type) ? -quantity : quantity;
      customer.inventory.transactions.unshift({ id: id('inventory-tx'), code: input.code, type: input.type, quantity, note: input.note?.trim() ?? '', createdAt: new Date().toISOString() });
      updateProject(projects, project); return project;
    },
    addProductionPlan(projectId, customerId, input) {
      const projects = list(); const project = projects.find((item) => item.id === projectId); if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');
      const customer = resolveCustomer(project, customerId); if (!customer) throw new Error('고객사를 찾을 수 없습니다.');
      customer.inventory = { ...emptyInventory(), ...(customer.inventory ?? {}) };
      customer.inventory.productionPlans.push({ id: id('production-plan'), date: input.date, itemCode: input.itemCode.trim(), plannedQuantity: requireNonNegativeQuantity(input.plannedQuantity), status: input.status ?? '계획' });
      updateProject(projects, project); return project;
    },
    addBomLine(projectId, customerId, input) {
      const projects = list(); const project = projects.find((item) => item.id === projectId); if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');
      const customer = resolveCustomer(project, customerId); if (!customer) throw new Error('고객사를 찾을 수 없습니다.');
      customer.inventory = { ...emptyInventory(), ...(customer.inventory ?? {}) };
      customer.inventory.bomLines.push({ id: id('bom-line'), parentItemCode: input.parentItemCode.trim(), componentItemCode: input.componentItemCode.trim(), quantityRequired: requireNonNegativeQuantity(input.quantityRequired), effectiveFrom: input.effectiveFrom ?? null, effectiveTo: input.effectiveTo ?? null });
      updateProject(projects, project); return project;
    },
    addSupplierOrder(projectId, customerId, input) {
      const projects = list(); const project = projects.find((item) => item.id === projectId); if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');
      const customer = resolveCustomer(project, customerId); if (!customer) throw new Error('고객사를 찾을 수 없습니다.');
      customer.inventory = { ...emptyInventory(), ...(customer.inventory ?? {}) };
      customer.inventory.supplierOrders.push({ id: input.id?.trim() || id('supplier-order'), supplierId: input.supplierId?.trim() ?? '', itemCode: input.itemCode.trim(), quantity: requireNonNegativeQuantity(input.quantity), expectedDate: input.expectedDate ?? null, status: input.status ?? '발주' });
      updateProject(projects, project); return project;
    },
    recordSupplierReceipt(projectId, customerId, input) {
      const projects = list(); const project = projects.find((item) => item.id === projectId); if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');
      const customer = resolveCustomer(project, customerId); if (!customer) throw new Error('고객사를 찾을 수 없습니다.');
      customer.inventory = { ...emptyInventory(), ...(customer.inventory ?? {}) };
      customer.inventory.supplierReceipts.unshift({ id: id('supplier-receipt'), orderId: input.orderId?.trim() ?? '', itemCode: input.itemCode.trim(), quantity: requireNonNegativeQuantity(input.quantity), receivedDate: input.receivedDate ?? new Date().toISOString().slice(0, 10), status: input.status ?? '입고' });
      updateProject(projects, project); return project;
    },
  };
}
