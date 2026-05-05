import { trackPromise } from 'react-promise-tracker'
import api from '@/services/api/backendApi'

export const removeCompanyAgent = async (agentId: string): Promise<boolean> => {
  return trackPromise(
    api
      .delete(`/api/agents/${agentId}/remove`, { withCredentials: true })
      .then(() => true)
      .catch(err => {
        console.error(err)
        return false
      }),
    'removingAgent',
  )
}
