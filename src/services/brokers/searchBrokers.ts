import { trackPromise } from 'react-promise-tracker'
import { AxiosResponse } from 'axios'
import api from '@/services/api/backendApi'
import { RealStateAgent } from '@/schemas/realStateAgentSchema'

export const searchBrokers = async (query: string): Promise<RealStateAgent[]> => {
  return trackPromise(
    api
      .get<RealStateAgent[]>('/api/brokers/search', {
        params: { q: query },
        withCredentials: true,
      })
      .then((res: AxiosResponse<RealStateAgent[]>) => res.data)
      .catch(err => {
        console.error(err)
        return []
      }),
    'searchingBrokers',
  )
}
