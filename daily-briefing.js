/**
 * 每日简报 - 由自动化任务每日生成
 * 工作台会自动加载此文件并展示在首页"今日简报"区域
 */
window.DAILY_BRIEFING = {
  date: "2026-08-04",
  generatedAt: "初始化占位 - 等待首次自动化任务运行",
  investment: {
    title: "投资理财",
    icon: "wallet",
    color: "var(--module-4)",
    items: [
      { title: "自动化任务即将启动", content: "每日早间8:00自动搜索最新投资资讯并更新此区域。你可以在 user-suggestions.txt 中写下关注方向。", source: "系统初始化" }
    ]
  },
  professional: {
    title: "专业赋能",
    icon: "bolt",
    color: "var(--accent)",
    items: [
      { title: "自动化任务即将启动", content: "每日早间8:00自动搜索AI/ML前沿动态、zartbot公众号更新并更新此区域。", source: "系统初始化" }
    ]
  },
  selfmedia: {
    title: "自媒体热点",
    icon: "flame",
    color: "var(--danger)",
    items: [
      { title: "自动化任务即将启动", content: "每日早间8:00自动搜索小红书/抖音热门话题、热点跟拍建议并更新此区域。", source: "系统初始化" }
    ]
  }
};
