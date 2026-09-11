# Performance Test Notes — v1

v1 为静态前端,性能面较轻。建议核对项:

- **首屏**:`next build` 显示首页 First Load JS ≈ 139 kB,其余页 ≈ 100 kB — 处于合理范围(NFR-2)。
- **Lighthouse**(手动):对 `npm run start` 的页面跑 Lighthouse,关注 Performance/Accessibility。
- **动效**:动画仅用 transform/opacity;开启 `prefers-reduced-motion` 或"减少动效"后应停止(NFR-5)。
- **离线**:断网后核心操作(采集/准备/出发/惰性结算/相册/地图)仍可用(NFR-3),因数据在 IndexedDB、无外部 API。

正式压测/性能预算可在接入真实素材与更多地点后再评估。
