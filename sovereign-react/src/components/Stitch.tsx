export function Stitch({ size = 11, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`stitch ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 12 12"><path d="M1.5 1.5 L10.5 10.5" /><path d="M10.5 1.5 L1.5 10.5" /></svg>
    </span>
  )
}
