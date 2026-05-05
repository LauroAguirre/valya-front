import { trackPromise } from 'react-promise-tracker'
import { AxiosResponse } from 'axios'
import api from '@/services/api/backendApi'
import { RealStateAgent } from '@/schemas/realStateAgentSchema'

export interface AgentSearchFilters {
  filters?: string
  uf?: string
  city?: string
  page?: number
}

export interface PaginatedAgentSearch {
  data: RealStateAgent[]
  total: number
  page: number
  totalPages: number
}

export const searchAgents = async (
  params: AgentSearchFilters,
): Promise<PaginatedAgentSearch | undefined> => {
  return trackPromise(
    api
      .get<PaginatedAgentSearch>('/api/agents/search', {
        params: { ...params, limit: 10 },
        withCredentials: true,
      })
      .then((res: AxiosResponse<PaginatedAgentSearch>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'searchingAgents',
  )
}
