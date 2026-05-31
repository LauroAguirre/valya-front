import { trackPromise } from 'react-promise-tracker'
import { AxiosResponse } from 'axios'
import api from '../api/backendApi'
import { PropertyImage } from '../../schemas/propertyImages'

export const uploadPropertyImage = async (
  propertyId: string,
  file: File,
): Promise<PropertyImage | undefined> => {
  const formData = new FormData()
  formData.append('file', file)

  const image = await trackPromise(
    api.post(`api/properties/${propertyId}/images`, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    `uploadingPropertyImage-${propertyId}`,
  )
    .then((response: AxiosResponse<PropertyImage>) => {
      return response.data
    })
    .catch(error => {
      console.error(error)
      return undefined
    })

  return image
}
