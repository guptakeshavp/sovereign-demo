import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import '../styles/details.css'

/** Native modal supplies focus containment, Escape and focus restoration. */
export function DetailsDialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const heading = useId()
  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (open) {
      element.showModal()
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { element.close(); document.body.style.overflow = previousOverflow }
    }
  }, [open])
  return <dialog ref={dialog} className="details-dialog surface-light" aria-labelledby={heading} onClose={onClose}
    onClick={event => {
      if (event.target !== event.currentTarget) return
      const bounds = event.currentTarget.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
    }}>
    <div className="details-dialog-header"><h2 id={heading}>{title}</h2><button type="button" onClick={onClose} aria-label="Close details" autoFocus><X size={20} strokeWidth={1.4} /></button></div>
    <div className="details-dialog-body">{children}</div>
  </dialog>
}
