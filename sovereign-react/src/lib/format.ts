/* INR formatting with Indian digit grouping: ₹1,23,456 */
export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')
export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')
export const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))
export const cmToIn = (cm: number) => Math.round((cm / 2.54) * 10) / 10
export const inToCm = (i: number) => Math.round(i * 2.54 * 10) / 10
