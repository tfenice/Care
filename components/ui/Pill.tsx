type PillProps = {
  children: React.ReactNode
  className?: string
}

export default function Pill({ children, className = '' }: PillProps) {
  return (
    <span className={`inline-flex items-center text-xs text-muted font-light border border-sand rounded-full px-3 py-1 ${className}`}>
      {children}
    </span>
  )
}
