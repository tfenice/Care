import Link from 'next/link'
import type { ButtonHTMLAttributes } from 'react'
import { focusRing } from './focus'

type BaseProps = {
  children: React.ReactNode
  className?: string
}

type LinkProps = BaseProps & {
  href: string
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never
}

export default function SecondaryButton(props: LinkProps | ButtonProps) {
  const className = `inline-flex items-center justify-center rounded-full border border-sand px-6 py-3 text-sm font-light text-muted transition-colors hover:border-ink hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed ${focusRing} ${props.className ?? ''}`

  if ('href' in props) {
    const { href, children } = props as LinkProps
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  const { children, className: _className, ...buttonProps } = props
  return (
    <button className={className} {...buttonProps}>
      {children}
    </button>
  )
}
