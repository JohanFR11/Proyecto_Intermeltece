/* eslint-disable no-undef */
import { useState } from 'react'
import ResponsiveNavLink from '@/Components/ResponsiveNavLink'
export default function ResposiveRoutes ({ user }) {
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false)

  const roleName = user.roles[0].name
  const ROLES_CONSTANTS = {
    Admin: 'Administrador',
    Director: 'Director',
    'Usuario corriente': 'Usuario corriente'
  }

  return (

    <>
      <div className='-mr-2 flex items-center sm:hidden'>
        <button
          onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
          className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out'
        >
          <svg className='h-6 w-6' stroke='currentColor' fill='none' viewBox='0 0 24 24'>
            <path
              className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M4 6h16M4 12h16M4 18h16'
            />
            <path
              className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      </div>

      <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
        <div className='pt-2 pb-3 space-y-1'>
          <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
            Dashboard
          </ResponsiveNavLink>
        </div>
        {roleName.includes(ROLES_CONSTANTS.Admin)
          ? (
            <div className='pt-2 pb-3 space-y-1'>
              <ResponsiveNavLink href={route('admin.parts.index')} active={route().current('admin.parts.index')}>
                Partes del Servidor
              </ResponsiveNavLink>
            </div>
            )
          : ''}

        {roleName.includes(ROLES_CONSTANTS.Admin) || roleName.includes(ROLES_CONSTANTS.Director)
          ? (
            <div className='pt-2 pb-3 space-y-1'>
              <ResponsiveNavLink href={route('directors.index')} active={route().current('directors.index')}>
                Kpi´s para Directores
              </ResponsiveNavLink>
            </div>
            )
          : ''}

        {roleName.includes(ROLES_CONSTANTS.Admin)
          ? (
            <div className='pt-2 pb-3 space-y-1'>
              <ResponsiveNavLink href={route('admin.users.index')} active={route().current('admin.users.index')}>
                Usuarios del Sistema
              </ResponsiveNavLink>
            </div>
            )
          : ''}

        <div className='pt-4 pb-1 border-t border-gray-200'>
          <div className='px-4'>
            <div className='font-medium text-base text-gray-800'>{user.name}</div>
            <div className='font-medium text-sm text-gray-500'>{user.email}</div>
          </div>

          <div className='mt-3 space-y-1'>
            <ResponsiveNavLink href={route('profile.edit')}>Perfil</ResponsiveNavLink>
            <ResponsiveNavLink method='post' href={route('logout')} as='button'>
              Cerrar Sesión
            </ResponsiveNavLink>
          </div>
        </div>
      </div>
    </>
  )
}
