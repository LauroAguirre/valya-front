import { trackPromise } from 'react-promise-tracker'
import { AxiosResponse } from 'axios'
import api from './backendApi'
import { Sale } from '@/schemas/saleSchema'

export const loadContractSigningSales = async (companyId: string) => {
  return trackPromise(
    api
      .get<Sale[]>('/api/sales', {
        params: { companyId, status: 'CONTRACT_SIGNING' },
        withCredentials: true,
      })
      .then((res: AxiosResponse<Sale[]>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'loadingContractSigningSales',
  )
}

export const confirmSale = async (id: string) => {
  return trackPromise(
    api
      .post<Sale>(`/api/sales/${id}/confirm`, {}, { withCredentials: true })
      .then((res: AxiosResponse<Sale>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'confirmingSale',
  )
}

export const rejectSale = async (id: string, rejectReason: string) => {
  return trackPromise(
    api
      .post<Sale>(
        `/api/sales/${id}/reject`,
        { rejectReason },
        { withCredentials: true },
      )
      .then((res: AxiosResponse<Sale>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'rejectingSale',
  )
}
