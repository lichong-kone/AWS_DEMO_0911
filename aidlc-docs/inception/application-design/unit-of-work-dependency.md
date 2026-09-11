# Unit / Module Dependencies — v1

单一部署单元;模块间依赖(开发顺序):

```
M1 Core & Persistence   (基础,先做)
   ├─> M4 Trip Engine        (依赖 M1 类型/store)
   │      └─> M6 Content & Rewards (依赖 M4 结算产物 + 种子内容)
   ├─> M2 Onboarding         (依赖 M1)
   ├─> M5 Backpack           (依赖 M1, 触发 M4)
   ├─> M3 Home & Economy     (依赖 M1)
   ├─> M7 Collection         (依赖 M1, 消费 M6 产物)
   └─> M8 Share              (依赖 M6/M7)
M9 Cross-cutting (i18n/设置/无障碍) 贯穿所有模块
```

**建议实现顺序**:M1 → M4 → M6 →(内容种子)→ M5 → M3 → M2 → M7 → M8 → M9 收尾。
**测试重点**:M4 Trip Engine(seed 复现、目的地评分、惰性推进)、M1 持久化往返。
