/* eslint-disable no-undef */
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { useTrm } from '@/hooks/useTrm'
import { TrmGraph } from '@/Components/Trm'
import SidebarMeta from './Home/Components/SideBarMeta'
import { dateTimeFormatted } from '@/helpers/dateHelper'
import { useSalesToday } from '@/hooks/useSalesToday'
import SapLoader from '@/Components/SapLoader'
import { Button } from '@nextui-org/react'

export default function Dashboard ({ auth, unreadNotifications }) {
  const { valores, loading, trmInCop } = useTrm()
  const { loaderKpiSap, error, kpi, getData } = useSalesToday()

  return (
    <AuthenticatedLayout
      auth={auth}
      unreadNotifications={unreadNotifications}
      header={
        <h2 className='font-semibold text-xl text-gray-800 leading-tight'>
          Inicio Meltec Comunicaciones S.A
        </h2>
            }
    >
      <Head title='Dashboard' />
      <main className='overflow-y-auto'>
        <div className='grid grid-flow-row grid-cols-3 items-center justify-stretch gap-3 auto-rows-fr'>
          {loading ? <p>Cargando...</p> : <TrmGraph valores={valores} trmInCop={trmInCop} />}

          <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg p-4 col-span-2'>
            <h2 className='font-bold text-xl text-center py-2'>Meta Meltec 2024</h2>

            <h5 className='text-right p-4 font-semibold italic text-zinc-600/50'>Ultima Actualización: <span>{dateTimeFormatted(new Date())}</span> </h5>

            {loaderKpiSap && <SapLoader message='Obteniendo Meta Actual. Por favor espere...' />}

            {kpi && <SidebarMeta kpi={kpi} />}

            {error && (<h3 className='text-center bg-red-500 rounded-md py-6 text-white font-bold'>Error al Obtener los datos de ventas de SAP - Contacte con Administrador del sistema para mas información</h3>)}

            <div className='flex justify-end m-2'>
              <Button color='secondary' isDisabled={loaderKpiSap} onClick={getData}>Regenerando</Button>
            </div>
          </div>
        </div>

        {/* <div className='my-5 bg-white overflow-hidden shadow-sm sm:rounded-lg p-10'>

        </div> */}
      </main>

    </AuthenticatedLayout>
  )
}
