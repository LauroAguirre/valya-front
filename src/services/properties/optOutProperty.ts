import { trackPromise } from 'react-promise-tracker'
import api from '@/services/api/backendApi'

export const optOutProperty = async (
  propertyId: string,
  optedOut: boolean,
): Promise<boolean> => {
  return trackPromise(
    api
      .patch(
        `/api/properties/${propertyId}/opt-out`,
        { optedOut },
        { withCredentials: true },
      )
      .then(() => true)
      .catch(err => {
        console.error(err)
        return false
      }),
    `optOut-${propertyId}`,
  )
}
