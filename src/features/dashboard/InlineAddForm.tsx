import { useId, useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { L, useT } from '../../i18n/language'

interface InlineAddFormProps {
  buttonLabel: string
  inputLabel: string
  placeholder: string
  maxLength: number
  /** Return false to keep the form open (e.g. a duplicate was rejected). */
  onAdd: (value: string) => boolean | void
}

/** A button that opens into a one-line input — replaces the template's window.prompt(). */
export function InlineAddForm({ buttonLabel, inputLabel, placeholder, maxLength, onAdd }: InlineAddFormProps) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const inputId = useId()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const clean = value.trim()
    if (!clean) return
    if (onAdd(clean) === false) return
    setValue('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-ink bg-white px-4 py-2.5 text-ui font-bold hover:bg-lemon transition"
      >
        <Plus size={24} aria-hidden="true" /> {buttonLabel}
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <label className="sr-only" htmlFor={inputId}>
        {inputLabel}
      </label>
      <input
        id={inputId}
        autoFocus
        value={value}
        maxLength={maxLength}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.stopPropagation()
            setOpen(false)
          }
        }}
        placeholder={placeholder}
        className="w-[220px] rounded-full border border-black/20 bg-white px-4 py-2.5 text-read outline-none focus:border-ink"
      />
      <button type="submit" disabled={!value.trim()} className="rounded-full bg-ink text-white px-4 py-2.5 text-ui font-bold disabled:opacity-40">
        {t(L('เพิ่ม', 'Add'))}
      </button>
      <button type="button" onClick={() => setOpen(false)} className="rounded-full px-3 py-2.5 text-ui font-semibold text-muted hover:text-ink">
        {t(L('ยกเลิก', 'Cancel'))}
      </button>
    </form>
  )
}
