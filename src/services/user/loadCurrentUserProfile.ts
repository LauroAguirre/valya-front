import { parseCookies } from 'nookies'
import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'
import { User } from '@/schemas/userSchema'
import { Plan } from '@/schemas/planSchema'

export const loadCurrentUserProfile = async () => {
  try {
    const { 'valya-auth': authToken } = parseCookies()
    console.log({ authToken })
    if (authToken) {
      const currentUser = await trackPromise(
        api.get('api/user/profile', { withCredentials: true }),
        'loadingProfile',
      )
        .then(
          (
            response: AxiosResponse<{
              user: User
              plan: Plan
              planExpirationDate: Date
            }>,
          ) => {
            return response.data
          },
        )
        .catch(error => {
          throw error
        })

      return currentUser
    } else {
      return undefined
    }
  } catch (error) {
    console.error(error)
    return undefined
  }
}
