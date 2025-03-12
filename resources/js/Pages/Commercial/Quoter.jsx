import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'

export default function Quoter ({ auth, unreadNotifications }) {
  return (
    <AuthenticatedLayout
      auth={auth}
      header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>Cotizador web</h2>}
      unreadNotifications={unreadNotifications}
    >
      <Head title='Cotizador web' />

      <section className='py-12'>
        <div className='max-w-full mx-auto sm:px-6 lg:px-8'>
          <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
            <h2 className='text-center font-bold text-xl mt-3'>
              Cotizador
            </h2>
            <div className='p-6'>
              <iframe title='Report Section' width='100%' height='612' style={{ height: '75vh' }} src='https://app.powerbi.com/view?r=eyJrIjoiZDVkZTNlZTQtNDcxNi00NWY5LWIyNmEtZjU4OTlmYmI1NjcxIiwidCI6ImQzOTZjNGY4LTMyOTgtNDg5ZS04YmQ0LTFkZjZiMmE0NzE4NCJ9' allowFullScreen />
            </div>
          </div>
        </div>
      </section>
    </AuthenticatedLayout>
  )
}
