export interface LeadsEnrichPhoneInput {
  leadIds: number[]
}

export interface LeadsEnrichPhoneOutput {
  success: boolean
  enrichedCount: number
  errors: Array<{
    leadId: number
    leadName: string
    error: string
  }>
}
