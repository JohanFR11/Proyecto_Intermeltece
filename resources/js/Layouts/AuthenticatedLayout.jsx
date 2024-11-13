/* eslint-disable no-undef */
import { HomeIcon, DatacenterIcon, ToolIcon, SellerIcon, HumanIcon, AccountingIcon } from '@/Components/icons/Icons'
import Sidebar, { SidebarItem } from './partials/Sidebar'
import DevMessage from './partials/DevMessage'
import TopBar from './partials/TopBar'
import NavKpis from '@/routes/Kpis/NavKpis'
import NavDropdown from '@/Components/NavDropdown';
import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

export default function Authenticated ({ auth, header, children, unreadNotifications }) {
  const user = auth.user

  const [isKpiMenuOpen, setIsKpiMenuOpen] = useState(false); // Estado para el subíndice

  const toggleKpiMenu = () => {
    setIsKpiMenuOpen(!isKpiMenuOpen); // Alternar entre abierto y cerrado
  };
  return (
    <div id='app2' className='min-h-screen bg-gray-100 gap-2'>

      <Sidebar user={user} className='[grid-area:aside] max-w-xs'>
        <SidebarItem icon={<HomeIcon size='32px' color='#395181' />} href={route('dashboard')} text='Inicio' />

        {
          user.roles[0].name === 'Administrador' ? (<SidebarItem icon={<DatacenterIcon size='32px' color='#395181' />} href={route('admin.parts.index')} text='Datacenter Meltec IT' />) : ''
        }

        <SidebarItem icon={<SellerIcon size='32px' color='#395181' />} href={route('commercial.quoter')} text='Area Comercial' />
        <div className="flex items-center">
        <span onClick={toggleKpiMenu} className="cursor-pointer">
          {isKpiMenuOpen ? <FaChevronUp size={20} color="#395181" /> : <FaChevronDown size={20} color="#395181" />}
        </span>
      </div>
      {isKpiMenuOpen && (
          <NavKpis category={1} /> 
          )}
        
        <SidebarItem icon={<HumanIcon size='32px' color='#395181' />} href={route('resources.hseq.index')} text='Area HSEQ' />
        <SidebarItem icon={<AccountingIcon size='32px' color='#395181' />} href={route('payments.index')} text='Area Contable' />
        {
          user.roles[0].name === 'Administrador' ? (<SidebarItem icon={<ToolIcon size='32px' color='#395181' />} href={route('admin.users.index')} text='Administrador del Sistema' />) : ''
        }

        <NavKpis category={2} />
        <NavKpis category={3} />
        <NavKpis category={4} />

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
