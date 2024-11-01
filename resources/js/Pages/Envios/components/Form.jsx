import CorrectResponse from '@/Components/CorrectResponse'
import Error from '@/Components/Error'
import Loader from '@/Components/Loader'
import { Button, Input } from '@nextui-org/react'
import axios from 'axios'
import { useState } from 'react'
import ModalDelivery from './Modal'

export default function FormShipping () {
  const [data, setData] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(false)
  const [delivery, setDelivery] = useState(false)

  const sendDelivery = async (e) => {
    setLoading(true)
    setError(null)
    setMessage(null)
    e.preventDefault()
    try {
      const request = await axios.post('/api/searchDelivery', data)

      if (request.status !== 200) {
        throw new Error(`Error al obtener el seguimiento de tu envio: ${data}`)
      }

      setMessage('Informacion del seguimiento: ' + data.data)
      setDelivery(request.data.data)
      setLoading(false)
      setError(null)
    } catch (error) {
      setError('Error al obtener el seguimiento con al referencia: ' + data.data)
      setLoading(false)
    }
  }

  const handleDevideryId = (e) => {
    setData(prevData => ({ ...prevData, data: e.target.value }))
  }

  return (
    <form onSubmit={sendDelivery}>
      <Input type='text' label='Número de Guia' placeholder='EJM: PQXXXXXXXXXX' isRequired color='primary' onChange={handleDevideryId} />
      <div className='my-2 flex justify-center'>
        <Button color='primary' type='submit' className='w-1/2'>Seguir envio</Button>
      </div>
      {loading && <Loader />}

      {error && <Error message={error} />}

      {
      message &&
        <CorrectResponse message={message} className='flex gap-2 my-5 justify-center items-center'>
          <ModalDelivery data={data} delivery={delivery} />
        </CorrectResponse>
      }
    </form>
  )
}
