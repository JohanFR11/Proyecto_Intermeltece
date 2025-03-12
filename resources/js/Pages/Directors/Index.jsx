import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'

export default function Directors ({ auth, unreadNotifications }) {
  return (
    <AuthenticatedLayout
      auth={auth}
      header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>Informe de KPIS</h2>}
      unreadNotifications={unreadNotifications}
    >
      <Head title='Informe de KPIS' />

      <section className='py-12'>
        <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
          <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
            <h2 className='text-center font-bold text-xl mt-3'>
              Informes de KPI Meltec
            </h2>
            <div className='p-6'>
              <iframe title='Report Section' width='100%' height='612' style={{ height: '75vh' }} src='https://app.powerbi.com/view?r=eyJrIjoiNzIzNDZhMjMtODU4MC00MDM2LWI5YzAtOGYwNGM0NTk2MDE0IiwidCI6ImQzOTZjNGY4LTMyOTgtNDg5ZS04YmQ0LTFkZjZiMmE0NzE4NCJ9&navContentPaneEnabled=false' allowFullScreen />
            </div>
          </div>
        </div>
      </section>
    </AuthenticatedLayout>
  )
}
