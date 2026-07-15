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
    return {
      title,
      openGraph: { title, url: `https://www.ovrthink.ro/${seg}` },
      twitter: { title },
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
