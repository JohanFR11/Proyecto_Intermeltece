/* eslint-disable no-undef */
import axios from 'axios'
import { useEffect, useState } from 'react'

export const useSalesToday = () => {
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)
  const [kpi, setKpi] = useState(null)

  const getSalesToday = async () => {
    try {
      setLoading(true)
      setKpi(null)
      const request = await axios(route('masterdata.salestoday'))
      if (request.status !== 200) {
        setLoading(false)
        throw new Error('Error al obtener los datos del Servidor')
      }
      setKpi(request.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setKpi(null)
      setError(true)
    }
  }

  useEffect(() => {
    getSalesToday()
  }, [])

  return { loaderKpiSap: loading, error, kpi, getData: getSalesToday }
}
