/**
 * 每日简报 - 由自动化任务每日生成
 * 工作台会自动加载此文件并展示在首页"今日简报"区域
 * 格式已扩展：支持链接跳转、知识点、行业资讯、投资建议等
 */
window.DAILY_BRIEFING = {
  date: "2026-08-04",
  generatedAt: "初始化占位 - 等待首次自动化任务运行",
  health: {
    title: "健康饮食",
    icon: "leaf",
    color: "var(--module-1)",
    diet: "今日推荐：早餐燕麦粥+鸡蛋，午餐山药排骨汤+糙米饭，晚餐银耳羹+清蒸鱼。经期间补充红枣姜茶。",
    items: [
      { title: "自动化任务即将启动", content: "每日早间8:00根据经期阶段自动推荐饮食方案。", source: "系统初始化" }
    ]
  },
  language: {
    title: "语言学习",
    icon: "book",
    color: "var(--module-2)",
    items: [
      { title: "英语跟读", content: "TED演讲：The Power of Introverts 影子跟读12分钟", link: "https://www.ted.com/talks/susan_cain_the_power_of_introverts", linkText: "去学习" },
      { title: "粤语情景", content: "茶餐厅点餐场景对话练习", link: "https://www.youtube.com/results?search_query=粤语茶餐厅点餐", linkText: "去学习" }
    ]
  },
  professional: {
    title: "专业赋能",
    icon: "bolt",
    color: "var(--accent)",
    knowledgePoints: [
      { title: "知识点1", content: "等待自动化任务更新", link: "" },
      { title: "知识点2", content: "等待自动化任务更新", link: "" },
      { title: "知识点3", content: "等待自动化任务更新", link: "" },
      { title: "知识点4", content: "等待自动化任务更新", link: "" },
      { title: "知识点5", content: "等待自动化任务更新", link: "" }
    ],
    industryNews: [
      { title: "自动化任务即将启动", content: "每日自动搜索AI辅助研发、LLM模型训练资讯及论文。", source: "系统初始化", link: "" }
    ]
  },
  investment: {
    title: "投资理财",
    icon: "wallet",
    color: "var(--module-4)",
    marketTrend: "等待自动化任务更新今日市场导向。",
    suggestions: [
      { title: "自动化任务即将启动", content: "每日根据个人情况（稳健型、月收入1.5万、存款20万、成都）给出投资建议。", link: "" }
    ],
    researchLinks: [
      { title: "等待更新", link: "" }
    ]
  },
  selfmedia: {
    title: "自媒体热点",
    icon: "flame",
    color: "var(--danger)",
    items: [
      { title: "自动化任务即将启动", content: "每日自动搜索小红书/抖音热门话题、热点跟拍建议。", source: "系统初始化" }
    ]
  }
};
