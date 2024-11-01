/* eslint-disable no-undef */
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { UsersTable } from './components/UsersTable'
import Header from '@/Components/Header'
import Subheader from '@/Components/Subheader'

export default function Users ({ auth }) {
  const subroutes = [
    {
      name: 'Roles y Permisos',
      route: route('admin.rols.index')
    },
    {
      name: 'Servidor Datacenter',
      route: route('admin.partsedit.index')
    },
    {
      name: 'Informes KPI',
      route: route('kpi.reports.index')
    }
  ]
  return (
    <AuthenticatedLayout
      auth={auth}
      header={<Header title='Usuarios' />}
    >
      <Head title='Usuarios' />
      <Subheader subroutes={subroutes} />

      <section className='max-w-full sm:px-6 lg:px-8 py-4'>
        <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
          <div className='p-6'>
            <UsersTable />
          </div>
        </div>
      </section>
    </AuthenticatedLayout>
  )
}
