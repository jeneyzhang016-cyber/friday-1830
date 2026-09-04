const app = document.querySelector("#app");
const STORAGE_KEY = "friday1830-v3-session";
const PROFILE_KEY = "friday1830-v3-profile";
const ARCHIVE_KEY = "friday1830-v3-archive";

const roleOrder = ["pm", "engineer", "designer", "qa", "growth"];
const roles = {
  pm: {
    id: "pm", code: "PM-AI", icon: "PM", name: "AI 产品经理", color: "#007aff",
    tagline: "定义范围与成功标准", power: "决定 MVP、优先级和验收口径",
    secret: "老板真正关心的是下周路演，而不是功能数量；只要核心链路可信，他接受延期功能。",
    mission: "在 6 点研发容量内，组合一个可验证的上线范围，并带两份关键证据进入评审。"
  },
  engineer: {
    id: "engineer", code: "R&D-ALL", icon: "RD", name: "研发工程师", color: "#34c759",
    tagline: "搭建可靠的系统链路", power: "决定技术方案、降级策略和监控能力",
    secret: "引用校验服务偶发超时，客户端、后台和算法任一环节缺少监控都会让问题难以定位。",
    mission: "在 7 点工程容量内搭建上线链路，平衡核心能力、可观测性和回滚能力。"
  },
  designer: {
    id: "designer", code: "UX-01", icon: "UX", name: "UX 设计师", color: "#af52de",
    tagline: "拼出可信的用户旅程", power: "定义关键路径、异常状态和体验验收",
    secret: "用户最不能接受的不是等待，而是不知道答案来自哪里，以及错误后无路可退。",
    mission: "从五个体验节点中搭建完整旅程，排列用户实际看到的顺序并补齐异常恢复。"
  },
  qa: {
    id: "qa", code: "QA-CORE", icon: "QA", name: "测试工程师", color: "#ff9500",
    tagline: "建立质量门禁", power: "设计验证矩阵、判断发布风险和阻塞上线",
    secret: "历史事故集中在生产环境的引用错位，以及弱网下的错误恢复；常规问答反而最稳定。",
    mission: "用有限测试名额覆盖真正的高风险组合，并给出发布门禁结论。"
  },
  growth: {
    id: "growth", code: "GROWTH-01", icon: "GO", name: "增长运营", color: "#ff3b30",
    tagline: "配置增长资源与用户预期", power: "决定渠道预算、传播口径和客服准备",
    secret: "首页资源已锁定，但用户对“AI 神器”承诺非常敏感；夸大宣传会放大事故舆情。",
    mission: "分配 100 点增长预算，选择传播承诺，在拉新速度和事故缓冲之间做取舍。"
  }
};

const featureOptions = [
  { id: "answer", name: "单轮搜索问答", cost: 2, value: 9 },
  { id: "source", name: "引用来源", cost: 2, value: 9 },
  { id: "stream", name: "流式输出", cost: 2, value: 5 },
  { id: "followup", name: "多轮追问", cost: 3, value: 5 },
  { id: "personal", name: "个性化推荐", cost: 4, value: 4 }
];
const productEvidence = [
  { id: "goal", name: "业务目标", text: "核心指标是搜索成功率，不是停留时长。" },
  { id: "api", name: "接口现状", text: "同步答案已就绪，流式接口至少还需 5 天。" },
  { id: "research", name: "用户研究", text: "72% 用户会核对来源，失败后希望有重试路径。" },
  { id: "deadline", name: "老板原话", text: "路演需要可信闭环，不要求功能全部出现。" }
];
const systemModules = [
  { id: "gateway", name: "请求网关", cost: 1, desc: "统一入口与限流" },
  { id: "retrieval", name: "检索服务", cost: 2, desc: "召回候选内容" },
  { id: "ranking", name: "算法排序", cost: 2, desc: "相关性与质量排序" },
  { id: "citation", name: "引用校验", cost: 2, desc: "核对答案与来源" },
  { id: "monitor", name: "链路监控", cost: 1, desc: "错误率和延迟告警" },
  { id: "rollback", name: "降级开关", cost: 1, desc: "关闭引用而保留主链路" },
  { id: "cache", name: "客户端缓存", cost: 2, desc: "提升二次访问速度" }
];
const journeySteps = [
  { id: "query", name: "输入问题", desc: "提供示例与搜索建议" },
  { id: "loading", name: "等待反馈", desc: "展示进度与可取消状态" },
  { id: "answer", name: "阅读答案", desc: "建立清晰信息层级" },
  { id: "sources", name: "核对来源", desc: "查看引用片段与出处" },
  { id: "recovery", name: "失败恢复", desc: "重试、反馈或切回普通搜索" }
];
const qaRows = [
  { id: "answer", name: "基础问答" },
  { id: "source", name: "引用一致性" },
  { id: "fallback", name: "异常降级" }
];
const qaCols = [
  { id: "dev", name: "测试环境" },
  { id: "prod", name: "生产灰度" },
  { id: "weak", name: "弱网设备" }
];
const growthChannels = [
  { id: "homepage", name: "首页资源" },
  { id: "content", name: "内容种草" },
  { id: "community", name: "社群体验" },
  { id: "reserve", name: "客服与应急" }
];
const growthMessages = [
  { id: "trust", name: "每个答案，都有出处", desc: "可信承诺" },
  { id: "magic", name: "全网最懂你的 AI 搜索", desc: "高风险承诺" },
  { id: "speed", name: "三秒找到关键信息", desc: "速度承诺" }
];

function newProject() {
  const serial = Math.random().toString(36).slice(2, 7).toUpperCase();
  return {
    version: 3,
    id: `HX-${serial}`,
    title: "AI 搜索紧急上线",
    episode: "SEASON 01 · PROJECT 01",
    status: "active",
    completedRoles: [],
    contributors: {},
    metrics: { value: 42, quality: 38, speed: 56, trust: 50, risk: 68, budget: 100 },
    decisions: {},
    artifacts: [],
    timeline: [{ time: "MON 09:30", role: "导演组", text: "王总要求本周完成 AI 搜索灰度上线。" }],
    createdAt: Date.now()
  };
}

function blankDrafts() {
  return {
    pm: { features: [], evidence: [] },
    engineer: { modules: [] },
    designer: { flow: [] },
    qa: { cells: [], gate: "gray" },
    growth: { homepage: 30, content: 25, community: 20, reserve: 25, message: "trust" }
  };
}

function blankState() {
  return {
    version: 3,
    screen: "landing",
    name: localStorage.getItem(PROFILE_KEY) || "",
    selectedRole: null,
    project: null,
    drafts: blankDrafts(),
    shareVisible: false,
    toast: ""
  };
}

let state = blankState();
let savedSession = loadSavedSession();

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" })[character]);
}
function clamp(value) { return Math.max(0, Math.min(100, Math.round(value))); }
function currentRole() { return roles[state.selectedRole] || roles.pm; }
function saveSession() {
  if (!state.project) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, toast: "", shareVisible: false }));
  savedSession = JSON.parse(localStorage.getItem(STORAGE_KEY));
}
function loadSavedSession() {
  try {
    const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return cached?.project ? cached : null;
  } catch { return null; }
}
function loadArchive() {
  try { return JSON.parse(localStorage.getItem(ARCHIVE_KEY) || "[]"); }
  catch { return []; }
}
function saveArchive(project) {
  const archive = loadArchive().filter(item => item.id !== project.id);
  archive.unshift({ id: project.id, title: project.title, score: projectScore(project), roles: project.completedRoles.length, ending: projectEnding(project).title, at: Date.now() });
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive.slice(0, 6)));
}
function toast(message) {
  state.toast = message;
  render();
  window.setTimeout(() => { state.toast = ""; render(); }, 1800);
}
function arrow() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8"/></svg>`;
}
function roleDone(id) { return Boolean(state.project?.completedRoles.includes(id)); }
function applyProjectEffects(effects) {
  Object.entries(effects).forEach(([key, value]) => {
    state.project.metrics[key] = clamp((state.project.metrics[key] || 0) + value);
  });
}
function projectScore(project = state.project) {
  const metrics = project.metrics;
  return clamp(metrics.value * 0.24 + metrics.quality * 0.28 + metrics.speed * 0.16 + metrics.trust * 0.2 + (100 - metrics.risk) * 0.12);
}
function projectEnding(project = state.project) {
  const score = projectScore(project);
  const metrics = project.metrics;
  if (project.completedRoles.length === 5 && score >= 78) return { grade: "S", title: "全员心动项目组", text: "五个岗位补全了彼此的盲区，项目不仅上线，还留下了可复制的方法。" };
  if (metrics.risk >= 70) return { grade: "D", title: "热搜上的上线事故", text: "项目跑得很快，但隐藏风险最终替团队做了决定。" };
  if (metrics.quality >= 70 && metrics.trust >= 62) return { grade: "A", title: "可信灰度上线", text: "你们没有追求一次性完美，而是建立了用户愿意相信的第一版。" };
  if (metrics.speed >= 75 && metrics.quality < 55) return { grade: "C", title: "准时，但需要返工", text: "Deadline 被守住了，下一周却要为本周省掉的工作补课。" };
  return { grade: "B", title: "带着分歧继续上线", text: "项目暂时向前，但仍需要更多岗位加入，才能看清完整代价。" };
}

function normalizeProject(project) {
  const fresh = newProject();
  return {
    ...fresh,
    ...project,
    completedRoles: Array.isArray(project.completedRoles) ? project.completedRoles.filter(id => roles[id]) : [],
    contributors: project.contributors || {},
    metrics: { ...fresh.metrics, ...(project.metrics || {}) },
    decisions: project.decisions || {},
    artifacts: Array.isArray(project.artifacts) ? project.artifacts : [],
    timeline: Array.isArray(project.timeline) ? project.timeline : fresh.timeline
  };
}
function encodeProject(project) {
  const payload = JSON.stringify({ v: 3, project });
  const bytes = new TextEncoder().encode(payload);
  let binary = "";
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function decodeProject(code) {
  try {
    const normalized = code.trim().replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    const data = JSON.parse(new TextDecoder().decode(bytes));
    if (data.v !== 3 || !data.project?.id) throw new Error("invalid");
    return normalizeProject(data.project);
  } catch { return null; }
}
function handoffURL() {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("handoff", encodeProject(state.project));
  return url.toString();
}
function copyText(text, success) {
  navigator.clipboard?.writeText(text).then(() => toast(success)).catch(() => toast("复制失败，请长按文本手动复制"));
}

function metricCards(project = state.project) {
  const items = [
    ["用户价值", project.metrics.value, "value"],
    ["交付质量", project.metrics.quality, "quality"],
    ["推进速度", project.metrics.speed, "speed"],
    ["团队信任", project.metrics.trust, "trust"],
    ["项目风险", project.metrics.risk, "risk"]
  ];
  return `<div class="metric-grid">${items.map(([label, value, type]) => `<div class="metric-card ${type === "risk" ? "risk" : ""}"><span>${label}</span><strong>${value}</strong><i><b style="width:${value}%"></b></i></div>`).join("")}</div>`;
}
function projectHeader() {
  const role = state.selectedRole ? currentRole() : null;
  return `<header class="project-header"><div class="project-brand"><i></i><div><strong>心动科技 · ${escapeHTML(state.project.id)}</strong><small>${escapeHTML(state.project.title)}</small></div></div><div class="header-center"><span>${state.project.completedRoles.length}/5 岗位已交接</span><i><b style="width:${state.project.completedRoles.length * 20}%"></b></i></div><div class="header-buttons"><button class="text-button" id="open-room">项目室</button>${role ? `<button class="role-pill" id="change-seat" style="--role-color:${role.color}">${role.icon} ${role.name}</button>` : ""}</div></header>`;
}
function seatStrip() {
  return `<div class="seat-strip">${roleOrder.map(id => {
    const role = roles[id];
    const done = roleDone(id);
    return `<div class="seat-mini ${done ? "done" : ""}" style="--role-color:${role.color}"><i>${done ? "✓" : role.icon}</i><span>${role.name}</span></div>`;
  }).join("")}</div>`;
}

function renderLanding() {
  const archive = loadArchive();
  const resumable = savedSession?.project?.status === "active";
  return `<section class="screen landing-screen"><div class="landing-hero"><div class="eyebrow">AI 职场真人秀 · 多岗位接力副本</div><h1>周五<br><span>18:30</span></h1><p>一个项目，五种视角。你可以独自补全整个团队，也可以把项目交给朋友继续。</p><div class="landing-tags"><span>岗位独占情报</span><span>操作型工作台</span><span>项目交接码</span><span>团队结局</span></div><div class="episode-card"><span>本周项目</span><strong>AI 搜索紧急上线</strong><p>范围、系统、体验、质量和增长，缺少任何一个岗位都会留下盲区。</p></div></div><aside class="landing-panel"><div class="live-chip"><i></i> DIRECTOR ENGINE V3</div><h2>创建你的项目组</h2><label class="field-label" for="player-name">你的署名</label><input class="ios-input" id="player-name" maxlength="12" placeholder="输入名字" value="${escapeHTML(state.name)}"><button class="button primary" id="new-project">创建新项目 ${arrow()}</button>${resumable ? `<button class="resume-card" id="resume-project"><span><b>继续项目 ${escapeHTML(savedSession.project.id)}</b><small>${savedSession.project.completedRoles.length}/5 岗位已完成</small></span><em>继续</em></button>` : ""}<div class="divider"><span>或者接手别人的项目</span></div><textarea class="code-input" id="handoff-input" placeholder="粘贴项目交接码或完整交接链接"></textarea><button class="button secondary" id="import-project">导入项目交接码</button>${archive.length ? `<div class="archive-mini"><span>我的项目档案</span>${archive.slice(0, 3).map(item => `<p><b>${item.ending}</b><small>${item.roles}/5 岗位 · ${item.score} 分</small></p>`).join("")}</div>` : ""}</aside></section>`;
}

function renderCasting() {
  const available = roleOrder.filter(id => !roleDone(id));
  const selected = state.selectedRole && !roleDone(state.selectedRole) ? currentRole() : roles[available[0] || "pm"];
  if (!state.selectedRole || roleDone(state.selectedRole)) state.selectedRole = selected.id;
  return `<section class="screen casting-screen">${projectHeader()}<main class="casting-wrap"><div class="casting-copy"><div class="eyebrow">${escapeHTML(state.project.episode)}</div><h1>这一次，<br>你坐哪一边？</h1><p>每个岗位只掌握部分真相。完成工作台后，项目状态会留给下一位队友。</p><label class="field-label" for="casting-name">本次贡献者署名</label><input class="ios-input small" id="casting-name" maxlength="12" value="${escapeHTML(state.name)}"></div><div class="casting-content"><div class="section-title"><div><span>01</span><h2>选择未完成岗位</h2></div><strong>${state.project.completedRoles.length}/5 已交接</strong></div><div class="role-grid" role="group" aria-label="选择项目岗位">${roleOrder.map(id => {
    const role = roles[id];
    const done = roleDone(id);
    const active = selected.id === id;
    return `<button class="role-seat ${active ? "selected" : ""} ${done ? "completed" : ""}" data-role="${id}" ${done ? "disabled" : ""} style="--role-color:${role.color}"><i>${done ? "✓" : role.icon}</i><span><b>${role.name}</b><small>${done ? `${escapeHTML(state.project.contributors[id] || "队友")} 已交接` : role.tagline}</small></span><em>${done ? "完成" : active ? "当前" : "选择"}</em></button>`;
  }).join("")}</div><article class="role-detail" style="--role-color:${selected.color}"><div class="role-detail-top"><i>${selected.icon}</i><span>${selected.code}</span></div><h2>${selected.name}</h2><p>${selected.power}</p><div class="role-secret"><span>入场后解锁</span><strong>一条只有该岗位知道的隐藏情报</strong></div><button class="button dark" id="enter-workbench">进入${selected.name}工作台 ${arrow()}</button></article></div></main>${seatStrip()}</section>`;
}

function workbenchShell(content) {
  const role = currentRole();
  return `<section class="screen workbench-screen">${projectHeader()}<main class="workbench-wrap"><div class="workbench-hero"><div><span class="role-icon-large" style="--role-color:${role.color}">${role.icon}</span><div class="eyebrow">${role.code} · 专属工作台</div><h1>${role.name}</h1><p>${role.mission}</p></div><aside class="classified"><span>独占情报</span><p>${role.secret}</p></aside></div>${content}</main></section>`;
}

function renderPMWorkbench() {
  const draft = state.drafts.pm;
  const cost = draft.features.reduce((sum, id) => sum + featureOptions.find(item => item.id === id).cost, 0);
  return workbenchShell(`<div class="workspace-grid"><section class="workspace-card"><div class="section-title"><div><span>01</span><h2>拼装 MVP</h2></div><strong class="${cost > 6 ? "danger-text" : ""}">${cost}/6 容量</strong></div><div class="feature-grid">${featureOptions.map(item => `<button class="select-tile ${draft.features.includes(item.id) ? "selected" : ""}" data-pm-feature="${item.id}"><span>成本 ${item.cost}</span><b>${item.name}</b><small>用户价值 ${item.value}</small></button>`).join("")}</div></section><section class="workspace-card"><div class="section-title"><div><span>02</span><h2>锁定评审证据</h2></div><strong>${draft.evidence.length}/2</strong></div><div class="evidence-list">${productEvidence.map(item => `<button class="evidence-row ${draft.evidence.includes(item.id) ? "selected" : ""}" data-pm-evidence="${item.id}"><b>${item.name}</b><p>${item.text}</p></button>`).join("")}</div></section></div><div class="submit-dock"><div><span>交付物</span><strong>《MVP 范围与评审依据》</strong></div><button class="button primary" id="submit-role">提交产品交接</button></div>`);
}

function renderEngineerWorkbench() {
  const draft = state.drafts.engineer;
  const cost = draft.modules.reduce((sum, id) => sum + systemModules.find(item => item.id === id).cost, 0);
  return workbenchShell(`<section class="workspace-card system-builder"><div class="section-title"><div><span>01</span><h2>搭建上线链路</h2></div><strong class="${cost > 7 ? "danger-text" : ""}">${cost}/7 工程点</strong></div><div class="system-canvas"><div class="system-line"></div>${draft.modules.length ? draft.modules.map((id, index) => { const item = systemModules.find(module => module.id === id); return `<div class="system-node"><i>${index + 1}</i><b>${item.name}</b><small>${item.desc}</small><button data-remove-module="${id}" aria-label="移除 ${item.name}">×</button></div>`; }).join("") : `<div class="empty-canvas">从下方选择模块，搭建真实上线链路</div>`}</div><div class="module-palette">${systemModules.map(item => `<button class="module-chip ${draft.modules.includes(item.id) ? "selected" : ""}" data-module="${item.id}" ${draft.modules.includes(item.id) ? "disabled" : ""}><span>${item.cost} 点</span><b>${item.name}</b><small>${item.desc}</small></button>`).join("")}</div></section><div class="submit-dock"><div><span>交付物</span><strong>《系统链路与降级方案》</strong></div><button class="button primary" id="submit-role">提交研发交接</button></div>`);
}

function renderDesignerWorkbench() {
  const flow = state.drafts.designer.flow;
  return workbenchShell(`<div class="workspace-grid designer-grid"><section class="workspace-card"><div class="section-title"><div><span>01</span><h2>待编排体验节点</h2></div><strong>${flow.length}/5</strong></div><div class="journey-palette">${journeySteps.map(step => `<button class="journey-source ${flow.includes(step.id) ? "used" : ""}" data-journey-add="${step.id}" ${flow.includes(step.id) ? "disabled" : ""}><b>${step.name}</b><small>${step.desc}</small><span>加入流程</span></button>`).join("")}</div></section><section class="workspace-card"><div class="section-title"><div><span>02</span><h2>用户实际旅程</h2></div><strong>可调整顺序</strong></div><div class="journey-flow">${flow.length ? flow.map((id, index) => { const step = journeySteps.find(item => item.id === id); return `<div class="journey-step"><i>${index + 1}</i><span><b>${step.name}</b><small>${step.desc}</small></span><div><button data-flow-move="up" data-flow-id="${id}" ${index === 0 ? "disabled" : ""}>↑</button><button data-flow-move="down" data-flow-id="${id}" ${index === flow.length - 1 ? "disabled" : ""}>↓</button><button data-flow-remove="${id}">×</button></div></div>`; }).join("") : `<div class="empty-canvas">流程还是空的，用户无路可走</div>`}</div></section></div><div class="submit-dock"><div><span>交付物</span><strong>《可信搜索用户旅程》</strong></div><button class="button primary" id="submit-role">提交设计交接</button></div>`);
}

function renderQAWorkbench() {
  const draft = state.drafts.qa;
  return workbenchShell(`<div class="workspace-grid qa-layout"><section class="workspace-card"><div class="section-title"><div><span>01</span><h2>测试矩阵</h2></div><strong>${draft.cells.length}/6 名额</strong></div><div class="qa-matrix"><div></div>${qaCols.map(col => `<b>${col.name}</b>`).join("")}${qaRows.map(row => `<span>${row.name}</span>${qaCols.map(col => { const id = `${row.id}-${col.id}`; return `<button class="qa-cell ${draft.cells.includes(id) ? "selected" : ""}" data-qa-cell="${id}" aria-label="${row.name} ${col.name}">${draft.cells.includes(id) ? "✓" : "+"}</button>`; }).join("")}`).join("")}</div></section><section class="workspace-card"><div class="section-title"><div><span>02</span><h2>发布门禁</h2></div></div><div class="gate-options">${[["block","阻塞上线","风险未澄清前不发布"],["gray","小流量灰度","控制影响并继续验证"],["full","全量发布","直接承接全部流量"]].map(([id,name,desc]) => `<button class="gate-option ${draft.gate === id ? "selected" : ""}" data-gate="${id}"><b>${name}</b><small>${desc}</small></button>`).join("")}</div></section></div><div class="submit-dock"><div><span>交付物</span><strong>《质量门禁与灰度建议》</strong></div><button class="button primary" id="submit-role">提交测试交接</button></div>`);
}

function renderGrowthWorkbench() {
  const draft = state.drafts.growth;
  const total = growthChannels.reduce((sum, channel) => sum + draft[channel.id], 0);
  return workbenchShell(`<div class="workspace-grid growth-layout"><section class="workspace-card"><div class="section-title"><div><span>01</span><h2>分配增长预算</h2></div><strong class="${total !== 100 ? "danger-text" : ""}">${total}/100</strong></div><div class="budget-list">${growthChannels.map(channel => `<div class="budget-row"><span><b>${channel.name}</b><small>${channel.id === "reserve" ? "事故缓冲与客服准备" : "获取用户与反馈"}</small></span><div><button data-budget="${channel.id}" data-delta="-5">−</button><strong>${draft[channel.id]}</strong><button data-budget="${channel.id}" data-delta="5">＋</button></div></div>`).join("")}</div></section><section class="workspace-card"><div class="section-title"><div><span>02</span><h2>选择传播承诺</h2></div></div><div class="message-options">${growthMessages.map(message => `<button class="message-card ${draft.message === message.id ? "selected" : ""}" data-message="${message.id}"><span>${message.desc}</span><b>${message.name}</b></button>`).join("")}</div></section></div><div class="submit-dock"><div><span>交付物</span><strong>《首发节奏与用户承诺》</strong></div><button class="button primary" id="submit-role">提交运营交接</button></div>`);
}

function renderWorkbench() {
  return ({ pm: renderPMWorkbench, engineer: renderEngineerWorkbench, designer: renderDesignerWorkbench, qa: renderQAWorkbench, growth: renderGrowthWorkbench })[state.selectedRole]();
}

function renderRoom() {
  const code = encodeProject(state.project);
  const available = roleOrder.filter(id => !roleDone(id));
  return `<section class="screen room-screen">${projectHeader()}<main class="room-wrap"><div class="room-hero"><div><div class="eyebrow">LIVE PROJECT ROOM</div><h1>${escapeHTML(state.project.title)}</h1><p>每位队友的交付都在改变同一个项目。完成至少 3 个岗位即可形成团队结局，集齐 5 个岗位可解锁完整真相。</p></div><div class="project-score"><span>当前项目分</span><strong>${projectScore()}</strong><small>${state.project.completedRoles.length}/5 岗位完成</small></div></div>${metricCards()}<div class="room-grid"><section class="room-panel"><div class="section-title"><div><span>01</span><h2>项目组席位</h2></div></div><div class="team-seats">${roleOrder.map(id => { const role = roles[id]; const done = roleDone(id); return `<button class="team-seat ${done ? "done" : ""}" data-room-role="${id}" ${done ? "disabled" : ""} style="--role-color:${role.color}"><i>${done ? "✓" : role.icon}</i><span><b>${role.name}</b><small>${done ? `${escapeHTML(state.project.contributors[id] || "匿名队友")} · 已交付` : "等待接力"}</small></span><em>${done ? "完成" : "接管"}</em></button>`; }).join("")}</div></section><section class="room-panel"><div class="section-title"><div><span>02</span><h2>项目时间线</h2></div></div><div class="timeline">${state.project.timeline.slice().reverse().map(item => `<div><span>${item.time}</span><p><b>${item.role}</b>${item.text}</p></div>`).join("")}</div></section></div><section class="artifact-panel"><div class="section-title"><div><span>03</span><h2>团队交付物</h2></div><strong>${state.project.artifacts.length} 份</strong></div>${state.project.artifacts.length ? `<div class="artifact-grid">${state.project.artifacts.map(item => `<article style="--role-color:${roles[item.role].color}"><i>${roles[item.role].icon}</i><span><b>${item.title}</b><small>${item.summary}</small></span></article>`).join("")}</div>` : `<div class="empty-artifacts">还没有交付物。选择一个岗位，让项目真正开始。</div>`}</section><div class="room-actions"><button class="button secondary" id="show-handoff">${state.shareVisible ? "收起交接码" : "生成项目交接码"}</button><button class="button dark" id="finalize-project" ${state.project.completedRoles.length < 3 ? "disabled" : ""}>生成团队结局 ${arrow()}</button></div>${state.shareVisible ? `<section class="handoff-panel"><div><span>项目交接</span><h2>把下一棒交给朋友</h2><p>对方打开链接后，可选择尚未完成的岗位继续同一个项目。</p></div><textarea readonly id="handoff-code">${code}</textarea><div><button class="button secondary" id="copy-code">复制交接码</button><button class="button primary" id="copy-link">复制接力链接</button></div></section>` : ""}${available.length && state.project.completedRoles.length < 3 ? `<div class="room-tip">还需完成 ${3 - state.project.completedRoles.length} 个岗位，才能生成团队结局。</div>` : ""}</main></section>`;
}

function renderResult() {
  const ending = projectEnding();
  return `<section class="screen result-screen"><div class="result-wrap"><header class="result-top"><div class="project-brand"><i></i><div><strong>心动科技 · 项目正片</strong><small>${escapeHTML(state.project.id)}</small></div></div><span>${escapeHTML(state.project.episode)}</span></header><div class="result-grid"><article class="team-result-card"><div class="eyebrow">TEAM PROJECT REPORT</div><div class="result-grade">${ending.grade}</div><h1>${ending.title}</h1><p>${ending.text}</p><div class="score-line"><strong>${projectScore()}</strong><span>项目综合分</span></div>${metricCards()}<div class="contributors"><span>本期项目组</span><div>${state.project.completedRoles.map(id => `<i style="--role-color:${roles[id].color}" title="${roles[id].name}">${roles[id].icon}</i>`).join("")}</div></div></article><div class="result-story"><div class="eyebrow">PROJECT HIGHLIGHT REEL</div><h2>这不是一个人的<br>Offer。</h2><div class="result-timeline">${state.project.timeline.slice(1).map((item, index) => `<article><span>0${index + 1}</span><div><b>${item.role}</b><p>${item.text}</p></div></article>`).join("")}</div><div class="ending-note"><span>导演观察</span><p>${state.project.completedRoles.length === 5 ? "你看见了五个岗位掌握的完整真相。原来很多冲突不是谁不专业，而是每个人都只看见局部。" : `还有 ${5 - state.project.completedRoles.length} 个岗位的隐藏信息尚未解锁。换一组队友，项目可能走向完全不同的结局。`}</p></div><div class="result-actions"><button class="button secondary" id="copy-result">复制团队战报</button><button class="button secondary" id="continue-project">补完其他岗位</button><button class="button primary" id="new-project-result">创建新项目</button></div><div class="next-episode"><span>NEXT PROJECT</span><b>第二周：第一次绩效沟通</b><p>项目成功了，但每个人对“谁贡献最大”有不同答案。</p></div></div></div></div></section>`;
}

function validateRoleSubmission() {
  if (state.selectedRole === "pm") {
    const draft = state.drafts.pm;
    const cost = draft.features.reduce((sum, id) => sum + featureOptions.find(item => item.id === id).cost, 0);
    if (draft.features.length < 2 || cost > 6 || draft.evidence.length !== 2) return "请选择至少 2 个功能、恰好 2 份证据，并控制在 6 点容量内";
  }
  if (state.selectedRole === "engineer") {
    const draft = state.drafts.engineer;
    const cost = draft.modules.reduce((sum, id) => sum + systemModules.find(item => item.id === id).cost, 0);
    if (draft.modules.length < 3 || cost > 7) return "请搭建至少 3 个模块，并控制在 7 点工程容量内";
  }
  if (state.selectedRole === "designer" && state.drafts.designer.flow.length < 4) return "请至少编排 4 个用户旅程节点";
  if (state.selectedRole === "qa" && state.drafts.qa.cells.length < 4) return "请至少覆盖 4 个测试组合";
  if (state.selectedRole === "growth") {
    const total = growthChannels.reduce((sum, channel) => sum + state.drafts.growth[channel.id], 0);
    if (total !== 100) return "增长预算必须恰好分配 100 点";
  }
  return "";
}

function roleOutcome() {
  const roleId = state.selectedRole;
  if (roleId === "pm") {
    const draft = state.drafts.pm;
    const core = draft.features.includes("answer") && draft.features.includes("source");
    const grounded = draft.evidence.includes("api") || draft.evidence.includes("research");
    return {
      effects: core && grounded ? { value: 15, speed: 8, trust: 5, risk: -10 } : { value: 8, speed: -5, trust: -3, risk: 9 },
      title: "《MVP 范围与评审依据》",
      summary: core ? "单轮问答与引用来源构成最小可信闭环" : "范围仍保留较多想象空间",
      timeline: core ? "砍出可信 MVP，并用证据冻结上线范围。" : "提交了高价值但边界模糊的产品范围。",
      decision: { features: draft.features, evidence: draft.evidence }
    };
  }
  if (roleId === "engineer") {
    const modules = state.drafts.engineer.modules;
    const safe = modules.includes("citation") && modules.includes("monitor") && modules.includes("rollback");
    const core = modules.includes("gateway") && (modules.includes("retrieval") || modules.includes("ranking"));
    return {
      effects: safe && core ? { quality: 17, speed: 4, trust: 5, risk: -18 } : { quality: 8, speed: 8, trust: -2, risk: 12 },
      title: "《系统链路与降级方案》",
      summary: safe ? "引用校验、监控与降级形成安全闭环" : "链路可以运行，但故障发现或退出能力不足",
      timeline: safe ? "补齐监控和降级开关，避免单点故障拖垮主链路。" : "优先跑通链路，把部分稳定性工作留到上线后。",
      decision: { modules }
    };
  }
  if (roleId === "designer") {
    const flow = state.drafts.designer.flow;
    const complete = flow[0] === "query" && flow.includes("answer") && flow.includes("sources") && flow.includes("recovery");
    return {
      effects: complete ? { value: 14, quality: 10, trust: 12, risk: -8 } : { value: 7, quality: 3, trust: -5, risk: 8 },
      title: "《可信搜索用户旅程》",
      summary: complete ? "从提问、答案到来源核验和失败恢复形成完整路径" : "主流程可用，但用户在关键节点可能失去方向",
      timeline: complete ? "把来源核验和失败恢复放进主旅程。" : "完成主流程设计，但异常路径仍不完整。",
      decision: { flow }
    };
  }
  if (roleId === "qa") {
    const draft = state.drafts.qa;
    const critical = ["source-prod", "source-weak", "fallback-prod", "fallback-weak"].filter(id => draft.cells.includes(id)).length;
    const safeGate = draft.gate === "gray" || draft.gate === "block";
    return {
      effects: critical >= 3 && safeGate ? { quality: 18, speed: draft.gate === "block" ? -8 : -2, trust: 7, risk: -20 } : { quality: 5, speed: 9, trust: -5, risk: 16 },
      title: "《质量门禁与灰度建议》",
      summary: critical >= 3 ? `覆盖 ${critical}/4 个高风险组合，建议${draft.gate === "gray" ? "小流量灰度" : draft.gate === "block" ? "阻塞上线" : "全量发布"}` : "测试名额主要消耗在低风险场景",
      timeline: critical >= 3 ? "用有限名额覆盖引用错位与弱网降级，并设置发布门禁。" : "完成常规验证，但高风险组合覆盖不足。",
      decision: { cells: draft.cells, gate: draft.gate }
    };
  }
  const draft = state.drafts.growth;
  const responsible = draft.message === "trust" && draft.reserve >= 20;
  return {
    effects: responsible ? { value: 13, speed: 6, trust: 14, risk: -12, budget: -8 } : { value: 16, speed: 12, trust: -10, risk: 15, budget: -5 },
    title: "《首发节奏与用户承诺》",
    summary: responsible ? "传播承诺与当前能力一致，并预留客服和应急资源" : "传播速度很快，但承诺可能超过产品真实能力",
    timeline: responsible ? "以“每个答案都有出处”为核心承诺，并保留应急资源。" : "用强势传播抢占注意力，同时放大了兑现压力。",
    decision: { ...draft }
  };
}

function submitRole() {
  const error = validateRoleSubmission();
  if (error) return toast(error);
  if (roleDone(state.selectedRole)) return toast("该岗位已经完成交接");
  const outcome = roleOutcome();
  applyProjectEffects(outcome.effects);
  state.project.completedRoles.push(state.selectedRole);
  state.project.contributors[state.selectedRole] = state.name || "匿名队友";
  state.project.decisions[state.selectedRole] = outcome.decision;
  state.project.artifacts.push({ role: state.selectedRole, title: outcome.title, summary: outcome.summary });
  state.project.timeline.push({ time: `ROLE ${String(state.project.completedRoles.length).padStart(2, "0")}`, role: currentRole().name, text: outcome.timeline });
  state.project.metrics.budget = clamp(state.project.metrics.budget - 4);
  state.screen = "room";
  state.shareVisible = false;
  saveSession();
  render();
}

function startNewProject() {
  const input = document.querySelector("#player-name");
  state = blankState();
  state.name = input?.value.trim() || "匿名队友";
  localStorage.setItem(PROFILE_KEY, state.name);
  state.project = newProject();
  state.screen = "casting";
  state.selectedRole = "pm";
  saveSession();
  render();
}
function importProject(raw) {
  const code = raw.includes("handoff=") ? new URL(raw).searchParams.get("handoff") : raw.trim();
  const project = decodeProject(code || "");
  if (!project) return toast("交接码无法识别，请确认复制完整");
  state = blankState();
  state.name = document.querySelector("#player-name")?.value.trim() || state.name || "接力队友";
  localStorage.setItem(PROFILE_KEY, state.name);
  state.project = project;
  state.screen = "casting";
  state.selectedRole = roleOrder.find(id => !project.completedRoles.includes(id)) || "pm";
  saveSession();
  history.replaceState({}, "", location.pathname);
  render();
}
function finalizeProject() {
  if (state.project.completedRoles.length < 3) return toast("至少完成 3 个岗位才能生成团队结局");
  state.project.status = "completed";
  state.screen = "result";
  saveArchive(state.project);
  saveSession();
  render();
}
function startAnotherProject() {
  const name = state.name;
  state = blankState();
  state.name = name;
  state.project = newProject();
  state.screen = "casting";
  state.selectedRole = "pm";
  saveSession();
  render();
}

function bindEvents() {
  document.querySelector("#player-name")?.addEventListener("input", event => { state.name = event.target.value; });
  document.querySelector("#new-project")?.addEventListener("click", startNewProject);
  document.querySelector("#resume-project")?.addEventListener("click", () => {
    if (!savedSession?.project) return;
    state = { ...blankState(), ...savedSession, project: normalizeProject(savedSession.project), drafts: { ...blankDrafts(), ...(savedSession.drafts || {}) } };
    if (state.project.status === "completed") state.screen = "result";
    render();
  });
  document.querySelector("#import-project")?.addEventListener("click", () => importProject(document.querySelector("#handoff-input")?.value || ""));
  document.querySelector("#casting-name")?.addEventListener("input", event => { state.name = event.target.value; localStorage.setItem(PROFILE_KEY, state.name); });
  document.querySelectorAll("[data-role]").forEach(button => button.addEventListener("click", () => { state.selectedRole = button.dataset.role; render(); }));
  document.querySelector("#enter-workbench")?.addEventListener("click", () => { state.screen = "workbench"; saveSession(); render(); });
  document.querySelector("#open-room")?.addEventListener("click", () => { state.screen = "room"; saveSession(); render(); });
  document.querySelector("#change-seat")?.addEventListener("click", () => { state.screen = "casting"; state.selectedRole = roleOrder.find(id => !roleDone(id)) || state.selectedRole; saveSession(); render(); });

  document.querySelectorAll("[data-pm-feature]").forEach(button => button.addEventListener("click", () => {
    const id = button.dataset.pmFeature;
    const list = state.drafts.pm.features;
    state.drafts.pm.features = list.includes(id) ? list.filter(item => item !== id) : [...list, id];
    render();
  }));
  document.querySelectorAll("[data-pm-evidence]").forEach(button => button.addEventListener("click", () => {
    const id = button.dataset.pmEvidence;
    const list = state.drafts.pm.evidence;
    if (!list.includes(id) && list.length >= 2) return toast("最多选择两份评审证据");
    state.drafts.pm.evidence = list.includes(id) ? list.filter(item => item !== id) : [...list, id];
    render();
  }));
  document.querySelectorAll("[data-module]").forEach(button => button.addEventListener("click", () => { state.drafts.engineer.modules.push(button.dataset.module); render(); }));
  document.querySelectorAll("[data-remove-module]").forEach(button => button.addEventListener("click", () => { state.drafts.engineer.modules = state.drafts.engineer.modules.filter(id => id !== button.dataset.removeModule); render(); }));
  document.querySelectorAll("[data-journey-add]").forEach(button => button.addEventListener("click", () => { state.drafts.designer.flow.push(button.dataset.journeyAdd); render(); }));
  document.querySelectorAll("[data-flow-remove]").forEach(button => button.addEventListener("click", () => { state.drafts.designer.flow = state.drafts.designer.flow.filter(id => id !== button.dataset.flowRemove); render(); }));
  document.querySelectorAll("[data-flow-move]").forEach(button => button.addEventListener("click", () => {
    const flow = state.drafts.designer.flow;
    const index = flow.indexOf(button.dataset.flowId);
    const next = button.dataset.flowMove === "up" ? index - 1 : index + 1;
    if (index < 0 || next < 0 || next >= flow.length) return;
    [flow[index], flow[next]] = [flow[next], flow[index]];
    render();
  }));
  document.querySelectorAll("[data-qa-cell]").forEach(button => button.addEventListener("click", () => {
    const id = button.dataset.qaCell;
    const cells = state.drafts.qa.cells;
    if (!cells.includes(id) && cells.length >= 6) return toast("本轮只有 6 个测试名额");
    state.drafts.qa.cells = cells.includes(id) ? cells.filter(item => item !== id) : [...cells, id];
    render();
  }));
  document.querySelectorAll("[data-gate]").forEach(button => button.addEventListener("click", () => { state.drafts.qa.gate = button.dataset.gate; render(); }));
  document.querySelectorAll("[data-budget]").forEach(button => button.addEventListener("click", () => {
    const key = button.dataset.budget;
    state.drafts.growth[key] = clamp(state.drafts.growth[key] + Number(button.dataset.delta));
    render();
  }));
  document.querySelectorAll("[data-message]").forEach(button => button.addEventListener("click", () => { state.drafts.growth.message = button.dataset.message; render(); }));
  document.querySelector("#submit-role")?.addEventListener("click", submitRole);

  document.querySelectorAll("[data-room-role]").forEach(button => button.addEventListener("click", () => { state.selectedRole = button.dataset.roomRole; state.screen = "workbench"; saveSession(); render(); }));
  document.querySelector("#show-handoff")?.addEventListener("click", () => { state.shareVisible = !state.shareVisible; render(); });
  document.querySelector("#copy-code")?.addEventListener("click", () => copyText(encodeProject(state.project), "项目交接码已复制"));
  document.querySelector("#copy-link")?.addEventListener("click", () => copyText(handoffURL(), "接力链接已复制"));
  document.querySelector("#finalize-project")?.addEventListener("click", finalizeProject);
  document.querySelector("#copy-result")?.addEventListener("click", () => {
    const ending = projectEnding();
    const text = `我们在《周五18:30》完成了 ${state.project.completedRoles.length}/5 个岗位接力，获得 ${ending.grade} 级团队结局：${ending.title}。项目综合分 ${projectScore()}。\n${state.project.timeline.slice(1).map(item => `- ${item.role}：${item.text}`).join("\n")}\n#IP副本计划 #互联网项目组`;
    copyText(text, "团队战报已复制");
  });
  document.querySelector("#continue-project")?.addEventListener("click", () => {
    state.project.status = "active";
    state.screen = "casting";
    state.selectedRole = roleOrder.find(id => !roleDone(id)) || "pm";
    saveSession();
    render();
  });
  document.querySelector("#new-project-result")?.addEventListener("click", startAnotherProject);
}

function render() {
  const screens = { landing: renderLanding, casting: renderCasting, workbench: renderWorkbench, room: renderRoom, result: renderResult };
  app.innerHTML = `<div class="app-shell">${screens[state.screen]()}${state.toast ? `<div class="toast" role="status">${escapeHTML(state.toast)}</div>` : ""}</div>`;
  bindEvents();
  window.scrollTo({ top: 0, behavior: "instant" });
}

const incomingCode = new URLSearchParams(location.search).get("handoff");
if (incomingCode) {
  const project = decodeProject(incomingCode);
  if (project) {
    state.project = project;
    state.screen = "casting";
    state.selectedRole = roleOrder.find(id => !project.completedRoles.includes(id)) || "pm";
    saveSession();
    history.replaceState({}, "", location.pathname);
  }
}
render();
