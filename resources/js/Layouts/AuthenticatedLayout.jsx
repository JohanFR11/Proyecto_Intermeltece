/* eslint-disable no-undef */
import { HomeIcon, DatacenterIcon, ToolIcon, SellerIcon, HumanIcon, AccountingIcon } from '@/Components/icons/Icons'
import Sidebar, { SidebarItem } from './partials/Sidebar'
import DevMessage from './partials/DevMessage'
import TopBar from './partials/TopBar'
import NavKpis from '@/routes/Kpis/NavKpis'

export default function Authenticated ({ auth, header, children, unreadNotifications }) {
  const user = auth.user
  return (
    <div id='app2' className='min-h-screen bg-gray-100 gap-2'>

      <Sidebar user={user} className='[grid-area:aside] max-w-xs'>
        <SidebarItem icon={<HomeIcon size='32px' color='#395181' />} href={route('dashboard')} text='Inicio' />

        {
          user.roles[0].name === 'Administrador' ? (<SidebarItem icon={<DatacenterIcon size='32px' color='#395181' />} href={route('admin.parts.index')} text='Datacenter Meltec IT' />) : ''
        }

        <SidebarItem icon={<SellerIcon size='32px' color='#395181' />} href={route('commercial.quoter')} text='Area Comercial' />
        <SidebarItem icon={<HumanIcon size='32px' color='#395181' />} href={route('resources.hseq.index')} text='Area HSEQ' />
        <SidebarItem icon={<AccountingIcon size='32px' color='#395181' />} href={route('payments.index')} text='Area Contable' />
        {
          user.roles[0].name === 'Administrador' ? (<SidebarItem icon={<ToolIcon size='32px' color='#395181' />} href={route('admin.users.index')} text='Administrador del Sistema' />) : ''
        }

        <NavKpis />

      </Sidebar>

      <main className='[grid-area:main] overflow-y-auto'>

        <TopBar header={header} unreadNotifications={unreadNotifications} />

        {children}
      </main>

      <footer className='[grid-area:footer]'>
        <DevMessage />
      </footer>
    </div>
  )
}
