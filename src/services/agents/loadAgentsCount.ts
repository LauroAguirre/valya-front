import { AxiosResponse } from 'axios'
import api from '@/services/api/backendApi'

interface AgentsCountResponse {
  total: number
}

// Contagem pública de corretores cadastrados — usada na landing page (sem auth).
export async function loadAgentsCount(): Promise<number | undefined> {
  return api
    .get<AgentsCountResponse>('/api/agents/count')
    .then((res: AxiosResponse<AgentsCountResponse>) => res.data.total)
    .catch(err => {
      console.error(err)
      return undefined
    })
}
