/* eslint-disable no-undef */
// Layout
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

// Helpers
import { TABLE_HEADER } from '../../constants/initialValues'
import { dateFormatter } from '@/helpers/dateHelper'
import { priceFormatted } from '@/helpers/priceHelper'

// Component
import { Head } from '@inertiajs/react'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@nextui-org/react'
import { DownloadIcon } from '@/Components/icons/Icons'
import Paginator from '@/Components/Paginator'
import Header from '@/Components/Header'

export default function Parts ({ auth, unreadNotifications, servers }) {
  return (
    <AuthenticatedLayout
      auth={auth}
      unreadNotifications={unreadNotifications}
      header={<Header title='Partes del servidor' />}
    >
      <Head title='Partes del servidor' />

      <section className='py-12'>
        <div className='max-w-full mx-auto sm:px-6 lg:px-8'>
          <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
            <Table
              aria-label='Tabla de cotizaciones de servidores' bottomContent={<Paginator paginate={servers.links} />}
            >

              <TableHeader>
                {TABLE_HEADER.map((header, i) => (
                  <TableColumn key={i} className='text-center'>{header}</TableColumn>
                ))}
              </TableHeader>
              {servers.data.length !== 0
                ? (
                  <TableBody>

                    {servers.data.map((server) => (
                      <TableRow key={server.id} className='text-center'>
                        <TableCell>{dateFormatter(server.created_at)}</TableCell>
                        <TableCell>{server.client_server.client}</TableCell>
                        <TableCell>{server.total_mounth} Meses</TableCell>
                        <TableCell>${priceFormatted(server.total_amount)}</TableCell>
                        <TableCell>${priceFormatted(server.total_year)}</TableCell>
                        <TableCell><a href={route('quoteserver.report', server.id)} className='text-center'><DownloadIcon size={24} /></a></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  )
                : (<TableBody emptyContent='No se encontraron Registros' />)}

            </Table>
          </div>
        </div>
      </section>
    </AuthenticatedLayout>
  )
}
