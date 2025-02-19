/* eslint-disable no-undef */
const AuthenticatedLayout = React.lazy(() => import('@/Layouts/AuthenticatedLayout'));
import { Head } from '@inertiajs/react'
import { useTrm } from '@/hooks/useTrm'
const SidebarMeta = React.lazy(() => import('./Home/Components/SideBarMeta'));
import { dateTimeFormatted } from '@/helpers/dateHelper'
import { useSalesToday } from '@/hooks/useSalesToday'
import SapLoader from '@/Components/SapLoader'
import { Button, useDisclosure, Divider } from '@heroui/react'
const Ranking = React.lazy(() => import('./HomeIntranet/Components/RankingVentas'));
const ModalDolar = React.lazy(() => import('./HomeIntranet/Components/ModalDolar'));
const HSEQHome = React.lazy(() => import('./HomeIntranet/Fragments/HSEQHome'));
const ArticuloHome = React.lazy(() => import('./HomeIntranet/Fragments/ArticuloHome'));
const NovedadesHome = React.lazy(() => import('./HomeIntranet/Fragments/NovedadesHome'));
const CarrouselArticulos = React.lazy(() => import('./HomeIntranet/Fragments/CarruselArticulos'));
const CotizadoresHome = React.lazy(() => import('./HomeIntranet/Fragments/CotizadoresHome'));
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Dashboard({ auth, unreadNotifications,OdataMeta,OdataRanking,TotalVentasHoy}) {

  const totalRevenue = OdataMeta.map((item)=> item.total);
  const totalRankingRevenue = TotalVentasHoy.map((item)=> item.totalVentas);
  
  const { valores, loading, trmInCop } = useTrm();
  const { loaderKpiSap, error, kpi, getData } = useSalesToday();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isRankingOpen, onOpen: onRankingOpen, onClose: onRankingClose } = useDisclosure();

  const [user, setUser] = useState(null);
/*   const [datas, setDatas] = useState([]);

  console.log(datas); */

  const [size, setSize] = React.useState('md');
  const [rankingSize, setRankingSize] = React.useState('md');

  const sizes = ["5xl"];

  const handleOpen = (size) => {
    setSize(size)
    onOpen();
  };

  const handleRankingOpen = (size) => {
    setRankingSize(size);
    onRankingOpen();
  }

  /* const totalRevenue = OdataMeta.reduce((acc, item) => {
    const revenue = parseInt(item.KCNT_REVENUE.replace(/[^\d.-]/g, ''), 10);  // Extrae y convierte a número
    return acc + (isNaN(revenue) ? 0 : revenue);  // Evita sumar valores NaN
  }, 0); */

 /*  const totalRankingRevenue = OdataRanking?.length > 0 */
    /* ? OdataRanking.reduce((acc, item) => { */
      /* const revenue = parseInt(item.KCNT_REVENUE?.replace(/[^\d.-]/g, ''), 10); // Limpia y convierte a número
      return acc + (isNaN(revenue) ? 0 : revenue); // Maneja valores NaN
    }, 0)
    : 0; */

  useEffect(() => {

    axios
      .get("/user", { withCredentials: true })
      .then((res) => {
        const accessTokenDB = res.data.google_access_token;
        setUser(accessTokenDB);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);


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
          <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center'>
            <div className='bg-[#395181] text-center w-[130px] overflow-hidden shadow-lg sm:rounded-lg hover:bg-[#5b7ab8] cursor-pointer'>
              {sizes.map((size) => (
                <button className='text-white text-center text-lg items-center w-[100px]' key={size} onClick={() => handleOpen(size)} color="#395181">Dólar hoy: {trmInCop}</button>
              ))}
              <ModalDolar size={size} open={isOpen} close={onClose} valores={valores} trmInCop={trmInCop} />
            </div>

            <div className='bg-[#395181] text-center w-[130px] overflow-hidden shadow-lg sm:rounded-lg hover:bg-[#5b7ab8] cursor-pointer'>
              {sizes.map((size) => (
                <button className='text-white text-center text-lg items-center w-[100px]' key={size} onClick={() => handleRankingOpen(size)} color="#395181">
                  Ranking de Ventas
                </button>
              ))}

              <Ranking size={rankingSize} open={isRankingOpen} close={onRankingClose} OdataRanking={OdataRanking} totalRankingRevenue={totalRankingRevenue} />

            </div>
          </div>

          <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg p-4 text-'>
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
              <Button color='secondary' isDisabled={loaderKpiSap} onPress={getData}>
                Regenerando
              </Button>
            </div>
          </div>
          <Divider className='h-[10px] my-4' />
          <div>
            <HSEQHome />
          </div>
          <Divider className='h-[10px] my-4' />
          <div>
            <CotizadoresHome />
          </div>
          <Divider className='h-[10px] my-4' />
          <div>
            <ArticuloHome />
          </div>
          <Divider className='h-[10px] my-4' />
          <div>
            <NovedadesHome />
          </div>
          <Divider className='h-[10px] my-4' />
          <div>
            {user && <CarrouselArticulos usertoken={user} />}
          </div>
        </div>
      </main>
    </AuthenticatedLayout>
  )
}
