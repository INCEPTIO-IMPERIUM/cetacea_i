import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, X } from 'lucide-react'
import { L, useT } from '../../i18n/language'

const MAX_LENGTH = 600

interface ReflectionModalProps {
  onClose: () => void
  onSave: (text: string) => void
}

/** Mounted only while open, so each opening starts with an empty note. */
export function ReflectionModal({ onClose, onSave }: ReflectionModalProps) {
  const t = useT()
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    textareaRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const note = text.trim()
    if (note) onSave(note)
  }

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm grid place-items-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        className="modal-card w-full max-w-lg rounded-[24px] bg-white border-[1.5px] border-ink shadow-[0_6px_0_#171717] overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-black/10">
          <div>
            <div className="eyebrow">{t(L('พื้นที่ส่วนตัวของคุณ', 'Your private space'))}</div>
            <h2 id="modalTitle" className="section-title text-2xl font-extrabold mt-1">{t(L('สะท้อนคิดสั้น ๆ', 'A quick reflection'))}</h2>
            <p className="text-read text-muted mt-1">{t(L('เก็บเบาะแสจากการสำรวจวันนี้', "Capture a clue from today's exploration."))}</p>
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-xl bg-paper grid place-items-center hover:bg-lemon" aria-label={t(L('ปิดหน้าต่าง', 'Close dialog'))}>
            <X size={24} aria-hidden="true" />
          </button>
        </div>
        <form className="p-5 sm:p-6" onSubmit={handleSubmit}>
          <label htmlFor="reflectionText" className="block text-read font-bold mb-2">{t(L('คุณสังเกตเห็นอะไร?', 'What did you notice?'))}</label>
          <textarea
            ref={textareaRef}
            id="reflectionText"
            rows={5}
            maxLength={MAX_LENGTH}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={t(L('ฉันสังเกตว่าฉันสนุกกับ... / ฉันรู้สึกอยากรู้เมื่อ... / ครั้งหน้าฉันอยากลอง...', 'I noticed that I enjoyed... / I felt curious when... / Next time, I want to try...'))}
            className="w-full rounded-2xl border border-black/15 bg-paper px-4 py-3 text-read outline-none focus:border-black resize-y"
            required
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-ui text-muted">{t(L('สำหรับคุณคนเดียว บันทึกไว้ในเครื่องนี้เท่านั้น', 'Just for you. Saved only on this device.'))}</span>
            <span className="text-ui text-muted">{text.length} / {MAX_LENGTH}</span>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-5">
            <button type="button" onClick={onClose} className="rounded-full border border-black/15 px-5 py-3 text-ui font-bold hover:bg-paper">
              {t(L('ไว้ทีหลัง', 'Maybe later'))}
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="rounded-full bg-ink text-white px-5 py-3 text-ui font-bold hover:bg-black/80 disabled:opacity-40"
            >
              {t(L('บันทึก', 'Save reflection'))} <Check size={24} className="inline ml-1" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
