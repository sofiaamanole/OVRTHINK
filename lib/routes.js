/* Mapare URL ↔ stare aplicație (SPA cu URL-uri partajabile).
   Fiecare produs/pagină are URL propriu → link direct + back/forward.
   Scheme:
     /                     home
     /tricouri             hub tricouri
     /tricouri-<id>        produs tricou   (ex: /tricouri-antisocial)
     /hoodie               hub hanorace
     /hoodie-<id>          produs hanorac  (ex: /hoodie-unfknblvbl)
     /colectii /custom /despre
     /<legal>              termeni, livrare, faq, etc.
     /checkout             coșul / finalizare
*/
import { CATALOG } from "./catalog";

const LEGAL = ["termeni", "confidentialitate", "cookies", "retururi", "livrare", "contact", "faq", "marimi", "ingrijire"];
const clean = (id) => String(id).replace(/^h-/, "");

export function productPath(p) {
  return "/" + (p.product === "tee" ? "tricouri-" : "hoodie-") + clean(p.id);
}

/* găsește produsul dintr-un slug de produs (ex: "tricouri-antisocial") */
export function productFromSlug(seg) {
  let m;
  if ((m = seg.match(/^tricouri-(.+)$/))) return CATALOG.find(x => x.product === "tee" && clean(x.id) === m[1]) || null;
  if ((m = seg.match(/^hoodie-(.+)$/)))   return CATALOG.find(x => x.product === "hoodie" && clean(x.id) === m[1]) || null;
  return null;
}

/* stare → pathname */
export function stateToPath({ view, page, cat, shopView, selId }) {
  if (view === "checkout") return "/checkout";
  if (page === "collections") return "/colectii";
  if (page === "custom") return "/custom";
  if (page === "about") return "/despre";
  if (LEGAL.includes(page)) return "/" + page;
  if (page === "shop") {
    if (shopView === "detail") {
      const p = CATALOG.find(x => x.id === selId);
      if (p) return productPath(p);
    }
    return cat === "hoodie" ? "/hoodie" : "/tricouri";
  }
  return "/";
}

/* pathname → stare parțială (folosită la încărcare + back/forward) */
export function pathToState(pathname) {
  const path = ("/" + String(pathname || "/").replace(/^\/+|\/+$/g, "")) ;
  const seg = path === "/" ? "" : path.slice(1);
  if (seg === "") return { page: "home", view: "studio" };
  if (seg === "checkout") return { page: "home", view: "checkout" };
  if (seg === "colectii") return { page: "collections", view: "studio" };
  if (seg === "custom") return { page: "custom", view: "studio" };
  if (seg === "despre") return { page: "about", view: "studio" };
  if (LEGAL.includes(seg)) return { page: seg, view: "studio" };
  if (seg === "tricouri") return { page: "shop", cat: "tee", shopView: "hub", view: "studio" };
  if (seg === "hoodie") return { page: "shop", cat: "hoodie", shopView: "hub", view: "studio" };
  const p = productFromSlug(seg);
  if (p) return {
    page: "shop", cat: p.product, shopView: "detail", selId: p.id,
    side: p.hero || "front", colorId: p.colors[0], view: "studio",
  };
  // slug necunoscut de produs → hub-ul categoriei potrivite
  if (/^tricouri-/.test(seg)) return { page: "shop", cat: "tee", shopView: "hub", view: "studio" };
  if (/^hoodie-/.test(seg)) return { page: "shop", cat: "hoodie", shopView: "hub", view: "studio" };
  return { page: "home", view: "studio" }; // fallback
}
