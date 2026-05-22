import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'

export const deleteMetaConfig = async (): Promise<boolean> => {
  return trackPromise(
    api.delete('api/meta/config', { withCredentials: true }),
    'deletingMetaConfig',
  )
    .then(() => true)
    .catch(error => {
      console.error(error)
      return false
    })
}
