import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'
import { EvolutionConfig } from '@/schemas/evolutionConfigSchema'

export const getEvolutionConnection = async (userId: string) => {
  const conn = await trackPromise(
    api.get('api/evolution/status', {
      params: { userId },
      withCredentials: true,
    }),
    'loadingEvolutionConnection',
  )
    .then((response: AxiosResponse<EvolutionConfig>) => {
      console.log({ response })

      return response.data
    })
    .catch(error => {
      console.error(error)
      return undefined
    })

  return conn
}
