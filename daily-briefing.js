window.DAILY_BRIEFING = {
  date: "2026-09-10",
  generatedAt: "2026-09-10 09:00 由TRAE自动化生成",
  health: {
    title: "健康饮食",
    icon: "leaf",
    color: "var(--module-1)",
    diet: "今日温补脾胃、消水肿搭配。晨起黄芪红枣枸杞茶补气养血，午间山药小米粥养胃（避开玉米红薯豆类燕麦），下午冬瓜荷叶茶利水消肿，晚间银耳红枣羹补胶原。停经体质以温补为主，忌生冷寒凉。",
    items: [
      { title: "黄芪红枣枸杞茶", content: "黄芪10g、红枣5颗去核、枸杞一小把，沸水冲泡焖10分钟。补气养血，适合脾胃虚弱、气血不足体质，晨起饮用最佳。", source: "博禾医生" },
      { title: "冬瓜荷叶茶", content: "冬瓜皮30g、干荷叶5g煮水15分钟，利水消肿不伤脾胃，适合下午饮用，缓解经前或日常浮肿。", source: "民福康" },
      { title: "银耳红枣羹", content: "银耳半朵泡发撕碎、红枣3颗、冰糖适量，小火慢炖40分钟出胶。补充胶原蛋白润肤，晚间温服养胃。", source: "什么值得买" }
    ]
  },
  language: {
    title: "语言学习",
    icon: "book",
    color: "var(--module-2)",
    items: [
      { title: "TED影子跟读：每日一句跟读法", content: "选TED-Ed短动画或6分钟经典演讲，每句暂停跟读3遍模仿语调节奏，再完整跟读。今日5词：resilience、paradigm、nuance、catalyst、empathy。", link: "https://funfluen.com/learn/guides/learn-english-with-ted-talks/", linkText: "去学习" },
      { title: "粤语情景对话：餐饮点单实战", content: "六大高频场景之美食餐饮：先积累点单专属词汇，再角色扮演模拟对话。今日练：'唔该，畀一份叉烧饭'（麻烦，给一份叉烧饭）。", link: "http://m.163.com/dy/article/L15UUQAB0556M676.html", linkText: "去学习" },
      { title: "韩语入门：辅音复习+日常问候", content: "每日20分钟拼读练习，复习ㄱㄴㄷㄹ辅音，学习问候语：안녕하세요（你好）、감사합니다（谢谢）、죄송합니다（抱歉）。", link: "https://higher.smartedu.cn/course/62d8ac12ce6ac77184c60049", linkText: "去学习" }
    ]
  },
  professional: {
    title: "专业赋能",
    icon: "bolt",
    color: "var(--accent)",
    knowledgePoints: [
      { title: "GPU分布式并行策略", content: "DP数据并行最简单但显存浪费大；TP张量并行按矩阵拆分，通信密集适合节点内；PP流水线并行按层切分跨节点；ZeRO/FSDP将优化器状态、梯度、参数分片，显存效率最高。", link: "https://blog.csdn.net/weixin_43444989/article/details/161028202" },
      { title: "LLM训练三阶段全链路", content: "Pretrain大规模无监督学语言能力→SFT指令微调学对话格式→RLHF/PPO人类偏好对齐价值观。三阶段数据质量和配比决定模型上限。", link: "https://blog.csdn.net/qq_38146189/article/details/149155696" },
      { title: "RL对齐算法演进：PPO→DPO→GRPO", content: "PPO需Critic网络显存大；DPO直接用偏好数据优化无需reward model；GRPO去掉Critic用组内相对优势，显存省训练快，DeepSeek-R1采用。", link: "https://blog.csdn.net/qq_60735796/article/details/161807622" },
      { title: "RLVR vs RLHF核心区别", content: "RLHF用人类偏好数据训练reward model判断好坏；RLVR用程序自动验证答案对错（数学题可验算）。2026年主流模型均转向RLVR降低人工标注成本。", link: "https://jishuzhan.net/article/2038835286057684993" },
      { title: "分布式训练Checkpoint管理", content: "FSDP/TP将模型分片到多卡，checkpoint需分rank保存而非集中到单卡写入，避免IO瓶颈。NeMo Megatron-Bridge提供可扩展的checkpoint方案。", link: "https://www.nvidia.com/en-us/on-demand/session/gtc26-dlit82259/" }
    ],
    industryNews: [
      { title: "DRPO：用平滑正则替代PPO硬掩码", content: "论文提出Divergence Regularized Policy Optimization，将PPO的trust-region硬掩码替换为平滑的二次正则项，在偏离边界时仍提供修正梯度信号，训练更稳定。", source: "arXiv 2606.09821", link: "https://arxiv.org/pdf/2606.09821" },
      { title: "GRAIL：Token级优势重加权", content: "传统RL将序列级advantage均匀广播到所有token，稀释梯度信号。GRAIL提出token-wise优势重加权，让有效推理步骤获得更强梯度，减少filler词干扰。", source: "arXiv 2606.04889", link: "https://arxiv.org/html/2606.04889v1" },
      { title: "651篇论文全景：大模型RL技术深度研报", content: "AI Insight发布强化学习全景研报，覆盖EPO熵正则化、GDPO多奖励解耦、Beyond 80/20评估等前沿方向，2026年RL趋势从单一奖励走向多奖励精细化。", source: "AI Insight", link: "https://www.ai-insight.org/reports/rl-landscape" }
    ]
  },
  investment: {
    title: "投资理财",
    icon: "wallet",
    color: "var(--module-4)",
    marketTrend: "9月A股延续震荡，沪指3900点附近，量能维持高位但中期主线未明。8月急跌后缩量修复，保险资负新规引导资金风格再平衡，价值周期方向领涨。稳健型宜均衡配置，逢低定投摊低成本。",
    suggestions: [
      { title: "核心+卫星配置策略", content: "核心仓位70%配红利低波或中证A500宽基做底仓，卫星仓位30%轻仓参与科技成长结构性行情，市场情绪低迷时通过定投逐步摊低成本。", link: "https://cj.sina.cn/articles/view/1726551832/66e917180270229nq" },
      { title: "基金定投：按估值定额定投", content: "参照指数估值建立定投模型，低估多投高估少投。存款20万建议留6个月生活费应急，其余分12个月定投宽基指数，月投2000-3000元。", link: "http://m.toutiao.com/group/7679084973302809128/" },
      { title: "低风险配置：货基+短债", content: "月收入1.5万，建议30%配货币基金或短债基金做流动性管理，年化2-3%稳健收益，剩余按定投节奏配置权益资产，不追涨杀跌。", link: "https://caifuhao.eastmoney.com/news/20260826135303081259390" }
    ],
    researchLinks: [
      { title: "交银投顾配置建议 2026.9：静待政策窗口明朗", link: "https://www.fund001.com/webimages/upload2012/2026/09/01/135918621_524_26b5b1de-0b99-3b6c-9b45-91131e859a93.pdf" },
      { title: "中证报：风暴过后机构转守为攻，把握超跌机遇", link: "https://epaper.cs.com.cn/zgzqb/images/2026-08/17/J06/zqXB0617.pdf" },
      { title: "8月A股震荡行情稳健配置指南", link: "https://caifuhao.eastmoney.com/news/20260826135303081259390" }
    ]
  },
  selfmedia: {
    title: "自媒体热点",
    icon: "flame",
    color: "var(--danger)",
    items: [
      { title: "开学季运动健身打卡热潮", content: "抖音生活服务数据：开学前一周运动健身团购消费同比增86%，健身房增长181%。独居女孩可结合经期阶段调整强度，拍胶片感运动打卡Vlog跟拍热点。", source: "中金在线" },
      { title: "杀糕局：陌生人社交甜品新玩法", content: "小红书打卡笔记超10万篇、抖音话题播放量破2亿。十来人AA制分食网红蛋糕，人均100-300元。可拍独居女孩周末探店Vlog蹭热度。", source: "界面新闻" },
      { title: "AI仙界视频爆款：AIGC创作风向标", content: "33秒AI视频单条获赞315万，网友当电子壁纸反复观看。AI生成仙侠场景成为新流量密码，可结合立Flag+Rap风格做AI辅助创作。", source: "新榜" }
    ]
  }
};
