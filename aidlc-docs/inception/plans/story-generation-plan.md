# Story Generation Plan — 蛙游记 Froggy Trails (v1)

**角色**:Product Owner。本计划描述如何把已确认的 v1 需求(requirements.md)转化为用户中心、可测试的用户故事与画像。请先回答下方问题(填 `[Answer]:`),我分析确认后再执行生成。

---

## A. 生成方法与结构(需你决策)

### Question 1 — 用户画像(Personas)范围
PRD 定义了 5 类用户。v1 用户故事覆盖哪些画像?

A) 全部 5 类:上班族/学生、想旅行但没时间者、Cozy/放置游戏用户、收藏型用户、分享型用户

B) 精简为 3 类核心:碎片时间放松者(上班族/学生)、收藏型用户、分享型用户

C) 精简为 2 类:核心陪伴型玩家 + 收藏/分享型玩家

D) 想让你给出推荐方案

X) Other(请在下方描述)

[Answer]: A

### Question 2 — 故事拆分方式
用户故事如何组织?

A) **用户旅程为主线**(新手→首旅→日常循环→收集成长→分享),故事挂在旅程节点下——最贴合本产品的体验流

B) 按功能模块(小屋/行囊/旅行/明信片/相册/地图/商店)组织

C) 按画像分组

D) **混合:Epic 按用户旅程,故事内部按功能**(推荐)

X) Other(请在下方描述)

[Answer]: A

### Question 3 — 故事粒度
故事的颗粒度?

A) **Epic + Story 两层**(Epic=旅程阶段,Story=可独立交付的小功能)——推荐

B) 扁平的单层故事列表(不分 Epic)

C) 想让你给出推荐方案

X) Other(请在下方描述)

[Answer]: A

### Question 4 — 验收标准格式
每个故事的验收标准用什么格式?

A) **Given / When / Then(Gherkin 风格)**,便于后续测试映射——推荐

B) 简单的 bullet 勾选清单

C) 两者结合(关键故事用 Gherkin,简单故事用 bullet)

D) 想让你给出推荐方案

X) Other(请在下方描述)

[Answer]: A

### Question 5 — 覆盖范围与非功能表达
故事是否覆盖非功能点(离线/本地存档丢失提示/seed 复现/无障碍/减少动效)?

A) 覆盖:除功能故事外,补充少量"技术/质量类"故事承载关键 NFR

B) 只写功能故事,NFR 由 requirements.md 承载,不单独写故事

C) 想让你给出推荐方案

X) Other(请在下方描述)

[Answer]: A

---

## B. 执行清单(你确认方法后我按此生成)

- [x] 依据所选画像范围生成 `personas.md`(画像:动机、场景、痛点、目标)
- [x] 依据所选拆分方式与粒度生成 `stories.md`(Epic/Story 结构)
- [x] 每个故事遵循 INVEST(Independent, Negotiable, Valuable, Estimable, Small, Testable)
- [x] 每个故事附验收标准(按所选格式)
- [x] 覆盖 v1 核心闭环:选角色/命名 → 新手道具 → 准备行囊 → 出发 → 惰性等待 → 收明信片/事件 → 归来 → 纪念品/地点知识 → 地图点亮/相册 → 商店/庭院经济
- [x] (若 Q5 选 A)补充关键 NFR 相关故事
- [x] 将每个 Story 关联到相关画像与对应的 FR 编号(可追溯)
- [x] 更新 aidlc-state.md 与 audit.md
