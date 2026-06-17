type PageShellProps = {
  children: React.ReactNode
  className?: string
  centered?: boolean
}

export default function PageShell({ children, className = '', centered = false }: PageShellProps) {
  const base = centered
    ? 'min-h-screen flex items-center justify-center px-6 py-12'
    : 'max-w-md mx-auto px-6 py-10 pb-32'

  return (
    <div className={`${base} ${className}`}>
      {children}
    </div>
  )
}
