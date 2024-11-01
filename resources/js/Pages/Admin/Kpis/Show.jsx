import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'

export default function Show ({ auth, data }) {
  const report = JSON.parse(data.data)
  return (
    <AuthenticatedLayout
      auth={auth}
      header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>Administración de Kpis</h2>}
    >
      <Head title='Administración de Kpis' />

      <section className='py-12'>
        <div className='max-w-8xl mx-auto sm:px-6 lg:px-8'>
          <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
            <div className='p-6'>
              <h2 className='font-bold text-2xl'>{data.reportName}</h2>
            </div>
            <div dangerouslySetInnerHTML={{ __html: report.data }} className='flex justify-center my-6' />
          </div>
        </div>
      </section>
    </AuthenticatedLayout>
  )
}
