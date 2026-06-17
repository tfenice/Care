type SurfaceCardProps = {
  children: React.ReactNode
  className?: string
  as?: 'section' | 'div'
}

export default function SurfaceCard({
  children,
  className = '',
  as: Component = 'section',
}: SurfaceCardProps) {
  return (
    <Component className={`rounded-3xl border border-sand bg-white/40 px-6 py-6 ${className}`}>
      {children}
    </Component>
  )
}
