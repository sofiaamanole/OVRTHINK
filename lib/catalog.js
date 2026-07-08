/* ─────────────────────────────────────────────
   OVRTHINK — CATALOG DE PRODUSE + COLECȚII
   Aici adaugi/editezi tricourile și hoodie-urile.
   Fiecare model aparține unei colecții (summer | winter | sport)
   și vine prestabilit cu design + text (pe mockup).
   Clientul alege doar culoarea (negru/alb) și mărimea.

   Cum adaugi un model nou:
     1. Pune mockup-urile în public/catalog/ (ex: loop-black.jpg, loop-white.jpg)
     2. Adaugă o intrare mai jos cu id unic, colecție, nume, preț, culori și imagini
   Dacă un model e disponibil pe o singură culoare, pune doar acea culoare în `colors`.
   ───────────────────────────────────────────── */

export const COLLECTIONS = [
  {
    id: "summer",
    name: { ro: "Primăvară–Vară", en: "Spring–Summer" },
    tagline: { ro: "Lejer. Luminos. Cald.", en: "Light. Bright. Warm." },
  },
  {
    id: "winter",
    name: { ro: "Toamnă–Iarnă", en: "Autumn–Winter" },
    tagline: { ro: "Cald pe vreme rece.", en: "Warmth against the cold." },
  },
  {
    id: "sport",
    name: { ro: "Sport", en: "Sport" },
    tagline: { ro: "Mișcare. Energie. Viteză.", en: "Motion. Energy. Speed." },
  },
];

export const CATALOG = [
  {
    id: "model-01",
    collection: "summer",
    product: "tee",          // "tee" | "hoodie"
    name: { ro: "Model 01", en: "Model 01" },
    price: 189,              // lei (croi fix per model)
    colors: ["black", "white"],
    img: { black: null, white: null },   // null → placeholder până pui mockup-ul
  },
  {
    id: "model-02",
    collection: "summer",
    product: "tee",
    name: { ro: "Model 02", en: "Model 02" },
    price: 189,
    colors: ["black", "white"],
    img: { black: null, white: null },
  },
  {
    id: "model-03",
    collection: "winter",
    product: "tee",
    name: { ro: "Model 03", en: "Model 03" },
    price: 189,
    colors: ["black"],
    img: { black: null },
  },
  {
    id: "hoodie-01",
    collection: "winter",
    product: "hoodie",
    name: { ro: "Hoodie 01", en: "Hoodie 01" },
    price: 329,
    colors: ["black", "white"],
    img: { black: null, white: null },
  },
  {
    id: "model-04",
    collection: "sport",
    product: "tee",
    name: { ro: "Model 04", en: "Model 04" },
    price: 189,
    colors: ["white"],
    img: { white: null },
  },
  {
    id: "hoodie-02",
    collection: "sport",
    product: "hoodie",
    name: { ro: "Hoodie 02", en: "Hoodie 02" },
    price: 329,
    colors: ["black"],
    img: { black: null },
  },
];
