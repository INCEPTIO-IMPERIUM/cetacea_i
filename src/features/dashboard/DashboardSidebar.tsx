import { Link } from 'react-router'
import { ArrowUpRight, ListChecks, ShieldCheck, Sprout } from 'lucide-react'
import { BrandMark } from '../../components/BrandMark'
import { L, useT } from '../../i18n/language'
import { sectionNav, type SectionId } from './sections'

interface DashboardSidebarProps {
  open: boolean
  activeSection: SectionId
  /** Share of discovery-form sections finished, 0–100. */
  progress: number
  onNavigate: (id: SectionId) => void
}

export function DashboardSidebar({ open, activeSection, progress, onNavigate }: DashboardSidebarProps) {
  const t = useT()
  const [first, ...rest] = sectionNav
  const renderNav = ({ id, label, icon: Icon, index }: (typeof sectionNav)[number]) => (
    <button
      key={id}
      type="button"
      className={`nav-link ${activeSection === id ? 'active' : ''}`}
      aria-current={activeSection === id ? 'location' : undefined}
      onClick={() => onNavigate(id)}
    >
      <span className="nav-icon"><Icon size={24} aria-hidden="true" /></span>
      <span className="text-sm">{t(label)}</span>
      <span className="ml-auto text-ui text-black/50">{index}</span>
    </button>
  )

  return (
    <aside
      id="sidebar"
      className={`sidebar bg-white border-r border-black/10 px-5 py-6 flex flex-col min-h-screen lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto ${open ? 'open' : ''}`}
    >
      <div className="px-2 mb-9">
        <BrandMark variant="app" to="/dashboard" tagline={t(L('พื้นที่ค้นหาตัวเองของคุณ', 'YOUR DISCOVERY SPACE'))} />
      </div>

      <div className="eyebrow px-3 mb-3">{t(L('เส้นทางของคุณ', 'Your journey'))}</div>
      <nav className="space-y-1" aria-label={t(L('ส่วนต่าง ๆ ของ Dashboard', 'Dashboard sections'))}>
        {renderNav(first)}
        <Link className="nav-link" to="/assessment">
          <span className="nav-icon"><ListChecks size={24} aria-hidden="true" /></span>
          <span className="text-sm">{t(L('แบบสำรวจค้นหาตัวเอง', 'Discovery Form'))}</span>
          <ArrowUpRight size={24} className="ml-auto" aria-hidden="true" />
        </Link>
        {rest.map(renderNav)}
      </nav>

      <div className="mt-9 rounded-[18px] bg-lilac p-4 border border-black/10">
        <div className="flex items-center justify-between mb-3">
          <span className="eyebrow text-black/60">{t(L('ความคืบหน้า', 'Discovery progress'))}</span>
          <Sprout size={24} aria-hidden="true" />
        </div>
        <div className="flex items-end gap-2">
          <span className="section-title text-3xl font-extrabold">{progress}%</span>
          <span className="text-ui text-black/60 mb-1">{t(L('ของแบบสำรวจที่ทำแล้ว', 'of the discovery form done'))}</span>
        </div>
        <div className="meter mt-3 bg-white/80" role="progressbar" aria-label={t(L('ความคืบหน้า', 'Discovery progress'))} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="text-read text-black/65 mt-3">{t(L('ทุกการทดลองเล็ก ๆ เพิ่มเบาะแสให้คุณ ไม่ต้องรีบหาคำตอบทั้งหมด', 'Every small experiment adds a clue. There’s no rush to have it all figured out.'))}</p>
      </div>

      <div className="mt-auto pt-8">
        <div className="rounded-[18px] bg-paper border border-black/10 p-4 flex items-start gap-3">
          <ShieldCheck size={24} className="shrink-0" aria-hidden="true" />
          <p className="text-read text-muted">
            {t(L('ข้อมูลทั้งหมดของคุณเก็บไว้ในเครื่องนี้เท่านั้น ไม่มีบัญชีและไม่ได้ส่งไปที่ไหน', 'Everything you add stays on this device — no account, nothing sent anywhere.'))}{' '}
            <Link to="/docs#privacy" className="font-semibold text-ink underline underline-offset-4">
              {t(L('รายละเอียดเพิ่มเติม', 'More details'))}
            </Link>
          </p>
        </div>
        <p className="text-read text-muted px-2 mt-4">{t(L('เครื่องมือสะท้อนคิด ไม่ใช่คำตัดสิน คุณเป็นคนกำหนดเองว่าอนาคตที่ดีหน้าตาเป็นอย่างไร', 'A reflection tool, not a verdict. You get to define what a good future looks like.'))}</p>
      </div>
    </aside>
  )
}
