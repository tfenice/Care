type PageHeaderProps = {
  title: React.ReactNode
  eyebrow?: React.ReactNode
  subtitle?: React.ReactNode
  className?: string
  centered?: boolean
}

export default function PageHeader({
  title,
  eyebrow = 'CARE',
  subtitle,
  className = '',
  centered = false,
}: PageHeaderProps) {
  return (
    <header className={`${centered ? 'text-center ' : ''}space-y-1 pt-2 ${className}`}>
      {eyebrow && (
        <p className="text-sm tracking-[0.25em] uppercase text-brown font-light">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl font-semibold text-ink">{title}</h1>
      {subtitle && (
        <p className="text-muted font-light leading-7">{subtitle}</p>
      )}
    </header>
  )
}
