/* ─────────────────────────────────────────────
   OVRTHINK — CATALOG DE PRODUSE
   Colecția STREETWEAR (mockup-uri v3: podium portocaliu + inel luminos).
   Tricouri albe și negre, print pe față sau spate. Fiecare produs are un
   `hero` = latura cu designul. Latura fără print folosește blank-ul din
   aceeași culoare (tee-blank-<culoare>-<latura>.jpg).
   Adaugi un model: pui mockup-ul în public/catalog/ și o intrare mai jos.
   ───────────────────────────────────────────── */

const TEE_PRICE = 149;
const BLANK = {
  white: { front: "/catalog/tee-blank-white-front.jpg", back: "/catalog/tee-blank-white-back.jpg" },
  black: { front: "/catalog/tee-blank-black-front.jpg", back: "/catalog/tee-blank-black-back.jpg" },
};

/* un tricou dintr-o singură culoare, cu designul pe `side` (front|back) */
function tee(id, name, color, side, file) {
  const design = `/catalog/${file}`;
  return {
    id, collection: "streetwear", product: "tee", hero: side,
    name: { ro: name, en: name }, price: TEE_PRICE, colors: [color],
    img:     { [color]: side === "front" ? design : BLANK[color].front },
    imgBack: { [color]: side === "back"  ? design : BLANK[color].back },
  };
}

export const CATALOG = [
  /* ALBE — print pe față */
  tee("antisocial",    "ANTISOCIAL",         "white", "front", "tee-antisocial.jpg"),
  tee("under-ctrl",    "UNDER CTRL",         "white", "front", "tee-under-ctrl.jpg"),
  tee("introvert",     "INTROVERT",          "white", "front", "tee-introvert.jpg"),
  tee("good-bad",      "GOOD / BAD",         "white", "front", "tee-good-bad.jpg"),
  tee("llama",         "NO PROB-LLAMA",      "white", "front", "tee-llama.jpg"),
  tee("one-of-a-kind", "ONE OF A KIND",      "white", "front", "tee-one-of-a-kind.jpg"),
  tee("padel",         "PADEL",              "white", "front", "tee-padel.jpg"),
  tee("university",    "UNIVERSITY",         "white", "front", "tee-university.jpg"),

  /* ALBE — print pe spate */
  tee("cin-cin",       "CIN CIN",            "white", "back",  "tee-cin-cin-back.jpg"),
  tee("amalfi",        "AMALFI",             "white", "back",  "tee-amalfi-back.jpg"),
  tee("margarita",     "MARGARITA",          "white", "back",  "tee-margarita-back.jpg"),
  tee("tequila",       "TEQUILA",            "white", "back",  "tee-tequila-back.jpg"),
  tee("take-risks",    "TAKE RISKS",         "white", "back",  "tee-take-risks-back.jpg"),

  /* MAKE THINGS HAPPEN — spate, disponibil alb + negru */
  {
    id: "make-things-happen", collection: "streetwear", product: "tee", hero: "back",
    name: { ro: "MAKE THINGS HAPPEN", en: "MAKE THINGS HAPPEN" }, price: TEE_PRICE,
    colors: ["white", "black"],
    img:     { white: BLANK.white.front, black: BLANK.black.front },
    imgBack: { white: "/catalog/tee-make-things-happen-back.jpg", black: "/catalog/tee-make-things-happen-black-back.jpg" },
  },

  /* NEGRE — print pe față */
  tee("unlimited",     "UNLIMITED",          "black", "front", "tee-unlimited.jpg"),
  tee("drip",          "DRIP",               "black", "front", "tee-drip.jpg"),
  tee("focus",         "FOCUS",              "black", "front", "tee-focus.jpg"),

  /* NEGRE — print pe spate */
  tee("believe",       "BELIEVE IN YOURSELF", "black", "back", "tee-believe-back.jpg"),
  tee("perspective",   "PERSPECTIVE",        "black", "back",  "tee-perspective-back.jpg"),

  /* Hoodie — mockup-uri placeholder, de înlocuit mai târziu cu produsele reale */
  {
    id: "hoodie", collection: "winter", product: "hoodie", hero: "front",
    name: { ro: "Hoodie OVRTHINK", en: "OVRTHINK Hoodie" }, price: 329,
    colors: ["black", "white"],
    img: { black: "/catalog/hoodie-black.png", white: "/catalog/hoodie-white.png" },
    imgBack: { black: "/catalog/hoodie-black-back.png", white: "/catalog/hoodie-white-back.png" },
  },
];
