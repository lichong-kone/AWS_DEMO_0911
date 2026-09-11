# Froggy Trails — 15 个页面详细设计规格

> 每个页面都有对应的完整 Desktop SVG；核心流程另有 Mobile SVG。下面不仅列视觉模块，也列入口、交互、状态、数据依赖和验收。

## 00 — 欢迎页

**Route**：`/welcome`  
**页面目标**：让第一次访问者在 10 秒内理解“准备一点东西，然后让小伙伴自己旅行”的核心情绪，并零门槛开始。  
**主要入口**：首次访问、清空本地存档后进入。

### 布局结构
- 左侧品牌文案与价值主张
- 主 CTA / 次 CTA
- 游客模式说明
- 右侧情绪场景与挥手角色

### 关键交互
- 点击“开始旅行”进入角色选择
- 点击“先看看世界”以只读方式打开地图预览
- 不要求登录；创建 anonymous local profile

### 必须覆盖的状态
- 默认
- Returning user：出现“继续和小满旅行”
- 离线：仍允许进入本地存档

### 数据依赖
- `localProfileExists`
- `lastFrogName`
- `appVersion`

### 本页需要的实际 SVG 元素
- `assets/brand/logo-lockup.svg`
- `assets/characters/frog-waving.svg`
- `assets/decor/leaf-corner.svg`
- `assets/decor/cloud.svg`

### Mobile / Responsive
主文案 → 场景 → 单一 CTA，次 CTA 变文字链接。

### 页面验收
首屏无需滚动即可看到产品是什么、角色是什么、主 CTA 是什么。

## 01 — 角色选择

**Route**：`/onboarding/character`  
**页面目标**：建立第一层情感连接。用户选择的是陪伴角色，不是职业或属性。  
**主要入口**：欢迎页主 CTA。

### 布局结构
- 页面标题与一句说明
- 青蛙/水獭/刺猬三张角色卡
- 角色名字输入
- 继续 CTA

### 关键交互
- 点击角色卡切换 selected state
- 名字 1–12 个字符；为空时用默认昵称
- 确认后创建 companion profile

### 必须覆盖的状态
- 默认选择青蛙
- 输入错误
- 已选中
- 提交 loading

### 数据依赖
- `companionType`
- `companionName`

### 本页需要的实际 SVG 元素
- `assets/characters/frog-idle.svg`
- `assets/characters/otter-idle.svg`
- `assets/characters/hedgehog-idle.svg`

### Mobile / Responsive
三卡从横排变纵向/横向 carousel；名字与继续按钮固定在底部安全区。

### 页面验收
用户可以不理解数值系统也完成选择；不展示角色强弱差异。

## 02 — 小屋首页

**Route**：`/home`  
**页面目标**：首页一次回答四件事：角色在哪里、状态如何、用户现在能做什么、最近发生了什么。  
**主要入口**：登录后默认页、旅行归来、底部导航。

### 布局结构
- 顶部导航
- 左侧沉浸小屋场景
- 右侧角色状态控制台
- 资源条
- 主要 CTA
- 最近来信
- 底部长期进度

### 关键交互
- 采集三叶草
- 点击邮箱打开未读来信
- 点击角色触发轻反馈
- 准备行囊
- 进入商店
- 打开最近明信片

### 必须覆盖的状态
- 在家 idle
- 背包已准备 waiting-to-depart
- 旅行中：CTA 替换为“看看它的旅途”
- 刚归来：出现回家提示
- 有新信：mailbox 摇晃
- 离线

### 数据依赖
- `frog.status`
- `resources`
- `latestMail`
- `worldProgress`
- `postcardCount`
- `souvenirCount`
- `cloverSpawn`

### 本页需要的实际 SVG 元素
- `assets/characters/frog-reading.svg`
- `assets/decor/mailbox.svg`
- `assets/resources/clover.svg`
- `assets/resources/leaf.svg`
- `assets/resources/stone.svg`
- `assets/resources/ticket.svg`

### Mobile / Responsive
场景先于状态卡；右栏改为纵向卡；主 CTA 始终首屏可见；底部使用 4 tab nav。

### 页面验收
不出现复杂任务列表；用户 3 秒内找到“准备行囊”。

## 03 — 准备行囊

**Route**：`/backpack`  
**页面目标**：用极少的选择影响下一次旅行，同时保留未知感。  
**主要入口**：首页主 CTA、归来总结的再次出发。

### 布局结构
- 左侧角色与行程倾向摘要
- 右侧四槽位
- 库存 grid
- 确认行囊 CTA

### 关键交互
- 拖拽或点击物品进入槽位
- 同类槽位替换
- hover/tap 查看模糊效果描述
- 确认后锁定配置

### 必须覆盖的状态
- 空槽位
- 部分准备
- 完整准备
- 库存不足
- 行囊已锁定

### 数据依赖
- `inventory`
- `selectedFood`
- `selectedCharm`
- `selectedGearA`
- `selectedGearB`
- `tendencyText`

### 本页需要的实际 SVG 元素
- `assets/characters/frog-packing.svg`
- `assets/items/bread.svg`
- `assets/items/riceball.svg`
- `assets/items/berrytart.svg`
- `assets/items/fourleaf.svg`
- `assets/items/bell.svg`
- `assets/items/bottle.svg`
- `assets/items/scarf.svg`
- `assets/items/tent.svg`
- `assets/items/camera.svg`
- `assets/items/umbrella.svg`
- `assets/items/lantern.svg`

### Mobile / Responsive
槽位 2×2；库存横向滚动；确认按钮固定底部。

### 页面验收
不展示百分比、具体目的地或“最佳组合”；用户能理解每件物品的大致倾向。

## 04 — 商店

**Route**：`/shop`  
**页面目标**：补充旅行用品和装饰，保持温和经济系统，不出售等待时间。  
**主要入口**：首页、行囊库存不足。

### 布局结构
- 余额
- 分类 Tabs
- 商品 grid
- 右侧商品说明/推荐

### 关键交互
- 切换分类
- 选择商品
- 购买
- 数量反馈
- 回到行囊

### 必须覆盖的状态
- 可购买
- 余额不足
- 已拥有/库存上限
- 购买成功
- 空分类

### 数据依赖
- `shopCatalog`
- `resourceBalance`
- `inventoryCount`
- `dailyRecommendation`

### 本页需要的实际 SVG 元素
- `assets/characters/frog-idle.svg`
- `assets/items/bread.svg`
- `assets/items/riceball.svg`
- `assets/items/berrytart.svg`
- `assets/items/fourleaf.svg`
- `assets/items/bell.svg`
- `assets/items/bottle.svg`
- `assets/items/scarf.svg`
- `assets/items/tent.svg`
- `assets/items/camera.svg`
- `assets/items/umbrella.svg`
- `assets/items/lantern.svg`

### Mobile / Responsive
商品 2 列 grid；商品说明改 bottom sheet。

### 页面验收
没有“立即完成旅行”“跳过等待”“体力包”等付费入口。

## 05 — 旅行中

**Route**：`/trip/current`  
**页面目标**：旅行期间提供存在感，但不破坏未知。  
**主要入口**：角色离家后首页 CTA、通知深链。

### 布局结构
- 大氛围场景
- 模糊旅行迹象
- 出发时间
- 最近一次来信
- 旧内容旁路

### 关键交互
- 打开已到达的来信
- 查看旧旅行册
- 返回首页

### 必须覆盖的状态
- 刚出发
- 旅行稳定期
- 收到新信
- 即将归来但不展示精确倒计时
- 网络不可用

### 数据依赖
- `trip.departureAt`
- `trip.signals`
- `trip.latestPostcard`
- `frog.status`

### 本页需要的实际 SVG 元素
- `assets/characters/frog-walking.svg`
- `assets/decor/route-dash.svg`
- `assets/decor/cloud.svg`
- `assets/states/traveling.svg`

### Mobile / Responsive
场景 + 一张状态卡；删除次要侧栏。

### 页面验收
不展示实时坐标，不展示“还剩 2:17:33”。

## 06 — 来信

**Route**：`/inbox`  
**页面目标**：承接异步回报，让用户在目的地揭晓前也能获得惊喜。  
**主要入口**：邮箱、通知、旅行中页面。

### 布局结构
- 左侧邮件列表
- 右侧当前信件预览
- 未读标记
- 收藏/分享

### 关键交互
- 切换信件
- 标记已读
- 收藏
- 分享
- 进入明信片详情

### 必须覆盖的状态
- 无来信
- 未读
- 已读
- 只有图没有地点
- 目的地归来后已揭晓

### 数据依赖
- `mailList`
- `selectedMail`
- `readState`
- `postcardAsset`
- `tripRevealState`

### 本页需要的实际 SVG 元素
- `assets/characters/frog-mail.svg`
- `assets/decor/postmark.svg`
- `assets/states/empty-mail.svg`

### Mobile / Responsive
列表和详情变两级页面，不做双栏。

### 页面验收
旅途中允许信件写“一个风很大的地方”，归来后补全地点 metadata。

## 07 — 旅行册

**Route**：`/album`  
**页面目标**：成为长期收藏主入口，强调手帐而不是图库。  
**主要入口**：主导航、来信收藏、归来总结。

### 布局结构
- 筛选 Tabs
- 明信片卡 grid
- 右侧统计
- 本月最喜欢
- 排序入口

### 关键交互
- 按时间/地点/稀有度过滤
- 打开明信片
- 收藏/取消收藏
- 搜索地点

### 必须覆盖的状态
- 空旅行册
- 默认
- 有未读
- 筛选无结果

### 数据依赖
- `postcards`
- `filters`
- `favoritePostcard`
- `albumStats`

### 本页需要的实际 SVG 元素
- `assets/decor/tape.svg`
- `assets/decor/pressed-flower.svg`
- `assets/decor/postmark.svg`
- `assets/states/empty-album.svg`

### Mobile / Responsive
2 列卡片；统计折叠为顶部摘要。

### 页面验收
不能只像 Pinterest；每张卡保留日期/地点/故事感。

## 08 — 明信片详情

**Route**：`/album/:postcardId`  
**页面目标**：完成一次旅行最强的情绪反馈：大图、日记、地点事实、纪念品。  
**主要入口**：旅行册、来信、地图地点详情。

### 布局结构
- 双页手帐
- 左页大图
- 胶带/押花
- 右页地点信息
- 日记
- 现实知识
- 纪念品
- 分享

### 关键交互
- 上一封/下一封
- 保存
- 分享
- 打开地点详情
- 查看纪念品

### 必须覆盖的状态
- common
- rare
- 旅途中地点未知
- 归来后地点揭晓
- 图片加载失败 placeholder

### 数据依赖
- `postcard`
- `trip`
- `destination`
- `weatherSnapshot`
- `souvenirs`

### 本页需要的实际 SVG 元素
- `assets/characters/frog-returning.svg`
- `assets/decor/tape.svg`
- `assets/decor/pressed-flower.svg`
- `assets/decor/postmark.svg`
- `assets/decor/paper-corner.svg`

### Mobile / Responsive
单页纵向：大图 → 日记 → 事实 → 纪念品；不模拟狭窄双页。

### 页面验收
“小蛙日记”和“现实中的地点”必须有明显视觉分区。

## 09 — 世界地图

**Route**：`/map`  
**页面目标**：把长期留存变成可见的“世界被逐渐点亮”。  
**主要入口**：主导航、地点深链。

### 布局结构
- 左功能 rail
- 真实世界地图
- 访问 Pin
- 旅行虚线
- 右侧发现统计
- 最近旅行
- 收藏进度

### 关键交互
- hover/click Pin
- 缩放
- 切换足迹/收藏视图
- 打开地点详情

### 必须覆盖的状态
- 未发现 fog
- 已访问
- 新解锁
- 多次访问
- 地图数据加载失败

### 数据依赖
- `destinations`
- `visits`
- `coordinates`
- `routes`
- `progressByCategory`

### 本页需要的实际 SVG 元素
- `assets/map/pin-visited.svg`
- `assets/map/pin-new.svg`
- `assets/map/pin-locked.svg`
- `assets/map/route.svg`
- `assets/map/fog.svg`
- `assets/decor/compass.svg`

### Mobile / Responsive
全屏地图 + bottom sheet 地点卡；统计移入 sheet。

### 页面验收
正式版 Pin 必须基于真实 GeoJSON/vector map，不以 AI world image 做坐标底图。

## 10 — 地点详情

**Route**：`/destinations/:id`  
**页面目标**：让同一地点重复到访也有价值，承接真实旅行知识。  
**主要入口**：世界地图、明信片详情。

### 布局结构
- 地点 Hero
- 到访次数
- 小蛙记忆
- 现实知识
- 该地点明信片
- 纪念品进度
- 重复到访说明

### 关键交互
- 打开某张明信片
- 查看纪念品
- 查看真实地图
- 返回世界地图

### 必须覆盖的状态
- 首次到访
- 多次到访
- 收藏完成
- 部分资料不可用

### 数据依赖
- `destination`
- `visitHistory`
- `postcardsByDestination`
- `souvenirsByDestination`
- `facts`

### 本页需要的实际 SVG 元素
- `assets/map/pin-visited.svg`
- `assets/decor/postmark.svg`
- `assets/decor/compass.svg`

### Mobile / Responsive
Hero 全宽，收藏横向滑动，事实折叠。

### 页面验收
真实事实来源可追踪；AI 日记不混入事实字段。

## 11 — 纪念品柜

**Route**：`/collection/souvenirs`  
**页面目标**：展示“旅行带回来的普通东西”，形成非数值化情感收藏。  
**主要入口**：旅行册、地点详情、归来总结。

### 布局结构
- 筛选
- 纪念品 grid
- 来源地点
- 物件故事

### 关键交互
- 按国家/自然/城市过滤
- 打开物件故事
- 跳转地点

### 必须覆盖的状态
- 已拥有
- 未获得 silhouette
- 新获得 sparkle
- 筛选空结果

### 数据依赖
- `userSouvenirs`
- `souvenirCatalog`
- `destination`

### 本页需要的实际 SVG 元素
- `assets/souvenirs/*.svg`
- `assets/decor/sparkle.svg`

### Mobile / Responsive
2 列 grid；详情用 bottom sheet。

### 页面验收
不把纪念品设计成战力装备；页面强调来源和故事。

## 12 — 旅行印章

**Route**：`/achievements`  
**页面目标**：低压力记录自然发生的里程碑，不变成每日任务。  
**主要入口**：旅行册侧栏、我的。

### 布局结构
- 成就概览
- 印章 grid
- 获得/未获得状态
- 里程碑说明

### 关键交互
- 查看成就详情
- 跳转相关旅行记录

### 必须覆盖的状态
- 已获得
- 未获得
- 新获得
- 隐藏成就

### 数据依赖
- `achievementCatalog`
- `userAchievements`
- `progress`

### 本页需要的实际 SVG 元素
- `assets/badges/first-trip.svg`
- `assets/badges/first-postcard.svg`
- `assets/badges/ten-places.svg`
- `assets/badges/rainy.svg`
- `assets/badges/collector.svg`
- `assets/badges/aurora.svg`

### Mobile / Responsive
2 列印章 grid。

### 页面验收
不显示连续签到，不用“今日必须完成”。

## 13 — 我的与设置

**Route**：`/profile`  
**页面目标**：集中处理角色档案、账号同步、通知、外观、隐私和数据署名。  
**主要入口**：头像、移动端底部“我的”。

### 布局结构
- 左角色档案
- 右设置列表
- 账号同步 CTA

### 关键交互
- 改名
- 登录同步
- 通知开关
- PWA 安装
- 数据导出/删除
- 查看地图/资料署名

### 必须覆盖的状态
- 游客
- 已登录
- 通知未授权
- 通知已授权
- PWA 已安装

### 数据依赖
- `profile`
- `authState`
- `notificationPermission`
- `pwaInstallState`
- `privacySettings`

### 本页需要的实际 SVG 元素
- `assets/characters/frog-waving.svg`
- `assets/nav/settings.svg`
- `assets/nav/profile.svg`

### Mobile / Responsive
单列设置；角色卡置顶。

### 页面验收
数据和第三方来源署名可找到，不藏在深层 footer。

## 14 — 旅行归来总结

**Route**：`/trip/:id/summary`  
**页面目标**：在角色回家时集中释放旅途结果，并自然引导下一轮。  
**主要入口**：角色 RETURNING 完成后、回家通知。

### 布局结构
- 归来 Hero
- 目的地揭晓
- 旅行摘要
- 新明信片
- 新纪念品
- 查看完整旅行/回小屋

### 关键交互
- 打开完整旅行
- 查看新物品
- 返回小屋
- 下一次准备

### 必须覆盖的状态
- 普通归来
- 带稀有明信片
- 没有纪念品
- 首次到访新地点
- 重复地点

### 数据依赖
- `tripSummary`
- `destination`
- `newPostcards`
- `newSouvenirs`
- `unlockEvents`

### 本页需要的实际 SVG 元素
- `assets/characters/frog-returning.svg`
- `assets/decor/sparkle.svg`
- `assets/map/pin-new.svg`

### Mobile / Responsive
摘要纵向；新获得物件横向滚动。

### 页面验收
归来必须清楚回答“去了哪里、带回什么、地图发生了什么变化”。
