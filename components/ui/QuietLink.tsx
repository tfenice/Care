import Link from 'next/link'

type QuietLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}

export default function QuietLink({ href, children, className = '' }: QuietLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-block text-xs font-light underline underline-offset-4 hover:opacity-60 transition-opacity ${className}`}
      style={{ color: 'var(--ink-brown)' }}
    >
      {children}
    </Link>
  )
}
