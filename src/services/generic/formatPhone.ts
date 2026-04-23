export const formatPhone = (phoneNumber: string | null | undefined) => {
  if (!phoneNumber) return ''

  const cleanedValue = phoneNumber.replace(/\D/g, '').slice(0, 11)
  return cleanedValue.length < 11
    ? cleanedValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, ' $1-$2')
        .replace(/(-\d{4})(\d)/, '$1')
    : cleanedValue.replace(/^(\d{2})(\d{1})(\d{4})(\d{4}).*/, '($1) $2 $3-$4')
}
