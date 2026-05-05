import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'
import { ClientKpi } from '@/app/(client)/dashboard/page'

export const loadDashbaordKpis = async (
  userId: string,
): Promise<ClientKpi[] | undefined> => {
  return trackPromise(
    api
      .get(`api/dashboard/client/${userId}/kpis`, { withCredentials: true })
      .then((response: AxiosResponse<{ kpis: ClientKpi[] }>) => {
        return response.data.kpis
      })
      .catch(error => {
        console.error(error)
        return undefined
      }),
    'loadingDashboardKpis',
  )
}
