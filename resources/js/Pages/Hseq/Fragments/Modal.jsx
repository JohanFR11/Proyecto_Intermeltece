/* eslint-disable no-undef */
import 'filepond/dist/filepond.min.css'
import { useDisclosure, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react'
import axios from 'axios'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import { useState } from 'react'
import { handleSwalSuccess, handleSwalError } from '@/helpers/swalHelper'
import { usePage } from '@inertiajs/react'

const ACCEPTFILES = ['application/pdf']
registerPlugin(FilePondPluginFileValidateType)

export default function ModalComponent () {
  const { csrfToken } = usePage().props
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const server = {
    url: '/uploadFile',
    headers: {
      'x-csrf-token': csrfToken
    }
  }
  const [data, setData] = useState({
    hseqFilename: '',
    filename: ''
  })

  const handleInputChange = (e) => setData((prevData) => ({ ...prevData, hseqFilename: e.target.value }))
  const handleFileUpload = (fileItem) => setData((prevData) => ({ ...prevData, filename: fileItem[0].file.name }))
  const handleSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(route('resources.hseq.store'), data)
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
      <Button onPress={onOpen} className='text-white bg-blue-700 hover:bg-blue-900 focus:ring-4 focus:ring-blue-300 rounded text-sm px-5 py-2.5 transition ease-in-out'>
        Agregar Documento
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center' backdrop='blur' size='5xl'>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmitForm}>
              <ModalHeader className='flex flex-col gap-1'>Agregar Documento</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label='Titulo'
                  name='hseqFilename'
                  placeholder='Titulo del Archivo'
                  variant='bordered'
                  required
                  onChange={handleInputChange}
                />
                <FilePond required allowFileTypeValidation acceptedFileTypes={ACCEPTFILES} name='filename' maxFiles={1} labelIdle='Arrastra y suelta el PDF o <span class="filepond--label-action">Explorar</span>' server={server} onupdatefiles={handleFileUpload} />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onPress={onClose}>
                  Cerrar
                </Button>
                <Button color='primary' onPress={onClose} type='submit'>
                  Subir
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
