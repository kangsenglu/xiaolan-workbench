/**
 * ===================================================================
 * 小蓝UP UP · WorkBuddy 每日简报与运动计划生成器
 * ===================================================================
 *
 * 功能说明：
 *   本脚本负责自动生成 daily-briefing.js（每日简报）和
 *   weekly-plan.js（每周运动计划）两个数据文件。
 *
 * 工作原理：
 *   1. 根据当前日期计算 dayOfYear（一年中的第几天）
 *   2. 使用 dayOfYear % pool.length 从内容池中轮换选取每日内容
 *   3. 根据当前月份/节气生成应季饮食建议
 *   4. 运动计划按周轮换强度系数与备注说明
 *   5. 输出为 window.DAILY_BRIEFING / window.WEEKLY_PLAN 格式
 *
 * 运行方式：
 *   node scripts/generate-daily.mjs
 *
 * 依赖：
 *   仅使用 Node.js 内置模块（fs, path），无外部依赖
 *
 * 自动化：
 *   通过 GitHub Actions 每日 UTC 0:00（北京时间 8:00）自动运行
 * ===================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===================================================================
// 日期工具函数
// ===================================================================

/** 获取当前日期对象 */
function getDateInfo(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  const dayOfWeek = date.getDay(); // 0=周日, 1=周一

  // 计算一年中的第几天
  const start = new Date(year, 0, 0);
  const diff = date - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // 格式化日期字符串 YYYY-MM-DD
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // 计算本周一日期
  const monday = new Date(date);
  monday.setDate(day - ((dayOfWeek + 6) % 7));
  const mondayStr = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;

  return { year, month, day, dayOfYear, dateStr, mondayStr };
}

/** 根据月份获取季节饮食建议 */
function getSeasonalDiet(month, offset = 0) {
  const diets = {
    spring: [
      "春季万物生发，饮食宜「省酸增甘」以养脾气。建议多食山药、大枣、莲子等甘味食物，少食酸味以防肝气过旺。春笋、荠菜、香椿等时令蔬菜富含维生素和膳食纤维，有助于排出冬季积存毒素。可饮菊花茶疏肝明目，每日午后来一杯，缓解春困乏力。",
      "初春气温多变，宜食性温味甘之物养护脾胃。韭菜炒鸡蛋温中补气，菠菜猪肝汤养血明目，都是时令佳品。减少寒凉食物摄入，冷饮冰品尤需避免。可自制陈皮山楂饮，理气消食，适合春季消化不良人群。",
      "暮春时节湿气渐重，饮食宜健脾祛湿。薏苡仁红豆粥利水消肿，茯苓山药糕健脾益气，冬瓜薏米汤清热利湿。适当增加粗粮比例，减少油腻甜食。绿茶清热提神，但空腹不宜饮用，建议饭后半小时饮用为佳。"
    ],
    summer: [
      "夏季炎热，饮食宜清淡，以「苦」养心、以「酸」生津。苦瓜、莲子心、绿豆等苦味食物清热解暑，番茄、乌梅、柠檬等酸味食物生津止渴。西瓜是天然消暑佳品，但脾胃虚寒者不宜多食。建议多饮绿豆汤、酸梅汤，少喝冰镇饮料。",
      "盛夏高温出汗多，需及时补充水分和电解质。饮食以粥汤为主，荷叶粥消暑利湿，丝瓜豆腐汤清热通络，酸梅汤生津止渴。适当食用生姜「冬吃萝卜夏吃姜」，可温胃散寒。避免过多冷饮伤脾，室温饮品更健康。",
      "长夏湿气最重，脾最易受困。饮食重点在于健脾化湿：白扁豆、赤小豆、薏苡仁煮粥，山药莲子煲汤，都是理想选择。减少甜腻生冷食物，以免加重湿气。藿香正气水可在湿困不适时应急使用。饭后散步有助脾胃运化。"
    ],
    autumn: [
      "立秋后气候逐渐干燥，饮食宜以「滋阴润燥」为主。建议多食用银耳、百合、莲藕、秋梨等润肺生津之物，适当减少辛辣刺激食物。脾胃功能旺盛，可增加山药、茯苓、薏苡仁等健脾食材。晨起饮温蜂蜜水润肠养肺，午餐搭配冬瓜排骨汤清热利湿，晚餐宜清淡少油。",
      "秋分前后「秋燥」明显，重点在于润肺养阴。梨为秋季第一润果，冰糖炖雪梨止咳化痰；银耳百合羹滋阴润肤；莲藕排骨汤养胃生津。减少辣椒、花椒等辛散之品。可饮桂花茶、罗汉果茶润喉护嗓。适当增加芝麻、核桃等坚果，润肠通便兼补肝肾。",
      "深秋转凉，燥邪与寒邪并重。饮食宜温润，山药枸杞粥健脾补肾，板栗烧鸡温补脾肾，白萝卜羊肉汤温中散寒。柿子、石榴等秋季水果可适量食用，但不宜空腹食柿子。可饮姜枣茶暖胃驱寒，睡前泡脚配合按摩涌泉穴引火归元。"
    ],
    winter: [
      "立冬后宜「补肾藏精」，饮食以温补为主。羊肉萝卜汤温中益气，当归生姜羊肉汤补血散寒，黑豆核桃粥补肾强腰。增加根茎类蔬菜摄入，如山药、红薯、土豆。减少生冷寒凉食物。可饮红茶、普洱暖胃，晨起一碗热粥养护脾胃阳气。",
      "隆冬时节阳气内藏，是进补最佳时期。冬至前后可服膏方调养，日常饮食以「黑色食物」补肾：黑芝麻、黑豆、黑米、黑木耳。乌鸡炖汤补气养血，牛肉煲温中健脾。忌过食辛辣以免耗伤阴津。可少量饮用黄酒温通经络，但不宜过量。",
      "深冬严寒，需温补与润燥兼顾。室内暖气充足易致干燥，需多饮温水，银耳雪梨汤润肺防燥。羊肉、牛肉等温热食物搭配白萝卜消食化滞。核桃、栗子、松子等坚果是理想零食，温肾益智。早睡晚起，以待日光，顺应冬藏之道。"
    ]
  };

  let season;
  if (month >= 3 && month <= 5) season = 'spring';
  else if (month >= 6 && month <= 8) season = 'autumn'; // 8月立秋后按秋季处理
  else if (month >= 9 && month <= 11) season = 'autumn';
  else season = 'winter';

  // 但6-7月仍为夏季
  if (month >= 6 && month <= 7) season = 'summer';

  const pool = diets[season];
  return pool[offset % pool.length];
}

// ===================================================================
// 内容池：健康饮食建议（按季节，每季节3条，共12条）
// ===================================================================
const HEALTH_DIETS = [
  "立秋后气候逐渐干燥，饮食宜以「滋阴润燥」为主。建议多食用银耳、百合、莲藕、秋梨等润肺生津之物，适当减少辛辣刺激食物的摄入。立秋后脾胃功能仍偏旺盛，可适当增加山药、茯苓、薏苡仁等健脾食材，为秋冬储备能量。早晚温差加大，晨起可饮一杯温蜂蜜水润肠养肺，午餐搭配冬瓜排骨汤清热利湿，晚餐宜清淡少油。",
  "初秋时节「秋燥」渐显，重点在于润肺养阴。梨为秋季第一润果，冰糖炖雪梨止咳化痰效果显著；银耳百合莲子羹滋阴润肤；莲藕排骨汤养胃生津。减少辣椒、花椒等辛散之品，以免加重燥邪伤肺。可饮桂花茶、罗汉果茶润喉护嗓，适当增加黑芝麻、核桃等坚果摄入，润肠通便兼补肝肾。",
  "春季万物生发，饮食宜「省酸增甘」以养脾气。建议多食山药、大枣、莲子等甘味食物，少食酸味以防肝气过旺。春笋、荠菜、香椿等时令蔬菜富含维生素和膳食纤维，有助于排出冬季积存毒素。可饮菊花茶疏肝明目，每日午后来一杯，缓解春困乏力。韭菜炒鸡蛋是春季温补佳肴。",
  "盛夏高温出汗多，需及时补充水分和电解质。饮食以粥汤为主，荷叶粥消暑利湿，丝瓜豆腐汤清热通络，酸梅汤生津止渴。适当食用生姜「冬吃萝卜夏吃姜」，可温胃散寒。避免过多冷饮伤脾，室温饮品更健康。西瓜是天然消暑佳品，但脾胃虚寒者不宜多食冰镇西瓜。",
  "长夏湿气最重，脾最易受困。饮食重点在于健脾化湿：白扁豆、赤小豆、薏苡仁煮粥利水消肿，山药莲子煲汤健脾益气，冬瓜薏米汤清热利湿。减少甜腻生冷食物，以免加重湿气。藿香正气水可在湿困不适时应急使用。饭后散步有助脾胃运化，避免久坐不动。",
  "深秋转凉，燥邪与寒邪并重。饮食宜温润，山药枸杞粥健脾补肾，板栗烧鸡温补脾肾，白萝卜羊肉汤温中散寒。柿子、石榴等秋季水果可适量食用，但不宜空腹食柿子以防胃石。可饮姜枣茶暖胃驱寒，睡前泡脚配合按摩涌泉穴引火归元，改善手脚冰凉。",
  "立冬后宜「补肾藏精」，饮食以温补为主。羊肉萝卜汤温中益气，当归生姜羊肉汤补血散寒，黑豆核桃粥补肾强腰。增加根茎类蔬菜摄入，如山药、红薯、土豆。减少生冷寒凉食物。可饮红茶、普洱暖胃，晨起一碗热粥养护脾胃阳气，为冬季御寒打下基础。",
  "隆冬时节阳气内藏，是进补最佳时期。冬至前后可服膏方调养，日常饮食以「黑色食物」补肾：黑芝麻、黑豆、黑米、黑木耳。乌鸡炖汤补气养血，牛肉煲温中健脾。忌过食辛辣以免耗伤阴津。可少量饮用黄酒温通经络，但不宜过量。早睡以养阳气，保持充足睡眠。",
  "初春气温多变，宜食性温味甘之物养护脾胃。韭菜炒鸡蛋温中补气，菠菜猪肝汤养血明目，都是时令佳品。减少寒凉食物摄入，冷饮冰品尤需避免。可自制陈皮山楂饮，理气消食，适合春季消化不良人群。保持饮食规律，早餐不宜过晚，午餐适当增加蛋白质摄入。",
  "深秋转凉，燥邪与寒邪并重。饮食宜温润，山药枸杞粥健脾补肾，板栗烧鸡温补脾肾，白萝卜羊肉汤温中散寒。柿子、石榴等秋季水果可适量食用，但不宜空腹食柿子。可饮姜枣茶暖胃驱寒，睡前泡脚配合按摩涌泉穴引火归元。增加根茎类蔬菜如红薯、山药的摄入比例。"
];

// ===================================================================
// 内容池：健康养生条目（10条）
// ===================================================================
const HEALTH_ITEMS = [
  {
    title: "初秋护肺：银耳百合莲子羹",
    content: "立秋后空气湿度下降，肺部最易受伤。银耳富含植物胶质，能滋阴润肺；百合清心安神、润肺止咳；莲子补脾止泻。三者同煮成羹，每日一小碗，连续食用两周，可有效缓解秋燥引起的干咳、咽干。做法：银耳泡发撕碎，与百合、莲子小火慢炖40分钟，加少许冰糖调味。",
    source: "中国中医药报"
  },
  {
    title: "腰椎间盘突出日常护理要点",
    content: "久坐办公人群腰椎压力持续累积，建议每45分钟起身活动一次，做「靠墙站立」3分钟：后脑勺、肩胛骨、臀部、脚后跟四点贴墙。睡姿推荐侧卧微屈膝，枕头高度保持脊柱水平。避免弯腰搬重物，应屈膝下蹲后再搬起。坚持每日做「五点支撑」15次，可有效增强腰背肌群力量。",
    source: "骨科临床护理手册"
  },
  {
    title: "颈椎操：十点十分操",
    content: "站立挺胸，双臂向两侧伸直，手掌朝上，如同钟表指向10:10的位置，保持该姿势30秒后放下，重复5次。此动作可有效拉伸颈椎两侧肌肉，缓解长期低头造成的颈肩僵硬。配合「米字操」（头部缓慢书写米字）效果更佳。每日早晚各做一组，坚持一个月可见明显改善。",
    source: "康复医学杂志"
  },
  {
    title: "春季养肝：作息与饮食调理",
    content: "春季对应肝脏，养肝核心在于「夜卧早起，广步于庭」。建议晚上11点前入睡（肝胆排毒时段），早晨6-7点起床晨间散步。饮食多食绿色蔬菜（菠菜、芹菜、西兰花）养肝，少饮酒减轻肝脏负担。情绪上保持舒畅，怒伤肝，可通过冥想、深呼吸疏解压力。每日按揉太冲穴3分钟有助疏肝理气。",
    source: "中医养生学刊"
  },
  {
    title: "夏季防暑降温实用指南",
    content: "高温天气外出避开11:00-15:00时段，穿着浅色透气棉麻衣物。随身携带清凉油、藿香正气水以备急用。室内空调温度建议26-28度，与室外温差不超过8度，避免「空调病」。大量出汗后补充淡盐水而非纯水，防止电解质紊乱。出现头晕、恶心等中暑先兆时，立即转移至阴凉处并补充水分。",
    source: "健康中国行动"
  },
  {
    title: "冬季足浴养生法",
    content: "每晚睡前用40度左右温水泡脚15-20分钟，水位没过脚踝。可加入生姜（驱寒）、艾草（温经）、花椒（除湿）增强效果。泡脚后擦干双脚，按摩涌泉穴100下引火归元，改善失眠和手脚冰凉。注意：糖尿病足患者水温不宜超过38度，心血管疾病患者泡脚时间不超过15分钟。",
    source: "传统中医保健"
  },
  {
    title: "办公室护眼五步法",
    content: "长时间面对屏幕易致视疲劳和干眼症。推荐「20-20-20法则」：每用眼20分钟，看20英尺(6米)外的物体20秒。配合眼周按摩（攒竹、睛明、四白、太阳穴各按30秒）、热敷双眼（温热毛巾敷2分钟）、眨眼训练（用力闭眼5秒再睁眼5秒，重复10次）、远近视焦点切换训练，五步法每日2组，有效缓解眼疲劳。",
    source: "眼科健康资讯"
  },
  {
    title: "改善睡眠质量的科学方法",
    content: "优质睡眠是健康的基石。建议：1) 固定作息时间，周末偏差不超过1小时；2) 睡前1小时远离手机蓝光；3) 卧室温度18-22度最佳；4) 下午3点后避免咖啡因；5) 睡前可饮温牛奶或酸枣仁茶安神。若入睡困难超过30分钟，可尝试4-7-8呼吸法：吸气4秒、屏息7秒、呼气8秒，循环4次。",
    source: "睡眠医学研究"
  },
  {
    title: "肠胃调理：益生菌与膳食纤维",
    content: "肠道健康关乎免疫力和情绪。每日摄入25-30克膳食纤维（燕麦、红薯、绿叶菜），配合发酵食品（酸奶、泡菜、纳豆）补充益生菌。避免长期使用抗生素破坏肠道菌群。出现腹胀消化不良时，可按摩中脘穴、足三里穴各3分钟。建议每周安排一天「轻断食」，只摄入流质食物让肠胃休息。",
    source: "消化内科科普"
  },
  {
    title: "运动后恢复与营养补充",
    content: "运动后30分钟是营养补充黄金窗口期。力量训练后应补充蛋白质（每公斤体重0.3克，如鸡蛋、鸡胸肉、蛋白粉）+ 快速碳水（香蕉、白米饭）。有氧运动后以补充碳水为主。运动后拉伸10-15分钟防止肌肉僵硬，使用泡沫轴放松筋膜效果更佳。保证7-8小时睡眠是肌肉恢复的关键，睡眠不足会显著降低训练效果。",
    source: "运动营养学指南"
  }
];

// ===================================================================
// 内容池：语言学习条目（10条）
// ===================================================================
const LANG_ITEMS = [
  {
    title: "英语 TED 跟读训练",
    content: "今日推荐跟读：TED Talk「The power of believing that you can improve」by Carol Dweck。重点学习 growth mindset（成长型思维）的表达方式。跟读方法：第一遍听全文理解大意，第二遍逐句暂停跟读并录音，第三遍对照原文纠正发音，重点练习连读和语调。建议每日投入20分钟，坚持21天形成习惯。",
    link: "https://www.ted.com/talks/carol_dweck_the_power_of_believing_that_you_can_improve",
    linkText: "观看 TED 演讲"
  },
  {
    title: "英语 AI 对话练习",
    content: "利用 ChatGPT 或 Claude 进行英语口语场景模拟。推荐 Prompt：「Let's have a 5-minute conversation about [topic], please correct my grammar and suggest better expressions.」今日场景主题：在科技会议上做自我介绍并讨论 AI 行业趋势。练习目标：掌握 10 个以上科技领域高频词汇，能够流利表达个人观点。",
    link: "https://chat.openai.com",
    linkText: "开始 AI 对话练习"
  },
  {
    title: "粤语情景学习",
    content: "今日学习场景：茶楼点餐。核心句型：「唔该，帮我落单」「呢个几钱呀」「要一壶普洱」。重点词汇：虾饺、烧卖、肠粉、凤爪。建议配合 B 站粤语教学视频跟读，注意声调变化（粤语九声六调）。每周掌握一个生活场景，三个月可应对日常交流。",
    link: "https://www.bilibili.com/video/BV1px411S7bD",
    linkText: "B站粤语教程"
  },
  {
    title: "韩语入门基础",
    content: "今日学习韩语元音：ㅏ(a)、ㅓ(eo)、ㅗ(o)、ㅜ(u)。练习书写并朗读，配合单词记忆：아이(孩子)、어른(大人)、오이(黄瓜)、우유(牛奶)。推荐使用 Talk To Me In Korean (TTMIK) 课程，从 Level 1 开始系统学习。每日学习 2 个字母 + 5 个基础单词，两周完成韩文字母全部掌握。",
    link: "https://talktomeinkorean.com/curriculum/",
    linkText: "TTMIK 韩语课程"
  },
  {
    title: "英语商务邮件写作",
    content: "掌握商务邮件核心句型：开头「I hope this email finds you well」、请求「I would appreciate it if you could...」、跟进「I'm writing to follow up on...」、结尾「Looking forward to hearing from you」。注意避免中式英语，多用被动语态显得正式。推荐 Grammarly 检查语法，配合 Lang-8 获取母语者修改建议。",
    link: "https://www.grammarly.com",
    linkText: "Grammarly 语法检查"
  },
  {
    title: "日语 N3 语法精讲",
    content: "今日学习语法点：「〜ばよかった」（早知道...就好了）、「〜つもりだ」（打算做某事）、「〜ようになる」（变得能够...）。配合例句记忆并在日常日记中尝试使用。推荐使用 NHK Web News 进行阅读练习，标注不认识的词汇和语法点。每周完成3篇新闻精读，三个月可达到 N3 阅读水平。",
    link: "https://www3.nhk.or.jp/news/easy/",
    linkText: "NHK 简易日语新闻"
  },
  {
    title: "英语播客听力训练",
    content: "推荐播客：The Daily (NYT) 适合中高级学习者，每集20-25分钟话题丰富；Luke's English Podcast 适合中级，语速适中且讲解幽默。听力方法：第一遍正常速度听大意，第二遍0.8倍速逐句精听并记录生词，第三遍对照文字稿朗读跟读。建议通勤时利用碎片时间，每日累计听力不少于30分钟。",
    link: "https://www.nytimes.com/column/the-daily",
    linkText: "收听 The Daily"
  },
  {
    title: "粤语影视沉浸学习",
    content: "通过港剧沉浸式学习粤语。推荐入门剧：《男亲女爱》（职场对白丰富）、《溏心风暴》（家庭日常用语）。学习方法：第一遍中文字幕看剧情，第二遍粤配中字逐句暂停跟读，第三遍纯粤语音轨测试理解。重点记录高频口语表达如「搞掂」「唔该」「犀利」。每周精看1集，三个月粤语听力显著提升。",
    link: "https://www.bilibili.com",
    linkText: "B站搜索港剧资源"
  },
  {
    title: "英语影子跟读法 (Shadowing)",
    content: "Shadowing 是最高效的口语训练法之一：播放原声同时延迟1-2秒跟读，尽量模仿语音语调和节奏。推荐材料：BBC Learning English 6 Minute English、VOA Special News。从慢速材料开始，逐步过渡到正常语速。每日15分钟，重点训练连读（linking）、弱读（reduction）和语调（intonation）。录音对比原声找出差距。",
    link: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english",
    linkText: "BBC 6 Minute English"
  },
  {
    title: "多邻国每日打卡",
    content: "利用 Duolingo 保持每日语言学习习惯。建议同时学习两门语言（如英语+日语），利用「联赛」机制保持动力。每个单元完成后做 Notes 笔记，整理新词汇和语法点。配合 Duolingo Stories 练习阅读理解和听力。每日目标设为 50 XP 以上，连续打卡30天可形成稳定的学习习惯。",
    link: "https://www.duolingo.com",
    linkText: "Duolingo 多邻国"
  }
];

// ===================================================================
// 内容池：AI/ML 知识点（10条）
// ===================================================================
const AI_KNOWLEDGE = [
  {
    title: "Transformer 架构核心原理",
    content: "Transformer 的核心在于 Self-Attention 机制，通过 Q(Query)、K(Key)、V(Value) 三个矩阵将输入序列映射，计算注意力权重 softmax(QK^T/√dk)V，使模型能够关注序列中不同位置的依赖关系。Multi-Head Attention 通过并行多个注意力头捕获不同子空间的特征。Position Encoding 弥补了缺失的位置信息。理解 Transformer 是掌握 GPT、BERT 等大模型的基础。",
    link: "https://arxiv.org/abs/1706.03762"
  },
  {
    title: "LoRA 微调技术详解",
    content: "LoRA (Low-Rank Adaptation) 通过在预训练权重旁注入可训练的低秩矩阵 A 和 B，其中 W' = W + BA，仅训练 A 和 B（秩 r 远小于原始维度），可将训练参数量降低 90% 以上。适用于在消费级 GPU 上微调大语言模型。关键超参数：秩 r（推荐8-64）、alpha（缩放因子，通常设为 r 的2倍）、dropout（0.05-0.1）。",
    link: "https://arxiv.org/abs/2106.09685"
  },
  {
    title: "RAG 检索增强生成最佳实践",
    content: "RAG 系统的核心流程：文档分块(Chunking) → 向量化(Embedding) → 存入向量数据库 → 检索(Retrieval) → 拼接上下文生成(Generation)。最佳实践：分块大小 512-1024 tokens 并保留 overlap；使用混合检索（向量 + BM25 关键词）；引入重排序模型（Reranker）提升相关性；设置相似度阈值过滤低质量结果。推荐技术栈：LangChain + Chroma + BGE Embedding。",
    link: "https://python.langchain.com/docs/use_cases/question_answering/"
  },
  {
    title: "扩散模型 (Diffusion Model) 原理",
    content: "扩散模型通过前向加噪（逐步添加高斯噪声将数据变为纯噪声）和反向去噪（学习从噪声中逐步恢复数据）两个过程生成图像。核心公式涉及马尔可夫链和重参数化技巧。Stable Diffusion 在此基础上引入 Latent Space 压缩，大幅降低计算成本。关键组件：U-Net（去噪网络）、Scheduler（采样策略，如 DDIM、Euler a）、VAE（编解码器）。",
    link: "https://arxiv.org/abs/2006.11239"
  },
  {
    title: "Prompt Engineering 高级技巧",
    content: "高级 Prompt 技巧：1) Chain-of-Thought (CoT) 引导模型逐步推理；2) Few-shot Learning 提供示例引导输出格式；3) Self-Consistency 采样多条推理路径取多数结果；4) ReAct 框架结合推理与工具调用；5) Tree-of-Thoughts 探索多条思维路径。实践中推荐组合使用：系统提示定义角色 + Few-shot 示例 + CoT 引导 + 输出格式约束。",
    link: "https://platform.openai.com/docs/guides/prompt-engineering"
  },
  {
    title: "大模型推理优化：KV Cache 与量化",
    content: "KV Cache 在自回归生成时缓存已计算的 Key/Value 矩阵，避免重复计算，是推理加速的关键。量化技术将 FP16 权重降至 INT8/INT4，减少显存占用和访存带宽压力。GPTQ 和 AWQ 是当前主流的权重量化算法。vLLM 的 PagedAttention 技术通过分页管理 KV Cache 显存，将吞吐量提升 2-4 倍，是生产部署的首选推理引擎。",
    link: "https://arxiv.org/abs/2306.05685"
  },
  {
    title: "多模态大模型架构：CLIP 与 LLaVA",
    content: "CLIP 通过对比学习将图像和文本映射到同一向量空间，是视觉-语言理解的基石。LLaVA 将视觉编码器（CLIP ViT）的输出作为「视觉 token」注入大语言模型，实现图文对话能力。关键设计：Projection Layer 将视觉特征对齐到语言模型的嵌入空间。多模态训练分两阶段：先训练 Projection 对齐特征，再联合微调提升指令跟随能力。",
    link: "https://arxiv.org/abs/2304.08485"
  },
  {
    title: "强化学习对齐：RLHF 与 DPO",
    content: "RLHF (Reinforcement Learning from Human Feedback) 分三步：训练奖励模型 → 用 PPO 优化策略模型。DPO (Direct Preference Optimization) 跳过奖励模型，直接从偏好数据优化策略，简化流程且效果相当。RLAIF 用 AI 替代人工标注偏好数据，降低成本。对齐的核心挑战是在有用性(helpfulness)、无害性(harmlessness)、诚实性(honesty)之间取得平衡。",
    link: "https://arxiv.org/abs/2305.18290"
  },
  {
    title: "向量数据库选型与性能对比",
    content: "主流向量数据库对比：Milvus（分布式架构，亿级数据，适合生产环境）、Chroma（轻量易用，适合原型开发）、Qdrant（Rust 实现，高性能过滤）、Pinecone（全托管云服务）。选型维度：数据规模、查询延迟要求、是否需要混合检索、运维成本。Embedding 模型选择同样关键：BGE-zh 适合中文，OpenAI text-embedding-3 综合性能强。",
    link: "https://milvus.io/docs/comparison.md"
  },
  {
    title: "AI Agent 架构设计模式",
    content: "Agent 核心循环：感知(Perception) → 规划(Planning) → 行动(Action) → 观察(Observation)。关键设计模式：ReAct（推理-行动交替）、Plan-and-Execute（先规划后执行）、Reflexion（自我反思修正）。工具调用方面，MCP (Model Context Protocol) 正成为标准协议。多 Agent 协作框架如 AutoGen、CrewAI 支持角色分工和任务编排，适合复杂工作流自动化。",
    link: "https://langchain-ai.github.io/langgraph/"
  }
];

// ===================================================================
// 内容池：AI 辅助研发与 Agent 模型训练新闻（14条）
// ===================================================================
const AI_RD_NEWS = [
  {
    title: "AI辅助编程工具对比：Cursor vs GitHub Copilot vs Codeium",
    content: "最新测评显示，Cursor在多文件理解和重构方面领先，Copilot在代码补全速度上占优，Codeium在免费方案中性价比最高。AI辅助研发已从代码补全进化到架构设计、测试生成、文档自动化全流程。企业落地关键在于结合私有代码库做检索增强，避免通用模型生成不符合内部规范的代码。",
    source: "InfoQ",
    link: "https://www.infoq.cn"
  },
  {
    title: "AutoGPT开源Agent框架重大更新：支持多Agent协作",
    content: "AutoGPT发布v0.5版本，新增多Agent协作模式，允许多个专业化Agent分工完成复杂任务。框架内置了规划、记忆、工具调用三大核心模块，支持自定义Agent角色和能力。配合Forge评测基准，开发者可量化Agent的任务完成率与工具调用准确率，推动Agent从Demo走向生产可用。",
    source: "GitHub Trending",
    link: "https://github.com/Significant-Gravitas/AutoGPT"
  },
  {
    title: "LangChain推出LangGraph：构建可靠的有状态Agent工作流",
    content: "LangGraph将Agent抽象为有向图，节点表示计算单元（LLM调用/工具调用），边表示状态流转，支持循环、分支、人工介入（human-in-the-loop）。相比传统Chain线性执行，LangGraph可构建需要反复修正、多步推理的复杂Agent，已广泛用于客服、数据分析、代码审查等场景。持久化检查点机制使Agent可中断恢复。",
    source: "LangChain 官方博客",
    link: "https://langchain-ai.github.io/langgraph/"
  },
  {
    title: "CrewAI多Agent编排框架：角色分工驱动任务自动化",
    content: "CrewAI以「Crew（团队）+ Agent（角色）+ Task（任务）+ Process（流程）」为核心抽象，开发者可定义具有不同角色、目标、工具的Agent协同完成复杂项目。支持顺序和层级两种执行模式，层级模式下Manager Agent负责任务分配与结果汇总。适用于研究报告生成、自动化运营、多源数据整合等场景。",
    source: "CrewAI 文档",
    link: "https://docs.crewai.com/"
  },
  {
    title: "Microsoft AutoGen v0.4：多Agent对话框架支持分布式执行",
    content: "AutoGen v0.4采用Actor模型重构，支持Agent跨进程、跨机器分布式部署，可水平扩展处理高并发任务。核心特性：异步消息传递、事件驱动架构、可插拔的模型客户端与工具运行时。新增AgentChat高层API，简化多Agent对话编排。与Semantic Kernel深度集成，方便企业接入Azure OpenAI生态。",
    source: "Microsoft Research",
    link: "https://microsoft.github.io/autogen/"
  },
  {
    title: "RLHF训练实践：从偏好数据到对齐模型的完整流程",
    content: "RLHF（人类反馈强化学习）三阶段：1) SFT监督微调；2) 训练奖励模型（Reward Model）拟合偏好排序；3) 用PPO优化策略模型最大化奖励。工程要点：偏好数据需覆盖多样场景与边界case；奖励模型易过拟合需控制容量；PPO训练不稳定，建议配合KL散度约束防止策略漂移过大。开源方案推荐TRL库。",
    source: "HuggingFace Blog",
    link: "https://huggingface.co/blog/rlhf"
  },
  {
    title: "DPO直接偏好优化：RLHF的简化替代方案",
    content: "DPO（Direct Preference Optimization）跳过显式奖励模型和RL训练，直接从偏好对数据通过二元交叉熵损失优化策略模型，公式简洁、训练稳定、工程成本低。实践显示DPO在指令跟随、安全对齐任务上效果接近甚至超过RLHF，且调参更简单。后续改进如IPO、KTO、ORPO进一步解决DPO的过拟合与分布偏移问题。",
    source: "arXiv",
    link: "https://arxiv.org/abs/2305.18290"
  },
  {
    title: "Function Calling能力训练：让大模型精准调用工具",
    content: "Function Calling（函数调用）是Agent执行任务的基础能力。训练方法：构建「用户输入-工具选择-参数填充-结果整合」的指令数据集，通过SFT让模型学习工具调用格式与时机；再用RL/DPO优化调用准确率。GPT-4o、Claude 3.5、Qwen2.5等模型支持并行函数调用与流式输出。评测基准BFCL持续更新。",
    source: "OpenAI Cookbook",
    link: "https://cookbook.openai.com/"
  },
  {
    title: "RAG系统进阶：混合检索+重排序+查询改写三件套",
    content: "生产级RAG最佳实践：1) 混合检索（向量+BM25关键词）互补语义与精确匹配；2) Cross-Encoder重排序模型（如BGE-Reranker）对Top-K结果精排，相关性提升显著；3) 查询改写（Query Rewriting/Decomposition）将复杂问题拆解为子查询并合并结果。进阶引入Self-RAG让模型自主决定是否检索，HyDE生成假设文档提升召回。",
    source: "LangChain 文档",
    link: "https://python.langchain.com/docs/use_cases/question_answering/"
  },
  {
    title: "AI辅助研发全流程工具链：从需求到部署的自动化",
    content: "现代AI研发工具链已覆盖全生命周期：需求阶段用AI生成PRD与用户故事；设计阶段生成架构图与API契约；编码阶段Cursor/Copilot辅助实现；测试阶段用AI生成单元测试与边界用例（Diffblue/Codium）；代码审查阶段用AI做PR Review（CodeRabbit）；部署阶段AI辅助CI/CD配置与故障诊断。端到端研发效率提升40%以上。",
    source: "ThoughtWorks技术雷达",
    link: "https://www.thoughtworks.com/radar"
  },
  {
    title: "大模型微调技术选型：LoRA/QLoRA/全参微调对比",
    content: "LoRA通过低秩矩阵适配，显存占用低、训练快，适合多任务切换；QLoRA结合4bit量化，可在单张24G显卡微调70B模型，是消费级硬件首选；全参微调效果上限最高但成本极高，仅适合基础模型迭代。选型建议：原型验证用LoRA，资源受限用QLoRA，追求极致效果且数据充足用全参。配合PEFT库统一管理适配器。",
    source: "HuggingFace PEFT",
    link: "https://huggingface.co/docs/peft/"
  },
  {
    title: "Agent记忆系统设计：短期、长期与情景记忆三层架构",
    content: "Agent记忆体系参考认知科学分层：短期记忆即对话上下文窗口，受token限制需做摘要压缩；长期记忆基于向量数据库存储事实与知识，支持语义检索；情景记忆记录Agent历次任务的执行轨迹与反馈，用于经验回放与策略改进。MemGPT、Mem0等开源方案提供分层记忆管理框架，是构建持续学习Agent的关键组件。",
    source: "Mem0 官网",
    link: "https://mem0.ai/"
  },
  {
    title: "MCP协议生态爆发：标准化工具调用连接AI与真实世界",
    content: "Model Context Protocol（MCP）由Anthropic提出，定义了模型与外部工具/数据源的标准化通信协议。MCP Server封装工具能力（如数据库查询、文件操作、API调用），MCP Client嵌入模型侧，实现「即插即用」的工具集成。已有500+官方与社区MCP Server，覆盖GitHub、Slack、数据库、浏览器等，Cursor/Claude/Windsurf原生支持。",
    source: "Anthropic 官方文档",
    link: "https://modelcontextprotocol.io/"
  },
  {
    title: "Agent评测体系：SWE-bench与AgentBench推动能力基准化",
    content: "SWE-bench基于真实GitHub Issue评测Agent自主修复代码能力，要求Agent理解仓库、定位文件、生成补丁并通过测试，是目前最接近真实研发的Agent基准。AgentBench覆盖操作系统、数据库、知识图谱、家务、卡片游戏等多场景评估Agent综合能力。评测驱动迭代，主流Agent框架均以这些基准作为能力背书，推动Agent从玩具走向实用。",
    source: "SWE-bench 官网",
    link: "https://www.swebench.com/"
  }
];

// ===================================================================
// 内容池：投资理财市场趋势（7条）
// ===================================================================
const INVESTMENT_TRENDS = [
  "当前A股市场整体估值处于历史中低位区间，沪深300市盈率约11.5倍，低于近十年均值。新「国九条」政策持续发力，资本市场改革深化，IPO节奏收紧利好存量市场。银行理财方面，存款利率经历多轮下调后，大额存单年化收益已降至2%以下，资金搬家趋势明显，低波稳健型理财产品和红利策略受青睐。债券市场方面，长端利率低位运行，信用债利差收窄，建议关注中短债基金配置价值。整体策略建议：保持权益资产定投节奏，关注高股息、AI科技、出口链三条主线，控制仓位不追高。",
  "A股市场近期受政策利好提振，市场情绪逐步修复。半导体、AI算力板块表现活跃，受益于国产替代加速和全球AI产业景气上行。消费板块估值处于历史低位，但复苏节奏仍需观察。建议投资者保持耐心，利用市场波动逢低布局优质标的。债券市场方面，货币政策维持宽松基调，利率债配置价值仍在，但需警惕年末利率波动风险。黄金价格高位震荡，地缘风险支撑长期配置逻辑不变。",
  "当前市场呈现结构性行情特征，科技成长与红利价值风格轮动加快。北向资金持续净流入，重点配置方向集中在新能源、高端制造和消费复苏主线。REITs市场扩容提速，保障性租赁住房、消费基础设施等新品种值得关注。可转债市场性价比凸显，部分标的到期收益率转正，具备「进可攻退可守」特征。建议均衡配置，避免单一风格暴露过大。",
  "港股市场估值优势明显，恒生指数市盈率处于全球主要市场最低水平。南向资金持续流入，重点布局互联网科技、高股息和医药生物板块。美联储降息预期升温，有利于港股流动性改善。A/H股溢价指数处于高位，港股相对A股折价显著，配置性价比突出。建议通过港股通或QDII基金参与，关注腾讯、美团、中海油等龙头标的。",
  "债券市场进入低收益率时代，10年期国债收益率低位运行。信用债方面，城投债化债政策持续推进，短期违约风险下降但长期仍需甄别。可转债兼具债底保护和股性弹性，是当前环境下攻守兼备的品种。建议普通投资者通过债券型基金参与，选择久期适中、信用资质优良的品种，避免过度追求收益而忽视风险。利率债方面，长期限品种波动加大，建议以中短久期为主。",
  "黄金市场创历史新高后进入震荡整理阶段。全球央行持续增持黄金储备，去美元化趋势为金价提供长期支撑。实际利率下行、地缘政治风险、通胀预期三重因素共振，黄金中期上行逻辑不变。建议投资者将黄金作为组合的「压舱石」，配置比例5%-10%，通过黄金ETF或积存金方式参与，避免追高，采用定投方式平滑成本。",
  "REITs市场持续扩容，已上市产品涵盖产业园、仓储物流、保障房、消费基础设施等多个领域。部分REITs产品分红收益率达5%-7%，显著高于十年期国债收益率。作为介于股票和债券之间的新品种，REITs具有抗通胀、现金流稳定的特点，适合追求稳定收益的长期投资者。建议关注底层资产质量优良、分派率较高的产品，分散配置2-3只不同类型REITs。"
];

// ===================================================================
// 内容池：投资理财建议（10条）
// ===================================================================
const INVESTMENT_SUGGESTIONS = [
  {
    title: "红利低波策略：稳健配置首选",
    content: "在低利率环境下，股息率4%以上的红利低波组合具显著配置价值。建议关注煤炭、银行、公用事业板块中连续5年分红稳定、ROE>10%的标的。可通过红利ETF（515080）一键配置，每月定投平滑成本。注意分散行业集中度，单一行业占比不超过30%。",
    link: "https://www.eastmoney.com/"
  },
  {
    title: "AI 科技主题：关注算力与应用双线",
    content: "AI 产业链可分为算力层（GPU、光模块、液冷）、模型层（大模型公司）、应用层（办公、教育、医疗AI应用）。当前算力层估值已较高，建议关注应用层落地标的，特别是已有商业化收入的企业。可通过科创50ETF（588000）或人工智能ETF（515980）参与，仓位建议不超过总资产20%。",
    link: "https://xueqiu.com/"
  },
  {
    title: "黄金配置：对冲地缘风险的压舱石",
    content: "全球地缘政治不确定性持续升温，黄金作为避险资产配置价值凸显。建议通过黄金ETF（518880）或积存金方式配置，占投资组合5%-10%。当前金价处于历史高位区间，不建议一次性买入，推荐每月定额定投，利用价格波动摊薄成本。长期看，去美元化趋势支撑金价中枢上移。",
    link: "https://www.sge.com.cn/"
  },
  {
    title: "指数定投：适合工薪族的懒人投资法",
    content: "宽基指数定投是最适合普通投资者的策略。推荐沪深300+中证500组合，每月固定日期定额买入，不择时、不追涨杀跌。历史数据显示，任意时点开始定投沪深300，持有3年正收益概率超过85%。定投关键是坚持和纪律，设置自动扣款避免情绪干扰。市场大跌时是积累筹码的好时机，切勿停止定投。",
    link: "https://fund.eastmoney.com/"
  },
  {
    title: "可转债投资：进可攻退可守",
    content: "可转债具有「下有债底保护、上有股性弹性」的特点，适合震荡市配置。选债标准：到期收益率>0（保底）、溢价率<30%（跟涨能力）、正股基本面良好。可构建10-20只可转债组合分散风险，或通过可转债ETF（511380）一键配置。注意规避高溢价率的「双高」转债，流动性差的小盘转债也需谨慎。",
    link: "https://www.jisilu.cn/"
  },
  {
    title: "港股通配置：低估值市场的机会",
    content: "港股当前估值处于全球洼地，恒生指数市盈率不到9倍。南向资金持续流入，重点可关注：互联网龙头（腾讯、美团）、高股息央企（中海油、中国移动）、创新药（百济神州、信达生物）。通过港股通或QDII基金参与，注意汇率风险。建议港股配置占总权益资产15%-25%，分散A股单一市场风险。",
    link: "https://www.hkex.com.hk/"
  },
  {
    title: "REITs 配置：稳定现金流的新选择",
    content: "公募 REITs 为投资者提供参与不动产投资的新渠道，分红收益率普遍在5%-7%。建议关注产业园、仓储物流、保障房等底层资产现金流稳定的品种。选择时重点考察：底层资产出租率、租户集中度、剩余租期、管理团队能力。建议配置2-3只不同类型REITs分散风险，作为组合中类固收替代品种，占比5%-10%。",
    link: "https://reits.eastmoney.com/"
  },
  {
    title: "消费复苏主线：关注估值修复机会",
    content: "消费板块经过长期调整，部分优质标的估值已处于历史低位。建议关注：白酒龙头（茅台、五粮液）估值回归合理区间；家电出海龙头（美的、海尔）受益于海外需求回暖；餐饮连锁（海底捞、瑞幸）同店销售改善。投资消费股核心看品牌力和渠道力，选择行业集中度提升趋势中的龙头。建仓建议分批进行，不急于一把梭。",
    link: "https://xueqiu.com/"
  },
  {
    title: "债券基金：低风险偏好者的压舱石",
    content: "在利率下行环境中，债券基金是投资组合的稳定器。建议配置策略：70%中短债基金（流动性好、波动小）+ 30%中长期纯债基金（收益更高）。选择基金时关注：最大回撤（应<2%）、夏普比率（>1为优）、基金经理任职年限（>3年）和规模（10-100亿为宜）。避免重仓单一信用债的基金，防范信用风险。",
    link: "https://fund.eastmoney.com/"
  },
  {
    title: "新能车产业链：左侧布局机会",
    content: "新能源汽车产业链经过深度调整，部分环节估值已具备吸引力。关注方向：电池龙头（宁德时代、比亚迪）成本优势和全球化布局；智能化方向（激光雷达、域控制器）渗透率快速提升；充电桩、储能等基础设施。注意行业仍在洗牌期，尾部企业有出清风险，建议通过ETF或龙头个股参与，控制仓位不超过15%。",
    link: "https://www.eastmoney.com/"
  }
];

// ===================================================================
// 内容池：自媒体热点话题（10条）
// ===================================================================
const MEDIA_TRENDS = [
  {
    title: "ColorWalk色彩漫步 + 100天Flag挑战",
    content: "小红书4.63亿曝光、抖音4.69亿播放的现象级热点。玩法：每天选一种颜色出门，拍下匹配该色系的街景物件，拼成九宫格城市色谱。小蓝创作建议：立一个「100天ColorWalk挑战」Flag，每天一种颜色，配合生动街拍照片，视频版用Rap BGM卡点剪辑。标签：#ColorWalk #100天挑战 #城市色谱 #拍照打卡",
    source: "小红书+抖音双平台热搜"
  },
  {
    title: "《枪火》Rap BGM + 健身打卡视频",
    content: "老舅《枪火》抖音话题播放56亿+，副歌「相对，那就针锋相对」成为全民跟唱金句。小蓝创作建议：用《枪火》做健身打卡视频BGM，歌词的对抗感完美匹配Flag挑战精神。拍健身房生动照片+Rap卡点剪辑，文案「跟昨天的自己针锋相对」。标签：#枪火 #健身打卡 #说唱BGM #Flag挑战",
    source: "抖音热搜BGM榜"
  },
  {
    title: "说唱巅峰对决2026 跟拍翻唱挑战",
    content: "《说唱巅峰对决2026》上线首日登顶五平台榜单，微博指数8000万，抖音播放破亿。小蓝创作建议：翻唱/跟拍节目中的热门Rap段落，加入自己的Flag挑战日常作为画面内容。用说唱节奏剪辑生活碎片，打造「Rap我的成长日记」系列。标签：#说唱巅峰对决2026 #新说唱 #Rap挑战 #成长日记",
    source: "抖音综艺热榜"
  },
  {
    title: "「草台班子」精神 + 立Flag第一弹",
    content: "「草台就是最好的班子」小红书话题热度8700万+，余华视频获赞47万+。核心：先搭起来再说，别等完美。小蓝创作建议：拍一条「草台班子版Flag启动仪式」，真实记录不完美的开始，配Rap freestyle讲述「为什么这次一定能坚持」。生动照片拍开工仪式感。标签：#草台班子 #立Flag #先开始再说 #个人成长",
    source: "小红书趋势榜"
  },
  {
    title: "手搓颜料转场 + 成长对比记录",
    content: "#手搓颜料转场 话题热度破亿，10万+、100万+点赞爆文频现。双手搓颜料融合瞬间完成变装/转场。小蓝创作建议：用颜料转场展示「30天前vs30天后」的健身/学习成果对比，配Rap BGM强化节奏感。照片版做九宫格前后对比。标签：#手搓颜料转场 #成长对比 #变装转场 #打卡记录",
    source: "小红书爆款话题"
  },
  {
    title: "#好好运动记录大赛# 运动Vlog",
    content: "抖音#好好运动记录大赛#持续发酵，#100天运动打卡挑战# 互动量极高。小蓝创作建议：拍一条3分钟运动Vlog，记录从不想动到练完的完整心路历程，中间穿插Rap段「今天也不想练但练了」。生动照片拍运动中的真实表情和汗水。标签：#好好运动记录大赛 #100天运动打卡挑战 #运动Vlog #真实记录",
    source: "抖音运动话题热榜"
  },
  {
    title: "中文说唱WMX《猛》Studio Remix 卡点挑战",
    content: "中文说唱《猛》Studio Remix 8月13日发布即登DJ热榜，BPM150适合卡点剪辑。小蓝创作建议：用这首歌做生活高光时刻卡点视频——健身突破、学习完成、Flag达成的瞬间。Rap节奏搭配生动照片快闪。标签：#中文说唱 #卡点视频 #生活高光 #猛",
    source: "SpaceDJ音乐热榜"
  },
  {
    title: "ColorWalk主题色穿搭+街拍Flag",
    content: "ColorWalk衍生玩法：选定当日颜色后，穿搭也匹配该色系出门街拍。小蓝创作建议：立「7天7色穿搭+街拍Flag」，每天一个颜色主题，生动照片记录穿搭+街头色彩。视频版用Rap BGM做颜色变换卡点。标签：#ColorWalk穿搭 #7天7色 #街拍Flag #OOTD挑战",
    source: "小红书穿搭榜"
  },
  {
    title: "Rap Freestyle日记：用说唱记录每天Flag进度",
    content: "说唱类内容在抖音持续走高，freestyle形式尤其受欢迎。小蓝创作建议：每天用15秒Rap freestyle总结当天Flag完成情况，真实、有趣、有节奏。配生动日常照片做背景，用剪映卡点模板快速出片。标签：#Rap日记 #Freestyle #Flag打卡 #说唱生活",
    source: "抖音说唱话题榜"
  },
  {
    title: "「先装模作样再变成样子」成长挑战",
    content: "小红书爆款金句「先装模作样，再变成样子」引发共鸣，草台班子精神的延伸。小蓝创作建议：拍「假装已经很自律」系列——假装早起（其实刚起）、假装爱健身（其实硬撑），最后真的变了。Rap BGM配合反差萌剪辑。标签：#装模作样 #成长挑战 #反差萌 #真实记录",
    source: "小红书热门金句"
  },
  {
    title: "卡点视频教程：Rap音乐+照片快闪",
    content: "剪映卡点模板持续热门，Rap类卡点因切分音多难度高但完播率极高。小蓝创作建议：出一期「如何用Rap音乐做照片卡点视频」教程，用自己30张生动照片做demo。先选BGM后构思（逆序创作法），用剪映节拍器自动标记。标签：#卡点教程 #剪映模板 #Rap卡点 #照片快闪",
    source: "抖音创作教程热榜"
  },
  {
    title: "成都ColorWalk路线推荐+Flag打卡",
    content: "ColorWalk已扩展到成都等城市，各地文旅部门推出主题色打卡路线。小蓝创作建议：作为成都本地博主，推荐「成都红色路线」「成都绿色路线」等，每条路线立Flag完成拍照打卡。生动照片拍街景+人像，视频版配Rap。标签：#成都ColorWalk #城市漫步 #打卡路线 #成都生活",
    source: "小红书本地生活榜"
  },
  {
    title: "健身人健身魂：Rap版运动BGM歌单",
    content: "#健身人健身魂 #100天运动打卡挑战 持续发酵，运动BGM歌单类内容互动量高。小蓝创作建议：整理一份「适合健身的中文Rap歌单」，每首歌标注BPM和适合的运动类型。配健身房生动照片，视频版用歌单做卡点混剪。标签：#健身BGM #Rap歌单 #健身人健身魂 #运动音乐",
    source: "抖音+小红书运动榜"
  },
  {
    title: "立Flag翻车实录：真实才有人设",
    content: "小红书爆款规律：真实>完美，翻车内容反而互动更高。小蓝创作建议：拍「Flag翻车实录」——说好早起结果睡过头、说好健身结果吃了火锅。用Rap自嘲「又翻车了但明天继续」。生动照片拍真实状态。标签：#Flag翻车 #真实记录 #立Flag #自嘲日常",
    source: "小红书内容趋势分析"
  }
];

// ===================================================================
// 内容池：研究链接（固定）
// ===================================================================
const RESEARCH_LINKS = [
  { title: "东方财富网 - 实时行情与研报", link: "https://www.eastmoney.com/" },
  { title: "雪球 - 投资者社区", link: "https://xueqiu.com/" },
  { title: "巨潮资讯网 - 上市公司公告", link: "http://www.cninfo.com.cn/" }
];

// ===================================================================
// 内容池：运动计划
// ===================================================================
const EXERCISE_NOTES = [
  "本周第一天，以适中强度启动。易筋经注意动作标准度优先于数量，腰颈护理操每个动作之间休息10秒。训练前做5分钟关节热身。",
  "力量训练日，深蹲注意膝盖不超过脚尖、臀部向后坐。哑铃重量选择能完成12次但最后2次有挑战的重量。训练后补充蛋白质（鸡蛋/蛋白粉）。",
  "有氧恢复日，游泳强度控制在最大心率60%-70%。游泳对腰椎压力小，是腰椎间盘突出人群的理想有氧运动。泳后及时擦干头发防止受凉，注意补充水分。",
  "易筋经第二练，相比上周应感受到动作更流畅。注意「三盘落地」时膝盖弯曲幅度根据自身柔韧性调整，不勉强下蹲。腰颈护理操新增鸟狗式，增强核心抗旋转能力。",
  "力量训练第二练，硬拉注意保持背部中立位、发力以臀部为主。本周力量训练完成后，周末以恢复为主。训练后做10分钟全身静态拉伸，每个动作保持30秒。",
  "周末加量日，易筋经全套练习时间延长至45分钟。面部锻炼建议在镜子前进行，确保动作到位。面部瑜伽有助于改善面部血液循环、缓解长期面对屏幕造成的表情肌僵硬。",
  "本周最后一天，以轻松游泳+复盘收尾。复盘时回顾本周计划完成情况，记录身体反馈（尤其颈腰椎不适是否缓解），根据状态调整下周训练强度。"
];

// ===================================================================
// 内容池：每日英语单词（55个，覆盖商务/科技/日常/学术）
// ===================================================================
const EN_WORDS = [
  // 商务类
  { word: "innovate", meaning: "创新，改革", phonetic: "/ˈɪnəveɪt/", example: "Companies must innovate to stay competitive." },
  { word: "leverage", meaning: "利用，杠杆作用", phonetic: "/ˈlevərɪdʒ/", example: "We should leverage our strengths to win." },
  { word: "negotiate", meaning: "谈判，协商", phonetic: "/nɪˈɡoʊʃieɪt/", example: "They negotiated a better deal with the supplier." },
  { word: "revenue", meaning: "收入，营收", phonetic: "/ˈrevənuː/", example: "The company's revenue grew by 20% last year." },
  { word: "stakeholder", meaning: "利益相关者", phonetic: "/ˈsteɪkhoʊldər/", example: "We need to consider all stakeholders in this decision." },
  { word: "milestone", meaning: "里程碑", phonetic: "/ˈmaɪlstoʊn/", example: "Reaching one million users was a major milestone." },
  { word: "scalable", meaning: "可扩展的", phonetic: "/ˈskeɪləbl/", example: "Our business model is highly scalable." },
  { word: "acquisition", meaning: "收购，获取", phonetic: "/ˌækwɪˈzɪʃn/", example: "The acquisition expanded our market share significantly." },
  { word: "compliance", meaning: "合规，遵从", phonetic: "/kəmˈplaɪəns/", example: "All products must meet regulatory compliance standards." },
  { word: "synergy", meaning: "协同效应", phonetic: "/ˈsɪnərdʒi/", example: "The merger created strong synergy between the two teams." },
  // 科技类
  { word: "algorithm", meaning: "算法", phonetic: "/ˈælɡərɪðəm/", example: "The recommendation algorithm improves user engagement." },
  { word: "deploy", meaning: "部署", phonetic: "/dɪˈplɔɪ/", example: "We plan to deploy the new version next Monday." },
  { word: "iterate", meaning: "迭代", phonetic: "/ˈɪtəreɪt/", example: "We iterate quickly based on user feedback." },
  { word: "robust", meaning: "健壮的，稳定的", phonetic: "/roʊˈbʌst/", example: "The system needs a robust error-handling mechanism." },
  { word: "optimize", meaning: "优化", phonetic: "/ˈɑːptɪmaɪz/", example: "We optimized the database queries for better performance." },
  { word: "architecture", meaning: "架构", phonetic: "/ˈɑːrkɪtektʃər/", example: "The microservices architecture improved scalability." },
  { word: "authentication", meaning: "身份验证", phonetic: "/ɔːˌθentɪˈkeɪʃn/", example: "Two-factor authentication enhances account security." },
  { word: "throughput", meaning: "吞吐量", phonetic: "/ˈθruːpʊt/", example: "The new server doubled our processing throughput." },
  { word: "latency", meaning: "延迟", phonetic: "/ˈleɪtnsi/", example: "We reduced API latency to under 50 milliseconds." },
  { word: "repository", meaning: "仓库，代码库", phonetic: "/rɪˈpɑːzətɔːri/", example: "Push your code to the remote repository before leaving." },
  // 日常生活类
  { word: "groceries", meaning: "日用品，食品杂货", phonetic: "/ˈɡroʊsəriz/", example: "I need to buy groceries for the week." },
  { word: "appointment", meaning: "预约，约会", phonetic: "/əˈpɔɪntmənt/", example: "I have a dentist appointment at 3 PM." },
  { word: "commute", meaning: "通勤", phonetic: "/kəˈmjuːt/", example: "My daily commute takes about 45 minutes." },
  { word: "recipe", meaning: "食谱，配方", phonetic: "/ˈresəpi/", example: "This pasta recipe is simple and delicious." },
  { word: "chore", meaning: "家务杂事", phonetic: "/tʃɔːr/", example: "Doing laundry is my least favorite chore." },
  { word: "cozy", meaning: "舒适的，温馨的", phonetic: "/ˈkoʊzi/", example: "The cafe has a cozy atmosphere for reading." },
  { word: "errand", meaning: "差事，跑腿", phonetic: "/ˈerənd/", example: "I ran several errands during my lunch break." },
  { word: "neighborhood", meaning: "社区，街区", phonetic: "/ˈneɪbərhʊd/", example: "Our neighborhood has a great farmers market." },
  { word: "laundry", meaning: "洗衣，待洗衣物", phonetic: "/ˈlɔːndri/", example: "I do laundry every Sunday morning." },
  { word: "utensil", meaning: "器具，餐具", phonetic: "/juːˈtensl/", example: "Please put the utensils in the drawer." },
  // 学术类
  { word: "hypothesis", meaning: "假设", phonetic: "/haɪˈpɑːθəsɪs/", example: "The experiment confirmed our initial hypothesis." },
  { word: "methodology", meaning: "方法论", phonetic: "/ˌmeθəˈdɑːlədʒi/", example: "The research methodology was carefully designed." },
  { word: "empirical", meaning: "经验的，实证的", phonetic: "/ɪmˈpɪrɪkl/", example: "The conclusion is supported by empirical evidence." },
  { word: "thesis", meaning: "论文，论点", phonetic: "/ˈθiːsɪs/", example: "She defended her thesis brilliantly at the defense." },
  { word: "citation", meaning: "引用，引文", phonetic: "/saɪˈteɪʃn/", example: "Make sure to include proper citations in your paper." },
  { word: "peer review", meaning: "同行评审", phonetic: "/pɪr rɪˈvjuː/", example: "The paper passed rigorous peer review before publication." },
  { word: "abstract", meaning: "摘要", phonetic: "/ˈæbstrækt/", example: "The abstract summarizes the key findings of the study." },
  { word: "variable", meaning: "变量", phonetic: "/ˈveriəbl/", example: "We controlled for several variables in the experiment." },
  { word: "correlation", meaning: "相关性", phonetic: "/ˌkɔːrəˈleɪʃn/", example: "There is a strong correlation between the two factors." },
  { word: "paradigm", meaning: "范式", phonetic: "/ˈpærədaɪm/", example: "This discovery represents a paradigm shift in the field." },
  // 综合提升类
  { word: "adequate", meaning: "充足的，适当的", phonetic: "/ˈædɪkwət/", example: "We have adequate resources to complete the project." },
  { word: "comprehensive", meaning: "全面的，综合的", phonetic: "/ˌkɑːmprɪˈhensɪv/", example: "The report provides a comprehensive analysis." },
  { word: "diligent", meaning: "勤奋的", phonetic: "/ˈdɪlɪdʒənt/", example: "She is a diligent student who always does her homework." },
  { word: "eloquent", meaning: "雄辩的，有口才的", phonetic: "/ˈeləkwənt/", example: "He gave an eloquent speech at the conference." },
  { word: "feasible", meaning: "可行的", phonetic: "/ˈfiːzəbl/", example: "We need to assess whether the plan is feasible." },
  { word: "genuine", meaning: "真正的，真诚的", phonetic: "/ˈdʒenjuɪn/", example: "Her concern for others is genuine and heartfelt." },
  { word: "hierarchy", meaning: "层级，等级制度", phonetic: "/ˈhaɪərɑːrki/", example: "The company has a flat management hierarchy." },
  { word: "implement", meaning: "实施，贯彻", phonetic: "/ˈɪmplɪment/", example: "We will implement the new policy next quarter." },
  { word: "jeopardize", meaning: "危及，损害", phonetic: "/ˈdʒepərdaɪz/", example: "Don't jeopardize your career for short-term gains." },
  { word: "lucid", meaning: "清晰的，明了的", phonetic: "/ˈluːsɪd/", example: "The professor gave a lucid explanation of the theory." },
  { word: "meticulous", meaning: "一丝不苟的", phonetic: "/məˈtɪkjələs/", example: "He is meticulous about every detail of his work." },
  { word: "notion", meaning: "概念，观念", phonetic: "/ˈnoʊʃn/", example: "I have a vague notion of how it works." },
  { word: "obsolete", meaning: "过时的，废弃的", phonetic: "/ˌɑːbsəˈliːt/", example: "This technology will soon become obsolete." },
  { word: "preliminary", meaning: "初步的", phonetic: "/prɪˈlɪmɪneri/", example: "The preliminary results look very promising." },
  { word: "subsequent", meaning: "随后的，后来的", phonetic: "/ˈsʌbsɪkwənt/", example: "Subsequent events proved our theory correct." }
];

// ===================================================================
// 内容池：每日多语情景句（16条，每条含 en/yue/ko）
// ===================================================================
const DAILY_SENTENCES = [
  {
    en: { text: "I'd like to schedule a meeting to discuss the project timeline.", translation: "我想安排一个会议讨论项目时间线。", focus: "商务用语：schedule a meeting" },
    yue: { text: "我想约个时间倾下个项目进度。", jyutping: "ngo5 soeng2 joek3 go3 si4 gaan3 king1 haa5 go3 go3 si6 moon2 zing3 dou6.", translation: "我想约个时间聊聊项目进度。" },
    ko: { text: "회의 일정을 잡고 싶습니다.", roman: "hoe-ui iljeong-eul japgo sip-seumnida.", translation: "我想安排会议日程。" }
  },
  {
    en: { text: "Could you recommend a local dish I must try?", translation: "能推荐一道我必尝的当地菜吗？", focus: "旅行点餐：local dish" },
    yue: { text: "有冇咩必食嘅地道菜式推荐啊？", jyutping: "jau5 mou5 me1 bit6 sik6 ge3 dei6 dou6 coi3 sik1 teoi1 gin3 aa3?", translation: "有没有什么必吃的地道菜式推荐？" },
    ko: { text: "꼭 먹어봐야 할 현지 음식을 추천해 주세요.", roman: "kkok meogeobwaya hal hyeonji eumsig-eul chucheonhae juseyo.", translation: "请推荐一定要尝尝的当地美食。" }
  },
  {
    en: { text: "The weather forecast says it will rain tomorrow, so bring an umbrella.", translation: "天气预报说明天会下雨，记得带伞。", focus: "天气表达：weather forecast" },
    yue: { text: "听日天气预报话会落雨，记得带遮啊。", jyutping: "ting1 jat6 tin1 hei3 jyu3 bou6 waa6 wui5 lok6 jyu5, gei3 dak1 daai3 ze1 aa3.", translation: "明天天气预报说会下雨，记得带伞。" },
    ko: { text: "내일 비가 온다고 하니 우산을 챙기세요.", roman: "nae-il biga ondago hani usan-eul chaeng-giseyo.", translation: "说明天会下雨，请带好雨伞。" }
  },
  {
    en: { text: "I'm allergic to seafood, so please avoid it in my order.", translation: "我对海鲜过敏，点餐时请避免。", focus: "饮食禁忌：allergic to" },
    yue: { text: "我对海鲜敏感，落单嗰阵麻烦避开。", jyutping: "ngo5 deoi3 hoi2 sin1 man4 bei2, lok6 daan1 go2 zan6 ma4 faan4 bei2 hoi1.", translation: "我对海鲜过敏，下单时请避开。" },
    ko: { text: "해산물 알레르기가 있어서 주문할 때 피해 주세요.", roman: "haesanmul alleleugiga is-eoseo jumunhal tae pihae juseyo.", translation: "我有海鲜过敏，点餐时请避开。" }
  },
  {
    en: { text: "Excuse me, how do I get to the nearest subway station?", translation: "请问，最近的地铁站怎么走？", focus: "问路表达：how do I get to" },
    yue: { text: "唔该，最近嘅地铁站点样行去啊？", jyutping: "m4 goi1, zeoi3 gan6 ge3 dei6 tit2 zaam6 dim2 joeng2 haang4 heoi3 aa3?", translation: "请问，最近的地铁站怎么走？" },
    ko: { text: "실례합니다, 가장 가까운 지하철역은 어떻게 가나요?", roman: "sillyehamnida, gajang gakkawun jihacheol-yeog-eun eotteoge ganayo?", translation: "打扰一下，最近的地铁站怎么去？" }
  },
  {
    en: { text: "Let's wrap up this discussion and send out the minutes by email.", translation: "我们结束这次讨论，通过邮件发送会议纪要吧。", focus: "商务收尾：wrap up / minutes" },
    yue: { text: "我哋倾掂呢个议题，跟住email份会议纪录俾大家啦。", jyutping: "ngo5 dei6 king1 dam6 ni1 go3 ji6 tai4, gan1 zyu6 email fan2 wui6 ji5 gun3 bei2 daai6 gaa1 laa1.", translation: "我们谈妥这个议题，然后email会议记录给大家。" },
    ko: { text: "이번 논의를 마무리하고 이메일로 회의록을 보내 드리겠습니다.", roman: "ibeon non-ui-reul mamurihago imeillo hoe-uirog-eul bonae deuriget-seumnida.", translation: "我们结束这次讨论，会用邮件发送会议记录。" }
  },
  {
    en: { text: "This coffee shop has the best latte I've ever tasted.", translation: "这家咖啡店有我喝过最好的拿铁。", focus: "评价表达：the best ... I've ever" },
    yue: { text: "呢间咖啡店嘅拿铁系我饮过最好饮嘅。", jyutping: "ni1 gaan1 gaa1 fe1 dim2 ge3 naa4 tit3 hai6 ngo5 jam2 gwo3 zeoi3 hou2 jam2 ge3.", translation: "这间咖啡店的拿铁是我喝过最好喝的。" },
    ko: { text: "이 카페의 라떼는 제가 먹어 본 것 중 최고예요.", roman: "i kape-ui ratte-neun jega meogeo bon geot jung choegoyeyo.", translation: "这家咖啡店的拿铁是我吃过中最好的。" }
  },
  {
    en: { text: "I'd like to check in. I have a reservation under the name Wang.", translation: "我想办理入住，我用王的名字预订了。", focus: "酒店入住：check in / reservation" },
    yue: { text: "我想登记入住，我用咗王生个名book房。", jyutping: "ngo5 soeng2 dang1 gei3 zap6 zeoi1, ngo5 jung6 zo2 wong4 saang1 go3 meng4 book fong2.", translation: "我想登记入住，我用了王先生的名字订房。" },
    ko: { text: "체크인하고 싶습니다. 왕이라는 이름으로 예약했습니다.", roman: "chekeu-inhago sip-seumnida. wang-iraneun ireum-euro yeyakhaet-seumnida.", translation: "我想办理入住，用王这个名字预订了。" }
  },
  {
    en: { text: "Could you speak a bit slower, please? I'm still learning.", translation: "能说慢一点吗？我还在学习中。", focus: "礼貌请求：Could you ... please" },
    yue: { text: "可唔可以讲慢少少啊？我仲学紧。", jyutping: "ho2 m4 ho2 ji5 gong2 maan6 siu2 siu2 aa3? ngo5 zung6 hok6 gan2.", translation: "可以说慢一点吗？我还在学。" },
    ko: { text: "조금 천천히 말씀해 주시겠어요? 아직 배우는 중이에요.", roman: "jogeum cheoncheonhi malsseumhae jusiget-eoyo? ajik baeu-neun jung-ieyo.", translation: "能稍微说慢点吗？我还在学习中。" }
  },
  {
    en: { text: "The deadline has been moved up to this Friday.", translation: "截止日期提前到了本周五。", focus: "工作进度：deadline / moved up" },
    yue: { text: "死线提前到今个星期五喇。", jyutping: "sei2 sin3 tai4 cin4 dou3 gam1 go3 sing1 kei4 ng5 laa3.", translation: "截止日期提前到这个星期五了。" },
    ko: { text: "마감일이 이번 금요일로 앞당겨졌습니다.", roman: "magam-il-i ibeon geumyo-il-lo apdanggyeojyet-seumnida.", translation: "截止日期提前到了这周五。" }
  },
  {
    en: { text: "How much does this cost? Is there a discount?", translation: "这个多少钱？有折扣吗？", focus: "购物询价：how much / discount" },
    yue: { text: "呢个几钱呀？有冇折头啊？", jyutping: "ni1 go3 gei2 cin2 aa3? jau5 mou5 zit3 tau4 aa3?", translation: "这个多少钱？有折扣吗？" },
    ko: { text: "이거 얼마인가요? 할인 되나요?", roman: "igeo eolmaingayo? halin doenayo?", translation: "这个多少钱？有打折吗？" }
  },
  {
    en: { text: "I'm feeling a bit under the weather today. I'll take a sick leave.", translation: "我今天不太舒服，想请个病假。", focus: "健康表达：under the weather / sick leave" },
    yue: { text: "我今日有啲唔舒服，想请病假。", jyutping: "ngo5 gam1 jat6 jau5 di1 m4 syu2 fuk6, soeng2 cing2 beng6 gaa3.", translation: "我今天有点不舒服，想请病假。" },
    ko: { text: "오늘 몸이 좀 안 좋아서 병가를 내려고요.", roman: "oneul mom-i jom an joaseo byeongga-reul naeryeogoyo.", translation: "今天身体有点不舒服，想请病假。" }
  },
  {
    en: { text: "Let's split the bill. I'll pay for my share.", translation: "我们AA制吧，我付我那份。", focus: "结账表达：split the bill" },
    yue: { text: "我哋AA啦，我俾返自己嗰份。", jyutping: "ngo5 dei6 A A laa1, ngo5 bei2 faan1 zi6 gei2 go2 fan6.", translation: "我们AA吧，我付自己那份。" },
    ko: { text: "더치페이 할까요? 제 몫은 제가 낼게요.", roman: "deochipei halkkayo? je mog-eun jega naelgeyo.", translation: "我们AA制吗？我那份我来付。" }
  },
  {
    en: { text: "The presentation went really well. The clients seemed impressed.", translation: "演示进行得很顺利，客户看起来很满意。", focus: "工作汇报：presentation / impressed" },
    yue: { text: "个presentation做得好顺，个客好似好满意。", jyutping: "go3 presentation zou6 dak1 hou2 seon6, go3 haak3 hou4 ci5 hou2 mun5 ji3.", translation: "演示做得很顺，客户好像很满意。" },
    ko: { text: "발표가 아주 잘 됐어요. 고객들이 만족해 보였어요.", roman: "balpyo-ga aju jal dwaet-eoyo. gogaegdeul-i manjokhae boyeot-eoyo.", translation: "发表进行得很顺利，客户们看起来很满意。" }
  },
  {
    en: { text: "I need to book a flight to Tokyo for next Wednesday.", translation: "我需要订一张下周三飞东京的机票。", focus: "旅行订票：book a flight" },
    yue: { text: "我要book张下个礼拜三飞东京嘅机票。", jyutping: "ngo5 jiu3 book zoeng1 haa5 go3 lai5 baai3 saam1 fei1 dung1 ging1 ge3 gei2 piu3.", translation: "我要订一张下个星期三飞东京的机票。" },
    ko: { text: "다음 주 수요일 도쿄행 항공권을 예약해야 합니다.", roman: "daeum ju suyo-il dongkyo-haeng hanggonggwon-eul yeyakhaeya hamnida.", translation: "需要预订下周三飞往东京的机票。" }
  },
  {
    en: { text: "Sorry for the delay. The traffic was heavier than expected.", translation: "抱歉迟到了，交通比预期拥堵。", focus: "道歉表达：sorry for / heavier than expected" },
    yue: { text: "唔好意思迟大到，塞车严重过预期。", jyutping: "m4 hou2 ji3 si3 ci4 daai6 dou3, sak1 ce1 jim4 zung6 gwo3 jyu6 kei4.", translation: "不好意思迟到，堵车比预期严重。" },
    ko: { text: "늦어서 죄송합니다. 교통체증이 예상보다 심했어요.", roman: "neujeoseo joesonghamnida. gyotongchejeung-i yesangboda simhaet-eoyo.", translation: "抱歉迟到了，交通拥堵比预想的严重。" }
  }
];

// ===================================================================
// 内容池：声乐练习计划（16条）
// ===================================================================
const VOCAL_EXERCISES = [
  {
    warmup: "唇颤音练习 3分钟：放松嘴唇，用气流震动嘴唇发出brrr声，从低音滑到高音再滑回",
    technique: "气息控制：双手叉腰，深吸气感受腰部扩张，发sii声保持20秒，练习5组",
    song: "《月亮代表我的心》- 重点练习副歌部分的气息连贯和高音控制",
    duration: "30min"
  },
  {
    warmup: "哼鸣练习 5分钟：闭口发ng音，从舒适音区开始上下滑音，感受鼻腔和头腔共鸣",
    technique: "横膈膜发力：仰卧姿势，腹部放一本书，发ha音感受腹部起伏，每秒2次连续30秒",
    song: "《滚滚红尘》- 练习前奏低音区的胸声共鸣和情感表达",
    duration: "35min"
  },
  {
    warmup: "打嘟噜（舌颤音）3分钟：舌尖轻抵上齿龈，用气流震动舌尖发出rrr声，配合音阶上行",
    technique: "元音统一：用a-e-i-o-u五个元音在同一音高上连贯转换，保持喉位稳定不乱动",
    song: "《如愿》- 重点练习主歌到副歌的换声区过渡，避免声音断裂",
    duration: "30min"
  },
  {
    warmup: "面部放松操 5分钟：揉搓面部肌肉、转动下巴、做夸张表情放松咬肌和下颌关节",
    technique: "高音拓展：用「母音变体」法，从高音u滑向i，感受声音「靠前」和「聚焦」",
    song: "《光年之外》- 练习副歌高音区的混声技巧和爆发力",
    duration: "40min"
  },
  {
    warmup: "颈部拉伸 3分钟：左右侧倾、前后点头、缓慢旋转，每个方向保持15秒，放松颈部肌肉",
    technique: "颤音练习：先练气息颤音（腹部规律起伏），再练喉部颤音，最后融合自然颤音",
    song: "《后来》- 练习长音结尾的颤音收束和情感处理",
    duration: "30min"
  },
  {
    warmup: "气泡音唤醒 3分钟：放松喉部发低沉的气泡音，按摩声带，做发声前热身",
    technique: "弱声控制：用极小音量唱完整首歌，要求声音虽弱但位置高、气息稳",
    song: "《大鱼》- 练习弱声到强声的渐变处理和空灵音色",
    duration: "35min"
  },
  {
    warmup: "狗喘气练习 2分钟：像狗一样快速吐舌喘气，激活横膈膜，感受腹部快速弹跳",
    technique: "跳音练习：用ha音在do-mi-do-mi音阶上做跳音，每个音短促有力，腹部弹跳配合",
    song: "《红豆》- 练习主歌的跳音咬字和节奏感",
    duration: "30min"
  },
  {
    warmup: "叹气放松 3分钟：深吸气后像叹气一样发「唉」声下行，放松喉部和肩颈",
    technique: "真假声转换：用「呜」音从真声区滑到假声区再滑回，感受换声点的平滑过渡",
    song: "《神话》- 练习真假声无缝切换和假声的穿透力",
    duration: "35min"
  },
  {
    warmup: "咀嚼练习 3分钟：夸张咀嚼动作放松下颌，配合哼鸣感受口腔空间打开",
    technique: "咬字清晰：朗读歌词，每个字咬字清晰但不过分用力，注意辅音的爆发和元音的延展",
    song: "《青花瓷》- 练习中国风歌曲的咬字韵味和装饰音处理",
    duration: "30min"
  },
  {
    warmup: "拉伸肋间肌 3分钟：双臂上举侧弯拉伸肋间肌，配合深呼吸感受肋廓扩张",
    technique: "长音练习：用「啊」音在一个舒适音高上持续发声，目标40秒不断、不抖、不走音",
    song: "《送别》- 练习长音的稳定性和乐句的呼吸规划",
    duration: "35min"
  },
  {
    warmup: "转颈发声 3分钟：缓慢左右转头的同时发「嗯」音，感受不同颈部位置对声音的影响",
    technique: "音域拓展：用「里拉」音节半音阶上行至最高舒适音，再下行至最低音，每组升降一个调",
    song: "《征服》- 练习高音区的张力和情感爆发",
    duration: "40min"
  },
  {
    warmup: "肩部绕环 3分钟：双肩前后绕环各10次，放松肩颈连接处肌肉，避免耸肩唱歌",
    technique: "共鸣焦点：发「嗯」音寻找鼻腔共鸣焦点，再切换到「啊」音保持焦点位置不变",
    song: "《传奇》- 练习整首歌的共鸣统一和音色一致性",
    duration: "30min"
  },
  {
    warmup: "舌头操 3分钟：舌头尽量伸出缩回10次，左右舔嘴角各10次，放松舌根增加灵活度",
    technique: "连音练习：用「拉里鲁」音节在五度音阶上做连音，每个音平滑连接无痕迹",
    song: "《明天会更好》- 练习合唱部分的和声音准和连音线条",
    duration: "30min"
  },
  {
    warmup: "全身抖动 2分钟：站立全身放松抖动，从手指到肩膀到躯干，释放全身紧张",
    technique: "情感表达：闭眼想象歌词画面，用说话的方式先朗诵歌词再唱，对比情感差异",
    song: "《漂洋过海来看你》- 练习叙事性演唱的情感层次和语气变化",
    duration: "35min"
  },
  {
    warmup: "吹纸片练习 3分钟：拿一张纸巾贴墙，用气息吹使其不掉落，训练气息稳定输出",
    technique: "渐强渐弱：在一个长音上从弱到强再到弱，控制气息流量和声带闭合度的配合",
    song: "《听海》- 练习情绪递进和渐强处理的高潮段落",
    duration: "40min"
  },
  {
    warmup: "哈欠式开喉 3分钟：模拟打哈欠感受软腭抬起、喉咙打开的状态，保持该状态发声",
    technique: "滑音练习：用「哦」音从低到高再滑回，全程保持打开状态，感受声音的圆润度",
    song: "《遇见》- 练习中低音区的温暖音色和句尾的收束处理",
    duration: "30min"
  }
];

// ===================================================================
// 内容池：架子鼓练习计划（16条）
// ===================================================================
const DRUM_EXERCISES = [
  {
    rudiment: "单跳练习 Single Stroke Roll：RLRL 60bpm → 80bpm → 100bpm，每个速度2分钟",
    groove: "基本摇滚节拍：底鼓1、3拍，军鼓2、4拍，踩镲8分音符，80bpm练习5分钟",
    tempo: "60→100bpm",
    duration: "25min"
  },
  {
    rudiment: "双跳练习 Double Stroke Roll：RRLL 60bpm → 80bpm → 100bpm，每速度2分钟，注意第二击用手腕弹起",
    groove: "放克节拍：底鼓1、1.5、3拍，军鼓2、4拍，踩镲16分音符，90bpm练习5分钟",
    tempo: "60→100bpm",
    duration: "30min"
  },
  {
    rudiment: "复合跳 Paradiddle：RLRR LRLL 70bpm → 90bpm，每速度3分钟，强调重音清晰",
    groove: "shuffle律动：踩镲三连音shuffle，底鼓1、3拍，军鼓2、4拍，80bpm练习6分钟",
    tempo: "70→100bpm",
    duration: "30min"
  },
  {
    rudiment: "五连音练习：RLRRL RLLRL，60bpm起步，重点练均匀度和重音移位",
    groove: "流行Ballad节拍：底鼓1、3拍，军鼓2、4拍，踩镲4分音符，70bpm配合click练习5分钟",
    tempo: "60→90bpm",
    duration: "25min"
  },
  {
    rudiment: "装饰音练习 Flam：rL lR，慢速练习确保主音和装饰音分离干净，80bpm 5分钟",
    groove: "Flam应用groove：在军鼓2、4拍加入flam装饰，底鼓1、3拍，90bpm练习5分钟",
    tempo: "80→100bpm",
    duration: "30min"
  },
  {
    rudiment: "Drag（双装饰音）：rrL llR，先慢速分解再加速，注意装饰音轻、主音响",
    groove: "R&B节拍：底鼓16分切分，军鼓2、4拍带ghost note，踩镲半开，85bpm练习6分钟",
    tempo: "70→95bpm",
    duration: "30min"
  },
  {
    rudiment: "单跳提速训练：节拍器60bpm每30秒加5bpm，目标冲到140bpm不停顿",
    groove: "朋克摇滚节拍：底鼓1、3拍，军鼓2、4拍，踩镲8分，140bpm练习5分钟练耐力",
    tempo: "60→140bpm",
    duration: "35min"
  },
  {
    rudiment: "三连音滚奏：RLRLRL三连音手感，60bpm → 90bpm，注意三连音的内在律动",
    groove: "blues shuffle 12/8：底鼓三连音律动，军鼓2、4拍，shuffle踩镲，75bpm练习6分钟",
    tempo: "60→90bpm",
    duration: "30min"
  },
  {
    rudiment: "手脚协调：手RLRL单跳，脚底鼓踩8分音符，反拍叠加军鼓，70bpm 5分钟",
    groove: "线性groove：手脚不重合，HH-底鼓-军鼓-SN-底鼓序列循环，85bpm练习5分钟",
    tempo: "70→95bpm",
    duration: "30min"
  },
  {
    rudiment: "开放滚奏 Open Roll：RRLL加速到120bpm以上，追求音色均匀和密度",
    groove: "metal双踩节拍：双脚底鼓16分连续，手上8分踩镲+军鼓2、4，160bpm练习5分钟",
    tempo: "100→160bpm",
    duration: "35min"
  },
  {
    rudiment: "Paradiddle-diddle：RLRRLL 6连音，70bpm → 90bpm，练到能套入groove",
    groove: "拉丁songo节拍：手脚独立编排，cowbell固定律动，90bpm练习6分钟练独立性",
    tempo: "70→100bpm",
    duration: "30min"
  },
  {
    rudiment: "Fill训练：1小节groove + 1小节fill，fill用单跳由密到疏过渡，4个位置练",
    groove: "rock节拍 + fill衔接：80bpm，每4小节做1小节fill过渡，重点练衔接不减速",
    tempo: "80→110bpm",
    duration: "30min"
  },
  {
    rudiment: "重音移位练习：单跳基础上重音在1、2、3、4不同位置，每个组合练2分钟",
    groove: "Moeller技巧groove：用甩鞭动作做三连音重音，放松手腕，90bpm练习6分钟",
    tempo: "70→100bpm",
    duration: "35min"
  },
  {
    rudiment: "交叉手练习：左手越过右手击打嗵鼓，练协调和准确度，慢速起步",
    groove: "fusion节拍：复合切分底鼓，嗵鼓melodic fill，110bpm练习5分钟",
    tempo: "80→120bpm",
    duration: "30min"
  },
  {
    rudiment: "脚法独立练习：双脚单跳RRLL在底鼓上，手做不同节奏，60bpm 5分钟",
    groove: "双底鼓groove：双脚8分交替底鼓，手8分踩镲+军鼓2、4，130bpm练习5分钟",
    tempo: "60→130bpm",
    duration: "35min"
  },
  {
    rudiment: "综合复习：单跳+双跳+复合跳+装饰音串联，120bpm连续5分钟不中断",
    groove: "即兴groove：放任意风格伴奏，跟随即兴变化fill和密度，练听力和反应",
    tempo: "自由",
    duration: "30min"
  }
];

// ===================================================================
// 轮换选取工具函数
// ===================================================================

/** 从内容池中选取 n 条，基于 dayOfYear 轮换 */
function pickItems(pool, dayOfYear, count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const idx = (dayOfYear + i) % pool.length;
    result.push(pool[idx]);
  }
  return result;
}

/** 选取单条，基于 dayOfYear 轮换 */
function pickOne(pool, dayOfYear) {
  return pool[dayOfYear % pool.length];
}

// ===================================================================
// 生成每日简报
// ===================================================================
function generateDailyBriefing(dateInfo) {
  const { dateStr, dayOfYear, month } = dateInfo;
  const generatedAt = `${dateStr} 08:00 自动生成`;

  // 季节饮食建议
  const diet = getSeasonalDiet(month, dayOfYear);

  // 各分类内容轮换选取
  const healthItems = pickItems(HEALTH_ITEMS, dayOfYear, 3);
  const langItems = pickItems(LANG_ITEMS, dayOfYear, 4);
  const aiKnowledge = pickItems(AI_KNOWLEDGE, dayOfYear, 5);
  const aiNews = pickItems(AI_RD_NEWS, dayOfYear, 3);
  const marketTrend = pickOne(INVESTMENT_TRENDS, dayOfYear);
  const investmentSuggestions = pickItems(INVESTMENT_SUGGESTIONS, dayOfYear, 3);
  const mediaTrends = pickItems(MEDIA_TRENDS, dayOfYear, 3);

  // Daily words - pick 5 words rotating by day
  const wordStart = (dayOfYear * 5) % EN_WORDS.length;
  const dailyWords = [];
  for (let i = 0; i < 5; i++) {
    dailyWords.push(EN_WORDS[(wordStart + i) % EN_WORDS.length]);
  }

  // Daily sentences - pick 1 rotating by day
  const dailySentence = DAILY_SENTENCES[dayOfYear % DAILY_SENTENCES.length];

  // Music practice - pick 1 each rotating by day
  const vocalExercise = VOCAL_EXERCISES[dayOfYear % VOCAL_EXERCISES.length];
  const drumExercise = DRUM_EXERCISES[dayOfYear % DRUM_EXERCISES.length];

  const data = {
    date: dateStr,
    generatedAt,
    health: {
      title: "健康养生",
      diet,
      items: healthItems
    },
    language: {
      title: "语言学习",
      items: langItems,
      dailyWords,
      dailySentences: dailySentence
    },
    professional: {
      title: "专业成长",
      knowledgePoints: aiKnowledge,
      industryNews: aiNews
    },
    investment: {
      title: "投资理财",
      marketTrend,
      suggestions: investmentSuggestions,
      researchLinks: RESEARCH_LINKS
    },
    selfmedia: {
      title: "自媒体热点",
      items: mediaTrends
    },
    music: {
      title: "今日音乐练习",
      vocal: vocalExercise,
      drum: drumExercise
    }
  };

  // 序列化为 JS 文件
  const content = `/**
 * 小蓝UP UP · WorkBuddy 每日简报
 * 日期: ${dateStr}
 * 由 scripts/generate-daily.mjs 自动生成
 * 请勿手动编辑，每日 08:00 (北京时间) 由 GitHub Actions 自动更新
 */
window.DAILY_BRIEFING = ${JSON.stringify(data, null, 2)};
`;

  return content;
}

// ===================================================================
// 生成每周运动计划
// ===================================================================
function generateWeeklyPlan(dateInfo) {
  const { mondayStr, dayOfYear } = dateInfo;
  const generatedAt = `${dateInfo.dateStr} 08:00 自动生成`;

  // 强度系数轮换：0.6 / 0.7 / 0.8 / 0.75 / 0.85
  const intensities = [0.6, 0.7, 0.8, 0.75, 0.85];
  const intensity = intensities[dayOfYear % intensities.length];

  // 备注轮换偏移
  const noteOffset = dayOfYear % EXERCISE_NOTES.length;

  const dayNames = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

  const days = dayNames.map((day, index) => {
    const notes = EXERCISE_NOTES[(noteOffset + index) % EXERCISE_NOTES.length];
    let exercises = [];

    switch (index) {
      case 0: // 周一
        exercises = [
          {
            name: "易筋经组合",
            duration: "30分钟",
            detail: "韦驮献杵三式 → 摘星换斗势 → 倒拽九牛尾势 → 出爪亮翅势 → 九鬼拔马刀势，每式重复8次，注意呼吸配合，动作缓慢到位"
          },
          {
            name: "腰颈护理操",
            duration: "15分钟",
            detail: "十点十分操30秒×3组 + 米字操10次 + 五点支撑15次×3组 + 猫牛式拉伸20次，重点放松颈椎和腰椎"
          }
        ];
        break;
      case 1: // 周二
        exercises = [
          {
            name: "田田力量训练",
            duration: "40分钟",
            detail: "深蹲 4组×12次 → 臀桥 4组×15次 → 哑铃划船 3组×12次 → 平板支撑 3组×45秒 → 侧平板 3组×30秒(两侧)，组间休息60秒"
          },
          {
            name: "腰颈护理操",
            duration: "15分钟",
            detail: "十点十分操30秒×3组 + 米字操10次 + 五点支撑15次×3组 + 靠墙天使15次×3组，力量训练后重点放松背部肌群"
          }
        ];
        break;
      case 2: // 周三
        exercises = [
          {
            name: "游泳",
            duration: "45分钟",
            detail: "自由泳为主，蛙泳交替。热身慢游200米 → 主项自由泳 4组×100米(组间休息30秒) → 蛙泳放松200米 → 整理活动拉伸。注意换气节奏和打腿频率"
          },
          {
            name: "腰颈护理操",
            duration: "15分钟",
            detail: "十点十分操30秒×3组 + 米字操10次 + 颈椎旋转拉伸左右各10次 + 游泳后肩部放松拉伸，水中运动后重点放松肩颈"
          }
        ];
        break;
      case 3: // 周四
        exercises = [
          {
            name: "易筋经组合",
            duration: "30分钟",
            detail: "韦驮献杵三式 → 三盘落地势 → 青龙探爪势 → 卧虎扑食势 → 打躬势，每式重复8次，注意动作连贯性和呼吸深度"
          },
          {
            name: "腰颈护理操",
            duration: "15分钟",
            detail: "十点十分操30秒×3组 + 米字操10次 + 五点支撑15次×3组 + 鸟狗式10次×3组(交替)，加入核心稳定性训练"
          }
        ];
        break;
      case 4: // 周五
        exercises = [
          {
            name: "田田力量训练",
            duration: "40分钟",
            detail: "硬拉 4组×10次 → 哑铃推举 3组×12次 → 弹力带划船 3组×15次 → 死虫式 3组×12次 → 臀桥单腿 3组×10次(两侧)，组间休息60秒"
          },
          {
            name: "腰颈护理操",
            duration: "15分钟",
            detail: "十点十分操30秒×3组 + 米字操10次 + 五点支撑15次×3组 + 胸椎旋转拉伸左右各10次，力量训练后重点放松胸椎和颈椎"
          }
        ];
        break;
      case 5: // 周六
        exercises = [
          {
            name: "易筋经组合加量",
            duration: "45分钟",
            detail: "完整十二势全套练习，每式重复12次。韦驮献杵→摘星换斗→倒拽九牛尾→出爪亮翅→九鬼拔马刀→三盘落地→青龙探爪→卧虎扑食→打躬势→掉尾势。注重每个动作的细节和呼吸配合"
          },
          {
            name: "面部锻炼",
            duration: "15分钟",
            detail: "面部瑜伽：夸张发音AEIOU各10次 → 鼓腮吹气20次 → 抬头伸舌10次 → 眼球转动顺逆时针各10圈 → 面部按摩放松，促进面部血液循环、缓解表情肌僵硬"
          }
        ];
        break;
      case 6: // 周日
        exercises = [
          {
            name: "游泳",
            duration: "45分钟",
            detail: "本周第二次游泳，以放松恢复为主。热身慢游200米 → 蛙泳为主 400米(匀速) → 仰泳放松100米 → 水中行走10分钟 → 岸上拉伸。注重水感和技术细节"
          },
          {
            name: "复盘",
            duration: "15分钟",
            detail: "记录本周训练日志：完成度自评、身体感受(颈腰疼痛程度1-10分)、体重/围度变化、下周调整方向。填写运动数据到工作台打卡系统"
          }
        ];
        break;
    }

    return { day, exercises, notes };
  });

  const intensityDesc = intensity >= 0.8 ? "中高强度，适合体能基础较好阶段" : intensity >= 0.7 ? "中等强度，渐进式增负荷" : "中低强度，适合恢复期或经期调整";

  const summary = `本周运动计划以「核心力量 + 有氧 + 颈腰椎护理」三线并行。周一至周五交替进行易筋经组合与田田力量训练，每日搭配腰颈护理操，重点改善久坐造成的颈腰椎不适。周三、周日安排游泳作为有氧恢复，周六增加易筋经训练量并加入面部锻炼。整体强度系数 ${intensity}，${intensityDesc}。注意训练后充分拉伸，保证每日饮水 2000ml 以上。`;

  const data = {
    weekOf: mondayStr,
    generatedAt,
    menstrualPhase: "未知（未填写经期数据，按卵泡期强度生成）",
    intensity,
    summary,
    days
  };

  const content = `/**
 * 小蓝UP UP · WorkBuddy 每周运动计划
 * 本周起始: ${mondayStr} (周一)
 * 由 scripts/generate-daily.mjs 自动生成
 * 请勿手动编辑，每周由 GitHub Actions 自动更新
 */
window.WEEKLY_PLAN = ${JSON.stringify(data, null, 2)};
`;

  return content;
}

// ===================================================================
// 主函数
// ===================================================================
function main() {
  const dateInfo = getDateInfo();
  console.log(`生成日期: ${dateInfo.dateStr} (dayOfYear: ${dateInfo.dayOfYear})`);
  console.log(`本周起始: ${dateInfo.mondayStr}`);

  // 生成每日简报
  const dailyContent = generateDailyBriefing(dateInfo);
  const dailyPath = path.resolve(__dirname, '..', 'daily-briefing.js');
  fs.writeFileSync(dailyPath, dailyContent, 'utf-8');
  console.log(`[完成] 每日简报已写入: ${dailyPath}`);

  // 生成每周运动计划
  const weeklyContent = generateWeeklyPlan(dateInfo);
  const weeklyPath = path.resolve(__dirname, '..', 'weekly-plan.js');
  fs.writeFileSync(weeklyPath, weeklyContent, 'utf-8');
  console.log(`[完成] 每周运动计划已写入: ${weeklyPath}`);

  console.log('\n所有内容已成功生成！');
}

main();
