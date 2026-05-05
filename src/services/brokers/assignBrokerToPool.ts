import { trackPromise } from 'react-promise-tracker'
import { AxiosResponse } from 'axios'
import api from '@/services/api/backendApi'
import { RealStateAgent } from '@/schemas/realStateAgentSchema'

export const assignBrokerToPool = async (
  companyId: string,
  agentId: string,
): Promise<RealStateAgent | undefined> => {
  return trackPromise(
    api
      .post<RealStateAgent>(
        `/api/company/${companyId}/brokers`,
        { agentId },
        { withCredentials: true },
      )
      .then((res: AxiosResponse<RealStateAgent>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'assigningBroker',
  )
}

export const removeBrokerFromPool = async (
  companyId: string,
  agentId: string,
): Promise<boolean> => {
  return trackPromise(
    api
      .delete(`/api/company/${companyId}/brokers/${agentId}`, {
        withCredentials: true,
      })
      .then(() => true)
      .catch(err => {
        console.error(err)
        return false
      }),
    'removingBroker',
  )
}
