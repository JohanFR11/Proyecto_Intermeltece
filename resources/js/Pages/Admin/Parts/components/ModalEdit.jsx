/* eslint-disable no-undef */
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from '@nextui-org/react'
import { useState } from 'react'
import { usdToCop } from '@/helpers/usdToCop'
import { EditIcon } from '@/Components/icons/Icons'
import axios from 'axios'
import { handleSwalError, handleSwalSuccess } from '@/helpers/swalHelper'

export const ModalEdit = ({ dataProduct = {} }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [data, setData] = useState({
    id: dataProduct?.id,
    product: dataProduct?.product,
    usdPrice: dataProduct?.usdPrice
  })

  const handlePriceChange = (e) => {
    if (e.target.value !== '') {
      setData((prevData) => ({ ...prevData, usdPrice: e.target.value }))
    } else {
      setData((prevData) => ({ ...prevData, usdPrice: 0 }))
    }
    console.log()
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()

    try {
      const request = await axios.put(route('admin.partsedit.update', data.id), data)

      if (request.status === 200) {
        handleSwalSuccess({ message: request.data.Message }).then((result) => { if (result.isConfirmed) { window.location.reload() } })
      } else {
        throw new Error(request.data.Message)
      }
      console.log(request)
    } catch (error) {
      handleSwalError({ message: error.message })
    }
  }

  return (
    <>
      <Button onPress={onOpen} color='primary'><EditIcon /></Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>{data.product}</ModalHeader>
              <form onSubmit={handleSubmitForm}>
                <ModalBody>

                  <Input autoFocus label='Producto' variant='bordered' placeholder={data.product} />
                  <div className='grid grid-cols-2 gap-2'>
                    <Input
                      label='Valor en Dolares' variant='bordered' placeholder={data.usdPrice} startContent={
                        <div className='pointer-events-none flex items-center'>
                          <span className='text-default-400 text-small'>$</span>
                        </div>
                  }
                      endContent={
                        <div className='pointer-events-none flex items-center'>
                          <span className='text-default-400 text-small'>USD</span>
                        </div>
                  }
                      onChange={handlePriceChange}
                    />

                    <Input
                      readOnly label='Valor en Pesos' variant='bordered' value={usdToCop(data.usdPrice)} endContent={
                        <div className='pointer-events-none flex items-center'>
                          <span className='text-default-400 text-small'>COP</span>
                        </div>
                  }
                    />

                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color='danger' variant='light' onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button color='primary' onPress={onClose} type='submit'>
                    Editar
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
