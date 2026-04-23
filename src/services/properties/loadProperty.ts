import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'
import { Property } from '@/schemas/propertySchema'

export const loadProperty = async (id: string) => {
  const property = await trackPromise(
    api.get(`/api/properties/${id}`, { withCredentials: true }),
    'loadingProperty',
  )
    .then((response: AxiosResponse<Property>) => response.data)
    .catch(error => {
      console.error(error)
      return undefined
    })
  return property
}
