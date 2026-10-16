import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { LandingPage } from './pages/LandingPage'
import { AssessmentPage } from './pages/AssessmentPage'
import { L, useT, type Localized } from './i18n/language'

// The dashboard carries Three.js; load it only when that route is visited.
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))

const titles: Record<string, Localized> = {
  '/': L('Who Am I? — เข็มทิศส่วนตัวของคุณ', 'Who Am I? — Your Personal Compass'),
  '/assessment': L('แบบสำรวจค้นหาตัวเอง — Who Am I?', 'Discovery Form — Who Am I?'),
  '/dashboard': L('พื้นที่ของคุณ — Who Am I?', 'Your Space — Who Am I?'),
}

/** New page → top of page and a matching title. In-page #hash jumps are left to each page. */
function RouteEffects() {
  const { pathname, hash } = useLocation()
  const t = useT()
  useEffect(() => {
    document.title = t(titles[pathname] ?? titles['/'])
  }, [pathname, t])
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

function DashboardFallback() {
  const t = useT()
  return <div className="min-h-screen grid place-items-center text-ui text-muted">{t(L('กำลังเปิดพื้นที่ของคุณ…', 'Opening your space…'))}</div>
}

export default function App() {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<DashboardFallback />}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
