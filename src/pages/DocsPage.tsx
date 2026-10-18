import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'
import { BrandMark } from '../components/BrandMark'
import { DOC_SECTIONS, type DocBlock } from '../docs/docsContent'
import { L, useT } from '../i18n/language'
import { LanguageToggle } from '../i18n/LanguageToggle'

function Block({ block }: { block: DocBlock }) {
  const t = useT()
  switch (block.type) {
    case 'p':
      return <p className="text-read text-black/80">{t(block.text)}</p>
    case 'list':
      return (
        <ul className="list-disc pl-5 space-y-3 text-read text-black/80">
          {block.items.map((item) => (
            <li key={item.en}>{t(item)}</li>
          ))}
        </ul>
      )
    case 'cards':
      return (
        <div className="grid grid-cols-1 gap-4">
          {block.items.map((item) => (
            <article key={item.title.en} className="rounded-[20px] border border-black/15 bg-white p-5">
              <h3 className="font-bold text-read">{t(item.title)}</h3>
              <p className="text-ui font-semibold text-accent mt-1">{t(item.meta)}</p>
              <p className="text-read text-black/80 mt-3">{t(item.body)}</p>
            </article>
          ))}
        </div>
      )
    case 'faq':
      return (
        <div className="space-y-3">
          {block.items.map((item) => (
            <details key={item.q.en} className="group rounded-[20px] border border-black/15 bg-white p-5">
              <summary className="cursor-pointer list-none font-bold text-read flex items-start justify-between gap-3">
                <span>{t(item.q)}</span>
                <span className="shrink-0 rounded-full border border-black/15 px-3 py-1 text-ui group-open:bg-paper" aria-hidden="true">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="text-read text-black/80 mt-3">{t(item.a)}</p>
            </details>
          ))}
        </div>
      )
    case 'refs':
      return (
        <ul className="space-y-3 text-read text-black/80">
          {block.items.map((item) => (
            <li key={item} className="pl-4 -indent-4">
              {item}
            </li>
          ))}
        </ul>
      )
    case 'credit':
      return <p className="rounded-[20px] bg-lemon-soft/70 border border-black/10 p-5 text-read text-black/80">{block.text}</p>
  }
}

/** "More details": what the survey is, how scores and career suggestions are calculated, privacy, limits and references. */
export function DocsPage() {
  const t = useT()
  const { hash } = useLocation()

  // The router does not scroll to #hash on its own (e.g. arriving from /docs#matching).
  useEffect(() => {
    const id = hash.slice(1)
    if (!id) return
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' }), 60)
    return () => window.clearTimeout(timer)
  }, [hash])

  return (
    <>
      <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-xl border-b border-black/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-3">
          <BrandMark variant="app" to="/" tagline={t(L('รายละเอียดเพิ่มเติม', 'MORE DETAILS'))} />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2.5 text-ui font-bold hover:bg-lemon transition">
              <ArrowLeft size={24} aria-hidden="true" />
              {t(L('หน้าแรก', 'Home'))}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="pt-8 sm:pt-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-lilac px-3 py-2 text-ui font-bold">
            <BookOpen size={24} aria-hidden="true" /> {t(L('รายละเอียดเพิ่มเติม', 'MORE DETAILS'))}
          </div>
          <h1 className="section-title text-3xl sm:text-5xl font-extrabold mt-5">
            {t(L('ผลนี้มาจากไหน', 'Where your results come from'))}
            <span className="text-[#8b76cf]">.</span>
          </h1>
          <p className="text-read text-black/70 mt-4">
            {t(
              L(
                'แบบสำรวจนี้ใช้เครื่องมือที่เปิดเผยที่มา คำนวณด้วยสูตรที่อธิบายได้ และบอกข้อจำกัดตรง ๆ หน้านี้อธิบายทั้งหมดนั้น',
                'This survey uses instruments with a stated source, calculates with formulas that can be explained, and states its limits plainly. This page explains all of it.',
              ),
            )}
          </p>
        </div>

        <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-8 lg:gap-14 items-start">
          {/* Phones: a collapsed list so the content starts straight away. Desktop: a sticky list beside the text. */}
          <nav aria-label={t(L('สารบัญ', 'Contents'))} className="lg:sticky lg:top-24">
            <details className="lg:hidden rounded-[20px] border border-black/15 bg-white p-4">
              <summary className="cursor-pointer font-bold text-read">{t(L('สารบัญ', 'Contents'))}</summary>
              <ul className="mt-3 space-y-1">
                {DOC_SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="block rounded-xl px-3 py-2 text-read hover:bg-paper">
                      {t(section.title)}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
            <div className="hidden lg:block">
              <div className="eyebrow mb-3">{t(L('สารบัญ', 'Contents'))}</div>
              <ul className="flex flex-col gap-1">
                {DOC_SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="block rounded-xl px-3 py-2 text-ui font-semibold hover:bg-white">
                      {t(section.title)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <article className="min-w-0 max-w-3xl space-y-14">
            {DOC_SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24" aria-labelledby={`${section.id}-title`}>
                <h2 id={`${section.id}-title`} className="section-title text-2xl sm:text-3xl font-extrabold">
                  {t(section.title)}
                </h2>
                <div className="mt-5 space-y-5">
                  {section.blocks.map((block, index) => (
                    <Block key={index} block={block} />
                  ))}
                </div>
              </section>
            ))}

            <div className="rounded-[22px] border-[1.5px] border-ink bg-white shadow-panel p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="section-title text-xl font-extrabold">{t(L('พร้อมเริ่มแล้ว?', 'Ready to begin?'))}</h2>
                <p className="text-read text-black/70 mt-1">{t(L('ไม่ต้องสมัครบัญชี และหยุดพักเมื่อไรก็ได้', 'No account needed, and you can stop whenever you like.'))}</p>
              </div>
              <Link to="/assessment" className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-5 py-3.5 text-ui font-bold hover:-translate-y-0.5 transition">
                {t(L('เริ่มแบบสำรวจ', 'Start the survey'))} <ArrowRight size={24} aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>

        <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-10 text-ui text-muted">
          <span>{t(L('© 2026 Who Am I? · สร้างเพื่อคนช่างสงสัย', '© 2026 Who Am I? · Built for curious minds.'))}</span>
          <Link className="underline underline-offset-4" to="/dashboard">
            {t(L('เปิด Dashboard', 'Open dashboard'))}
          </Link>
        </footer>
      </main>
    </>
  )
}
