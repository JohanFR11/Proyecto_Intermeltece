/* eslint-disable no-undef */
import axios from 'axios'
import { useEffect, useState } from 'react'

export function useEpayco ({ token, message }) {
  const [transactions, setTransactions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    const getTransactions = async () => {
      try {
        const requestTransactions = await axios.post('/transactions-epayco', {
          token
        })
        setLoading(false)

        if (requestTransactions.status !== 200) {
          setLoading(false)
          throw new Error('Error al obtener los datos de las transacciones: ')
        }

        setTransactions(requestTransactions.data.transactions)
      } catch (error) {
        setLoading(false)
        setTransactions([])
        setError(message)
      }
    }

    getTransactions()
  }, [])

  return { transactions, loading, error }
}

export const getTransaction = ({ transaction, token }) => {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setDetails(null)
    const getTransaction = async () => {
      try {
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
    }

    getTransaction()
  }, [])

  return { details, loading }
}
