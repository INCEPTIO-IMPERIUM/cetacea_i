import { ChartNoAxesColumnIncreasing, Compass, Footprints, LayoutDashboard, Waypoints, type LucideIcon } from 'lucide-react'
import { L, type Localized } from '../../i18n/language'

export type SectionId = 'overview' | 'ikigai' | 'skills' | 'roadmap' | 'actions'

export const sectionNav: { id: SectionId; label: Localized; icon: LucideIcon; index: string }[] = [
  { id: 'overview', label: L('ภาพรวม', 'Overview'), icon: LayoutDashboard, index: '01' },
  { id: 'ikigai', label: L('สร้าง Ikigai', 'Ikigai Builder'), icon: Compass, index: '02' },
  { id: 'skills', label: L('ตารางทักษะ', 'Skill Matrix'), icon: ChartNoAxesColumnIncreasing, index: '03' },
  { id: 'roadmap', label: L('แผนที่อาชีพ', 'Career Roadmap'), icon: Waypoints, index: '04' },
  { id: 'actions', label: L('Micro-Actions', 'Micro-Actions'), icon: Footprints, index: '05' },
]
