// ========== modules.js · 模块渲染层 ==========
// 小蓝UP UP · WorkBuddy 各模块内容渲染

const Modules = {

  // ==================== 首页 ====================
  renderHome() {
    const greeting = Engine.getGreeting();
    const phase = Engine.getMenstrualPhase();
    const status = Store.get('todayStatus', SEED.todayStatus);

    document.getElementById('greetingText').textContent = greeting.greeting;
    document.getElementById('greetingSub').textContent = greeting.sub;
    document.getElementById('phaseBadge').textContent = `📅 ${phase.name} · 强度${Engine.getIntensityCoef().toFixed(1)}`;
    document.getElementById('topbarSub').textContent = `${Engine._dayInfo()} · ${phase.name}`;

    // 模块进度
    const progress = {
      health: Engine.getModuleProgress('health'),
      learning: Engine.getModuleProgress('learning'),
      professional: Engine.getModuleProgress('professional'),
      music: Engine.getModuleProgress('music')
    };
    document.getElementById('modHealthSub').textContent = progress.health + '%';
    document.getElementById('modHealthBar').style.width = progress.health + '%';
    document.getElementById('modLearningSub').textContent = progress.learning + '%';
    document.getElementById('modLearningBar').style.width = progress.learning + '%';
    document.getElementById('modProSub').textContent = progress.professional + '%';
    document.getElementById('modProBar').style.width = progress.professional + '%';
    document.getElementById('modMusicSub').textContent = progress.music + '%';
    document.getElementById('modMusicBar').style.width = progress.music + '%';

    // 今日任务
    const { tasks, coef } = Engine.getTodayTasks();
    const taskList = document.getElementById('todayTasks');
    const taskLog = Store.get('taskLog', {});
    const todayLog = taskLog[Engine.today()] || {};

    taskList.innerHTML = tasks.map(t => {
      const done = todayLog[t.id] === true;
      const cancelled = t.cancelled;
      const catColor = { health: 'var(--health)', learning: 'var(--learning)', music: 'var(--music)', pro: 'var(--pro)' };
      return `<li class="task-item">
        <div class="task-check ${done ? 'done' : ''} ${cancelled ? 'cancelled' : ''}" onclick="UI.toggleTask('${t.id}')">${done ? '✓' : ''}</div>
        <div class="task-content">
          <div class="task-name ${done ? 'done' : ''} ${cancelled ? 'cancelled' : ''}">${t.name} ${t.required ? '<span class="tag tag-danger" style="font-size:0.6rem;padding:1px 6px">必做</span>' : '<span class="tag tag-info" style="font-size:0.6rem;padding:1px 6px">可选</span>'}</div>
          <div class="task-reason">${t.reason}</div>
        </div>
        <div class="task-time">${cancelled ? '已取消' : t.time}</div>
      </li>`;
    }).join('');

    // 时间轴
    const timeline = document.getElementById('todayTimeline');
    const tlItems = Engine.getTimeline();
    timeline.innerHTML = tlItems.map(item => {
      const icons = { work: '💼', health: '🌿', learning: '📚', music: '🎵' };
      return `<div class="timeline-item">
        <div class="timeline-time">${item.time}</div>
        <div class="timeline-content">${icons[item.type] || ''} ${item.content}</div>
      </div>`;
    }).join('');

    // 智能提醒
    const reminders = Engine.getSmartReminders();
    const reminderEl = document.getElementById('smartReminder');
    if (reminders.length > 0) {
      reminderEl.style.display = 'block';
      document.getElementById('reminderContent').innerHTML = reminders.map(r => `<div style="padding:4px 0">💡 ${r}</div>`).join('');
    } else {
      reminderEl.style.display = 'none';
    }

    // 每日简报
    this.renderDailyBriefing();
    // 每周计划
    this.renderWeeklyPlan();
    // 饮水追踪
    this.renderWaterTracker();
  },

  // ==================== 健康模块 ====================
  renderHealth() {
    // 体质标签
    const constitution = Store.get('constitution', SEED.constitution);
    document.getElementById('constitutionTags').innerHTML = constitution.map(c =>
      `<div style="margin-bottom:8px">
        <span class="tag ${c.warn ? 'tag-danger' : 'tag-health'}">${c.label}</span>
        <span class="text-sm text-muted">${c.desc}</span>
        <div class="text-xs text-muted" style="margin-left:4px;margin-top:2px">📋 ${c.rule}</div>
      </div>`
    ).join('');

    // 经期信息
    this._renderMenstrualInfo();

    // 今日状态
    this._renderTodayStatus();

    // 运动规划
    this._renderExercisePlan();

    // 运动偏好
    this._renderExercisePrefs();

    // 饮食
    this._renderDietPlan();

    // 面部改善
    this._renderFaceProgram();
  },

  _renderMenstrualInfo() {
    const phase = Engine.getMenstrualPhase();
    const m = Store.get('menstrual', SEED.menstrual);
    const el = document.getElementById('menstrualInfo');

    if (phase.phase === 'unknown') {
      el.innerHTML = `<div class="empty-state">
        <div class="icon">📅</div>
        <p>尚未设置经期起始日期</p>
        <button class="btn btn-primary btn-sm mt-2" onclick="UI.markPeriod()">设置经期</button>
      </div>`;
      return;
    }

    el.innerHTML = `
      <div class="stat-row"><span class="stat-label">当前阶段</span><span class="stat-value">${phase.name}</span></div>
      <div class="stat-row"><span class="stat-label">经期第</span><span class="stat-value">${phase.day}天</span></div>
      <div class="stat-row"><span class="stat-label">距下次经期</span><span class="stat-value">${phase.countdown > 0 ? phase.countdown + '天' : '已到/已过'}</span></div>
      <div class="stat-row"><span class="stat-label">周期长度</span><span class="stat-value">${m.cycleLength}天</span></div>
      <div class="stat-row"><span class="stat-label">强度系数</span><span class="stat-value">${Engine.getIntensityCoef().toFixed(2)}</span></div>
      <div class="mt-2">
        <button class="btn btn-outline btn-sm" onclick="UI.markPeriod()">更新经期</button>
      </div>`;
  },

  _renderTodayStatus() {
    const status = Store.get('todayStatus', SEED.todayStatus);
    const coef = Engine.getIntensityCoef();
    const el = document.getElementById('todayStatus');

    const stateLabels = {
      normal: '😊 正常',
      fatigue: '😴 疲劳',
      fire: '🔥 上火',
      unwell: '🤒 不适',
      throat: '😷 嗓子不适'
    };

    el.innerHTML = `
      <div class="stat-row"><span class="stat-label">身体状态</span><span class="stat-value">${stateLabels[status.bodyState] || '正常'}</span></div>
      <div class="stat-row"><span class="stat-label">疲劳度</span><span class="stat-value">${'★'.repeat(status.fatigue)}${'☆'.repeat(5 - status.fatigue)}</span></div>
      <div class="stat-row"><span class="stat-label">精力评分</span><span class="stat-value">${'★'.repeat(status.energy)}${'☆'.repeat(5 - status.energy)}</span></div>
      <div class="stat-row"><span class="stat-label">加班状态</span><span class="stat-value">${status.overtime ? '📋 今日加班' : '正常'}</span></div>
      <div class="stat-row"><span class="stat-label">推荐强度系数</span><span class="stat-value" style="color:var(--accent)">${coef.toFixed(2)}</span></div>
      <div class="mt-2" style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-outline btn-sm" onclick="UI.markBodyState()">更新状态</button>
        <button class="btn btn-outline btn-sm" onclick="UI.markOvertime()">${status.overtime ? '取消加班' : '标记加班'}</button>
      </div>`;
  },

  _renderExercisePlan() {
    const { plan, coef, phase, dayInfo } = Engine.generateExercisePlan();
    const el = document.getElementById('exercisePlan');

    el.innerHTML = `
      <div class="text-sm text-muted mb-2">${dayInfo} | ${phase} | 强度系数${coef.toFixed(1)}</div>
      ${plan.map(p => `
        <div class="task-item">
          <div class="task-check ${p.cancelled ? 'cancelled' : ''}" style="${p.required ? 'border-color:var(--health)' : ''}">${p.cancelled ? '✗' : ''}</div>
          <div class="task-content">
            <div class="task-name ${p.cancelled ? 'cancelled' : ''}">${p.name}
              ${p.required ? '<span class="tag tag-danger" style="font-size:0.6rem;padding:1px 6px;margin-left:4px">必做</span>' : ''}
              ${p.optional ? '<span class="tag tag-info" style="font-size:0.6rem;padding:1px 6px;margin-left:4px">可选</span>' : ''}
            </div>
            <div class="task-reason">${p.reason}</div>
            ${!p.cancelled ? `<div class="task-reason">⏱ ${p.duration}</div>` : ''}
          </div>
          <div class="task-time">${p.cancelled ? '取消' : p.time}</div>
        </div>
      `).join('')}`;
  },

  _renderExercisePrefs() {
    const prefs = Store.get('exercisePrefs', SEED.exercisePrefs);
    document.getElementById('exercisePrefs').innerHTML = prefs.map(p => `
      <div class="diet-item">
        <div>
          <div class="diet-meal">${p.name} ${p.dormant ? '<span class="tag tag-warn" style="font-size:0.6rem">休眠中</span>' : ''}</div>
          <div class="diet-food">${p.type} · ${p.duration}</div>
        </div>
        <div class="text-xs text-muted" style="text-align:right">⚠️ ${p.constraint}</div>
      </div>
    `).join('');
  },

  _renderDietPlan() {
    const { template, phase, isFireUp } = Engine.generateDietPlan();
    document.getElementById('dietPlan').innerHTML = `
      ${isFireUp ? '<div class="tag tag-warn mb-2">🔥 上火模式 · 已切换清润食谱</div>' : ''}
      <div class="text-sm text-muted mb-2">当前阶段：${phase}</div>
      <div class="diet-item"><div class="diet-meal">🌅 早餐</div><div class="diet-food">${template.breakfast}</div></div>
      <div class="diet-item"><div class="diet-meal">☀️ 午餐</div><div class="diet-food">${template.lunch}</div></div>
      <div class="diet-item"><div class="diet-meal">🌙 晚餐</div><div class="diet-food">${template.dinner}</div></div>
    `;
    document.getElementById('teaPlan').innerHTML = `<div class="text-sm">🍵 ${template.tea}</div>`;
    document.getElementById('dietBlacklist').textContent = Store.get('dietBlacklist', SEED.dietBlacklist).join('、');
  },

  _renderFaceProgram() {
    const fp = Store.get('faceProgram', SEED.faceProgram);
    const el = document.getElementById('faceProgram');

    el.innerHTML = `
      <!-- 优势 -->
      <div class="expandable" onclick="this.classList.toggle('open')">
        <div style="font-weight:600;font-size:0.9rem">✨ 原生优势 <span class="chevron">›</span></div>
      </div>
      <div class="expandable-content">
        ${fp.advantages.map(a => `<div class="text-sm" style="padding:2px 0">• ${a}</div>`).join('')}
      </div>
      <div class="divider"></div>

      <!-- 核心问题 -->
      <div class="expandable" onclick="this.classList.toggle('open')">
        <div style="font-weight:600;font-size:0.9rem">🔍 核心问题分析 <span class="chevron">›</span></div>
      </div>
      <div class="expandable-content">
        ${fp.issues.map(i => `<div class="face-exercise">
          <div class="fe-name">${i.area}：${i.issue}</div>
          <div class="fe-desc">${i.detail}</div>
        </div>`).join('')}
      </div>
      <div class="divider"></div>

      <!-- 面部矫正锻炼 -->
      <div class="expandable" onclick="this.classList.toggle('open')">
        <div style="font-weight:600;font-size:0.9rem">💪 面部矫正锻炼（早晚12分钟） <span class="chevron">›</span></div>
      </div>
      <div class="expandable-content">
        <div class="text-sm font-bold mt-2 mb-1" style="color:var(--health)">通用基础训练</div>
        ${fp.exercises.basic.map(e => `<div class="face-exercise">
          <div class="fe-name">${e.name}</div>
          <div class="fe-desc">${e.desc}</div>
          <div class="fe-count">${e.count}</div>
        </div>`).join('')}
        <div class="text-sm font-bold mt-2 mb-1" style="color:var(--health)">大小脸每日加练3分钟</div>
        ${fp.exercises.asymmetry.map(e => `<div class="face-exercise">
          <div class="fe-name">${e.name}</div>
          <div class="fe-desc">${e.desc}</div>
          <div class="fe-count">${e.count}</div>
        </div>`).join('')}
        <div class="text-sm mt-2" style="background:var(--bg);padding:8px;border-radius:8px">
          <strong>📋 每日流程：</strong>${fp.exercises.routine}
        </div>
      </div>
      <div class="divider"></div>

      <!-- 饮食习惯 -->
      <div class="expandable" onclick="this.classList.toggle('open')">
        <div style="font-weight:600;font-size:0.9rem">🚫 必须改掉的习惯 <span class="chevron">›</span></div>
      </div>
      <div class="expandable-content">
        ${fp.exercises.habits.map(h => `<div class="text-sm" style="padding:3px 0">• ${h}</div>`).join('')}
      </div>
      <div class="divider"></div>

      <!-- 食疗内调 -->
      <div class="expandable" onclick="this.classList.toggle('open')">
        <div style="font-weight:600;font-size:0.9rem">🍵 食疗内调方案 <span class="chevron">›</span></div>
      </div>
      <div class="expandable-content">
        ${fp.diet.directions.map(d => `<div class="face-exercise" style="border-left-color:var(--learning)">
          <div class="fe-name">${d.title}</div>
          ${d.items.map(i => `<div class="fe-desc">• ${i}</div>`).join('')}
        </div>`).join('')}
        <div class="text-sm mt-2" style="background:var(--bg);padding:8px;border-radius:8px">
          <strong>基础原则：</strong>${fp.diet.rules}
        </div>
      </div>
      <div class="divider"></div>

      <!-- 改善周期 -->
      <div class="card" style="background:var(--bg);margin:0">
        <div style="font-weight:600;font-size:0.9rem;margin-bottom:6px">📅 改善周期与局限</div>
        <div class="text-sm text-muted">${fp.timeline}</div>
      </div>
    `;
  },

  // ==================== 学习模块 ====================
  renderLearning() {
    this._renderEnTask();
    this._renderYueTask();
    this._renderKoTask();
    this._renderFinance();
    this._renderMedia();
    this._renderEnBriefing();
    this._renderDailyWords();
    this._renderDailySentences();
    this._renderFinanceBriefing();
    this._renderMediaBriefing();
    this._renderAllResources();
    this._renderAllNotes();
  },

  _renderEnTask() {
    const task = Engine.generateLearningTask('en');
    const el = document.getElementById('enTask');
    el.innerHTML = `
      <div class="text-sm text-muted mb-2">${Engine._dayInfo()}</div>
      <div style="background:var(--bg);padding:10px;border-radius:10px;margin-bottom:8px">
        <div style="font-weight:600;font-size:0.88rem">📌 主任务：${task.main.title}</div>
        <div class="text-sm text-muted mt-1">⏱ ${task.main.duration}</div>
        <div class="text-sm mt-1">${task.main.desc}</div>
        ${task.main.link ? `<a href="${task.main.link}" target="_blank" class="resource-link mt-1" style="display:inline-block">🔗 ${task.main.link}</a>` : ''}
      </div>
      <div style="background:var(--bg);padding:10px;border-radius:10px;margin-bottom:8px">
        <div style="font-weight:600;font-size:0.88rem">📌 单词打卡：今日${task.words.length}词</div>
        ${task.words.map(w => `<div class="mt-1" style="padding:4px 0;border-bottom:1px solid var(--rule)">
          <span style="font-weight:600">${w.word}</span> <span class="text-muted text-sm">/ ${w.meaning}</span>
          <div class="text-xs text-muted">例：${w.example}</div>
        </div>`).join('')}
      </div>
      ${task.travel ? `<div style="background:rgba(243,156,18,0.08);padding:10px;border-radius:10px;margin-bottom:8px">
        <div style="font-weight:600;font-size:0.88rem;color:var(--music)">${task.travel.title}</div>
        ${task.travel.sentences.map(s => `<div class="text-sm mt-1">• "${s}"</div>`).join('')}
      </div>` : ''}
      <div class="text-sm text-muted">📝 ${task.note}</div>
    `;
  },

  _renderYueTask() {
    const task = Engine.generateLearningTask('yue');
    const el = document.getElementById('yueTask');
    el.innerHTML = `
      <div class="text-sm text-muted mb-2">${Engine._dayInfo()}</div>
      <div style="background:var(--bg);padding:10px;border-radius:10px;margin-bottom:8px">
        <div style="font-weight:600;font-size:0.88rem">📌 主任务：${task.main.title}</div>
        <div class="text-sm text-muted mt-1">⏱ ${task.main.duration}</div>
        <div class="text-sm mt-1">${task.main.desc}</div>
      </div>
      <div style="background:var(--bg);padding:10px;border-radius:10px;margin-bottom:8px">
        <div style="font-weight:600;font-size:0.88rem">📌 重点句跟读：</div>
        ${task.sentences.map(s => `<div class="mt-1" style="padding:4px 0">
          <div style="font-size:0.86rem">"${s.text}"</div>
          <div class="text-xs text-muted">粤拼：${s.jyutping}</div>
        </div>`).join('')}
      </div>
      <div class="text-sm" style="color:var(--music)">🎵 ${task.weekendLyric}</div>
      <div class="text-sm text-muted mt-1">📝 ${task.note}</div>
    `;
  },

  _renderKoTask() {
    const task = Engine.generateLearningTask('ko');
    const el = document.getElementById('koTask');
    el.innerHTML = `
      <div class="text-sm text-muted mb-2">${Engine._dayInfo()} · ${task.weekInfo}</div>
      <div style="background:var(--bg);padding:10px;border-radius:10px;margin-bottom:8px">
        <div style="font-weight:600;font-size:0.88rem">📌 ${task.main.title}</div>
        <div class="text-sm text-muted mt-1">⏱ ${task.main.duration}</div>
        <div class="text-sm mt-1">${task.main.desc}</div>
      </div>
      <div style="background:var(--bg);padding:10px;border-radius:10px;margin-bottom:8px">
        <div style="font-weight:600;font-size:0.84rem">复习字母：${task.reviewLetters.map(l => l.letter).join(' ')}</div>
        <div style="font-weight:600;font-size:0.84rem;margin-top:4px">新字母：${task.newLetters.map(l => `${l.letter}(${l.roman})`).join(' ')}</div>
      </div>
      <div style="background:var(--bg);padding:10px;border-radius:10px;margin-bottom:8px">
        <div style="font-weight:600;font-size:0.88rem">📌 短句学习</div>
        <div style="font-size:1rem;margin-top:4px">${task.sentence.text}</div>
        <div class="text-sm text-muted">意思：${task.sentence.meaning}</div>
        <div class="text-xs text-muted mt-1">拆解：${task.sentence.breakdown}</div>
      </div>
      <div class="text-sm" style="color:var(--music)">🎬 ${task.weekendDrama}</div>
      <div class="text-sm text-muted mt-1">📝 ${task.note}</div>
    `;
  },

  _renderFinance() {
    const data = Store.get('financeData', SEED.financeData);
    const dayIdx = (new Date().getDate() - 1) % data.concepts.length;

    document.getElementById('financeCard').innerHTML = `
      <div class="concept-card">
        <div class="cc-title">📖 ${data.concepts[dayIdx].title}</div>
        <div class="cc-body">${data.concepts[dayIdx].desc}</div>
      </div>
      <div class="text-xs text-muted">共${data.concepts.length}个概念卡片，按学习路线图顺序推送</div>
    `;

    const actionIdx = (new Date().getDate() - 1) % data.actions.length;
    document.getElementById('financeAction').innerHTML = `
      <div style="background:var(--bg);padding:10px;border-radius:10px">
        <div style="font-weight:600;font-size:0.88rem">✅ ${data.actions[actionIdx].title}</div>
        <div class="text-sm text-muted mt-1">${data.actions[actionIdx].desc}</div>
      </div>
    `;

    const b = data.monthlyBudget;
    const totalExpense = b.rent + b.food + b.transport + b.shopping + b.entertainment;
    const savingsRate = ((b.savings / b.income) * 100).toFixed(0);
    document.getElementById('financeHealth').innerHTML = `
      <div class="stat-row"><span class="stat-label">月收入</span><span class="stat-value">¥${b.income.toLocaleString()}</span></div>
      <div class="stat-row"><span class="stat-label">必要支出</span><span class="stat-value">¥${(b.rent + b.food + b.transport).toLocaleString()}</span></div>
      <div class="stat-row"><span class="stat-label">弹性支出</span><span class="stat-value">¥${(b.shopping + b.entertainment).toLocaleString()}</span></div>
      <div class="stat-row"><span class="stat-label">储蓄</span><span class="stat-value" style="color:var(--success)">¥${b.savings.toLocaleString()}（${savingsRate}%）</span></div>
      <div class="mt-2 text-xs text-muted">💡 储蓄率${savingsRate}%${savingsRate >= 40 ? '，非常健康！' : '，建议提升至40%以上'}</div>
    `;
  },

  _renderMedia() {
    const data = Store.get('mediaData', SEED.mediaData);
    const flag = data.flags[0];
    document.getElementById('mediaFlag').innerHTML = `
      <div style="background:var(--bg);padding:12px;border-radius:10px">
        <div style="font-weight:700;font-size:0.95rem">🚩 ${flag.theme}</div>
        <div class="text-sm text-muted mt-1">${flag.desc}</div>
        <div class="mt-2">
          <div class="text-xs text-muted mb-1">进度</div>
          <div style="height:6px;background:var(--rule);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${flag.progress}%;background:var(--music);border-radius:3px"></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('mediaCalendar').innerHTML = data.calendar.map(c => `
      <div class="diet-item">
        <div>
          <div class="diet-meal">${c.day} ${c.time}</div>
          <div class="diet-food">${c.action}</div>
        </div>
        <span class="tag tag-music">${c.type}</span>
      </div>
    `).join('');

    document.getElementById('mediaRap').innerHTML = `
      ${data.rap.tracks.map(t => `<div class="diet-item">
        <div>
          <div class="diet-meal">${t.title}</div>
          <div class="diet-food">${t.desc}</div>
        </div>
        <span class="tag ${t.status === '进行中' ? 'tag-success' : 'tag-info'}">${t.status}</span>
      </div>`).join('')}
      <div class="text-sm text-muted mt-2">💡 ${data.rap.tips}</div>
    `;
  },

  // ==================== 学习页面动态内容（来自daily-briefing.js） ====================
  _renderEnBriefing() {
    const briefing = Engine.getDailyBriefing();
    const card = document.getElementById('enBriefingCard');
    const el = document.getElementById('enBriefingContent');
    if (!card || !el) return;
    if (!briefing || !briefing.language || !briefing.language.items) {
      card.style.display = 'none';
      return;
    }
    card.style.display = 'block';
    el.innerHTML = `
      <div class="text-xs text-muted mb-2">📅 ${briefing.date || Engine.today()} · 每日自动更新</div>
      ${briefing.language.items.map(item => `
        <div class="concept-card" style="border-color:rgba(46,204,113,0.15);background:linear-gradient(135deg,rgba(46,204,113,0.08),rgba(46,204,113,0.02));margin-bottom:8px">
          <div class="cc-title" style="font-size:0.84rem;color:var(--learning)">${item.title}</div>
          <div class="cc-body" style="font-size:0.78rem">${item.content}</div>
          ${item.link ? `<a href="${item.link}" target="_blank" class="resource-link" style="font-size:0.76rem;display:inline-block;margin-top:4px">${item.linkText || '前往学习'} ›</a>` : ''}
        </div>
      `).join('')}
    `;
  },

  _renderDailyWords() {
    const briefing = Engine.getDailyBriefing();
    const card = document.getElementById('dailyWordsCard');
    const el = document.getElementById('dailyWordsContent');
    if (!card || !el) return;
    if (!briefing || !briefing.language || !briefing.language.dailyWords) {
      card.style.display = 'none';
      return;
    }
    card.style.display = 'block';
    const words = briefing.language.dailyWords;
    el.innerHTML = `
      <div class="text-xs text-muted mb-2">📅 ${briefing.date || Engine.today()} · 每日5词自动轮换</div>
      ${words.map(w => `
        <div class="diet-item" style="align-items:flex-start;padding:10px 0">
          <div style="flex:1">
            <div style="font-weight:700;font-size:0.92rem">${w.word} <span class="text-xs text-muted">${w.phonetic || ''}</span></div>
            <div class="text-sm text-muted">${w.meaning}</div>
            <div class="text-xs mt-1" style="color:var(--learning)">例：${w.example}</div>
          </div>
        </div>
      `).join('')}
    `;
  },

  _renderDailySentences() {
    const briefing = Engine.getDailyBriefing();
    const card = document.getElementById('dailySentencesCard');
    const el = document.getElementById('dailySentencesContent');
    if (!card || !el) return;
    if (!briefing || !briefing.language || !briefing.language.dailySentences) {
      card.style.display = 'none';
      return;
    }
    card.style.display = 'block';
    const s = briefing.language.dailySentences;
    el.innerHTML = `
      <div class="text-xs text-muted mb-2">📅 ${briefing.date || Engine.today()} · 三语情景句每日更新</div>
      <div style="background:rgba(26,115,232,0.06);padding:12px;border-radius:10px;margin-bottom:8px;border-left:3px solid var(--accent)">
        <div style="font-weight:700;font-size:0.9rem">🇬🇧 ${s.en.text}</div>
        <div class="text-sm text-muted mt-1">${s.en.translation}</div>
        ${s.en.focus ? `<div class="text-xs mt-1" style="color:var(--accent)">重点：${s.en.focus}</div>` : ''}
      </div>
      <div style="background:rgba(243,156,18,0.06);padding:12px;border-radius:10px;margin-bottom:8px;border-left:3px solid var(--music)">
        <div style="font-weight:700;font-size:0.9rem">🇭🇰 ${s.yue.text}</div>
        <div class="text-xs text-muted mt-1">粤拼：${s.yue.jyutping}</div>
        <div class="text-sm text-muted">${s.yue.translation}</div>
      </div>
      <div style="background:rgba(46,204,113,0.06);padding:12px;border-radius:10px;border-left:3px solid var(--learning)">
        <div style="font-weight:700;font-size:0.9rem">🇰🇷 ${s.ko.text}</div>
        <div class="text-xs text-muted mt-1">罗马音：${s.ko.roman}</div>
        <div class="text-sm text-muted">${s.ko.translation}</div>
      </div>
    `;
  },

  _renderFinanceBriefing() {
    const briefing = Engine.getDailyBriefing();
    const card = document.getElementById('financeBriefingCard');
    const el = document.getElementById('financeBriefingContent');
    if (!card || !el) return;
    if (!briefing || !briefing.investment) {
      card.style.display = 'none';
      return;
    }
    card.style.display = 'block';
    const inv = briefing.investment;
    let html = `<div class="text-xs text-muted mb-2">📅 ${briefing.date || Engine.today()} · 每日自动更新</div>`;
    if (inv.marketTrend) {
      html += `<div class="text-sm" style="background:var(--bg);padding:10px;border-radius:10px;margin-bottom:8px;line-height:1.6">${inv.marketTrend}</div>`;
    }
    if (inv.suggestions) {
      html += inv.suggestions.map(item => `
        <div class="concept-card" style="border-color:rgba(243,156,18,0.15);background:linear-gradient(135deg,rgba(243,156,18,0.08),rgba(243,156,18,0.02));margin-bottom:8px">
          <div class="cc-title" style="font-size:0.84rem;color:var(--music)">${item.title}</div>
          <div class="cc-body" style="font-size:0.78rem">${item.content}</div>
          ${item.link ? `<a href="${item.link}" target="_blank" class="resource-link" style="font-size:0.76rem;display:inline-block;margin-top:4px">查看详情 ›</a>` : ''}
        </div>
      `).join('');
    }
    el.innerHTML = html;
  },

  _renderMediaBriefing() {
    const briefing = Engine.getDailyBriefing();
    const card = document.getElementById('mediaBriefingCard');
    const el = document.getElementById('mediaBriefingContent');
    if (!card || !el) return;
    if (!briefing || !briefing.selfmedia || !briefing.selfmedia.items) {
      card.style.display = 'none';
      return;
    }
    card.style.display = 'block';
    el.innerHTML = `
      <div class="text-xs text-muted mb-2">📅 ${briefing.date || Engine.today()} · 每日自动更新</div>
      ${briefing.selfmedia.items.map(item => `
        <div class="frontier-item" style="padding:8px 0">
          <div class="frontier-title" style="font-size:0.84rem">🔥 ${item.title}</div>
          <div class="frontier-desc" style="font-size:0.78rem">${item.content}</div>
          <div class="text-xs text-muted">来源：${item.source || ''}</div>
        </div>
      `).join('')}
    `;
  },

  // ==================== 专业页面动态内容（来自daily-briefing.js） ====================
  _renderProBriefing() {
    const briefing = Engine.getDailyBriefing();
    const card = document.getElementById('proBriefingCard');
    const el = document.getElementById('proBriefingContent');
    if (!card || !el) return;
    if (!briefing || !briefing.professional) {
      card.style.display = 'none';
      return;
    }
    card.style.display = 'block';
    const pro = briefing.professional;
    let html = `<div class="text-xs text-muted mb-2">📅 ${briefing.date || Engine.today()} · 每日自动更新</div>`;

    if (pro.knowledgePoints && pro.knowledgePoints.length > 0) {
      html += `<div class="text-xs text-muted mb-1">📖 今日AI知识点</div>`;
      pro.knowledgePoints.forEach(item => {
        html += `<div class="concept-card" style="margin-bottom:8px">
          <div class="cc-title" style="font-size:0.84rem">${item.title}</div>
          <div class="cc-body" style="font-size:0.78rem">${item.content}</div>
          ${item.link ? `<a href="${item.link}" target="_blank" class="resource-link" style="font-size:0.76rem;display:inline-block;margin-top:4px">查看详情 ›</a>` : ''}
        </div>`;
      });
    }

    if (pro.industryNews && pro.industryNews.length > 0) {
      html += `<div class="text-xs text-muted mb-1 mt-2">📡 今日行业动态</div>`;
      pro.industryNews.forEach(item => {
        html += `<div class="frontier-item" style="padding:8px 0">
          <div class="frontier-title" style="font-size:0.84rem">${item.title}</div>
          <div class="frontier-desc" style="font-size:0.78rem">${item.content}</div>
          <div class="text-xs text-muted">${item.source || ''} ${item.link ? `<a href="${item.link}" target="_blank" class="resource-link" style="font-size:0.72rem">阅读 ›</a>` : ''}</div>
        </div>`;
      });
    }

    el.innerHTML = html;
  },

  // ==================== 专业模块 ====================
  renderProfessional() {
    this._renderProBriefing();
    const theory = Engine.generateProTheory();
    document.getElementById('proTheory').innerHTML = `
      <div class="concept-card">
        <div class="cc-title">${theory.title}</div>
        <div class="cc-body">${theory.desc}</div>
        <div class="mt-2"><span class="tag tag-pro">${theory.cat}</span></div>
      </div>
    `;

    const frontiers = Engine.generateProFrontier();
    document.getElementById('proFrontier').innerHTML = frontiers.map(f => `
      <div class="frontier-item">
        <div class="frontier-title">${f.star ? '<span class="frontier-star">⭐</span> ' : ''}${f.title}</div>
        <div class="frontier-desc">${f.desc}</div>
        ${f.related ? '<div class="text-xs" style="color:var(--pro);margin-top:2px">🔗 与年度目标关联</div>' : ''}
      </div>
    `).join('');

    const knowledge = Engine.generateProKnowledge();
    document.getElementById('proKnowledge').innerHTML = knowledge.map(k => `
      <div class="diet-item">
        <div>
          <div class="diet-meal">${k.tag}</div>
          <div class="diet-food">最新：${k.latest}</div>
        </div>
        <span class="tag tag-pro">${k.count}篇</span>
      </div>
    `).join('');

    this._renderNotes('pro');
  },

  // ==================== 音乐模块 ====================
  renderMusic() {
    this._renderVocalTask();
    this._renderDrumTask();
    this._renderVocalBriefing();
    this._renderDrumBriefing();
    this._renderRepertoire('vocal');
    this._renderRepertoire('drum');
    this._renderMusicResources();
    this._renderMusicNotes();
  },

  _renderVocalTask() {
    const task = Engine.generateMusicTask('vocal');
    const el = document.getElementById('vocalTask');
    el.innerHTML = `
      <div class="text-sm text-muted mb-1">${Engine._dayInfo()}</div>
      <div class="tag tag-music mb-2">${task.mode}</div>
      <div class="text-xs text-muted mb-2">${task.modeDesc}</div>
      ${task.items.map(i => `
        <div style="background:var(--bg);padding:10px;border-radius:10px;margin-bottom:8px">
          <div style="font-weight:600;font-size:0.88rem">${i.name}</div>
          <div class="text-sm text-muted">⏱ ${i.duration}</div>
          <div class="text-sm mt-1">${i.detail}</div>
          ${i.link ? `<div class="text-xs" style="color:var(--accent);margin-top:2px">🔗 ${i.link}</div>` : ''}
        </div>
      `).join('')}
      ${task.target ? `<div class="text-sm" style="color:var(--music);font-weight:600">🎯 练习目标：${task.target}</div>` : ''}
      <div class="text-sm text-muted mt-1">📝 点击下方添加练习记录</div>
    `;
  },

  _renderDrumTask() {
    const task = Engine.generateMusicTask('drum');
    const el = document.getElementById('drumTask');
    el.innerHTML = `
      <div class="text-sm text-muted mb-1">${Engine._dayInfo()}</div>
      <div class="tag tag-music mb-2">${task.mode}</div>
      <div class="text-xs text-muted mb-2">${task.modeDesc}</div>
      ${task.items.map(i => `
        <div style="background:var(--bg);padding:10px;border-radius:10px;margin-bottom:8px">
          <div style="font-weight:600;font-size:0.88rem">${i.name}</div>
          <div class="text-sm text-muted">⏱ ${i.duration}</div>
          <div class="text-sm mt-1">${i.detail}</div>
          ${i.link ? `<div class="text-xs" style="color:var(--accent);margin-top:2px">🔗 ${i.link}</div>` : ''}
        </div>
      `).join('')}
      <div class="text-sm text-muted mt-1">📝 点击下方添加练习记录</div>
    `;
  },

  _renderVocalBriefing() {
    const briefing = Engine.getDailyBriefing();
    const card = document.getElementById('vocalBriefingCard');
    const el = document.getElementById('vocalBriefingContent');
    if (!card || !el) return;
    if (!briefing || !briefing.music || !briefing.music.vocal) {
      card.style.display = 'none';
      return;
    }
    card.style.display = 'block';
    const v = briefing.music.vocal;
    el.innerHTML = `
      <div class="text-xs text-muted mb-2">📅 ${briefing.date || Engine.today()} · 每日自动更新</div>
      <div style="background:var(--bg);padding:12px;border-radius:10px;margin-bottom:8px">
        <div style="font-weight:700;font-size:0.88rem;color:var(--music)">🔥 热身</div>
        <div class="text-sm mt-1">${v.warmup}</div>
      </div>
      <div style="background:var(--bg);padding:12px;border-radius:10px;margin-bottom:8px">
        <div style="font-weight:700;font-size:0.88rem;color:var(--music)">🎯 技术焦点</div>
        <div class="text-sm mt-1">${v.technique}</div>
      </div>
      <div style="background:rgba(243,156,18,0.06);padding:12px;border-radius:10px;margin-bottom:8px;border-left:3px solid var(--music)">
        <div style="font-weight:700;font-size:0.88rem;color:var(--music)">🎵 曲目练习</div>
        <div class="text-sm mt-1">${v.song}</div>
        <div class="text-xs text-muted mt-1">⏱ 建议时长：${v.duration}</div>
      </div>
    `;
  },

  _renderDrumBriefing() {
    const briefing = Engine.getDailyBriefing();
    const card = document.getElementById('drumBriefingCard');
    const el = document.getElementById('drumBriefingContent');
    if (!card || !el) return;
    if (!briefing || !briefing.music || !briefing.music.drum) {
      card.style.display = 'none';
      return;
    }
    card.style.display = 'block';
    const d = briefing.music.drum;
    el.innerHTML = `
      <div class="text-xs text-muted mb-2">📅 ${briefing.date || Engine.today()} · 每日自动更新</div>
      <div style="background:var(--bg);padding:12px;border-radius:10px;margin-bottom:8px">
        <div style="font-weight:700;font-size:0.88rem;color:var(--music)">🥁 基本功</div>
        <div class="text-sm mt-1">${d.rudiment}</div>
      </div>
      <div style="background:var(--bg);padding:12px;border-radius:10px;margin-bottom:8px">
        <div style="font-weight:700;font-size:0.88rem;color:var(--music)">🎵 节奏型</div>
        <div class="text-sm mt-1">${d.groove}</div>
        <div class="text-xs text-muted mt-1">速度：${d.tempo} · 建议时长：${d.duration}</div>
      </div>
    `;
  },

  _renderRepertoire(type) {
    const seedKey = type === 'vocal' ? 'vocalRepertoire' : 'drumRepertoire';
    const repertoire = Store.get(seedKey, SEED[seedKey]);
    const userRep = Store.get('userRepertoire', []).filter(r => r.direction === type);
    const all = [...repertoire, ...userRep];
    const elId = type === 'vocal' ? 'vocalRepertoire' : 'drumRepertoire';

    document.getElementById(elId).innerHTML = all.length === 0 ?
      `<div class="empty-state"><div class="icon">🎵</div><p>暂无曲目，点击添加</p></div>` :
      all.map((s, i) => `
        <div class="diet-item">
          <div style="flex:1">
            <div class="diet-meal">${s.title} - ${s.singer || ''}</div>
            <div class="diet-food">难度：${'★'.repeat(s.difficulty || 1)}${'☆'.repeat(5 - (s.difficulty || 1))} | 进度：${s.progress || 0}%</div>
            ${s.note ? `<div class="text-xs text-muted mt-1">📝 ${s.note}</div>` : ''}
          </div>
          <div style="width:50px;height:50px;position:relative;flex-shrink:0">
            <svg width="50" height="50" style="transform:rotate(-90deg)">
              <circle cx="25" cy="25" r="20" fill="none" stroke="var(--rule)" stroke-width="3"/>
              <circle cx="25" cy="25" r="20" fill="none" stroke="var(--music)" stroke-width="3"
                stroke-dasharray="${(s.progress || 0) * 1.26} 126" stroke-linecap="round"/>
            </svg>
            <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:0.7rem;font-weight:700;color:var(--music)">${s.progress || 0}%</span>
          </div>
        </div>
      `).join('');
  },

  // ==================== 资源渲染 ====================
  _renderAllResources() {
    this._renderResources('en', Store.get('enResources', SEED.enResources));
    this._renderResources('yue', Store.get('yueResources', SEED.yueResources));
    this._renderResources('ko', Store.get('koResources', SEED.koResources));
  },

  _renderResources(lang, res) {
    const elId = { en: 'enResources', yue: 'yueResources', ko: 'koResources' }[lang];
    const el = document.getElementById(elId);
    if (!el) return;

    const userRes = Store.get('userResources', []).filter(r => r.direction === lang);
    let html = '';

    // 链接资源
    if (res.links) {
      res.links.forEach(l => {
        html += `<div class="resource-item">
          <div class="resource-icon">🔗</div>
          <div class="resource-body">
            <div class="resource-title">${l.title}</div>
            <div class="resource-desc">${l.note || ''}</div>
            ${l.url ? `<a href="${l.url}" target="_blank" class="resource-link">${l.url}</a>` : ''}
          </div>
        </div>`;
      });
    }

    // 单词/句子
    if (res.words && res.words.length > 0) {
      html += `<div class="text-xs text-muted mt-2 mb-1">单词/句子（${res.words.length}条）</div>`;
      res.words.forEach(w => {
        html += `<div class="resource-item">
          <div class="resource-icon">📝</div>
          <div class="resource-body">
            <div class="resource-title">${w.word}${w.jyutping ? ` <span class="text-muted text-sm">(${w.jyutping})</span>` : ''}${w.roman ? ` <span class="text-muted text-sm">(${w.roman})</span>` : ''}</div>
            <div class="resource-desc">${w.meaning || ''} ${w.example ? '· ' + w.example : ''}</div>
          </div>
        </div>`;
      });
    }

    // 用户添加的资源
    if (userRes.length > 0) {
      html += `<div class="text-xs text-muted mt-2 mb-1">我的资源（${userRes.length}条）</div>`;
      userRes.forEach(r => {
        html += `<div class="resource-item">
          <div class="resource-icon">${r.type === '链接' ? '🔗' : r.type === '音频' ? '🎵' : '📝'}</div>
          <div class="resource-body">
            <div class="resource-title">${r.title}</div>
            ${r.url ? `<a href="${r.url}" target="_blank" class="resource-link">${r.url}</a>` : ''}
            <div class="resource-desc">${r.note || ''}</div>
            <div class="resource-actions">
              <button class="btn btn-sm btn-secondary" onclick="Store.set('userResources', Store.get('userResources',[]).filter(x=>x.id!=='${r.id}'));Modules._renderAllResources();UI.toast('已删除')">删除</button>
            </div>
          </div>
        </div>`;
      });
    }

    el.innerHTML = html || '<div class="empty-state"><div class="icon">📂</div><p>暂无资源</p></div>';
  },

  _renderMusicResources() {
    this._renderSingleMusicResources('vocal', Store.get('vocalResources', SEED.vocalResources));
    this._renderSingleMusicResources('drum', Store.get('drumResources', SEED.drumResources));
  },

  _renderSingleMusicResources(type, res) {
    const elId = type === 'vocal' ? 'vocalResources' : 'drumResources';
    const el = document.getElementById(elId);
    if (!el) return;

    const userRes = Store.get('userResources', []).filter(r => r.direction === type);
    let html = '';

    if (res.methods) {
      res.methods.forEach(m => {
        html += `<div class="resource-item">
          <div class="resource-icon">🔗</div>
          <div class="resource-body">
            <div class="resource-title">${m.title}</div>
            <div class="resource-desc">${m.note || ''}</div>
            ${m.url ? `<a href="${m.url}" target="_blank" class="resource-link">${m.url}</a>` : ''}
          </div>
        </div>`;
      });
    }

    if (res.techniques) {
      res.techniques.forEach(t => {
        html += `<div class="resource-item">
          <div class="resource-icon">🎯</div>
          <div class="resource-body">
            <div class="resource-title">${t.title}</div>
            <div class="resource-desc">${t.note || ''}</div>
          </div>
        </div>`;
      });
    }

    if (res.rhythms) {
      res.rhythms.forEach(r => {
        html += `<div class="resource-item">
          <div class="resource-icon">🥁</div>
          <div class="resource-body">
            <div class="resource-title">${r.title}</div>
            <div class="resource-desc">${r.note || ''}</div>
          </div>
        </div>`;
      });
    }

    if (res.coordination) {
      res.coordination.forEach(c => {
        html += `<div class="resource-item">
          <div class="resource-icon">🤸</div>
          <div class="resource-body">
            <div class="resource-title">${c.title}</div>
            <div class="resource-desc">${c.note || ''}</div>
          </div>
        </div>`;
      });
    }

    // User added
    if (userRes.length > 0) {
      html += `<div class="text-xs text-muted mt-2 mb-1">我的资源（${userRes.length}条）</div>`;
      userRes.forEach(r => {
        html += `<div class="resource-item">
          <div class="resource-icon">${r.type === '链接' ? '🔗' : r.type === '音频' ? '🎵' : '📝'}</div>
          <div class="resource-body">
            <div class="resource-title">${r.title}</div>
            ${r.url ? `<a href="${r.url}" target="_blank" class="resource-link">${r.url}</a>` : ''}
            <div class="resource-desc">${r.note || ''}</div>
            <div class="resource-actions">
              <button class="btn btn-sm btn-secondary" onclick="Store.set('userResources', Store.get('userResources',[]).filter(x=>x.id!=='${r.id}'));Modules._renderMusicResources();UI.toast('已删除')">删除</button>
            </div>
          </div>
        </div>`;
      });
    }

    el.innerHTML = html || '<div class="empty-state"><div class="icon">📂</div><p>暂无资源</p></div>';
  },

  // ==================== 笔记渲染 ====================
  _renderAllNotes() {
    this._renderNotes('en');
    this._renderNotes('yue');
    this._renderNotes('ko');
  },

  _renderMusicNotes() {
    this._renderNotes('vocal');
    this._renderNotes('drum');
  },

  _renderNotes(direction) {
    const elMap = { en: 'enNotes', yue: 'yueNotes', ko: 'koNotes', pro: 'proNotes', vocal: 'vocalNotes', drum: 'drumNotes' };
    const elId = elMap[direction];
    if (!elId) return;
    const el = document.getElementById(elId);
    if (!el) return;

    const notes = Store.get('userNotes', []).filter(n => n.direction === direction).sort((a, b) => b.createdAt - a.createdAt);

    if (notes.length === 0) {
      el.innerHTML = '<div class="empty-state"><div class="icon">📝</div><p>暂无笔记，点击添加</p></div>';
      return;
    }

    el.innerHTML = notes.map(n => `
      <div class="note-item">
        <div class="note-meta">${new Date(n.createdAt).toLocaleString('zh-CN')}</div>
        ${n.text ? `<div class="note-text">${n.text}</div>` : ''}
        ${n.link ? `<a href="${n.link}" target="_blank" class="note-link">🔗 ${n.link}</a>` : ''}
        ${n.tags ? `<div class="mt-1">${n.tags.split(',').map(t => `<span class="tag tag-info" style="font-size:0.6rem;padding:1px 6px">${t.trim()}</span>`).join('')}</div>` : ''}
        ${n.rating ? `<div class="star-rating mt-1">${'★'.repeat(n.rating)}${'☆'.repeat(5 - n.rating)}</div>` : ''}
        <div class="resource-actions mt-1">
          <button class="btn btn-sm btn-secondary" onclick="Store.set('userNotes', Store.get('userNotes',[]).filter(x=>x.id!=='${n.id}'));Modules._renderNotes('${direction}');UI.toast('已删除')">删除</button>
        </div>
      </div>
    `).join('');
  },

  // ==================== 每日简报 ====================
  renderDailyBriefing() {
    const briefing = Engine.getDailyBriefing();
    const card = document.getElementById('dailyBriefing');
    const el = document.getElementById('dailyBriefingContent');
    if (!card || !el) return;

    if (!briefing) {
      card.style.display = 'none';
      return;
    }

    card.style.display = 'block';
    let html = `<div class="text-xs text-muted mb-2">📅 ${briefing.date || Engine.today()} · ${briefing.generatedAt || ''}</div>`;

    // 饮食建议
    if (briefing.health) {
      html += `<div class="briefing-section">
        <div style="font-weight:700;font-size:0.9rem;color:var(--health);margin-bottom:6px">🥗 ${briefing.health.title || '饮食建议'}</div>
        <div class="text-sm" style="line-height:1.6;margin-bottom:8px">${briefing.health.diet || ''}</div>`;
      if (briefing.health.items) {
        briefing.health.items.forEach(item => {
          html += `<div class="concept-card" style="margin-bottom:6px">
            <div class="cc-title" style="font-size:0.84rem">${item.title}</div>
            <div class="cc-body" style="font-size:0.78rem">${item.content}</div>
            ${item.source ? `<div class="text-xs text-muted mt-1">来源：${item.source}</div>` : ''}
          </div>`;
        });
      }
      html += `</div>`;
    }

    // 语言学习
    if (briefing.language) {
      html += `<div class="briefing-section mt-4">
        <div style="font-weight:700;font-size:0.9rem;color:var(--learning);margin-bottom:6px">📚 ${briefing.language.title || '语言学习'}</div>`;
      if (briefing.language.items) {
        briefing.language.items.forEach(item => {
          html += `<div class="concept-card" style="border-color:rgba(46,204,113,0.15);background:linear-gradient(135deg,rgba(46,204,113,0.08),rgba(46,204,113,0.02));margin-bottom:6px">
            <div class="cc-title" style="font-size:0.84rem;color:var(--learning)">${item.title}</div>
            <div class="cc-body" style="font-size:0.78rem">${item.content}</div>
            ${item.link ? `<a href="${item.link}" target="_blank" class="resource-link" style="font-size:0.76rem;display:inline-block;margin-top:4px">${item.linkText || '前往学习'} ›</a>` : ''}
          </div>`;
        });
      }
      html += `</div>`;
    }

    // 专业赋能
    if (briefing.professional) {
      html += `<div class="briefing-section mt-4">
        <div style="font-weight:700;font-size:0.9rem;color:var(--pro);margin-bottom:6px">💡 ${briefing.professional.title || '专业赋能'}</div>`;
      if (briefing.professional.knowledgePoints) {
        html += `<div class="text-xs text-muted mb-1">📖 知识点</div>`;
        briefing.professional.knowledgePoints.forEach(item => {
          html += `<div class="concept-card" style="margin-bottom:6px">
            <div class="cc-title" style="font-size:0.84rem">${item.title}</div>
            <div class="cc-body" style="font-size:0.78rem">${item.content}</div>
            ${item.link ? `<a href="${item.link}" target="_blank" class="resource-link" style="font-size:0.76rem;display:inline-block;margin-top:4px">查看详情 ›</a>` : ''}
          </div>`;
        });
      }
      if (briefing.professional.industryNews) {
        html += `<div class="text-xs text-muted mb-1 mt-2">📡 行业动态</div>`;
        briefing.professional.industryNews.forEach(item => {
          html += `<div class="frontier-item" style="padding:6px 0">
            <div class="frontier-title" style="font-size:0.82rem">${item.title}</div>
            <div class="frontier-desc" style="font-size:0.76rem">${item.content}</div>
            <div class="text-xs text-muted">${item.source || ''} ${item.link ? `<a href="${item.link}" target="_blank" class="resource-link" style="font-size:0.72rem">阅读 ›</a>` : ''}</div>
          </div>`;
        });
      }
      html += `</div>`;
    }

    // 投资理财
    if (briefing.investment) {
      html += `<div class="briefing-section mt-4">
        <div style="font-weight:700;font-size:0.9rem;color:var(--music);margin-bottom:6px">💰 ${briefing.investment.title || '投资理财'}</div>
        <div class="text-sm" style="line-height:1.6;margin-bottom:8px">${briefing.investment.marketTrend || ''}</div>`;
      if (briefing.investment.suggestions) {
        briefing.investment.suggestions.forEach(item => {
          html += `<div class="concept-card" style="border-color:rgba(243,156,18,0.15);background:linear-gradient(135deg,rgba(243,156,18,0.08),rgba(243,156,18,0.02));margin-bottom:6px">
            <div class="cc-title" style="font-size:0.84rem;color:var(--music)">${item.title}</div>
            <div class="cc-body" style="font-size:0.78rem">${item.content}</div>
            ${item.link ? `<a href="${item.link}" target="_blank" class="resource-link" style="font-size:0.76rem;display:inline-block;margin-top:4px">查看详情 ›</a>` : ''}
          </div>`;
        });
      }
      html += `</div>`;
    }

    // 自媒体热点
    if (briefing.selfmedia) {
      html += `<div class="briefing-section mt-4">
        <div style="font-weight:700;font-size:0.9rem;color:var(--warning);margin-bottom:6px">🔥 ${briefing.selfmedia.title || '自媒体热点'}</div>`;
      if (briefing.selfmedia.items) {
        briefing.selfmedia.items.forEach(item => {
          html += `<div class="frontier-item" style="padding:6px 0">
            <div class="frontier-title" style="font-size:0.82rem">${item.title}</div>
            <div class="frontier-desc" style="font-size:0.76rem">${item.content}</div>
            <div class="text-xs text-muted">来源：${item.source || ''}</div>
          </div>`;
        });
      }
      html += `</div>`;
    }

    el.innerHTML = html;
  },

  // ==================== 每周运动计划 ====================
  renderWeeklyPlan() {
    const plan = Engine.getWeeklyPlan();
    const card = document.getElementById('weeklyPlanCard');
    const el = document.getElementById('weeklyPlanContent');
    if (!card || !el) return;

    if (!plan) {
      card.style.display = 'none';
      return;
    }

    card.style.display = 'block';
    let html = `<div class="text-xs text-muted mb-2">📅 本周起始：${plan.weekOf || ''} · ${plan.generatedAt || ''}</div>`;
    
    if (plan.summary) {
      html += `<div class="text-sm" style="background:var(--bg);padding:10px;border-radius:10px;margin-bottom:10px;line-height:1.6">${plan.summary}</div>`;
    }

    if (plan.days) {
      const today = Engine.dayOfWeek();
      const dayNames = ['周日','周一','周二','周三','周四','周五','周六'];
      const todayName = dayNames[today];
      
      plan.days.forEach(d => {
        const isToday = d.day === todayName;
        html += `<div class="diet-item" style="${isToday ? 'background:rgba(26,115,232,0.06);border-radius:8px;padding:8px' : ''}">
          <div style="flex:1">
            <div class="diet-meal">${d.day} ${isToday ? '<span class="tag tag-info" style="font-size:0.6rem">今天</span>' : ''}</div>
            ${d.exercises.map(ex => {
              const text = typeof ex === 'string' ? ex : `${ex.name || ''}${ex.duration ? ' ' + ex.duration : ''}${ex.detail ? ' - ' + ex.detail : ''}`;
              return `<div class="text-sm" style="padding:2px 0">• ${text}</div>`;
            }).join('')}
            ${d.notes ? `<div class="text-xs text-muted mt-1">${d.notes}</div>` : ''}
          </div>
        </div>`;
      });
    }

    el.innerHTML = html;
  },

  // ==================== 饮水追踪 ====================
  renderWaterTracker() {
    const tracker = Engine.getWaterTracker();
    const el = document.getElementById('waterTracker');
    if (!el) return;

    const today = Engine.today();
    const logged = tracker.date === today ? tracker.logged : 0;
    const goal = tracker.goal || 1500;
    const pct = Math.min(100, Math.round(logged / goal * 100));

    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px">
        <div style="flex:1">
          <div style="font-size:0.88rem;font-weight:600">今日饮水 <span style="color:var(--accent)">${logged}</span> / ${goal} ml</div>
          <div style="height:8px;background:var(--rule);border-radius:4px;overflow:hidden;margin-top:6px">
            <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--accent),var(--accent-light));border-radius:4px;transition:width 0.5s"></div>
          </div>
          <div class="text-xs text-muted mt-1">${pct}% · ${pct >= 100 ? '🎉 已达标！' : '还差 ' + (goal - logged) + ' ml'}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px">
          <button class="btn btn-sm btn-outline" onclick="UI.addWater(200)" style="padding:4px 12px;font-size:0.78rem">+200ml</button>
          <button class="btn btn-sm btn-outline" onclick="UI.addWater(500)" style="padding:4px 12px;font-size:0.78rem">+500ml</button>
        </div>
      </div>
    `;
  },

  // ==================== 设置 ====================
  renderSettings() {
    const profile = Store.get('profile', SEED.profile);
    document.getElementById('profileSettings').innerHTML = `
      <div class="stat-row"><span class="stat-label">年龄/身高/体重</span><span class="stat-value">${profile.age}岁 / ${profile.height}cm / ${profile.weight}kg</span></div>
      <div class="stat-row"><span class="stat-label">体型</span><span class="stat-value">${profile.bodyType}</span></div>
      <div class="stat-row"><span class="stat-label">体脂</span><span class="stat-value">${profile.bodyFat}</span></div>
      <div class="stat-row"><span class="stat-label">收入</span><span class="stat-value">${profile.income} / ${profile.city}</span></div>
      <div class="stat-row"><span class="stat-label">存款</span><span class="stat-value">${profile.savings}</span></div>
      <div class="stat-row"><span class="stat-label">工作方向</span><span class="stat-value">${profile.work}</span></div>
      <div class="stat-row"><span class="stat-label">年度目标</span><span class="stat-value" style="text-align:right">${profile.annualGoal}</span></div>
      <div class="divider"></div>
      <div class="text-sm font-bold mb-1">语言水平</div>
      <div class="stat-row"><span class="stat-label">英语</span><span class="stat-value">${profile.languages.en}</span></div>
      <div class="stat-row"><span class="stat-label">粤语</span><span class="stat-value">${profile.languages.yue}</span></div>
      <div class="stat-row"><span class="stat-label">韩语</span><span class="stat-value">${profile.languages.ko}</span></div>
      <div class="text-sm font-bold mb-1 mt-2">音乐水平</div>
      <div class="stat-row"><span class="stat-label">声乐</span><span class="stat-value">${profile.music.vocal}</span></div>
      <div class="stat-row"><span class="stat-label">架子鼓</span><span class="stat-value">${profile.music.drum}</span></div>
    `;

    const m = Store.get('menstrual', SEED.menstrual);
    const phase = Engine.getMenstrualPhase();
    document.getElementById('periodSettings').innerHTML = `
      <div class="stat-row"><span class="stat-label">上次经期起始</span><span class="stat-value">${m.lastPeriodStart || '未设置'}</span></div>
      <div class="stat-row"><span class="stat-label">周期长度</span><span class="stat-value">${m.cycleLength}天</span></div>
      <div class="stat-row"><span class="stat-label">经期天数</span><span class="stat-value">${m.periodLength}天</span></div>
      <div class="stat-row"><span class="stat-label">当前阶段</span><span class="stat-value">${phase.name}</span></div>
      <div class="mt-2">
        <button class="btn btn-primary btn-sm" onclick="UI.markPeriod()">设置/更新经期</button>
      </div>
    `;
  }
};
