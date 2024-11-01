/* eslint-disable no-undef */
import { Head } from '@inertiajs/react'
import { useTrm } from '@/hooks/useTrm'
import { TrmGraph } from '@/Components/Trm'
import { HomeFooter } from './Home/Components/Footer'
import NavbarHome from './Home/Components/Navbar'

export default function Welcome ({ auth }) {
  const { valores, loading, trmInCop } = useTrm()
  return (
    <>
      <Head title='Bienvenido' />
      <NavbarHome auth={auth} />
      <div className='relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white'>
        <div className='max-w-7xl mx-auto p-6 lg:p-8'>
          <div className='mt-4'>
            <div className='grid grid-cols-1 md:grid-cols-1  lg:gap-8'>
              <div className='scale-100 p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500'>
                <div className=''>
                  {loading
                    ? (
                      <p>Cargando...</p>
                      )
                    : (
                      <TrmGraph valores={valores} trmInCop={trmInCop} />
                      )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-white/80'>
        <HomeFooter />
      </div>
    </>
  )
}
