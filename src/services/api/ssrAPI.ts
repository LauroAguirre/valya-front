import axios, { AxiosInstance } from 'axios'
import * as next from 'next'
import { destroyCookie, parseCookies } from 'nookies'
import { toast } from 'sonner'
import { getPropsCookie } from '../cookies/propsCookie'

export function getAPIClient(
  ctx?:
    | Pick<next.NextPageContext, 'req'>
    | {
        req: next.NextApiRequest
      }
    | null
    | undefined,
): AxiosInstance {
  const { 'valya-auth': token } = parseCookies(ctx)

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  })

  api.interceptors.request.use(config => {
    return config
  })

  api.interceptors.response.use(
    function (config) {
      return config
    },
    function (error) {
      const props = getPropsCookie()
      if (error.response?.status === 420) {
        destroyCookie(undefined, 'valya-auth', { path: '/' })
        toast.error('Sua autenticação expirou! Voltando para o login...')
        window.location.href = `/${props.companyUrl || ''}`
      } else {
        return Promise.reject(error)
      }
    },
  )

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`
  }

  return api
}
