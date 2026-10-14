import { ChartNoAxesColumnIncreasing, Compass, Footprints, LayoutDashboard, Waypoints, type LucideIcon } from 'lucide-react'

export type SectionId = 'overview' | 'ikigai' | 'skills' | 'roadmap' | 'actions'

export const sectionNav: { id: SectionId; label: string; icon: LucideIcon; index: string }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, index: '01' },
  { id: 'ikigai', label: 'Ikigai Builder', icon: Compass, index: '02' },
  { id: 'skills', label: 'Skill Matrix', icon: ChartNoAxesColumnIncreasing, index: '03' },
  { id: 'roadmap', label: 'Career Roadmap', icon: Waypoints, index: '04' },
  { id: 'actions', label: 'Micro-Actions', icon: Footprints, index: '05' },
]
