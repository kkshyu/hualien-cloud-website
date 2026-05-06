import React from 'react'

export const Logo: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
    }}
  >
    <svg viewBox="0 0 64 64" width={56} height={56} aria-hidden="true">
      <path
        d="M4 48 L18 26 L28 38 L40 18 L60 48 Z"
        fill="none"
        stroke="#3d4d36"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M18 17 q3 -5 9 -5 q3 -4.5 8 -3 q5 -1 7 3 q5 0.5 5 5 q0 3.5 -4 4.5 L23 22 q-4.5 -0.8 -5 -5 Z"
        fill="#1a1815"
        opacity="0.92"
      />
    </svg>
    <div
      style={{
        fontFamily: "'Noto Serif TC', serif",
        fontSize: '1.5rem',
        fontWeight: 500,
        letterSpacing: '0.04em',
        color: '#1a1815',
      }}
    >
      花蓮雲基地
    </div>
    <div
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.65rem',
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: 'rgba(26, 24, 21, 0.5)',
      }}
    >
      Hualien · Cloud · Hub
    </div>
  </div>
)

export default Logo
