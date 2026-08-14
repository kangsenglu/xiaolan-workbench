// ========== engine.js · 动态推荐引擎 ==========
// 小蓝UP UP · WorkBuddy 核心决策层

const Engine = {

  // ---- 日期工具 ----
  today() { return new Date().toISOString().slice(0, 10); },
  now() { return new Date(); },
  dayOfWeek() { return this.now().getDay(); }, // 0=周日, 3=周三
  isWeekday() { const d = this.dayOfWeek(); return d >= 1 && d <= 5; },
  isWeekend() { return !this.isWeekday(); },
  dateDiff(d1, d2) { return Math.round((new Date(d2) - new Date(d1)) / 86400000); },

  // ---- 经期阶段计算 ----
  getMenstrualPhase() {
    const m = Store.get('menstrual', SEED.menstrual);
    if (!m.lastPeriodStart) {
      return { phase: 'unknown', day: 0, coef: 1.0, name: '未设置', countdown: '--' };
    }
    const today = this.today();
    const diff = this.dateDiff(m.lastPeriodStart, today);
    const cycle = m.cycleLength || 28;
    const periodLen = m.periodLength || 5;

    let phase, name, coef;
    if (diff < 0) {
      phase = 'luteal'; name = '黄体期（待经期）'; coef = 0.5;
    } else if (diff < periodLen) {
      phase = 'menstrual'; name = `经期第${diff + 1}天`; coef = 0.3 + (diff / periodLen) * 0.2;
    } else if (diff < cycle - 14) {
      phase = 'follicular'; name = '卵泡期'; coef = 0.8;
    } else if (diff < cycle - 7) {
      phase = 'ovulation'; name = '排卵期'; coef = 1.0;
    } else {
      phase = 'luteal'; name = '黄体期'; coef = 0.6;
    }

    const nextStart = new Date(m.lastPeriodStart);
    nextStart.setDate(nextStart.getDate() + cycle);
    const countdown = this.dateDiff(today, nextStart.toISOString().slice(0, 10));

    return { phase, day: diff + 1, coef, name, countdown };
  },

  // ---- 强度系数 ----
  getIntensityCoef() {
    const phase = this.getMenstrualPhase();
    const status = Store.get('todayStatus', SEED.todayStatus);
    let coef = phase.coef;

    // 用户自评调整
    if (status.bodyState === 'fatigue') coef *= 0.6;
    if (status.bodyState === 'unwell') coef *= 0.3;
    if (status.bodyState === 'fire') coef *= 0.7;
    if (status.overtime) coef *= 0.5;

    return Math.max(0.2, Math.min(1.0, coef));
  },

  // ---- 问候语生成 ----
  getGreeting() {
    const h = this.now().getHours();
    const phase = this.getMenstrualPhase();
    let greeting, sub;

    if (h < 6) { greeting = '夜深了小蓝'; sub = '早点休息，明天继续UP UP'; }
    else if (h < 11) { greeting = '早安小蓝'; sub = this._morningSub(phase); }
    else if (h < 14) { greeting = '午安小蓝'; sub = '午休时间，做做护理操吧'; }
    else if (h < 18) { greeting = '下午好小蓝'; sub = '保持专注，稳步向前'; }
    else if (h < 22) { greeting = '晚上好小蓝'; sub = this._eveningSub(phase); }
    else { greeting = '晚安小蓝'; sub = '今天辛苦了，好好休息'; }

    return { greeting, sub };
  },
  _morningSub(phase) {
    const subs = {
      menstrual: '今天温和一点，做易筋经吧',
      follicular: '精力充沛，今天可以挑战高强度',
      ovulation: '状态最佳，抓住黄金期',
      luteal: '注意调节情绪，温和运动',
      unknown: '新的一天，继续UP UP'
    };
    return subs[phase.phase] || subs.unknown;
  },
  _eveningSub(phase) {
    if (phase.phase === 'menstrual') return '经期注意保暖，今晚早点休息';
    return '今天的练习完成了吗？';
  },

  // ==================== 运动规划引擎 ====================
  generateExercisePlan() {
    const phase = this.getMenstrualPhase();
    const status = Store.get('todayStatus', SEED.todayStatus);
    const prefs = Store.get('exercisePrefs', SEED.exercisePrefs);
    const coef = this.getIntensityCoef();
    const dayOfWeek = this.dayOfWeek();
    const log = Store.get('exerciseLog', []);

    const plan = [];
    const reasons = [];

    // Step 1: 硬约束过滤
    const scheme = Store.get('phaseExerciseSchemes', SEED.phaseExerciseSchemes);
    const phaseScheme = scheme[phase.phase] || scheme.follicular;
    const banned = new Set(phaseScheme.banned);
    if (status.overtime) banned.add('游泳').add('网球').add('舞蹈课');

    // Step 2: 必做项插入（腰颈护理操 工作日必推）
    if (this.isWeekday()) {
      const nursing = prefs.find(p => p.name.includes('护理操'));
      if (nursing) {
        plan.push({
          name: '腰颈护理操',
          duration: '5-10min',
          priority: 5,
          time: '12:00-12:15',
          reason: '工作日每日必做，缓解久坐疲劳',
          required: true
        });
      }
    }

    // Step 3: 易筋经组合插入（优先填充）
    if (!banned.has('文式+武式易筋经')) {
      const intensity = coef < 0.5 ? '舒缓' : (coef < 0.8 ? '正常' : '加强');
      const wuDuration = coef < 0.5 ? '10min(减量)' : '15min';
      plan.push({
        name: `文式易筋经(${intensity}) + 武式易筋经(${intensity})`,
        duration: `15min + ${wuDuration}`,
        priority: 4,
        time: '19:00-19:30',
        reason: phase.phase === 'menstrual' ? '经期温和运动首选，先文后武组合完成' : '日常保健必做组合，先文后武不可拆分',
        required: true,
        combo: true
      });
    }

    // Step 4: 固定时间项匹配（游泳/网球/舞蹈）
    prefs.forEach(p => {
      if (p.dormant) return;
      if (p.fixedDay && p.fixedDay.includes(dayOfWeek)) {
        if (banned.has(p.name)) {
          plan.push({
            name: p.name,
            duration: p.duration,
            priority: 0,
            time: '--',
            reason: this._cancelReason(p.name, phase, status),
            cancelled: true
          });
        } else {
          plan.push({
            name: p.name,
            duration: p.duration,
            priority: 2,
            time: p.name === '游泳' ? '12:00-13:00' : '19:30-21:00',
            reason: `每周${['日','一','二','三','四','五','六'][dayOfWeek]}固定安排`,
            optional: true
          });
        }
      }
    });

    // Step 5: 弹性项填充
    if (!banned.has('田田力量训练') && coef > 0.5) {
      const intensity = coef < 0.8 ? '减量' : '正常';
      plan.push({
        name: `田田力量训练(${intensity})`,
        duration: coef < 0.8 ? '15min' : '25min',
        priority: 3,
        time: '20:00-20:30',
        reason: `强度系数${coef.toFixed(1)}，今日可进行力量训练`,
        optional: true
      });
    }

    // Step 6: 体力冲突检测
    const totalDuration = plan.filter(p => !p.cancelled).reduce((sum, p) => {
      const m = parseInt(p.duration) || 0;
      return sum + m;
    }, 0);
    if (totalDuration > 60 && coef < 0.6) {
      // 降级：移除最低优先级的可选项
      const optional = plan.filter(p => p.optional);
      if (optional.length > 0) {
        optional[optional.length - 1].cancelled = true;
        optional[optional.length - 1].reason = '今日体力有限，已自动降级顺延';
      }
    }

    // 排序：必做 > 可选 > 取消
    plan.sort((a, b) => {
      if (a.cancelled && !b.cancelled) return 1;
      if (!a.cancelled && b.cancelled) return -1;
      return b.priority - a.priority;
    });

    return { plan, coef, phase: phase.name, dayInfo: this._dayInfo() };
  },

  _cancelReason(name, phase, status) {
    if (phase.phase === 'menstrual') return `今日${phase.name}，已自动取消`;
    if (status.overtime) return '今日加班，已顺延';
    return '今日不推荐';
  },

  _dayInfo() {
    const days = ['周日','周一','周二','周三','周四','周五','周六'];
    return `${this.today()}（${days[this.dayOfWeek()]}）`;
  },

  // ==================== 饮食规划 ====================
  generateDietPlan() {
    const phase = this.getMenstrualPhase();
    const status = Store.get('todayStatus', SEED.todayStatus);
    const templates = Store.get('dietTemplates', SEED.dietTemplates);

    let template;
    if (status.bodyState === 'fire') {
      template = templates.fireUp;
    } else {
      template = templates[phase.phase] || templates.follicular;
    }

    return { template, phase: phase.name, isFireUp: status.bodyState === 'fire' };
  },

  getTeaPlan() {
    const phase = this.getMenstrualPhase();
    const status = Store.get('todayStatus', SEED.todayStatus);
    const diet = this.generateDietPlan();
    return diet.template.tea;
  },

  // ==================== 学习任务生成 ====================
  generateLearningTask(lang) {
    const phase = this.getMenstrualPhase();
    const status = Store.get('todayStatus', SEED.todayStatus);
    const coef = this.getIntensityCoef();

    if (lang === 'en') return this._genEnTask(coef, status);
    if (lang === 'yue') return this._genYueTask(coef, status);
    if (lang === 'ko') return this._genKoTask(coef, status);
  },

  _genEnTask(coef, status) {
    const res = Store.get('enResources', SEED.enResources);
    const words = res.words;
    const wordIdx = (new Date().getDate() - 1) * 5 % words.length;
    const todayWords = [];
    for (let i = 0; i < 5; i++) {
      todayWords.push(words[(wordIdx + i) % words.length]);
    }

    const task = {
      main: {
        title: '影子跟读 TED演讲 "The Power of Introverts"',
        duration: coef < 0.5 ? '8min' : '12min',
        link: 'https://www.ted.com/talks/susan_cain_the_power_of_introverts',
        desc: '跟读文本已附，注意语调和节奏'
      },
      words: todayWords,
      travel: this._checkTravel() ? {
        title: '🧳 旅游专项（距出发还有' + this._travelDays() + '天）',
        sentences: [
          'Could you recommend a local dish?',
          'How do I get to the nearest subway station?',
          'What time does the museum open?',
          'I\'d like to book a table for two.',
          'Could you take a photo for me?'
        ]
      } : null,
      note: '点击下方添加文字或链接记录笔记'
    };

    if (status.overtime) {
      task.main.duration = '15min';
      task.main.title = '英语精简练习（加班模式）';
      task.main.desc = '今日加班，合并为15分钟快速练习';
    }

    return task;
  },

  _genYueTask(coef, status) {
    const res = Store.get('yueResources', SEED.yueResources);
    const epNum = (new Date().getDate() % 10) + 1;
    const task = {
      main: {
        title: `情景短剧第${epNum}集 "茶餐厅点餐"`,
        duration: '6min',
        link: '',
        desc: '重点句已提取'
      },
      sentences: [
        { text: '唔該，我要一個菠萝油', jyutping: 'm4 goi1, ngo5 jiu3 jat1 go3 bo1 lo4 jau4' },
        { text: '飲咩嘢？', jyutping: 'jam2 me1 je5?' },
        { text: '幾錢？', jyutping: 'gei2 cin2?' }
      ],
      weekendLyric: '🎵 周末歌词解析：《海阔天空》第一段',
      note: '点击下方添加文字或链接记录笔记'
    };

    if (status.overtime) {
      task.main.duration = '5min';
      task.main.title = '粤语精简练习（加班模式）';
    }

    return task;
  },

  _genKoTask(coef, status) {
    const res = Store.get('koResources', SEED.koResources);
    const letters = res.letters;
    const newLetters = [
      { letter: 'ㅂ', roman: 'b', sound: 'ㅂ' },
      { letter: 'ㅅ', roman: 's', sound: 'ㅅ' },
      { letter: 'ㅇ', roman: 'ng', sound: 'ㅇ' }
    ];
    const weekCount = Math.ceil(new Date().getDate() / 7);

    const task = {
      main: {
        title: `字母复活游戏：复习${letters.length}个字母 + ${newLetters.length}个新字母`,
        duration: '10min',
        link: '',
        desc: '字母发音对照视频 / 记忆卡已推送'
      },
      reviewLetters: letters,
      newLetters: newLetters,
      sentence: {
        text: '오늘 날씨가 좋아요',
        meaning: '今天天气真好',
        breakdown: '오늘(今天) / 날씨가(天气) / 좋아요(好)'
      },
      weekendDrama: '🎬 周末盲听预告：《请回答1988》片段',
      note: '点击下方添加文字或链接记录笔记',
      weekInfo: `本周第${weekCount}次`
    };

    if (status.overtime) {
      task.main.duration = '5min';
      task.main.title = '韩语精简练习（加班模式）';
    }

    return task;
  },

  // ---- 旅游检查 ----
  _checkTravel() {
    const travel = Store.get('travel', SEED.travel);
    return travel.active && travel.date;
  },
  _travelDays() {
    const travel = Store.get('travel', SEED.travel);
    if (!travel.date) return 0;
    return this.dateDiff(this.today(), travel.date);
  },

  // ==================== 音乐练习生成 ====================
  generateMusicTask(type) {
    const phase = this.getMenstrualPhase();
    const status = Store.get('todayStatus', SEED.todayStatus);
    const coef = this.getIntensityCoef();
    const log = Store.get('exerciseLog', []);

    // 判断今日运动消耗
    const todayEx = log.filter(l => l.date === this.today());
    const hasHighIntensity = todayEx.some(l => ['游泳','网球','田田力量训练'].includes(l.exercise));

    let mode;
    if (status.overtime) mode = 'micro';
    else if (phase.phase === 'menstrual' || hasHighIntensity) mode = 'light';
    else if (this.isWeekend()) mode = 'full';
    else mode = 'normal';

    if (type === 'vocal') return this._genVocalTask(mode, status);
    if (type === 'drum') return this._genDrumTask(mode, status);
  },

  _genVocalTask(mode, status) {
    if (mode === 'micro') {
      return {
        mode: '微任务模式（加班）',
        modeDesc: '今日加班，声乐/鼓二选一，仅3-5min微练习',
        items: [
          { name: '发声基础（微）', duration: '3-5min', detail: '腹式呼吸5组 + 音阶练习1遍', link: '' }
        ],
        isMicro: true
      };
    }
    if (mode === 'light') {
      return {
        mode: '轻量模式',
        modeDesc: '今日体力有限/经期，仅做轻量练习',
        items: [
          { name: '腹式呼吸', duration: '5min', detail: '4拍吸-4拍呼，重复5组', link: '参考视频' },
          { name: '听力训练', duration: '5min', detail: '听原唱，感受气息和咬字', link: '' }
        ]
      };
    }
    if (status.bodyState === 'throat') {
      return {
        mode: '仅听力训练模式',
        modeDesc: '嗓子不舒服，今日仅听力训练',
        items: [
          { name: '听力训练', duration: '10min', detail: '听优质演唱示范，分析技巧', link: '' }
        ]
      };
    }
    // full/normal mode
    const repertoire = Store.get('vocalRepertoire', SEED.vocalRepertoire);
    const currentSong = repertoire.find(s => s.progress < 100) || repertoire[0];
    return {
      mode: mode === 'full' ? '完整模式' : '标准模式',
      modeDesc: mode === 'full' ? '周末无消耗，完整练习' : '标准练习安排',
      items: [
        { name: '发声基础（每日必做）', duration: '10min', detail: '腹式呼吸5组 + 音阶练习Do-Re-Mi-Fa-Sol-Fa-Mi-Re-Do', link: '音频示范' },
        { name: '曲目练习', duration: '20min', detail: `《${currentSong?.title || '光年之外'}》副歌部分，重点：高音咬字`, link: '伴奏链接', song: currentSong?.title },
        { name: '本周录音复盘（周六）', duration: '--', detail: '录制练习音频，自我评价', link: '' }
      ],
      target: '副歌连续3遍不破音'
    };
  },

  _genDrumTask(mode, status) {
    if (mode === 'micro') {
      return {
        mode: '微任务模式（加班）',
        modeDesc: '今日加班，声乐/鼓二选一，仅3-5min微练习',
        items: [
          { name: '手腕击打（微）', duration: '3-5min', detail: '桌面练习单跳，保持节奏稳定', link: '' }
        ],
        isMicro: true
      };
    }
    if (mode === 'light') {
      return {
        mode: '轻量模式',
        modeDesc: '今日体力有限/经期，仅做轻量练习',
        items: [
          { name: '手腕击打', duration: '5min', detail: '桌面练习单跳 100bpm', link: '' },
          { name: '节奏默读', duration: '5min', detail: '默读十六分音符节奏', link: '' }
        ]
      };
    }
    // full/normal mode
    const repertoire = Store.get('drumRepertoire', SEED.drumRepertoire);
    const currentSong = repertoire.find(s => s.progress < 100) || repertoire[0];
    return {
      mode: mode === 'full' ? '完整模式' : '标准模式',
      modeDesc: mode === 'full' ? '周末无消耗，完整练习' : '标准练习安排',
      items: [
        { name: '基本功（每日必做）', duration: '10-15min', detail: '单跳120→140→160bpm各2min / 双跳100bpm持续5min', link: '节奏示范' },
        { name: '节奏型训练', duration: '15min', detail: '十六分音符+切分音组合（节奏型#8），节拍器120bpm', link: '谱例已推送' },
        { name: '曲目练习', duration: '20min', detail: `《${currentSong?.title || 'Yellow'}》主歌部分，重点：过门节奏型`, link: '鼓谱链接', song: currentSong?.title }
      ]
    };
  },

  // ==================== 专业赋能 ====================
  generateProTheory() {
    const data = Store.get('proData', SEED.proData);
    const dayIdx = (new Date().getDate() - 1) % data.theory.length;
    return data.theory[dayIdx];
  },

  generateProFrontier() {
    const data = Store.get('proData', SEED.proData);
    return data.frontier;
  },

  generateProKnowledge() {
    const data = Store.get('proData', SEED.proData);
    return data.knowledge;
  },

  // ==================== 跨模块联动 ====================
  applyLinkage(event) {
    const status = Store.get('todayStatus', SEED.todayStatus);
    switch(event) {
      case 'period_start':
        status.bodyState = 'unwell';
        status.intensityCoef = 0.3;
        break;
      case 'overtime':
        status.overtime = true;
        break;
      case 'fatigue':
        status.bodyState = 'fatigue';
        break;
      case 'fire':
        status.bodyState = 'fire';
        break;
      case 'normal':
        status.bodyState = 'normal';
        status.overtime = false;
        break;
    }
    Store.set('todayStatus', status);
    return status;
  },

  // ==================== 智能提醒 ====================
  getSmartReminders() {
    const reminders = [];
    const phase = this.getMenstrualPhase();
    const status = Store.get('todayStatus', SEED.todayStatus);
    const dayOfWeek = this.dayOfWeek();

    // 经期相关
    if (phase.phase === 'menstrual') {
      reminders.push('🩸 经期中，注意保暖，忌生冷食物');
    } else if (phase.countdown <= 3 && phase.countdown > 0) {
      reminders.push(`📅 经期预计${phase.countdown}天后到来，提前准备`);
    }

    // 加班
    if (status.overtime) {
      reminders.push('📋 今日已标记加班，运动任务已顺延，注意休息');
    }

    // 游泳提醒
    if (phase.phase !== 'menstrual') {
      const tomorrow = (dayOfWeek + 1) % 7;
      if (tomorrow === 3) reminders.push('🏊 明天周三中午游泳别忘了哦');
      if (tomorrow === 6) reminders.push('🏊 明天周六游泳别忘了哦');
    }

    // 舞蹈课
    const danceWake = new Date('2026-09-15');
    if (this.now() < danceWake) {
      const days = this.dateDiff(this.today(), '2026-09-15');
      if (days <= 14 && days > 0) {
        reminders.push(`💃 舞蹈课将在${days}天后唤醒，敬请期待`);
      }
    }

    // 上火提醒
    if (status.bodyState === 'fire') {
      reminders.push('🔥 今日已标记上火，食谱已切换为清润方案');
    }

    // 面部训练提醒
    if (this.isWeekday()) {
      reminders.push('💆 别忘了做面部改善训练（早晚12分钟）');
    }

    return reminders;
  },

  // ==================== 模块进度计算 ====================
  getModuleProgress(module) {
    const taskLog = Store.get('taskLog', {});
    const today = this.today();
    const todayLog = taskLog[today] || {};

    if (module === 'health') {
      const plan = this.generateExercisePlan().plan;
      const required = plan.filter(p => p.required && !p.cancelled);
      const done = required.filter(p => todayLog[p.name] === true);
      return required.length > 0 ? Math.round(done.length / required.length * 100) : 0;
    }
    if (module === 'learning') {
      const tasks = ['en', 'yue', 'ko'];
      const done = tasks.filter(t => todayLog['learn_' + t]);
      return Math.round(done.length / tasks.length * 100);
    }
    if (module === 'professional') {
      return todayLog['pro_theory'] ? 100 : 0;
    }
    if (module === 'music') {
      const tasks = ['vocal', 'drum'];
      const done = tasks.filter(t => todayLog['music_' + t]);
      return Math.round(done.length / tasks.length * 100);
    }
    return 0;
  },

  // ==================== 今日总任务 ====================
  getTodayTasks() {
    const phase = this.getMenstrualPhase();
    const coef = this.getIntensityCoef();
    const status = Store.get('todayStatus', SEED.todayStatus);
    const tasks = [];

    // 健康任务
    const exPlan = this.generateExercisePlan();
    exPlan.plan.forEach(p => {
      if (p.required || p.optional) {
        tasks.push({
          id: p.name,
          category: 'health',
          name: p.name,
          time: p.time,
          reason: p.reason,
          required: p.required,
          cancelled: p.cancelled
        });
      }
    });

    // 学习任务
    if (!status.overtime || coef > 0.3) {
      tasks.push({
        id: 'en_task',
        category: 'learning',
        name: '英语跟读练习',
        time: status.overtime ? '通勤' : '12:15-12:35',
        reason: '影子跟读TED演讲 + 单词打卡',
        required: !status.overtime
      });
    }

    if (coef > 0.4 && !status.overtime) {
      tasks.push({
        id: 'yue_task',
        category: 'learning',
        name: '粤语情景短剧',
        time: '通勤',
        reason: '每日6min情景对话练习',
        required: false
      });
    }

    // 音乐任务
    if (coef > 0.3) {
      const musicMode = status.overtime ? '微任务' : (coef > 0.5 ? '标准' : '轻量');
      tasks.push({
        id: 'music_task',
        category: 'music',
        name: `音乐练习（${musicMode}）`,
        time: status.overtime ? '间隙' : '20:00-20:30',
        reason: status.overtime ? '微练习3-5min' : '声乐/鼓练习',
        required: false
      });
    }

    return { tasks, phase: phase.name, coef };
  },

  // ==================== 今日时间轴 ====================
  getTimeline() {
    const phase = this.getMenstrualPhase();
    const status = Store.get('todayStatus', SEED.todayStatus);
    const isWeekday = this.isWeekday();
    const items = [];

    if (isWeekday) {
      items.push({ time: '08:30-17:30', content: '上班', type: 'work' });
    }

    // 午休护理操
    if (isWeekday) {
      items.push({ time: '12:00-12:15', content: '腰颈护理操', type: 'health' });
      if (!status.overtime) {
        items.push({ time: '12:15-12:35', content: '英语跟读练习', type: 'learning' });
      }
    }

    // 游泳
    const dayOfWeek = this.dayOfWeek();
    if ((dayOfWeek === 3 || dayOfWeek === 6) && phase.phase !== 'menstrual') {
      items.push({ time: '12:00-13:00', content: '游泳', type: 'health' });
    }

    // 晚间易筋经
    if (phase.phase !== 'menstrual' || true) {
      const intensity = phase.phase === 'menstrual' ? '舒缓' : '正常';
      items.push({ time: '19:00-19:30', content: `文式+武式易筋经(${intensity})`, type: 'health' });
    }

    // 音乐
    if (!status.overtime && this.getIntensityCoef() > 0.3) {
      items.push({ time: '20:00-20:30', content: '音乐练习', type: 'music' });
    }

    // 加班
    if (status.overtime) {
      items.push({ time: '19:00-21:00', content: '加班（运动已顺延）', type: 'work' });
    }

    return items;
  },

  // ---- 每日简报加载 ----
  getDailyBriefing() {
    if (typeof window.DAILY_BRIEFING !== 'undefined' && window.DAILY_BRIEFING) {
      return window.DAILY_BRIEFING;
    }
    return null;
  },

  // ---- 每周计划加载 ----
  getWeeklyPlan() {
    if (typeof window.WEEKLY_PLAN !== 'undefined' && window.WEEKLY_PLAN) {
      return window.WEEKLY_PLAN;
    }
    return null;
  },

  // ---- 饮水追踪 ----
  getWaterTracker() {
    return Store.get('waterTracker', SEED.waterTracker);
  },

  addWater(ml) {
    const tracker = this.getWaterTracker();
    const today = this.today();
    // Reset if new day
    if (!tracker.date || tracker.date !== today) {
      tracker.logged = 0;
      tracker.date = today;
    }
    tracker.logged += ml;
    if (!tracker.logs) tracker.logs = [];
    tracker.logs.push({ date: today, time: new Date().toLocaleTimeString('zh-CN', {hour:'2-digit',minute:'2-digit'}), ml });
    Store.set('waterTracker', tracker);
    return tracker;
  }
};
