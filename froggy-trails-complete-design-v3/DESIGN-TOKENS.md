# Design Tokens

```css
:root {
  --paper-cream: #F4EBD8;
  --paper-light: #FFF9ED;
  --paper-soft: #F3E8D5;
  --moss: #5B7F3B;
  --leaf: #A7C66B;
  --terracotta: #C96F4A;
  --rainy-blue: #6A8EA0;
  --ink: #2D3A2E;
  --line: #D9CDBA;
  --muted: #8B8170;
  --wood: #684B36;
  --gold: #C5A85A;
  --radius-page: 28px;
  --radius-card: 20px;
  --radius-small: 16px;
  --shadow-soft: 0 8px 24px rgb(45 58 46 / 0.12);
}
```

## Spacing
8pt system：8 / 16 / 24 / 32 / 48 / 64。

## Typography
- Hero：38/48，serif。
- Page title：28/36，serif。
- H2：20/28，700。
- Body：16/26。
- Small：14/22。
- Tiny：12/18。

## Motion
- 交互反馈：150–220ms。
- 环境动画：3–60s。
- 避免无限快速循环。
- `prefers-reduced-motion` 必须可关闭。
