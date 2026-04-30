import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'
import { Lead } from '@/schemas/leadSchema'

export const loadActiveLeads = async (userId: string) => {
  const leads = await trackPromise(
    api.get('/api/leads', {
      params: {
        userId,
      },
      withCredentials: true,
    }),
    'loadingActiveLeads',
  )
    .then((response: AxiosResponse<Lead[]>) => {
      return response.data
    })
    .catch(error => {
      console.error(error)
      return []
    })

  return leads
}
