interface Props {
  currentPage: number
  totalPages:  number
  totalCount:  number
  pageSize:    number
  onPage:      (page: number) => void
}

export default function Pagination({ currentPage, totalPages, totalCount, pageSize, onPage }: Props) {
  if (totalPages <= 1) return null

  const start = (currentPage - 1) * pageSize + 1
  const end   = Math.min(currentPage * pageSize, totalCount)

  const range: number[] = []
  for (let p = Math.max(1, currentPage - 2); p <= Math.min(totalPages, currentPage + 2); p++) {
    range.push(p)
  }

  const btn = (page: number, label: React.ReactNode, disabled = false, active = false) => (
    <button
      key={String(label)}
      onClick={() => !disabled && onPage(page)}
      disabled={disabled}
      style={{
        padding: '5px 12px',
        borderRadius: 6,
        border: '1px solid',
        borderColor: active ? '#4f46e5' : '#e2e8f0',
        background: active ? '#4f46e5' : '#fff',
        color: active ? '#fff' : disabled ? '#cbd5e1' : '#64748b',
        fontSize: 12,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all .15s',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 0 24px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: 12, color: '#64748b', marginRight: 8 }}>
        Showing {start}–{end} of {totalCount.toLocaleString('en-IN')}
      </span>
      {btn(currentPage - 1, '← Prev', currentPage <= 1)}
      {range.map(p => btn(p, p, false, p === currentPage))}
      {btn(currentPage + 1, 'Next →', currentPage >= totalPages)}
    </div>
  )
}
