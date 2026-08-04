/**
 * 每日简报 - 由自动化任务每日生成
 * 工作台会自动加载此文件并展示在首页"今日简报"区域
 * 格式已扩展：支持链接跳转、知识点、行业资讯（含图文）、投资建议等
 *
 * 数据结构说明：
 * - health.diet: 动态饮食推荐，首页今日动态卡片会优先读取此值
 * - language.items[].link: 语言学习卡片附带的跳转链接
 * - professional.knowledgePoints: LLM基础知识每日5点，每点可附参考链接
 * - professional.industryNews: 行业动态资讯/论文，支持 image（图文）、source、link
 * - investment.marketTrend: 今日市场导向
 * - investment.suggestions: 基金/股票建议，支持 link 跳转
 * - investment.researchLinks: 投研报告链接
 * - 所有 items 均支持可选 image 字段用于图文展示
 */
window.DAILY_BRIEFING = {
  date: "2026-08-04",
  generatedAt: "初始化占位 - 等待首次自动化任务运行",
  health: {
    title: "健康饮食",
    icon: "leaf",
    color: "var(--module-1)",
    diet: "今日推荐：早餐红枣小米粥+水煮蛋，午餐山药排骨汤+糙米饭，晚餐银耳羹+清蒸鲈鱼。经期间补充红枣姜茶，忌冰饮生冷。消水肿：玉米须水。",
    items: [
      { title: "经期饮食调理", content: "当前处于经期阶段，建议温补饮食：红枣姜茶、当归鸡蛋汤、山药排骨汤。忌冰饮生冷、玉米红薯豆类燕麦（脾胃虚弱）。", source: "系统推荐" }
    ]
  },
  language: {
    title: "语言学习",
    icon: "book",
    color: "var(--module-2)",
    items: [
      { title: "TED影子跟读", content: "The Power of Introverts 影子跟读12分钟 + 5词打卡：articulate/collaborate/diverse/generate/implement", link: "https://www.ted.com/talks/susan_cain_the_power_of_introverts", linkText: "去TED学习" },
      { title: "粤语情景对话", content: "茶餐厅点餐场景对话练习：唔該，我要一個菠萝油 / 飲咩嘢？", link: "https://www.youtube.com/results?search_query=粤语茶餐厅点餐", linkText: "去跟读" },
      { title: "韩语字母复习", content: "今日复习ㄱ-ㅎ + 新学日常用语5句：오늘 날씨가 좋아요", link: "https://www.howtostudykorean.com", linkText: "去学习" }
    ]
  },
  professional: {
    title: "专业赋能",
    icon: "bolt",
    color: "var(--accent)",
    knowledgePoints: [
      { title: "GPU显存管理", content: "训练大模型时，显存瓶颈常出现在激活值和优化器状态。使用梯度检查点（Gradient Checkpointing）可节省30-50%显存，代价是约20%计算时间。", link: "https://arxiv.org/abs/1604.06174" },
      { title: "分布式训练-数据并行", content: "DataParallel vs DistributedDataParallel：DDP使用多进程，避免了GIL开销，是PyTorch推荐方式。梯度同步使用AllReduce实现高效通信。", link: "https://pytorch.org/tutorials/intermediate/ddp_tutorial.html" },
      { title: "混合精度训练", content: "AMP（自动混合精度）使用FP16+FP32混合，通过GradScaler防止梯度下溢。可提升训练速度1.5-2倍，减少显存使用。", link: "https://arxiv.org/abs/1710.03740" },
      { title: "RLHF对齐-PPO", content: "PPO通过裁剪目标函数限制策略更新幅度，避免奖励黑客问题。需要Actor、Critic、Reward Model、Reference Model四个模型协同。", link: "https://arxiv.org/abs/1707.06347" },
      { title: "DPO简化对齐", content: "DPO跳过奖励模型，直接从偏好数据优化策略。相比PPO更简单稳定，但可能牺牲部分性能。公式基于Bradley-Terry模型推导。", link: "https://arxiv.org/abs/2305.18290" }
    ],
    industryNews: [
      { title: "AI辅助研发工具趋势", content: "GitHub Copilot企业版渗透率持续提升，多Agent协作开发框架成为新热点。Cursor、Windsurf等AI IDE竞争加剧。", source: "行业观察", link: "https://github.com/features/copilot", image: "" },
      { title: "LLM模型训练前沿", content: "开源模型持续逼近闭源，Llama系列新版本在推理能力上显著提升。SFT+DPO成为轻量对齐主流方案。", source: "ArXiv", link: "https://arxiv.org/list/cs.CL/recent", image: "" }
    ]
  },
  investment: {
    title: "投资理财",
    icon: "wallet",
    color: "var(--module-4)",
    marketTrend: "市场震荡偏强，关注政策端导向。建议维持稳健配置，关注成都本地房产政策和低风险理财机会。",
    suggestions: [
      { title: "基金定投建议", content: "建议继续定投宽基指数基金（沪深300），月定投2000元。当前估值处于合理区间，适合长期布局。", link: "https://fund.eastmoney.com", linkText: "查看基金详情" },
      { title: "低风险理财", content: "存款20万中建议10万配置货币基金/短债基金，年化预期2.5-3.5%。保持5万流动资金备用。", link: "https://www.chinaamc.com", linkText: "查看理财产品" }
    ],
    researchLinks: [
      { title: "东方财富-研报中心", link: "https://data.eastmoney.com/report/" },
      { title: "天天基金网", link: "https://fund.eastmoney.com/" },
      { title: "成都房产资讯", link: "https://cd.fang.com" }
    ]
  },
  selfmedia: {
    title: "自媒体热点",
    icon: "flame",
    color: "var(--danger)",
    items: [
      { title: "小红书热点", content: "#胶片感日常 热度78.9万，适合你的生动照片风格。#独居女孩日常 持续走高。", source: "平台热榜" },
      { title: "抖音热门", content: "#一周健身打卡 热度89.2万，配合经期友好运动方向。说唱挑战类内容持续火爆。", source: "抖音热榜" }
    ]
  }
};
