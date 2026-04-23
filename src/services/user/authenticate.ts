import { destroyCookie, setCookie } from 'nookies'
import { trackPromise } from 'react-promise-tracker'

import { AxiosResponse } from 'axios'

import { toast } from 'sonner'
import { User } from '@/schemas/userSchema'
import { RefreshKeys } from '@/schemas/refreshKeysSchema'
import api from '../api/backendApi'
import { Plan } from '@/schemas/planSchema'

export type AuthResult = {
  user: User
  plan: Plan
  planExpirationDate: Date
  token: string
  refreshTk: RefreshKeys
}

export const authenticate = async (email: string, password: string) => {
  destroyCookie(undefined, 'valya-auth', { path: '/' })

  const auth = await trackPromise(
    api.post(`api/user/login`, { email, password }),
    'authenticating',
  )
    .then((response: AxiosResponse<AuthResult>) => {
      if (response.status !== 200) throw response

      const { token } = response.data

      setCookie(undefined, 'valya-auth', token, { path: '/' })
      api.defaults.headers.Authorization = `Bearer ${token}`

      return response.data
    })
    .catch(error => {
      if (error.response) {
        if (error.response.status === 403) {
          console.error(error)
          toast.error(error.response.data.message)
        } else if (error.response.status === 401) {
          toast.error(error.response.data.message)
        } else {
          toast.error(
            'Houve um erro inesperado na autenticação. Por favor entre em contato com o suporte.',
          )
        }
      } else {
        console.error(error)
        toast.error(
          'Desculpe. O servidor não está acessível no momento. Tente novamente dentro de alguns instantes.',
        )
      }
      return {
        user: undefined,
        company: undefined,
        jwt: null,
        refreshTk: undefined,
        userSectors: [],
      }
    })

  return auth
}
