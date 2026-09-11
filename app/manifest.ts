import type { MetadataRoute } from "next";

// Web app manifest (Next.js file convention -> /manifest.webmanifest).
// NOTE: v1 does not ship PWA install/push (that's P1). This manifest gives the
// app a proper name/theme and an icon; full install support on Android/Chrome
// additionally wants raster 192/512 PNG icons — see public/README.md.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "蛙游记 Froggy Trails",
    short_name: "蛙游记",
    description: "养一只会独自旅行的小动物,它会替你去看看世界。",
    start_url: "/",
    display: "standalone",
    background_color: "#F4EBD8",
    theme_color: "#5B7F3B",
    icons: [
      {
        src: "/art/brand/logo-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
