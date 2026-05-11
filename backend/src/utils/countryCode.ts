import countries from 'i18n-iso-countries'

export const isValidCountryCode = (code: string): boolean => {
  if (!code || code.length !== 2) return false
  return countries.isValid(code.toUpperCase())
}
