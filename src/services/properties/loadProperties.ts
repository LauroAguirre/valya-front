import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'
import { PaginatedResponses } from '@/schemas/responses'
import { Property } from '@/schemas/propertySchema'

export const loadPropertiesPage = async (
  page: number,
  search?: string,
): Promise<PaginatedResponses> => {
  console.log('Buscando propriedades...')
  const propertiesPage = await trackPromise(
    api.get('/api/properties', {
      params: {
        page,
        limit: 10,
        search,
      },
      withCredentials: true,
    }),
    'loadingProperties',
  )
    .then((response: AxiosResponse<PaginatedResponses>) => {
      console.log({ response })
      return {
        ...response.data,
        data: response.data.data as Property[],
      }
    })
    .catch(error => {
      console.error(error)
      return {
        success: false,
        data: [] as Property[],
        pagination: {
          total: 0,
          page: 0,
          limit: 0,
          totalPages: 0,
        },
      }
    })

  return propertiesPage
}
