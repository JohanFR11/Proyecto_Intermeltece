import { Head } from '@inertiajs/react'
import NavbarHome from '../Home/Components/Navbar'
import { HomeFooter } from '../Home/Components/Footer'
import { Image } from '@nextui-org/react'
import FormShipping from './components/Form'

export default function Envios ({ auth }) {
  return (
    <>
      <Head title='Sigue tu envio' />
      <NavbarHome auth={auth} />

      <div className='sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white'>
        <div className='p-6 lg:p-8 bg-white/80 w-full mx-20'>
          <h2 className='font-bold text-center text-xl'>Sigue el rastro de tu pedido Meltec</h2>
          <div className='flex gap-2 items-center'>
            <div className='my-8 w-full'>
              <FormShipping />
            </div>
            <div className='my-8 w-full px-16'>
              <p className='mt-2'>Puedes seguir el rastro de tu pedido con el numero de guia que tu asesor a enviado a tu correo electronico</p>
              <p>Tecnologia traida gracias a nuestro Tracker oficial <a href='https://enviame.io/' className='text-blue-600' target='_blank' rel='noreferrer'>Enviame.io</a></p>
              <Image src='https://enviame.io/wp-content/uploads/2020/09/logo-enviame-dark.png' alt='Enviame IO Tracker partner logo' className='mt-2' />
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
