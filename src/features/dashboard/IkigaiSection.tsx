import { ArrowRight, Earth, HandHeart, Heart, Lightbulb, Sparkles, type LucideIcon } from 'lucide-react'
import { ikigaiCards, type IkigaiArea } from '../../data/dashboard'
import { actions } from '../../store/whoAmIStore'
import { useToast } from '../../components/toastContext'
import { L, useT } from '../../i18n/language'
import { SectionHeading } from './SectionHeading'

const areaIcons: Record<IkigaiArea, LucideIcon> = { love: Heart, good: Sparkles, world: HandHeart, need: Earth }

export function IkigaiSection({ selected }: { selected: string[] }) {
  const t = useT()
  const showToast = useToast()
  const count = selected.length

  return (
    <section id="ikigai" className="pt-10 sm:pt-12 scroll-mt-24" aria-labelledby="ikigai-heading">
      <SectionHeading
        id="ikigai-heading"
        eyebrow={t(L('02 / รู้จักตัวเอง', '02 / Know yourself'))}
        title={t(L('ส่วนผสม Ikigai ของคุณ', 'Your Ikigai ingredients'))}
        description={t(L('เลือกสิ่งที่รู้สึกใช่ในตอนนี้ เปลี่ยนใจได้ทุกเมื่อ', 'Choose what resonates right now. You can change your mind anytime.'))}
        action={
          <button
            type="button"
            onClick={() => {
              actions.clearIkigai()
              showToast(t(L('ล้างเบาะแสแล้ว — เริ่มใหม่ได้เลย', 'Clues reset — start fresh.')))
            }}
            className="text-ui font-semibold underline underline-offset-4 text-muted hover:text-ink"
          >
            {t(L('ล้างที่เลือก', 'Reset selections'))}
          </button>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {ikigaiCards.map((card, index) => {
          const Icon = areaIcons[card.area]
          return (
            <article key={card.area} className={`rounded-[20px] ${card.tone} border border-black/15 p-4 sm:p-5 min-h-[210px]`}>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/70 border border-black/10 grid place-items-center" aria-hidden="true">
                  <Icon size={24} />
                </div>
                <span className="text-ui font-bold uppercase tracking-[.12em] text-black/50">0{index + 1}</span>
              </div>
              <h3 className="font-bold text-read mt-4">{t(card.title)}</h3>
              <p className="text-read leading-relaxed text-black/60 mt-1 mb-4">{t(card.hint)}</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label={t(card.title)}>
                {card.options.map((option) => (
                  <button key={option.id} type="button" className="pill" aria-pressed={selected.includes(option.id)} onClick={() => actions.toggleIkigai(option.id)}>
                    {t(option.label)}
                  </button>
                ))}
              </div>
            </article>
          )
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/70 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center w-8 h-8 rounded-xl bg-lemon" aria-hidden="true">
            <Lightbulb size={24} />
          </span>
          <div>
            <p className="text-read font-bold">{t(L('การสะท้อนคิดของคุณ ไม่ใช่คะแนน', 'Your reflection, not a score'))}</p>
            <p className="text-read text-muted mt-0.5" aria-live="polite">
              {count
                ? t({
                    th: `เลือกเบาะแสแล้ว ${count} อย่าง ลองมองหาธีมที่ปรากฏมากกว่าหนึ่งด้าน`,
                    en: `${count} ${count === 1 ? 'clue' : 'clues'} selected. Look for themes that show up in more than one area.`,
                  })
                : t(L('เลือกส่วนผสมสักหน่อยเพื่อเริ่มมองเห็นรูปแบบ', 'Select a few ingredients to start spotting patterns.'))}
            </p>
          </div>
        </div>
        {/* Changes already save as they happen; the button confirms that, as in the template. */}
        <button
          type="button"
          onClick={() => showToast(t({ th: `บันทึกเบาะแสส่วนตัว ${count} อย่างแล้ว`, en: `${count} personal clues saved.` }))}
          className="rounded-full bg-ink text-white px-4 py-2.5 text-ui font-bold hover:bg-black/80 transition"
        >
          {t(L('บันทึกเบาะแสของฉัน', 'Save my clues'))} <ArrowRight size={24} className="inline ml-1" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
