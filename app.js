const app = document.querySelector("#app");
const STORAGE_KEY = "friday1830-v2";

const labels = {
  professional: "专业判断",
  communication: "表达说服",
  execution: "推进能力",
  collaboration: "团队协作",
  resilience: "危机处理",
  stability: "边界感",
  bossTrust: "老板信任",
  colleagueFavor: "同事支持",
  energy: "心力值",
  reputation: "职场声望"
};

const coreKeys = ["professional", "communication", "execution", "collaboration", "resilience", "stability"];

const initialMetrics = {
  professional: 52,
  communication: 50,
  execution: 52,
  collaboration: 50,
  resilience: 48,
  stability: 54,
  bossTrust: 50,
  colleagueFavor: 50,
  energy: 82,
  reputation: 50
};

const roles = {
  pm: {
    id: "pm",
    code: "PM-AI",
    name: "AI 产品经理",
    color: "#007aff",
    icon: "PM",
    tagline: "在用户、业务和研发之间做取舍",
    description: "你负责定义问题、冻结范围、推动协作，并对最终结果负责。",
    power: "需求优先级、会议发言权、事故协调权",
    blindspot: "无法直接控制研发资源和老板预期",
    metrics: { ...initialMetrics },
    bonus: { scope: ["professional", 3], meeting: ["communication", 2] },
    missions: {
      scope: ["产品任务", "从业务目标出发砍出最小闭环，别把愿望清单当成 MVP。"],
      schedule: ["产品任务", "保护主线上线，同时为需求澄清和验证失败样本留出时间。"],
      meeting: ["产品任务", "把争论从‘谁的锅’拉回范围、风险和下一步。"],
      incident: ["产品任务", "先保护用户主链路，再协调研发修复与业务同步。"],
      reply: ["产品任务", "判断新想法的优先级，不要把深夜响应等同于执行承诺。"]
    }
  },
  engineer: {
    id: "engineer",
    code: "R&D-ALL",
    name: "研发工程师",
    color: "#34c759",
    icon: "RD",
    tagline: "覆盖客户端、后台、算法等研发方向",
    description: "你掌握真实实现成本、系统风险和技术债，需要把专业判断翻译成团队能理解的决策。",
    power: "技术方案、风险评估、降级与修复执行",
    blindspot: "不直接决定需求优先级和商业 Deadline",
    metrics: { ...initialMetrics, professional: 62, communication: 44, execution: 58, collaboration: 54, resilience: 56, stability: 50, bossTrust: 46, colleagueFavor: 58, energy: 80 },
    bonus: { incident: ["resilience", 4], meeting: ["professional", 2] },
    missions: {
      scope: ["研发任务", "识别客户端、后台与算法链路的真实成本，拒绝伪装成小改动的系统性风险。"],
      schedule: ["研发任务", "在编码、联调、监控和技术债之间安排有限工程时间。"],
      meeting: ["研发任务", "用技术事实说明代价，同时给出可落地的替代方案。"],
      incident: ["研发任务", "快速定位链路、实施降级并组织并行修复，避免边查边扩大。"],
      reply: ["研发任务", "先判断是否影响线上稳定性，再约定评估时间，不做无依据承诺。"]
    }
  },
  designer: {
    id: "designer",
    code: "UX-01",
    name: "UX 设计师",
    color: "#af52de",
    icon: "UX",
    tagline: "守住体验，也让方案真正落地",
    description: "你掌握用户路径和体验证据，要在时间压力下判断哪些细节不可牺牲。",
    power: "体验方案、用户证据、设计验收权",
    blindspot: "不直接控制开发容量和上线节奏",
    metrics: { ...initialMetrics, professional: 58, communication: 55, execution: 47, collaboration: 59, resilience: 45, stability: 57, bossTrust: 48, colleagueFavor: 56, energy: 84 },
    bonus: { scope: ["collaboration", 3], reply: ["communication", 2] },
    missions: {
      scope: ["设计任务", "保住最关键的用户路径和信息可信度，允许次要动效晚一点出现。"],
      schedule: ["设计任务", "在原型、验收、用户反馈和临时汇报之间安排一天。"],
      meeting: ["设计任务", "把‘体验不好’转化为具体用户风险，而不是审美争论。"],
      incident: ["设计任务", "识别错误体验的用户伤害，推动可感知的降级提示和恢复方案。"],
      reply: ["设计任务", "澄清新想法解决的用户问题，并约定有证据的讨论时间。"]
    }
  },
  qa: {
    id: "qa",
    code: "QA-CORE",
    name: "测试工程师",
    color: "#ff9500",
    icon: "QA",
    tagline: "在所有人想上线时指出不能上线",
    description: "你拥有质量风险的完整视角，需要设计验证策略，并在压力下决定是否阻塞发布。",
    power: "质量门禁、风险分级、灰度与回归建议",
    blindspot: "风险意见可能被误解为拖慢项目",
    metrics: { ...initialMetrics, professional: 61, communication: 48, execution: 54, collaboration: 52, resilience: 61, stability: 58, bossTrust: 45, colleagueFavor: 49, energy: 80 },
    bonus: { incident: ["professional", 4], scope: ["resilience", 2] },
    missions: {
      scope: ["测试任务", "提前识别不可验证的需求，并为核心链路定义清晰验收标准。"],
      schedule: ["测试任务", "在用例设计、冒烟、回归和风险同步之间分配稀缺测试时间。"],
      meeting: ["测试任务", "用缺陷和覆盖率还原事实，避免质量问题变成测试个人责任。"],
      incident: ["测试任务", "控制影响范围、复现问题并建立回归清单，阻止错误版本继续扩散。"],
      reply: ["测试任务", "先确认变更是否需要补充验证，再承诺可交付的检查时间。"]
    }
  },
  growth: {
    id: "growth",
    code: "GROWTH-01",
    name: "增长运营",
    color: "#ff3b30",
    icon: "GO",
    tagline: "在用户反馈、内容节奏和业务目标间找增量",
    description: "你最早听见用户声音，也承受活动资源已经投入后的上线压力。",
    power: "用户反馈、渠道节奏、运营方案与客服口径",
    blindspot: "不直接掌握系统稳定性和研发成本",
    metrics: { ...initialMetrics, professional: 51, communication: 62, execution: 60, collaboration: 55, resilience: 56, stability: 45, bossTrust: 56, colleagueFavor: 51, energy: 78 },
    bonus: { reply: ["communication", 4], schedule: ["execution", 2] },
    missions: {
      scope: ["运营任务", "用真实用户反馈判断卖点，别让活动资源押在一个无法兑现的功能上。"],
      schedule: ["运营任务", "平衡内容准备、渠道排期、客服口径和产品协作。"],
      meeting: ["运营任务", "带回用户和渠道事实，同时接受上线范围可能需要收缩。"],
      incident: ["运营任务", "快速同步客服与渠道，控制用户预期，避免二次舆情。"],
      reply: ["运营任务", "判断新想法是否值得打乱既定传播节奏，并给出验证方式。"]
    }
  }
};

const chapters = [
  { day: 1, time: "09:40", type: "scope", tag: "范围切割", title: "一周，做一个 AI 搜索", subtitle: "不是选答案。请亲手砍出一个能上线的 MVP。" },
  { day: 2, time: "10:15", type: "schedule", tag: "资源管理", title: "八小时，不可能完成的清单", subtitle: "把有限时间分给任务，也决定哪些人会被你辜负。" },
  { day: 3, time: "16:00", type: "meeting", tag: "会议 Battle", title: "所以，到底是谁的问题？", subtitle: "选择证据，在倒计时内组织你的发言。NPC 会打断你。" },
  { day: 5, time: "11:26", type: "incident", tag: "事故指挥室", title: "P0：答案引用错位", subtitle: "错误仍在扩散。你每执行一个动作，现场指标都会变化。" },
  { day: 6, time: "23:47", type: "reply", tag: "关系记忆", title: "老板：在吗？", subtitle: "请直接回复。王总会结合你前几天的表现理解这句话。" }
];

const scopeFeatures = [
  { id: "answer", name: "单轮搜索问答", level: "P0", cost: 2, value: 9 },
  { id: "source", name: "引用来源", level: "P0", cost: 2, value: 8 },
  { id: "stream", name: "流式输出", level: "P1", cost: 2, value: 5 },
  { id: "multi", name: "多轮追问", level: "P2", cost: 3, value: 5 },
  { id: "recommend", name: "个性化推荐", level: "P2", cost: 4, value: 4 }
];

const scopeEvidence = [
  { id: "goal", title: "业务目标", body: "提升搜索成功率，而不是提升停留时长。" },
  { id: "api", title: "接口能力", body: "同步答案已就绪；流式接口至少还需 5 天。" },
  { id: "people", title: "研发资源", body: "研发工程师覆盖客户端、后台与算法方向，测试周四才能介入。" },
  { id: "boss", title: "老板原话", body: "“我希望它看起来足够像一个 AI 产品。”" }
];

const scheduleTasks = [
  { id: "prd", name: "冻结需求与验收标准", hours: 2, must: true },
  { id: "review", name: "拉研发完成技术评审", hours: 2, must: true },
  { id: "prototype", name: "打磨完整交互原型", hours: 3 },
  { id: "report", name: "替 Amy 准备老板汇报", hours: 2 },
  { id: "support", name: "支援同事的紧急需求", hours: 2 },
  { id: "data", name: "验证搜索失败样本", hours: 2, must: true },
  { id: "lunch", name: "午饭与恢复", hours: 1, recovery: true }
];

const meetingEvidence = [
  { id: "minutes", title: "原评审纪要", body: "MVP 仅保留单轮问答与引用。", signal: "scope" },
  { id: "changes", title: "昨日变更记录", body: "Amy 新增 4 个场景，尚未评估影响。", signal: "change" },
  { id: "delay", title: "当前项目风险", body: "联调推迟 1 天，测试时间缩短 30%。", signal: "risk" },
  { id: "chat", title: "研发私聊截图", body: "“再改我就不做了。”", signal: "emotion" },
  { id: "history", title: "上次事故复盘", body: "根因是需求冻结后继续口头加项。", signal: "process" }
];

const incidentActions = [
  { id: "hide", title: "关闭引用展示", desc: "保留搜索主链路", effect: { error: -4.8, exposure: -24, trust: 4, complaints: 0 }, good: true },
  { id: "pause", title: "暂停全部灰度", desc: "8 分钟内停止影响", effect: { error: -3.2, exposure: -32, trust: 1, complaints: 0 }, good: true },
  { id: "assign", title: "研发并行修复", desc: "建立 20 分钟检查点", effect: { error: -1.6, exposure: -8, trust: 3, complaints: 0 }, good: true },
  { id: "service", title: "同步客服口径", desc: "主动解释与安抚", effect: { error: 0, exposure: -5, trust: 5, complaints: -2 }, good: true },
  { id: "wait", title: "继续观察十分钟", desc: "避免过度反应", effect: { error: 2.1, exposure: 16, trust: -8, complaints: 4 }, good: false },
  { id: "blame", title: "要求测试先写说明", desc: "明确漏测责任", effect: { error: 1.4, exposure: 10, trust: -6, complaints: 3 }, good: false }
];

function blankState() {
  return {
    version: 3,
    screen: "landing",
    name: "",
    selectedRole: "pm",
    chapter: 0,
    metrics: { ...initialMetrics },
    memories: [],
    highlights: [],
    currentOutcome: null,
    selectedFeatures: [],
    selectedScopeEvidence: [],
    schedule: [],
    selectedMeetingEvidence: [],
    meetingReply: "",
    meetingSeconds: 60,
    incident: { error: 7.3, exposure: 68, trust: 62, complaints: 3, actions: [] },
    lateReply: "",
    answers: ["", ""],
    friendVotes: { support: 18, alternative: 7 },
    streak: 1,
    toast: ""
  };
}

let state = blankState();
let timerHandle = null;

function clamp(value) { return Math.max(0, Math.min(100, Math.round(value))); }
function escapeHTML(value = "") { return value.replace(/[&<>'"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" })[c]); }
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function storedState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); }
  catch { return null; }
}
function hasPlayableProgress(cached = storedState()) {
  return Boolean(cached && ["chapter", "observer", "interview", "result"].includes(cached.screen));
}
function startFreshCasting(name) {
  const cached = storedState();
  state = blankState();
  state.name = name || "匿名候选人";
  state.streak = cached?.streak || 1;
  state.screen = "role";
  render();
}
function effect(key, amount) { state.metrics[key] = clamp((state.metrics[key] || 0) + amount); }
function applyEffects(effects) { Object.entries(effects).forEach(([key, value]) => effect(key, value)); }
function stopTimer() { if (timerHandle) window.clearInterval(timerHandle); timerHandle = null; }
function reset() { stopTimer(); state = blankState(); localStorage.removeItem(STORAGE_KEY); render(); }
function returnToCasting(requireConfirmation = true) {
  const hasProgress = state.chapter > 0 || state.memories.length > 0 || ["chapter", "observer", "interview", "result"].includes(state.screen);
  if (requireConfirmation && hasProgress && !window.confirm("切换角色会重置本周剧情与属性，确定返回选角吗？")) return;
  const { name, streak } = state;
  state = blankState();
  state.name = name;
  state.streak = streak;
  state.screen = "role";
  localStorage.removeItem(STORAGE_KEY);
  render();
}
function restartCurrentRole() {
  const { name, streak, selectedRole } = state;
  state = blankState();
  state.name = name;
  state.streak = streak;
  state.selectedRole = selectedRole;
  state.metrics = { ...currentRole().metrics };
  state.screen = "chapter";
  save();
  render();
}
function arrow() { return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8"/></svg>`; }
function toast(message) { state.toast = message; render(); window.setTimeout(() => { state.toast = ""; render(); }, 1700); }
function currentRole() { return roles[state.selectedRole] || roles.pm; }
function selectRole(id) {
  const role = roles[id];
  if (!role) return;
  state.selectedRole = id;
  state.metrics = { ...role.metrics };
  render();
}
function roleMission(type) {
  const role = currentRole();
  const mission = role.missions[type];
  return `<div class="role-mission" style="--role-accent:${role.color || "#007aff"}"><div class="role-mission-icon">${role.icon}</div><div><span>${mission[0]} · ${role.name}</span><strong>${mission[1]}</strong></div><button class="role-perspective" type="button" title="当前岗位视角">岗位视角</button></div>`;
}

function renderLanding() {
  const cached = storedState();
  const canResume = hasPlayableProgress(cached);
  const resumeRole = roles[cached?.selectedRole] || roles.pm;
  const resumeDay = chapters[cached?.chapter]?.day || 1;
  return `<section class="screen landing v2-landing">
    <div class="hero">
      <div class="brand-row"><div class="brand-mark"><i class="brand-dot"></i>心动科技</div><div class="issue-no mono">SEASON 01 / WEEK 01</div></div>
      <div class="hero-copy">
        <div class="kicker">An AI-directed workplace reality show</div>
        <h1>周五<span>18:30</span></h1>
        <p class="hero-description">你不是来做测试的。你要亲自开会、排期、处理事故，并承担每个决定留下的<strong>真实后果</strong>。</p>
        <div class="format-strip"><span>会议 Battle</span><span>事故指挥室</span><span>NPC 长期记忆</span><span>好友观察团</span></div>
      </div>
      <div class="hero-footer"><div class="quote-strip"><span>本周主线：AI 搜索紧急上线</span><br>5 个互动工作日 / 1 场转正答辩 / 每周持续更新</div><div class="streak-card"><b>${state.streak}</b><span>连续出演<br>工作日</span></div></div>
    </div>
    <aside class="start-panel">
      <div class="notice-light"><i></i> DIRECTOR ENGINE V3 ONLINE</div>
      <h2>这一周，<br>由你出演。</h2>
      <p>NPC 会记住你的承诺，事故不会等待你思考，朋友也能成为你的观察团。</p>
      <div class="name-field"><label for="player-name">候选人代号</label><input id="player-name" maxlength="12" placeholder="输入你的名字" value="${escapeHTML(state.name)}"></div>
      <button class="button button-primary" id="start-button">选择角色，开始新副本 ${arrow()}</button>
      ${canResume ? `<button class="continue-card" id="resume-button"><span><b>继续上次出演</b><small>${resumeRole.name} · DAY ${String(resumeDay).padStart(2, "0")}</small></span><i>继续</i></button>` : `<div class="no-save-note">暂无进行中的副本 · 开始后将自动保存</div>`}
      <div class="mono legal-note">非官方同人互动创作 · 副本 #128392</div>
    </aside>
  </section>`;
}

function renderRole() {
  const role = currentRole();
  return `<section class="screen role-screen multi-role-screen">
    <div class="topline"><button class="back-button" id="back-home">← 返回</button><div class="step-indicator">CASTING / 5 个可玩岗位</div></div>
    <div class="casting-layout">
      <div class="casting-main">
        <div class="role-intro"><div class="kicker">Choose your position</div><h1>${escapeHTML(state.name)}，这次你坐哪边？</h1><p>同一个项目，不同岗位掌握不同信息、权限和风险。换一个角色重玩，你会重新理解每一次冲突。</p></div>
        <div class="role-picker-heading"><div><span>01</span><h2>选择角色身份</h2></div><strong>5 个岗位均可游玩</strong></div>
        <div class="role-picker" role="group" aria-label="选择本周角色">${Object.values(roles).map(item => `<button class="role-option ${item.id === role.id ? "selected" : ""}" data-role="${item.id}" style="--role-color:${item.color}"><i>${item.icon}</i><span><b>${item.name}</b><small>${item.tagline}</small></span><em>${item.id === role.id ? "已选择" : "选择"}</em></button>`).join("")}</div>
      </div>
      <div class="cast-card" style="--role-color:${role.color}"><div class="cast-identity"><span class="role-code">${role.code} / OPEN</span><i>${role.icon}</i></div><h2>${role.name}</h2><p>${role.description}</p><div class="role-boundaries"><div><span>你拥有</span><strong>${role.power}</strong></div><div><span>你的盲区</span><strong>${role.blindspot}</strong></div></div><div class="cast-stats"><span>初始心力 <b>${role.metrics.energy}</b></span><span>专业判断 <b>${role.metrics.professional}</b></span><span>本周事件 <b>5</b></span></div><button class="button button-dark" id="enter-week">以${role.name}身份开工 ${arrow()}</button></div>
    </div>
  </section>`;
}

function header() {
  const chapter = chapters[state.chapter];
  const role = currentRole();
  return `<header class="game-header"><div class="game-brand"><i class="brand-dot" style="background:${role.color}"></i><div><strong>心动科技</strong><small>${escapeHTML(state.name)} / ${role.name}</small></div></div><div class="progress-rail"><span style="width:${((state.chapter + 1) / 6) * 100}%;background:${role.color}"></span></div><div class="header-actions"><button class="switch-role-button" id="switch-role" type="button">换角色</button><div class="header-resources"><div class="resource"><span>ENERGY</span><strong>${state.metrics.energy}</strong></div><div class="resource"><span>TRUST</span><strong>${state.metrics.bossTrust}</strong></div><div class="resource"><span>DAY</span><strong>${chapter?.day || 7}/7</strong></div></div></div></header>`;
}

function chapterHero(chapter) {
  return `<div class="interactive-hero"><div class="day-stamp">DAY<strong>${String(chapter.day).padStart(2, "0")}</strong>${chapter.time}</div><div><span class="scene-tag">${chapter.tag}</span><h1>${chapter.title}</h1><p>${chapter.subtitle}</p></div></div>`;
}

function memoryRail() {
  return `<aside class="memory-rail"><div class="memory-title"><span>NPC MEMORY</span><strong>${state.memories.length}</strong></div>${state.memories.length ? state.memories.slice(-4).map(memory => `<div class="memory-chip"><b>${memory.person}</b><p>${memory.text}</p></div>`).join("") : `<div class="empty-memory">还没有人真正记住你。<br>但第一句话之后，一切都会开始。</div>`}<div class="mini-metrics">${["professional", "communication", "collaboration", "stability"].map(key => `<div><span>${labels[key]}</span><i><b style="width:${state.metrics[key]}%"></b></i><em>${state.metrics[key]}</em></div>`).join("")}</div></aside>`;
}

function renderScope() {
  const chapter = chapters[0];
  const cost = state.selectedFeatures.reduce((sum, id) => sum + scopeFeatures.find(item => item.id === id).cost, 0);
  return `<section class="screen game-screen">${header()}<div class="interactive-layout"><main class="interactive-main">${chapterHero(chapter)}${roleMission(chapter.type)}
    <div class="brief-callout"><b>王总</b><p>“下周五我要看到一个能用、也足够像 AI 的版本。”</p></div>
    <div class="mission-grid"><section><div class="module-heading"><div><span>01</span><h2>选择上线范围</h2></div><small>开发容量 6 点 · 已用 ${cost}</small></div><div class="feature-board">${scopeFeatures.map(item => `<button class="feature-token ${state.selectedFeatures.includes(item.id) ? "selected" : ""} ${cost + item.cost > 6 && !state.selectedFeatures.includes(item.id) ? "unavailable" : ""}" data-feature="${item.id}"><span>${item.level}</span><strong>${item.name}</strong><em>成本 ${item.cost} / 价值 ${item.value}</em></button>`).join("")}</div></section>
    <section><div class="module-heading"><div><span>02</span><h2>带两份证据进会</h2></div><small>${state.selectedScopeEvidence.length}/2</small></div><div class="evidence-deck">${scopeEvidence.map(item => `<button class="evidence-card ${state.selectedScopeEvidence.includes(item.id) ? "selected" : ""}" data-scope-evidence="${item.id}"><b>${item.title}</b><p>${item.body}</p></button>`).join("")}</div></section></div>
    <div class="action-dock"><div><span>你的方案</span><strong>${state.selectedFeatures.length ? state.selectedFeatures.map(id => scopeFeatures.find(item => item.id === id).name).join(" + ") : "尚未定义"}</strong></div><button class="button button-dark" id="submit-scope">提交 MVP 方案 ${arrow()}</button></div>
  </main>${memoryRail()}</div></section>`;
}

function renderSchedule() {
  const chapter = chapters[1];
  const used = state.schedule.reduce((sum, id) => sum + scheduleTasks.find(item => item.id === id).hours, 0);
  const blocks = Array.from({ length: 8 }, (_, index) => index < used);
  return `<section class="screen game-screen">${header()}<div class="interactive-layout"><main class="interactive-main">${chapterHero(chapter)}${roleMission(chapter.type)}
    <div class="schedule-status"><div><span>09:00</span><strong>今日可支配时间</strong></div><div class="hour-blocks">${blocks.map((filled, index) => `<i class="${filled ? "filled" : ""}">${index + 1}</i>`).join("")}</div><b class="${used > 8 ? "over" : ""}">${used}/8h</b></div>
    <div class="task-board">${scheduleTasks.map(task => `<button class="task-ticket ${state.schedule.includes(task.id) ? "selected" : ""}" data-task="${task.id}"><span>${task.hours}H</span><div><strong>${task.name}</strong><small>${task.must ? "主线上线必需" : task.recovery ? "恢复心力" : "关系与质量支线"}</small></div><i>${state.schedule.includes(task.id) ? "已排入" : "排入日程"}</i></button>`).join("")}</div>
    <div class="surprise-message"><span>17:30 NEW</span><p><b>Amy：</b>老板临时要一版汇报，今晚能帮我准备吗？</p></div>
    <div class="action-dock"><div><span>当前代价</span><strong>${used > 8 ? `超载 ${used - 8} 小时，将透支心力` : `剩余 ${8 - used} 小时，可继续安排`}</strong></div><button class="button button-dark" id="submit-schedule">结束今天 ${arrow()}</button></div>
  </main>${memoryRail()}</div></section>`;
}

function renderMeeting() {
  const chapter = chapters[2];
  return `<section class="screen game-screen battle-screen">${header()}<div class="interactive-layout"><main class="interactive-main">${chapterHero(chapter)}${roleMission(chapter.type)}
    <div class="battle-timer"><span>发言窗口</span><strong id="meeting-clock">${String(state.meetingSeconds).padStart(2, "0")}</strong><i><b id="meeting-bar" style="width:${(state.meetingSeconds / 60) * 100}%"></b></i></div>
    <div class="meeting-room"><div class="meeting-person boss-seat"><i>王</i><b>王总</b><p>“我只想知道，为什么还没联调？”</p></div><div class="meeting-person director-seat"><i>A</i><b>Amy</b><p>“我只是补充场景，不算改需求。”</p></div><div class="meeting-person engineer-seat"><i>林</i><b>小林</b><p>“昨天改了四项，排期当然会变。”</p></div><div class="your-seat"><span>现在轮到你</span></div></div>
    <div class="battle-grid"><section><div class="module-heading"><div><span>01</span><h2>选择最多三张证据牌</h2></div><small>${state.selectedMeetingEvidence.length}/3</small></div><div class="battle-evidence">${meetingEvidence.map(item => `<button class="battle-card ${state.selectedMeetingEvidence.includes(item.id) ? "selected" : ""}" data-meeting-evidence="${item.id}"><span>${item.signal}</span><b>${item.title}</b><p>${item.body}</p></button>`).join("")}</div></section><section class="statement-panel"><div class="module-heading"><div><span>02</span><h2>组织你的发言</h2></div><small>自由输入</small></div><div class="interrupt" id="meeting-interrupt">王总正在等你的结论。</div><textarea id="meeting-reply" maxlength="260" placeholder="先讲结论，再引用证据，最后给出下一步……">${escapeHTML(state.meetingReply)}</textarea><div class="speech-hints"><button data-insert="我的结论是：">结论</button><button data-insert="根据评审纪要，">证据</button><button data-insert="我建议下一步：">行动</button><button data-insert="我负责在今天内：">责任</button></div><button class="button button-primary" id="submit-meeting">提交发言</button></section></div>
  </main>${memoryRail()}</div></section>`;
}

function renderIncident() {
  const chapter = chapters[3];
  const data = state.incident;
  return `<section class="screen game-screen incident-screen">${header()}<div class="interactive-layout"><main class="interactive-main">${chapterHero(chapter)}${roleMission(chapter.type)}
    <div class="incident-ticker"><div><span>错误率</span><strong class="danger">${data.error.toFixed(1)}%</strong></div><div><span>影响用户</span><strong>${Math.round(data.exposure)}%</strong></div><div><span>用户投诉</span><strong>${Math.max(0, Math.round(data.complaints))}</strong></div><div><span>业务信任</span><strong>${Math.round(data.trust)}</strong></div><i class="live-pulse">LIVE</i></div>
    <div class="incident-grid"><section class="ops-panel"><div class="module-heading"><div><span>OPS</span><h2>执行处置动作</h2></div><small>最多执行 3 项</small></div><div class="ops-list">${incidentActions.map(action => `<button class="op-action ${data.actions.includes(action.id) ? "done" : ""}" data-incident-action="${action.id}" ${data.actions.includes(action.id) || data.actions.length >= 3 ? "disabled" : ""}><span>${data.actions.includes(action.id) ? "DONE" : "执行"}</span><div><b>${action.title}</b><p>${action.desc}</p></div></button>`).join("")}</div></section><section class="war-room"><div class="war-head"><span>事故动态</span><b>INC-2026-0918</b></div><div class="incident-graph"><i style="height:${Math.max(8, data.error * 6)}%"></i><i style="height:${Math.max(8, data.exposure)}%"></i><i style="height:${Math.max(8, data.trust)}%"></i></div><div class="graph-labels"><span>错误</span><span>暴露</span><span>信任</span></div><div class="event-log">${data.actions.length ? data.actions.map((id, index) => `<p><span>${String(11 + index).padStart(2, "0")}:${26 + index * 3}</span>${incidentActions.find(item => item.id === id).title}</p>`).join("") : `<p><span>11:26</span>P0 告警触发，等待负责人决策</p>`}</div><button class="button button-dark" id="resolve-incident" ${data.actions.length < 2 ? "disabled" : ""}>结束处置并复盘 ${arrow()}</button></section></div>
  </main>${memoryRail()}</div></section>`;
}

function renderReply() {
  const chapter = chapters[4];
  const priorMemory = state.memories.find(item => item.person === "王总");
  return `<section class="screen game-screen reply-screen">${header()}<div class="interactive-layout"><main class="interactive-main">${chapterHero(chapter)}${roleMission(chapter.type)}
    <div class="phone-stage"><div class="phone-top"><span>23:47</span><b>企业微信</b><span>87%</span></div><div class="late-chat"><div class="phone-avatar">王</div><div><b>王总</b><p>在吗？有个新想法，方便聊十分钟吗？</p></div></div>${priorMemory ? `<div class="memory-recall"><span>他还记得</span><p>${priorMemory.text}</p></div>` : ""}<textarea id="late-reply" maxlength="180" placeholder="直接写下你会发出的消息……">${escapeHTML(state.lateReply)}</textarea><div class="tone-meter"><span>导演引擎将识别：</span><b>是否判断紧急程度</b><b>是否给出下一步</b><b>是否保留边界</b></div><button class="button button-primary" id="submit-reply">发送消息</button></div>
    <div class="friend-hook"><div><span>好友救场</span><h2>不知道怎么回？</h2><p>把这条“在吗”发给朋友，让他替你写一句。最终回复仍由你决定。</p></div><button class="button button-outline" id="ask-friend">生成求助口令</button></div>
  </main>${memoryRail()}</div></section>`;
}

function renderChapter() {
  const type = chapters[state.chapter].type;
  return ({ scope: renderScope, schedule: renderSchedule, meeting: renderMeeting, incident: renderIncident, reply: renderReply })[type]();
}

function renderObserver() {
  const outcome = state.currentOutcome;
  const totalVotes = state.friendVotes.support + state.friendVotes.alternative;
  const supportRate = Math.round((state.friendVotes.support / totalVotes) * 100);
  return `<section class="screen observer-screen"><div class="observer-wrap"><div class="observer-head"><div><div class="kicker observer-kicker">Offer 观察团</div><strong>第 ${chapters[state.chapter].day} 日 · 导演复盘</strong></div><div class="observer-head-actions"><button class="switch-role-button switch-role-dark" id="switch-role" type="button">换角色</button><div class="live-tag">EDITING ROOM</div></div></div><div class="observer-main"><div class="observer-copy"><div class="highlight-label">本集高光</div><h1>${outcome.title}</h1><p class="reaction-quote">${outcome.summary}</p><div class="comment-list">${outcome.comments.map((comment, index) => `<div class="comment"><b>观察员 ${String(index + 1).padStart(2, "0")}</b><span>${comment}</span></div>`).join("")}</div><div class="friend-observer"><div><span>好友观察团预测</span><strong>${supportRate}% 认为你能拿到 Offer</strong></div><div class="vote-bar"><i style="width:${supportRate}%"></i></div><div class="friend-actions"><button id="friend-support">我站这波</button><button id="share-scene">邀请朋友来评</button></div></div></div><aside class="delta-card"><h3>本轮状态变化</h3><div class="delta-grid">${Object.entries(outcome.effects).map(([key, value]) => `<div class="delta-row"><span>${labels[key]}</span><strong class="${value >= 0 ? "delta-positive" : "delta-negative"}">${value >= 0 ? "+" : ""}${value}</strong></div>`).join("")}</div><div class="memory-written"><span>已写入 NPC 记忆</span><b>${outcome.memory.person}</b><p>${outcome.memory.text}</p></div></aside></div><div class="button-row observer-next"><button class="button button-light" id="continue-story">${state.chapter === chapters.length - 1 ? "进入转正答辩" : "播放下一集"} ${arrow()}</button></div></div></section>`;
}

function renderInterview() {
  const role = currentRole();
  return `<section class="screen interview-screen"><aside class="interview-aside"><div><div class="interview-topline"><div class="kicker interview-kicker">Day 07 / ${role.code}</div><button class="switch-role-button switch-role-dark" id="switch-role" type="button">换角色</button></div><h1>最终<br>答辩</h1><p>作为${role.name}，你过去几天说过的话，已经成为别人评价你的依据。</p></div><div class="memory-summary">${state.memories.slice(-3).map(item => `<p><b>${item.person}</b>${item.text}</p>`).join("")}</div></aside><form class="interview-form" id="interview-form"><div class="kicker">Final statement</div><h2>${escapeHTML(state.name)}，请为这一周作结。</h2><p>不是标准面试题。请结合你真实做过的决定回答。</p>${["你这一周守住了什么？又牺牲了什么？", "如果获得 Offer，你准备如何改变下一周？"].map((question, index) => `<div class="question-block"><small>QUESTION 0${index + 1}</small><label for="answer-${index}">${question}</label><textarea id="answer-${index}" data-answer="${index}" maxlength="240" placeholder="引用一次真实事件会更有说服力……">${escapeHTML(state.answers[index])}</textarea></div>`).join("")}<button class="button button-dark" type="submit">提交答辩，生成本周正片 ${arrow()}</button></form></section>`;
}

function averageScore() { return Math.round(coreKeys.reduce((sum, key) => sum + state.metrics[key], 0) / coreKeys.length); }
function ending() {
  const avg = averageScore(), m = state.metrics;
  if (m.energy < 30 || m.stability < 35) return { grade: "E", title: "互联网 NPC", text: "你交付了项目，却差点把自己也交付出去。" };
  if (avg >= 75 && m.bossTrust >= 64 && m.colleagueFavor >= 60) return { grade: "S", title: "令人心动的 Offer", text: "结果、关系与长期稳定性同时在线。" };
  if (m.communication >= 75 && m.bossTrust >= 68) return { grade: "B", title: "薪资谈判成功", text: "你让自己的价值被准确看见。" };
  if (avg >= 64) return { grade: "A", title: "成功转正", text: "你证明了自己能在真实约束中持续成长。" };
  if (m.professional >= 70 && m.bossTrust < 52) return { grade: "D", title: "带着方案去创业", text: "你更擅长重新定义规则，而不是适应它。" };
  return { grade: "C", title: "主动离开", text: "识别不适合，也是一种成熟。" };
}

function manual() {
  const sorted = coreKeys.map(key => ({ key, value: state.metrics[key] })).sort((a, b) => b.value - a.value);
  const types = { professional: "理性解题型", communication: "共识推动型", execution: "高能落地型", collaboration: "团队连接型", resilience: "危机接管型", stability: "稳定边界型" };
  const skills = { professional: "把模糊问题拆成可验证方案", communication: "在冲突中重建共同语言", execution: "让计划在现实里继续前进", collaboration: "看见每个角色的真实阻力", resilience: "先止血，再复盘", stability: "在压力里保护长期产能" };
  return { type: types[sorted[0].key], skill: skills[sorted[0].key], risk: `注意「${labels[sorted.at(-1).key]}」是你的下一阶段课题` };
}

function renderResult() {
  const end = ending(), profile = manual(), role = currentRole();
  return `<section class="screen result-screen"><div class="result-top"><div class="brand-mark"><i class="brand-dot"></i>心动科技 · 第一周正片</div><div class="mono issue-no">SEASON 01 / EP 01</div></div><div class="result-layout"><article class="manual-card" data-serial="WORKPLACE MANUAL / #128392"><div class="kicker">你的职场人生说明书</div><div class="ending-grade">${end.grade}</div><h1>${escapeHTML(state.name)}</h1><div class="ending-title">结局：${end.title}</div><div class="result-role-chip" style="--role-color:${role.color}"><i>${role.icon}</i><span>${role.name}</span></div><div class="manual-rows"><div class="manual-row"><span class="result-label">本周岗位</span><strong>${role.name} · ${role.tagline}</strong></div><div class="manual-row"><span class="result-label">本周类型</span><strong>${profile.type}</strong></div><div class="manual-row"><span class="result-label">核心能力</span><strong>${profile.skill}</strong></div><div class="manual-row"><span class="result-label">下周课题</span><strong>${profile.risk}</strong></div><div class="manual-row"><span class="result-label">NPC 记忆</span><strong>已有 ${state.memories.length} 条关系记忆影响后续剧情</strong></div></div><p class="manual-quote">“${end.text}”</p></article><div class="result-detail"><div class="kicker">Weekly highlight reel</div><h2>你的本周<br>高光切片</h2><div class="highlight-reel">${state.highlights.map((item, index) => `<div class="reel-item"><span>0${index + 1}</span><p>${item}</p></div>`).join("")}</div><div class="weekly-next"><span>NEXT EPISODE</span><h3>第二周：第一次绩效沟通</h3><p>Amy 给了你一个超出预期的评级，但王总似乎有不同意见。</p><button class="button button-dark" id="reserve-next">预约下一集</button></div><div class="result-actions"><button class="button button-outline" id="copy-result">复制高光文案</button><button class="button button-outline" id="switch-role">换角色重玩</button><button class="button button-outline" id="restart-game">同角色重玩</button></div></div></div><div class="disclaimer">本作品为非官方同人互动创作。好友观察团当前为本地演示模式，正式版接入分享落地页后可由真实好友投票与留言。</div></section>`;
}

function makeOutcome(title, summary, comments, effects, memory) {
  const role = currentRole();
  const bonus = role.bonus[chapters[state.chapter]?.type];
  if (bonus) effects[bonus[0]] = (effects[bonus[0]] || 0) + bonus[1];
  comments.push(`${role.name}岗位加成：${labels[bonus?.[0]] || "岗位经验"}${bonus ? ` +${bonus[1]}` : "已记录"}。`);
  applyEffects(effects);
  state.currentOutcome = { title, summary, comments, effects, memory };
  state.memories.push(memory);
  state.highlights.push(title);
  state.screen = "observer";
  save();
  render();
}

function submitScope() {
  if (state.selectedFeatures.length < 2 || state.selectedScopeEvidence.length !== 2) return toast("至少选择 2 项功能和恰好 2 份证据");
  const cost = state.selectedFeatures.reduce((sum, id) => sum + scopeFeatures.find(item => item.id === id).cost, 0);
  const hasCore = state.selectedFeatures.includes("answer") && state.selectedFeatures.includes("source");
  const grounded = state.selectedScopeEvidence.includes("api") || state.selectedScopeEvidence.includes("people");
  const effects = hasCore && cost <= 6 ? { professional: 10, execution: 6, bossTrust: 5, colleagueFavor: 5, energy: -4 } : { professional: -4, execution: 3, bossTrust: 2, colleagueFavor: -5, energy: -9 };
  if (grounded) effects.communication = 5;
  makeOutcome(hasCore ? "你真的砍出了一个 MVP" : "范围看起来很美，但风险被藏住了", hasCore ? "你用容量和证据定义范围，而不是凭感觉对老板说“可以”。" : "你保留了太多想象空间。团队已经开始担心下周五。", hasCore ? ["终于不是四选一，他真的做了取舍。", "有业务目标，也尊重技术现实。", "王总接受了范围，但记住了上线承诺。"] : ["功能很多，但没有形成最小闭环。", "这更像愿望清单。", "下一个冲突已经埋下了。"], effects, { person: "王总", text: hasCore ? "你承诺下周五交付单轮问答与引用。" : "你接下了一个范围仍然模糊的项目。" });
}

function submitSchedule() {
  const used = state.schedule.reduce((sum, id) => sum + scheduleTasks.find(item => item.id === id).hours, 0);
  if (state.schedule.length < 2) return toast("请先安排至少两项工作");
  const mustCount = scheduleTasks.filter(task => task.must && state.schedule.includes(task.id)).length;
  const hasLunch = state.schedule.includes("lunch");
  const overload = Math.max(0, used - 8);
  const effects = { execution: mustCount * 3, professional: mustCount * 2, energy: hasLunch ? 5 - overload * 5 : -8 - overload * 5, stability: hasLunch ? 6 : -4, collaboration: state.schedule.includes("support") ? 5 : 0 };
  makeOutcome(overload ? "你把九小时塞进了八小时" : hasLunch ? "你第一次把恢复也排进计划" : "计划刚好装满，但没有缓冲", overload ? "表格里所有任务都被安排了，现实里却只有一个你。" : hasLunch ? "你没有完成所有人的期待，但守住了主线和明天的判断力。" : "排期看起来精确，任何临时消息都会让它倒塌。", ["资源管理就是公开说哪些事不做。", hasLunch ? "午饭不是偷懒，是风险控制。" : "他依然把自己当成无限资源。", `上线必需任务完成度：${mustCount}/3。`], effects, { person: "Amy", text: state.schedule.includes("report") ? "你为她接下了临时汇报。" : "你没有把她的临时汇报排进当天。" });
}

function scoreText(text, evidenceCount) {
  const conclusion = /结论|建议|先/.test(text);
  const action = /今天|下一步|锁定|冻结|评估|同步|负责/.test(text);
  const blame = /都是|主要是.*问题|不配合|谁的问题/.test(text);
  const score = (conclusion ? 4 : 0) + (action ? 5 : 0) + evidenceCount * 2 - (blame ? 6 : 0);
  return { score, blame };
}

function submitMeeting() {
  const text = state.meetingReply.trim();
  if (state.selectedMeetingEvidence.length < 2) return toast("请带至少两张证据牌上桌");
  if (text.length < 15) return toast("发言至少需要 15 个字");
  stopTimer();
  const result = scoreText(text, state.selectedMeetingEvidence.length);
  const strong = result.score >= 10;
  const effects = strong ? { communication: 11, collaboration: 8, bossTrust: 7, reputation: 6, energy: -3 } : { communication: -4, collaboration: result.blame ? -9 : -3, bossTrust: -5, reputation: -3, energy: -5 };
  makeOutcome(strong ? "你把追责会拉回了解题现场" : "你说了很多，但会议仍在原地", strong ? `你用 ${state.selectedMeetingEvidence.length} 份证据说明问题，并给出了下一步。王总停止追问“谁的锅”。` : "发言缺少明确行动，或让事实听起来像一次公开甩锅。", strong ? ["先结论、再证据、最后行动，很完整。", "小林没有被当成阻力。", "Amy 也必须面对范围变更的事实。"] : ["证据不是用来攻击同事的。", "老板仍然不知道接下来谁做什么。", "自由发言暴露了真实沟通习惯。"], effects, { person: "小林", text: strong ? "你在会议上没有把延期归因给研发。" : "你在公开场合让研发承担了更多压力。" });
}

function applyIncidentAction(id) {
  const action = incidentActions.find(item => item.id === id);
  if (!action || state.incident.actions.includes(id) || state.incident.actions.length >= 3) return;
  state.incident.actions.push(id);
  state.incident.error = Math.max(0.3, state.incident.error + action.effect.error);
  state.incident.exposure = clamp(state.incident.exposure + action.effect.exposure);
  state.incident.trust = clamp(state.incident.trust + action.effect.trust);
  state.incident.complaints = Math.max(0, state.incident.complaints + action.effect.complaints);
  save(); render();
}

function submitIncident() {
  if (state.incident.actions.length < 2) return;
  const actions = state.incident.actions.map(id => incidentActions.find(item => item.id === id));
  const goodCount = actions.filter(item => item.good).length;
  const stabilized = state.incident.error <= 4 && state.incident.exposure <= 55;
  const effects = stabilized ? { resilience: 12, professional: 8, execution: 7, bossTrust: 5, reputation: 8, energy: -9 } : { resilience: -8, professional: -6, bossTrust: -9, reputation: -8, energy: -12 };
  makeOutcome(stabilized ? "你在 9 分钟内止住了事故" : "你处理了人，却没有处理问题", stabilized ? `错误率降至 ${state.incident.error.toFixed(1)}%，影响范围被控制在 ${Math.round(state.incident.exposure)}%。` : `错误率仍为 ${state.incident.error.toFixed(1)}%，投诉继续增加。事故不会因为会议开始而暂停。`, stabilized ? ["先降级，再修复，动作顺序正确。", "事故处理不是找一个人负责。", "业务主链路被保住了。"] : ["最宝贵的十分钟被用来观察或追责。", "用户仍然在遇到错误。", `有效处置只有 ${goodCount} 项。`], effects, { person: "王总", text: stabilized ? "你在事故中优先保护用户，并给出了清晰节奏。" : "事故发生时，你没有在第一时间控制影响。" });
}

function submitReply() {
  const text = state.lateReply.trim();
  if (text.length < 8) return toast("请写下一条完整回复");
  const checksUrgency = /紧急|着急|今晚必须|是否/.test(text);
  const nextStep = /明早|明天|几点|我会|数据|方案|同步/.test(text);
  const boundary = /明早|明天|今晚先|休息|不方便|十分钟/.test(text);
  const ghost = /不回|睡了|没看到/.test(text);
  const score = [checksUrgency, nextStep, boundary].filter(Boolean).length;
  const effects = ghost ? { communication: -9, bossTrust: -10, energy: 8, stability: 3 } : score >= 2 ? { communication: 9, stability: 10, bossTrust: 5, energy: 5, professional: 4 } : { communication: 2, bossTrust: 5, energy: -14, stability: -6 };
  makeOutcome(score >= 2 ? "你没有把“在吗”自动翻译成加班" : ghost ? "你休息了，但也制造了新的不确定性" : "十分钟，最后变成了四十分钟", score >= 2 ? "你先判断紧急程度，再约定更高质量的下一步。边界被清楚表达，也被对方接受。" : ghost ? "休息没有错，失联会让关系替你承担解释成本。" : "你的响应度很高，但心力正在替流程漏洞买单。", score >= 2 ? ["边界感不是拒绝，而是重新定义交付。", "王总只回复了一个“好”。", "成熟的职场人会管理自己的长期产能。"] : ["可靠不是随叫随到。", "他还是习惯用自己填补系统。", "这句话会影响明天答辩。"], effects, { person: "王总", text: score >= 2 ? "你会回应需求，但会先确认优先级和时间。" : "深夜消息通常能立刻得到你的响应。" });
}

function evaluateInterview() {
  const text = state.answers.join(" ");
  const hits = ["用户", "风险", "团队", "边界", "复盘", "数据", "优先级", "承担"].filter(word => text.includes(word)).length;
  effect("communication", Math.min(9, hits + Math.floor(text.length / 60)));
  effect("professional", Math.min(7, Math.floor(hits / 2) + 2));
  effect("reputation", Math.min(8, hits));
}

function bindEvents() {
  document.querySelector("#player-name")?.addEventListener("input", e => { state.name = e.target.value; });
  document.querySelector("#start-button")?.addEventListener("click", () => startFreshCasting(document.querySelector("#player-name").value.trim()));
  document.querySelector("#resume-button")?.addEventListener("click", () => { const cached = storedState(); if (hasPlayableProgress(cached)) state = { ...blankState(), ...cached, selectedRole: cached.selectedRole || "pm" }; render(); });
  document.querySelector("#back-home")?.addEventListener("click", () => { state.screen = "landing"; render(); });
  document.querySelectorAll("[data-role]").forEach(button => button.addEventListener("click", () => selectRole(button.dataset.role)));
  document.querySelector("#enter-week")?.addEventListener("click", () => { state.metrics = { ...currentRole().metrics }; state.screen = "chapter"; save(); render(); });

  document.querySelectorAll("[data-feature]").forEach(button => button.addEventListener("click", () => { const id = button.dataset.feature; const selected = state.selectedFeatures.includes(id); const cost = state.selectedFeatures.reduce((sum, key) => sum + scopeFeatures.find(item => item.id === key).cost, 0); const item = scopeFeatures.find(feature => feature.id === id); if (!selected && cost + item.cost > 6) return toast("开发容量不够，先砍掉一个功能"); state.selectedFeatures = selected ? state.selectedFeatures.filter(key => key !== id) : [...state.selectedFeatures, id]; render(); }));
  document.querySelectorAll("[data-scope-evidence]").forEach(button => button.addEventListener("click", () => { const id = button.dataset.scopeEvidence; const selected = state.selectedScopeEvidence.includes(id); if (!selected && state.selectedScopeEvidence.length >= 2) return toast("最多携带两份证据"); state.selectedScopeEvidence = selected ? state.selectedScopeEvidence.filter(key => key !== id) : [...state.selectedScopeEvidence, id]; render(); }));
  document.querySelector("#submit-scope")?.addEventListener("click", submitScope);

  document.querySelectorAll("[data-task]").forEach(button => button.addEventListener("click", () => { const id = button.dataset.task; state.schedule = state.schedule.includes(id) ? state.schedule.filter(key => key !== id) : [...state.schedule, id]; render(); }));
  document.querySelector("#submit-schedule")?.addEventListener("click", submitSchedule);

  document.querySelectorAll("[data-meeting-evidence]").forEach(button => button.addEventListener("click", () => { const id = button.dataset.meetingEvidence; const selected = state.selectedMeetingEvidence.includes(id); if (!selected && state.selectedMeetingEvidence.length >= 3) return toast("最多带三张证据牌"); state.selectedMeetingEvidence = selected ? state.selectedMeetingEvidence.filter(key => key !== id) : [...state.selectedMeetingEvidence, id]; render(); }));
  document.querySelector("#meeting-reply")?.addEventListener("input", e => { state.meetingReply = e.target.value; save(); });
  document.querySelectorAll("[data-insert]").forEach(button => button.addEventListener("click", () => { const field = document.querySelector("#meeting-reply"); field.value += button.dataset.insert; state.meetingReply = field.value; field.focus(); }));
  document.querySelector("#submit-meeting")?.addEventListener("click", submitMeeting);

  document.querySelectorAll("[data-incident-action]").forEach(button => button.addEventListener("click", () => applyIncidentAction(button.dataset.incidentAction)));
  document.querySelector("#resolve-incident")?.addEventListener("click", submitIncident);

  document.querySelector("#late-reply")?.addEventListener("input", e => { state.lateReply = e.target.value; save(); });
  document.querySelector("#submit-reply")?.addEventListener("click", submitReply);
  document.querySelector("#ask-friend")?.addEventListener("click", async () => { const text = "老板深夜问我‘在吗？’，你会怎么回？来当我的职场观察员。"; try { await navigator.clipboard.writeText(text); toast("好友求助口令已复制"); } catch { toast("口令生成成功：截图发给好友吧"); } });

  document.querySelector("#friend-support")?.addEventListener("click", () => { state.friendVotes.support += 1; save(); render(); });
  document.querySelector("#share-scene")?.addEventListener("click", async () => { const text = `来当我的观察团：我刚刚在“${chapters[state.chapter].title}”里做了一个决定。你觉得我能拿到 Offer 吗？`; try { await navigator.clipboard.writeText(text); toast("挑战口令已复制"); } catch { toast("截图发给好友即可参与"); } });
  document.querySelector("#continue-story")?.addEventListener("click", () => { if (state.chapter < chapters.length - 1) { state.chapter += 1; state.screen = "chapter"; } else state.screen = "interview"; save(); render(); });

  document.querySelectorAll("[data-answer]").forEach(field => field.addEventListener("input", e => { state.answers[Number(e.target.dataset.answer)] = e.target.value; save(); }));
  document.querySelector("#interview-form")?.addEventListener("submit", e => { e.preventDefault(); if (state.answers.some(answer => answer.trim().length < 12)) return toast("两道答辩题都至少写 12 个字"); evaluateInterview(); state.screen = "result"; state.streak += 1; save(); render(); });
  document.querySelector("#copy-result")?.addEventListener("click", async () => { const end = ending(); const text = `我以${currentRole().name}身份出演《周五18:30》，第一周获得 ${end.grade} 级结局：${end.title}。\n我的本周高光：\n${state.highlights.map(item => `- ${item}`).join("\n")}\n#IP副本计划 #互联网打工人`; try { await navigator.clipboard.writeText(text); toast("高光文案已复制"); } catch { toast("复制失败，请截图分享"); } });
  document.querySelector("#reserve-next")?.addEventListener("click", () => toast("已预约第二周：绩效沟通"));
  document.querySelector("#switch-role")?.addEventListener("click", () => returnToCasting(true));
  document.querySelector("#restart-game")?.addEventListener("click", restartCurrentRole);
}

function startMeetingTimer() {
  stopTimer();
  timerHandle = window.setInterval(() => {
    if (state.screen !== "chapter" || chapters[state.chapter]?.type !== "meeting") return stopTimer();
    state.meetingSeconds = Math.max(0, state.meetingSeconds - 1);
    const clock = document.querySelector("#meeting-clock");
    const bar = document.querySelector("#meeting-bar");
    const interrupt = document.querySelector("#meeting-interrupt");
    if (clock) clock.textContent = String(state.meetingSeconds).padStart(2, "0");
    if (bar) bar.style.width = `${(state.meetingSeconds / 60) * 100}%`;
    if (interrupt && state.meetingSeconds === 40) interrupt.textContent = "Amy 打断：请不要把补充场景说成需求变更。";
    if (interrupt && state.meetingSeconds === 22) interrupt.textContent = "王总追问：我需要一个明确结论。";
    if (state.meetingSeconds === 0) { stopTimer(); if (interrupt) interrupt.textContent = "发言超时。你仍可提交，但抗压评价会下降。"; effect("resilience", -5); save(); }
  }, 1000);
}

function render() {
  stopTimer();
  const screens = { landing: renderLanding, role: renderRole, chapter: renderChapter, observer: renderObserver, interview: renderInterview, result: renderResult };
  app.innerHTML = `<div class="app-shell">${screens[state.screen]()}${state.toast ? `<div class="toast" role="status">${state.toast}</div>` : ""}</div>`;
  bindEvents();
  if (state.screen === "chapter" && chapters[state.chapter].type === "meeting" && state.meetingSeconds > 0) startMeetingTimer();
  window.scrollTo({ top: 0, behavior: "instant" });
}

render();
