import { Link } from "react-router-dom";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-sage-100 bg-white/80 py-14 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-xl font-semibold text-sage-800">نوال عمر</p>
            <p className="mt-2 text-sm leading-relaxed text-sage-600/90">
              مساحة آمنة لصحة المرأة والحمل وما بعد الولادة — معلومات موثوقة، استبيان بسيط، ودليل يناسب مرحلتك.
            </p>
          </div>
          <nav aria-label="روابط التذييل">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-sage-700">
              <li>
                <Link to="/#how-it-works" className="transition-colors hover:text-sage-500">
                  كيف يعمل
                </Link>
              </li>
              <li>
                <Link to="/#wellness-tips" className="transition-colors hover:text-sage-500">
                  نصائح مفيدة
                </Link>
              </li>
              <li>
                <Link to="/#quiz-section" className="transition-colors hover:text-sage-500">
                  الاستبيانات
                </Link>
              </li>
              <li>
                <Link to="/#quiz-results" className="transition-colors hover:text-sage-500">
                  الكتب
                </Link>
              </li>
              <li>
                <Link to="/#contact" className="transition-colors hover:text-sage-500">
                  التواصل
                </Link>
              </li>
              <li>
                <Link to="/admin" className="transition-colors hover:text-sage-500">
                  لوحة المالك
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-12 text-center text-xs text-sage-500/90 md:text-start">
          © {year} نوال عمر. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
