# 小蓝UP UP · WorkBuddy

> 个人成长工作台 —— 每日简报、运动计划、多维度成长追踪，一切尽在掌握。

小蓝UP UP · WorkBuddy 是一个纯前端的个人成长管理应用，部署在 GitHub Pages 上，无需服务器、无需登录，打开即用。涵盖健康养生、语言学习、专业成长、音乐收藏、投资理财、自媒体热点六大模块，通过 GitHub Actions 实现每日内容自动更新。

## 在线访问

- 在线地址：`https://<你的GitHub用户名>.github.io/xiaolan-workbench-online/`
- （将仓库部署到 GitHub Pages 后自动生效）

## 功能模块

### 1. 健康养生
- 每日应季饮食建议（根据节气自动生成）
- 颈腰椎护理、运动恢复、睡眠改善等实用健康贴士
- 养生知识来源标注，内容可靠有据

### 2. 语言学习
- 英语 TED 跟读训练（ted.com 真实链接）
- 英语 AI 对话练习（ChatGPT / Claude 场景模拟）
- 粤语情景学习（茶楼点餐、日常对话）
- 韩语入门基础（TTMIK 系统课程）
- 日语 N3 语法精讲、英语播客听力等多语言覆盖

### 3. 专业成长
- AI/ML 核心知识点（Transformer、LoRA、RAG、Diffusion Model 等）
- AI 行业新闻动态（OpenAI、通义千问、MCP 协议等前沿资讯）
- 每篇配有论文/原文链接，方便深入学习

### 4. 音乐收藏
- 个人音乐播放列表管理
- 本地收藏，随时回听

### 5. 投资理财
- A 股市场趋势分析（估值、政策、资金流向）
- 投资建议（红利策略、AI 科技、黄金配置、指数定投等）
- 研究资源链接（东方财富、雪球、巨潮资讯）

### 6. 自媒体热点
- 每日自媒体热门选题推荐
- 涵盖 AI 工具、养生、副业、数字游民等热门赛道
- 内容方向建议与平台热榜来源标注

## 文件结构

```
xiaolan-workbench-online/
├── index.html                  # 主页面
├── daily-briefing.js           # 每日简报数据（自动生成）
├── weekly-plan.js              # 每周运动计划数据（自动生成）
├── style.css                   # 样式文件
├── app.js                      # 应用主逻辑
├── scripts/
│   └── generate-daily.mjs      # 内容生成脚本（Node.js）
├── .github/
│   └── workflows/
│       ├── update-daily.yml    # 每日自动更新工作流
│       └── deploy-pages.yml    # GitHub Pages 部署工作流
└── README.md                   # 项目说明
```

## 自动化机制

### 每日简报自动更新

项目通过 GitHub Actions 实现每日内容自动更新，无需人工干预：

1. **定时触发**：每天 UTC 0:00（北京时间 8:00）自动运行 `update-daily.yml` 工作流
2. **内容生成**：执行 `scripts/generate-daily.mjs` 脚本，根据当天日期从内容池中轮换选取内容
3. **自动提交**：生成的新内容自动 commit 并 push 到仓库
4. **自动部署**：push 触发 `deploy-pages.yml`，GitHub Pages 自动更新

### 内容轮换原理

生成脚本 `scripts/generate-daily.mjs` 内置了丰富的内容池：

| 内容池 | 条目数 | 每日选取数 | 说明 |
|--------|--------|------------|------|
| HEALTH_DIETS | 10 条 | 1 条 | 应季饮食建议 |
| HEALTH_ITEMS | 10 条 | 3 条 | 健康养生贴士 |
| LANG_ITEMS | 10 条 | 4 条 | 语言学习内容 |
| AI_KNOWLEDGE | 10 条 | 5 条 | AI/ML 知识点 |
| AI_NEWS | 10 条 | 3 条 | AI 行业新闻 |
| INVESTMENT_TRENDS | 7 条 | 1 条 | 市场趋势分析 |
| INVESTMENT_SUGGESTIONS | 10 条 | 3 条 | 投资建议 |
| MEDIA_TRENDS | 10 条 | 3 条 | 自媒体热点 |

轮换算法使用 `dayOfYear % pool.length` 计算起始索引，确保每天内容不同且可循环复用。

### 运动计划自动生成

每周运动计划同样由 `generate-daily.mjs` 生成：

- 强度系数在 0.6 / 0.7 / 0.75 / 0.8 / 0.85 之间轮换
- 每日运动安排固定（易筋经、力量训练、游泳交替）
- 备注说明根据日期偏移轮换，保持新鲜感
- 如填写经期数据，将自动调整至经期低强度计划

## 本地开发

### 环境要求

- Node.js 18+（推荐 20 LTS）
- 现代浏览器（Chrome / Firefox / Edge / Safari）

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/<你的用户名>/xiaolan-workbench-online.git
cd xiaolan-workbench-online

# 手动生成每日内容（可选，仓库已包含生成好的数据）
node scripts/generate-daily.mjs

# 启动本地服务器（任选一种）
npx serve .
# 或
python -m http.server 8000
# 或使用 VS Code Live Server 插件
```

打开浏览器访问 `http://localhost:8000`（或 `http://localhost:3000`）即可查看应用。

### 修改内容池

编辑 `scripts/generate-daily.mjs` 中的内容池数组，添加或修改条目：

```javascript
const HEALTH_ITEMS = [
  {
    title: "你的健康贴士标题",
    content: "详细内容描述...",
    source: "内容来源"
  },
  // 添加更多条目...
];
```

修改后运行 `node scripts/generate-daily.mjs` 即可重新生成内容文件。

## 数据存储

本应用所有用户数据存储在浏览器的 `localStorage` 中：

- **打卡记录**：每日健康、学习、运动打卡数据
- **自定义内容**：用户添加的个性化条目
- **设置偏好**：主题、显示偏好等配置
- **音乐收藏**：个人播放列表

数据特点：
- 无需注册登录，无需服务器
- 数据仅保存在本地浏览器，隐私安全
- 清除浏览器缓存会导致数据丢失，建议定期导出备份
- 不同设备/浏览器之间数据不互通

## 自定义指南

### 修改每日简报内容

1. 编辑 `scripts/generate-daily.mjs` 中对应的内容池数组
2. 本地运行 `node scripts/generate-daily.mjs` 验证
3. 提交代码，GitHub Actions 将自动部署

### 修改运动计划

1. 编辑 `scripts/generate-daily.mjs` 中 `generateWeeklyPlan` 函数的运动安排
2. 可调整强度系数轮换列表 `intensities`
3. 可修改每日运动项目和备注说明

### 修改页面样式

- 编辑 `style.css` 调整颜色、布局、字体等
- 编辑 `index.html` 修改页面结构
- 编辑 `app.js` 修改交互逻辑

### 配置 GitHub Pages

1. 将仓库推送到 GitHub
2. 进入仓库 Settings → Pages
3. Source 选择 "GitHub Actions"
4. 推送代码后自动触发部署工作流

### 调整自动更新时间

编辑 `.github/workflows/update-daily.yml` 中的 cron 表达式：

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # UTC 0:00 = 北京时间 8:00
```

常用时区对照：
- `0 0 * * *` → 北京时间 8:00
- `0 12 * * *` → 北京时间 20:00
- `0 23 * * *` → 北京时间 7:00（次日）

## 技术栈

- 纯 HTML / CSS / JavaScript，无构建工具
- Node.js ES Modules（仅用于内容生成脚本）
- GitHub Actions（自动化更新与部署）
- GitHub Pages（免费托管）
- localStorage（本地数据存储）

## 许可证

MIT License - 可自由使用和修改。

---

> 小蓝UP UP，每天进步一点点。
