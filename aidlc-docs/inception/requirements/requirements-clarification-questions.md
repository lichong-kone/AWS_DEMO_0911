# 需求澄清(矛盾解决)— 蛙游记 Froggy Trails

我在你的回答里检测到一处需要解决的矛盾,解决后我才会生成正式需求文档。

## 矛盾 1:技术栈选择 与 "纯本地可玩 Demo" 范围冲突
你在 **Q6** 选了 **A(完全采用 PRD 技术栈)**,其中包含后端 **PostgreSQL + Redis + NestJS** 以及云数据库 **Supabase/Neon**。
但你同时选择了:
- **Q2=A**:客户端惰性结算(旅行结果在打开时按时间+种子算出,不需要服务端定时任务)
- **Q4=A**:内置种子数据,首版不接任何外部 API
- **Q5=A**:纯游客本地存档(LocalStorage/IndexedDB),无账号、无云同步
- **Q10=A**:先要一个跑通闭环的可玩 Demo

这四项合起来,**首版不需要后端和数据库**——纯前端 + 浏览器本地存储就能跑通完整闭环。若仍按 Q6=A 搭 PostgreSQL/Redis/NestJS/云库,这些在首版将完全空转。

### Clarification Question 1
首版技术栈如何取舍?

A) **前端采用 PRD 建议(Next.js + React + TypeScript + Tailwind + Framer Motion),首版不引入后端/数据库**,所有数据用 IndexedDB 本地存储;PostgreSQL/账号/云同步等留到 P1 接入云存档时再加。数据模型仍按 PRD §21 设计,只是首版落在本地存储层。(与你"纯本地可玩 Demo"的选择一致,推荐)

B) 坚持首版就搭完整后端骨架(Next.js API Routes + PostgreSQL),即便首版数据仍主要存本地,也先把后端和 schema 建好,为 P1 云同步铺路

C) 前端用 PRD 建议,后端只保留一个**极薄的可选层**(例如仅用于未来分享图的服务端渲染),首版数据仍全部本地

X) Other(请在下方描述)

[Answer]: A
