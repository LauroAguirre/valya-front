import { trackPromise } from 'react-promise-tracker'
import { AxiosResponse } from 'axios'
import api from './backendApi'
import { Property, PropertyForm } from '@/schemas/propertySchema'
import { PropertyUnit, PropertyUnitForm } from '@/schemas/propertyUnitSchema'

export const loadDevelopments = async (companyId: string) => {
  return trackPromise(
    api
      .get<Property[]>('/api/developments', {
        params: { companyId },
        withCredentials: true,
      })
      .then((res: AxiosResponse<Property[]>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'loadingDevelopments',
  )
}

export const loadDevelopment = async (id: string) => {
  return trackPromise(
    api
      .get<Property>(`/api/developments/${id}`, { withCredentials: true })
      .then((res: AxiosResponse<Property>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'loadingDevelopment',
  )
}

export const upsertDevelopment = async (data: PropertyForm) => {
  return trackPromise(
    api
      .post<Property>('/api/developments', data, { withCredentials: true })
      .then((res: AxiosResponse<Property>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'upsertingDevelopment',
  )
}

export const deleteDevelopment = async (id: string) => {
  return trackPromise(
    api
      .delete(`/api/developments/${id}`, { withCredentials: true })
      .then(() => true)
      .catch(err => {
        console.error(err)
        return false
      }),
    'deletingDevelopment',
  )
}

export const loadDevelopmentUnits = async (propertyId: string) => {
  return trackPromise(
    api
      .get<PropertyUnit[]>(`/api/developments/${propertyId}/units`, {
        withCredentials: true,
      })
      .then((res: AxiosResponse<PropertyUnit[]>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'loadingDevelopmentUnits',
  )
}

export const upsertDevelopmentUnit = async (
  propertyId: string,
  data: PropertyUnitForm,
) => {
  return trackPromise(
    api
      .post<PropertyUnit>(`/api/developments/${propertyId}/units`, data, {
        withCredentials: true,
      })
      .then((res: AxiosResponse<PropertyUnit>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'upsertingDevelopmentUnit',
  )
}

export const deleteDevelopmentUnit = async (propertyId: string, unitId: string) => {
  return trackPromise(
    api
      .delete(`/api/developments/${propertyId}/units/${unitId}`, {
        withCredentials: true,
      })
      .then(() => true)
      .catch(err => {
        console.error(err)
        return false
      }),
    'deletingDevelopmentUnit',
  )
}
