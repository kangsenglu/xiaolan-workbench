window.DAILY_BRIEFING = {
  date: "2026-09-08",
  generatedAt: "2026-09-08 09:30 由TRAE自动化生成",
  health: {
    title: "健康饮食",
    icon: "leaf",
    color: "var(--module-1)",
    diet: "白露将至天气转凉，脾胃虚弱者忌玉米红薯豆类燕麦。推荐温补：晨饮黄芪红枣枸杞茶补气，午后冬瓜荷叶茶消水肿，晚间银耳花胶羹养颜。经后调理以红枣枸杞乌鸡汤为宜，不追求减重。",
    items: [
      { title: "黄芪红枣枸杞茶", content: "补气养血经典方，取黄芪10克、红枣5颗去核、枸杞一小把，沸水冲泡闷15分钟。脾胃虚弱者晨起饮用尤佳。", source: "养生道" },
      { title: "冬瓜荷叶茶消水肿", content: "冬瓜连皮煮水加干荷叶，利水消肿不伤脾胃。经期前后面部浮肿可适量饮用，亦可搭配玉米须水交替使用。", source: "北京汤医科普" },
      { title: "银耳花胶羹", content: "银耳泡发慢炖出胶，加入花胶小块同炖，富含植物胶质与胶原蛋白，温润养颜不寒凉，适合脾胃虚弱者晚间食用。", source: "下厨房" }
    ]
  },
  language: {
    title: "语言学习",
    icon: "book",
    color: "var(--module-2)",
    items: [
      { title: "TED影子跟读：每日2分钟精练", content: "选TED-Ed动画短片或乔布斯斯坦福演讲，慢半拍跟读模仿语调节奏。建议每日聚焦2分钟片段反复练，比通篇跟读更高效。", link: "https://www.trancy.org/blog/ted-talks-language-learning-ai-bilingual-subtitle-guide-2026-35b9d2252005814b8b7dc9001c28ed3b", linkText: "去学习" },
      { title: "粤语情景对话：港剧片段跟读", content: "从购物、餐饮、社交等真实场景入手，练习高频粤语口语例句。可结合港剧片段辅助跟读，强化语感培养。", link: "http://www.polyu.edu.hk/clc/docdrive/genai/Cantonese_e.pdf", linkText: "去学习" },
      { title: "韩语入门：字母复习+日常用语", content: "华南理工大学《韩语日常会话入门》课程已开课，覆盖字母基础与日常对话，4万+人选课，适合零基础入门。", link: "https://higher.smartedu.cn/course/62d8ac12ce6ac77184c60049", linkText: "去学习" }
    ]
  },
  professional: {
    title: "专业赋能",
    icon: "bolt",
    color: "var(--accent)",
    knowledgePoints: [
      { title: "AI Infra：GPU显存与并行策略", content: "训练大模型常用TP（张量并行，节点内切分矩阵）、PP（流水线并行，跨节点切分层）、ZeRO/FSDP（分片优化器状态/梯度/参数）消除DP显存冗余。", link: "https://blog.csdn.net/weixin_43444989/article/details/161028202" },
      { title: "预训练 Pretraining", content: "在超10T tokens互联网文本上做下一个token预测，训练耗时数月、成本超千万美元。瓶颈在于数据质量与算力规模。", link: "https://rdi.berkeley.edu/agentic-ai/slides/lecture1.pdf" },
      { title: "SFT 监督微调", content: "在预训练模型上用指令-回答对进行监督学习，让模型学会遵循指令格式。数据量约百万级，是连接基座模型与应用的关键桥梁。", link: "https://github.com/yingwang/llm-tutorial" },
      { title: "RLHF与PPO对齐", content: "RLHF通过训练奖励模型拟合人类偏好，再用PPO进行强化学习优化。PPO用clip机制限制策略更新幅度，保证训练稳定性。", link: "https://github.com/yingwang/llm-tutorial" },
      { title: "DPO与GRPO对齐新范式", content: "DPO直接用偏好对数据优化，无需奖励模型；GRPO用组内相对优势替代基线函数，减少资源消耗。两者是RLHF的高效替代方案。", link: "https://blog.csdn.net/weixin_38252409/article/details/150921818" }
    ],
    industryNews: [
      { title: "清华+字节开源DAPO大规模RL系统", content: "DAPO算法解耦片段与动态采样策略，基于Verl框架训练Qwen2.5-32B，在AIME 2024数学竞赛取得50分，训练代码已全面开源。", source: "CSDN", link: "https://blog.csdn.net/qq_36603091/article/details/146366674" },
      { title: "博通AI半导体收入同比增221%", content: "博通FY2026 Q3 AI半导体收入167亿美元，同比+221%，Q4预计217亿。算力基础设施需求保持高景气，看好芯片与网络设备赛道。", source: "界面快讯", link: "http://m.toutiao.com/group/7682939869144875574/" },
      { title: "GRAIL：可验证奖励的梯度重加权RL", content: "南洋理工提出GRAIL方法，对可验证奖励的RL进行梯度重加权优化，提升模型推理对齐效率，论文已发布于arXiv。", source: "arXiv", link: "https://arxiv.org/html/2606.04889v1" }
    ]
  },
  investment: {
    title: "投资理财",
    icon: "wallet",
    color: "var(--module-4)",
    marketTrend: "9月初A股从7月科技回调中逐步修复，市场风格从'成长独涨'转向均衡分化。机构建议哑铃型策略：红利底仓稳健打底，小仓位布局科创与机械。稳健型投资者关注固收+和偏债FOF，契合月定投节奏。",
    suggestions: [
      { title: "固收+基金：债券打底+权益增强", content: "震荡市中固收+产品以债券为底仓、小比例权益增强，契合闲钱理财需求，8月新发占比超40%，适合稳健型配置。", link: "https://cj.sina.com.cn/articles/view/7879776970/1d5abdaca06801d41y" },
      { title: "红利底仓：低波动+高股息", content: "红利策略以高股息低波动为核心，适合作为资产压舱石。关注家居家电、消费50等低位修复赛道，分批建仓。", link: "http://m.toutiao.com/group/7682951017989767715/" },
      { title: "基金定投：哑铃配置策略", content: "8月建议均衡修复哑铃配置，一端红利底仓一端科技成长。存款20万建议分3-6月月定投建仓，平滑波动风险。", link: "https://guba.eastmoney.com/news,jjdt,1762216777.html" }
    ],
    researchLinks: [
      { title: "行业轮动模型跟踪周报(8.31-9.4)：红利稳健打底", link: "http://m.toutiao.com/group/7682951017989767715/" },
      { title: "8月基金投资策略：均衡修复，哑铃配置", link: "https://guba.eastmoney.com/news,jjdt,1762216777.html" },
      { title: "2026年8月投资方向梳理", link: "https://cj.sina.com.cn/articles/view/7879776970/1d5abdaca06801d41y" }
    ]
  },
  selfmedia: {
    title: "自媒体热点",
    icon: "flame",
    color: "var(--danger)",
    items: [
      { title: "火箭陆地回收科普拆解", content: "我国首次实现火箭陆地回收，热度超1100万。建议做科普拆解：回收动作、技术难点、下一步问题三镜头讲清，适合科技类跟拍。", source: "Neodrop热榜" },
      { title: "蹦沙卡拉卡卡点转场挑战", content: "魔性节奏+强反差转场席卷短视频平台，多位明星跟拍。适合独居女孩日常胶片感版本翻拍，搭配Rap风格BGM。", source: "新浪财经" },
      { title: "AI仙界视频爆火单条赞超315万", content: "33秒AI生成'仙界日常'视频获赞315万，网友当电子壁纸反复看。AI生成内容赛道持续火热，可尝试AI+胶片感日常创作。", source: "新榜AIGC精选" }
    ]
  }
};
