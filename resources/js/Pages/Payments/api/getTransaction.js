import axios from 'axios'
import { useState } from 'react'

export const getDetailsTransaction = async (transaction, token) => {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  try {
    setLoading(true)
    setDetails(null)
    const request = await axios(route('payment.details', transaction), {
      headers: {
        Authorization: token
      }
    })

    if (request.status !== 200) {
      throw new Error('Error al obtener los datos de las transacciones: ')
    }

    setLoading(false)
    setDetails(request.data.transaction)
  } catch (error) {
    console.error(error)
    setDetails(null)
    setLoading(false)
  }

  return { details, loading }
}
