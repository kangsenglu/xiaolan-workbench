// ========== app.js · 主应用逻辑 ==========
// 小蓝UP UP · WorkBuddy UI层与交互

const UI = {
  currentView: 'home',

  // ---- 初始化 ----
  init() {
    initData();
    this.renderAll();
    // 定时刷新（模拟巡检）
    setInterval(() => this.refreshDynamic(), 60000); // 每分钟检查
  },

  renderAll() {
    Modules.renderHome();
    Modules.renderHealth();
    Modules.renderLearning();
    Modules.renderProfessional();
    Modules.renderMusic();
    Modules.renderSettings();
  },

  refreshDynamic() {
    if (this.currentView === 'home') Modules.renderHome();
  },

  // ---- 导航 ----
  navigate(view) {
    this.currentView = view;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + view).classList.add('active');

    document.querySelectorAll('.bottom-nav .nav-item').forEach(n => n.classList.remove('active'));
    const navMap = { home: 0, health: 1, learning: 2, professional: 3, music: 4, settings: -1 };
    const idx = navMap[view];
    if (idx >= 0) {
      document.querySelectorAll('.bottom-nav .nav-item')[idx].classList.add('active');
    }

    window.scrollTo(0, 0);

    // 渲染对应模块
    if (view === 'home') Modules.renderHome();
    else if (view === 'health') Modules.renderHealth();
    else if (view === 'learning') Modules.renderLearning();
    else if (view === 'professional') Modules.renderProfessional();
    else if (view === 'music') Modules.renderMusic();
    else if (view === 'settings') Modules.renderSettings();
  },

  // ---- Tab切换 ----
  switchTab(e, tabId) {
    const tabs = e.target.parentElement.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');

    const view = e.target.closest('.view');
    const tabContainers = view.querySelectorAll('[id^="health-"], [id^="learn-"], [id^="music-"]');
    // Find all tab content divs within this view
    const allPanels = view.querySelectorAll('.tabs ~ div[id]');
    allPanels.forEach(p => p.style.display = 'none');
    const target = document.getElementById(tabId);
    if (target) target.style.display = 'block';
  },

  // ---- 任务切换 ----
  toggleTask(taskId) {
    const taskLog = Store.get('taskLog', {});
    const today = Engine.today();
    if (!taskLog[today]) taskLog[today] = {};
    taskLog[today][taskId] = !taskLog[today][taskId];
    Store.set('taskLog', taskLog);
    this.toast(taskLog[today][taskId] ? '✅ 已完成' : '已取消');
    if (this.currentView === 'home') Modules.renderHome();
  },

  // ---- Toast ----
  toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
  },

  // ---- Modal ----
  showModal(html) {
    document.getElementById('modalContent').innerHTML = html;
    document.getElementById('modalOverlay').classList.add('show');
  },

  closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
  },

  // ---- 深色模式 ----
  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    Store.set('darkMode', document.body.classList.contains('dark-mode'));
  },

  // ---- 标记加班 ----
  markOvertime() {
    const status = Store.get('todayStatus', SEED.todayStatus);
    status.overtime = !status.overtime;
    Store.set('todayStatus', status);
    this.toast(status.overtime ? '📋 已标记加班，运动任务已顺延' : '已取消加班标记');
    this.renderAll();
  },

  // ---- 身体状态 ----
  markBodyState() {
    const status = Store.get('todayStatus', SEED.todayStatus);
    const states = [
      { key: 'normal', label: '😊 正常', desc: '状态良好，正常推荐' },
      { key: 'fatigue', label: '😴 疲劳', desc: '降低当日所有运动强度' },
      { key: 'fire', label: '🔥 上火', desc: '切换清润食谱3天' },
      { key: 'unwell', label: '🤒 不适', desc: '仅推荐易筋经+护理操' },
      { key: 'throat', label: '😷 嗓子不适', desc: '声乐降为仅听力训练' }
    ];
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">身体状态</div>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <div class="form-label">选择当前状态（触发即时重排）</div>
      ${states.map(s => `
        <div class="radio-label ${status.bodyState === s.key ? 'selected' : ''}" onclick="UI._setBodyState('${s.key}')">
          <span>${s.label}</span>
          <span class="text-xs text-muted" style="margin-left:auto">${s.desc}</span>
        </div>
      `).join('')}
      <div class="form-label mt-4">疲劳度：${'★'.repeat(status.fatigue)}${'☆'.repeat(5 - status.fatigue)}</div>
      <input type="range" min="1" max="5" value="${status.fatigue}" class="w-full" oninput="UI._setFatigue(this.value)" style="width:100%">
      <div class="form-label mt-2">精力评分：${'★'.repeat(status.energy)}${'☆'.repeat(5 - status.energy)}</div>
      <input type="range" min="1" max="5" value="${status.energy}" class="w-full" oninput="UI._setEnergy(this.value)" style="width:100%">
    `);
  },

  _setBodyState(key) {
    const status = Store.get('todayStatus', SEED.todayStatus);
    status.bodyState = key;
    Store.set('todayStatus', status);
    this.closeModal();
    this.toast('状态已更新，已触发重排');
    this.renderAll();
  },

  _setFatigue(val) {
    const status = Store.get('todayStatus', SEED.todayStatus);
    status.fatigue = parseInt(val);
    Store.set('todayStatus', status);
  },

  _setEnergy(val) {
    const status = Store.get('todayStatus', SEED.todayStatus);
    status.energy = parseInt(val);
    Store.set('todayStatus', status);
  },

  // ---- 经期标记 ----
  markPeriod() {
    const m = Store.get('menstrual', SEED.menstrual);
    const today = Engine.today();
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">经期标记</div>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <div class="form-group">
        <div class="form-label">上次经期起始日期</div>
        <input type="date" class="form-input" id="periodDate" value="${m.lastPeriodStart || today}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <div class="form-label">周期长度（天）</div>
          <input type="number" class="form-input" id="cycleLen" value="${m.cycleLength}" min="21" max="35">
        </div>
        <div class="form-group">
          <div class="form-label">经期天数</div>
          <input type="number" class="form-input" id="periodLen" value="${m.periodLength}" min="3" max="10">
        </div>
      </div>
      <div class="text-xs text-muted mb-2">💡 连续3个月经周期后系统将自动校准预测模型</div>
      <button class="btn btn-primary btn-block" onclick="UI._savePeriod()">保存</button>
      <button class="btn btn-outline btn-block mt-2" onclick="UI._markPeriodToday()">标记今天为经期第1天</button>
    `);
  },

  _savePeriod() {
    const date = document.getElementById('periodDate').value;
    const cycle = parseInt(document.getElementById('cycleLen').value);
    const period = parseInt(document.getElementById('periodLen').value);
    if (!date) { this.toast('请选择日期'); return; }
    Store.set('menstrual', { ...Store.get('menstrual', SEED.menstrual), lastPeriodStart: date, cycleLength: cycle, periodLength: period });
    this.closeModal();
    this.toast('经期信息已保存');
    this.renderAll();
  },

  _markPeriodToday() {
    const today = Engine.today();
    Store.set('menstrual', { ...Store.get('menstrual', SEED.menstrual), lastPeriodStart: today });
    // 触发联动
    Engine.applyLinkage('period_start');
    this.closeModal();
    this.toast('🩸 已标记今天为经期第1天，全模块已调整');
    this.renderAll();
  },

  // ---- 添加资源 ----
  addResource(direction) {
    const dirs = { en: '英语', yue: '粤语', ko: '韩语', vocal: '声乐', drum: '架子鼓' };
    const dirLabel = direction ? dirs[direction] : '';
    const allDirs = [
      { key: 'en', label: '英语' }, { key: 'yue', label: '粤语' }, { key: 'ko', label: '韩语' },
      { key: 'vocal', label: '声乐' }, { key: 'drum', label: '架子鼓' }, { key: 'pro', label: '专业' }
    ];

    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">➕ 添加新资源</div>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <div class="form-group">
        <div class="form-label">资源类型</div>
        <div class="radio-group" id="resTypeGroup">
          ${['链接', '文字/笔记', '音频', '曲目'].map((t, i) =>
            `<label class="radio-label ${i === 0 ? 'selected' : ''}" onclick="document.querySelectorAll('#resTypeGroup .radio-label').forEach(l=>l.classList.remove('selected'));this.classList.add('selected')">
              <input type="radio" name="resType" value="${t}" ${i === 0 ? 'checked' : ''}> ${t}
            </label>`
          ).join('')}
        </div>
      </div>
      <div class="form-group">
        <div class="form-label">标题</div>
        <input type="text" class="form-input" id="resTitle" placeholder="资源标题">
      </div>
      <div class="form-group">
        <div class="form-label">内容/链接</div>
        <input type="text" class="form-input" id="resUrl" placeholder="URL或内容">
      </div>
      <div class="form-group">
        <div class="form-label">备注（可选）</div>
        <input type="text" class="form-input" id="resNote" placeholder="备注信息">
      </div>
      <div class="form-group">
        <div class="form-label">标签</div>
        <div class="radio-group" id="resTagGroup">
          ${['待学习', '已掌握', '收藏', '待复习'].map((t, i) =>
            `<label class="radio-label" onclick="document.querySelectorAll('#resTagGroup .radio-label').forEach(l=>l.classList.remove('selected'));this.classList.add('selected')">
              <input type="checkbox" value="${t}"> ${t}
            </label>`
          ).join('')}
        </div>
      </div>
      <div class="form-group">
        <div class="form-label">关联方向 ${direction ? '(' + dirLabel + ')' : ''}</div>
        <select class="form-select" id="resDirection">
          ${allDirs.map(d => `<option value="${d.key}" ${direction === d.key ? 'selected' : ''}>${d.label}</option>`).join('')}
        </select>
      </div>
      <button class="btn btn-primary btn-block" onclick="UI._saveResource()">保存</button>
    `);
  },

  _saveResource() {
    const type = document.querySelector('#resTypeGroup input:checked')?.value || '链接';
    const title = document.getElementById('resTitle').value.trim();
    const url = document.getElementById('resUrl').value.trim();
    const note = document.getElementById('resNote').value.trim();
    const tags = Array.from(document.querySelectorAll('#resTagGroup input:checked')).map(c => c.value).join(',');
    const direction = document.getElementById('resDirection').value;

    if (!title) { this.toast('请输入标题'); return; }

    const resources = Store.get('userResources', []);
    resources.push({
      id: 'res_' + Date.now(),
      type, title, url, note, tags, direction,
      createdAt: Date.now()
    });
    Store.set('userResources', resources);
    this.closeModal();
    this.toast('✅ 资源已添加');

    // 刷新对应模块
    Modules._renderAllResources();
    Modules._renderMusicResources();
  },

  // ---- 添加笔记 ----
  addNote(direction) {
    const dirs = { en: '英语', yue: '粤语', ko: '韩语', pro: '专业', vocal: '声乐', drum: '架子鼓' };
    const dirLabel = dirs[direction] || '';

    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">📝 添加${dirLabel}笔记</div>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <div class="form-group">
        <div class="form-label">文字记录</div>
        <textarea class="form-textarea" id="noteText" placeholder="学习心得、难点、自创记忆法、例句等..."></textarea>
      </div>
      <div class="form-group">
        <div class="form-label">链接（可选）</div>
        <input type="text" class="form-input" id="noteLink" placeholder="https://...">
      </div>
      <div class="form-group">
        <div class="form-label">标签（逗号分隔）</div>
        <input type="text" class="form-input" id="noteTags" placeholder="学习方法, 待复习">
      </div>
      ${direction === 'vocal' || direction === 'drum' ? `
      <div class="form-group">
        <div class="form-label">进度自评</div>
        <div class="star-rating" id="noteRating" data-rating="0">
          ${[1,2,3,4,5].map(i => `<span class="star" onclick="UI._setRating(${i})">★</span>`).join('')}
        </div>
      </div>` : ''}
      <input type="hidden" id="noteDirection" value="${direction}">
      <button class="btn btn-primary btn-block" onclick="UI._saveNote()">保存</button>
    `);
  },

  _setRating(n) {
    const container = document.getElementById('noteRating');
    container.dataset.rating = n;
    container.querySelectorAll('.star').forEach((s, i) => {
      s.classList.toggle('active', i < n);
    });
  },

  _saveNote() {
    const text = document.getElementById('noteText').value.trim();
    const link = document.getElementById('noteLink').value.trim();
    const tags = document.getElementById('noteTags').value.trim();
    const direction = document.getElementById('noteDirection').value;
    const ratingEl = document.getElementById('noteRating');
    const rating = ratingEl ? parseInt(ratingEl.dataset.rating) : 0;

    if (!text && !link) { this.toast('请输入内容或链接'); return; }

    const notes = Store.get('userNotes', []);
    notes.push({
      id: 'note_' + Date.now(),
      direction, text, link, tags, rating,
      createdAt: Date.now()
    });
    Store.set('userNotes', notes);
    this.closeModal();
    this.toast('✅ 笔记已添加');

    // 刷新对应笔记
    Modules._renderNotes(direction);
  },

  // ---- 添加曲目 ----
  addRepertoire(type) {
    const label = type === 'vocal' ? '声乐曲目' : '鼓谱曲目';
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">🎵 添加${label}</div>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <div class="form-label">曲目名称</div>
          <input type="text" class="form-input" id="repTitle" placeholder="歌曲名">
        </div>
        <div class="form-group">
          <div class="form-label">歌手</div>
          <input type="text" class="form-input" id="repSinger" placeholder="歌手名">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <div class="form-label">难度（1-5星）</div>
          <select class="form-select" id="repDifficulty">
            <option value="1">★☆☆☆☆</option>
            <option value="2">★★☆☆☆</option>
            <option value="3">★★★☆☆</option>
            <option value="4">★★★★☆</option>
            <option value="5">★★★★★</option>
          </select>
        </div>
        <div class="form-group">
          <div class="form-label">当前进度(%)</div>
          <input type="number" class="form-input" id="repProgress" value="0" min="0" max="100">
        </div>
      </div>
      <div class="form-group">
        <div class="form-label">备注（链接/练习要点）</div>
        <input type="text" class="form-input" id="repNote" placeholder="练习要点或链接">
      </div>
      <input type="hidden" id="repDirection" value="${type}">
      <button class="btn btn-primary btn-block" onclick="UI._saveRepertoire()">保存</button>
    `);
  },

  _saveRepertoire() {
    const title = document.getElementById('repTitle').value.trim();
    const singer = document.getElementById('repSinger').value.trim();
    const difficulty = parseInt(document.getElementById('repDifficulty').value);
    const progress = parseInt(document.getElementById('repProgress').value) || 0;
    const note = document.getElementById('repNote').value.trim();
    const direction = document.getElementById('repDirection').value;

    if (!title) { this.toast('请输入曲目名称'); return; }

    const rep = Store.get('userRepertoire', []);
    rep.push({
      id: 'rep_' + Date.now(),
      direction, title, singer, difficulty, progress, note
    });
    Store.set('userRepertoire', rep);
    this.closeModal();
    this.toast('✅ 曲目已添加');
    Modules._renderRepertoire(direction);
  },

  // ---- 饮水追踪 ----
  addWater(ml) {
    Engine.addWater(ml);
    Modules.renderWaterTracker();
    this.toast(`💧 +${ml}ml`);
  },

  // ---- 重置数据 ----
  resetData() {
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">⚠️ 重置数据</div>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <div class="text-sm" style="color:var(--warning)">
        此操作将清除所有个人数据（包括经期记录、学习笔记、资源等），恢复到初始状态。此操作不可撤销！
      </div>
      <div class="mt-4" style="display:flex;gap:8px">
        <button class="btn btn-danger btn-block" onclick="Store.reset()">确认重置</button>
        <button class="btn btn-secondary btn-block" onclick="UI.closeModal()">取消</button>
      </div>
    `);
  }
};

// ---- 启动 ----
document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  // 恢复深色模式
  if (Store.get('darkMode', false)) {
    document.body.classList.add('dark-mode');
  }
});
