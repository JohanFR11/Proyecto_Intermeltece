/* eslint-disable no-undef */
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { useTrm } from '@/hooks/useTrm'
import { TrmGraph } from '@/Components/Trm'
import SidebarMeta from './Home/Components/SideBarMeta'
import { dateTimeFormatted } from '@/helpers/dateHelper'
import { useSalesToday } from '@/hooks/useSalesToday'
import SapLoader from '@/Components/SapLoader'
import { Button, useDisclosure, Tabs, Tab, Card, CardBody } from '@nextui-org/react'
import Ranking from './RankingVentas'
import ModalDolar from './ModalDolar';
import React from 'react'

export default function Dashboard({ auth, unreadNotifications, OdataRanking, OdataMeta }) {

  const { valores, loading, trmInCop } = useTrm();
  const { loaderKpiSap, error, kpi, getData } = useSalesToday();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = React.useState('md')

  const sizes = ["5xl"];

  const handleOpen = (size) => {
    setSize(size)
    onOpen();
  }

  const totalRevenue = OdataMeta.reduce((acc, item) => {
    const revenue = parseInt(item.KCNT_REVENUE.replace(/[^\d.-]/g, ''), 10);  // Extrae y convierte a número
    return acc + (isNaN(revenue) ? 0 : revenue);  // Evita sumar valores NaN
  }, 0);

  const totalRankingRevenue = OdataRanking?.length > 0
    ? OdataRanking.reduce((acc, item) => {
      const revenue = parseInt(item.KCNT_REVENUE?.replace(/[^\d.-]/g, ''), 10); // Limpia y convierte a número
      return acc + (isNaN(revenue) ? 0 : revenue); // Maneja valores NaN
    }, 0)
    : 0;

  console.log('Total Ranking Revenue:', totalRankingRevenue);



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
        <div className="my-5 bg-white overflow-hidden shadow-lg sm:rounded-lg p-8">
          <div className='bg-[#395181] text-center items-center w-[130px] overflow-hidden shadow-lg sm:rounded-lg hover:bg-[#5b7ab8] cursosr-pointer'>
            {sizes.map((size) => (
              <button className='text-white text-center text-lg items-center w-[100px]' key={size} onClick={() => handleOpen(size)} color="#395181">Dólar hoy: <br /><span>{trmInCop}</span></button>
            ))}
            <ModalDolar size={size} open={isOpen} close={onClose} valores={valores} trmInCop={trmInCop} />
          </div>
          <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg p-4'>
            <h2 className='font-bold text-xl text-center py-2'>Meta Meltec 2024</h2>

            <h5 className='text-right p-4 font-semibold italic text-zinc-600/50'>
              Última Actualización: <span>{dateTimeFormatted(new Date())}</span>
            </h5>

            {loaderKpiSap && <SapLoader message='Obteniendo Meta Actual. Por favor espere...' />}

            {kpi && <SidebarMeta kpi={kpi} totalRevenue={totalRevenue} />}

            {error && (
              <h3 className='text-center bg-red-500 rounded-md py-6 text-white font-bold'>
                Error al Obtener los datos de ventas de SAP -   Contacte con Administrador del sistema para más información
              </h3>
            )}

            <div className='flex justify-end m-2'>
              <Button color='secondary' isDisabled={loaderKpiSap} onClick={getData}>
                Regenerando
              </Button>
            </div>
          </div>
          <div className="bg-[#395181] text-white p-4 rounded-lg shadow-lg max-w-md mx-auto text-center sm:max-w-48">
            <p className="text-lg font-semibold">Total Ventas Hoy:</p>
            <p className="text-2xl font-bold">{totalRankingRevenue}</p>
          </div>
          <div>
            <Ranking OdataRanking={OdataRanking} />
          </div>
        </div>
      </main>
    </AuthenticatedLayout>
  )
}
