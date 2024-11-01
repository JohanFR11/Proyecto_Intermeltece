/* eslint-disable no-undef */
import Authenticated from '@/Layouts/AuthenticatedLayout'
import Header from '@/Components/Header'
import { Head } from '@inertiajs/react'
import { TableParts } from './components/Table'
import Subheader from '@/Components/Subheader'

export default function Index ({ auth, title }) {
  const subroutes = [
    {
      name: 'Roles y Permisos',
      route: route('admin.rols.index')
    },
    {
      name: 'Informes KPI',
      route: route('kpi.reports.index')
    },
    {
      name: 'Usuarios',
      route: route('admin.users.index')
    }
  ]
  return (
    <Authenticated auth={auth} header={<Header title={title} />}>

      <Head title={title} />
      <Subheader subroutes={subroutes} />

      <section className='max-w-full mx-auto sm:px-6 lg:px-8 py-4'>
        <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
          <div className='p-6'>
            <h2 className='font-bold text-2xl m-5'>Listado de partes de Servidor</h2>
            <TableParts />
          </div>
        </div>
      </section>
    </Authenticated>
  )
}
