import Studio from "../_components/Studio";
import Intro from "../_components/Intro";
import { productFromSlug } from "@/lib/routes";

function pathFrom(slug) {
  return "/" + (Array.isArray(slug) ? slug.join("/") : "");
}

/* Titlu per produs pentru link-uri partajate (SEO + preview) */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const seg = (Array.isArray(slug) ? slug.join("/") : "").replace(/^\/+|\/+$/g, "");
  const p = seg ? productFromSlug(seg) : null;
  if (p) {
    const kind = p.product === "tee" ? "Tricou" : "Hanorac";
    const title = `${p.name.ro} — ${kind} OVRTHINK`;
    // imaginea produsului (latura cu designul) pentru preview-ul de link
    const color = p.colors[0];
    const heroImg = p.hero === "back"
      ? (p.imgBack && p.imgBack[color])
      : (p.img && p.img[color]);
    const images = heroImg ? [{ url: heroImg, width: 1500, height: 1875, alt: p.name.ro }] : undefined;
    return {
      title,
      openGraph: { title, description: `${p.name.ro} · ${p.price} lei · OVRTHINK`, url: `https://www.ovrthink.ro/${seg}`, images },
      twitter: { card: "summary_large_image", title, images: images ? [heroImg] : undefined },
    };
  }
  return {};
}

export default async function Page({ params }) {
  const { slug } = await params;
  const path = pathFrom(slug);
  const content = <Studio initialPath={path} />;
  // Intro-ul (splash) doar pe home; link-urile directe (produs/pagină) intră instant
  return path === "/" ? <Intro>{content}</Intro> : content;
}
