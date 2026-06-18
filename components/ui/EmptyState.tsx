type EmptyStateProps = {
  title: string
  body?: string
  className?: string
}

export default function EmptyState({ title, body, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`rounded-3xl border px-6 py-12 text-center space-y-3 ${className}`}
      style={{
        background: 'linear-gradient(160deg, var(--paper-1) 0%, var(--paper-2) 100%)',
        borderColor: 'var(--paper-border)',
      }}
    >
      <p className="text-sm font-light" style={{ color: 'var(--ink-2)' }}>{title}</p>
      {body && (
        <p className="text-xs font-light" style={{ color: 'var(--ink-4)' }}>{body}</p>
      )}
    </div>
  )
}
