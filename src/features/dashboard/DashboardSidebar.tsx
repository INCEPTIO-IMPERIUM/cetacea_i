import { Link } from 'react-router'
import { ArrowUpRight, ListChecks, Settings2, Sprout } from 'lucide-react'
import { BrandMark } from '../../components/BrandMark'
import { L, useT } from '../../i18n/language'
import { sectionNav, type SectionId } from './sections'

interface DashboardSidebarProps {
  open: boolean
  activeSection: SectionId
  progress: number
  onNavigate: (id: SectionId) => void
  onProfile: () => void
}

export function DashboardSidebar({ open, activeSection, progress, onNavigate, onProfile }: DashboardSidebarProps) {
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
      <span className="ml-auto text-[10px] text-black/50">{index}</span>
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
          <span className="text-[11px] text-black/60 mb-1">{t(L('ของโปรไฟล์คุณ', 'of your profile'))}</span>
        </div>
        <div className="meter mt-3 bg-white/80" role="progressbar" aria-label={t(L('ความคืบหน้า', 'Discovery progress'))} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[11px] leading-relaxed text-black/65 mt-3">{t(L('ทุกการทดลองเล็ก ๆ เพิ่มเบาะแสให้คุณ ไม่ต้องรีบหาคำตอบทั้งหมด', 'Every small experiment adds a clue. There’s no rush to have it all figured out.'))}</p>
      </div>

      <div className="mt-auto pt-8">
        <div className="rounded-[18px] bg-paper border border-black/10 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-lemon border border-ink grid place-items-center font-bold text-xs" aria-hidden="true">J</div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold truncate">{t(L('นักสำรวจขี้สงสัย', 'Curious explorer'))}</div>
            <div className="text-[10px] text-muted">{t(L('ใช้ฟรี · เดโมในเครื่อง', 'Free journey · Local demo'))}</div>
          </div>
          <button type="button" onClick={onProfile} className="p-2 rounded-xl hover:bg-white" aria-label={t(L('แก้ไขโปรไฟล์', 'Edit profile'))}>
            <Settings2 size={24} aria-hidden="true" />
          </button>
        </div>
        <p className="text-[9px] leading-relaxed text-muted px-2 mt-4">{t(L('เครื่องมือสะท้อนคิด ไม่ใช่คำตัดสิน คุณเป็นคนกำหนดเองว่าอนาคตที่ดีหน้าตาเป็นอย่างไร', 'A reflection tool, not a verdict. You get to define what a good future looks like.'))}</p>
      </div>
    </aside>
  )
}
