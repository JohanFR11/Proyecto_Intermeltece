/* eslint-disable no-undef */
export default function Login () {
  return (
    <section className='bg-gray-50 dark:bg-gray-900 h-screen'>
      <div className='container h-full px-6 py-24 m-auto'>
        <div className='flex h-full flex-wrap items-center justify-center lg:justify-between gap-6'>
          {/* Columna Izquierda */}
          <div className='mb-12 md:mb-0 md:w-8/12 lg:w-6/12'>
            <img className='w-full' src='https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg' alt='Reference Image' />
          </div>

          {/* Columna derecha del Formulario */}

          <div className='md:w-8/12 lg:ml-6 lg:w-5/12'>
            <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-full xl:p-0 dark:bg-gray-800 dark:border-gray-700 m-auto'>
              <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
                <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center'>
                  Bienvenido a la intranet de Meltec Comunicaciones S.A
                </h1>
                <div className='flex justify-center gap-5'>
                  <a className='w-full text-center text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 ' href={route('auth.redirectGoogle')}>Iniciar Sesion con Google</a>

                  <a className='w-full text-center text-white bg-danger-600 hover:bg-danger-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 ' href='/'>Volver al inicio</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
