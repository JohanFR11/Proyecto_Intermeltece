import { useState } from 'react'
import { Table, TableColumn, TableHeader, TableBody, TableCell, TableRow, Avatar, Button } from '@nextui-org/react'
import { EditIcon, PermissionIcon } from '@/Components/icons/Icons'
import { ModalUser } from './ModalUser'
import { THEADS_USERS } from '@/constants/initialValues'
import { ModalPermission } from './ModalPermissions'
import { usePage } from '@inertiajs/react'
import Paginator from '@/Components/Paginator'
import FailImage from '@/Components/FailImage'

export const UsersTable = () => {
  const { users, roles, permissions } = usePage().props
  const [modal, setModal] = useState(false)
  const [dataModal, setDataModal] = useState({})
  const [modalPermissions, setModalPermissions] = useState(false)

  const openModal = ({ id = '', nameRol = '', name = '' }) => {
    setModal(true)
    setDataModal({ id, nameRol, name })
  }

  const closeModal = () => {
    setModal(false)
  }

  const openPermissionsModal = ({ id, name }) => {
    setModalPermissions(true)
    setDataModal({ id, name })
  }

  return (
    <>
      <Table
        aria-label='Tabla de Usuarios del sistema' bottomContent={<Paginator paginate={users.links} />}
      >
        <TableHeader>
          {THEADS_USERS.map((column) => (
            <TableColumn key={column} className='text-center border-b border-gray-100 bg-gray-50 p-4'>{column}</TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent='No se encontraron usuarios registrados'>
          {users.data.map(({ id, name, avatar, email, roles }) => {
            const nameRol = roles[0].name
            return (
              <TableRow key={id} className='text-center'>
                <TableCell><Avatar src={avatar} showFallback fallback={<FailImage />} /></TableCell>
                <TableCell>{id}</TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>{nameRol}</TableCell>
                <TableCell>
                  <div className='flex gap-2 justify-center'>
                    <Button type='button' className='bg-gray-100 text-slate-600 font-bold py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white' onClick={() => openModal({ id, nameRol, name })}>
                      <EditIcon className='h-4 w-4' />
                    </Button>
                    <Button type='button' className='bg-warning-400 text-slate-600 font-bold py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-warning-500 hover:text-white' onPress={() => openPermissionsModal({ id, name })}>
                      <PermissionIcon className='h-4 w-4' size={24} color='#fff' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <ModalUser modal={modal} closeModal={closeModal} dataModal={dataModal} roles={roles} />
      <ModalPermission modal={modalPermissions} closeModal={() => setModalPermissions(!modalPermissions)} datamodal={dataModal} permissions={permissions} />
    </>
  )
}
