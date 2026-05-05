import { trackPromise } from 'react-promise-tracker'
import { AxiosResponse } from 'axios'
import api from '@/services/api/backendApi'
import { RealStateAgent } from '@/schemas/realStateAgentSchema'

export const linkAgent = async (
  companyId: string,
  agentId: string,
): Promise<RealStateAgent | undefined> => {
  return trackPromise(
    api
      .post<RealStateAgent>(
        `/api/company/${companyId}/agents/${agentId}`,
        {},
        { withCredentials: true },
      )
      .then((res: AxiosResponse<RealStateAgent>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'linkingAgent',
  )
}
