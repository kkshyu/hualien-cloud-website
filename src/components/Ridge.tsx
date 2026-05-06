/**
 * Hualien mountain ridge — recurring brand motif.
 * Uses currentColor so it can be styled per surface.
 */
export function Ridge({
  variant = 'hero',
  className,
  style,
}: {
  variant?: 'hero' | 'thin' | 'footer'
  className?: string
  style?: React.CSSProperties
}) {
  if (variant === 'thin') {
    return (
      <svg
        viewBox="0 0 1440 36"
        preserveAspectRatio="none"
        className={className}
        style={style}
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          opacity="0.85"
          d="M0 36 L0 22 L80 16 L160 24 L240 14 L340 26 L430 18 L520 28 L620 12 L720 24 L820 16 L920 26 L1040 14 L1140 22 L1240 16 L1340 24 L1440 18 L1440 36 Z"
        />
      </svg>
    )
  }

  if (variant === 'footer') {
    return (
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={className}
        style={style}
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          opacity="0.55"
          d="M0 120 L0 88 L60 76 L130 92 L220 64 L310 96 L380 70 L470 100 L560 76 L650 102 L760 80 L860 100 L970 78 L1080 96 L1190 70 L1290 88 L1370 76 L1440 92 L1440 120 Z"
        />
        <path
          fill="currentColor"
          opacity="0.85"
          d="M0 120 L0 100 L70 92 L150 108 L240 86 L330 104 L420 90 L520 110 L620 92 L720 110 L820 96 L920 110 L1040 96 L1140 108 L1240 92 L1340 104 L1440 96 L1440 120 Z"
        />
      </svg>
    )
  }

  // hero variant — three layered ridges as decorative element
  return (
    <svg
      viewBox="0 0 800 240"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        opacity="0.18"
        d="M0 240 L0 110 L80 70 L160 130 L240 60 L340 150 L430 90 L520 160 L620 80 L720 150 L800 100 L800 240 Z"
      />
      <path
        fill="currentColor"
        opacity="0.32"
        d="M0 240 L0 150 L70 110 L150 170 L240 120 L330 180 L430 130 L520 200 L620 130 L720 180 L800 150 L800 240 Z"
      />
      <path
        fill="currentColor"
        opacity="0.6"
        d="M0 240 L0 195 L80 170 L170 215 L260 180 L360 220 L460 190 L560 230 L660 185 L760 220 L800 200 L800 240 Z"
      />
    </svg>
  )
}
