import { trackPromise } from 'react-promise-tracker'
import api from '../api/backendApi'
import { AxiosResponse } from 'axios'
import { User } from '@/schemas/userSchema'
import { ProfileForm } from '@/schemas/profileSchema'

export const saveUserProfile = async (userFields: ProfileForm) => {
  const saved = await trackPromise(
    api.put(`api/user/${userFields.id}`, userFields),
    'savingUserProfile',
  )
    .then((response: AxiosResponse<User>) => {
      return response.data
    })
    .catch(error => console.error(error))

  console.log({ saved })

  return saved
}
