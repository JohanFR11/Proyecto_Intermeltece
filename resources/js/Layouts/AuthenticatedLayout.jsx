/* eslint-disable no-undef */
import { HomeIcon, DatacenterIcon, ToolIcon, SellerIcon, HumanIcon, AccountingIcon,ReportIcon } from '@/Components/icons/Icons'
import Sidebar, { SidebarItem } from './partials/Sidebar'
import DevMessage from './partials/DevMessage'
import TopBar from './partials/TopBar'
import NavKpis from '@/routes/Kpis/NavKpis'
import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

export default function Authenticated ({ auth, header, children, unreadNotifications }) {
  const user = auth.user

  const [openMenus, setOpenMenus] = useState({}); // Estado de submenús individuales

  const toggleKpiMenu = (menuId) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menuId]: !prevState[menuId] // Alterna solo el submenú seleccionado
    }));
  };
  return (
    <div id='app2' className='min-h-screen bg-gray-100 gap-2'>

      <Sidebar user={user} className='[grid-area:aside] max-w-xs'>
        <SidebarItem icon={<HomeIcon size='32px' color='#395181' />} href={route('dashboard')} text='Inicio' />

        {
          user.roles[0].name === 'Administrador' ? (<SidebarItem icon={<DatacenterIcon size='32px' color='#395181' />} href={route('admin.parts.index')} text='Datacenter Meltec IT' />) : ''
        }
        <div className="flex items-center">
          <SidebarItem icon={<SellerIcon size='32px' color='#395181' />} href={route('commercial.quoter')} text='Area Comercial' />
          <div className="flex items-center">
          <span onClick={() => toggleKpiMenu('comercial')} className="cursor-pointer ml-2">
            {openMenus['comercial'] ? <FaChevronUp size={20} color="#395181" /> : <FaChevronDown size={20} color="#395181" />}
          </span>
          </div>
          
        </div>

        {openMenus['comercial'] && (
              <div className='[grid-area:aside] max-w-xs'>
                <NavKpis category={1} />
              </div>
          )}
        <SidebarItem icon={<HumanIcon size='32px' color='#395181' />} href={route('resources.hseq.index')} text='Area HSEQ' />
        <SidebarItem icon={<AccountingIcon size='32px' color='#395181' />} href={route('payments.index')} text='Area Contable' />
        {
          user.roles[0].name === 'Administrador' ? (<SidebarItem icon={<ToolIcon size='32px' color='#395181' />} href={route('admin.users.index')} text='Administrador del Sistema' />) : ''
        }
         <div className="flex items-center">
          <SidebarItem icon={<ReportIcon size='32px' color='#395181' />} text="Kpi's" />
          <div className="flex items-center">
          <span onClick={() => toggleKpiMenu('kpis')} className="cursor-pointer ml-2">
            {openMenus['kpis'] ? <FaChevronUp size={20} color="#395181" /> : <FaChevronDown size={20} color="#395181" />}
          </span>
          </div>
          
        </div>

        {openMenus['kpis'] && (
              <div className='[grid-area:aside] max-w-xs'>
                <NavKpis category={2} />
                <NavKpis category={3} />
                <NavKpis category={4} />
              </div>
          )}

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
