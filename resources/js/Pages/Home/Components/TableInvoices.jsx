import { priceFormatted } from '@/helpers/priceHelper'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@nextui-org/react'

export default function TableInvoices ({ invoices }) {
  return (
    <Table aria-label='Ultimas ventas del dia'>
      <TableHeader>
        <TableColumn>Número de Factura</TableColumn>
        <TableColumn>Empleado Responsable</TableColumn>
        <TableColumn>Cliente</TableColumn>
        <TableColumn>Descripción</TableColumn>
        <TableColumn>Tipo de Facturacion</TableColumn>
        <TableColumn>Valor neto Facturado</TableColumn>
        <TableColumn>Estado de la Factura</TableColumn>
      </TableHeader>

      {invoices.length !== 0
        ? (
          <TableBody>
            {invoices.map(({ CDOC_UUID, TDPY_BUYER_UUID, TIPR_PROD_UUID, TIPR_REFO_PRDTY, KCNT_REVENUE, TIP_SAL_EMP, TDOC_STA_RELEASE, RCNT_REVENUE, TIPR_REFO_CATCP }, index) => (
              <TableRow key={index}>
                <TableCell>{CDOC_UUID}</TableCell>
                <TableCell>{TIP_SAL_EMP}</TableCell>
                <TableCell>{TDPY_BUYER_UUID}</TableCell>
                <TableCell>{TIPR_PROD_UUID} - {TIPR_REFO_CATCP}</TableCell>
                <TableCell>{TIPR_REFO_PRDTY}</TableCell>
                <TableCell>{priceFormatted({ price: KCNT_REVENUE, currency: RCNT_REVENUE, fractionDigits: 0 })}</TableCell>
                <TableCell>{TDOC_STA_RELEASE}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          )
        : (
          <TableBody emptyContent='No hay datos que mostrar' />
          )}

    </Table>
  )
}
