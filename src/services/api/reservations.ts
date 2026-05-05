import { trackPromise } from 'react-promise-tracker'
import { AxiosResponse } from 'axios'
import api from './backendApi'
import { Reservation } from '@/schemas/reservationSchema'

export const requestReservation = async (unitId: string, notes?: string) => {
  return trackPromise(
    api
      .post<Reservation>(
        '/api/reservations',
        { unitId, notes },
        { withCredentials: true },
      )
      .then((res: AxiosResponse<Reservation>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'requestingReservation',
  )
}

export const loadPendingReservations = async (companyId: string) => {
  return trackPromise(
    api
      .get<Reservation[]>('/api/reservations/pending', {
        params: { companyId },
        withCredentials: true,
      })
      .then((res: AxiosResponse<Reservation[]>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'loadingPendingReservations',
  )
}

export const approveReservation = async (
  id: string,
  dates: { reservedAt: Date; expiresAt: Date },
) => {
  return trackPromise(
    api
      .patch<Reservation>(`/api/reservations/${id}/approve`, dates, {
        withCredentials: true,
      })
      .then((res: AxiosResponse<Reservation>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'approvingReservation',
  )
}

export const rejectReservation = async (id: string) => {
  return trackPromise(
    api
      .patch<Reservation>(
        `/api/reservations/${id}/reject`,
        {},
        { withCredentials: true },
      )
      .then((res: AxiosResponse<Reservation>) => res.data)
      .catch(err => {
        console.error(err)
        return undefined
      }),
    'rejectingReservation',
  )
}
