import { AiConfig, AiConfigForm } from '@/schemas/aiConfigSchema'
import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'

export const saveAiConfig = async (promptFields: AiConfigForm) => {
  console.log({ promptFields })
  const config = await trackPromise(
    api.post('api/ai-config/', promptFields, { withCredentials: true }),
    'savingAiConfig',
  )
    .then((response: AxiosResponse<AiConfig>) => {
      return response.data
    })
    .catch(error => {
      console.error(error)
      return undefined
    })

  return config
}
