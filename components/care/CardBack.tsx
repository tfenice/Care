type Props = {
  className?: string
  size?: 'sm' | 'lg'   // sm = fan deck cards, lg = reveal format
  animate?: boolean     // subtle breathing animation (reveal only)
}

export default function CardBack({ className = '', size = 'sm', animate = false }: Props) {
  const markRing  = size === 'lg' ? 'w-8 h-8'   : 'w-4 h-4'
  const markDot   = size === 'lg' ? 'w-3 h-3'   : 'w-1.5 h-1.5'
  const markText  = size === 'lg' ? 'text-[11px] tracking-[0.35em]' : 'text-[9px] tracking-[0.3em]'
  const markGap   = size === 'lg' ? 'gap-2.5'   : 'gap-1.5'

  return (
    <div
      className={`relative overflow-hidden select-none ${size === 'lg' ? 'rounded-3xl' : 'rounded-2xl'} ${animate ? 'care-back-breathe' : ''} ${className}`}
      style={{
        background: 'linear-gradient(135deg, #EDE0CD 0%, #E5D4B8 55%, #D4BA93 100%)',
        boxShadow: size === 'lg'
          ? '0 12px 40px rgba(139,111,78,0.18), inset 0 1px 0 rgba(255,255,255,0.5)'
          : '0 4px 20px rgba(139,111,78,0.15), inset 0 1px 0 rgba(255,255,255,0.45)',
        border: '1px solid rgba(201,169,122,0.35)',
      }}
    >
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.065]"
        style={{
          backgroundImage: 'radial-gradient(circle, #8B6F4E 1px, transparent 1px)',
          backgroundSize: size === 'lg' ? '14px 14px' : '10px 10px',
        }}
      />

      {/* Corner marks for reveal format */}
      {size === 'lg' && (
        <>
          <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(139,111,78,0.25)' }} />
          <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(139,111,78,0.25)' }} />
          <div className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(139,111,78,0.25)' }} />
          <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(139,111,78,0.25)' }} />
        </>
      )}

      {/* Center CARE mark */}
      <div className={`relative h-full flex flex-col items-center justify-center ${markGap}`}>
        <div
          className={`${markRing} rounded-full flex items-center justify-center`}
          style={{ border: '1px solid rgba(139,111,78,0.4)' }}
        >
          <div
            className={`${markDot} rounded-full`}
            style={{ background: 'rgba(139,111,78,0.45)' }}
          />
        </div>
        <p
          className={`${markText} uppercase font-light`}
          style={{ color: 'rgba(139,111,78,0.55)' }}
        >
          CARE
        </p>
      </div>
    </div>
  )
}
