import { useEffect } from "react";

type SeoProps = {
  title: string;
};

export function Seo({ title }: SeoProps) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return null;
}
