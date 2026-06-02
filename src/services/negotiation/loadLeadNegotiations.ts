import { trackPromise } from 'react-promise-tracker'
import { AxiosResponse } from 'axios'
import api from '../api/backendApi'
import { Negotiation } from '@/schemas/negotiationSchema'

export const loadLeadNegotiations = async (leadId: string) => {
  return trackPromise(
    api
      .get<Negotiation[]>(`/api/leads/${leadId}/negotiations`, {
        withCredentials: true,
      })
      .then((res: AxiosResponse<Negotiation[]>) => res.data)
      .catch(error => {
        console.error(error)
        return [] as Negotiation[]
      }),
    'loadingLeadNegotiations',
  )
}
