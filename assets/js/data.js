// ========== data.js · 数据层 ==========
// 小蓝UP UP · WorkBuddy 数据模型与种子数据

const Store = {
  KEY: 'xiaolan_upup_v1',

  // ---- localStorage 读写 ----
  get(key, def) {
    const data = this._load();
    return key in data ? data[key] : def;
  },
  set(key, val) {
    const data = this._load();
    data[key] = val;
    this._save(data);
  },
  _load() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || {}; }
    catch { return {}; }
  },
  _save(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },
  exportData() {
    const data = this._load();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `xiaolan_upup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    UI.toast('数据已导出');
  },
  importData() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const data = JSON.parse(ev.target.result);
          this._save(data);
          UI.toast('数据已导入，刷新中...');
          setTimeout(() => location.reload(), 1000);
        } catch { UI.toast('导入失败：文件格式错误'); }
      };
      reader.readAsText(file);
    };
    input.click();
  },
  reset() {
    localStorage.removeItem(this.KEY);
    location.reload();
  }
};

// ========== 种子数据 ==========
const SEED = {
  // ---- 个人静态画像 ----
  profile: {
    age: 27, height: 165, weight: 62.5,
    bodyType: '修长 / 腹部偏软 / 视觉偏瘦',
    bodyFat: '整体偏高（肉质软），但视觉不显胖',
    income: '1.5万/月', city: '成都', savings: '约20万',
    work: 'AI辅助研发',
    annualGoal: '创新模型训练 + 数据质量 + 数据回流',
    languages: { en: 'CET-6听说弱', yue: '基础听读', ko: '字母遗忘' },
    music: { vocal: '基础起步', drum: '基础起步' }
  },

  // ---- 体质标签（硬约束）----
  constitution: [
    { label: '上热下寒', desc: '上易上火，下怕冷', rule: '引火归元，温补+滋阴交替', warn: false },
    { label: '易上火', desc: '温补/辛辣→咽痛/长痘', rule: '温补食材搭配滋阴食材', warn: false },
    { label: '痛经', desc: '经期疼痛明显', rule: '经期保暖，忌生冷', warn: false },
    { label: '经量偏少', desc: '量本身不多', rule: '避免高强度消耗', warn: false },
    { label: '⚠️停经史', desc: '快速减重导致', rule: '绝对禁止：不以减重为目标', warn: true },
    { label: '脾胃虚弱', desc: '不能吃粗粮', rule: '绝对禁止：玉米/红薯/豆类/燕麦', warn: true },
    { label: '过敏性鼻炎', desc: '环境敏感', rule: '运动后防受凉', warn: false }
  ],

  // ---- 运动偏好 ----
  exercisePrefs: [
    { name: '田田力量训练', type: '强度弹性', duration: '15-30min', constraint: '经期前3天禁用', priority: 3 },
    { name: '文式+武式易筋经', type: '必须组合', duration: '20-30min', constraint: '先文后武，不可拆分', priority: 4 },
    { name: '腰/颈护理操', type: '日常必做', duration: '5-10min', constraint: '工作日每日推送', priority: 5 },
    { name: '游泳', type: '有氧', duration: '45-60min', constraint: '经期禁用', priority: 2, fixedDay: [3, 6] },
    { name: '网球', type: '随机', duration: '60-90min', constraint: '经期禁用', priority: 1 },
    { name: '舞蹈课', type: '当前休眠', duration: '90min/节', constraint: '9月中旬唤醒', priority: 0, dormant: true }
  ],

  // ---- 经期追踪 ----
  menstrual: {
    lastPeriodStart: '', // ISO date
    cycleLength: 28,
    periodLength: 5,
    history: [], // [{start, end}]
    predictions: []
  },

  // ---- 今日状态 ----
  todayStatus: {
    fatigue: 3,      // 1-5
    energy: 3,       // 1-5
    overtime: false,
    bodyState: 'normal', // normal/fatigue/fire/unwell
    intensityCoef: 1.0
  },

  // ---- 运动执行记录 ----
  exerciseLog: [], // [{date, exercise, completed, duration}]

  // ---- 英语资源库 ----
  enResources: {
    links: [
      { title: 'TED-Ed演讲精选', url: 'https://ed.ted.com', note: '10个精选演讲' },
      { title: 'VOA慢速英语', url: 'https://learningenglish.voanews.com', note: '听力练习' },
      { title: 'BBC 6 Minute English', url: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english', note: '6分钟英语' }
    ],
    words: [
      { word: 'articulate', meaning: '清晰表达', example: 'She articulated her ideas clearly.' },
      { word: 'collaborate', meaning: '合作', example: 'We collaborate on this project.' },
      { word: 'diverse', meaning: '多样的', example: 'A diverse team brings creativity.' },
      { word: 'generate', meaning: '产生', example: 'The system generates reports automatically.' },
      { word: 'implement', meaning: '实施', example: 'We will implement the new policy.' }
    ],
    scenes: [
      { title: '日常对话模板', count: 20 },
      { title: '会议口语模板', count: 10 }
    ],
    listening: [
      { title: '英文播客推荐列表', note: '多种主题播客' },
      { title: '美剧片段推荐', note: '适合跟读练习' }
    ],
    reading: [
      { title: '推荐书单（分级阅读）', note: '从易到难' }
    ]
  },

  // ---- 粤语资源库 ----
  yueResources: {
    links: [
      { title: '粤语情景短剧10集（带字幕）', url: '', note: '日常场景对话' },
      { title: '粤语拼音教学视频', url: '', note: '基础拼音' }
    ],
    words: [
      { word: '唔該', jyutping: 'm4 goi1', meaning: '谢谢/麻烦' },
      { word: '我要一個菠萝油', jyutping: 'ngo5 jiu3 jat1 go3 bo1 lo4 jau4', meaning: '我要一个菠萝油' },
      { word: '飲咩嘢', jyutping: 'jam2 me1 je5', meaning: '喝什么' }
    ],
    lyrics: [
      { title: '《海阔天空》', singer: 'Beyond', note: '经典粤语歌' }
    ]
  },

  // ---- 韩语资源库 ----
  koResources: {
    links: [
      { title: '韩语40音教学视频', url: '', note: '字母入门' },
      { title: '基础语法教程', url: '', note: '语法基础' }
    ],
    words: [
      { word: '오늘', roman: 'oneul', meaning: '今天' },
      { word: '날씨', roman: 'nalssi', meaning: '天气' },
      { word: '좋아요', roman: 'joayo', meaning: '好/喜欢' }
    ],
    letters: [
      { letter: 'ㄱ', roman: 'g', sound: 'ㄱ' },
      { letter: 'ㄴ', roman: 'n', sound: 'ㄴ' },
      { letter: 'ㄷ', roman: 'd', sound: 'ㄷ' },
      { letter: 'ㄹ', roman: 'r/l', sound: 'ㄹ' },
      { letter: 'ㅁ', roman: 'm', sound: 'ㅁ' }
    ],
    drama: [
      { title: '《请回答1988》片段', note: '经典韩剧' }
    ]
  },

  // ---- 声乐资源 ----
  vocalResources: {
    methods: [
      { title: '腹式呼吸教学视频', url: '', note: '呼吸基础' },
      { title: '发声练习音频10组', url: '', note: '日常练习' },
      { title: '音准训练APP推荐', url: '', note: '辅助工具' }
    ],
    techniques: [
      { title: '共鸣训练法', note: '头腔/胸腔共鸣' },
      { title: '咬字练习法', note: '清晰发音' },
      { title: '换声区过渡技巧', note: '高音过渡' }
    ]
  },

  // ---- 声乐曲目库 ----
  vocalRepertoire: [
    { title: '小幸运', singer: '田馥甄', difficulty: 2, progress: 80, dates: ['9/10','9/14'], note: '换气点要注意' },
    { title: '光年之外', singer: '邓紫棋', difficulty: 3, progress: 40, dates: ['9/12'], note: '高音需加强' }
  ],

  // ---- 架子鼓资源 ----
  drumResources: {
    methods: [
      { title: '单跳/双跳教学视频', url: '', note: '基本功' },
      { title: '基本功练习谱例', url: '', note: '谱例参考' },
      { title: '节拍器APP推荐', url: '', note: '辅助工具' }
    ],
    rhythms: [
      { title: '基础节奏型20个', note: '四分/八分/十六分/切分' }
    ],
    coordination: [
      { title: '手脚分家练习视频', note: '四肢独立' },
      { title: '四肢独立训练法', note: '协调性' }
    ]
  },

  // ---- 架子鼓曲目库 ----
  drumRepertoire: [
    { title: 'Yellow', singer: 'Coldplay', difficulty: 2, progress: 30, note: '主歌过门节奏型' }
  ],

  // ---- 投资理财 ----
  financeData: {
    concepts: [
      { title: '复利效应', desc: '利滚利，时间是最好的朋友。每月定投1000元，年化8%，10年后约18万。' },
      { title: '资产配置', desc: '不要把鸡蛋放在一个篮子里。股票+债券+现金按风险承受能力分配。' },
      { title: '紧急备用金', desc: '至少3-6个月生活费存入货币基金，随时可取。按成都生活成本约需1.5-3万。' },
      { title: '指数基金定投', desc: '巴菲特推荐普通人的最佳投资方式。沪深300/中证500定期定额投入。' },
      { title: '记账与预算', desc: '先了解钱花在哪，再规划怎么花。50%必要+30%想要+20%储蓄。' }
    ],
    actions: [
      { title: '开设基金账户', desc: '在支付宝/天天基金开设账户，了解指数基金' },
      { title: '建立紧急备用金', desc: '将3个月生活费（约1.5万）存入余额宝' },
      { title: '开始小额定投', desc: '每月500元定投沪深300指数基金' },
      { title: '下载记账APP', desc: '开始记录每日收支，了解消费结构' }
    ],
    monthlyBudget: {
      income: 15000,
      rent: 2500,
      food: 2500,
      transport: 500,
      shopping: 2000,
      entertainment: 1500,
      savings: 6000
    }
  },

  // ---- 自媒体 ----
  mediaData: {
    flags: [
      { month: '本月', theme: '30天每日穿搭挑战', desc: '记录每天穿搭+搭配心得，展示淡颜通勤气质', progress: 0 }
    ],
    calendar: [
      { day: '周一', time: '12:00', action: '午休穿搭速拍', type: '照片' },
      { day: '周二', time: '20:00', action: 'Rap练习片段', type: '短视频' },
      { day: '周四', time: '19:00', action: '面部改善打卡', type: '照片' },
      { day: '周六', time: '15:00', action: '周末Vlog', type: '视频' }
    ],
    rap: {
      tracks: [
        { title: '基础Flow练习', desc: '8拍节奏+简单押韵', status: '进行中' },
        { title: '自由Freestyle', desc: '即兴说唱3分钟', status: '待开始' }
      ],
      tips: '从慢速开始，先掌握节奏感，再加速。每天10分钟分段练习。'
    }
  },

  // ---- 专业赋能 ----
  proData: {
    theory: [
      { cat: '数据质量', title: '3分钟读懂：数据清洗的5个关键步骤', desc: '去重、缺失值处理、异常值检测、格式统一、一致性校验。高质量数据是模型训练的基石。' },
      { cat: '数据回流', title: '3分钟读懂：数据回流闭环', desc: '线上预测→收集反馈→标注清洗→重新训练→A/B测试→上线。形成数据飞轮。' },
      { cat: 'LLM基础', title: '3分钟读懂：Attention机制', desc: 'Q-K-V三矩阵，注意力权重=softmax(QK^T/√d)，加权求和得输出。Transformer的核心。' },
      { cat: 'Infra基础', title: '3分钟读懂：分布式训练', desc: '数据并行+模型并行+流水线并行。大模型训练必备，GPU显存是瓶颈。' },
      { cat: 'SFT/RL', title: '3分钟读懂：RLHF流程', desc: 'SFT→RM→PPO。先监督微调，再训练奖励模型，最后用强化学习优化。' }
    ],
    frontier: [
      { title: 'Multi-Agent协作框架新进展', desc: '多个Agent分工协作完成复杂任务，论文提出新的角色分配算法', related: true, star: true },
      { title: '数据质量评估新方法', desc: '自动化数据质量评分工具，与模型性能相关性0.85', related: true, star: true },
      { title: '开源大模型推理加速框架', desc: 'vLLM/PagedAttention新版本，推理速度提升40%', related: false, star: false },
      { title: '工具推荐：Label Studio', desc: '开源数据标注平台，支持多模态标注', related: true, star: false }
    ],
    knowledge: [
      { tag: '数据质量', count: 12, latest: '数据清洗流程' },
      { tag: '数据回流', count: 8, latest: '回流闭环设计' },
      { tag: 'LLM基础', count: 15, latest: 'Attention机制' },
      { tag: 'Infra', count: 6, latest: '分布式训练' },
      { tag: 'SFT/RL', count: 4, latest: 'RLHF流程' }
    ]
  },

  // ---- 面部改善方案（来自上传文件）----
  faceProgram: {
    advantages: [
      '淡颜柔和底子，亲和力强，五官线条平缓圆润，可塑性高',
      '皮肤基础平整，无大面积痘印凹凸',
      '五官分布均衡，三庭基础比例均匀'
    ],
    issues: [
      { area: '外轮廓', issue: '双侧不对称颞部凹陷', detail: '左侧太阳穴凹陷更深，中分直发暴露额头到颧骨断层' },
      { area: '中面部', issue: '鼻基底凹陷+苹果肌不对称', detail: '右脸苹果肌高，左脸下移，法令阴影更深' },
      { area: '侧颜', issue: '下巴短小后缩+下颌模糊', detail: '下庭不足，下巴后缩，头前伸加重缺陷' },
      { area: '对称性', issue: '大小脸全维度不对称', detail: '颞区左凹右饱，苹果肌右高左低，咬肌左厚' }
    ],
    exercises: {
      basic: [
        { name: '颞肌充盈', desc: '闭口轻咬后槽牙，太阳穴鼓起停留5秒放松', count: '20次/组×3组，左侧额外加15次' },
        { name: '头皮上提拉伸', desc: '双手包裹太阳穴+后脑勺向后上方提拉8秒', count: '20次' },
        { name: '耳基底韧带提拉', desc: '食指抵耳前凹陷，张嘴闭合时向上提拉皮肉', count: '18次/组×4组，左侧单独多1组' },
        { name: '鼻基底支撑激活', desc: '双唇闭合，舌尖抵下牙内侧，上唇轻向前顶', count: '感受收紧7秒，20组' },
        { name: '下巴归位塑形', desc: '闭唇下巴缓慢前伸至极限停留5秒收回', count: '20次，舌尖顶上颚，向右归正' },
        { name: '颈阔肌松解', desc: '抬头，手掌从下巴纵向拉伸颈侧肌肉', count: '10次' },
        { name: '眉眼舒展训练', desc: '轻抬眉峰舒展眼尾4秒', count: '20次，右眼多发力' }
      ],
      asymmetry: [
        { name: '左侧咬肌放松', desc: '拇指打圈按摩左侧腮帮', count: '1分钟' },
        { name: '单侧左脸提拉', desc: '仅左侧做含蓄上提微笑，保持6秒', count: '20次' },
        { name: '对称微笑训练', desc: '刻意同步上扬两侧嘴角，避免单边发力', count: '20次' }
      ],
      routine: '头皮提拉2min → 颞肌充盈1min → 颧骨松解1min → 耳前提拉3min → 鼻基底激活2min → 下巴塑形2min → 大小脸专项3min → 眉眼舒展1min',
      habits: [
        '咀嚼：双侧交替吃饭，杜绝长期左侧咀嚼',
        '睡姿：优先仰睡，禁止长期左侧卧',
        '体态：杜绝单手托腮、歪头低头玩手机',
        '表情：不单边撇嘴、歪嘴笑，保持嘴角对称'
      ]
    },
    diet: {
      directions: [
        { title: '消水肿', items: ['玉米须水/冬瓜荷叶茶每周3-4次', '控盐，睡前1小时不大量喝水'] },
        { title: '补胶原', items: ['每周2-3次银耳羹/花胶/鸡爪/深海鱼', '每日鸡蛋'] },
        { title: '补气提亮', items: ['黄芪3片+红枣2颗+枸杞泡水', '当归山药鸡汤每周1次'] },
        { title: '抗衰紧致', items: ['每日蓝莓/圣女果/少量坚果', '戒高糖奶茶甜点'] }
      ],
      rules: '三餐规律，不极端节食减脂；每日饮水1500-1800ml'
    },
    timeline: '短期1-2月：习惯纠正+妆容修饰 → 中期3-6月：面部训练+食疗内调 → 客观局限：无法改变原生骨骼'
  },

  // ---- 用户添加的资源 ----
  userResources: [],  // [{id, type, title, url, note, tags, direction, taskId, createdAt}]
  userNotes: [],      // [{id, direction, text, link, tags, taskId, rating, createdAt}]
  userRepertoire: [], // [{id, direction, title, singer, difficulty, progress, note}]

  // ---- 饮食黑名单 ----
  dietBlacklist: ['玉米', '红薯', '豆类', '燕麦', '冰饮', '生冷食物'],

  // ---- 经期阶段运动方案 ----
  phaseExerciseSchemes: {
    menstrual: { coef: '0.3-0.5', allowed: ['文式易筋经', '武式易筋经', '腰颈护理操'], banned: ['游泳', '网球', '舞蹈课', '田田力量训练'] },
    follicular: { coef: '0.8-1.0', allowed: ['所有运动'], banned: [] },
    ovulation: { coef: '0.8-1.0', allowed: ['所有运动'], banned: [] },
    luteal: { coef: '0.5-0.7', allowed: ['田田力量训练(减量)', '易筋经', '护理操', '游泳'], banned: ['网球(高强度)'] }
  },

  // ---- 饮食方案模板 ----
  dietTemplates: {
    menstrual: {
      breakfast: '红枣小米粥 + 水煮蛋 + 蒸南瓜',
      lunch: '当归山药鸡汤面 + 清炒菠菜',
      dinner: '红糖姜茶 + 蒸蛋羹 + 温热蔬菜汤',
      tea: '红枣姜茶（温经散寒）'
    },
    follicular: {
      breakfast: '全麦面包(非燕麦) + 牛奶 + 鸡蛋 + 蓝莓',
      lunch: '糙米饭 + 番茄牛肉 + 清炒西兰花',
      dinner: '银耳羹 + 清蒸鱼 + 凉拌黄瓜(室温)',
      tea: '玫瑰花茶（疏肝理气）'
    },
    ovulation: {
      breakfast: '馒头 + 豆浆 + 鸡蛋 + 圣女果',
      lunch: '米饭 + 黄焖鸡 + 炒时蔬',
      dinner: '花胶鸡汤 + 蒸南瓜 + 蔬菜沙拉(少凉)',
      tea: '陈皮茶（健脾理气）'
    },
    luteal: {
      breakfast: '紫薯(非红薯) + 牛奶 + 鸡蛋',
      lunch: '米饭 + 山药排骨汤 + 清炒油麦菜',
      dinner: '银耳莲子羹 + 蒸蛋 + 温蔬菜',
      tea: '陈皮茶（日常理气）'
    },
    fireUp: {
      breakfast: '绿豆粥 + 水煮蛋 + 梨',
      lunch: '冬瓜排骨汤 + 清炒苦瓜 + 米饭',
      dinner: '百合莲子粥 + 清蒸鱼 + 凉拌黄瓜',
      tea: '菊花茶/金银花茶（清热降火）'
    }
  },

  // ---- 旅游专项 ----
  travel: {
    date: '', // 出发日期
    active: false
  },

  // ---- 任务完成记录 ----
  taskLog: {}, // {date: {taskId: completed}}

  // ---- 饮水追踪 ----
  waterTracker: { goal: 1500, logged: 0, logs: [] }
};

// 初始化数据
function initData() {
  const data = Store._load();
  let needSave = false;
  // 合并种子数据（不覆盖已有用户数据）
  for (const key in SEED) {
    if (!(key in data)) {
      data[key] = SEED[key];
      needSave = true;
    }
  }
  if (needSave) Store._save(data);
  return data;
}
