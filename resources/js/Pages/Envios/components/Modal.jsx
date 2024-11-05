import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Snippet, useDisclosure } from '@nextui-org/react'
import { dateTimeFormatted } from '@/helpers/dateHelper'

export default function ModalDelivery ({ delivery, data }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <Button color='primary' onPress={onOpen}>Mas informacion sobre tu guia</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='4xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Seguimiento del envio {data.data}</ModalHeader>
              <ModalBody>
                <p>Fecha de creacion: <strong> {dateTimeFormatted(delivery.created_at)} </strong></p>
                <p>Cliente: <strong> {delivery.customer.full_name} </strong></p>
                <p>Numero de Contacto: <strong> {delivery.customer.phone} </strong></p>
                <p>Empresa Repartidora: <strong> {delivery.carrier} </strong></p>
                <div className='flex gap-2 items-center'>
                  <p>Numero de Tracking: </p>
                  <Snippet hideSymbol color='primary'> {delivery.tracking_number} </Snippet>
                </div>
                <p>Ubicación: <strong> {delivery.shipping_address.place} </strong></p>
                <p>Dirección de envio: <strong> {delivery.shipping_address.full_address} </strong></p>
                <p>Estado: <strong> {delivery.status.name} </strong></p>
                <p>Ultima actualizacion: <strong> {dateTimeFormatted(delivery.updated_at)} </strong></p>
              </ModalBody>
              <ModalFooter>
                <a className='text-white bg-blue-800 px-5 py-2 rounded-lg mx-1 hover:bg-blue-600 transition ease-out' href={delivery.links[2].href} target='_blank' rel='noreferrer'>Ver Tracking</a>
                <Button color='danger' onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
