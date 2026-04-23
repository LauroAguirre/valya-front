import { trackPromise } from 'react-promise-tracker'
import { Property } from '../../schemas/propertySchema'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'
import { PropertyFields } from '../../app/(client)/imoveis/[id]/page'

export const saveProperty = async (data: PropertyFields) => {
  const property = await trackPromise(
    api.post(`api/properties/${data.userId}`, data, { withCredentials: true }),
    'savingProperty',
  )
    .then((response: AxiosResponse<Property>) => {
      return response.data
    })
    .catch(error => {
      console.error(error)
      return undefined
    })

  return property
}
