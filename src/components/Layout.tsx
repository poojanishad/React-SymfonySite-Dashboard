import { Outlet, NavLink } from 'react-router-dom'

const s: Record<string, React.CSSProperties> = {
  header: {
    background: '#fff',
    borderBottom: '1px solid #e2e8f0',
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,.06)',
  },
  logo: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1e293b',
  },
  logoSpan: { color: '#4f46e5' },
  nav: { display: 'flex', gap: 8, marginLeft: 8 },
  wrap: { maxWidth: 1400, margin: '0 auto', padding: '0 24px' },
  badge: {
    marginLeft: 'auto',
    fontSize: 12,
    color: '#64748b',
    background: '#f1f5f9',
    padding: '3px 10px',
    borderRadius: 20,
    border: '1px solid #e2e8f0',
  },
}

const navStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  padding: '6px 16px',
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  border: '1px solid',
  borderColor: isActive ? '#4f46e5' : '#e2e8f0',
  background: isActive ? '#4f46e5' : '#fff',
  color: isActive ? '#fff' : '#64748b',
  transition: 'all .15s',
})

export default function Layout() {
  return (
    <>
      <header style={s.header}>
        <div style={s.logo}>
          Site<span style={s.logoSpan}>Dashboard</span>
        </div>
        <nav style={s.nav}>
          <NavLink to="/dashboard" style={navStyle}>Dashboard</NavLink>
          <NavLink to="/logs"      style={navStyle}>Logs</NavLink>
        </nav>
        <span style={s.badge}>DDD · CQRS · Symfony 7.4 LTS</span>
      </header>
      <div style={s.wrap}>
        <Outlet />
      </div>
    </>
  )
}
