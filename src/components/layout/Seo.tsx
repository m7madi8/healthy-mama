import { useEffect } from "react";

type SeoProps = {
  title: string;
  description?: string;
  image?: string;
  jsonLd?: unknown;
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function Seo({ title, description, image, jsonLd }: SeoProps) {
  useEffect(() => {
    document.title = title;
    if (description) {
      upsertMeta("name", "description", description);
      upsertMeta("property", "og:description", description);
    }
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:locale", "ar_AR");
    upsertMeta("property", "og:type", "website");
    if (image) {
      const url = image.startsWith("http") ? image : `${window.location.origin}${image}`;
      upsertMeta("property", "og:image", url);
    }

    const scriptId = "jsonld-seo";
    const existing = document.getElementById(scriptId);
    if (jsonLd) {
      const script = existing ?? document.createElement("script");
      script.id = scriptId;
      script.setAttribute("type", "application/ld+json");
      script.textContent = JSON.stringify(jsonLd);
      if (!existing) document.head.appendChild(script);
    } else if (existing) {
      existing.remove();
    }
  }, [title, description, image, jsonLd]);
  return null;
}
