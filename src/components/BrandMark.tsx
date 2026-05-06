/**
 * Stylized cloud-over-mountain glyph used in the brand lock-up.
 * Single path so it inherits color cleanly from CSS.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      {/* mountain */}
      <path
        d="M2 24 L9 13 L14 19 L20 9 L30 24 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* cloud */}
      <path
        d="M9 8.5 q1.6 -2.6 4.4 -2.4 q1.4 -2.2 4 -1.6 q2.6 -0.4 3.6 1.6 q2.6 0.2 2.6 2.6 q0 2 -2.2 2.4 L11.4 11 q-2.2 -0.4 -2.4 -2.5 Z"
        fill="currentColor"
        opacity="0.92"
      />
    </svg>
  )
}
