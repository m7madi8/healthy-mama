import { ArchFrame } from "../components/ui/ArchFrame";
import { EditorialButton, EditorialLinkButton } from "../components/ui/EditorialButton";
import { Marquee } from "../components/ui/Marquee";
import { NoteCard } from "../components/ui/NoteCard";
import { StampBadge } from "../components/ui/StampBadge";
import { Sticker } from "../components/ui/Sticker";
import { TornEdge } from "../components/ui/TornEdge";
import { hero } from "../data/content.ar";

export function DevUiPage() {
  return (
    <main className="space-y-16 bg-cream py-24">
      <h1 className="text-center font-display text-4xl">مكوّنات الواجهة</h1>
      <div className="flex flex-wrap justify-center gap-8">
        <EditorialButton>زر أساسي</EditorialButton>
        <EditorialButton variant="secondary">ثانوي</EditorialButton>
        <EditorialLinkButton to="/">رابط</EditorialLinkButton>
      </div>
      <Sticker label="استبيان ✦ مجاني ✦" href="/#quizzes" />
      <NoteCard tone="mint" rotation={4}>ملاحظة تجريبية</NoteCard>
      <StampBadge text="ممرضة" />
      <div className="mx-auto max-w-sm">
        <ArchFrame>
          <img src={hero.imageSrc} alt="" className="h-64 w-full object-cover" />
        </ArchFrame>
      </div>
      <Marquee text="لستِ وحدك ✦ مشاعرك حق ✦" />
      <TornEdge fill="var(--peach)" />
    </main>
  );
}
