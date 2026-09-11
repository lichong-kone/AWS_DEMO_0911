"use client";

import { useState } from "react";
import type { Lang, Postcard } from "@/lib/types";
import { DESTINATION_MAP } from "@/lib/content/destinations";
import { loc, t } from "@/lib/i18n";

// Generates a share card (画面 + 地名 + 日期 + 一句话 + 品牌角标) and downloads it. (US-7.1)
function drawShareCard(postcard: Postcard, lang: Lang): string {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // paper background
  ctx.fillStyle = "#F4EBD8";
  ctx.fillRect(0, 0, 800, 1000);
  ctx.fillStyle = "#FBF6EA";
  ctx.fillRect(60, 60, 680, 880);
  ctx.strokeStyle = "rgba(45,58,46,0.15)";
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, 680, 880);

  const dest = DESTINATION_MAP[postcard.destinationId];
  const place = dest ? `${loc(dest.city, lang)}, ${loc(dest.country, lang)}` : postcard.destinationId;

  // scene block
  ctx.fillStyle = "rgba(167,198,107,0.25)";
  ctx.fillRect(110, 130, 580, 380);

  // texts
  ctx.fillStyle = "#2D3A2E";
  ctx.textAlign = "center";
  ctx.font = "bold 46px sans-serif";
  const heading = lang === "en" ? `Off to ${place}` : `小家伙今天去了 ${place}`;
  ctx.fillText(heading, 400, 600, 620);

  ctx.font = "28px sans-serif";
  ctx.fillStyle = "rgba(45,58,46,0.6)";
  ctx.fillText(new Date(postcard.createdAt).toLocaleDateString(), 400, 660);

  ctx.font = "italic 32px serif";
  ctx.fillStyle = "#2D3A2E";
  wrapText(ctx, `“${loc(postcard.diary, lang)}”`, 400, 750, 600, 44);

  // brand corner
  ctx.font = "24px sans-serif";
  ctx.fillStyle = "#5B7F3B";
  ctx.fillText("🌿 " + t("appName", lang), 400, 900);

  return canvas.toDataURL("image/png");
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const chars = text.split("");
  let line = "";
  let cy = y;
  for (const ch of chars) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      ctx.fillText(line, x, cy);
      line = ch;
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, cy);
}

export function ShareButton({ postcard, lang }: { postcard: Postcard; lang: Lang }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => {
        const url = drawShareCard(postcard, lang);
        if (!url) return;
        const a = document.createElement("a");
        a.href = url;
        a.download = `froggy-${postcard.id}.png`;
        a.click();
        setDone(true);
        setTimeout(() => setDone(false), 2000);
      }}
      className="rounded-card border border-moss/40 px-3 py-1 text-xs text-moss transition-colors hover:bg-moss/10"
    >
      {done ? t("downloaded", lang) : t("share", lang)}
    </button>
  );
}
