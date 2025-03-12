/* eslint-disable no-undef */
import { Link } from '@inertiajs/react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'

export default function NavbarHome ({ auth }) {
  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        <a href='https://meltec.com.co/' target='_blank' rel='noreferrer'>
          <p className='font-bold text-inherit'>Meltec Comunicaciones S.A</p>
        </a>
      </NavbarBrand>
      <NavbarContent className='hidden sm:flex gap-4' justify='center'>
        <NavbarItem>
          <Link href={route('shipments')}>
            Sigue tu envio
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href='/' aria-current='page'>
            Trm del Dia
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href={route('payments.form')} aria-current='page'>
            Formulario de Pagos
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify='end'>
        <NavbarItem className='hidden lg:flex'>
          {auth.user
            ? (
              <Link
                href={route('dashboard')}
                className='font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500'
              >
                Ir al Dashboard
              </Link>
              )
            : (
              <>
                <Link
                  href={route('login')}
                  className='font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500'
                >
                  Portal Empleados
                </Link>
              </>
              )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

/**
 *
 */
