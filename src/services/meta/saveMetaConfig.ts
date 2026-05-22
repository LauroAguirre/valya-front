import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'
import { MetaConfig, MetaConfigInput } from '@/schemas/metaConfigSchema'

export const saveMetaConfig = async (
  data: MetaConfigInput,
): Promise<MetaConfig | undefined> => {
  return trackPromise(
    api.post('api/meta/config', data, { withCredentials: true }),
    'savingMetaConfig',
  )
    .then((response: AxiosResponse<MetaConfig>) => response.data)
    .catch(error => {
      console.error(error)
      return undefined
    })
}
