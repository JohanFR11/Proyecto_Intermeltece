import InputError from '@/Components/InputError'
import { AddIcon } from '@/Components/icons/Icons'
import { useForm } from '@inertiajs/react'
import { Input, Button } from '@nextui-org/react'

import Swal from 'sweetalert2'

export const PermissionForm = () => {
  const { data, setData, post, processing, errors, reset } = useForm({ permission: '', name: '' })

  const save = async (e) => {
    e.preventDefault()

    if (errors.permission) {
      return
    }
    Swal.showLoading()
    try {
      await post('/newPermissions', data)
      Swal.fire({
        title: 'Exito!!',
        text: 'El permiso se ha creado correctamente',
        icon: 'success',
        confirmButtonText: 'Cool',
        timer: 2000
      })
      reset()
    } catch (error) {
      Swal.fire({
        title: 'Ups!!',
        text: 'Hubo un error al enviar los datos',
        icon: 'error',
        timer: 2000
      })
    }
  }

  const handleNewPermission = (e) => {
    setData({ ...data, permission: e.target.value })
  }
  const handleNewPermissionName = (e) => {
    setData({ ...data, name: e.target.value })
  }
  return (
    <form onSubmit={save}>
      <div className='my-6'>
        <Input type='text' onChange={handleNewPermission} label='Accion del Permiso' placeholder='Ejm: admin.permission.create' isRequired radius='sm' />
      </div>
      <div className='my-6'>
        <Input type='text' onChange={handleNewPermissionName} label='Nombre del Permiso' placeholder='Ejm: Crear Nuevos Permisos' isRequired radius='sm' />
      </div>
      <InputError message={errors.permission} className='mt-2' />
      <div className='mt-6 flex justify-end'>
        <Button type='submit' startContent={<AddIcon />} className='text-white bg-blue-700 hover:bg-green-600' disabled={processing}>
          Crear Permiso
        </Button>
      </div>
    </form>
  )
}
