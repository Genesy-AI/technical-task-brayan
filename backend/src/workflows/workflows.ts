import { proxyActivities } from '@temporalio/workflow'
import type * as activities from './activities'
import type { LeadInfo } from './activities/utils'

const retryPolicy = {
  maximumAttempts: 3,
  initialInterval: '1 second',
  backoffCoefficient: 2,
  maximumInterval: '10 seconds',
} as const

const { verifyEmail } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 second',
  retry: retryPolicy,
})

const {
  enrichPhoneProviderOne,
  enrichPhoneProviderTwo,
  enrichPhoneProviderThree,
  savePhoneEnrichResult,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 seconds',
  retry: retryPolicy,
})

export async function verifyEmailWorkflow(email: string): Promise<boolean> {
  return await verifyEmail(email)
}

export async function enrichPhoneWorkflow(lead: LeadInfo): Promise<string | null> {
  const providers = [enrichPhoneProviderOne, enrichPhoneProviderTwo, enrichPhoneProviderThree]

  let phone: string | null = null
  for (const provider of providers) {
    phone = await provider(lead)
    if (phone) break
  }

  await savePhoneEnrichResult(lead.id, phone)
  return phone
}
