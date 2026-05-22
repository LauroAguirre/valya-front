import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'
import { MetaConfig } from '@/schemas/metaConfigSchema'

export const getMetaConfig = async (): Promise<MetaConfig | null | undefined> => {
  return trackPromise(
    api.get('api/meta/config', { withCredentials: true }),
    'loadingMetaConfig',
  )
    .then((response: AxiosResponse<MetaConfig | null>) => response.data)
    .catch(error => {
      console.error(error)
      return undefined
    })
}
