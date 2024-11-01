import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { Button, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Modal, useDisclosure, ModalContent, ModalHeader, ModalBody, Input, ModalFooter } from '@nextui-org/react'
import { dateFormatter } from '@/helpers/dateHelper'
import { TABLE_TOKENS_HEADER } from '../../constants/initialValues'
import { useState } from 'react'
import axios from 'axios'
import { handleSwalError, handleSwalSuccess, mixinSwal } from '@/helpers/swalHelper'

export default function Edit ({ auth, tokens }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [data, setData] = useState({
    token: ''
  })

  const handleInput = (e) => {
    const value = e.target.value
    setData({ token: value })
  }

  const handleForm = async (e) => {
    e.preventDefault()

    try {
      const request = await axios.post('/generatetokens', data)
      if (request.status !== 200) throw new Error('Error al Crear el Token')
      handleSwalSuccess({ message: `Tu Token: ${request.data.token.plainTextToken}`, footer: 'Recuerda Copiar este Token y guardarlo en un lugar seguro, de lo contrario tendras que generar uno nuevo' }).then((result) => { if (result.isConfirmed) { window.location.reload() } })
    } catch (error) {
      handleSwalError({ error })
      console.error(error)
    }
  }

  const deleteToken = async (token, nameToken) => {
    try {
      mixinSwal({
        title: `Eliminar token ${nameToken}`,
        text: '¿Esta seguro de eliminar este Token de Acceso? Esta accion no se podra deshacer',
        icon: 'warning',
        confirmButtonText: 'Confirmar Borrado',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const result = await axios.delete(`/generatetokens/${token}`)

          if (result.status === 200) {
            handleSwalSuccess({ message: result.data.message }).then((result) => { if (result.isConfirmed) { window.location.reload() } })
          }
        }
      })
    } catch (error) {

    }
  }
  return (
    <AuthenticatedLayout
      auth={auth}
      header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>Tokens de {auth.user.name}</h2>}
    >
      <Head title='Tokens de usuario' />

      <div className='py-12'>
        <div className='max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6'>
          <div className='p-4 sm:p-8 bg-white shadow sm:rounded-lg'>
            <div className='flex justify-end'>
              <Button color='primary' onPress={onOpen}> Crear Nuevo token </Button>
            </div>
            <Table aria-label='Tokens de Acceso de usuario' className='mt-6 text-center'>
              <TableHeader>
                {TABLE_TOKENS_HEADER.map((header, i) => (
                  <TableColumn key={i} className='text-center'>{header}</TableColumn>
                ))}
              </TableHeader>
              {tokens.length === 0
                ? (
                  <TableBody emptyContent='No  tienes Tokens de Acceso creados' />
                  )
                : (
                  <TableBody>
                    {tokens.map(token => (
                      <TableRow key={token.id}>
                        <TableCell>{token.id}</TableCell>
                        <TableCell>{token.name}</TableCell>
                        <TableCell>{dateFormatter(token.created_at)}</TableCell>
                        <TableCell><Button color='danger' onClick={() => deleteToken(token.id, token.name)}>Borrar</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  )}
            </Table>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Crear Nuevo Token</ModalHeader>
              <form onSubmit={handleForm}>
                <ModalBody>
                  <Input autoFocus isRequired label='Nombre del Token' placeholder='Nombre del Servicio para usar el Token' variant='bordered' onChange={handleInput} />
                  <ModalFooter>
                    <Button type='submit' color='primary'>Crear Token</Button>
                    <Button color='danger' onPress={onClose}>Cancelar</Button>
                  </ModalFooter>
                </ModalBody>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </AuthenticatedLayout>
  )
}
