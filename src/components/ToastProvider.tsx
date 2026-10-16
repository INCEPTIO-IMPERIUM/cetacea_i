import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { CircleCheck } from 'lucide-react'
import { ToastContext } from './toastContext'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('Saved')
  const [visible, setVisible] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const showToast = useCallback((next: string) => {
    setMessage(next)
    setVisible(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setVisible(false), 2400)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={`toast fixed bottom-5 left-1/2 z-[100] rounded-full bg-ink text-white px-5 py-3 shadow-xl text-ui font-semibold flex items-center gap-2 ${visible ? 'show' : ''}`}
      >
        <CircleCheck size={24} className="text-lemon" aria-hidden="true" />
        <span>{message}</span>
      </div>
    </ToastContext.Provider>
  )
}
