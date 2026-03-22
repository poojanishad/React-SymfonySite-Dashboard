import api from './client'

export interface LogEntry {
  level:    string
  datetime: string
  message:  string
  context:  Record<string, unknown>
  raw:      string
}

export interface LogsResponse {
  data:        LogEntry[]
  levelCounts: Record<string, number>
  channels:    string[]
  meta: {
    currentPage: number
    totalPages:  number
    totalCount:  number
  }
}

export const fetchLogs = async (
  channel = 'application',
  level   = '',
  search  = '',
  page    = 1
): Promise<LogsResponse> => {
  const params: Record<string, string | number> = { channel, page }
  if (level)  params.level  = level
  if (search) params.search = search
  const { data } = await api.get<LogsResponse>('/logs', { params })
  return data
}
