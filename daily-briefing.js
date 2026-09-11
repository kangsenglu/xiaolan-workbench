window.DAILY_BRIEFING = {
  date: "2026-09-11",
  generatedAt: "2026-09-11 10:30 由TRAE自动化生成",
  health: {
    title: "健康饮食",
    icon: "leaf",
    color: "var(--module-1)",
    diet: "经期后调理期，以补气养血、健脾利湿为主。早餐红糖姜枣茶+蒸苹果，午餐瘦肉炒菠菜+小米粥，下午茶黄芪红枣枸杞茶，晚餐冬瓜排骨汤。忌生冷、玉米红薯豆类燕麦。",
    items: [
      {
        title: "消水肿推荐：赤小豆冬瓜汤",
        content: "赤小豆30g+冬瓜200g清水熬煮，赤小豆利水消肿，冬瓜清热祛湿，适合经期后仍有水肿困扰的人群，温服效果更佳。",
        source: "民福康"
      },
      {
        title: "补气养血：黄芪山药汤",
        content: "黄芪、党参各30g布包，淮山30g、大枣30g同煮，盐调味。补益肺气、健脾养血，适合气虚型易疲倦乏力者。",
        source: "京东健康"
      },
      {
        title: "补铁搭配：瘦肉+维C",
        content: "补铁选瘦肉、鸭血、菠菜，搭配橙子、彩椒等维C食物促进吸收。经期后每日保证50-100g瘦肉，预防缺铁性贫血。",
        source: "北京卫健委"
      }
    ]
  },
  language: {
    title: "语言学习",
    icon: "book",
    color: "var(--module-2)",
    items: [
      {
        title: "TED影子跟读：专注力主题",
        content: "精选《How to Stay Focused in a Distracted World》演讲，0.75倍速校准发音→1倍速跟读→1.25倍速快速跟读，每日15分钟提升听力口语。",
        link: "https://www.ted.com/talks",
        linkText: "去TED学习"
      },
      {
        title: "粤语情景对话：餐厅点餐",
        content: "B站经典粤语情景短剧系列，涵盖餐厅点餐、问路、购物等日常生活场景，附拼音标注，每天学5句实用表达。",
        link: "https://search.bilibili.com/all?keyword=粤语情景对话",
        linkText: "去B站学习"
      },
      {
        title: "韩语入门：字母与日常用语",
        content: "韩语四十音系统复习+日常问候用语，搭配发音口型视频，每天学习10个字母+3句日常用语，循序渐进打基础。",
        link: "https://search.bilibili.com/all?keyword=韩语入门字母",
        linkText: "去B站学习"
      },
      {
        title: "每日5词：旅游英语篇",
        content: "今日词汇：itinerary（行程）、check-in（办理入住）、boarding pass（登机牌）、currency（货币）、souvenir（纪念品）。",
        link: "https://www.merriam-webster.com/word-of-the-day",
        linkText: "去查单词"
      }
    ]
  },
  professional: {
    title: "专业赋能",
    icon: "bolt",
    color: "var(--accent)",
    knowledgePoints: [
      {
        title: "LLM训练三阶段",
        content: "完整LLM训练分三阶段：Pretrain（预训练，海量无标注数据学习语言规律）→ SFT（监督微调，指令数据让模型学会听话）→ RLHF（人类反馈强化学习，对齐人类偏好）。",
        link: "https://blog.csdn.net/qq_38146189/article/details/149155696"
      },
      {
        title: "分布式训练三大并行策略",
        content: "TP（张量并行）：矩阵拆分到多卡，通信密集，适合单节点；PP（流水线并行）：按层切分到多节点，带宽要求低；ZeRO/FSDP：优化器状态/梯度/参数分片，消除显存冗余。",
        link: "https://blog.csdn.net/weixin_43444989/article/details/161028202"
      },
      {
        title: "SFT监督微调原理",
        content: "SFT用(instruction, response)配对数据继续训练LLM，最小化生成回复与标准答案的交叉熵损失，让模型学会遵循指令输出期望格式的回复。",
        link: "https://juejin.cn/post/7643826783825952809"
      },
      {
        title: "PPO vs DPO 强化学习对齐",
        content: "PPO：传统RLHF算法，需独立奖励模型，训练复杂不稳定；DPO：直接偏好优化，跳过奖励模型，用偏好对直接优化策略，更简单稳定，是当前主流。",
        link: "https://blog.csdn.net/weixin_42499004/article/details/160485041"
      },
      {
        title: "GRPO分组相对策略优化",
        content: "GRPO是DeepSeek提出的RL算法，通过组内相对优势计算替代绝对奖励，无需 Critic 网络，大幅降低显存开销，在数学推理任务上效果显著。",
        link: "https://blog.csdn.net/weixin_42499004/article/details/160485041"
      }
    ],
    industryNews: [
      {
        title: "Qwen提出GSPO新算法 解决GRPO训练不稳定问题",
        content: "Qwen团队提出Group Sequence Policy Optimization（GSPO），将优化粒度从token级别提升到序列级别，从根本上解决GRPO长期训练的不稳定性和模型崩溃问题。",
        source: "DeepSeek社区",
        link: "https://deepseek.csdn.net/6a7c872f10ee7a33f29a0a39.html"
      },
      {
        title: "清华+字节开源DAPO大规模RL训练系统",
        content: "清华大学联合字节提出DAPO（解耦片段与动态采样策略优化）算法并开源训练系统，基于Verl框架，使用Qwen2.5-32B在AIME 2024上取得50分高分。",
        source: "CSDN",
        link: "https://blog.csdn.net/qq_36603091/article/details/146366674"
      },
      {
        title: "651篇论文全景：大模型强化学习技术深度研报",
        content: "AI Insight发布RL技术研报，梳理651篇论文。2026年趋势：GDPO（NVIDIA）多奖励解耦、Beyond 80/20长尾推理、EPO熵正则化Agent优化。",
        source: "AI Insight",
        link: "https://www.ai-insight.org/reports/rl-landscape"
      }
    ]
  },
  investment: {
    title: "投资理财",
    icon: "wallet",
    color: "var(--module-4)",
    marketTrend: "9月A股市场交易热度下行，微盘风格强势，缺乏明确主线，风格轮动较快。建议采用哑铃策略，兼顾红利底仓与科技成长，均衡配置为核心思路。",
    suggestions: [
      {
        title: "稳健底仓：红利低波动指数基金",
        content: "上证红利低波动指数选取50只连续分红、股息率高且波动率低的股票，适合作为稳健底仓。平安上证红利低波指数A可关注。",
        link: "https://www.jiemian.com/article/15082194.html"
      },
      {
        title: "基金定投：均衡配置思路",
        content: "月收入1.5万、存款20万的稳健型投资者，建议每月定投3000-5000元，60%配置红利/债券基金，40%配置均衡型权益基金，分散风险。",
        link: "https://guba.eastmoney.com/news,jjdt,1762216777.html"
      },
      {
        title: "成都房产：观望为主 关注核心区域",
        content: "当前房地产市场仍在调整期，成都核心区（高新、锦江）抗跌性较强。建议存款保留流动性，暂不急入场，关注政策信号与成交量变化。",
        link: ""
      }
    ],
    researchLinks: [
      {
        title: "上海证券2026年8月基金投资策略",
        link: "https://cj.sina.cn/article/norm_detail?froms=ttmp&url=https%3A%2F%2Ffinance.sina.com.cn%2Fwm%2F2026-08-06%2Fdoc-inimksmf3773093.shtml%3Ffinpagefr=ttzz"
      },
      {
        title: "东方证券2026年9月主动权益基金配置月观点",
        link: "http://m.microbell.com/wap_detail.aspx?id=9da7ad06c807703f00d988cb305dbfaa"
      }
    ]
  },
  selfmedia: {
    title: "自媒体热点",
    icon: "flame",
    color: "var(--danger)",
    items: [
      {
        title: "原生感胶片风潮爆火 素颜抓拍成新流量密码",
        content: "日本摄影师增田彩来掀起原生感胶片风潮，#男友视角胶片 #增田彩来 等话题在抖音小红书曝光超2700万次。不化妆不布景，自然状态+生活化叙事是核心。",
        source: "什么值得买"
      },
      {
        title: "手机胶片感拍照 普通人也能出大片",
        content: "手机胶片滤镜持续热门，十余种经典胶片风格+追光浓郁新色调，一键直出胶片氛围。蓝图调色盘横滑调色、纵滑调影调，操作简单易上手。",
        source: "什么值得买"
      },
      {
        title: "小红书热榜趋势：低成本高互动选题",
        content: "8月小红书热榜呈现"10分钟、3千元、10个动作"的选题特征：具体任务+明确预算+清晰步骤，用户可直接跟进执行，互动转化率高。",
        source: "Neodrop"
      },
      {
        title: "独居女孩日常+运动打卡 胶片感yyds",
        content: "#独居女孩日常 #运动打卡 #胶片感日常 持续热门，立Flag+生动照片+Rap风格内容表现亮眼。法式胶片帧+花房氛围感是夏末秋初拍照热门风格。",
        source: "今日头条"
      }
    ]
  }
};
