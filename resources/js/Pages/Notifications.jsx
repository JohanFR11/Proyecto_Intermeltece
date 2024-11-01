/* eslint-disable no-undef */
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { Link, Spacer } from '@nextui-org/react'

export default function Notifications ({ auth, unreadNotifications, notification }) {
  const notificationsRender = notification.data
  return (
    <AuthenticatedLayout
      auth={auth} unreadNotifications={unreadNotifications} header={
        <h2 className='font-semibold text-xl text-gray-800 leading-tight'>
          Notificaciones
        </h2>
    }
    >
      <Head title='Notifications' />
      <div className='py-12'>
        <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
          {unreadNotifications !== 0
            ? (
              <>
                {
                notificationsRender.map((notification) => (
                  <div key={notification.id}>
                    <div className='flex flex-col p-8 bg-white shadow-md hover:shadow-lg rounded-2xl'>
                      <div className='flex items-center justify-between'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='w-16 h-16 rounded-2xl p-3 border border-blue-100 text-blue-400 bg-blue-50' fill='none'
                          viewBox='0 0 24 24' stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                        <div className='flex flex-col ml-3'>
                          <h2 className='font-medium leading-none'>{notification.data.title}</h2>
                          <p className='text-sm text-gray-600 leading-none mt-1'>{notification.data.name}</p>
                        </div>
                        <Link href={route('markNotifications', notification.id)} className='flex-no-shrink bg-red-500 px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 text-white rounded-full'>Descartar</Link>
                      </div>
                    </div>
                    <Spacer y={4} />
                  </div>
                ))
                }
              </>
              )
            : (
              <h2 className='text-center font-bold text-4xl'>No Tienes notificaciones pendientes</h2>
              )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
