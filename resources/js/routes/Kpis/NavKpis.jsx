/* eslint-disable no-undef */
/* eslint-disable array-callback-return */
import { usePage } from '@inertiajs/react'
import { ReportIcon } from '@/Components/icons/Icons'
import NavDropdown from '@/Components/NavDropdown'
import Dropdown from '@/Components/Dropdown'

export default function NavKpis () {
  const { ziggy } = usePage().props
  const { kpis } = ziggy
  return (
    <>
      {kpis.map((kpi, i) => {
        if (kpi.kpi.length !== 0) {
          return (
            <div key={i} className='relative flex items-center py-2 px-3 my-1 ml-14 font-medium rounded-md cursor-pointertransition-colors'>
              <ReportIcon size={32} color='#395181' />
              <NavDropdown menu={kpi.category}>
                {kpi.kpi.map((data) => (
                  <Dropdown.Link key={data.id} href={route('kpi.reports.show', data.id)}>{data.reportName}</Dropdown.Link>
                ))}
              </NavDropdown>
            </div>
          )
        }
      })}
    </>
  )
}
