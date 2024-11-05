import { AddIcon } from '@/Components/icons/Icons'
import { Button } from '@nextui-org/react'

export const HeaderTable = ({ openModal, auth }) => {
  return (
    <div className='flex justify-between my-4'>
      <h2 className='font-bold text-2xl m-5'>Roles del Sistema</h2>
      <div className='flex gap-2'>
        <Button type='button' className='text-white bg-blue-900 hover:bg-green-600 hover:scale-110' startContent={<AddIcon />} onClick={() => openModal({ operation: 2 })}>
          Añadir rol
        </Button>
        {auth.userPermissions.includes('admin.roles.create') || auth.userRole.includes('Super Administrador')
          ? (
            <Button type='button' className='text-white bg-cyan-800 hover:bg-green-600 hover:scale-110' startContent={<AddIcon />} onClick={() => openModal({ operation: 4 })}>
              Añadir permisos
            </Button>
            )
          : ''}

      </div>
    </div>
  )
}
