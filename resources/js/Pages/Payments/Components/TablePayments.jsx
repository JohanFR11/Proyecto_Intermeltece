/* eslint-disable no-undef */
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react'
import { currencyFormatter } from '@/helpers/currencyFormatter'
import { THEADS_PAYMENTS } from '@/constants/initialValues'
import { dateFormatter } from '@/helpers/dateHelper'
import axios from 'axios'
import { useState } from 'react'
import SapLoader from '@/Components/SapLoader'

export default function TablePayments ({ transactions, token }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const getDetailsTransaction = async (transaction) => {
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
  }

  const spanStatus = ({ status }) => {
    if (status === 'Cancelada') {
      return (<span className='font-bold text-yellow-500'>Cancelada</span>)
    } else if (status === 'Aceptada') {
      return (<span className='font-bold text-green-500'>Aprobada</span>)
    } else {
      return (<span className='font-bold text-red-500'>Rechazada</span>)
    }
  }

  return (
    <>
      <Table aria-label='Tabla de transacciones Epayco Meltec'>
        <TableHeader>
          {THEADS_PAYMENTS.map((head, key) => (
            <TableColumn key={key} className='text-center'>{head}</TableColumn>
          ))}

        </TableHeader>
        <TableBody>
          {transactions.map(({ referencePayco, names, lastnames, paymentMethod, bank, amount, currency, status, transactionDate }) => (
            <TableRow key={referencePayco} className={`text-center ${status === 'Rechazada' ? 'bg-red-500/25' : status === 'Cancelada' ? 'bg-yellow-500/25' : 'bg-green-500/25'}`}>
              <TableCell> <Button color={status === 'Rechazada' ? 'danger' : status === 'Cancelada' ? 'warning' : 'success'} className='text-white' onClick={() => getDetailsTransaction(referencePayco)} onPress={onOpen}>{referencePayco}</Button></TableCell>
              <TableCell>{dateFormatter(transactionDate)}</TableCell>
              <TableCell>{names} {lastnames}</TableCell>
              <TableCell>{paymentMethod} - {bank}</TableCell>
              <TableCell>{currencyFormatter({ value: amount, money: currency })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='3xl'>
        <ModalContent>
          {loading && <SapLoader message='Obteniendo datos de la Referencia, espera un momento' />}
          {
            details && (
              <>
                <ModalHeader className='flex gap-1 font-normal'>Referencia N°: <span className='font-black text-blue-600/80'>{details.referencePayco}</span></ModalHeader>
                <ModalBody>
                  <div className='flex flex-row gap-5 justify-between'>
                    <h5 className='font-semibold text-blue-600/80 text-right'>Estado: {spanStatus({ status: details.status })}
                    </h5>
                    <h5 className='font-semibold text-blue-600/80 text-right'>{dateFormatter(details.transactionDate)}</h5>
                  </div>
                  <div className='flex flex-row justify-between gap-2 items-center'>
                    <div className='px-4 text-left flex-col flex flex-1 gap-3 '>
                      <h5 className='font-semibold text-blue-600/80'>Descripción del pago: <p className='text-black font-normal'>{details.description}</p></h5>
                      <div className='flex flex-row gap-5'>
                        <h5 className='font-semibold text-blue-600/80'>Cliente: <p className='text-black font-normal'>{details.firstName} {details.lastName}</p></h5>
                        <h5 className='font-semibold text-blue-600/80'>Número de Contacto: <p className='text-black font-normal'>{details.mobilePhone}</p></h5>
                      </div>
                      <h5 className='font-semibold text-blue-600/80'>Direccion IP de la transacción: <p className='text-black font-normal'>{details.ip}</p></h5>
                      <div className='flex flex-row gap-5'>
                        <h5 className='font-semibold text-blue-600/80'>Medio de pago - Banco: <p className='text-black font-normal'>{details.paymentMethod} {details.bank}</p></h5>
                        <h5 className='font-semibold text-blue-600/80'>Monto en COP: <p className='text-black font-normal'>{currencyFormatter({ value: details.amount, money: 'COP' })}</p></h5>
                      </div>
                      {
                        details.status === 'Rechazada' && (
                          <h5 className='font-semibold text-blue-600/80'>Motivo de Rechazo: <p className='text-black font-normal'>{details.response}</p></h5>
                        )
                      }
                    </div>

                    <picture className='aspect-square w-60 h-60 flex-none'>
                      <img src='/img/factura.webp' alt='Factura de referencia - Designed by Freepik' />
                    </picture>

                  </div>
                </ModalBody>
                <ModalFooter />
              </>
            )
          }
        </ModalContent>

      </Modal>

    </>
  )
}
