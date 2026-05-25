export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "checklist"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "callout"; label: string; lines: string[] }
  | { type: "subheading"; text: string }
  | { type: "fill"; label?: string };

const CALLOUT_LABELS = new Set([
  "تذكير",
  "جملة مهمة",
  "سؤال لكِ",
  "ملاحظة مهمة حول الأفكار المزعجة",
  "قاعدة بسيطة للتذكر",
  "قبل أن تبدئي",
  "التمرين الأول: يد على القلب ويد على البطن",
  "متى أستخدمه؟",
  "الطريقة",
  "مهم",
  "سؤال بعد التمرين",
  "تمرين بسيط لأم الخداج",
  "قصة مركّبة من الخداج",
  "تمرين كتابة",
  "كيف أقرأ إجاباتي؟",
  "جمل يمكنك استخدامها",
  "ما الذي يساعد الأم؟",
  "ما الذي لا يساعد؟",
  "رسالة للعائلة",
  "رسالة جاهزة",
  "أين يمكن طلب المساعدة في إسرائيل؟",
  "نص قصير قبل تحميل الدليل",
  "نقاط مهمة لحماية المحتوى قانونيًا ومهنيًا",
  "مصادر مهنية بُني عليها الدليل للمراجعة الداخلية",
]);

function isBulletLine(line: string): boolean {
  return /^[•\-\*]\s/.test(line.trim()) || line.trimStart().startsWith("•");
}

function isCheckboxLine(line: string): boolean {
  return /^\[\s?\]/.test(line.trim());
}

function isFillLine(line: string): boolean {
  return /[.…]{6,}/.test(line);
}

function isQuoteLine(line: string): boolean {
  const t = line.trim();
  return (t.startsWith("“") && t.endsWith("”")) || (t.startsWith('"') && t.endsWith('"'));
}

function isSubheadingLine(line: string): boolean {
  return /^\d+\.\s/.test(line.trim()) || /^اليوم \d+:/.test(line.trim());
}

function isCalloutLabel(line: string): boolean {
  const t = line.trim();
  if (CALLOUT_LABELS.has(t)) return true;
  return t.startsWith("اكتبي") || t.startsWith("اختاري") || t.startsWith("أكملي") || t === "ثم يظهر زر:";
}

export function parseBookContent(content: string): ContentBlock[] {
  const lines = content.split("\n");
  const blocks: ContentBlock[] = [];
  let i = 0;
  let pendingFillLabel: string | undefined;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    if (isBulletLine(line)) {
      const items: string[] = [];
      while (i < lines.length && isBulletLine(lines[i])) {
        items.push(lines[i].replace(/^[\s•\-\*]+/, "").trim());
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    if (isCheckboxLine(line)) {
      const items: string[] = [];
      while (i < lines.length && isCheckboxLine(lines[i])) {
        items.push(lines[i].replace(/^\[\s?\]\s*/, "").trim());
        i++;
      }
      blocks.push({ type: "checklist", items });
      continue;
    }

    if (isFillLine(line)) {
      blocks.push({ type: "fill", label: pendingFillLabel });
      pendingFillLabel = undefined;
      i++;
      continue;
    }

    if (isQuoteLine(line)) {
      blocks.push({ type: "quote", text: line.trim() });
      i++;
      continue;
    }

    if (isSubheadingLine(line)) {
      blocks.push({ type: "subheading", text: line.trim() });
      i++;
      continue;
    }

    if (isCalloutLabel(line)) {
      const label = line.trim();
      i++;
      const body: string[] = [];
      while (i < lines.length && lines[i].trim() && !isCalloutLabel(lines[i]) && !isBulletLine(lines[i]) && !isCheckboxLine(lines[i]) && !isFillLine(lines[i]) && !isSubheadingLine(lines[i])) {
        if (isQuoteLine(lines[i])) {
          body.push(lines[i].trim());
          i++;
        } else {
          const para: string[] = [];
          while (
            i < lines.length &&
            lines[i].trim() &&
            !isCalloutLabel(lines[i]) &&
            !isBulletLine(lines[i]) &&
            !isCheckboxLine(lines[i]) &&
            !isFillLine(lines[i]) &&
            !isSubheadingLine(lines[i]) &&
            !isQuoteLine(lines[i])
          ) {
            para.push(lines[i]);
            i++;
          }
          if (para.length) body.push(para.join("\n"));
        }
      }
      blocks.push({ type: "callout", label, lines: body });
      pendingFillLabel = label;
      continue;
    }

    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !isBulletLine(lines[i]) &&
      !isCheckboxLine(lines[i]) &&
      !isFillLine(lines[i]) &&
      !isCalloutLabel(lines[i]) &&
      !isSubheadingLine(lines[i])
    ) {
      if (isQuoteLine(lines[i])) {
        if (para.length) {
          blocks.push({ type: "paragraph", text: para.join("\n") });
          para.length = 0;
        }
        blocks.push({ type: "quote", text: lines[i].trim() });
        i++;
      } else {
        para.push(lines[i]);
        i++;
      }
    }
    if (para.length) {
      blocks.push({ type: "paragraph", text: para.join("\n") });
      pendingFillLabel = para[0]?.replace(/:$/, "");
    }
  }

  return blocks;
}
