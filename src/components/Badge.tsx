const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  active:   { bg: '#dcfce7', color: '#166534' },
  inactive: { bg: '#f1f5f9', color: '#475569' },
  pending:  { bg: '#fef9c3', color: '#854d0e' },
  error:    { bg: '#fee2e2', color: '#991b1b' },
}

const LEVEL_COLORS: Record<string, { bg: string; color: string }> = {
  DEBUG:     { bg: '#f0f9ff', color: '#0369a1' },
  INFO:      { bg: '#f0fdf4', color: '#166534' },
  NOTICE:    { bg: '#f0fdf4', color: '#166534' },
  WARNING:   { bg: '#fefce8', color: '#854d0e' },
  ERROR:     { bg: '#fff1f2', color: '#9f1239' },
  CRITICAL:  { bg: '#fef2f2', color: '#991b1b' },
  ALERT:     { bg: '#fef2f2', color: '#991b1b' },
  EMERGENCY: { bg: '#1e0000', color: '#fca5a5' },
}

interface Props {
  value: string
  type?: 'status' | 'level'
}

export default function Badge({ value, type = 'status' }: Props) {
  const map   = type === 'level' ? LEVEL_COLORS : STATUS_COLORS
  const style = map[value] ?? map[value.toUpperCase()] ?? { bg: '#f1f5f9', color: '#475569' }

  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 9px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.3px',
      background: style.bg,
      color: style.color,
    }}>
      {value}
    </span>
  )
}
