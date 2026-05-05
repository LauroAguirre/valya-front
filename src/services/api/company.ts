import { trackPromise } from 'react-promise-tracker'
import { AxiosResponse } from 'axios'
import api from './backendApi'
import {
  ConstructionCompany,
  ConstructionCompanyForm,
  ConstructionCompanyUsers,
  ConstructionCompanyUsersForm,
} from '@/schemas/constructionCompanySchema'

export const loadCompanyProfile = async (companyId: string) => {
  return trackPromise(
    api
      .get<ConstructionCompany>(`/api/company/${companyId}`, { withCredentials: true })
      .then((res: AxiosResponse<ConstructionCompany>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'loadingCompanyProfile',
  )
}

export const upsertCompanyProfile = async (data: ConstructionCompanyForm) => {
  return trackPromise(
    api
      .post<ConstructionCompany>('/api/company', data, { withCredentials: true })
      .then((res: AxiosResponse<ConstructionCompany>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'upsertingCompanyProfile',
  )
}

export const loadCompanyUsers = async (companyId: string) => {
  return trackPromise(
    api
      .get<ConstructionCompanyUsers[]>(`/api/company/${companyId}/users`, {
        withCredentials: true,
      })
      .then((res: AxiosResponse<ConstructionCompanyUsers[]>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'loadingCompanyUsers',
  )
}

export const upsertCompanyUser = async (
  companyId: string,
  data: ConstructionCompanyUsersForm,
) => {
  return trackPromise(
    api
      .post<ConstructionCompanyUsers>(`/api/company/${companyId}/users`, data, {
        withCredentials: true,
      })
      .then((res: AxiosResponse<ConstructionCompanyUsers>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'upsertingCompanyUser',
  )
}

export const removeCompanyUser = async (companyId: string, userId: string) => {
  return trackPromise(
    api
      .delete(`/api/company/${companyId}/users/${userId}`, { withCredentials: true })
      .then(() => true)
      .catch(err => {
        console.error(err)
        return false
      }),
    'removingCompanyUser',
  )
}
