import { User, UserForm } from '@/schemas/userSchema'
import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'

export const saveRealStateAgent = async (agentFields: UserForm) => {
  const saved = await trackPromise(
    api.post('api/user/agent/register', agentFields),
    'savingNewAgent',
  )
    .then((response: AxiosResponse<User>) => {
      return response.data
    })
    .catch(error => {
      console.error(error)
      return undefined
    })

  console.log({ saved })

  return saved
}
