window.DAILY_BRIEFING = {
  date: "2026-08-27",
  generatedAt: "2026-08-27 09:00 由TRAE自动化生成",
  health: {
    title: "健康饮食",
    icon: "leaf",
    color: "var(--module-1)",
    diet: "今日宜温补脾胃、消水肿补气。晨起饮黄芪红枣枸杞茶补气，午后冬瓜荷叶茶利湿消水肿，晚间银耳莲子羹滋阴润肤。忌玉米红薯豆类燕麦等粗粮，以小米粥、山药粥替代主食，清淡少油。",
    items: [
      { title: "补气茶饮", content: "黄芪5g+红枣3颗+枸杞10粒，沸水冲泡代茶饮，补气升阳，适合脾胃虚弱者日常调理。", source: "中医养生食疗" },
      { title: "消水肿方案", content: "冬瓜荷叶茶：冬瓜皮30g+干荷叶5g煮水饮用，利水渗湿不伤正，替代玉米须水避免粗粮刺激。", source: "膳食营养指南" },
      { title: "胶原蛋白补充", content: "银耳百合羹：银耳1朵+百合10g+红枣2颗慢炖1小时，滋阴润肤补充植物胶质，适合晚间食用。", source: "女性养生食谱" }
    ]
  },
  language: {
    title: "语言学习",
    icon: "book",
    color: "var(--module-2)",
    items: [
      { title: "TED影子跟读法", content: "选取TED演讲中有清晰节奏的句子，延迟1-2秒跟读模仿语调重音。每日精练2句，配合旅游场景词汇5个，积少成多。", link: "https://www.ted.com", linkText: "去学习" },
      { title: "英语六级听力训练", content: "TED演讲+BBC新闻变速训练法：先0.75倍速逐句跟读3-5遍，再1倍速完整影子跟读，重点标注连读弱读。", link: "http://mtoutiao.xdf.cn/cet4-6/202602/15107077.html", linkText: "去学习" },
      { title: "粤语情景对话", content: "通过TVB情景短剧练习日常对话，如《爱回家》系列半小时剧集适合每日精听，模仿自然对话节奏和实用词汇。", link: "https://www.globalstreamguide.com/learn-cantonese-tvb-guide", linkText: "去学习" },
      { title: "韩语字母复习", content: "复习40个韩文字母（21元音+19辅音），重点区分相似音ㅐ/ㅔ，搭配日常用语감사합니다(谢谢)、어디예요(在哪)练习拼读。", link: "https://www.icourse163.org/course/FUDAN-1473663163", linkText: "去学习" }
    ]
  },
  professional: {
    title: "专业赋能",
    icon: "bolt",
    color: "var(--accent)",
    knowledgePoints: [
      { title: "GPU显存与HBM架构", content: "GPU主显存为3D堆叠DRAM(HBM)，A100/H100显存几十~百GB，带宽约2-3TB/s。存放模型权重、KV Cache和激活值，是训练显存瓶颈的关键。", link: "https://github.com/HzcIrving/SOTAFollow/blob/main/%E9%9D%A2%E7%AD%8B/LLM/LLM%E9%9D%A2%E8%AF%95%E5%85%A5%E9%97%A8%E7%9F%A5%E8%AF%86%E7%82%B9.md" },
      { title: "分布式训练并行策略", content: "数据并行(DP)将模型放单卡增大batchsize；模型并行(MP)拆分模型到多卡。现代采用FSDP2+TP+PP+EP+SP多维并行，通信重叠实现近线性千卡扩展。", link: "https://github.com/tomz/LLM-playground/blob/main/docs/2026-05-sota-llm-agi.md" },
      { title: "预训练与SFT后训练", content: "预训练用Decoder-Only架构做CLM任务；SFT收集高质量指令-回答对做交叉熵微调，与预训练同损失函数仅数据不同，简单稳定见效快。", link: "https://blog.csdn.net/weixin_43444989/article/details/161028202" },
      { title: "RL对齐：PPO vs DPO vs GRPO", content: "PPO需训练value function做基线；DPO直接用偏好数据做二分类交叉熵免奖励模型；GRPO用同prompt多条采样均值替代value网络，DeepSeek-R1用其激发推理能力。", link: "https://danielrjiang.github.io/files/publications/llm_rl_tutorial.pdf" },
      { title: "后训练四条路线辨析", content: "SFT模仿人类答案；RLHF用人类偏好训练奖励模型；DPO直接偏好优化；GRPO组相对策略优化。四者常被混谈，核心区别在是否需要奖励模型和价值网络。", link: "https://blog.csdn.net/weixin_43444989/article/details/161028202" }
    ],
    industryNews: [
      { title: "AdvGRPO：自适应红队测试框架", content: "提出基于GRPO的攻防协同训练框架，替代传统PPO/DPO，可引导安全对齐，推动LLM安全训练新范式。", source: "arXiv 2026", link: "https://arxiv.org/html/2606.09701" },
      { title: "SearchLLM用GRPO对齐搜索偏好", content: "小红书部署SearchLLM，用门控聚合策略解耦安全与行为目标，日均1.5亿PV的A/B测试验证生成质量提升。", source: "arXiv 2026", link: "https://arxiv.org/html/2603.10473v1" },
      { title: "2026年LLM训练工程全景", content: "从2017年Transformer到2026推理时代全景梳理，涵盖预训练、SFT、RL后训练全链路工程实践与最新进展。", source: "CSDN技术博客", link: "https://blog.csdn.net/weixin_43444989/article/details/161028202" }
    ]
  },
  investment: {
    title: "投资理财",
    icon: "wallet",
    color: "var(--module-4)",
    marketTrend: "8月A股从7月科技回调中修复，风格从'成长独涨'转向均衡分化。稳健配置型基金占比超40%，FOF规模年内增长超千亿。建议采用哑铃策略，红利底仓+科技成长均衡配置，不押注单一赛道。",
    suggestions: [
      { title: "固收+基金配置", content: "债券打底+小比例权益增强，契合闲钱理财需求。适合月收入1.5万中拿出3000-5000元定投，风险低回撤小。", link: "https://stcn.com/article/detail/4060688.html" },
      { title: "宽基指数定投", content: "近两年定投回测显示科创50等宽基累计浮盈约51%，建议日定投1000元策略，分散择时风险。", link: "http://m.toutiao.com/group/7677789885205447210/" },
      { title: "偏债FOF作压舱石", content: "多资产分散风险适合风险偏好较低投资者，20万存款中可用10万配置偏债FOF，兼顾收益与安全。", link: "https://cj.sina.com.cn/articles/view/7879776970/1d5abdaca06801d41y" }
    ],
    researchLinks: [
      { title: "8月基金投资策略：均衡修复，哑铃配置", link: "https://guba.eastmoney.com/news,jjdt,1762216777.html" },
      { title: "2026年8月投资方向梳理", link: "https://cj.sina.com.cn/articles/view/7879776970/1d5abdaca06801d41y" },
      { title: "稳健型基金占据发行C位", link: "https://stcn.com/article/detail/4060688.html" }
    ]
  },
  selfmedia: {
    title: "自媒体热点",
    icon: "flame",
    color: "var(--danger)",
    items: [
      { title: "机器人运动会搞笑翻车", content: "小红书热门话题热度破千万，机器人运动会现场各种翻车搞笑合集，适合跟拍创意：独居女孩vs家务机器人反差萌。", source: "小红书热搜" },
      { title: "60岁大爷勇闯AI动画", content: "抖音总热榜第5位，60岁大爷AI动画作品播放破千万，非遗嘉年华七夕站同步进行中，AI+非遗是当前爆款方向。", source: "抖音热搜" },
      { title: "老剧新梗：贺涵下雨了", content: "《我的前半生》九年前的台词'贺涵，下雨了，你能来接我吗'一夜刷屏，老剧二创是近期热门素材库，适合胶片感日常跟拍。", source: "多平台热搜" },
      { title: "英伟达二季度营收翻倍", content: "抖音热搜第2位，英伟达Q2营收翻倍引爆AI话题热度，科技赛道相关内容流量高，可结合AI赋能个人成长角度创作。", source: "抖音热搜榜" }
    ]
  }
};
