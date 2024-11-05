/* eslint-disable no-undef */
import { NotificationIcon } from '@/Components/icons/Icons'
import { Link } from '@inertiajs/react'
import { Badge } from '@nextui-org/react'

export default function TopBar ({ header, unreadNotifications = 0 }) {
  return (
    <nav className='bg-white border-b border-gray-100 rounded-lg mb-2'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          <div className='self-center'>
            {header && (
              <header className='bg-white'>
                <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>{header}</div>
              </header>
            )}
          </div>
          <Link href={route('notifications')}>
            <Badge color='danger' content={unreadNotifications} shape='circle'>
              <NotificationIcon className='flex align-middle' size={40} />
            </Badge>
          </Link>
        </div>
      </div>
    </nav>
  )
}
