/* eslint-disable no-undef */
import { Link } from '@inertiajs/react'

export default function TokensFragment ({ className = '' }) {
  return (
    <section className={className}>
      <header>
        <h2 className='text-lg font-medium text-gray-900'>
          Tokens de Acceso a Terceros
        </h2>
        <p className='mt-1 text-sm text-gray-600 mb-5'>
          Para Administrar tus Tokens de Acceso a Terceros da click en el siguiente Enlace
        </p>
        <Link href={route('profile.generatetokens.index')} className='text-white bg-blue-700 hover:bg-blue-900 focus:ring-4 focus:ring-blue-300 rounded text-sm px-5 py-2.5 transition ease-in-out '> Ver mis Tokens de Acceso </Link>
      </header>
    </section>
  )
}
