import { trackPromise } from 'react-promise-tracker'
import { AxiosResponse } from 'axios'
import api from '@/services/api/backendApi'
import { RealStateAgent } from '@/schemas/realStateAgentSchema'
import { NewAgentForm } from '@/schemas/newAgentSchema'

// Throws AxiosError with status 422 if CPF/CNPJ or e-mail already belongs to another user.
// Caller is responsible for handling the 422 case (search + confirm dialog).
export const createAndLinkAgent = async (
  companyId: string,
  data: NewAgentForm,
): Promise<RealStateAgent> => {
  return trackPromise(
    api
      .post<RealStateAgent>(`/api/company/${companyId}/agents`, data, {
        withCredentials: true,
      })
      .then((res: AxiosResponse<RealStateAgent>) => res.data),
    'creatingAgent',
  )
}
