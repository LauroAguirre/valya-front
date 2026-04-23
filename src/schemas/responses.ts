export interface PaginatedResponses {
  success: boolean
  data: unknown[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
