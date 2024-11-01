import { usePage } from '@inertiajs/react'
import { Table, TableHeader, TableBody, TableCell, TableColumn, TableRow } from '@nextui-org/react'
import Paginator from '@/Components/Paginator'
import { THEADS_PARTS } from '@/constants/initialValues'
import { usdToCop } from '@/helpers/usdToCop'
import { currencyFormatter } from '@/helpers/currencyFormatter'
import { ModalEdit } from './ModalEdit'

export const TableParts = () => {
  const { parts } = usePage().props

  return (
    <Table aria-label='Tabla de partes de servidor' bottomContent={<Paginator paginate={parts.links} />}>
      <TableHeader>
        {
            THEADS_PARTS.map((head, i) => (
              <TableColumn key={i} className='text-center'>{head}</TableColumn>
            ))
        }
      </TableHeader>
      <TableBody>
        {parts.data.map(({ id, product, usdPrice }) => (
          <TableRow key={id} className='text-center'>
            <TableCell>{product}</TableCell>
            <TableCell>{currencyFormatter({ value: usdPrice })}</TableCell>
            <TableCell>{usdToCop(usdPrice)}</TableCell>
            <TableCell><ModalEdit dataProduct={{ id, product, usdPrice }} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
