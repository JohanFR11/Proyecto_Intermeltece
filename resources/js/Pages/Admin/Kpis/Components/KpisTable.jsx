/* eslint-disable no-undef */
import { Table, TableColumn, TableHeader, TableBody, TableCell, TableRow } from '@nextui-org/react'
import { TABLE_KPIS_HEADER } from '@/constants/initialValues'
import { Link, usePage } from '@inertiajs/react'
import DeleteButton from '../Fragments/DeleteButton2'
import Paginator from '@/Components/Paginator'

export default function KpisTable (id) {
  const { auth, reports, reportsData2 } = usePage().props



  return (
    <Table
      aria-label='Tabla de informes de PowerBy' bottomContent={<Paginator paginate={reports.links} />}
    >
      <TableHeader>
        {TABLE_KPIS_HEADER.map((header, i) => (
          <TableColumn key={i} className='text-center'>{header}</TableColumn>
        ))}
      </TableHeader>
      {
        reportsData2.length === 0
          ? (
            <TableBody emptyContent='No hay Informes Subidos'>{[]}</TableBody>
            )
          : (
            <TableBody>
              {reportsData2.map(({ id, name, roles }) => {
                const userHasRole = roles.find(role => role.name === auth.userRole[0])
                if (userHasRole) {
                  return (
                    <TableRow key={id} className='text-center'>
                      <TableCell>{name}</TableCell>
                      <TableCell>
                        <p className='text-red-500 font-semibold italic'> LA URL DEL REPORTE NO SE PUEDE ENCONTRAR </p>
                      </TableCell>
                      <TableCell>
                        <Link className='text-white bg-blue-800 px-5 py-2 rounded-lg mx-1 hover:bg-blue-600 transition ease-out' href={route('kpi.reports.show', id)}>Ver</Link>
                        
                        <DeleteButton id={id} />
                        
                      </TableCell>
                    </TableRow>
                  )
                } else {
                  return null
                }
              })}
            </TableBody>
            )
      }

    </Table>
  )
}
