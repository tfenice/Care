import type { CSSProperties } from 'react'

type PaperSurfaceProps = {
  children: React.ReactNode
  className?: string
  as?: 'section' | 'div' | 'article'
  elevation?: 'rest' | 'lift' | 'page'
  style?: CSSProperties
}

export default function PaperSurface({
  children,
  className = '',
  as: Component = 'section',
  elevation = 'rest',
  style,
}: PaperSurfaceProps) {
  const shadow =
    elevation === 'lift' ? 'var(--paper-shadow-lift)'
    : elevation === 'page' ? 'var(--paper-shadow-page)'
    : 'var(--paper-shadow-rest)'

  return (
    <Component
      className={`relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(160deg, var(--paper-1) 0%, var(--paper-2) 100%)',
        border: '1px solid var(--paper-border)',
        borderRadius: 'var(--paper-radius-card)',
        boxShadow: shadow,
        ...style,
      }}
    >
      {children}
    </Component>
  )
}
