import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface LeadInfo {
  id: number
  firstName: string
  lastName: string | null
  email: string | null
  companyName: string | null
}

// Abstraction layer: normalizes lead info and queries a provider.
// Replace each stub body with the real provider SDK/HTTP call.
async function queryProvider(providerName: string, lead: LeadInfo): Promise<string | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  if (providerName === 'one' && lead.firstName === 'Alice') return '+1 555 000 0001'
  if (providerName === 'two' && lead.firstName === 'Bob') return '+1 555 000 0002'
  if (providerName === 'three' && lead.firstName === 'Carol') return '+1 555 000 0003'
  return null
}

export async function enrichPhoneProviderOne(lead: LeadInfo): Promise<string | null> {
  return queryProvider('one', lead)
}

export async function enrichPhoneProviderTwo(lead: LeadInfo): Promise<string | null> {
  return queryProvider('two', lead)
}

export async function enrichPhoneProviderThree(lead: LeadInfo): Promise<string | null> {
  return queryProvider('three', lead)
}

export async function savePhoneEnrichResult(
  leadId: number,
  phone: string | null
): Promise<void> {
  await prisma.lead.update({
    where: { id: leadId },
    data: {
      phoneNumber: phone,
      phoneEnrichStatus: phone ? 'done' : 'failed',
    },
  })
}

export async function verifyEmail(email: string): Promise<boolean> {
  if (email.includes('john.doe')) {
    return false
  }

  if (email.includes('jane.smith')) {
    await new Promise((resolve) => setTimeout(resolve, 20000))
  }

  if (/\+/.test(email)) {
    return false
  }

  return true
}
