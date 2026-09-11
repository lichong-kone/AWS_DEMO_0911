import type { Lang, Localized } from "@/lib/types";

export function loc(v: Localized, lang: Lang): string {
  // graceful fallback to zh if en missing (US-9.2)
  return (lang === "en" ? v.en || v.zh : v.zh) ?? "";
}

type Dict = Record<string, Localized>;

export const UI: Dict = {
  appName: { zh: "蛙游记", en: "Froggy Trails" },
  navHome: { zh: "小屋", en: "Home" },
  navMap: { zh: "地图", en: "Map" },
  navAlbum: { zh: "旅行册", en: "Album" },
  navShop: { zh: "商店", en: "Shop" },
  navAchievements: { zh: "纪念章", en: "Keepsakes" },
  navInbox: { zh: "邮箱", en: "Mailbox" },
  navSouvenirs: { zh: "纪念品", en: "Curios" },
  navMe: { zh: "我的", en: "Me" },

  chooseCompanion: { zh: "选择你的旅行伙伴", en: "Choose your travel companion" },
  chooseHint: { zh: "它会陪你很久,选定后不能更换哦。", en: "It stays with you a long time — you can't change later." },
  frog: { zh: "小蛙", en: "Frog" },
  otter: { zh: "水獭", en: "Otter" },
  hedgehog: { zh: "刺猬", en: "Hedgehog" },
  nameIt: { zh: "给它起个名字", en: "Give it a name" },
  namePlaceholder: { zh: "比如:小满", en: "e.g. Momo" },
  start: { zh: "开始", en: "Start" },
  starterGift: { zh: "收到了新手道具:面包、水壶、20 三叶草。", en: "Starter gift: bread, a bottle, and 20 clovers." },

  mood: { zh: "看起来很悠闲", en: "Looks relaxed" },
  atHome: { zh: "在家", en: "At home" },
  traveling: { zh: "旅行中", en: "Traveling" },
  returning: { zh: "在回家的路上", en: "On the way home" },
  prepareBackpack: { zh: "准备行囊", en: "Prepare backpack" },
  recentMail: { zh: "最近来信", en: "Recent mail" },
  noMail: { zh: "还没有来信", en: "No mail yet" },
  harvest: { zh: "收取庭院", en: "Gather courtyard" },
  harvested: { zh: "收好了", en: "Gathered" },
  pending: { zh: "待收", en: "Pending" },

  backpack: { zh: "行囊", en: "Backpack" },
  slotFood: { zh: "食物", en: "Food" },
  slotCharm: { zh: "护符", en: "Charm" },
  slotGearA: { zh: "装备 A", en: "Gear A" },
  slotGearB: { zh: "装备 B", en: "Gear B" },
  empty: { zh: "空", en: "Empty" },
  confirmDepart: { zh: "确认并出发", en: "Confirm & depart" },
  needFood: { zh: "至少放入一点食物再出发吧。", en: "Add at least some food before departing." },
  tendencies: { zh: "隐约的倾向", en: "Faint tendencies" },

  travelingNow: { zh: "旅行进行中", en: "A trip is underway" },
  comeBackLater: { zh: "过一会儿再来看看它。", en: "Come back a little later." },
  arrivingSoon: { zh: "好像快到某个地方了……", en: "It seems to be arriving somewhere..." },

  newPostcard: { zh: "收到一张明信片", en: "A postcard arrived" },
  close: { zh: "关闭", en: "Close" },
  share: { zh: "生成分享卡", en: "Make a share card" },
  downloaded: { zh: "分享卡已保存", en: "Share card saved" },

  world: { zh: "世界", en: "World" },
  discovered: { zh: "已发现", en: "Discovered" },
  postcards: { zh: "明信片", en: "Postcards" },
  souvenirs: { zh: "纪念品", en: "Souvenirs" },
  albumEmpty: { zh: "还没有旅行记录,准备行囊送它出发吧。", en: "No trips yet — pack up and send it off." },

  buy: { zh: "购买", en: "Buy" },
  owned: { zh: "已拥有", en: "Owned" },
  notEnough: { zh: "三叶草不够啦", en: "Not enough clovers" },
  clovers: { zh: "三叶草", en: "Clovers" },

  settings: { zh: "设置", en: "Settings" },
  language: { zh: "语言", en: "Language" },
  reduceMotion: { zh: "减少动效", en: "Reduce motion" },
  lossNoticeTitle: { zh: "关于存档", en: "About your save" },
  lossNotice: {
    zh: "你的进度保存在这台设备的浏览器里,清除浏览器数据会丢失。未来版本会支持登录云同步。",
    en: "Your progress is saved in this browser on this device. Clearing browser data will lose it. Cloud sync will come in a future version.",
  },
  gotIt: { zh: "知道了", en: "Got it" },
  weather_sunny: { zh: "晴", en: "sunny" },
  weather_rainy: { zh: "雨", en: "rainy" },
  weather_cloudy: { zh: "多云", en: "cloudy" },
  weather_snowy: { zh: "雪", en: "snowy" },
  weather_starry: { zh: "星空", en: "starry" },
};

export function t(key: string, lang: Lang): string {
  const v = UI[key];
  return v ? loc(v, lang) : key;
}
