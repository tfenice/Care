type EyebrowProps = {
  children: React.ReactNode
  tone?: 'muted' | 'warm'
  className?: string
}

export default function Eyebrow({ children, tone = 'muted', className = '' }: EyebrowProps) {
  const color = tone === 'warm' ? 'var(--ink-brown)' : 'var(--ink-3)'
  return (
    <p
      className={`text-[10px] font-light uppercase ${className}`}
      style={{ letterSpacing: 'var(--track-mark)', color }}
    >
      {children}
    </p>
  )
}
