import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'
import { EvolutionConfig } from '@/schemas/evolutionConfigSchema'

export const getEvolutionQrCode = async (): Promise<
  EvolutionConfig | undefined
> => {
  return trackPromise(
    api.get('api/evolution/qrCode', { withCredentials: true }),
    'loadingEvolutionQrCode',
  )
    .then((response: AxiosResponse<EvolutionConfig>) => response.data)
    .catch(error => {
      console.error(error)
      return undefined
    })
}
