import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchLogs, LogEntry } from '../api/logs'
import Badge from '../components/Badge'
import Pagination from '../components/Pagination'

const CHANNELS = ['application', 'domain', 'dashboard', 'performance', 'main']

function ContextBlock({ context }: { context: Record<string, unknown> }) {
  const [open, setOpen] = useState(false)
  const keys = Object.keys(context)
  if (keys.length === 0) return <span style={{ color: '#cbd5e1', fontSize: 12 }}>—</span>

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ fontSize: 11, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        {open ? '−' : '+'}{keys.length} field{keys.length !== 1 ? 's' : ''}
      </button>
      {open && (
        <pre style={{
          marginTop: 6, background: '#f8fafc', border: '1px solid #e2e8f0',
          borderRadius: 6, padding: '8px 10px', fontSize: 11,
          maxHeight: 200, overflowY: 'auto', whiteSpace: 'pre-wrap',
          wordBreak: 'break-all', color: '#334155',
        }}>
          {JSON.stringify(context, null, 2)}
        </pre>
      )}
    </div>
  )
}

function LevelPill({ level, count, active, onClick }: { level: string; count: number; active: boolean; onClick: () => void }) {
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    DEBUG:    { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' },
    INFO:     { bg: '#f0fdf4', color: '#166534', border: '#86efac' },
    NOTICE:   { bg: '#f0fdf4', color: '#166534', border: '#86efac' },
    WARNING:  { bg: '#fefce8', color: '#854d0e', border: '#fde68a' },
    ERROR:    { bg: '#fff1f2', color: '#9f1239', border: '#fda4af' },
    CRITICAL: { bg: '#fef2f2', color: '#991b1b', border: '#fca5a5' },
  }
  const c = colors[level] ?? { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' }

  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 14px', borderRadius: 20,
        border: `1px solid ${active ? '#4f46e5' : c.border}`,
        background: active ? '#4f46e5' : c.bg,
        color: active ? '#fff' : c.color,
        fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all .15s',
      }}
    >
      {level}
      <span style={{ background: 'rgba(0,0,0,.1)', borderRadius: 10, padding: '1px 6px', fontSize: 11 }}>
        {count}
      </span>
    </button>
  )
}

export default function LogViewerPage() {
  const [channel, setChannel] = useState('application')
  const [level,   setLevel]   = useState('')
  const [search,  setSearch]  = useState('')
  const [input,   setInput]   = useState('')
  const [page,    setPage]    = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['logs', channel, level, search, page],
    queryFn:  () => fetchLogs(channel, level, search, page),
  })

  const totalCount = Object.values(data?.levelCounts ?? {}).reduce((a, b) => a + b, 0)

  return (
    <div style={{ paddingTop: 16 }}>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CHANNELS.map(ch => (
            <button
              key={ch}
              onClick={() => { setChannel(ch); setLevel(''); setPage(1) }}
              style={{
                padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                border: '1px solid', cursor: 'pointer', transition: 'all .15s',
                borderColor: channel === ch ? '#4f46e5' : '#e2e8f0',
                background:  channel === ch ? '#4f46e5' : '#fff',
                color:       channel === ch ? '#fff' : '#64748b',
              }}
            >
              {ch.charAt(0).toUpperCase() + ch.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setSearch(input); setPage(1) } }}
            placeholder="Search messages…"
            style={{ padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', width: 240, color: '#1e293b' }}
          />
          <button
            onClick={() => { setSearch(input); setPage(1) }}
            style={{ padding: '7px 14px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}
          >
            Search
          </button>
          {search && (
            <button
              onClick={() => { setSearch(''); setInput(''); setPage(1) }}
              style={{ padding: '7px 14px', background: '#fff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}
            >
              Clear
            </button>
          )}
        </div>

        <div style={{ fontSize: 11, color: '#94a3b8', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, padding: '5px 10px' }}>
          {channel}.log · {data?.meta.totalCount ?? 0} entries
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => { setLevel(''); setPage(1) }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            border: `1px solid ${level === '' ? '#4f46e5' : '#e2e8f0'}`,
            background: level === '' ? '#4f46e5' : '#f1f5f9',
            color: level === '' ? '#fff' : '#475569',
            transition: 'all .15s',
          }}
        >
          All <span style={{ background: 'rgba(0,0,0,.1)', borderRadius: 10, padding: '1px 6px', fontSize: 11 }}>{totalCount}</span>
        </button>
        {Object.entries(data?.levelCounts ?? {}).map(([lvl, count]) => (
          <LevelPill
            key={lvl} level={lvl} count={count}
            active={level === lvl.toLowerCase()}
            onClick={() => { setLevel(lvl.toLowerCase()); setPage(1) }}
          />
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.06)', marginBottom: 14 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Level', 'Date / Time', 'Message', 'Context'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.5px', color: '#64748b', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>Loading…</td></tr>
            )}
            {!isLoading && (data?.data ?? []).length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>
                No log entries found. Interact with the dashboard to generate logs.
              </td></tr>
            )}
            {(data?.data ?? []).map((entry: LogEntry, i: number) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                  <Badge value={entry.level} type="level" />
                </td>
                <td style={{ padding: '10px 14px', fontSize: 11, color: '#64748b', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                  {entry.datetime ? (
                    <>
                      <div>{entry.datetime.slice(0, 10)}</div>
                      <div style={{ color: '#94a3b8' }}>{entry.datetime.slice(11, 19)}</div>
                    </>
                  ) : '—'}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ fontWeight: 500 }}>{entry.message}</div>
                  {entry.context?.exception && (
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>
                      {String(entry.context.exception).slice(0, 120)}
                    </div>
                  )}
                  {entry.context?.command && (
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{String(entry.context.command)}</div>
                  )}
                  {entry.context?.sql && (
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{String(entry.context.sql).slice(0, 120)}</div>
                  )}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <ContextBlock context={entry.context} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data?.meta && (
        <Pagination
          currentPage={data.meta.currentPage}
          totalPages={data.meta.totalPages}
          totalCount={data.meta.totalCount}
          pageSize={50}
          onPage={setPage}
        />
      )}
    </div>
  )
}
