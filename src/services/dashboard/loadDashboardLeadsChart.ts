import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'
import { ChartDataPoint } from '@/lib/types'

interface LeadsChartItem {
  month: string
  newLeads: number
  closedDeals: number
}

export const loadDashboardLeadsChart = async (
  userId: string,
): Promise<ChartDataPoint[] | undefined> => {
  return trackPromise(
    api
      .get(`api/dashboard/client/${userId}/leadsChart`, {
        params: { months: 6 },
        withCredentials: true,
      })
      .then((response: AxiosResponse<LeadsChartItem[]>) => {
        return response.data.map(item => ({
          month: item.month,
          leads: item.newLeads,
          fechados: item.closedDeals,
        }))
      })
      .catch(error => {
        console.error(error)
        return undefined
      }),
    'loadingDashboardChart',
  )
}
