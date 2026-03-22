import api from './client'

export interface SiteRecord {
  id:             string
  name:           string
  url:            string
  status:         string
  responseTimeMs: number
  notes:          string | null
  createdAt:      string
  updatedAt:      string
}

export interface PageMeta {
  currentPage: number
  totalPages:  number
  totalCount:  number
  pageSize:    number
}

export interface Statistics {
  total:          number
  active:         number
  inactive:       number
  error:          number
  pending:        number
  slow:           number
  never_checked:  number
  avg_response_ms:number
  health_score:   number
}

export interface SiteRecordsResponse {
  data:       SiteRecord[]
  meta:       PageMeta
  statistics: Statistics
}

export interface CreatePayload {
  name:   string
  url:    string
  status: string
  notes?: string
}

export const fetchSiteRecords = async (
  page = 1,
  status?: string
): Promise<SiteRecordsResponse> => {
  const params: Record<string, string | number> = { page }
  if (status) params.status = status
  const { data } = await api.get<SiteRecordsResponse>('/site-records', { params })
  return data
}

export const fetchStatuses = async (): Promise<string[]> => {
  const { data } = await api.get<{ statuses: string[] }>('/statuses')
  return data.statuses
}

export const createSiteRecord = async (payload: CreatePayload) => {
  const { data } = await api.post('/site-records', payload)
  return data
}

export const updateSiteRecord = async (id: string, payload: CreatePayload) => {
  const { data } = await api.put(`/site-records/${id}`, payload)
  return data
}

export const deleteSiteRecord = async (id: string) => {
  const { data } = await api.delete(`/site-records/${id}`)
  return data
}
