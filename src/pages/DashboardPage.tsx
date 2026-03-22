import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSiteRecords, deleteSiteRecord, SiteRecord } from '../api/siteRecords'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import Pagination from '../components/Pagination'
import SiteRecordModal from '../components/SiteRecordModal'

const STATUSES = ['active', 'inactive', 'pending', 'error']

function ResponseTime({ ms }: { ms: number }) {
  if (ms === 0) return <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>—</span>
  if (ms <= 200) return <span style={{ color: '#16a34a' }}>{ms}ms</span>
  if (ms <= 500) return <span style={{ color: '#d97706' }}>{ms}ms</span>
  return <span style={{ color: '#dc2626' }}>{ms}ms</span>
}

export default function DashboardPage() {
  const qc = useQueryClient()

  const [page,         setPage]         = useState(1)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [showModal,    setShowModal]    = useState(false)
  const [editRecord,   setEditRecord]   = useState<SiteRecord | null>(null)
  const [deleteConfirm,setDeleteConfirm]= useState<string | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['site-records', page, filterStatus],
    queryFn:  () => fetchSiteRecords(page, filterStatus || undefined),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSiteRecord,
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['site-records'] })
      setDeleteConfirm(null)
    },
  })

  const stats = data?.statistics
  const meta  = data?.meta

  const filterBtn = (label: string, value: string) => (
    <button
      key={value}
      onClick={() => { setFilterStatus(value); setPage(1) }}
      style={{
        padding: '5px 14px', borderRadius: 20,
        border: '1px solid',
        borderColor: filterStatus === value ? '#4f46e5' : '#e2e8f0',
        background:  filterStatus === value ? '#4f46e5' : '#fff',
        color:       filterStatus === value ? '#fff' : '#64748b',
        fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all .15s',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ paddingTop: 16 }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
        <StatCard value={stats?.total?.toLocaleString('en-IN') ?? '—'} label="Total Sites"   color="#4f46e5" />
        <StatCard value={stats?.active   ?? '—'} label="Active"       color="#16a34a" />
        <StatCard value={stats?.error    ?? '—'} label="Error"        color="#dc2626" />
        <StatCard value={stats?.pending  ?? '—'} label="Pending"      color="#d97706" />
        <StatCard value={stats?.slow     ?? '—'} label="Slow >500ms"  color="#64748b" />
        <StatCard
          value={`${stats?.avg_response_ms ?? 0}ms`}
          label="Avg Response"
          color="#1e293b"
          barPct={stats?.health_score}
          barColor={
            (stats?.health_score ?? 0) < 50 ? '#dc2626' :
            (stats?.health_score ?? 0) < 75 ? '#d97706' : '#16a34a'
          }
        />
        {meta && (
          <StatCard
            value={meta.totalCount.toLocaleString('en-IN')}
            label="Total Records"
            color="#4f46e5"
            sub={`Page ${meta.currentPage}/${meta.totalPages}`}
          />
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        {filterBtn('All', '')}
        {STATUSES.map(s => filterBtn(s.charAt(0).toUpperCase() + s.slice(1), s))}
        <button
          onClick={() => { setEditRecord(null); setShowModal(true) }}
          style={{
            marginLeft: 'auto', padding: '8px 18px',
            background: '#4f46e5', color: '#fff',
            border: 'none', borderRadius: 8,
            fontSize: 13, fontWeight: 500,
          }}
        >
          + Add Site
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.06)', marginBottom: 14 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Name', 'URL', 'Status', 'Response', 'Updated', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '11px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.5px', color: '#64748b', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>Loading…</td></tr>
            )}
            {isError && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: '#dc2626' }}>Failed to load. Is Symfony running on port 8000?</td></tr>
            )}
            {!isLoading && !isError && data?.data.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No records found.</td></tr>
            )}
            {data?.data.map(record => (
              <tr key={record.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <td style={{ padding: '11px 16px', fontWeight: 600 }}>{record.name}</td>
                <td style={{ padding: '11px 16px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b', fontSize: 12 }}>
                  <a href={record.url} target="_blank" rel="noreferrer" style={{ color: '#4f46e5' }}>{record.url}</a>
                </td>
                <td style={{ padding: '11px 16px' }}><Badge value={record.status} /></td>
                <td style={{ padding: '11px 16px' }}><ResponseTime ms={record.responseTimeMs} /></td>
                <td style={{ padding: '11px 16px', color: '#94a3b8', fontSize: 12 }}>
                  {new Date(record.updatedAt).toLocaleDateString('en-IN')}
                </td>
                <td style={{ padding: '11px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => { setEditRecord(record); setShowModal(true) }}
                      style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', color: '#4f46e5', fontSize: 12, cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(record.id)}
                      style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #fca5a5', background: '#fff', color: '#dc2626', fontSize: 12, cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && (
        <Pagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          totalCount={meta.totalCount}
          pageSize={meta.pageSize}
          onPage={setPage}
        />
      )}

      {showModal && (
        <SiteRecordModal
          record={editRecord}
          onClose={() => { setShowModal(false); setEditRecord(null) }}
        />
      )}

      {deleteConfirm && (
        <div
          onClick={() => setDeleteConfirm(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}
          >
            <h2 style={{ fontSize: 16, marginBottom: 10 }}>Delete Site Record?</h2>
            <p style={{ color: '#64748b', marginBottom: 20, fontSize: 14 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', color: '#64748b', fontSize: 13, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                disabled={deleteMutation.isPending}
                style={{ padding: '8px 16px', border: 'none', borderRadius: 8, background: '#dc2626', color: '#fff', fontSize: 13, cursor: 'pointer', opacity: deleteMutation.isPending ? .7 : 1 }}
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
