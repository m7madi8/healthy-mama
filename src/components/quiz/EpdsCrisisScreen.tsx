import { epdsCopy, supportLinesByCountry } from "../../data/content.ar";

export function EpdsCrisisScreen() {
  return (
    <section className="pt-6" aria-labelledby="epds-crisis-heading">
      <h2 id="epds-crisis-heading" className="font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
        {epdsCopy.crisisTitle}
      </h2>
      <p className="mt-4 text-lg leading-[1.8] text-ink">{epdsCopy.crisisBody}</p>
      {supportLinesByCountry.length > 0 ? (
        <ul className="mt-8 space-y-3 rounded-2xl border border-grove/30 bg-cream p-5">
          {supportLinesByCountry.map((line) => (
            <li key={`${line.country}-${line.phone}`} className="text-lg leading-[1.8] text-ink">
              <span className="font-semibold">{line.country}</span>
              {" — "}
              {line.label}:{" "}
              <a href={`tel:${line.phone.replace(/\s/g, "")}`} className="font-semibold text-grove underline-offset-2 hover:underline">
                {line.phone}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 rounded-2xl border border-grove/30 bg-cream p-5 text-lg leading-[1.8] text-ink">
          اتصلي بخدمات الطوارئ في بلدك أو بطبيبك فورًا. {/* TODO نوال: أضيفي أرقام خطوط الدعم في content.ar.ts → supportLinesByCountry */}
        </p>
      )}
    </section>
  );
}
