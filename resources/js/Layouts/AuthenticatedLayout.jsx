/* eslint-disable no-undef */
import {
  HomeIcon,
  DatacenterIcon,
  ToolIcon,
  SellerIcon,
  HumanIcon,
  AccountingIcon,
  ReportIcon,
  DocumentIcon,
  LearnIcon,
} from "@/Components/icons/Icons";
import Sidebar, { SidebarItem } from "./partials/Sidebar";
import DevMessage from "./partials/DevMessage";
import TopBar from "./partials/TopBar";
import NavKpis from "@/routes/Kpis/NavKpis";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Authenticated({
  auth,
  header,
  children,
  unreadNotifications,
}) {
  const user = auth.user;

  const [openMenus, setOpenMenus] = useState({}); // Estado de submenús individuales

  const toggleKpiMenu = (menuId) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menuId]: !prevState[menuId], // Alterna solo el submenú seleccionado
    }));
  };
  return (
    <div id="app2" className="min-h-screen bg-gray-100 gap-2">
      <Sidebar user={user} className="[grid-area:aside] max-w-xs">
        <SidebarItem
          icon={<HomeIcon size="32px" color="#395181" />}
          href={route("dashboard")}
          text="Inicio"
        />

        <SidebarItem 
          icon={<LearnIcon alt="Student Icon" size='32px' color='#395181'/>}
          href={route('modulo.index')} 
          text='Cursos y Capacitaciones' 
        />


        {user.roles[0].name === "Administrador" ? (
          <SidebarItem
            icon={<DatacenterIcon size="32px" color="#395181" />}
            href={route("admin.parts.index")}
            text="Datacenter Meltec IT"
          />
        ) : (
          ""
        )}
        <div className="flex items-center">
          <SidebarItem
            icon={<SellerIcon size="32px" color="#395181" />}
            href={route("commercial.quoter")}
            text="Area Comercial"
          />
          <div className="flex items-center">
            <span
              onClick={() => toggleKpiMenu("comercial")}
              className="cursor-pointer ml-2"
            >
              {openMenus["comercial"] ? (
                <FaChevronUp size={20} color="#395181" />
              ) : (
                <FaChevronDown size={20} color="#395181" />
              )}
            </span>
          </div>
        </div>

        {openMenus["comercial"] && (
          <div className="[grid-area:aside] max-w-xs">
            <NavKpis category={1} />
            <div className="flex flex-col items-center justify-center space-y-4">
              <SidebarItem
                icon={<SellerIcon size="32px" color="#395181" />}
                href={route("ulefone.index")}
                text="Cotizador Web Ulefone"
              />
              <SidebarItem
                icon={<SellerIcon size="32px" color="#395181" />}
                href={route("zebra.index")}
                text="Cotizador Web Zebra"
              />
            </div>
          </div>
        )}

        <SidebarItem
          icon={<HumanIcon size="32px" color="#395181" />}
          href={route("resources.hseq.index")}
          text="Area HSEQ"
        />
        <SidebarItem
          icon={<DocumentIcon size="32px" color="#395181" />}
          href={route("auditoria")}
          text="Auditorias"
        />
        <SidebarItem
          icon={<AccountingIcon size="32px" color="#395181" />}
          href={route("payments.index")}
          text="Area Contable"
        />
        {user.roles[0].name === "Administrador" ? (
          <SidebarItem
            icon={<ToolIcon size="32px" color="#395181" />}
            href={route("admin.users.index")}
            text="Administrador del Sistema"
          />
        ) : (
          ""
        )}
        <div
          className="flex items-center pl-5 py-2 cursor-pointer rounded-md hover:bg-gray-200 "
          onClick={() => toggleKpiMenu("kpis")}
        >
          <ReportIcon size="32px" color="#395181" />
          <span className="ml-3 px-5 text-gray-500 font-medium rounded-md"> Kpi's</span>
          <span className=" ml-2">
            {openMenus["kpis"] ? (
              <FaChevronUp size={20} color="#395181" />
            ) : (
              <FaChevronDown size={20} color="#395181" />
            )}
          </span>
        </div>

        {openMenus["kpis"] && (
          <div className="[grid-area:aside] max-w-xs">
            <NavKpis category={2} />
            <NavKpis category={3} />
            <NavKpis category={4} />
            <div
              className="flex items-center pl-12 py-2 cursor-pointer rounded-md"
              onClick={() =>
                window.open(
                  "https://lookerstudio.google.com/reporting/fbf99b01-23d9-4bdd-bc64-0de1e53025cc/page/FouGE",
                  "_blank"
                )
              }
            >
              <li className="relative flex items-center py-2 my-1 font-medium rounded-md cursor-pointer transition-colors group hover:bg-indigo-50 text-gray-600 ml-[-0.5]">
                <a className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300 w-full flex items-center space-x-2 py-2 px-2 border-none">
                  <ReportIcon
                    size="32px"
                    color="#395181"
                  />
                  <span className="overflow-hidden transition-all w-32 ml-3 text-sm font-medium px-5 self-center text-gray-500 hover:text-gray-700">
                    Estado Cargue KPI's
                  </span>
                </a>
              </li>
            </div>
          </div>
        )}
      </Sidebar>

      <main className="[grid-area:main] overflow-y-auto">
        <TopBar header={header} unreadNotifications={unreadNotifications} />

        {children}
      </main>

      <footer className="[grid-area:footer]">
        <DevMessage />
      </footer>
    </div>
  );
}
