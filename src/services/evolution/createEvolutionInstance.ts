import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'
import { EvolutionConfig } from '@/schemas/evolutionConfigSchema'

export const createEvolutionInstance = async (): Promise<
  EvolutionConfig | undefined
> => {
  console.log('creatingEvolutionInstance')
  return trackPromise(
    api.post('api/evolution/instance', {}, { withCredentials: true }),
    'creatingEvolutionInstance',
  )
    .then((response: AxiosResponse<EvolutionConfig>) => response.data)
    .catch(error => {
      console.error(error)
      return undefined
    })
}
