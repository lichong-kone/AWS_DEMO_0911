# 蛙游记 Froggy Trails — 完整产品框架 v3

## 1. 产品一句话
养一只会自己旅行的小伙伴。用户只负责准备与等待，它会去真实世界中的某个地方，途中寄明信片，回来带纪念品，并逐步点亮世界地图。

## 2. 核心产品原则
1. **低操作**：每次访问 1–5 分钟即可完成主要行为。
2. **弱控制**：装备只能影响倾向，不能直接选择目的地。
3. **真实等待**：等待是玩法，不用倒计时制造焦虑。
4. **回来有内容**：旅行结束至少给“地点 / 故事 / 收藏”中的两项。
5. **不惩罚离开**：用户几天不来不会损失资源。
6. **真实信息与幻想叙事分层**：角色日记和现实知识必须视觉分区。

## 3. 主要用户
- 上班族 / 学生：碎片时间放松。
- 旅行爱好者：获得替我看世界的情绪价值。
- Cozy Game 用户：长期陪伴、低压力。
- 收藏用户：地图、邮票、明信片、纪念品。

## 4. 核心循环
`收资源 → 准备行囊 → 自主出发 → 旅行中 → 来信 → 回家 → 明信片/纪念品 → 地图点亮 → 再次准备`

## 5. 一级信息架构
- `/welcome` 欢迎页
- `/onboarding/character` 角色选择
- `/home` 小屋首页
- `/backpack` 准备行囊
- `/shop` 商店
- `/trip/current` 当前旅行
- `/inbox` 来信
- `/album` 旅行册
- `/album/:postcardId` 明信片详情
- `/map` 世界地图
- `/destinations/:id` 地点详情
- `/collection/souvenirs` 纪念品柜
- `/achievements` 旅行印章
- `/profile` 我的与设置
- `/trip/:id/summary` 旅行归来总结

## 6. 状态机
### Frog
`HOME_IDLE → PACK_READY → DEPARTING → TRAVELING → RETURNING → HOME_IDLE`

### Trip
`DRAFT → READY → ACTIVE → POSTCARD_EVENT* → RETURNED → ARCHIVED`

### Postcard
`GENERATED → DELIVERED → UNREAD → READ → SAVED/SHARED`

## 7. 核心实体
- User
- Frog / Companion
- InventoryItem
- Destination
- Trip
- Postcard
- Souvenir
- DestinationVisit
- Achievement
- Notification

## 8. MVP 内容规模
- 1 个主青蛙 + 2 个 onboarding 备选伙伴
- 20–30 个目的地
- 每地点 3 common + 1 rare 明信片
- 每地点 3–5 个纪念品
- 11 个基础道具
- 6 个初始成就

## 9. 北极星指标
每周完成至少一次“准备 → 旅行 → 收到内容 → 归来”完整循环的用户数。
