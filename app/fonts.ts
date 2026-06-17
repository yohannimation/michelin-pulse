import localFont from "next/font/local";

// MICHELIN Unit Titling — titres (H1/H2 en Bold, H3-H6 en Regular/Light).
// Exposé via --font-heading.
export const michelin = localFont({
  variable: "--font-heading",
  display: "swap",
  src: [
    { path: "../public/fonts/Michelin-Light.woff", weight: "300", style: "normal" },
    { path: "../public/fonts/Michelin-Regular.woff", weight: "400", style: "normal" },
    { path: "../public/fonts/Michelin-Bold.woff", weight: "700", style: "normal" },
  ],
});

// Noto Sans — corps de texte (recommandé pour le web). Exposé via --font-sans.
export const notoSans = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "../public/fonts/NotoSans-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/NotoSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/NotoSans-SemiCondensedBold.ttf", weight: "700", style: "normal" },
  ],
});
