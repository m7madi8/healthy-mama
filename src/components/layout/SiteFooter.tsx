import { Link } from "react-router-dom";
import { footer, conversionBooks, quizzes, howItWorks, faq } from "../../data/content.ar";
import { SiteLogoBlock } from "../brand/SiteLogo";
import { SectionInner } from "../editorial/SectionInner";

export function SiteFooter() {
  return (
    <footer className="border-t-[3px] border-dashed border-cream/30 bg-forest-2 py-12 text-cream">
      <SectionInner>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <SiteLogoBlock />
            <p className="mt-6 text-lg leading-[1.8] text-cream/85">{footer.disclaimer}</p>
          </div>
          <nav aria-label="روابط التذييل">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-lg font-medium">
              <li>
                <Link to={`/#${howItWorks.id}`} className="hover:text-saffron">
                  كيف يعمل
                </Link>
              </li>
              <li>
                <Link to={`/#${quizzes.id}`} className="hover:text-saffron">
                  الاستبيانات
                </Link>
              </li>
              <li>
                <Link to={`/#${conversionBooks.id}`} className="hover:text-saffron">
                  الكتب
                </Link>
              </li>
              <li>
                <Link to={`/#${faq.id}`} className="hover:text-saffron">
                  أسئلة
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-10 text-cream/70">{footer.copyright}</p>
      </SectionInner>
    </footer>
  );
}
