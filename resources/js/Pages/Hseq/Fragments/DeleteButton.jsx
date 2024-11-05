/* eslint-disable no-undef */
import { Button } from '@nextui-org/react'
import { showAlert, handleSwalError, handleSwalSuccess } from '@/helpers/swalHelper'
import axios from 'axios'

export default function DeleteButton ({ id }) {
  const handleDelete = async (id) => {
    showAlert({
      title: 'Advertencia',
      icon: 'warning',
      text: '¿Seguro desea eliminar el elemento?'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const request = await axios.delete(route('resources.hseq.destroy', id))
          if (request.status !== 200) {
            throw new Error(request.data.message)
          } else {
            handleSwalSuccess({ message: request.data.message }).then((result) => { if (result.isConfirmed) { window.location.reload() } })
          }
        } catch (error) {
          handleSwalError({ message: error.message })
        }
      }
    })
  }
  return (
    <Button className='text-tiny text-white bg-red-800 px-4 py-2 rounded-full mx-1' color='danger' radius='lg' size='sm' onPress={() => handleDelete(id)}>
      Borrar
    </Button>
  )
}
