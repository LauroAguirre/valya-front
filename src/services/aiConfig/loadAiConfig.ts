import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'
import { AiConfig } from '@/schemas/aiConfigSchema'

export const loadAiConfig = async (userId: string) => {
  const config = await trackPromise(
    api.get('api/ai-config', { params: { userId }, withCredentials: true }),
    'loadingAiConfig',
  )
    .then((response: AxiosResponse<AiConfig>) => response.data)
    .catch(error => console.error(error))
  return config
}
