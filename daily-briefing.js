window.DAILY_BRIEFING = {
  date: "2026-09-02",
  generatedAt: "2026-09-02 09:00 由TRAE自动化生成",
  health: {
    title: "健康饮食",
    icon: "leaf",
    color: "var(--module-1)",
    diet: "今日宜温润补气、健脾消水肿。早餐山药小米粥配蒸蛋，午餐清蒸鱼+炒冬瓜，下午茶黄芪红枣枸杞茶，晚餐银耳莲子羹。忌生冷辛辣，避免玉米红薯豆类燕麦。",
    items: [
      { title: "经期消水肿良方", content: "玉米须水+冬瓜荷叶茶交替饮用，每日2-3杯，促进水分代谢。配合低盐饮食，避开下午大量饮水。", source: "中医养生指南" },
      { title: "补气养血搭配", content: "黄芪5片+红枣3颗+枸杞10粒泡水，经期后连喝7天效果最佳。搭配桂圆肉可增强补血效果。", source: "女性养生堂" },
      { title: "胶原蛋白补充", content: "银耳羹加花胶炖煮，每周2-3次。银耳提前泡发2小时，小火慢炖至出胶，加少许冰糖调味。", source: "美食养生" }
    ]
  },
  language: {
    title: "语言学习",
    icon: "book",
    color: "var(--module-2)",
    items: [
      { title: "TED影子跟读｜身体语言的力量", content: "Amy Cuddy经典演讲，练习肢体语言与自信表达。每日跟读10分钟，注意语调和重音。", link: "https://www.ted.com/talks/amy_cuddy_your_body_language_may_shape_who_you_are", linkText: "去学习" },
      { title: "英语每日5词｜旅游篇", content: "itinerary(行程)、souvenir(纪念品)、boarding pass(登机牌)、currency(货币)、reception(前台)。", link: "https://www.merriam-webster.com/word-of-the-day", linkText: "去学习" },
      { title: "粤语情景对话｜餐厅点餐", content: "学习茶餐厅点餐常用语：唔该、要个、几多钱、打包。配合视频模仿语气和声调。", link: "https://www.youtube.com/results?search_query=粤语情景对话+餐厅点餐", linkText: "去学习" },
      { title: "韩语入门｜字母复习", content: "复习14个基本辅音和10个元音，重点练习ㄱ/ㄴ/ㄷ/ㄹ/ㅁ发音。跟着标准发音口型视频练习。", link: "https://www.howtostudykorean.com/unit0/unit0lesson1/", linkText: "去学习" }
    ]
  },
  professional: {
    title: "专业赋能",
    icon: "bolt",
    color: "var(--accent)",
    knowledgePoints: [
      { title: "GPU显存优化技术", content: "混合精度训练(FP16/BF16)可减少约50%显存占用；梯度检查点以计算换显存；ZeRO优化器将参数/梯度/优化器状态分片到多卡。", link: "https://arxiv.org/abs/1910.02054" },
      { title: "分布式训练策略", content: "数据并行(DP/DDP)：各卡复制模型，数据分片；张量并行(TP)：模型内按维度切分；流水线并行(PP)：按层切分到不同设备。三者组合为3D并行。", link: "https://arxiv.org/abs/1909.08053" },
      { title: "预训练 vs SFT vs RL", content: "预训练：大规模无监督语料学习通用知识；SFT：有监督微调，用高质量标注数据对齐特定任务；RL：强化学习，用奖励模型进一步优化输出质量。", link: "" },
      { title: "PPO算法原理", content: "Proximal Policy Optimization通过裁剪策略更新比例，限制新旧策略差异，保证训练稳定。RLHF中用PPO根据奖励模型微调语言模型。", link: "https://arxiv.org/abs/1707.06347" },
      { title: "DPO与GRPO对比", content: "DPO直接用偏好数据优化策略，无需奖励模型，更简单稳定；GRPO是群体相对PPO，用组内相对奖励替代绝对奖励，降低方差，适合数学推理等场景。", link: "https://arxiv.org/abs/2305.18290" }
    ],
    industryNews: [
      { title: "DeepSeek-V3 训练技术公开", content: "DeepSeek团队公开V3模型训练细节，采用MoE架构+多阶段RL对齐，在数学和代码能力上实现突破。", source: "zartbot公众号", link: "https://github.com/deepseek-ai/DeepSeek-V3" },
      { title: "AI辅助研发新范式", content: "2026年AI辅助编程从代码补全演进为多Agent协作研发，覆盖需求分析、编码、测试全流程，研发效率提升3-5倍。", source: "机器之心", link: "https://www.jiqizhixin.com/" },
      { title: "GRPO在推理模型中广泛应用", content: "近期多篇论文验证GRPO在数学推理、代码生成场景的优势，相比PPO训练更稳定，奖励设计更简单，成为RL对齐新趋势。", source: "arXiv", link: "https://arxiv.org/search/?query=GRPO+large+language+model&searchtype=all" }
    ]
  },
  investment: {
    title: "投资理财",
    icon: "wallet",
    color: "var(--module-4)",
    marketTrend: "9月初A股震荡整理，政策面持续发力，市场情绪逐步修复。稳健投资者宜保持定投节奏，关注高股息蓝筹和债券型基金，控制权益仓位在30%以内。",
    suggestions: [
      { title: "基金定投策略", content: "月收入1.5万，建议每月定投3000元，分沪深300指数基金+债券基金各50%。坚持长期定投，利用微笑曲线摊薄成本。", link: "https://fund.eastmoney.com/" },
      { title: "存款配置建议", content: "20万存款建议：10万大额存单（3年期），5万货币基金（应急备用），3万债券基金，2万黄金ETF对冲风险。", link: "https://www.xueqiu.com/" },
      { title: "成都房产观察", content: "成都楼市政策持续宽松，天府新区和高新区核心地段抗跌性较强。刚需可关注，投资建议观望，优先保障流动性。", link: "https://cd.lianjia.com/" }
    ],
    researchLinks: [
      { title: "2026年Q3 A股市场策略报告", link: "https://research.cicc.com/" },
      { title: "基金定投全指南（2026版）", link: "https://fund.eastmoney.com/report/" },
      { title: "稳健型投资者资产配置白皮书", link: "https://www.cmbchina.com/Research/" }
    ]
  },
  selfmedia: {
    title: "自媒体热点",
    icon: "flame",
    color: "var(--danger)",
    items: [
      { title: "秋日胶片感日常", content: "小红书热门话题#秋日穿搭 #胶片感拍照，用Dazz相机模拟胶片质感，搭配暖色调滤镜，适合独居女孩日常vlog。", source: "小红书热榜" },
      { title: "经期运动打卡挑战", content: "抖音热门#经期友好运动 #女生健身，低强度瑜伽+拉伸，立Flag式开头+Rap解说，带动用户跟练。", source: "抖音热点" },
      { title: "独居女孩自律日常", content: "小红书爆款选题#独居女孩的一天，早起做饭+学习+运动的自律vlog，生动照片配励志文案，涨粉效果好。", source: "小红书创作中心" }
    ]
  }
};
