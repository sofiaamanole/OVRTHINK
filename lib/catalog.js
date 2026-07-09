/* ─────────────────────────────────────────────
   OVRTHINK — CATALOG DE PRODUSE
   Fiecare produs: nume, preț, culori (negru/alb) și mockup-uri
   (față). Backurile sunt în public/catalog/*-back.jpg pt viitor.
   Adaugi un model nou: pui mockup-urile în public/catalog/ și adaugi
   o intrare mai jos.
   ───────────────────────────────────────────── */

export const CATALOG = [
  {
    id: "tee",
    collection: "summer",
    product: "tee",
    name: { ro: "Tricou OVRTHINK", en: "OVRTHINK Tee" },
    price: 189,
    colors: ["black", "white"],
    img: { black: "/catalog/tee-black.png", white: "/catalog/tee-white.png" },
    imgBack: { black: "/catalog/tee-black-back.png", white: "/catalog/tee-white-back.png" },
  },
  {
    id: "hoodie",
    collection: "winter",
    product: "hoodie",
    name: { ro: "Hoodie OVRTHINK", en: "OVRTHINK Hoodie" },
    price: 329,
    colors: ["black", "white"],
    img: { black: "/catalog/hoodie-black.png", white: "/catalog/hoodie-white.png" },
    imgBack: { black: "/catalog/hoodie-black-back.png", white: "/catalog/hoodie-white-back.png" },
  },
];
