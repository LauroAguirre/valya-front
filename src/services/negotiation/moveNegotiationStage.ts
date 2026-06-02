import { trackPromise } from 'react-promise-tracker'
import { AxiosResponse } from 'axios'
import api from '../api/backendApi'
import { Negotiation } from '@/schemas/negotiationSchema'
import { LeadStage } from '@/schemas/leadSchema'

// PATCH /api/negotiations/:id/stage — move a etapa da negociação.
// Se stage = WIN/LOSS a negociação é fechada automaticamente (status WON/LOST).
export const moveNegotiationStage = async (
  negotiationId: string,
  stage: LeadStage,
  obs?: string,
) => {
  return trackPromise(
    api
      .patch<Negotiation>(
        `/api/negotiations/${negotiationId}/stage`,
        { stage, obs },
        { withCredentials: true },
      )
      .then((res: AxiosResponse<Negotiation>) => res.data)
      .catch(error => {
        console.error(error)
        return undefined
      }),
    'movingNegotiationStage',
  )
}
