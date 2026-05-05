import { trackPromise } from 'react-promise-tracker'
import { AxiosResponse } from 'axios'
import api from '@/services/api/backendApi'
import { RealStateAgent } from '@/schemas/realStateAgentSchema'

export interface PaginatedAgents {
  data: RealStateAgent[]
  total: number
  page: number
  totalPages: number
}

export const loadCompanyAgents = async (
  companyId: string,
  page: number = 1,
): Promise<PaginatedAgents | undefined> => {
  return trackPromise(
    api
      .get<PaginatedAgents>(`/api/company/${companyId}/agents`, {
        params: { page, limit: 30 },
        withCredentials: true,
      })
      .then((res: AxiosResponse<PaginatedAgents>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'loadingCompanyAgents',
  )
}
