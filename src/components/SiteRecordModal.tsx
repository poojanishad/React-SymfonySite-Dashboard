import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSiteRecord, updateSiteRecord, fetchStatuses, SiteRecord } from '../api/siteRecords'
import Modal from './Modal'

interface Props {
  record?:  SiteRecord | null
  onClose:  () => void
}

const field = (label: string, children: React.ReactNode) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 500 }}>
      {label}
    </label>
    {children}
  </div>
)

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  border: '1px solid #e2e8f0', borderRadius: 8,
  fontSize: 13, outline: 'none', color: '#1e293b',
  background: '#fff',
}

export default function SiteRecordModal({ record, onClose }: Props) {
  const isEdit = !!record
  const qc     = useQueryClient()

  const [form, setForm] = useState({
    name:   record?.name   ?? '',
    url:    record?.url    ?? '',
    status: record?.status ?? 'pending',
    notes:  record?.notes  ?? '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (record) {
      setForm({ name: record.name, url: record.url, status: record.status, notes: record.notes ?? '' })
    }
  }, [record])

  const { data: statuses = [] } = useQuery({
    queryKey: ['statuses'],
    queryFn:  fetchStatuses,
    staleTime: Infinity,
  })

  const mutation = useMutation({
    mutationFn: () =>
      isEdit
        ? updateSiteRecord(record!.id, form)
        : createSiteRecord(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['site-records'] })
      onClose()
    },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg ?? 'Something went wrong.')
    },
  })

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    mutation.mutate()
  }

  return (
    <Modal title={isEdit ? 'Edit Site Record' : 'Add Site Record'} onClose={onClose}>
      <form onSubmit={submit}>
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: 8, padding: '8px 12px', marginBottom: 14, fontSize: 13 }}>
            {error}
          </div>
        )}

        {field('Name',
          <input style={inputStyle} value={form.name} onChange={set('name')} placeholder="My Website" required />
        )}
        {field('URL',
          <input style={inputStyle} type="url" value={form.url} onChange={set('url')} placeholder="https://example.com" required />
        )}
        {field('Status',
          <select style={inputStyle} value={form.status} onChange={set('status')}>
            {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        )}
        {field('Notes (optional)',
          <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 70 }} value={form.notes} onChange={set('notes')} placeholder="Any notes..." />
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
          <button
            type="button" onClick={onClose}
            style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', padding: '8px 16px', borderRadius: 8, fontSize: 13 }}
          >
            Cancel
          </button>
          <button
            type="submit" disabled={mutation.isPending}
            style={{ background: '#4f46e5', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500, opacity: mutation.isPending ? .7 : 1 }}
          >
            {mutation.isPending ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
