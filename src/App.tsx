import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { LandingPage } from './pages/LandingPage'
import { AssessmentPage } from './pages/AssessmentPage'

// The dashboard carries Three.js; load it only when that route is visited.
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))

const titles: Record<string, string> = {
  '/': 'Who Am I? — Your Personal Compass',
  '/assessment': 'Discovery Form — Who Am I?',
  '/dashboard': 'Your Space — Who Am I?',
}

/** New page → top of page and a matching title. In-page #hash jumps are left to each page. */
function RouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    document.title = titles[pathname] ?? titles['/']
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
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
            <Suspense fallback={<div className="min-h-screen grid place-items-center text-xs text-muted">Opening your space…</div>}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
