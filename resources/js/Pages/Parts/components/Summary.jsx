/* eslint-disable no-undef */
import { Input, Button, Select, SelectItem } from '@nextui-org/react'
import { CLIENT_INITIAL_VALUES, SERVER_INITIAL_VALUES, DISCOUNTS } from '../../../constants/initialValues'
import { yearTotal } from '../logic/calculatedTotal'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useForm } from '@inertiajs/react'
import axios from 'axios'
import { useState } from 'react'
import { showAlert, handleSwalError, handleSwalSuccess } from '../partials/showAlert'

export const Sumnmary = ({ client, calculator, total, handleClientUpdate, handleCalculatorUpdate, handleTotalUpdate, auth }) => {
  const [totalYear, setTotalYear] = useLocalStorage('yearTotal', 0)
  const [discount, setDiscount] = useLocalStorage('discount', 0)
  const { data, setData } = useForm({
    client: '',
    serverParts: '',
    total: '',
    yearTotal: '',
    discount: ''
  })
  const [loading, setLoading] = useState(false)

  const deleteLocalStorageItems = () => {
    window.localStorage.removeItem('client')
    window.localStorage.removeItem('serverParts')
    window.localStorage.removeItem('total')
    window.localStorage.removeItem('yearTotal')
    window.localStorage.removeItem('discount')
    handleClientUpdate(CLIENT_INITIAL_VALUES)
    handleCalculatorUpdate(SERVER_INITIAL_VALUES)
    handleTotalUpdate(0)
    setTotalYear(0)
  }

  const handlePlanChange = (e) => {
    const subtotal = total !== '' ? parseFloat(total) : 0
    const discount = parseInt(e.target.value)
    const yeartotal = yearTotal({ discount, subtotal })
    setDiscount(discount)
    setTotalYear(yeartotal)
    setData({
      client: localStorage.getItem('client'),
      serverParts: localStorage.getItem('serverParts'),
      total: localStorage.getItem('total'),
      yearTotal: localStorage.getItem('yearTotal'),
      discount: localStorage.getItem('discount')
    })
  }

  const createServerQueue = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      const confirmationResult = await showAlert({
        title: '¿Estas Seguro?',
        text: 'Esta accion no se podra deshacer',
        icon: 'warning',
        loading
      })

      if (confirmationResult.isConfirmed) {
        const response = await axios.post('/api/createServer', data)

        if (!response.ok || response.status !== 201) {
          handleSwalError()
        }
        handleSwalSuccess({ response })
        deleteLocalStorageItems()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='lg:col-span-6'>
      <form onSubmit={createServerQueue}>
        <h2 className='text-center my-5 font-bold text-xl'>Cliente</h2>
        <div className='grid gap-2 grid-cols-2'>
          <Input value={client?.nameClient} type='text' isDisabled label='Nombre del Cliente' labelPlacement='outside-left' />
          <Input value={client?.email} type='email' isDisabled label='Correo electronico' labelPlacement='outside-left' />
          <Input value={client?.phone} type='tel' isDisabled label='Numero de Contacto' labelPlacement='outside-left' />
          <Input value={client?.identification} type='number' isDisabled label='Identificacion' labelPlacement='outside-left' />
        </div>
        <h2 className='text-center my-5 font-bold text-xl'>
          Caracteristicas del Servidor
        </h2>
        <div className='grid gap-2 grid-cols-2'>
          <Input value={calculator?.cpuCores} type='text' isDisabled label='Nucleos de Procesador' labelPlacement='outside-left' />
          <Input
            value={calculator?.ram} type='email' isDisabled label='Memoria RAM' labelPlacement='outside-left' endContent={
              <div className='pointer-events-none flex items-center'>
                <span className='text-default-400 text-small'>
                  GB
                </span>
              </div>
                        }
          />
          <Input
            value={calculator?.storage} type='tel' isDisabled label='Almacenamiento' labelPlacement='outside-left' endContent={
              <div className='pointer-events-none flex items-center'>
                <span className='text-default-400 text-small'>
                  GB
                </span>
              </div>
                        }
          />
          <Input
            value={calculator?.bandwidth} type='number' isDisabled label='Ancho de Banda' labelPlacement='outside-left' endContent={
              <div className='pointer-events-none flex items-center'>
                <span className='text-default-400 text-small'>
                  MB/S
                </span>
              </div>
                        }
          />
          <Input
            value={calculator?.so !== 0 ? 'Windows Server' : 'Linux'} type='text' isDisabled label='Sistema Operativo' labelPlacement='outside-left'
          />
          <Input
            value={calculator?.sql2core !== 0 ? 'Si' : 'No'} type='text' isDisabled label='Licencia SQL 2 Core' labelPlacement='outside-left'
          />
          <Input
            value={calculator?.rdp !== 0 ? 'Si' : 'No'} type='text' isDisabled label='Licencia RDP SPLA' labelPlacement='outside-left'
          />
          <Input
            value={calculator?.ip !== 0 ? 'Si' : 'No'} type='text' isDisabled label='Ip Publica' labelPlacement='outside-left'
          />
          <Input
            value={calculator?.sql2extra !== 0 ? calculator?.sql2extra : 'Ninguno'} type='text' isDisabled label='Usuarios SQL 2 CORE Adicionales' labelPlacement='outside-left'
          />
          <Input
            value={calculator?.rdpExtra !== 0 ? calculator?.rdpExtra : 'Ninguno'} type='text' isDisabled label='Usuarios RDP SPLA Extra' labelPlacement='outside-left'
          />
        </div>
        <div className='flex justify-end gap-2 my-6'>
          <h3 className='font-semibold self-center'>
            Total Servidor: $ {total !== '' ? parseFloat(total).toFixed(2) : 0} USD/Mes
          </h3>

          <Select className='max-w-xs' placeholder='Tiempo de Contrato del Servicio' label='Tiempo de Contrato' onChange={handlePlanChange} isRequired value={discount}>
            {DISCOUNTS.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className='flex justify-end gap-2 my-6'>
          <h3 className='font-semibold self-center'>
            Total Anual: ${totalYear.toFixed(2)} USD
          </h3>
        </div>
        <div className='flex justify-end gap-2 my-6'>
          {total > 0 && (<Button type='submit'> Generar Cotizacion </Button>)}
          <Button onClick={deleteLocalStorageItems}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}
