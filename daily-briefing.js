window.DAILY_BRIEFING = {
  date: "2026-09-17",
  generatedAt: "2026-09-17 08:00 由TRAE自动化生成",
  health: {
    title: "健康饮食",
    icon: "leaf",
    color: "var(--module-1)",
    diet: "经后期补气养血为主，早餐红糖小米粥暖脾胃，午餐山药莲子粥健脾，下午黄芪红枣枸杞茶补气，晚餐银耳花胶羹补胶原，佐以冬瓜荷叶茶消水肿。忌生冷高盐。",
    items: [
      { title: "经后补气第一方：红枣桂圆粥", content: "红枣10克去核+桂圆肉15克+小米同煮，温补气血安神，适合经期后面色苍白手脚冰凉者，脾胃虚弱者首选。", source: "博禾医生" },
      { title: "消水肿良方：冬瓜荷叶茶", content: "冬瓜皮+干荷叶煮水代茶饮，利水消肿祛湿，适合经期眼睑下肢水肿。体寒者可加2片生姜中和寒性。", source: "北京卫健委" },
      { title: "银耳花胶羹：胶原补起来", content: "银耳泡发+花胶炖煮至粘稠，补充胶原蛋白滋阴润燥，经后食用最佳。脾胃虚弱者少量多次，避免一次过饱。", source: "下厨房" }
    ]
  },
  language: {
    title: "语言学习",
    icon: "book",
    color: "var(--module-2)",
    items: [
      { title: "TED影子跟读：AI双语字幕指南2026", content: "精选2分钟片段做影子跟读，用Trancy逐音节发音评分找出Top3错误，再用AITalk做10分钟角色扮演。", link: "https://www.trancy.org/blog/ted-talks-language-learning-ai-bilingual-subtitle-guide-2026-35b9d2252005814b8b7dc9001c28ed3b", linkText: "去学习" },
      { title: "粤语入门：餐厅情景对话", content: "从点餐常用语开始：我想要(ngo5 soeng2 jiu3)、几多钱(gei2 do1 cin2)、買單(maai5 daan1)，每天练5句餐厅用语。", link: "https://www.yumcha.fun/blog/cantonese-lessons-for-beginners", linkText: "去学习" },
      { title: "韩语入门：字母与日常问候", content: "从40个韩文字母开始，掌握基本问候语안녕하세요(你好)、감사합니다(谢谢)、안녕히 가세요(再见)，每天复习5个字母。", link: "https://www.howtostudykorean.com/unit0/unit-0-lesson-1/", linkText: "去学习" }
    ]
  },
  professional: {
    title: "专业赋能",
    icon: "bolt",
    color: "var(--accent)",
    knowledgePoints: [
      { title: "分布式训练并行策略：TP/PP/DP/ZeRO", content: "张量并行(TP)拆分矩阵到多卡，通信密集适合同节点；流水线并行(PP)按层切分到不同节点；ZeRO/FSDP分片优化器状态、梯度和参数，消除显存冗余。", link: "https://blog.csdn.net/weixin_43444989/article/details/161028202" },
      { title: "预训练 (Pretraining)", content: "模型从随机权重开始，通过海量文本自监督学习预测下一个token，获得语言理解与世界知识。消耗算力最大，需数百到数千GPU训练数月。", link: "https://www.cnblogs.com/aimagician/p/20122343" },
      { title: "监督微调 (SFT)", content: "用高质量问答对数据微调预训练模型，让模型学会按期望格式和风格回答问题。是RLHF前的关键步骤，奠定对齐基础。", link: "https://blog.csdn.net/guoqi_666/article/details/163802747" },
      { title: "RLHF与PPO算法", content: "基于人类反馈的强化学习，先训练奖励模型，再用PPO算法优化策略模型。RLHF是ChatGPT对齐人类价值观的核心技术，但训练不稳定且成本高。", link: "https://arxiv.org/html/2507.04136" },
      { title: "DPO与GRPO：高效对齐新范式", content: "DPO绕过奖励模型直接用偏好对优化策略，更简单稳定；GRPO通过组内相对奖励优化，无需单独critic网络，成为开源对齐主流方案。", link: "https://blog.csdn.net/gitblog_00897/article/details/163777907" }
    ],
    industryNews: [
      { title: "TRL论文索引：40篇对齐论文映射到训练器", content: "Hugging Face TRL团队将40篇对齐与强化学习论文一一映射到对应Trainer（GRPOTrainer、DPOTrainer、SFTTrainer等），并提供可直接落地的超参配置。", source: "CSDN", link: "https://blog.csdn.net/gitblog_00897/article/details/163777907" },
      { title: "CVPR 2026：细粒度GRPO实现流模型精确偏好对齐", content: "提出Granular-GRPO(G²RPO)框架，通过奇异随机采样机制实现步级随机探索，更精确的信用分配，解决传统GRPO评估粒度过粗问题。", source: "CVPR 2026", link: "https://openaccess.thecvf.com/content/CVPR2026/papers/Zhou_Fine-Grained_GRPO_for_Precise_Preference_Alignment_in_Flow_Models_CVPR_2026_paper.pdf" },
      { title: "2026年8月新论文：用BTS-GRPO缓解LLM谄媚问题", content: "提出贝叶斯真相血清(BTS)作为GRPO奖励函数，奖励「出乎意料地常见」的回答，而非迎合提问者的答案，有效缓解模型谄媚行为。", source: "arXiv 2026.08", link: "https://arxiv.org/abs/2608.25267" }
    ]
  },
  investment: {
    title: "投资理财",
    icon: "wallet",
    color: "var(--module-4)",
    marketTrend: "8月A股主要指数多数收涨，中证1000/500领涨，电子、煤炭、机械涨幅靠前。稳健型资金持续涌入FOF和固收+，发行占比超40%。建议哑铃配置：红利底仓+科技成长逢低布局。",
    suggestions: [
      { title: "稳健配置首选：FOF多元资产策略", content: "FOF横跨股债商品及海外资产，低利率环境下成为存款替代重要选择。8月新发基金中FOF等稳健型占比超40%，年内规模增长超千亿元。", link: "https://www.stcn.com/article/detail/4060688.html" },
      { title: "哑铃+均衡：A股配置新思路", content: "科技成长仍是中期主线（AI算力、先进制造、电子通信），但需分批逢低布局；红利资产作为底仓与再平衡配置；医药板块调整充分可逆向关注。", link: "http://jjckb.xinhuanet.com/20260917/213ae07e9873477d8f41ac4a84c2716a/c.html" },
      { title: "月定投建议：月收入1.5万配置方案", content: "建议每月定投3000-4000元：60%偏债FOF（稳健底仓）、25%宽基指数（中证500/1000）、15%行业主题（科技/医药）。20万存款中留3-6个月应急金。", link: "https://finance.sina.com.cn/wm/2026-09-08/doc-inirceww4634551.shtml" }
    ],
    researchLinks: [
      { title: "基金配置策略报告(2026年9月期)", link: "https://finance.sina.com.cn/wm/2026-09-08/doc-inirceww4634551.shtml" },
      { title: "稳健型基金占据发行C位 多元配置走俏", link: "https://www.stcn.com/article/detail/4060688.html" },
      { title: "ETF遇冷FOF升温 基金发行冰火两重天", link: "https://www.stcn.com/article/detail/4089973.html" }
    ]
  },
  selfmedia: {
    title: "自媒体热点",
    icon: "flame",
    color: "var(--danger)",
    items: [
      { title: "泡泡手势舞：全明星打卡潮", content: "王鹤棣现场跳《泡泡》手势舞引爆全网，全明星参与短视频挑战，微博话题#全明星打卡泡泡手势舞#持续发酵。适合做翻跳+创意变装内容。", source: "新浪新闻" },
      { title: "蹦沙卡拉卡：卡点转场新玩法", content: "英文神曲Boom Shakalaka掀起卡点转场热潮，粉丝催拍敖瑞鹏挑战。魔性节奏+创意转场是爆款密码，适合独居女孩日常vlog开场。", source: "新浪财经" },
      { title: "小红书8月热榜：故地重游Plog", content: "故地重游主题笔记互动过万，用路线+变化+记忆点讲清重游故事。夜猫子打卡、胶片感日常也是流量密码，适合立Flag+生动照片风格。", source: "Neodrop" }
    ]
  }
};
