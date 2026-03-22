interface Props {
  value:    string | number
  label:    string
  color?:   string
  sub?:     string
  barPct?:  number
  barColor?:string
}

export default function StatCard({ value, label, color = '#4f46e5', sub, barPct, barColor }: Props) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      padding: 16,
      boxShadow: '0 1px 2px rgba(0,0,0,.04)',
    }}>
      <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, color }}>{value}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, textTransform: 'uppercase', letterSpacing: '.5px' }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{sub}</div>}
      {barPct !== undefined && (
        <>
          <div style={{ background: '#e2e8f0', borderRadius: 4, height: 5, marginTop: 6 }}>
            <div style={{
              height: '100%', borderRadius: 4,
              background: barColor ?? '#16a34a',
              width: `${Math.min(100, Math.max(0, barPct))}%`,
              transition: 'width .4s ease',
            }} />
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{barPct}% healthy</div>
        </>
      )}
    </div>
  )
}
