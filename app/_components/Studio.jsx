"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { CATALOG, COLLECTIONS } from "@/lib/catalog";
import { CollectionBg, CollectionsHub, THEME } from "./Collections";

/* ─────────────────────────────────────────────
   [OVRTHINK] STUDIO — full custom
   Text nelimitat, poziționabil liber (față/spate)
   Upload grafică proprie + verificare calitate print
   Simulator 3D cu rotire liberă
   Fix pe produs: wordmark + monograma OK
   ───────────────────────────────────────────── */

const ORANGE = "#FF4A1C";
const STAGE_W = 400, STAGE_H = 430;
const CANVAS_S = 2.5; // rezoluția texturii 3D

const GARMENT_COLORS = [
  { id: "black",  name: { ro: "Negru", en: "Black" }, hex: "#1d1d1c", ink: "#e9e7e2", dark: true },
  { id: "white",  name: { ro: "Alb", en: "White" },   hex: "#f2f1ed", ink: "#23211e", dark: false },
];

const PRODUCTS = [
  { id: "tee",    name: { ro: "Tricou", en: "T-shirt" } },
  { id: "hoodie", name: { ro: "Hoodie", en: "Hoodie" } },
];

const PRICES = {
  tee:    { slim: 169, regular: 189, oversized: 229 },
  hoodie: { regular: 329, oversized: 369 },
};

const FITS_BY_PRODUCT = {
  tee:    [
    { id: "slim", name: "Slim" },
    { id: "regular", name: "Regular" },
    { id: "oversized", name: "Oversized" },
  ],
  hoodie: [
    { id: "regular", name: "Regular" },
    { id: "oversized", name: "Oversized" },
  ],
};

/* ── valute (raportate la leu) ──────────────── */
const CURRENCIES = {
  RON: { rate: 1,      symbol: "lei", after: true },
  EUR: { rate: 0.201,  symbol: "€",   after: false },
  USD: { rate: 0.218,  symbol: "$",   after: false },
};
function money(lei, cur) {
  const c = CURRENCIES[cur];
  const v = Math.round(lei * c.rate);
  return c.after ? `${v} ${c.symbol}` : `${c.symbol}${v}`;
}

/* ── oferte bundle: al N-lea articol gratuit ──
   Fiecare ofertă cere un minim de produse pe tip; cel mai ieftin tricou
   din coș devine gratuit când condiția e îndeplinită. */
const BUNDLES = [
  { id: "4t",   tee: 4, hoodie: 0, freeTee: 1 },   // 4 tricouri + 1 tricou gratis
  { id: "2t1h", tee: 3, hoodie: 1, freeTee: 1 },   // 2 tricouri + 1 hoodie (+1 tricou gratis)
  { id: "2h",   tee: 0, hoodie: 2, freeTee: 1 },   // 2 hoodie + 1 tricou gratis
];

const SIZES_BY_PRODUCT = {
  tee:    ["S", "M", "L", "XL", "XXL"],
  hoodie: ["M", "L", "XL", "XXL"],
};

const QUICK_QUOTES = [
  "Looks OK. Isn't.",
  "I survived. Out of spite.",
  "No thoughts. Just consequences.",
  "Loop mode on.",
  "Do not disturb.",
  "Not OK. Still functioning.",
  "Peace was never an option.",
  "Tried to be spontaneous.\nPrepared extensively.",
  "I'm too sober for this shit",
  "I believe in fuck off\nat first sight.",
  "Good heart. Bad temper.",
  "Calm face. Violent ambition.",
  "I am a worst case scenario",
  "Somewhere between\npsychotic and iconic",
  "I'm not mean.\nI'm spicy nice.",
  "Sin with me.",
  "Be the right kind of dangerous.",
  "Let's make stories\nthat we can't tell.",
  "Too aware for small talk.",
  "I came. I saw. I overthought.",
  "Overthinking in progress.",
  "I make it weird in my head first.",
];

const SLIM_QUOTES = [
  "Good heart. Bad temper.",
  "I have notes.",
  "Noted.",
  "Respectfully, no.",
];
const SLIM_MAX = 28;

/* ── animațiile din colecție (SVG generat) ───── */
const AI = {
  faceCalm: k => `<g stroke="${k}" fill="none" stroke-width="1.4"><circle cx="12" cy="12" r="9.5"/><circle cx="8.5" cy="10" r=".9" fill="${k}" stroke="none"/><circle cx="15.5" cy="10" r=".9" fill="${k}" stroke="none"/><line x1="8.5" y1="15" x2="15.5" y2="15"/></g>`,
  faceWavy: k => `<g stroke="${k}" fill="none" stroke-width="1.4"><circle cx="12" cy="12" r="9.5"/><circle cx="8.5" cy="10" r=".9" fill="${k}" stroke="none"/><circle cx="15.5" cy="10" r=".9" fill="${k}" stroke="none"/><path d="M8 15.2 q1.3 -1.6 2.6 0 q1.3 1.6 2.6 0 q1.3 -1.6 2.6 0"/></g>`,
  faceGlitch: (k, a) => `<g stroke="${k}" fill="none" stroke-width="1.4"><circle cx="12" cy="12" r="9.5" stroke-dasharray="4 2.5"/><circle cx="8.5" cy="10" r="1.3" stroke="${a}"/><circle cx="15.5" cy="10" r=".9" fill="${k}" stroke="none"/><path d="M8 15.2 q1.3 -1.6 2.6 0 q1.3 1.6 2.6 0 q1.3 -1.6 2.6 0"/><line x1=".5" y1="8" x2="5" y2="8"/><line x1="19" y1="14" x2="23.5" y2="14"/></g>`,
  spinner: (k, frac) => {
    let t = "";
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const on = i < Math.round(frac * 12);
      t += `<line x1="${(12 + Math.cos(a) * 5.5).toFixed(2)}" y1="${(12 + Math.sin(a) * 5.5).toFixed(2)}" x2="${(12 + Math.cos(a) * 9.5).toFixed(2)}" y2="${(12 + Math.sin(a) * 9.5).toFixed(2)}" stroke="${k}" stroke-width="${on ? 2 : 1}" opacity="${on ? 1 : 0.3}" stroke-linecap="round"/>`;
    }
    return `<g>${t}</g>`;
  },
  target: k => `<g stroke="${k}" fill="none" stroke-width="1.4"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.4"/><line x1="12" y1="1.5" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22.5"/><line x1="1.5" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22.5" y2="12"/></g>`,
  chart: k => `<g stroke="${k}" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19 L9 12 L13 15 L21 5"/><path d="M15.5 5 H21 V10.5"/></g>`,
  burst: k => `<g stroke="${k}" fill="none" stroke-width="1.4" stroke-linejoin="round"><path d="M12 2.5 L13.8 8 L19 5 L16 9.8 L21.5 12 L16 14.2 L19 19 L13.8 16 L12 21.5 L10.2 16 L5 19 L8 14.2 L2.5 12 L8 9.8 L5 5 L10.2 8 Z"/></g>`,
  knot: k => `<g stroke="${k}" fill="none" stroke-width="1.3"><ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(20 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-25 12 12)"/><ellipse cx="12" cy="12" rx="8" ry="4.5" transform="rotate(75 12 12)"/></g>`,
  alert: k => `<g stroke="${k}" fill="none" stroke-width="1.4" stroke-linejoin="round"><path d="M12 3 L22 20 H2 Z"/><line x1="12" y1="9.5" x2="12" y2="14.5"/><circle cx="12" cy="17" r=".8" fill="${k}" stroke="none"/></g>`,
  spark: k => `<g stroke="${k}" fill="none" stroke-width="1.4" stroke-linecap="round"><path d="M9 21 L15 21 M10 18 L14 18 M12 15 v-3"/><path d="M12 3 v2.5 M5.6 5.6 l1.8 1.8 M18.4 5.6 l-1.8 1.8 M3.5 12 H6 M18 12 h2.5"/><circle cx="12" cy="11" r="3.2"/></g>`,
  eye: k => `<g stroke="${k}" fill="none" stroke-width="1.4"><path d="M2 12 Q12 3.5 22 12 Q12 20.5 2 12 Z"/><circle cx="12" cy="12" r="3"/></g>`,
  bubble: k => `<g stroke="${k}" fill="none" stroke-width="1.4" stroke-linejoin="round"><path d="M4 5 H20 V16 H10 L5.5 20 V16 H4 Z"/></g>`,
  xx: k => `<g stroke="${k}" stroke-width="1.6" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></g>`,
  door: k => `<g stroke="${k}" fill="none" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4 H5 V20 H13"/><path d="M10 12 H21 M17.5 8.5 L21 12 L17.5 15.5"/></g>`,
  heart: k => `<g stroke="${k}" fill="none" stroke-width="1.4" stroke-linejoin="round"><path d="M12 19.5 C6.5 15 4 12 4.6 9.2 C5.2 6.6 8.6 5.8 10.6 7.6 L12 9 L13.4 7.6 C15.4 5.8 18.8 6.6 19.4 9.2 C20 12 17.5 15 12 19.5 Z"/></g>`,
  heartBroken: k => `<g stroke="${k}" fill="none" stroke-width="1.4" stroke-linejoin="round"><path d="M12 19.5 C6.5 15 4 12 4.6 9.2 C5.2 6.6 8.6 5.8 10.6 7.6 L12 9 L13.4 7.6 C15.4 5.8 18.8 6.6 19.4 9.2 C20 12 17.5 15 12 19.5 Z"/><path d="M12 9 L10.6 11.5 L13.2 13.5 L11.6 16.5"/></g>`,
  heartStitch: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round"><path d="M12 19.5 C6.5 15 4 12 4.6 9.2 C5.2 6.6 8.6 5.8 10.6 7.6 L12 9 L13.4 7.6 C15.4 5.8 18.8 6.6 19.4 9.2 C20 12 17.5 15 12 19.5 Z"/><path d="M12 9.5 V16.5 M10.6 11 h2.8 M10.6 13 h2.8 M10.6 15 h2.8"/></g>`,
  heartBeat: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"><path d="M12 19.5 C6.5 15 4 12 4.6 9.2 C5.2 6.6 8.6 5.8 10.6 7.6 L12 9 L13.4 7.6 C15.4 5.8 18.8 6.6 19.4 9.2 C20 12 17.5 15 12 19.5 Z"/><path d="M6 12 H9 L10.5 9.8 L13 14.4 L14.5 12 H18"/></g>`,
  heartFire: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round"><path d="M12 20 C7 16 4.8 13.2 5.3 10.8 C5.8 8.6 8.7 7.9 10.4 9.4 L12 10.8 L13.6 9.4 C15.3 7.9 18.2 8.6 18.7 10.8 C19.2 13.2 17 16 12 20 Z"/><path d="M12 7 c0-1.4 -.5-2.2 .5-3.6 c.5 1.1 1.6 1.4 1.6 2.7 a2.1 2.1 0 0 1 -4.2 .1 c0-.5 .2-.9 .5-1.2"/></g>`,
  faceSteam: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linecap="round"><circle cx="12" cy="13.5" r="7.5"/><path d="M9 11.6 l1.6 1.2 M10.6 11.6 L9 12.8 M13.4 11.6 l1.6 1.2 M15 11.6 l-1.6 1.2 M9.4 17.4 q2.6 -2 5.2 0"/><path d="M7.5 2.4 q.6 1 0 2 M11 2 q.6 1 0 2 M14.5 2.4 q.6 1 0 2"/></g>`,
  circle: k => `<g stroke="${k}" fill="none" stroke-width="1.4"><circle cx="12" cy="12" r="8"/></g>`,
  circleShake: k => `<g stroke="${k}" fill="none" stroke-width="1.4" stroke-linecap="round"><circle cx="12" cy="12" r="7"/><path d="M2.8 9.4 a10 10 0 0 0 0 5.2 M21.2 9.4 a10 10 0 0 1 0 5.2"/></g>`,
  circleOpen: k => `<g stroke="${k}" fill="none" stroke-width="1.4" stroke-linecap="round"><path d="M18.4 7.4 A8 8 0 1 0 19.9 13.2"/></g>`,
  circleDash: k => `<g stroke="${k}" fill="none" stroke-width="1.4"><circle cx="12" cy="12" r="8" stroke-dasharray="5.5 4.5"/></g>`,
  circleDot: k => `<g stroke="${k}" fill="none" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8" stroke-dasharray="0.4 4.8"/></g>`,
  mushroom: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round"><path d="M8.8 19.5 c.6-2.2 .3-3.6 -.6-5 a5 5 0 1 1 7.6 0 c-.9 1.4 -1.2 2.8 -.6 5 Z"/><path d="M5.5 19.5 h13"/><circle cx="4.8" cy="12" r=".5" fill="${k}"/><circle cx="19.2" cy="12" r=".5" fill="${k}"/><circle cx="6.4" cy="8" r=".5" fill="${k}"/><circle cx="17.6" cy="8" r=".5" fill="${k}"/></g>`,
  bellRing: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"><path d="M6.2 16.5 h11.6 c-1.4-1.5 -1.9-3 -1.9-5 a3.9 3.9 0 0 0 -7.8 0 c0 2 -.5 3.5 -1.9 5 Z M10.6 18.8 a1.5 1.5 0 0 0 2.8 0"/><path d="M3.6 8.4 a9.5 9.5 0 0 1 1.9-3.2 M20.4 8.4 a9.5 9.5 0 0 0 -1.9-3.2"/></g>`,
  bellDots: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round"><path d="M6.2 16.5 h11.6 c-1.4-1.5 -1.9-3 -1.9-5 a3.9 3.9 0 0 0 -7.8 0 c0 2 -.5 3.5 -1.9 5 Z M10.6 18.8 a1.5 1.5 0 0 0 2.8 0"/><circle cx="5" cy="6" r=".55" fill="${k}"/><circle cx="19" cy="6" r=".55" fill="${k}"/><circle cx="7.4" cy="3.6" r=".55" fill="${k}"/><circle cx="16.6" cy="3.6" r=".55" fill="${k}"/></g>`,
  bellMute: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"><path d="M6.2 16.5 h11.6 c-1.4-1.5 -1.9-3 -1.9-5 a3.9 3.9 0 0 0 -7.8 0 c0 2 -.5 3.5 -1.9 5 Z M10.6 18.8 a1.5 1.5 0 0 0 2.8 0"/><path d="M4.5 4 L19.5 20"/></g>`,
  bellOff: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"><path d="M6.2 16.5 h11.6 c-1.4-1.5 -1.9-3 -1.9-5 a3.9 3.9 0 0 0 -7.8 0 c0 2 -.5 3.5 -1.9 5 Z"/><circle cx="12" cy="19.3" r=".8"/><path d="M19.5 4 L4.5 20"/></g>`,
  monHappy: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linecap="round"><rect x="5" y="4.8" width="14" height="10.8" rx="1"/><path d="M12 15.6 v2.6 M8.6 18.6 h6.8"/><circle cx="9.5" cy="9" r=".6" fill="${k}"/><circle cx="14.5" cy="9" r=".6" fill="${k}"/><path d="M9.5 11.8 q2.5 1.8 5 0"/></g>`,
  monWarn: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"><rect x="5" y="4.8" width="14" height="10.8" rx="1"/><path d="M12 15.6 v2.6 M8.6 18.6 h6.8"/><path d="M12 7 l3 5.2 h-6 Z M12 9 v1.4"/><circle cx="12" cy="11.4" r=".35" fill="${k}"/></g>`,
  monGlitch: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linecap="round"><rect x="5" y="4.8" width="14" height="10.8" rx="1" stroke-dasharray="3 2"/><path d="M12 15.6 v2.6 M8.6 18.6 h6.8"/><path d="M8.6 8 l1.8 1.8 M10.4 8 l-1.8 1.8 M13.6 8 l1.8 1.8 M15.4 8 l-1.8 1.8"/><path d="M2.6 10.4 h1.6 M19.8 12.2 h1.6"/></g>`,
  monCalm: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linecap="round"><rect x="5" y="4.8" width="14" height="10.8" rx="1"/><path d="M12 15.6 v2.6 M8.6 18.6 h6.8"/><circle cx="9.5" cy="9" r=".6" fill="${k}"/><circle cx="14.5" cy="9" r=".6" fill="${k}"/><path d="M9.7 12 h4.6"/></g>`,
  peace: k => `<g stroke="${k}" fill="none" stroke-width="1.4"><circle cx="12" cy="12" r="8.4"/><path d="M12 3.6 V20.4 M12 12 L6.2 17.8 M12 12 L17.8 17.8"/></g>`,
  peaceX: k => `<g stroke="${k}" fill="none" stroke-width="1.4" stroke-linecap="round"><circle cx="12" cy="12" r="8.4"/><path d="M12 3.6 V20.4 M12 12 L6.2 17.8 M12 12 L17.8 17.8"/><path d="M4.4 4.4 L19.6 19.6"/></g>`,
  calendar: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linecap="round"><rect x="4.6" y="6" width="14.8" height="13" rx="1"/><path d="M4.6 9.8 H19.4 M8.4 4.4 v2.8 M15.6 4.4 v2.8"/><circle cx="8.4" cy="13" r=".5" fill="${k}"/><circle cx="12" cy="13" r=".5" fill="${k}"/><circle cx="15.6" cy="13" r=".5" fill="${k}"/><circle cx="8.4" cy="16.2" r=".5" fill="${k}"/><circle cx="12" cy="16.2" r=".5" fill="${k}"/></g>`,
  clipboard: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><rect x="6.2" y="5.4" width="11.6" height="14.4" rx="1"/><path d="M9.6 5.4 a2.4 1.6 0 0 1 4.8 0"/><path d="M8.8 10.6 l1 1 1.8-2 M13.6 10.2 h2.4 M8.8 14.4 l1 1 1.8-2 M13.6 14 h2.4"/></g>`,
  martini: k => `<g stroke="${k}" fill="none" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"><path d="M4.5 4.5 h15 L12 12.5 Z M12 12.5 V19 M8.5 19 h7"/></g>`,
  noDrink: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.6 8.2 h6.8 l-.7 7.6 h-5.4 Z"/><path d="M5.6 5.6 L18.4 18.4"/></g>`,
  loadBar: k => `<g stroke="${k}" fill="none" stroke-width="1.3"><rect x="3.4" y="9.4" width="17.2" height="5.2" rx="1"/><path d="M5.4 9.8 l-1 4.4 M7.8 9.8 l-1 4.4 M10.2 9.8 l-1 4.4 M12.6 9.8 l-1 4.4"/></g>`,
  storm: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"><path d="M7.2 14.6 a3.8 3.8 0 1 1 .7-7.5 a4.8 4.8 0 0 1 9 1.3 a3.3 3.3 0 0 1 -.6 6.2"/><path d="M12.4 13.4 l-1.9 3.6 h2.6 l-1.9 3.6"/></g>`,
  rays: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linecap="round"><path d="M12 4.5 v3 M12 16.5 v3 M4.5 12 h3 M16.5 12 h3 M6.7 6.7 l2.1 2.1 M15.2 15.2 l2.1 2.1 M17.3 6.7 l-2.1 2.1 M8.8 15.2 l-2.1 2.1"/></g>`,
  crown: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round"><path d="M5 16.4 h14 l1.2-7.6 -4.6 3 L12 5.4 8.4 11.8 3.8 8.8 Z"/><path d="M5.6 19 h12.8"/></g>`,
  smile: k => `<g stroke="${k}" fill="none" stroke-width="1.4"><circle cx="12" cy="12" r="8.4"/><circle cx="9.2" cy="10" r=".7" fill="${k}"/><circle cx="14.8" cy="10" r=".7" fill="${k}"/><path d="M8.8 14.2 q3.2 2.6 6.4 0"/></g>`,
  wink: k => `<g stroke="${k}" fill="none" stroke-width="1.4" stroke-linecap="round"><circle cx="12" cy="12" r="8.4"/><circle cx="9.2" cy="10" r=".7" fill="${k}"/><path d="M13.6 10 h2.6"/><path d="M8.8 14.2 q3.2 2.6 6.4 0"/></g>`,
  chili: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"><path d="M18.4 5.6 c1.6 .4 1.9 2 .9 3 C16.3 14 11 18.4 5.4 19.6 c-1.5 .3 -2 -1.2 -.7 -2 C9.8 14.6 13.8 10.8 15.6 7 c.5-1 1.4-1.7 2.8-1.4 Z"/><path d="M18.2 5.4 c-.2-1.6 .8-2.6 2.4-2.7"/></g>`,
  flame: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round"><path d="M12 3.4 c2.2 2.8 4.6 5 4.6 8.4 a4.6 4.6 0 0 1 -9.2 0 c0-1.8 .8-3.2 1.8-4.2 c-.1 1.3 .5 2.2 1.4 2.7 c-.5-2.3 0-4.6 1.4-6.9 Z"/></g>`,
  halo: k => `<g stroke="${k}" fill="none" stroke-width="1.4"><ellipse cx="12" cy="12" rx="7" ry="2.6"/></g>`,
  horns: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round"><path d="M6.4 16 C5.2 11 6.6 7.4 9.4 5.6 C8.2 9.4 8.8 12.6 10.4 15.2 M17.6 16 C18.8 11 17.4 7.4 14.6 5.6 C15.8 9.4 15.2 12.6 13.6 15.2"/></g>`,
  rose: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linecap="round"><path d="M12 13.2 a3.6 3.6 0 1 1 3.6-3.6 a2.2 2.2 0 1 1 -3.6 -2.6"/><path d="M12 13.2 V21 M12 16.8 c-1.8 0 -3.2-.9 -3.8-2.4 M12 18.6 c1.8 0 3.2-.9 3.8-2.4"/></g>`,
  dagger: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"><path d="M12 2.6 L13.6 12.4 H10.4 Z M8.8 12.4 h6.4 M12 12.4 V20 M10.4 20 h3.2"/></g>`,
  star4: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round"><path d="M12 4 L13.7 10.3 L20 12 L13.7 13.7 L12 20 L10.3 13.7 L4 12 L10.3 10.3 Z"/></g>`,
  haloRing: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linecap="round"><ellipse cx="12" cy="12.5" rx="7.6" ry="2.5" transform="rotate(-10 12 12.5)"/><path d="M19 6.6 l1-1 M20.4 9 h1.2"/></g>`,
  sparkle: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"><path d="M11.4 5.6 L12.7 10.7 L17.8 12 L12.7 13.3 L11.4 18.4 L10.1 13.3 L5 12 L10.1 10.7 Z"/><path d="M18.6 4.8 v2.2 M17.5 5.9 h2.2"/></g>`,
  lock: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><rect x="6.6" y="10.6" width="10.8" height="8.8" rx="1"/><path d="M9 10.6 V8.2 a3 3 0 0 1 6 0 v2.4"/><path d="M12 16.4 v-2.6 M10.9 14.7 L12 13.6 L13.1 14.7"/></g>`,
  moon: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"><path d="M14.6 3.8 a8.4 8.4 0 1 0 5.6 11.4 a6.8 6.8 0 0 1 -5.6 -11.4 Z"/><path d="M18.8 4.6 v2 M17.8 5.6 h2"/></g>`,
  thought: k => `<g stroke="${k}" fill="none" stroke-width="1.3" stroke-linejoin="round"><path d="M8.2 13.4 a3.4 3.4 0 1 1 .7-6.6 a4.2 4.2 0 0 1 7.9 1.2 a2.9 2.9 0 0 1 -.9 5.4 Z"/><circle cx="7.4" cy="16.4" r="1.1"/><circle cx="5" cy="19" r=".7"/></g>`,
  loop: k => `<g stroke="${k}" fill="none" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19.4 10.4 a7.6 7.6 0 1 0 .2 3.6"/><path d="M20 6.4 L19.4 10.4 L15.4 9.9"/></g>`,
  bubbleX: k => `<g stroke="${k}" fill="none" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"><path d="M4 5 H20 V16 H10 L5.5 20 V16 H4 Z"/><path d="M10 8.4 l4 4 M14 8.4 l-4 4"/></g>`,
};

const ANIM_PRESETS = [
  { id: "glitch",  name: "Glitch",
    build: (k, a) => [AI.faceCalm(k), AI.faceCalm(k), AI.faceWavy(k), AI.faceGlitch(k, a)] },
  { id: "loading", name: "Loading",
    build: k => [AI.spinner(k, 0.25), AI.spinner(k, 0.5), AI.spinner(k, 0.75), AI.spinner(k, 1)] },
  { id: "impact",  name: "Impact",
    build: k => [AI.faceCalm(k), AI.target(k), AI.chart(k), AI.burst(k)] },
  { id: "weird",   name: "Weird",
    build: k => [AI.faceCalm(k), AI.knot(k), AI.alert(k), AI.spark(k)] },
  { id: "exit",    name: "Exit",
    build: k => [AI.eye(k), AI.bubble(k), AI.xx(k), AI.door(k)] },
  { id: "hearts",  name: "Survived",
    build: k => [AI.heart(k), AI.heartBroken(k), AI.heartStitch(k), AI.heartBeat(k)] },
  { id: "consequences", name: "Consequences",
    build: k => [AI.circle(k), AI.circleShake(k), AI.knot(k), AI.mushroom(k)] },
  { id: "loopmode", name: "Loop",
    build: k => [AI.circle(k), AI.circleOpen(k), AI.circleDash(k), AI.circleDot(k)] },
  { id: "dnd", name: "Do not disturb",
    build: k => [AI.bellRing(k), AI.bellDots(k), AI.bellMute(k), AI.bellOff(k)] },
  { id: "functioning", name: "Functioning",
    build: k => [AI.monHappy(k), AI.monWarn(k), AI.monGlitch(k), AI.monCalm(k)] },
  { id: "peace", name: "No peace",
    build: k => [AI.peace(k), AI.alert(k), AI.peaceX(k), AI.knot(k)] },
  { id: "spontaneous", name: "Spontaneous",
    build: k => [AI.calendar(k), AI.clipboard(k), AI.knot(k)] },
  { id: "sober", name: "Sober",
    build: k => [AI.martini(k), AI.noDrink(k), AI.faceCalm(k), AI.burst(k)] },
  { id: "firstsight", name: "First sight",
    build: k => [AI.eye(k), AI.bubbleX(k), AI.door(k)] },
  { id: "temper", name: "Temper",
    build: k => [AI.heart(k), AI.heartBroken(k), AI.heartFire(k), AI.faceSteam(k)] },
  { id: "worstcase", name: "Worst case",
    build: k => [AI.loadBar(k), AI.alert(k), AI.storm(k), AI.rays(k)] },
  { id: "iconic", name: "Iconic",
    build: k => [AI.faceCalm(k), AI.knot(k), AI.burst(k), AI.crown(k)] },
  { id: "spicy", name: "Spicy",
    build: k => [AI.smile(k), AI.chili(k), AI.flame(k), AI.smile(k)] },
  { id: "sin", name: "Sin",
    build: k => [AI.halo(k), AI.horns(k), AI.heart(k), AI.wink(k)] },
  { id: "dangerous", name: "Dangerous",
    build: k => [AI.rose(k), AI.dagger(k), AI.star4(k), AI.haloRing(k)] },
  { id: "stories", name: "Stories",
    build: k => [AI.bubble(k), AI.sparkle(k), AI.lock(k), AI.moon(k)] },
  { id: "overthought", name: "Overthought",
    build: k => [AI.eye(k), AI.thought(k), AI.knot(k), AI.loop(k)] },
];
const ANIM_VB_H = 32;

function animVbW(animId) {
  const preset = ANIM_PRESETS.find(a => a.id === animId);
  const n = preset ? preset.build("#000", "#000").length : 4;
  return n * 52 - 28;
}

function animSvgUrl(animId, ink, animated) {
  const preset = ANIM_PRESETS.find(a => a.id === animId);
  if (!preset) return "";
  const icons = preset.build(ink, ORANGE);
  const n = icons.length;
  const W = n * 52 - 28;
  const groups = icons.map((g, i) =>
    `<g class="s s${i}" transform="translate(${i * 52} 4)">${g}</g>`).join("");
  const arrows = icons.slice(0, -1).map((_, i) =>
    `<text x="${i * 52 + 32}" y="22" font-size="12" fill="${ink}" opacity="0.7">\u2192</text>`).join("");
  const style = animated
    ? `<style>.s{animation:p 3.4s ease infinite;opacity:.15}${icons.map((_, i) => `.s${i}{animation-delay:${(i * 0.55).toFixed(2)}s}`).join("")}@keyframes p{0%,8%{opacity:.15}14%,70%{opacity:1}80%,100%{opacity:.15}}</style>`
    : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${ANIM_VB_H}" width="${W * 4}" height="${ANIM_VB_H * 4}">${style}${groups}${arrows}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/* ── prețul personalizării ──────────────────── */
function textTier(text) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  if (words <= 6) return 15;
  if (words <= 15) return 25;
  return 35;
}

function customizationCost(elements, isSlim, slimMode) {
  if (isSlim) return slimMode === "custom" ? 15 : 0;
  let c = 0;
  elements.forEach(el => {
    if (el.type === "text") { if (!el.preset) c += textTier(el.text); }
    else if (el.type === "anim") c += 19;
    else if (el.type === "image") c += el.wFrac > 0.45 ? 49 : 29;
  });
  return c;
}

/* TVA România — cotă standard 21% (din aug. 2025), aplicabilă îmbrăcămintei.
   Prețurile afișate includ deja TVA; îl evidențiem separat la checkout. */
const VAT_RATE = 0.21;

/* coduri de reducere (extensibil) */
const PROMO_CODES = {
  OVR10: { type: "pct", value: 10, label: "−10%" },
  FREESHIP: { type: "ship", value: 0, label: "Transport gratuit" },
};

/* calculează tot coșul: subtotal, tricouri gratuite din oferte, reduceri */
function computeCart(cart, { account, promo, shipCost }) {
  const subtotal = cart.reduce((a, it) => a + it.total, 0);
  const teeCount = cart.reduce((a, it) => a + (it.product === "tee" ? it.qty : 0), 0);
  const hoodieCount = cart.reduce((a, it) => a + (it.product === "hoodie" ? it.qty : 0), 0);

  // prețuri unitare tricou (per buc), pentru a face gratuit pe cel mai ieftin
  const teeUnits = [];
  cart.forEach(it => {
    if (it.product === "tee") for (let i = 0; i < it.qty; i++) teeUnits.push(it.total / it.qty);
  });
  teeUnits.sort((a, b) => a - b);

  // câte tricouri gratuite oferă cea mai bună combinație de bundle-uri aplicabile
  let freeTees = 0;
  let t = teeCount, h = hoodieCount;
  BUNDLES.forEach(b => {
    while (t >= b.tee && h >= b.hoodie && (b.tee + b.hoodie) > 0) {
      // verific că ar mai rămâne tricouri de făcut gratuite
      if (teeUnits.length > freeTees) {
        freeTees += b.freeTee;
        t -= b.tee; h -= b.hoodie;
      } else break;
    }
  });
  freeTees = Math.min(freeTees, teeUnits.length);
  const bundleDiscount = Math.round(teeUnits.slice(0, freeTees).reduce((a, v) => a + v, 0));

  const afterBundle = subtotal - bundleDiscount;
  const accountDiscount = account ? Math.round(afterBundle * 0.05) : 0;

  let promoDiscount = 0, freeShip = false;
  const p = promo && PROMO_CODES[promo];
  if (p) {
    if (p.type === "pct") promoDiscount = Math.round((afterBundle - accountDiscount) * (p.value / 100));
    if (p.type === "ship") freeShip = true;
  }

  const ship = freeShip ? 0 : shipCost;
  const grand = Math.max(0, afterBundle - accountDiscount - promoDiscount) + ship;
  // prețurile includ TVA; extragem componenta de TVA din total (fără transport, care e separat)
  const taxableBase = Math.max(0, grand - ship);
  const vat = Math.round(taxableBase - taxableBase / (1 + VAT_RATE));
  const net = taxableBase - vat;
  return { subtotal, bundleDiscount, freeTees, accountDiscount, promoDiscount, ship, freeShip, grand, net, vat, teeCount, hoodieCount };
}

/* ── traduceri ──────────────────────────────── */
const T = {
  ro: {
    studio: "STUDIO · FULL CUSTOM",
    tabFront: "Față", tabBack: "Spate", tab3d: "Vezi în 3D",
    sideFront: "față", sideBack: "spate", sideProduct: "produs",
    hintDrag: s => `Trage chenarul oriunde pe ${s}. Logo-ul și monograma OK rămân fixe pe produs.`,
    hintFixed: "Elementele se așază automat în poziția standard, centrate. Logo-ul și monograma OK rămân fixe pe produs.",
    hintSlim: "Slim fit are un design curat: doar citatul ales, pe față. Spatele rămâne simplu, cu wordmark-ul.",
    viewerHint: "Trage cu degetul ca să rotești produsul în orice direcție.",
    sec1: "Produs · culoare · fit", from: "de la",
    sec2: s => `Adaugă pe ${s}`,
    btnText: "+ Text liber", btnGfx: "+ Grafica ta",
    animLabel: "Animații din colecție · +19 lei",
    pricingNote: "Citatele din colecție sunt incluse în preț (cât timp nu le modifici). Text propriu: +15 lei până la 6 cuvinte, +25 lei între 7–15, +35 lei peste. Grafica ta: +29 lei (mică) sau +49 lei (mare). Textul nu are limită — scrie pe mai multe rânduri cu Enter. Pe print, animația apare ca grafic static.",
    slimLabel: "Citatul tău · doar pe față",
    fromCollection: "Din colecție", yourQuote: "Citatul tău",
    slimPlaceholder: "Scurt și elegant — primul „o” devine portocaliu",
    slimCounter: n => `${n}/${SLIM_MAX} caractere · un singur rând · +15 lei`,
    slimNote: "Pe slim fit ținem designul aerisit și elegant: un singur citat scurt, pe un singur rând, imprimat pe piept. Pentru text liber, grafică proprie sau print pe spate, alege Regular sau Oversized.",
    slimDefault: "Citatul tău.",
    selElement: "Elementul selectat",
    textPlaceholder: "Scrie orice — primul „o” devine portocaliu",
    presetIncluded: "Citat din colecție · inclus în preț",
    ownText: p => `Text propriu · +${p} lei`,
    sizeText: "Mărime text",
    animInfo: "Animație din colecție · +19 lei", animSize: "Mărime animație",
    gfxSize: "Mărime grafică", gfxBig: "+49 lei (mare)", gfxSmall: "+29 lei (mică)",
    qExc: "Excelent pentru print", qOk: "OK pentru print",
    qLow: "Prea mică — min. 1200 px pentru un print curat",
    moveTo: s => `Mută pe ${s}`, del: "Șterge",
    sizesQty: "Mărime & cantitate", total: "Total",
    breakdown: (u, c) => `${u} lei bază${c > 0 ? ` + ${c} lei personalizare` : ""}`,
    addCart: "Adaugă în coș", added: "Adăugat ✓",
    addedToCart: "Adăugat în coș", viewCart: "Vezi coșul", keepShopping: "Continuă cumpărăturile",
    defaultText: "Textul tău aici",
    footerMat: "100% bumbac · heavyweight",
    cart: "Coș", checkoutTitle: "Finalizare comandă",
    emptyCart: "Coșul e gol — vezi colecția.",
    backStudio: "← Continuă cumpărăturile", newOrder: "Comandă nouă",
    payMethod: "Metodă de plată", cardLabel: "Card de debit / credit",
    cardNo: "Număr card", cardExp: "LL/AA", cardCvc: "CVC", cardName: "Numele de pe card",
    payNow: t => `Plătește ${t} lei`, processing: "Se procesează…",
    orderOk: "Comanda a fost plasată", orderOkSub: "Mulțumim! Vei primi confirmarea pe email.",
    demoNote: "Demo de checkout — în varianta live, plățile vor fi procesate securizat prin platforma de plăți.",
    remove: "Șterge", pcs: "buc.",
    lineUnisex: "Unisex / Bărbați", lineWomen: "Femei", soon: "în curând",
    subtotal: "Subtotal", discount: "Reducere", shipping: "Transport", freeShipLabel: "Gratuit",
    netLabel: "Valoare fără TVA", vatLabel: "TVA (21%)", vatIncluded: "Prețurile includ TVA 21%",
    bundleFree: n => `Ofertă: ${n} ${n === 1 ? "tricou gratuit" : "tricouri gratuite"}`,
    accountDisc: "Reducere cont (−5%)",
    createAccount: "Creează cont", createAccountNote: "5% reducere la prima comandă, aplicată automat.",
    haveAccount: "Am deja cont", guest: "Continui ca invitat",
    email: "Email", password: "Parolă", fullName: "Nume complet", phone: "Telefon",
    custType: "Tip client", person: "Persoană fizică", company: "Persoană juridică",
    companyName: "Denumire firmă", cui: "CUI", regCom: "Nr. Reg. Com.",
    shipAddr: "Adresă de livrare", billAddr: "Adresă de facturare",
    sameAsShip: "Aceeași ca livrarea", street: "Stradă și număr", city: "Oraș",
    county: "Județ / Regiune", zip: "Cod poștal", country: "Țară",
    shipMethod: "Metodă de livrare",
    sameday: "Sameday (România)", samedayNote: "1–2 zile lucrătoare",
    dhl: "DHL Express (internațional)", dhlNote: "3–6 zile lucrătoare",
    promoLabel: "Cod de reducere", promoApply: "Aplică", promoOk: "Cod aplicat", promoBad: "Cod invalid",
    contactInfo: "Date de contact", offersTitle: "Oferte active",
    offer1: "4 tricouri → al 5-lea gratuit",
    offer2: "2 tricouri + 1 hoodie → +1 tricou gratuit",
    offer3: "2 hoodie → +1 tricou gratuit",
    bundleHint: "Adaugă în coș produsele potrivite și tricoul gratuit se aplică automat.",
  },
  en: {
    studio: "STUDIO · FULL CUSTOM",
    tabFront: "Front", tabBack: "Back", tab3d: "View in 3D",
    sideFront: "front", sideBack: "back", sideProduct: "product",
    hintDrag: s => `Drag the frame anywhere on the ${s}. The logo and the OK monogram stay fixed on the garment.`,
    hintFixed: "Elements are placed automatically in the standard, centered position. The logo and OK monogram stay fixed on the garment.",
    hintSlim: "Slim fit keeps a clean design: just your chosen quote, on the front. The back stays simple, with the wordmark.",
    viewerHint: "Drag to rotate the garment in any direction.",
    sec1: "Product · color · fit", from: "from",
    sec2: s => `Add to the ${s}`,
    btnText: "+ Free text", btnGfx: "+ Your graphic",
    animLabel: "Collection animations · +19 lei",
    pricingNote: "Collection quotes are included in the price (as long as you don't edit them). Custom text: +15 lei up to 6 words, +25 lei for 7–15, +35 lei beyond. Your graphic: +29 lei (small) or +49 lei (large). Text has no limit — write multiple lines with Enter. On print, the animation appears as static artwork.",
    slimLabel: "Your quote · front only",
    fromCollection: "From the collection", yourQuote: "Your own quote",
    slimPlaceholder: "Short and elegant — the first “o” turns orange",
    slimCounter: n => `${n}/${SLIM_MAX} characters · single line · +15 lei`,
    slimNote: "On slim fit we keep the design airy and elegant: one short quote, on a single line, printed on the chest. For free text, your own graphics or back prints, choose Regular or Oversized.",
    slimDefault: "Your quote.",
    selElement: "Selected element",
    textPlaceholder: "Write anything — the first “o” turns orange",
    presetIncluded: "Collection quote · included in price",
    ownText: p => `Custom text · +${p} lei`,
    sizeText: "Text size",
    animInfo: "Collection animation · +19 lei", animSize: "Animation size",
    gfxSize: "Graphic size", gfxBig: "+49 lei (large)", gfxSmall: "+29 lei (small)",
    qExc: "Excellent for print", qOk: "OK for print",
    qLow: "Too small — min. 1200 px for a clean print",
    moveTo: s => `Move to ${s}`, del: "Delete",
    sizesQty: "Size & quantity", total: "Total",
    breakdown: (u, c) => `${u} lei base${c > 0 ? ` + ${c} lei customization` : ""}`,
    addCart: "Add to cart", added: "Added ✓",
    addedToCart: "Added to cart", viewCart: "View cart", keepShopping: "Keep shopping",
    defaultText: "Your text here",
    footerMat: "100% cotton · heavyweight",
    cart: "Cart", checkoutTitle: "Checkout",
    emptyCart: "Your cart is empty — browse the collection.",
    backStudio: "← Keep shopping", newOrder: "New order",
    payMethod: "Payment method", cardLabel: "Debit / credit card",
    cardNo: "Card number", cardExp: "MM/YY", cardCvc: "CVC", cardName: "Name on card",
    payNow: t => `Pay ${t} lei`, processing: "Processing…",
    orderOk: "Order placed", orderOkSub: "Thank you! You'll receive a confirmation by email.",
    demoNote: "Checkout demo — in the live version, payments are processed securely through the payment platform.",
    remove: "Remove", pcs: "pcs",
    lineUnisex: "Unisex / Men", lineWomen: "Women", soon: "coming soon",
    subtotal: "Subtotal", discount: "Discount", shipping: "Shipping", freeShipLabel: "Free",
    netLabel: "Net (excl. VAT)", vatLabel: "VAT (21%)", vatIncluded: "Prices include 21% VAT",
    bundleFree: n => `Offer: ${n} free ${n === 1 ? "t-shirt" : "t-shirts"}`,
    accountDisc: "Account discount (−5%)",
    createAccount: "Create account", createAccountNote: "5% off your first order, applied automatically.",
    haveAccount: "I have an account", guest: "Continue as guest",
    email: "Email", password: "Password", fullName: "Full name", phone: "Phone",
    custType: "Customer type", person: "Individual", company: "Business",
    companyName: "Company name", cui: "VAT / Reg. no.", regCom: "Trade reg. no.",
    shipAddr: "Shipping address", billAddr: "Billing address",
    sameAsShip: "Same as shipping", street: "Street and number", city: "City",
    county: "County / Region", zip: "ZIP code", country: "Country",
    shipMethod: "Shipping method",
    sameday: "Sameday (Romania)", samedayNote: "1–2 business days",
    dhl: "DHL Express (international)", dhlNote: "3–6 business days",
    promoLabel: "Discount code", promoApply: "Apply", promoOk: "Code applied", promoBad: "Invalid code",
    contactInfo: "Contact details", offersTitle: "Active offers",
    offer1: "4 t-shirts → 5th one free",
    offer2: "2 t-shirts + 1 hoodie → +1 free t-shirt",
    offer3: "2 hoodies → +1 free t-shirt",
    bundleHint: "Add the matching products to your cart and the free t-shirt applies automatically.",
  },
};

/* ── layout automat: elementele se așază centrat și stivuite ──
   Toate elementele unei fețe se aliniază pe centru (x=0.5) și se stivuiesc
   vertical (animație → text → grafică), centrate pe zona standard de print. */
const STAGE_VB_H = 430, STAGE_VB_W = 400;
function elHeightFrac(el, animVbWFn) {
  if (el.type === "text") {
    const lines = (el.text || "").split("\n").length;
    return (lines * el.fs * 1.4) / STAGE_VB_H;
  }
  if (el.type === "anim") {
    const wpx = el.wFrac * STAGE_VB_W;
    return (wpx * (32 / animVbWFn(el.animId))) / STAGE_VB_H;
  }
  if (el.type === "image") {
    const asp = el.natH && el.natW ? el.natH / el.natW : 1;
    return (el.wFrac * STAGE_VB_W * asp) / STAGE_VB_H;
  }
  return 0.08;
}
const TYPE_ORDER = { anim: 0, text: 1, image: 2 };
function computeLayout(elements, side, animVbWFn) {
  const els = elements.filter(e => e.side === side)
    .slice().sort((a, b) => (TYPE_ORDER[a.type] - TYPE_ORDER[b.type]));
  const anchor = side === "front" ? 0.40 : 0.46;
  const gap = 0.028;
  const heights = els.map(e => elHeightFrac(e, animVbWFn));
  const total = heights.reduce((a, h) => a + h, 0) + gap * Math.max(0, els.length - 1);
  let top = anchor - total / 2;
  const pos = {};
  els.forEach((e, i) => {
    pos[e.id] = { cx: 0.5, cy: top + heights[i] / 2 };
    top += heights[i] + gap;
  });
  return pos;
}

/* ── geometrie ──────────────────────────────── */
function fitParams(fit) {
  if (fit === "slim")      return { sh: 72,  bw: 80,  slv: 34, slvDrop: 10, hem: 360, drop: 0 };
  if (fit === "oversized") return { sh: 96,  bw: 118, slv: 52, slvDrop: 26, hem: 385, drop: 10 };
  return                          { sh: 84,  bw: 98,  slv: 42, slvDrop: 16, hem: 372, drop: 4 };
}

function TeeShapeSVG({ p, fill, line }) {
  const C = 200, neckY = 70, shY = 86 + p.drop;
  const d = [
    `M ${C - 34} ${neckY}`, `L ${C - p.sh} ${shY}`,
    `L ${C - p.sh - p.slv} ${shY + p.slvDrop + 26}`,
    `L ${C - p.sh - p.slv + 14} ${shY + p.slvDrop + 62}`,
    `L ${C - p.bw} ${shY + 78}`, `L ${C - p.bw} ${p.hem}`,
    `L ${C + p.bw} ${p.hem}`, `L ${C + p.bw} ${shY + 78}`,
    `L ${C + p.sh + p.slv - 14} ${shY + p.slvDrop + 62}`,
    `L ${C + p.sh + p.slv} ${shY + p.slvDrop + 26}`,
    `L ${C + p.sh} ${shY}`, `L ${C + 34} ${neckY}`,
    `Q ${C} ${neckY + 22} ${C - 34} ${neckY}`, "Z",
  ].join(" ");
  return (
    <>
      <path d={d} fill={fill} stroke={line} strokeWidth="1.5" strokeLinejoin="round" />
      <path d={`M ${C - 34} ${neckY} Q ${C} ${neckY + 30} ${C + 34} ${neckY}`} fill="none" stroke={line} strokeWidth="1.2" opacity="0.55" />
    </>
  );
}

function HoodieShapeSVG({ p, fill, line, back }) {
  const C = 200, shY = 96 + p.drop, hem = p.hem + 8;
  const bw = p.bw + 6, sh = p.sh + 4, slv = p.slv + 6;
  const body = [
    `M ${C - 44} 84`, `L ${C - sh} ${shY}`,
    `L ${C - sh - slv} ${shY + p.slvDrop + 30}`,
    `L ${C - sh - slv + 16} ${shY + p.slvDrop + 70}`,
    `L ${C - bw} ${shY + 84}`, `L ${C - bw} ${hem - 18}`,
    `L ${C + bw} ${hem - 18}`, `L ${C + bw} ${shY + 84}`,
    `L ${C + sh + slv - 16} ${shY + p.slvDrop + 70}`,
    `L ${C + sh + slv} ${shY + p.slvDrop + 30}`,
    `L ${C + sh} ${shY}`, `L ${C + 44} 84`, "Z",
  ].join(" ");
  return (
    <>
      <path d={body} fill={fill} stroke={line} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x={C - bw} y={hem - 18} width={bw * 2} height="16" fill={fill} stroke={line} strokeWidth="1.5" />
      {back ? (
        <path d={`M ${C - 44} 84 Q ${C - 50} 38 ${C} 34 Q ${C + 50} 38 ${C + 44} 84 Q ${C} 100 ${C - 44} 84 Z`}
          fill={fill} stroke={line} strokeWidth="1.5" />
      ) : (
        <>
          <path d={`M ${C - 44} 84 Q ${C - 46} 48 ${C} 44 Q ${C + 46} 48 ${C + 44} 84 Q ${C + 20} 70 ${C} 70 Q ${C - 20} 70 ${C - 44} 84 Z`}
            fill={fill} stroke={line} strokeWidth="1.5" />
          <path d={`M ${C - 56} ${hem - 96} L ${C + 56} ${hem - 96} L ${C + 56} ${hem - 30} L ${C - 56} ${hem - 30} Z`}
            fill="none" stroke={line} strokeWidth="1.1" opacity="0.55" />
        </>
      )}
    </>
  );
}

function OkTagSVG({ x, y, ink }) {
  return (
    <g>
      <rect x={x} y={y} width="34" height="24" fill="none" stroke={ink} strokeWidth="1" opacity="0.85" />
      <circle cx={x + 11} cy={y + 12} r="4.4" fill="none" stroke={ORANGE} strokeWidth="1.6" />
      <path d={`M ${x + 20} ${y + 6.5} V ${y + 17.5} M ${x + 26.5} ${y + 6.5} L ${x + 20.5} ${y + 12} L ${x + 26.5} ${y + 17.5}`}
        stroke={ink} strokeWidth="1.3" fill="none" />
    </g>
  );
}

/* poziții branding fix */
function brandingPos(product, fit) {
  const p = fitParams(fit);
  return {
    tagX: 200 + p.bw - (product === "hoodie" ? 62 : 58),
    tagY: (product === "hoodie" ? p.hem + 8 : p.hem) - 44,
    wordY: product === "hoodie" ? 64 : 118,
  };
}

/* ── text cu primul „o” portocaliu ──────────── */
let _measureCtx = null;
function fitSlimFs(text, maxW, base = 11) {
  if (typeof document === "undefined" || !text) return base;
  if (!_measureCtx) _measureCtx = document.createElement("canvas").getContext("2d");
  _measureCtx.font = `300 ${base}px Jost, sans-serif`;
  const w = _measureCtx.measureText(text).width;
  return w > maxW ? Math.max(6, base * (maxW / w)) : base;
}

function orangeSegments(line, alreadyFound) {
  if (alreadyFound) return { segs: [[line, "ink"]], found: false };
  const i = line.search(/o/i);
  if (i === -1) return { segs: [[line, "ink"]], found: false };
  return { segs: [[line.slice(0, i), "ink"], [line[i], "orange"], [line.slice(i + 1), "ink"]], found: true };
}

/* ── desenarea texturii pentru 3D ───────────── */
function drawSideCanvas({ side, product, fit, color, elements, imgCache, slimQuote }) {
  const slim = fit === "slim";
  const els = slim ? [] : elements;
  const W = STAGE_W * CANVAS_S, H = STAGE_H * CANVAS_S;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = color.hex;
  ctx.fillRect(0, 0, W, H);
  const ink = color.ink;
  const bp = brandingPos(product, fit);

  if (side === "back") {
    // wordmark fix sus
    const fs = 10 * CANVAS_S;
    ctx.font = `300 ${fs}px Jost, sans-serif`;
    ctx.textBaseline = "middle";
    const parts = [["[", ink], ["O", ORANGE], ["VRTHINK]", ink]];
    const tw = parts.reduce((a, [t]) => a + ctx.measureText(t).width, 0);
    let x = W / 2 - tw / 2;
    const y = bp.wordY * CANVAS_S;
    parts.forEach(([t, c]) => { ctx.fillStyle = c; ctx.fillText(t, x, y); x += ctx.measureText(t).width; });
  } else {
    // eticheta OK fixă la tiv
    const S = CANVAS_S, tx = bp.tagX * S, ty = bp.tagY * S;
    ctx.strokeStyle = ink; ctx.lineWidth = 1 * S;
    ctx.strokeRect(tx, ty, 34 * S, 24 * S);
    ctx.strokeStyle = ORANGE; ctx.lineWidth = 1.6 * S;
    ctx.beginPath(); ctx.arc(tx + 11 * S, ty + 12 * S, 4.4 * S, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = ink; ctx.lineWidth = 1.3 * S;
    ctx.beginPath();
    ctx.moveTo(tx + 20 * S, ty + 6.5 * S); ctx.lineTo(tx + 20 * S, ty + 17.5 * S);
    ctx.moveTo(tx + 26.5 * S, ty + 6.5 * S); ctx.lineTo(tx + 20.5 * S, ty + 12 * S); ctx.lineTo(tx + 26.5 * S, ty + 17.5 * S);
    ctx.stroke();

    if (slim && slimQuote) {
      const pp = fitParams(fit);
      const maxW = (pp.bw * 2 - 36) * CANVAS_S;
      const fs = fitSlimFs(slimQuote, pp.bw * 2 - 36, 11) * CANVAS_S;
      ctx.font = `300 ${fs}px Jost, sans-serif`;
      ctx.textBaseline = "middle";
      const r = orangeSegments(slimQuote, false);
      const tw = Math.min(maxW, r.segs.reduce((a, [t]) => a + ctx.measureText(t).width, 0));
      let xx = W / 2 - tw / 2;
      const yy = 0.37 * H;
      r.segs.forEach(([t, kind]) => {
        ctx.fillStyle = kind === "orange" ? ORANGE : ink;
        ctx.fillText(t, xx, yy);
        xx += ctx.measureText(t).width;
      });
    }
  }

  // elementele utilizatorului — poziții din layout-ul automat
  const layout = computeLayout(els, side, animVbW);
  els.filter(e => e.side === side).forEach(el => {
    const lp = layout[el.id]; if (!lp) return;
    const cx = lp.cx * W, cy = lp.cy * H;
    if (el.type === "text") {
      const fs = el.fs * CANVAS_S;
      ctx.font = `300 ${fs}px Jost, sans-serif`;
      ctx.textBaseline = "middle";
      const lines = (el.text || "").split("\n");
      const lh = fs * 1.4;
      let found = false;
      lines.forEach((ln, i) => {
        const yy = cy + (i - (lines.length - 1) / 2) * lh;
        const r = orangeSegments(ln, found);
        found = found || r.found;
        const tw = r.segs.reduce((a, [t]) => a + ctx.measureText(t).width, 0);
        let xx = cx - tw / 2;
        r.segs.forEach(([t, kind]) => {
          ctx.fillStyle = kind === "orange" ? ORANGE : ink;
          ctx.fillText(t, xx, yy);
          xx += ctx.measureText(t).width;
        });
      });
    } else if (el.type === "anim") {
      const img = imgCache[`anim:${el.animId}:${ink}`];
      if (img) {
        const w = el.wFrac * W;
        const h = w * (ANIM_VB_H / animVbW(el.animId));
        ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
      }
    } else if (el.type === "image") {
      const img = imgCache[el.id];
      if (img) {
        const w = el.wFrac * W;
        const h = w * (img.naturalHeight / img.naturalWidth);
        ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
      }
    }
  });
  return cv;
}

/* ── forma 3D ───────────────────────────────── */
function buildShape3D(product, fit) {
  const p = fitParams(fit);
  const C = 200;
  const X = x => x - 200, Y = y => 215 - y;
  const s = new THREE.Shape();
  if (product === "tee") {
    const neckY = 70, shY = 86 + p.drop;
    s.moveTo(X(C - 34), Y(neckY));
    s.lineTo(X(C - p.sh), Y(shY));
    s.lineTo(X(C - p.sh - p.slv), Y(shY + p.slvDrop + 26));
    s.lineTo(X(C - p.sh - p.slv + 14), Y(shY + p.slvDrop + 62));
    s.lineTo(X(C - p.bw), Y(shY + 78));
    s.lineTo(X(C - p.bw), Y(p.hem));
    s.lineTo(X(C + p.bw), Y(p.hem));
    s.lineTo(X(C + p.bw), Y(shY + 78));
    s.lineTo(X(C + p.sh + p.slv - 14), Y(shY + p.slvDrop + 62));
    s.lineTo(X(C + p.sh + p.slv), Y(shY + p.slvDrop + 26));
    s.lineTo(X(C + p.sh), Y(shY));
    s.lineTo(X(C + 34), Y(neckY));
    s.quadraticCurveTo(X(C), Y(neckY + 14), X(C - 34), Y(neckY));
  } else {
    const shY = 96 + p.drop, hem = p.hem + 8;
    const bw = p.bw + 6, sh = p.sh + 4, slv = p.slv + 6;
    s.moveTo(X(C - 44), Y(84));
    s.lineTo(X(C - sh), Y(shY));
    s.lineTo(X(C - sh - slv), Y(shY + p.slvDrop + 30));
    s.lineTo(X(C - sh - slv + 16), Y(shY + p.slvDrop + 70));
    s.lineTo(X(C - bw), Y(shY + 84));
    s.lineTo(X(C - bw), Y(hem));
    s.lineTo(X(C + bw), Y(hem));
    s.lineTo(X(C + bw), Y(shY + 84));
    s.lineTo(X(C + sh + slv - 16), Y(shY + p.slvDrop + 70));
    s.lineTo(X(C + sh + slv), Y(shY + p.slvDrop + 30));
    s.lineTo(X(C + sh), Y(shY));
    s.lineTo(X(C + 44), Y(84));
    s.quadraticCurveTo(X(C), Y(28), X(C - 44), Y(84)); // gluga
  }
  return s;
}

function normalizeUVs(geo) {
  const pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + 200) / 400, (pos.getY(i) + 215) / 430);
  }
  uv.needsUpdate = true;
}

/* ── viewer 3D ──────────────────────────────── */
function Viewer3D({ product, fit, color, elements, imgCache, slimQuote, hint }) {
  const mountRef = useRef(null);
  const rotRef = useRef({ y: 0.4, x: -0.05, auto: true });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = Math.min(520, Math.max(380, W * 1.05));

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, W / H, 1, 5000);
    camera.position.set(0, 10, 960);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const d1 = new THREE.DirectionalLight(0xffffff, 0.5); d1.position.set(200, 300, 500); scene.add(d1);
    const d2 = new THREE.DirectionalLight(0xffffff, 0.3); d2.position.set(-200, 100, -500); scene.add(d2);

    const group = new THREE.Group();
    scene.add(group);

    // texturi din canvas
    const frontCv = drawSideCanvas({ side: "front", product, fit, color, elements, imgCache, slimQuote });
    const backCv  = drawSideCanvas({ side: "back",  product, fit, color, elements, imgCache, slimQuote });
    const frontTx = new THREE.CanvasTexture(frontCv);
    const backTx  = new THREE.CanvasTexture(backCv);

    const shape = buildShape3D(product, fit);
    const DEPTH = 18;

    const sideGeo = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: false });
    sideGeo.translate(0, 0, -DEPTH / 2);
    const edgeColor = new THREE.Color(color.hex).multiplyScalar(0.82);
    const sideMesh = new THREE.Mesh(sideGeo, new THREE.MeshLambertMaterial({ color: edgeColor }));
    group.add(sideMesh);

    const faceGeoF = new THREE.ShapeGeometry(shape, 16); normalizeUVs(faceGeoF);
    const frontMesh = new THREE.Mesh(faceGeoF, new THREE.MeshLambertMaterial({ map: frontTx }));
    frontMesh.position.z = DEPTH / 2 + 0.6;
    group.add(frontMesh);

    const faceGeoB = faceGeoF.clone();
    const backMesh = new THREE.Mesh(faceGeoB, new THREE.MeshLambertMaterial({ map: backTx }));
    backMesh.rotation.y = Math.PI;
    backMesh.position.z = -DEPTH / 2 - 0.6;
    group.add(backMesh);

    // rotire prin drag
    let dragging = false, lx = 0, ly = 0;
    const down = e => { dragging = true; rotRef.current.auto = false; lx = e.clientX; ly = e.clientY; renderer.domElement.style.cursor = "grabbing"; renderer.domElement.setPointerCapture(e.pointerId); };
    const move = e => {
      if (!dragging) return;
      rotRef.current.y += (e.clientX - lx) * 0.01;
      rotRef.current.x = Math.max(-0.6, Math.min(0.6, rotRef.current.x + (e.clientY - ly) * 0.006));
      lx = e.clientX; ly = e.clientY;
    };
    const up = () => { dragging = false; renderer.domElement.style.cursor = "grab"; };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("pointercancel", up);

    let raf;
    const loop = () => {
      if (rotRef.current.auto) rotRef.current.y += 0.005;
      group.rotation.y = rotRef.current.y;
      group.rotation.x = rotRef.current.x;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("pointerup", up);
      renderer.domElement.removeEventListener("pointercancel", up);
      frontTx.dispose(); backTx.dispose();
      sideGeo.dispose(); faceGeoF.dispose(); faceGeoB.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [product, fit, color, elements, imgCache, slimQuote]);

  return (
    <div>
      <div ref={mountRef} style={{ width: "100%", display: "flex", justifyContent: "center" }} />
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#a8a59c", textAlign: "center", margin: "6px 0 0" }}>
        {hint}
      </p>
    </div>
  );
}

/* ── UI mărunțișuri ─────────────────────────── */
function Opt({ active, onClick, children, style }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 0.3,
      padding: "9px 14px", cursor: "pointer", background: "transparent",
      border: "1px solid", borderColor: active ? "#141414" : "#dddbd5",
      color: active ? "#141414" : "#8a877f",
      borderRadius: 0, ...style,
    }}>{children}</button>
  );
}

function CkSection({ n, title }) {
  return (
    <div style={{
      fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 3.5,
      textTransform: "uppercase", margin: "28px 0 12px",
      display: "flex", gap: 10, alignItems: "baseline",
    }}>
      <span style={{ color: ORANGE, fontSize: 10 }}>{n}</span>{title}
    </div>
  );
}

function Ck({ ph, span, num, value, onChange, type }) {
  return (
    <input
      placeholder={ph}
      inputMode={num ? "numeric" : "text"}
      type={type || "text"}
      {...(value !== undefined ? { value, onChange } : {})}
      style={{
      gridColumn: span ? "1 / -1" : "auto",
      padding: "12px 13px", fontFamily: "'Inter', sans-serif", fontSize: 14,
      border: "1px solid #dddbd5", background: "transparent", borderRadius: 0,
    }} />
  );
}

function SumRow({ label, value, green }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: green ? "#1a7f4e" : "#141414" }}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

function Label({ n, children }) {
  return (
    <div style={{
      fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 3.5,
      textTransform: "uppercase", color: "#141414", margin: "28px 0 12px",
      display: "flex", alignItems: "baseline", gap: 10,
    }}>
      <span style={{ color: ORANGE, fontSize: 10 }}>{n}</span>{children}
    </div>
  );
}

function qualityInfo(w, h, L) {
  const mx = Math.max(w, h);
  if (mx >= 2400) return { label: `${w}×${h} px · ${L.qExc}`, color: "#1a7f4e" };
  if (mx >= 1200) return { label: `${w}×${h} px · ${L.qOk}`, color: "#8a877f" };
  return { label: `${w}×${h} px · ${L.qLow}`, color: "#c0341d" };
}

/* ── aplicația ──────────────────────────────── */
let UID = 1;

export default function App() {
  const [lang, setLang]       = useState("ro");
  const [product, setProduct] = useState("tee");
  const [colorId, setColorId] = useState("black");
  const [fit, setFit]         = useState("oversized");
  const [tab, setTab]         = useState("back"); // front | back | 3d
  const [elements, setElements] = useState([
    { id: 0, side: "back", type: "text", text: "Too aware for small talk.", x: 0.5, y: 0.42, fs: 13, preset: true },
  ]);
  const [activeId, setActiveId] = useState(0);
  const [imgCache, setImgCache] = useState({});
  const [slimQuote, setSlimQuote] = useState(SLIM_QUOTES[0]);
  const [slimMode, setSlimMode] = useState("preset");
  const [slimCustom, setSlimCustom] = useState("");
  const [size, setSize] = useState("M");
  const [qty, setQty]   = useState(1);
  const [added, setAdded] = useState(false);
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [prodLine, setProdLine] = useState("unisex");
  const [view, setView] = useState("studio"); // studio (catalog) | checkout
  const [cart, setCart] = useState([]);
  const [selId, setSelId] = useState(CATALOG[0].id); // produsul din catalog vizionat
  const [col, setCol] = useState(null); // colecția deschisă: null = hub | summer | winter | sport
  const [payMethod, setPayMethod] = useState("card");
  const [payState, setPayState] = useState("idle"); // idle | processing | done
  const [payErr, setPayErr] = useState("");
  const [form, setForm] = useState({
    email: "", fullName: "", phone: "", street: "", city: "", county: "", zip: "",
  });
  const setField = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const [cur, setCur] = useState("RON");
  const [account, setAccount] = useState(false);
  const [accMode, setAccMode] = useState("create"); // create | login | guest
  const [custType, setCustType] = useState("person"); // person | company
  const [shipMethod, setShipMethod] = useState("sameday");
  const [billSame, setBillSame] = useState(true);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState(null);
  const [promoErr, setPromoErr] = useState(false);
  const fmt = (lei) => money(lei, cur);
  const [stageW, setStageW] = useState(STAGE_W);

  const stageRef = useRef(null);
  const fileRef  = useRef(null);
  const dragRef  = useRef(null);

  const L = T[lang];
  const color = GARMENT_COLORS.find(c => c.id === colorId);
  const prod  = PRODUCTS.find(p => p.id === product);
  const fits  = FITS_BY_PRODUCT[product];
  const sizes = SIZES_BY_PRODUCT[product];
  const p     = fitParams(fit);
  const bp    = brandingPos(product, fit);
  const active = elements.find(e => e.id === activeId) || null;
  const isSlim = fit === "slim";
  const slimText = slimMode === "custom" ? (slimCustom || L.slimDefault) : slimQuote;
  const scale  = stageW / STAGE_W;
  const unitPrice = PRICES[product][fit] || PRICES[product].regular;
  const customCost = customizationCost(elements, isSlim, slimMode);
  const total = (unitPrice + customCost) * qty;
  const cartCount = cart.reduce((a, it) => a + it.qty, 0);
  const shipCost = shipMethod === "dhl" ? 89 : 19;
  const calc = computeCart(cart, { account: account && accMode === "create", promo, shipCost });

  /* ── catalog: produsul selectat (din colecția activă) + opțiuni valide ── */
  const colItems = col ? CATALOG.filter(c => c.collection === col) : CATALOG;
  const item = colItems.find(c => c.id === selId) || colItems[0] || CATALOG[0];
  const availColors = GARMENT_COLORS.filter(c => item.colors.includes(c.id));
  const curColorId = item.colors.includes(colorId) ? colorId : item.colors[0];
  const curColor = GARMENT_COLORS.find(c => c.id === curColorId) || GARMENT_COLORS[0];
  const availSizes = SIZES_BY_PRODUCT[item.product];
  const curSize = availSizes.includes(size) ? size : availSizes[0];
  const itemImg = item.img ? item.img[curColorId] : null;

  const addCatalog = () => {
    setCart(c => [...c, {
      id: UID++, product: item.product, catId: item.id,
      colorId: curColorId, size: curSize, qty,
      unitPrice: item.price, customCost: 0, total: item.price * qty,
    }]);
    setShowAddedModal(true);
  };

  const openCol = (id) => {
    setCol(id);
    const first = CATALOG.find(c => c.collection === id);
    if (first) setSelId(first.id);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  /* ── temă UI adaptivă peste fundalul colecției ── */
  const inCollection = view !== "checkout" && !!col;
  const darkUI = inCollection && (col === "winter" || col === "sport");
  const headerBg = !inCollection ? "transparent"
    : col === "summer" ? "rgba(255,240,214,0.45)" : "rgba(14,11,9,0.42)";
  const uiText = darkUI ? "#FAFAF8" : "#141414";
  const uiMuted = darkUI ? "rgba(250,250,248,0.72)" : "#8a877f";
  const uiBorder = darkUI ? "rgba(250,250,248,0.4)" : "#dddbd5";
  const logoSrc = darkUI ? "/brand/logo-white.png" : "/brand/logo-black.png";

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) { setPromo(code); setPromoErr(false); }
    else { setPromo(null); setPromoErr(true); }
  };

  const addToCart = () => {
    setCart(c => [...c, {
      id: UID++, product, fit, colorId, size, qty,
      unitPrice, customCost, total: (unitPrice + customCost) * qty,
    }]);
    setShowAddedModal(true);
  };

  const startPay = async () => {
    setPayErr("");
    // validare minimă pentru plata reală
    const email = form.email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setPayErr(lang === "ro" ? "Introdu un email valid." : "Enter a valid email.");
      return;
    }
    if (!form.fullName.trim()) {
      setPayErr(lang === "ro" ? "Completează numele complet." : "Enter your full name.");
      return;
    }

    setPayState("processing");
    const [firstName, ...rest] = form.fullName.trim().split(/\s+/);
    const lastName = rest.join(" ") || firstName;
    // sumă în valuta afișată (aceeași conversie ca UI-ul)
    const amount = Math.round(calc.grand * CURRENCIES[cur].rate);

    try {
      const res = await fetch("/api/netopia/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: cur,
          language: lang,
          billing: {
            email, firstName, lastName,
            phone: form.phone.trim(),
            city: form.city.trim(),
            state: form.county.trim(),
            address: form.street.trim(),
            postalCode: form.zip.trim(),
          },
        }),
      });
      const data = await res.json();

      if (!data.ok) {
        setPayState("idle");
        setPayErr(lang === "ro"
          ? "Plata nu a putut fi inițiată. Încearcă din nou."
          : "Payment could not be started. Please try again.");
        return;
      }
      if (data.paymentURL) {
        // redirect către pagina securizată Netopia
        window.location.href = data.paymentURL;
        return;
      }
      // mod demo (Netopia neconfigurat) → confirmare locală
      setPayState("done");
    } catch {
      setPayState("idle");
      setPayErr(lang === "ro" ? "Eroare de rețea. Încearcă din nou." : "Network error. Please try again.");
    }
  };

  const resetOrder = () => {
    setCart([]); setPayState("idle"); setPayErr(""); setView("studio");
  };

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStageW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [tab]);

  const patch = (id, fn) => setElements(els => els.map(e => e.id === id ? { ...e, ...fn(e) } : e));

  const addText = (text) => {
    const id = UID++;
    const side = tab === "3d" ? "back" : tab;
    // un singur text pe fiecare parte — modelul ales îl înlocuiește pe cel curent
    setElements(els => [
      ...els.filter(e => !(e.type === "text" && e.side === side)),
      { id, side, type: "text", text: text || L.defaultText, x: 0.5, y: 0.45, fs: 13, preset: !!text },
    ]);
    setActiveId(id);
    if (tab === "3d") setTab(side);
  };

  const addAnim = (animId) => {
    const id = UID++;
    const side = tab === "3d" ? "back" : tab;
    // o singură animație pe fiecare parte
    setElements(els => [
      ...els.filter(e => !(e.type === "anim" && e.side === side)),
      { id, side, type: "anim", animId, x: 0.5, y: 0.38, wFrac: 0.5 },
    ]);
    setActiveId(id);
    if (tab === "3d") setTab(side);
  };

  // preîncarc varianta statică a animațiilor pentru textura 3D (per culoarea cernelii)
  useEffect(() => {
    elements.filter(e => e.type === "anim").forEach(el => {
      const key = `anim:${el.animId}:${color.ink}`;
      if (!imgCache[key]) {
        const img = new Image();
        img.onload = () => setImgCache(c => ({ ...c, [key]: img }));
        img.src = animSvgUrl(el.animId, color.ink, false);
      }
    });
  }, [elements, color, imgCache]);

  const onUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const id = UID++;
        const side = tab === "3d" ? "back" : tab;
        setImgCache(c => ({ ...c, [id]: img }));
        setElements(els => [
          ...els.filter(e => !(e.type === "image" && e.side === side)),
          { id, side, type: "image", x: 0.5, y: 0.4, wFrac: 0.38,
            natW: img.naturalWidth, natH: img.naturalHeight },
        ]);
        setActiveId(id);
        if (tab === "3d") setTab(side);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeActive = () => {
    if (!active) return;
    setElements(els => els.filter(e => e.id !== active.id));
    setActiveId(null);
  };

  /* selectare la click — pozițiile sunt fixe (layout automat), fără drag */
  const selectEl = (e, id) => { e.stopPropagation(); setActiveId(id); };

  const line = color.dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)";
  const sideElements = elements.filter(e => e.side === tab);
  const layout = computeLayout(elements, tab, animVbW);

  return (
    <div style={{ background: inCollection ? "transparent" : "#FAFAF8", minHeight: "100vh", color: "#141414" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400&family=Inter:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        input:focus, textarea:focus, button:focus-visible { outline: 2px solid ${ORANGE}; outline-offset: 2px; }
        button:hover { border-color: #141414 !important; }
        @media (max-width: 880px) { .cfg { grid-template-columns: 1fr !important; } .stick { position: static !important; } }
        .ovr-stage, .ovr-stage * { touch-action: none !important; -ms-touch-action: none !important; }

        /* ── animații subtile ── */
        @keyframes ovrRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes ovrFade { from { opacity: 0; transform: scale(1.015); } to { opacity: 1; transform: none; } }
        @keyframes ovrPop  { 0% { transform: scale(1); } 45% { transform: scale(1.12); } 100% { transform: scale(1); } }
        .ovr-rise   { animation: ovrRise .6s cubic-bezier(.2,.7,.2,1) both; }
        .ovr-rise-2 { animation: ovrRise .6s cubic-bezier(.2,.7,.2,1) .12s both; }
        .ovr-fade   { animation: ovrFade .5s ease both; }
        .ovr-cta    { transition: background .25s ease, color .25s ease, transform .12s ease; }
        .ovr-cta:hover  { background: ${ORANGE} !important; color: #141414 !important; border-color: ${ORANGE} !important; }
        .ovr-cta:active { transform: translateY(1px); }
        .ovr-thumb  { transition: transform .22s ease, border-color .22s ease; }
        .ovr-thumb:hover { transform: translateY(-3px); }
        .ovr-opt    { transition: background .18s ease, color .18s ease, border-color .18s ease; }
        .ovr-pop    { animation: ovrPop .45s ease; }
        @media (prefers-reduced-motion: reduce) {
          .ovr-rise, .ovr-rise-2, .ovr-fade, .ovr-pop { animation: none !important; }
          .ovr-cta, .ovr-thumb, .ovr-opt { transition: none !important; }
        }
      `}</style>

      {/* header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 5vw", gap: 12, flexWrap: "wrap",
        background: inCollection ? headerBg : "rgba(250,250,248,0.85)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        borderBottom: `1px solid ${darkUI ? "rgba(250,250,248,0.15)" : "#e7e5df"}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src={logoSrc} alt="OVRTHINK" style={{ height: 22, width: "auto", display: "block" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 0, border: `1px solid ${uiBorder}` }}>
            {["ro", "en"].map(lg => (
              <button key={lg} onClick={() => setLang(lg)} style={{
                fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                padding: "7px 12px", cursor: "pointer", border: "none", borderRadius: 0,
                background: lang === lg ? (darkUI ? "#FAFAF8" : "#141414") : "transparent",
                color: lang === lg ? (darkUI ? "#141414" : "#FAFAF8") : uiMuted,
              }}>{lg}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 0, border: `1px solid ${uiBorder}` }}>
            {["RON", "EUR", "USD"].map(cc => (
              <button key={cc} onClick={() => setCur(cc)} style={{
                fontFamily: "'Jost', sans-serif", fontSize: 10.5, letterSpacing: 1, textTransform: "uppercase",
                padding: "7px 9px", cursor: "pointer", border: "none", borderRadius: 0,
                background: cur === cc ? (darkUI ? "#FAFAF8" : "#141414") : "transparent",
                color: cur === cc ? (darkUI ? "#141414" : "#FAFAF8") : uiMuted,
              }}>{cc}</button>
            ))}
          </div>
          <button onClick={() => { setView(view === "checkout" ? "studio" : "checkout"); setPayState("idle"); }} style={{
            fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
            padding: "8px 14px", cursor: "pointer", borderRadius: 0,
            border: `1px solid ${uiText}`, display: "flex", alignItems: "center", gap: 7,
            background: cartCount > 0 ? ORANGE : (view === "checkout" ? "#141414" : "transparent"),
            color: cartCount > 0 ? "#FAFAF8" : (view === "checkout" ? "#FAFAF8" : uiText),
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 6 H20 L18.5 16 H6 Z M4 6 L3 3 H1.5" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx="8" cy="20" r="1.3" fill="currentColor" stroke="none" />
              <circle cx="16.5" cy="20" r="1.3" fill="currentColor" stroke="none" />
            </svg>
            {L.cart} ({cartCount})
          </button>
        </div>
      </header>

      {view === "checkout" ? (
        <main style={{ maxWidth: 680, margin: "0 auto", padding: "44px 5vw 90px" }}>
          <h1 style={{
            fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 30,
            letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 26px",
          }}>{L.checkoutTitle}</h1>

          {payState === "done" ? (
            <div style={{ border: "1px solid #e7e5df", padding: "44px 28px", textAlign: "center" }}>
              <svg width="52" height="52" viewBox="0 0 52 52" style={{ margin: "0 auto 16px", display: "block" }}>
                <circle cx="26" cy="26" r="24" fill="none" stroke={ORANGE} strokeWidth="2" />
                <path d="M16 27 L23 34 L37 19" fill="none" stroke="#141414" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 18, letterSpacing: 3, textTransform: "uppercase" }}>{L.orderOk}</div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8a877f", marginTop: 10 }}>{L.orderOkSub}</p>
              <button onClick={resetOrder} style={{
                marginTop: 22, fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase",
                padding: "14px 28px", cursor: "pointer", border: "none", borderRadius: 0, background: "#141414", color: "#FAFAF8",
              }}>{L.newOrder}</button>
            </div>
          ) : cart.length === 0 ? (
            <div style={{ border: "1px solid #e7e5df", padding: "44px 28px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#8a877f", margin: 0 }}>{L.emptyCart}</p>
              <button onClick={() => setView("studio")} style={{
                marginTop: 18, fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase",
                padding: "13px 26px", cursor: "pointer", border: "1px solid #141414", borderRadius: 0, background: "transparent",
              }}>{L.backStudio}</button>
            </div>
          ) : (
            <>
              {/* articole */}
              <div style={{ borderTop: "1px solid #e7e5df" }}>
                {cart.map(it => {
                  const c = GARMENT_COLORS.find(x => x.id === it.colorId);
                  const pr = PRODUCTS.find(x => x.id === it.product);
                  const ci = CATALOG.find(x => x.id === it.catId);
                  const itemName = ci ? ci.name[lang] : pr.name[lang];
                  return (
                    <div key={it.id} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "16px 0", borderBottom: "1px solid #e7e5df",
                    }}>
                      <span style={{ width: 22, height: 22, borderRadius: "50%", background: c.hex, border: "1px solid #d4d1c9", flexShrink: 0 }} />
                      <div style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: 13.5 }}>
                        <div>{itemName} · {pr.name[lang]} · {c.name[lang]} · {it.size} × {it.qty} {L.pcs}</div>
                        <div style={{ fontSize: 11.5, color: "#a8a59c", marginTop: 2 }}>{fmt(it.unitPrice)} × {it.qty}{it.customCost > 0 ? ` + ${fmt(it.customCost)}` : ""}</div>
                      </div>
                      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 15 }}>{fmt(it.total)}</span>
                      <button onClick={() => setCart(cs => cs.filter(x => x.id !== it.id))} aria-label={L.remove} style={{
                        border: "none", background: "transparent", cursor: "pointer", color: "#c0341d",
                        fontFamily: "'Inter', sans-serif", fontSize: 16, padding: 4,
                      }}>×</button>
                    </div>
                  );
                })}
              </div>

              {/* oferte active */}
              <CkSection n="01" title={L.offersTitle} />
              <div style={{ border: "1px solid #e7e5df", padding: "14px 16px", fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.9 }}>
                <div>· {L.offer1}</div><div>· {L.offer2}</div><div>· {L.offer3}</div>
                <div style={{ fontSize: 11.5, color: "#a8a59c", marginTop: 6 }}>{L.bundleHint}</div>
              </div>

              {/* cont */}
              <CkSection n="02" title={L.contactInfo} />
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <Opt active={accMode === "create"} onClick={() => { setAccMode("create"); setAccount(true); }}>{L.createAccount}</Opt>
                <Opt active={accMode === "login"} onClick={() => { setAccMode("login"); setAccount(true); }}>{L.haveAccount}</Opt>
                <Opt active={accMode === "guest"} onClick={() => { setAccMode("guest"); setAccount(false); }}>{L.guest}</Opt>
              </div>
              {accMode === "create" && (
                <div style={{ background: "#f6f0e9", border: `1px solid ${ORANGE}`, padding: "10px 14px", marginBottom: 12, fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#7a5230" }}>
                  {L.createAccountNote}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Ck ph={L.email} span type="email" value={form.email} onChange={setField("email")} />
                {accMode !== "guest" && <Ck ph={L.password} span type="password" />}
                <Ck ph={L.fullName} value={form.fullName} onChange={setField("fullName")} />
                <Ck ph={L.phone} value={form.phone} onChange={setField("phone")} />
              </div>

              {/* facturare PF/PJ */}
              <CkSection n="03" title={L.billAddr} />
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <Opt active={custType === "person"} onClick={() => setCustType("person")}>{L.person}</Opt>
                <Opt active={custType === "company"} onClick={() => setCustType("company")}>{L.company}</Opt>
              </div>
              {custType === "company" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <Ck ph={L.companyName} span /><Ck ph={L.cui} /><Ck ph={L.regCom} />
                </div>
              )}

              {/* adresă livrare */}
              <CkSection n="04" title={L.shipAddr} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Ck ph={L.street} span value={form.street} onChange={setField("street")} />
                <Ck ph={L.city} value={form.city} onChange={setField("city")} />
                <Ck ph={L.county} value={form.county} onChange={setField("county")} />
                <Ck ph={L.zip} value={form.zip} onChange={setField("zip")} /><Ck ph={L.country} />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontFamily: "'Inter', sans-serif", fontSize: 13, cursor: "pointer" }}>
                <input type="checkbox" checked={billSame} onChange={e => setBillSame(e.target.checked)} />
                {L.sameAsShip}
              </label>
              {!billSame && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                  <Ck ph={L.street} span /><Ck ph={L.city} /><Ck ph={L.county} />
                  <Ck ph={L.zip} /><Ck ph={L.country} />
                </div>
              )}

              {/* metodă livrare */}
              <CkSection n="05" title={L.shipMethod} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[["sameday", L.sameday, L.samedayNote, 19], ["dhl", L.dhl, L.dhlNote, 89]].map(([id, lbl, note, cost]) => (
                  <Opt key={id} active={shipMethod === id} onClick={() => setShipMethod(id)} style={{ textAlign: "left", padding: "12px 14px" }}>
                    <span style={{ display: "block", fontWeight: 500 }}>{lbl}</span>
                    <span style={{ display: "block", fontSize: 11.5, color: "#a8a59c", marginTop: 2 }}>{note} · {fmt(cost)}</span>
                  </Opt>
                ))}
              </div>

              {/* cod reducere */}
              <CkSection n="06" title={L.promoLabel} />
              <div style={{ display: "flex", gap: 8 }}>
                <input value={promoInput} onChange={e => setPromoInput(e.target.value)}
                  placeholder={L.promoLabel}
                  style={{ flex: 1, padding: "12px 13px", fontFamily: "'Inter', sans-serif", fontSize: 14, border: "1px solid #dddbd5", background: "transparent", borderRadius: 0 }} />
                <Opt onClick={applyPromo} style={{ borderColor: "#141414" }}>{L.promoApply}</Opt>
              </div>
              {promo && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#1a7f4e", marginTop: 6 }}>{L.promoOk}: {PROMO_CODES[promo].label}</div>}
              {promoErr && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#c0341d", marginTop: 6 }}>{L.promoBad}</div>}

              {/* metodă plată */}
              <CkSection n="07" title={L.payMethod} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  ["applepay", <span key="a" style={{ fontWeight: 500 }}>&#63743; Pay</span>],
                  ["googlepay", <span key="g"><span style={{ fontWeight: 500 }}>G</span> Pay</span>],
                  ["card", L.cardLabel],
                  ["paypal", <span key="p" style={{ fontStyle: "italic", fontWeight: 500 }}>Pay<span style={{ color: ORANGE }}>Pal</span></span>],
                ].map(([id, label]) => (
                  <Opt key={id} active={payMethod === id} onClick={() => setPayMethod(id)}
                    style={{ padding: "14px 16px", textAlign: "center", fontSize: 14 }}>
                    {label}
                  </Opt>
                ))}
              </div>
              {payMethod === "card" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                  <Ck ph={L.cardNo} span num /><Ck ph={L.cardExp} num /><Ck ph={L.cardCvc} num /><Ck ph={L.cardName} span />
                </div>
              )}

              {/* sumar */}
              <div style={{ borderTop: "1px solid #e7e5df", marginTop: 28, paddingTop: 18, fontFamily: "'Inter', sans-serif", fontSize: 13.5 }}>
                <SumRow label={L.subtotal} value={fmt(calc.subtotal)} />
                {calc.freeTees > 0 && <SumRow label={L.bundleFree(calc.freeTees)} value={`− ${fmt(calc.bundleDiscount)}`} green />}
                {calc.accountDiscount > 0 && <SumRow label={L.accountDisc} value={`− ${fmt(calc.accountDiscount)}`} green />}
                {calc.promoDiscount > 0 && <SumRow label={`${L.discount} (${PROMO_CODES[promo].label})`} value={`− ${fmt(calc.promoDiscount)}`} green />}
                <SumRow label={L.shipping} value={calc.freeShip ? L.freeShipLabel : fmt(calc.ship)} />
                <div style={{ borderTop: "1px dashed #e0ddd5", marginTop: 6, paddingTop: 6 }}>
                  <SumRow label={L.netLabel} value={fmt(calc.net)} />
                  <SumRow label={L.vatLabel} value={fmt(calc.vat)} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 12, paddingTop: 12, borderTop: "1px solid #e7e5df" }}>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "#8a877f" }}>{L.total}</span>
                <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 30 }}>{fmt(calc.grand)}</span>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#a8a59c", textAlign: "right", marginTop: 4 }}>{L.vatIncluded}</div>

              <button onClick={startPay} disabled={payState === "processing"} style={{
                width: "100%", marginTop: 20,
                fontFamily: "'Jost', sans-serif", fontSize: 13, letterSpacing: 3.5, textTransform: "uppercase",
                padding: "18px 0", cursor: payState === "processing" ? "wait" : "pointer",
                border: "none", borderRadius: 0, background: "#141414", color: "#FAFAF8",
                opacity: payState === "processing" ? 0.7 : 1,
              }}>
                {payState === "processing" ? L.processing : `${lang === "ro" ? "Plătește" : "Pay"} ${fmt(calc.grand)}`}
              </button>
              {payErr && (
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#c0392b", marginTop: 10, textAlign: "center" }}>
                  {payErr}
                </p>
              )}
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#a8a59c", marginTop: 12, textAlign: "center" }}>
                {L.demoNote}
              </p>
              <button onClick={() => setView("studio")} style={{
                marginTop: 8, fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase",
                border: "none", background: "transparent", cursor: "pointer", color: "#8a877f", display: "block", margin: "8px auto 0",
              }}>{L.backStudio}</button>
            </>
          )}
        </main>
      ) : (
      <main className="cfg" style={{
        display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: "4vw",
        padding: "34px 5vw 90px", maxWidth: 1240, margin: "0 auto", alignItems: "start",
      }}>
        {/* stânga: mockup mare + selectorul colecției */}
        <div className="stick ovr-rise" style={{ position: "sticky", top: 20 }}>
          <div key={item.id + curColorId} className="ovr-fade" style={{
            position: "relative", width: "100%", aspectRatio: "4 / 5",
            background: curColor.hex, display: "flex", alignItems: "center",
            justifyContent: "center", overflow: "hidden",
          }}>
            {itemImg ? (
              <img src={itemImg} alt={item.name[lang]} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ textAlign: "center", padding: 24 }}>
                <img src={curColor.dark ? "/brand/logo-white.png" : "/brand/logo-black.png"} alt="OVRTHINK"
                  style={{ width: "48%", maxWidth: 190, opacity: 0.9, display: "block", margin: "0 auto" }} />
                <div style={{ marginTop: 16, fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: curColor.ink, opacity: 0.5 }}>
                  {lang === "ro" ? "Mockup în curând" : "Mockup coming soon"}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(62px, 1fr))", gap: 8, marginTop: 12 }}>
            {colItems.map(ci => {
              const c0 = GARMENT_COLORS.find(g => g.id === ci.colors[0]) || GARMENT_COLORS[0];
              const active = ci.id === item.id;
              const thumb = ci.img ? ci.img[ci.colors[0]] : null;
              return (
                <button key={ci.id} onClick={() => setSelId(ci.id)} aria-label={ci.name[lang]} className="ovr-thumb" style={{
                  aspectRatio: "1 / 1", background: c0.hex, cursor: "pointer", padding: 0, overflow: "hidden",
                  border: active ? `2px solid ${ORANGE}` : "1px solid #dddbd5", borderRadius: 0,
                }}>
                  {thumb ? (
                    <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  ) : (
                    <img src={c0.dark ? "/brand/monogram-white.png" : "/brand/monogram-black.png"} alt=""
                      style={{ width: "56%", margin: "22% auto", display: "block", opacity: 0.8 }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* dreapta: detalii produs + opțiuni */}
        <div className="ovr-rise-2">
          <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 3.5, textTransform: "uppercase", color: "#a8a59c" }}>
            {PRODUCTS.find(p => p.id === item.product).name[lang]}
          </div>
          <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 34, letterSpacing: "0.04em", margin: "6px 0 6px" }}>
            {item.name[lang]}
          </h1>
          <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 24 }}>{fmt(item.price)}</div>

          <div style={{ marginTop: 30, fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#8a877f", marginBottom: 10 }}>
            {lang === "ro" ? "Culoare" : "Color"} · {curColor.name[lang]}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {availColors.map(c => (
              <button key={c.id} onClick={() => setColorId(c.id)} aria-label={c.name[lang]} className="ovr-opt" style={{
                width: 34, height: 34, borderRadius: "50%", background: c.hex, cursor: "pointer",
                border: c.id === curColorId ? `2px solid ${ORANGE}` : "1px solid #d4d1c9",
              }} />
            ))}
          </div>

          <div style={{ marginTop: 26, fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#8a877f", marginBottom: 10 }}>
            {lang === "ro" ? "Mărime" : "Size"}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {availSizes.map(s => (
              <button key={s} onClick={() => setSize(s)} className="ovr-opt" style={{
                minWidth: 46, padding: "11px 0", cursor: "pointer", borderRadius: 0,
                fontFamily: "'Jost', sans-serif", fontSize: 13, letterSpacing: 1,
                border: s === curSize ? "1px solid #141414" : "1px solid #dddbd5",
                background: s === curSize ? "#141414" : "transparent",
                color: s === curSize ? "#FAFAF8" : "#141414",
              }}>{s}</button>
            ))}
          </div>

          <div style={{ marginTop: 26, fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#8a877f", marginBottom: 10 }}>
            {lang === "ro" ? "Cantitate" : "Quantity"}
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #dddbd5" }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: "10px 16px", cursor: "pointer", border: "none", background: "transparent", fontSize: 16 }}>−</button>
            <span style={{ minWidth: 34, textAlign: "center", fontFamily: "'Jost', sans-serif", fontSize: 15 }}>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} style={{ padding: "10px 16px", cursor: "pointer", border: "none", background: "transparent", fontSize: 16 }}>+</button>
          </div>

          <button onClick={addCatalog} className="ovr-cta" style={{
            width: "100%", marginTop: 30,
            fontFamily: "'Jost', sans-serif", fontSize: 13, letterSpacing: 3.5, textTransform: "uppercase",
            padding: "18px 0", cursor: "pointer", border: "1px solid #141414", borderRadius: 0, background: "#141414", color: "#FAFAF8",
          }}>
            {L.addCart} · {fmt(item.price * qty)}
          </button>

          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#a8a59c", marginTop: 16, lineHeight: 1.7 }}>
            {L.footerMat}
          </p>
        </div>
      </main>
      )}

      {showAddedModal && (
        <div onClick={() => setShowAddedModal(false)} style={{
          position: "fixed", inset: 0, background: "rgba(20,20,20,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 50,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#FAFAF8", maxWidth: 360, width: "100%", padding: "32px 26px", textAlign: "center",
          }}>
            <svg width="44" height="44" viewBox="0 0 52 52" style={{ margin: "0 auto 14px", display: "block" }}>
              <circle cx="26" cy="26" r="24" fill="none" stroke={ORANGE} strokeWidth="2" />
              <path d="M16 27 L23 34 L37 19" fill="none" stroke="#141414" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 15, letterSpacing: 2.5, textTransform: "uppercase" }}>{L.addedToCart}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 22 }}>
              <button onClick={() => { setShowAddedModal(false); setView("checkout"); setPayState("idle"); }} style={{
                fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase",
                padding: "15px 0", cursor: "pointer", border: "none", borderRadius: 0, background: "#141414", color: "#FAFAF8",
              }}>{L.viewCart} ({cartCount})</button>
              <button onClick={() => setShowAddedModal(false)} style={{
                fontFamily: "'Jost', sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase",
                padding: "15px 0", cursor: "pointer", border: "1px solid #141414", borderRadius: 0, background: "transparent", color: "#141414",
              }}>{L.keepShopping}</button>
            </div>
          </div>
        </div>
      )}

      <footer style={{
        borderTop: "1px solid #e7e5df", padding: "26px 5vw",
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
        fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 3, color: "#a8a59c", textTransform: "uppercase",
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
          <img src="/brand/logo-black.png" alt="OVRTHINK" style={{ height: 13, width: "auto", display: "block", opacity: 0.85 }} />
        </span>
        <span>{L.footerMat}</span>
      </footer>
    </div>
  );
}
