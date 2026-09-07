window.DAILY_BRIEFING = {
  date: "2026-09-07",
  generatedAt: "2026-09-07 由TRAE自动化生成",
  health: {
    title: "健康饮食",
    icon: "leaf",
    color: "var(--module-1)",
    diet: "经期后调理期，以温补气血为主。早餐红糖小米粥+山药莲子粥，午餐当归生姜羊肉汤暖身驱寒，下午茶黄芪红枣枸杞茶补气，晚间银耳羹补充胶原蛋白。忌玉米红薯豆类燕麦，饮食清淡温热。",
    items: [
      { title: "消水肿妙招", content: "晨起面部浮肿可喝冬瓜荷叶茶或玉米须水，利尿祛湿不伤脾胃。醪糟红豆羹也能活血健脾消水肿，适合湿气重人群。", source: "什么值得买" },
      { title: "补气养血经典方", content: "红枣5颗去核+桂圆肉10颗+枸杞10克，加水煮沸小火炖15分钟，每日1-2次。脾胃虚弱加两片生姜温中健脾。", source: "养生道" },
      { title: "经期后调理汤品", content: "红枣枸杞乌鸡汤补气血，适合气血不足面色苍白者。山楂红糖汤促进经血排出，量少者可适量饮用。", source: "民福康" }
    ]
  },
  language: {
    title: "语言学习",
    icon: "book",
    color: "var(--module-2)",
    items: [
      { title: "TED影子跟读｜人生不只是要快乐", content: "Emily Esfahani Smith经典演讲，四级到六级进阶首选，学习密度高。逐句跟读+录音对比，听力口语双提升。", link: "https://www.ximalaya.com/album/118434647", linkText: "去学习" },
      { title: "每日英语听力｜TED专区", content: "内置TED演讲专区，AI精校字幕支持单句精听+跟读打分。可导入全网任意视频做精听素材。", link: "https://www.sina.cn/news/detail/5277522736712849.html", linkText: "去学习" },
      { title: "粤语情景学习｜多邻国粤语课", content: "每天5分钟游戏化学习，从基础发音到日常对话循序渐进，适合零基础入门。", link: "https://www.duolingo.com/course/zh-HK/zh-CN/Learn-Chinese%20Cantonese", linkText: "去学习" },
      { title: "粤语故事书网站｜分级阅读", content: "240个涵盖各级别的粤语故事，含文字、粤拼和音频，50个互动影片，适合沉浸式学习。", link: "https://www.sina.cn/news/detail/5259776986711284.html", linkText: "去学习" },
      { title: "韩语入门｜小语种口语网", content: "76种语言零基础自学平台，韩语初级句子+播音员朗读+中文译文，点击即听跟读练习。", link: "https://www.tukkk.com/", linkText: "去学习" }
    ]
  },
  professional: {
    title: "专业赋能",
    icon: "bolt",
    color: "var(--accent)",
    knowledgePoints: [
      { title: "LLM训练三阶段", content: "完整训练链路：Pretrain（预训练，海量语料学语言能力）→ SFT（监督微调，学指令跟随）→ RLHF（强化学习对齐，学人类偏好）。三阶段数据质量决定最终效果。", link: "https://blog.csdn.net/qq_38146189/article/details/149155696" },
      { title: "分布式训练策略", content: "DP数据并行（模型复制多卡）、TP张量并行（矩阵拆分）、PP流水线并行（层切分）、ZeRO/FSDP（优化器/梯度/参数分片）。一般单机内用TP，跨节点用PP+ZeRO。", link: "https://blog.csdn.net/weixin_43444989/article/details/161028202" },
      { title: "SFT监督微调", content: "用高质量指令-响应对数据，在预训练模型基础上注入"按指令行动"能力。数据质量>数量，10万条高质量数据往往胜过百万低质量数据。", link: "https://jishuzhan.net/article/2058117327656947714" },
      { title: "RL对齐算法对比", content: "RLHF/PPO：效果最好但需4个模型（策略+价值+奖励+参考），工程复杂。DPO：直接偏好优化，2个模型即可，工业界主流。GRPO：组相对策略优化，无需Critic，省显存，DeepSeek-R1采用。", link: "https://blog.csdn.net/2301_80370251/article/details/163802590" },
      { title: "GPU显存优化", content: "训练时显存占用=模型参数+梯度+优化器状态+激活值+临时缓冲。优化手段：混合精度训练、梯度检查点、ZeRO分片、量化训练、FlashAttention加速注意力计算。", link: "https://developer.cloud.tencent.com/article/2735928" }
    ],
    industryNews: [
      { title: "GRPO成为推理RL新范式", content: "DeepSeek-R1验证GRPO效果后，GRPO系列论文爆发。Pref-GRPO、Step-GRPO等变体将GRPO扩展到多模态、图像生成等领域，无需Critic模型大幅降低训练成本。", source: "HuggingFace论文站", link: "https://huggingface.ac.cn/papers/keyword/grpo" },
      { title: "2026强化学习全景：多奖励精细化", content: "651篇论文研报显示，2026年RL方向聚焦多奖励解耦（NVIDIA GDPO）、推理时缩放、Agent探索性策略优化等。Beyond 80/20法则推动RL从通用到精细化场景演进。", source: "AI Insight", link: "https://www.ai-insight.org/reports/rl-landscape" },
      { title: "大模型迭代进入"周级"时代", content: "大语言模型迭代以周为计，参数规模飙升至万亿级，技术从"被动训练"向"自主进化"转变。AI辅助研发、数据回流、Multi-agent成为工程落地关键方向。", source: "新华网", link: "http://www.xinhuanet.com/tech/20260907/7b8ceb800022469a96b52b51bb20a984/c.html" }
    ]
  },
  investment: {
    title: "投资理财",
    icon: "wallet",
    color: "var(--module-4)",
    marketTrend: "8月A股科技行情逐步修复，通信、电子板块活跃，AI产业链（光模块、CPO）基金涨幅居前。新发基金稳健型产品占比超40%，FOF发行规模同比增长159%，科创100指数估值处于近1年低位。",
    suggestions: [
      { title: "基金定投建议", content: "月入1.5万可考虑每月定投3000-5000元。稳健配置：60%偏债FOF/固收+ + 30%宽基指数基金 + 10%科创主题ETF。科创100ETF估值低位可分批布局。", link: "http://paper.cnstock.com/html/2026-08/09/content_2253466.htm" },
      { title: "稳健理财方向", content: "存款20万建议：5万应急资金放货币基金，10万配置偏债FOF和"固收+"产品（年化4-6%），5万分批定投宽基+科创ETF获取长期增值。", link: "https://stcn.com/article/detail/4089973.html" },
      { title: "成都本地房产观察", content: "成都作为新一线城市核心，房产仍具保值属性。当前政策环境宽松，刚需可关注，投资性购房建议谨慎，优先流动性更好的金融资产。", link: "" }
    ],
    researchLinks: [
      { title: "8月新发基金市场：稳健型产品戏份足", link: "http://paper.cnstock.com/html/2026-08/09/content_2253466.htm" },
      { title: "ETF遇冷FOF升温 8月基金发行冰火两重天", link: "https://stcn.com/article/detail/4089973.html" },
      { title: "科创100ETF估值处于近1年低位", link: "https://www.jiemian.com/article/15061277.html" },
      { title: "8月科技行情修复 主动权益基金回暖", link: "http://paper.cnstock.com/html/2026-08/19/content_2256554.htm" }
    ]
  },
  selfmedia: {
    title: "自媒体热点",
    icon: "flame",
    color: "var(--danger)",
    items: [
      { title: "开学季热词飙升｜小红书", content: "开学话题热度增量70.9w，笔记增长97.3%。教育学习、家居家装、时尚品类关联度最高。可做开学Flag、宿舍改造、新学期穿搭等内容。", source: "灰豚数据" },
      { title: "最废技能大赛｜小红书趣味话题", content: "小红书发起「最废技能大赛」，手当吸盘、青蛙腿斗鸡眼等边打嗝边念诗等"无用"技能比拼发酵。主打"天生我材，一点没用"，搞笑抽象风易出爆款。", source: "东方财富网" },
      { title: "泡泡手势舞挑战｜抖音", content: "王鹤棣《泡泡》手势舞引爆全明星打卡潮，多位艺人参与演绎。话题#全明星打卡泡泡手势舞#传播力强，适合跟拍蹭流量。", source: "新浪新闻" },
      { title: "抖音2026春夏时尚趋势", content: "抖音发布春夏时尚趋势大秀，今秋流行"琥珀系"棕色（浓郁琥珀调）。趋势榜基于7日播放/互动/搜索数据，可实时捕捉时尚风向做内容。", source: "经济日报" },
      { title: "夜间生活与关系记录｜小红书", content: "小红书热门样本集中在夜间生活、关系记录、运动与游戏内容。独居女孩日常、胶片感运动打卡仍是流量密码，适合立Flag+生动照片+Rap风格。", source: "Neodrop热榜" }
    ]
  }
};
