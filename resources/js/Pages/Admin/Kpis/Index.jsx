/* eslint-disable no-undef */
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import KpisTable from './Components/KpisTable'
import KpiModalFragment from './Fragments/KpiModalFragment'
import Subheader from '@/Components/Subheader'

export default function Index ({ auth }) {
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
      name: 'Usuarios',
      route: route('admin.users.index')
    }
  ]
  return (
    <AuthenticatedLayout
      auth={auth}
      header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>Administración de Kpis</h2>}
    >
      <Head title='Administración de Kpis' />
      <Subheader subroutes={subroutes} />

      <section className='max-w-full py-4 mx-auto sm:px-6 lg:px-8'>
        <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
          <div className='p-6'>
            <div className='flex justify-between m-5'>
              <h2 className='font-bold text-2xl'>Kpis en Vivo</h2>
              {auth?.permissions?.includes('admin.kpis.create') ? (<KpiModalFragment />) : ''}
            </div>
            <KpisTable />
          </div>
        </div>
      </section>
    </AuthenticatedLayout>
  )
}
