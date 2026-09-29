const KEY = 'new-business-preanalysis-projects';

function readStorage(storage) {
  if (storage instanceof Map) return storage.get(KEY) ?? [];
  try { return JSON.parse(storage.getItem(KEY) ?? '[]'); } catch { return []; }
}
function writeStorage(storage, projects) { if (storage instanceof Map) storage.set(KEY, projects); else storage.setItem(KEY, JSON.stringify(projects)); }
function id(prefix) { return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function migrateProject(project) {
  if (project.customers?.length) return project;
  const customer = { id: `${project.id}-customer-legacy`, companyName: project.companyName ?? '', industry: project.industry ?? '', contactStage: project.contactStage ?? 'pre-contact', materials: project.materials ?? [], results: project.results ?? [] };
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
      const customer = { id: id('customer'), companyName: input.companyName.trim(), industry: input.industry.trim(), contactStage: input.contactStage, materials: [], results: [], roi: null, poc: null };
      const project = { id: id('project'), companyName: customer.companyName, industry: customer.industry, contactStage: customer.contactStage, createdAt: now, updatedAt: now, materials: [], results: [], customers: [customer] };
      save([project, ...list()]); return project;
    },
    createCustomer(projectId, input) {
      const projects = list(); const project = projects.find((item) => item.id === projectId); if (!project) throw new Error('프로젝트를 찾을 수 없습니다.');
      const customer = { id: id('customer'), companyName: input.companyName.trim(), industry: input.industry.trim(), contactStage: input.contactStage ?? 'pre-contact', materials: [], results: [], roi: null, poc: null };
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
  };
}
