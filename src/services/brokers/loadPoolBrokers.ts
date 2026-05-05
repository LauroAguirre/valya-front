import { trackPromise } from 'react-promise-tracker'
import { AxiosResponse } from 'axios'
import api from '@/services/api/backendApi'
import { RealStateAgent } from '@/schemas/realStateAgentSchema'

export const loadPoolBrokers = async (companyId: string): Promise<RealStateAgent[]> => {
  return trackPromise(
    api
      .get<RealStateAgent[]>(`/api/company/${companyId}/brokers`, {
        withCredentials: true,
      })
      .then((res: AxiosResponse<RealStateAgent[]>) => res.data)
      .catch(err => {
        console.error(err)
        return []
      }),
    'loadingPoolBrokers',
  )
}
