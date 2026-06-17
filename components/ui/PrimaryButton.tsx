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

export default function PrimaryButton(props: LinkProps | ButtonProps) {
  const className = `block w-full rounded-full bg-ink text-cream py-4 text-center font-light tracking-wide transition-opacity hover:opacity-75 disabled:opacity-40 disabled:cursor-not-allowed ${focusRing} ${props.className ?? ''}`

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
