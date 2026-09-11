# 工程落地建议

## 推荐组件目录
```text
components/
  shell/TopNav.tsx BottomNav.tsx
  home/HomeScene.tsx FrogStatusCard.tsx RecentMail.tsx ResourceStrip.tsx
  backpack/PackingSlot.tsx InventoryGrid.tsx TripTendency.tsx
  shop/ShopTabs.tsx ShopItemCard.tsx
  trip/TravelingScene.tsx TripSummary.tsx
  inbox/MailList.tsx MailPreview.tsx
  album/PostcardCard.tsx TravelBook.tsx Postmark.tsx
  map/WorldMap.tsx TravelPin.tsx RouteLine.tsx DiscoveryStats.tsx
  destination/DestinationHero.tsx VisitHistory.tsx
  collection/SouvenirCard.tsx
  profile/SettingsRow.tsx
```

## SVG 使用方式
- 不要把整页 SVG 当 `<img>` 直接上线。
- 页面 SVG 是高保真布局参考。
- `assets/**` 才是可直接导入的图形资产。
- 交互控件必须仍然使用真实 HTML `button/a/input`。

## Motion
- frog idle：Y ±2px / 3–4s。
- blink：5–12s 随机。
- mailbox：有新信时 300–400ms 轻晃。
- pin unlock：0.7 → 1.08 → 1。
- route：`stroke-dashoffset`。
- `prefers-reduced-motion` 时关闭环境动画。
