import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'
import { Message } from '@/schemas/messageSchema'
import { PaginatedResponses } from '@/schemas/responses'

interface LoadChatHistoryProps {
  page: number
  leadId: string
}

export const loadChatHistory = async ({
  page,
  leadId,
}: LoadChatHistoryProps) => {
  const chat = await trackPromise(
    api.get(`api/leads/${leadId}/messages`, {
      params: { page, limit: 100 },
      withCredentials: true,
    }),
    'loadingChatHistory',
  )
    .then((response: AxiosResponse<PaginatedResponses>) => {
      return {
        ...response.data,
        data: response.data.data as Message[],
      }
    })
    .catch(error => {
      console.error(error)
      return {
        success: false,
        data: [] as Message[],
        pagination: {
          total: 0,
          page: 0,
          limit: 0,
          totalPages: 0,
        },
      }
    })

  return chat
}
