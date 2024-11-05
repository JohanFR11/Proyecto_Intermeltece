// eslint-disable-next-line no-unused-vars
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button, useDisclosure } from '@nextui-org/react'
import { EditIcon } from '@/Components/icons/Icons'
import ModalEdit from './ModalEdit'

export const RolsTable = ({ openModal, roles }) => {
  const THEADS = ['Id', 'Rol', 'Acciones']

  return (
    <Table aria-label='Tabla de Roles del sistema'>
      <TableHeader>
        {THEADS.map((head) => (
          <TableColumn key={head} className='border-b border-gray-100 bg-gray-50 p-4'>{head}</TableColumn>
        ))}
      </TableHeader>
      <TableBody emptyContent='No existen Roles de usuario'>
        {roles.map((rol, index) => {
          const isLast = index === roles.length - 1
          const classes = isLast ? 'p-4' : 'p-4 border-b border-gray-50'
          return (
            <TableRow key={rol.id}>
              <TableCell className={classes}>{rol.id}</TableCell>
              <TableCell className={classes}>{rol.name}</TableCell>
              <TableCell className={classes}>
                <div className='flex gap-2 justify-center'>
                  <ModalEdit roleEdit={rol} />
                  <Button type='button' className='bg-gray-100 text-slate-600 font-bold py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-yellow-300 hover:text-white' onClick={() => openModal({ operation: 3, title: rol.name })}>
                    <EditIcon className='h-4 w-4' />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
