import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react'
import { getDetailsTransaction } from '../api/getTransaction'
import SapLoader from '@/Components/SapLoader'

export default async function ModalPayment ({ transaction, token }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { details, loading } = getDetailsTransaction(transaction, token)
  return (
    <>
      <Button onPress={onOpen}>{details.referencePayco}</Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {loading && <SapLoader />}
          {
            details && (
              <>
                <ModalHeader className='flex flex-col gap-1'>{details.referencePayco}</ModalHeader>
                <ModalBody>
                  <p>{details.referencePayco}</p>
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
