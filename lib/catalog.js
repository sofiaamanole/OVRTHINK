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

const HOODIE_PRICE = 249;
/* spatele hanoracelor e identic (blank cu wordmark), diferă doar culoarea */
const HOODIE_BACK = {
  white: "/catalog/hoodie-blank-white-back.jpg",
  black: "/catalog/hoodie-blank-black-back.jpg",
};
/* un hanorac (print pe față), disponibil în una sau ambele culori.
   imgs = { black?: "fisier.jpg", white?: "fisier.jpg" } din public/catalog/.
   Spatele = blank-ul comun al culorii (același la toate). */
function hoodie(id, name, imgs) {
  const colors = Object.keys(imgs);
  const img = {}, imgBack = {};
  colors.forEach(c => { img[c] = `/catalog/${imgs[c]}`; imgBack[c] = HOODIE_BACK[c]; });
  return {
    id, collection: "winter", product: "hoodie", hero: "front",
    name: { ro: name, en: name }, price: HOODIE_PRICE, colors, img, imgBack,
  };
}

export const CATALOG = [
  /* ALBE — print pe față (noile intrări sunt primele în grilă) */
  tee("dont-like-me",     "DON'T LIKE ME",     "white", "front", "tee-dont-like-me.jpg"),
  tee("no-means-no",      "NO MEANS NO",       "white", "front", "tee-no-means-no.jpg"),
  tee("go-get-that-dream","GO GET THAT DREAM", "white", "front", "tee-go-get-that-dream.jpg"),
  tee("antisocial",    "ANTISOCIAL",         "white", "front", "tee-antisocial.jpg"),
  tee("under-ctrl",    "UNDER CTRL",         "white", "front", "tee-under-ctrl.jpg"),
  tee("introvert",     "INTROVERT",          "white", "front", "tee-introvert.jpg"),
  tee("good-bad",      "GOOD / BAD",         "white", "front", "tee-good-bad.jpg"),
  tee("llama",         "NO PROB-LLAMA",      "white", "front", "tee-llama.jpg"),
  tee("one-of-a-kind", "ONE OF A KIND",      "white", "front", "tee-one-of-a-kind.jpg"),
  tee("padel",         "PADEL",              "white", "front", "tee-padel.jpg"),
  tee("university",    "UNIVERSITY",         "white", "front", "tee-university.jpg"),
  tee("unfknblvbl",    "UNFKNBLVBL",         "white", "front", "tee-unfknblvbl.jpg"),
  tee("normal-is-boring","NORMAL IS BORING", "white", "front", "tee-normal-is-boring.jpg"),
  tee("cant",          "CAN'T",              "white", "front", "tee-cant.jpg"),

  /* ALBE — print pe spate */
  tee("cin-cin",       "CIN CIN",            "white", "back",  "tee-cin-cin-back.jpg"),
  tee("amalfi",        "AMALFI",             "white", "back",  "tee-amalfi-back.jpg"),
  tee("margarita",     "MARGARITA",          "white", "back",  "tee-margarita-back.jpg"),
  tee("tequila",       "TEQUILA",            "white", "back",  "tee-tequila-back.jpg"),
  tee("take-risks",    "TAKE RISKS",         "white", "back",  "tee-take-risks-back.jpg"),
  tee("believe-in-reality","BELIEVE IN REALITY","white","back", "tee-believe-in-reality-back.jpg"),

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
  tee("pause",         "PAUSE",              "black", "front", "tee-pause.jpg"),
  tee("yuck-fou",      "YUCK FOU",           "black", "front", "tee-yuck-fou.jpg"),
  tee("idgaf",         "IDGAF",              "black", "front", "tee-idgaf.jpg"),
  tee("sinner",        "SINNER",             "black", "front", "tee-sinner.jpg"),
  tee("villain",       "VILLAIN",            "black", "front", "tee-villain.jpg"),
  tee("who-cares",     "WHO CARES?",         "black", "front", "tee-who-cares.jpg"),
  tee("go-left",       "GO LEFT",            "black", "front", "tee-go-left.jpg"),
  tee("madafaka",      "MADAFÁKA",           "black", "front", "tee-madafaka.jpg"),

  /* NEGRE — print pe spate */
  tee("believe",       "BELIEVE IN YOURSELF", "black", "back", "tee-believe-back.jpg"),
  tee("perspective",   "PERSPECTIVE",        "black", "back",  "tee-perspective-back.jpg"),
  tee("confidence",    "CONFIDENCE",         "black", "back",  "tee-confidence-back.jpg"),
  tee("overmind",      "OVERMIND",           "black", "back",  "tee-overmind-back.jpg"),
  tee("crazy",         "I'M NOT CRAZY",      "black", "back",  "tee-crazy-back.jpg"),
  tee("ak47",          "AK 47",              "black", "back",  "tee-ak47-back.jpg"),
  tee("hunt-mode",     "HUNT MODE",          "black", "back",  "tee-hunt-mode-back.jpg"),
  tee("culture-of-ambition","CULTURE OF AMBITION","black","back","tee-culture-of-ambition-back.jpg"),
  tee("lucky-you",     "LUCKY YOU",          "black", "back",  "tee-lucky-you-back.jpg"),
  tee("live-for-this", "LIVE FOR THIS",      "black", "back",  "tee-live-for-this-back.jpg"),

  /* ── HANORACE (OVRLAYER) — print pe față, fundal portocaliu cu lanțuri ── */
  /* disponibile în alb + negru */
  hoodie("h-unfknblvbl", "UNFKNBLVBL",       { black: "hoodie-unfknblvbl-black.jpg", white: "hoodie-unfknblvbl-white.jpg" }),
  hoodie("h-antisocial", "ANTISOCIAL",       { black: "hoodie-antisocial-black.jpg", white: "hoodie-antisocial-white.jpg" }),
  hoodie("h-under-ctrl", "UNDER CTRL",       { black: "hoodie-under-ctrl-black.jpg", white: "hoodie-under-ctrl-white.jpg" }),
  hoodie("h-cant",       "CAN'T",            { black: "hoodie-cant-black.jpg",       white: "hoodie-cant-white.jpg" }),
  /* doar negru */
  hoodie("h-who-cares",  "WHO CARES?",       { black: "hoodie-who-cares-black.jpg" }),
  hoodie("h-sinner",     "SINNER",           { black: "hoodie-sinner-black.jpg" }),
  hoodie("h-overmind",   "OVERMIND",         { black: "hoodie-overmind-black.jpg" }),
  hoodie("h-villain",    "VILLAIN",          { black: "hoodie-villain-black.jpg" }),
  hoodie("h-idgaf",      "IDGAF",            { black: "hoodie-idgaf-black.jpg" }),
  hoodie("h-yuck-fou",   "YUCK FOU",         { black: "hoodie-yuck-fou-black.jpg" }),
  hoodie("h-madafaka",   "MADAFÁKA",         { black: "hoodie-madafaka-black.jpg" }),
  /* doar alb */
  hoodie("h-normal-is-boring", "NORMAL IS BORING", { white: "hoodie-normal-is-boring-white.jpg" }),
];
