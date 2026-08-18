window.DAILY_BRIEFING = {
  date: "2026-08-18",
  generatedAt: "2026-08-18 07:30 由TRAE自动化生成",
  health: {
    title: "健康饮食",
    icon: "leaf",
    color: "var(--module-1)",
    diet: "今日推荐红枣桂圆粥温补气血，搭配黄芪红枣枸杞茶补气养颜；消水肿可饮玉米须水或冬瓜荷叶茶。脾胃虚弱继续忌口玉米、红薯、豆类、燕麦，经期阶段以温补为主，不追求减重。",
    items: [
      { title: "经期补气食疗", content: "黄芪红枣枸杞茶温补气血，适合经期及经后调理。黄芪补气升阳，红枣养血安神，枸杞滋补肝肾，三者搭配温和不伤脾胃。", source: "民福健康科普" },
      { title: "消水肿饮品", content: "玉米须水、冬瓜荷叶茶帮助排出多余水分，缓解经期浮肿。冬瓜清热利水，玉米须利尿消肿，可经期前一周开始饮用。", source: "博禾医生" },
      { title: "胶原蛋白补充", content: "银耳羹富含植物胶质，温和滋补且易消化，适合脾胃虚弱者。可加入红枣、枸杞同煮，既补胶原又补气血。", source: "VOGUE China" }
    ]
  },
  language: {
    title: "语言学习",
    icon: "book",
    color: "var(--module-2)",
    items: [
      { title: "TED影子跟读法", content: "每天15分钟，选1-2句有清晰节奏和实用语法的句子，重复跟读3-5遍直到流畅模仿。推荐从TED-Ed短片或乔布斯斯坦福演讲入门。", link: "https://speakshark.com/blog/shadowing-method-15-minutes-native-sound", linkText: "去学习" },
      { title: "粤语情景对话练习", content: "按生活场景拆解学习：茶餐厅点单、坐地铁、去超市、看医生。每个场景集中攻克20个核心词+5个常用句，学完即模拟对话。", link: "https://m.sohu.com/a/1042067715_122736710/", linkText: "去学习" },
      { title: "韩语入门日常用语", content: "从基础问候开始：annyeonghaseyo（你好）、gamsahamnida（谢谢）。每天用Anki背诵15分钟主题词汇，坚持30天顺利开口。", link: "https://www.targumi.com/blog/how-to-learn-korean-quickly", linkText: "去学习" }
    ]
  },
  professional: {
    title: "专业赋能",
    icon: "bolt",
    color: "var(--accent)",
    knowledgePoints: [
      { title: "预训练 Pre-training", content: "在数万亿token语料上以因果语言建模（CLM）为目标训练，逼出语言能力与世界知识，是LLM能力的天花板。", link: "https://blog.csdn.net/qq_36776216/article/details/154615530" },
      { title: "分布式训练3D并行", content: "数据并行+张量并行+流水线并行是训练大模型的标配，配合混合精度训练可在GPU集群上高效扩展至千亿参数。", link: "https://blog.csdn.net/2301_80381519/article/details/161720406" },
      { title: "SFT监督微调", content: "用人工标注的指令-回答数据把模型从续写机器变成对话机器，是一切对齐的地基，成本最低但对齐上限有限。", link: "https://blog.csdn.net/2301_80370251/article/details/163802590" },
      { title: "RLHF与PPO", content: "SFT后加奖励模型（RM）+PPO强化学习，效果上限最高，但要同时维护4个模型，工程代价最大，训练稳定性要求高。", link: "https://danielrjiang.github.io/files/publications/llm_rl_tutorial.pdf" },
      { title: "GRPO群体相对策略优化", content: "用组平均替代PPO的价值函数基线，DeepSeek-R1-Zero使用GRPO在无需监督学习步骤的情况下激发强推理能力。", link: "https://arxiv.org/pdf/2505.24034v2.pdf" }
    ],
    industryNews: [
      { title: "LlamaRL：分布式异步RL训练框架", content: "支持8B到405B参数模型在数千GPU上高效训练，专为大规模LLM强化学习优化，解决高延迟和内存瓶颈。", source: "arXiv", link: "https://arxiv.org/pdf/2505.24034v2.pdf" },
      { title: "GIFT融合GRPO与DPO新算法", content: "结合隐式与显式奖励模型，消除难解项，在多个任务上超越单独使用GRPO或DPO的效果。", source: "arXiv", link: "https://arxiv.org/html/2510.23868v2/" },
      { title: "A股震荡修复，AI产业链高景气", content: "机构认为当前市场处于机会大于风险阶段，前期负面压制已充分消化，AI产业链仍是高景气代表方向。", source: "中国证券报", link: "https://epaper.cs.com.cn/zgzqb/images/2026-08/17/J06/zqXB0617.pdf" }
    ]
  },
  investment: {
    title: "投资理财",
    icon: "wallet",
    color: "var(--module-4)",
    marketTrend: "A股当前处于震荡修复阶段，相较全球主要市场具备明显估值比较优势（中证800市盈率不足17倍，标普500约28倍）。前期海外情绪冲击和国内筹码结构压力已充分消化，AI产业链保持高景气，但新主线尚不明确，资金或在板块间轮动。",
    suggestions: [
      { title: "稳健打底：固收+基金", content: "债券为主叠加少量权益，不追风口也不躺平，适合稳健型投资者长期持有。", link: "http://www.weiju2100.com/jijin/78765.html" },
      { title: "定投混合型基金", content: "无论市场涨跌坚持每月定额投资，有效平滑成本，避免追涨杀跌的人性弱点。", link: "http://m.toutiao.com/group/7673671605343650348/" },
      { title: "配置比例建议", content: "月收入1.5万、存款20万可参考70%债券基金+30%混合型基金，既保证大部分资产稳健，又不错过股市上涨机会。", link: "https://finance.sina.com.cn/money/fund/jjgsgd/2026-07-10/doc-inihkptp5143788.shtml.md" }
    ],
    researchLinks: [
      { title: "风暴过后机构转守为攻，把握超跌机遇", link: "https://epaper.cs.com.cn/zgzqb/images/2026-08/17/J06/zqXB0617.pdf" },
      { title: "资深FOF经理的2026实战选基金笔记", link: "http://www.weiju2100.com/jijin/78765.html" }
    ]
  },
  selfmedia: {
    title: "自媒体热点",
    icon: "flame",
    color: "var(--danger)",
    items: [
      { title: "初秋氛围感穿搭", content: "#秋天的第一杯奶茶 #初秋氛围感穿搭 话题热度持续攀升，胶片感日常搭配温暖色调，适合立Flag+生动照片风格。", source: "今日头条" },
      { title: "返校季热点", content: "#backtoschool2026 #dormtok 返校准备内容热度 Rising， dorm布置、开学好物分享是近期流量密码。", source: "SocialPilot" },
      { title: "独居女孩日常", content: "独居生活vlog、运动打卡、一人食记录持续受到关注，结合胶片感滤镜和Rap背景音乐更易出圈。", source: "抖音/小红书趋势" }
    ]
  }
};
