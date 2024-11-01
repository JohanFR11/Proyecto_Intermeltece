import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import CardList from './Fragments/CardList'
import ModalComponent from './Fragments/Modal'
import { ROLES_CONSTANTS } from '@/constants/initialValues'

export default function Index ({ auth, unreadNotifications }) {
  const roleName = auth.user.roles[0].name
  return (
    <AuthenticatedLayout
      auth={auth}
      unreadNotifications={unreadNotifications}
      header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>Documentos HSEQ</h2>}
    >
      <Head title='Documentos HSEQ' />

      <section className='py-12'>
        <div className='max-w-full mx-auto sm:px-6 lg:px-8'>
          <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
            <div className='flex justify-between m-5'>
              <h2 className='text-center font-bold text-2xl'>Documentos HSEQ</h2>
              {
                roleName.includes(ROLES_CONSTANTS.Admin) ? <ModalComponent /> : roleName.includes(ROLES_CONSTANTS.Hseq) ? <ModalComponent /> : ' '
              }

            </div>
            <CardList user={roleName} />
          </div>
        </div>
      </section>
    </AuthenticatedLayout>
  )
}
