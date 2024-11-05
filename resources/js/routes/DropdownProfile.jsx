import Dropdown from '@/Components/Dropdown'
import { Avatar } from '@nextui-org/react'
import FailImage from '@/Components/FailImage'

export default function DropdownProfile ({ user }) {
  return (
    <div className='hidden sm:flex sm:items-center sm:ml-6'>
      <div className='ml-3 relative'>
        <Dropdown>
          <Dropdown.Trigger>
            <span className='inline-flex rounded-md'>
              <button
                type='button'
                className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150'
              >
                <Avatar isBordered radius='full' src={user.avatar} showFallback fallback={<FailImage />} />
              </button>
            </span>
          </Dropdown.Trigger>

          <Dropdown.Content>
            <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
            <Dropdown.Link href={route('logout')} method='post' as='button'>
              Cerrar Sesión
            </Dropdown.Link>
          </Dropdown.Content>
        </Dropdown>
      </div>
    </div>
  )
}
