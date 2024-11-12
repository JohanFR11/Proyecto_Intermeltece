import React, { useState } from "react";
import { handleSwalSuccess, handleSwalError } from '@/helpers/swalHelper'
import { useDisclosure, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react'
import axios from 'axios'

export default function CreateFolder() {

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [data, setData] = useState({
    name: ''
  })

  const handleInputChange = (e) => setData((prevData) => ({ ...prevData, name: e.target.value }))

  const handleSubmitForm = async (event) => {
    event.preventDefault();
        try {
            const response = await axios.post(route('resources.hseq.create'), data)
            if (response.status !== 201) {
              throw new Error(response.data.message)
            }
      
            handleSwalSuccess({ message: response.data.message }).then((result) => { if (result.isConfirmed) { window.location.reload() } })
          } catch (error) {
            handleSwalError({ message: error.message })
          }

    }


  return (
    <div>
    <Button
        onPress={onOpen}
        className="text-white bg-blue-700 hover:bg-blue-900 focus:ring-4 focus:ring-blue-300 rounded text-sm px-5 py-2.5 transition ease-in-out"
      >
        crear carpeta
      </Button>
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      backdrop="blur"
      size="5xl"
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmitForm}>
            <ModalHeader className="flex flex-col gap-1">
              Crear Nueva Carpeta
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Nombre de la Carpeta"
                name="folderName"
                placeholder="Ingrese el nombre de la carpeta"
                variant="bordered"
                required
                onChange={handleInputChange}
              />
            </ModalBody>
            <ModalFooter>

              <Button color="danger" variant="flat" onPress={onClose}>
                
                Cerrar
              </Button>
              <Button color="primary" type="submit">
                
                Crear
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
    </div>
  );
};
