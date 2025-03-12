import { useForm } from '@inertiajs/react'
import Toastify from 'toastify-js'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Modal from '@/Components/Modal'
import { Select, SelectItem, Button } from '@nextui-org/react'

export const ModalUser = ({ modal, closeModal, dataModal, roles }) => {
  const MySwal = withReactContent(Swal)
  const { data, setData, put, reset } = useForm({
    id: '',
    role: ''
  })
  const handleRole = (e) => {
    setData({ id: dataModal.id, role: e.target.value })
  }

  const save = (e) => {
    e.preventDefault()
    setData({ ...data, id: dataModal.id })

    try {
      if (data.role === '') {
        throw new Error('El campo de Seleccionar Rol no puede ir vacio')
      } else {
        put(`/users/${data.id}`, data)

        Toastify({
          text: 'Rol Actualizado',
          duration: 3000,
          position: 'right',
          style: {
            background: '#1CAC78'
          }
        }).showToast()

        reset()

        closeModal()
      }
    } catch (error) {
      MySwal.fire({
        title: 'Error!!',
        icon: 'error',
        text: error.message
      })
    }
  }
  return (
    <Modal show={modal} onClose={closeModal}>
      <div className='p-6'>
        <h2 className='text-lg font-medium text-gray-600 text-center'>{`Editar el rol de ${dataModal.name}`}</h2>
        <p className='text-xs text-center text-red-500'><span>*</span>Para actualizar los datos personales del usuario, dirigete a la <a className='underline hover:text-blue-500 transition duration-200 ease-in-out' href='https://admin.google.com/ac/home' target='_blank' rel='no noreferrer'>Consola de Administrador de Google</a> <span>*</span></p>
        <form onSubmit={save}>
          <div className='my-6'>
            <Select label='Seleccione el Nuevo Rol' className='max-w' onChange={handleRole} isRequired>
              {roles.map(({ id, name }) => (
                <SelectItem key={id} value={id}>{name}</SelectItem>
              ))}
            </Select>
          </div>
          <div className='mt-6 flex justify-end'>
            <Button type='submit' className='text-white bg-blue-700 hover:bg-green-600'>Actualizar Rol del Usuario</Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
