import { useTrm } from '@/hooks/useTrm'

export const usdToCop = (usdValue) => {
  const { formattedTrmToday } = useTrm()
  let convertedValue = 0
  const trmToday = formattedTrmToday

  convertedValue = parseFloat(usdValue) * trmToday
  const formattedValue = convertedValue.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })

  return formattedValue
}
