import { useEffect, useState } from 'react'
import { trmApi } from '@/services/Api/trmApi'

export function useTrm () {
  const [priceDollar, setPriceDollar] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [trmToday, setTrmToday] = useState(0)

  useEffect(() => {
    const getPriceDollar = async () => {
      setLoading(true)
      try {
        const { valores } = await trmApi()
        const fisrtTrm = valores[0].valor
        setLoading(false)
        setTrmToday(fisrtTrm)
        setPriceDollar(valores)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    getPriceDollar()
  }, [])

  const sendValues = priceDollar
    .slice(0, 7)
    .sort((a, b) => new Date(a.vigenciahasta) - new Date(b.vigenciahasta))

  const formattedTrmToday = parseFloat(trmToday)
  const trmInCop = formattedTrmToday.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })

  return { valores: sendValues, trmInCop, loading, error, formattedTrmToday }
}
