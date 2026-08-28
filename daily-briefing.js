window.DAILY_BRIEFING = {
  date: "2026-08-28",
  generatedAt: "2026-08-28 08:30 由TRAE自动化生成",
  health: {
    title: "健康饮食",
    icon: "leaf",
    color: "var(--module-1)",
    diet: "经期后以温补气血为主，忌玉米红薯豆类燕麦。早餐红枣桂圆粳米粥补血安神，下午黄芪红枣枸杞茶补气升阳，晚餐冬瓜排骨汤消水肿。银耳羹补充胶原蛋白，不寒不燥适合脾虚体质。",
    items: [
      { title: "红枣桂圆粥", content: "红枣含铁防贫血，桂圆安神补血，与粳米同煮适合经期后面色苍白、手脚冰凉。体质燥热者减少桂圆用量。", source: "博禾医生" },
      { title: "冬瓜消水肿", content: "冬瓜利尿消肿，搭配排骨煲汤，经期后体内水分代谢慢时食用，避免高盐加工食品加重水肿。", source: "健康指南" },
      { title: "黄芪红枣枸杞茶", content: "黄芪补气固表，红枣养血，枸杞滋肾，三味泡茶适合经期后乏力、气色差，提升元气不上火。", source: "养生推荐" },
      { title: "银耳羹", content: "银耳富含植物胶质，补充胶原蛋白，滋润肌肤，性平不刺激，脾胃虚弱者也可安心食用。", source: "食疗方" }
    ]
  },
  language: {
    title: "语言学习",
    icon: "book",
    color: "var(--module-2)",
    items: [
      { title: "英语·TED影子跟读法", content: "选TED-Ed短片（3分钟内，发音清晰），第一遍盲听，第二遍开英文字幕标生词，第三遍影子跟读模仿语调停顿。坚持几周听觉辨识力显著提升。", link: "https://www.langflix.io/zh-Hant/blog/shadowing-guide", linkText: "去学习" },
      { title: "英语·每日5词·旅游专项", content: "今日词汇：itinerary行程、boarding pass登机牌、accommodation住宿、reservation预订、customs海关。用影子跟读法朗读例句3遍。", link: "https://www.ted.com/talks", linkText: "去TED" },
      { title: "粤语·情景对话·点餐场景", content: "「我想点餐」ngo5 soeng2 dim2 caan1、「有咩推荐？」jau5 me1 teoi1 gin3、「埋单」maai4 daan1。分场景整理10组高频问答，一人分饰两角模拟对话。", link: "https://liuxue.xdf.cn/blog/blog_7950120.shtml", linkText: "去练习" },
      { title: "韩语·字母复习+日常用语", content: "复习元音ㅏ(a) ㅓ(eo) ㅗ(o) ㅜ(u) ㅡ(eu)，辅音ㄱ(g) ㄴ(n) ㄷ(d)。日常用语：안녕하세요(您好)、감사합니다(谢谢)。", link: "https://www.polyu.edu.hk/clc/docdrive/genai/Cantonese_e.pdf", linkText: "去复习" }
    ]
  },
  professional: {
    title: "专业赋能",
    icon: "bolt",
    color: "var(--accent)",
    knowledgePoints: [
      { title: "GPU显存与HBM", content: "GPU使用HBM高带宽显存（A100/H100），容量数十至百GB，带宽达2-3TB/s，用于存储模型权重、KV Cache和激活值。", link: "https://github.com/HzcIrving/SOTAFollow/blob/main/%E9%9D%A2%E7%AD%8B/LLM/LLM%E9%9D%A2%E8%AF%95%E5%85%A5%E9%97%A8%E7%9F%A5%E8%AF%86%E7%82%B9.md" },
      { title: "数据并行DP", content: "多GPU同时训练不同数据批次，前向反向计算后聚合梯度。适合模型可放入单卡的情况，是分布式训练的基础范式。", link: "https://blog.csdn.net/weixin_60896526/article/details/153578455" },
      { title: "张量并行TP", content: "将矩阵乘法沿某一维度拆分到多张卡并行计算，通信密集，通常在同一节点内使用NVLink高速互联。", link: "https://blog.csdn.net/weixin_43444989/article/details/161028202" },
      { title: "流水线并行PP", content: "将模型层切成几段分别放到不同节点，适合跨节点部署，对带宽要求较低，但会产生气泡（bubble）延迟。", link: "https://blog.csdn.net/weixin_43444989/article/details/161028202" },
      { title: "GRPO组相对策略优化", content: "GRPO用同一问题的多组回答均值作为基线，替代PPO的value网络，减少显存占用，DeepSeek-R1-Zero用它激发强推理行为。", link: "https://danielrjiang.github.io/files/publications/llm_rl_tutorial.pdf" }
    ],
    industryNews: [
      { title: "GRPO激发推理能力无需监督步骤", content: "DeepSeek-R1-Zero使用GRPO进行强化学习后训练，无需监督微调步骤即可激发强推理行为，验证了纯RL对齐的潜力。", source: "RL Tutorial", link: "https://danielrjiang.github.io/files/publications/llm_rl_tutorial.pdf" },
      { title: "GIFT框架融合GRPO与DPO", content: "新框架GIFT将GRPO的在线多响应生成与DPO的隐式奖励结合，通过联合归一化消除隐式奖励的难解项，提升对齐效率。", source: "arXiv", link: "https://arxiv.org/html/2510.23868v2" },
      { title: "AWPO显式推理奖励强化LLM工具使用", content: "AWPO通过显式推理奖励整合强化LLM工具使用能力，为Agent场景下的RL对齐提供新思路，论文发布于2026年8月。", source: "CSDN", link: "https://blog.csdn.net/tingyunye/article/details/157174564" }
    ]
  },
  investment: {
    title: "投资理财",
    icon: "wallet",
    color: "var(--module-4)",
    marketTrend: "8月A股从7月科技回调中逐步修复，市场风格从成长独涨转向均衡分化。政策预期升温支撑风险偏好，但外部扰动与业绩验证仍存不确定性，结构机会优于趋势机会。新发基金中稳健型产品占比超40%。",
    suggestions: [
      { title: "哑铃型均衡配置", content: "红利底仓打底+科技成长（AI产业链、国产算力、半导体）逢低布局，摒弃极端押注，适合稳健型投资者。", link: "https://guba.eastmoney.com/news,jjdt,1762216777.html" },
      { title: "债券票息策略为主", content: "基本面弱复苏+流动性呵护支撑债市，配置中短久期利率债及高等级信用债，关注降准降息预期带来的交易窗口。", link: "https://www.fund001.com/webimages/upload2012/2026/07/31/155335334_524_385ada5d-5c38-3cdf-9815-19383f01de00.pdf" },
      { title: "定投宽基指数", content: "科创50、中证500等宽基指数近2年定投回测收益可观，建议月收入1.5万者可每月定额2000-3000元定投，长期摊薄成本。", link: "http://m.toutiao.com/group/7677789885205447210/" }
    ],
    researchLinks: [
      { title: "交银投顾2026年8月配置建议", link: "https://www.fund001.com/webimages/upload2012/2026/07/31/155335334_524_385ada5d-5c38-3cdf-9815-19383f01de00.pdf" },
      { title: "8月基金投资策略：均衡修复哑铃配置", link: "https://guba.eastmoney.com/news,jjdt,1762216777.html" },
      { title: "稳健型基金占据发行C位", link: "https://stcn.com/article/detail/4060688.html" }
    ]
  },
  selfmedia: {
    title: "自媒体热点",
    icon: "flame",
    color: "var(--danger)",
    items: [
      { title: "七夕反套路过法", content: "乞巧节女性力量主题成为小红书热点，悦己+闺蜜情谊+二次创作内容戳中用户情绪点，适合立Flag+生动照片风格切入。", source: "新媒体小橘" },
      { title: "秋季外套大测评", content: "抖音热搜榜秋季外套测评热度高涨，胶片感日常穿搭+真实测评易出爆款，可结合独居女孩日常场景拍摄。", source: "抖音热搜" },
      { title: "朱志鑫新歌i手势舞挑战", content: "手势舞挑战持续火爆，跟拍热门BGM+个人风格改编（如运动打卡场景）是快速涨粉的低门槛选题。", source: "抖音挑战榜" },
      { title: "小红书未来薯地计划扩容", content: "九大少儿频道入驻小红书，平台内容生态持续丰富，知识型+生活方式内容流量扶持明显。", source: "澎湃新闻" }
    ]
  }
};