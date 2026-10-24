import { MARK, WORDMARK } from './logoData'

export function Mark({ className = '' }: { className?: string }) {
  return <span className={`logo-mask ${className}`} style={{ ['--m' as string]: `url("${MARK}")`, aspectRatio: '1367/1757' }} aria-hidden="true" />
}
export function Wordmark({ className = '' }: { className?: string }) {
  return <span className={`logo-mask ${className}`} style={{ ['--m' as string]: `url("${WORDMARK}")`, aspectRatio: '2963/782' }} role="img" aria-label="Sovereign" />
}
