# Functional Design — Trip Engine & Core Logic (v1)

聚焦含真实业务逻辑的部分:旅行引擎、庭院经济、内容组合。其余 UI 模块逻辑直接。

## 1. 确定性随机 (rng)
- `createRng(seed:number): () => number` —— mulberry32,返回 [0,1)。
- 所有旅行相关随机(目的地、明信片数量、场景、稀有、纪念品、日记)都从**同一 trip.seed** 派生的 rng 序列取值 → 保证 US-4.2 可复现。
- 出发时 `seed = Math.floor(Math.random()*2**31)` 存入 trip。

## 2. 时长与状态机
- 时长层(v1 压缩,便于体验;新手首旅特判):
  - firstTrip: 30s–90s
  - normal: 3–8 min
  - far: 8–20 min
  - rare: 20–45 min
  (真实上线可放大到 PRD 的分/时/天;通过配置常量控制)
- 出发时计算:`departAt=now`,`arriveAt=now+travelMs`,`returnAt=arriveAt+returnLegMs`。
- 状态由时间派生:`now<arriveAt→TRAVELING`;`arriveAt<=now<returnAt→RETURNING`;`now>=returnAt→HOME_IDLE(完成)`。

## 3. 目的地评分 `scoreDestinations`
对每个候选 destination d:
```
score(d) = BaseWeight(d.rarityBase)
         × EquipmentMatch(packing.gearA/B, d.terrain/climate)
         × FoodMatch(packing.food, d.regionPref)
         × SeasonMatch(currentSeason, d.season)
         × NoveltyBoost(visits[d.id])
         × RarityFactor(d.rarity)
         × RandomFactor(rng)
```
- 各因子取值区间(乘法,默认 1.0):
  - EquipmentMatch: 命中 tag → 1.6,不命中 → 0.8,中性 → 1.0
  - FoodMatch: 命中区域偏好 → 1.4,否则 1.0
  - SeasonMatch: 季节吻合 → 1.3,冲突 → 0.7,否则 1.0
  - NoveltyBoost: 未访问 → 1.5;已访问按 `1/(1+0.4*count)` 衰减(重复仍可能,US-4.3)
  - RarityFactor: common 1.0 / uncommon 0.6 / rare 0.3
  - RandomFactor: `0.75 + rng()*0.5`
- `requiredTags`:若 destination 声明必需 tag 而行囊未满足 → 该地权重 ×0.15(软门槛,不完全排除)。
- 选择:加权轮盘赌(依据归一化 score,用 rng)。

## 4. 旅行生命周期
- `startTrip({packing, now, visits, season})`:评分→选目的地→算时间线→生成 seed→返回 Trip(status=TRAVELING)。
- `resolveTrip(trip, now)`:幂等,依据 now 计算应处状态;当跨越 arriveAt 时用 `createRng(trip.seed)` 结算产物(明信片/纪念品/日记),并返回更新后的 visits/collections。多次调用同一 (trip, now) 结果一致。
- `sync(now)`(store):对进行中的 trip 调用 resolveTrip,应用产物一次(以 postcard/souvenir 是否已存在做去重,基于确定性 id `trip.id + index`)。

## 5. 内容组合 `contentResolver`
- `buildPostcards`:数量 = 途中 `rngInt(0,2)` + 归来 `rngInt(0,1)`,至少满足"两类产物"约束(不足则补一张);每张选 scene(按 destination.postcardPool)、pose、weather、rarity(rng 加权),diaryKey 取 destination.diaries。imageRef 指向预制素材占位(v1 用 CSS/SVG 生成的纸张卡 + 表情,真实素材可后替)。
- `pickSouvenirs`:从 destination.souvenirPool(3–8)按 rng 选 1–2 个。
- 稀有表现:rarity ∈ {common, gilded, starpaper, seasonal};UI 以边框/纸张/邮戳表现,无抽卡话术(US-5.2)。

## 6. 庭院经济 `economy`
- `accrueCourtyard(state, now)`:按 `elapsed/interval` 累计三叶草(每 interval 产 1,封顶 cap),离线累计但封顶=无损无压力(US-2.2);四叶草低概率(rng)、露珠季节性。
- `harvest(state)`:一次性把待收资源并入 clovers/库存,重置计时。
- `purchase(state, itemId)`:校验 clovers≥price → 扣款 + 入库;不足则拒绝且不扣。

## 7. 可测试性(供 Build&Test)
- 纯函数 + 注入 rng。单测覆盖:
  - createRng 同 seed 同序列
  - scoreDestinations 权重方向正确(命中 tag 得分更高)
  - startTrip→resolveTrip 用同 seed 复现相同目的地与明信片集合
  - resolveTrip 幂等
  - accrueCourtyard 封顶与离线累计
  - purchase 余额校验
