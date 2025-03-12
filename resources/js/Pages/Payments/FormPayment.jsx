import { Head } from '@inertiajs/react'
import NavbarHome from '../Home/Components/Navbar'
import { HomeFooter } from '../Home/Components/Footer'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'

export default function FormPayment ({ auth }) {
  return (
    <>
      <Head title='Formulario de Pagos Meltec Comunicaciones S.A' />
      <NavbarHome auth={auth} />
      <div className='relative flex items-center justify-center bg-dots-darker bg-center min-h-screen m-auto bg-gray-100 dark:bg-dots-lighter'>
        <div className='flex justify-center bg-white rounded-md p-4 items-center'>
          <div className='border-r'>
            <img className='object-contain rounded-md w-full' src='https://picsum.photos/400/700' alt='' />
          </div>
          <div className='px-4'>
            <h2 className='text-center m-4 font-bold text-2xl text-zinc-600'>Formulario de Pago Meltec Comunicaciones S.A</h2>
            <form>
              <h5 className='m-2 font-semibold text-justify capitalize'>Datos personales</h5>
              <Input type='text' label='Nombre del Cliente - Razon Social' isRequired />
              <div className='flex justify-between gap-2 items-center my-2'>
                <Select label='Tipo de Documento' className='w-48'>
                  <SelectItem value='cc'>C.C</SelectItem>
                  <SelectItem value='cc'>C.E</SelectItem>
                  <SelectItem value='cc'>NIT</SelectItem>
                </Select>
                <Input type='text' label='Documento o NIT' isRequired />
              </div>
              <Input type='email' label='Correo Electronico' isRequired />
              <div className='flex justify-between gap-2 items-center my-2'>
                <Input type='number' label='Numero Telefonico' isRequired />
                <Input type='text' label='Dirección Empresarial' isRequired />
              </div>
              <h5 className='my-4 mx-2 font-semibold text-justify capitalize'>Descripcion del Pago</h5>
              <Input type='text' label='Referencia de pago' isRequired className='my-2' />
              <Textarea label='Descripcion de tu pago' placeholder='Breve descripcion de tu pago' />
              <Input
                type='number' className='my-2' label='Valor a pagar' isRequired placeholder='0.00' startContent={
                  <div className='pointer-events-none flex items-center'>
                    <span className='text-default-400 text-small'>$</span>
                  </div>
              } endContent={
                <div className='flex items-center'>
                  <label className='sr-only' htmlFor='currency'>
                    Currency
                  </label>
                  <select
                    className='outline-none border-0 bg-transparent text-default-400 text-small'
                    id='currency'
                    name='currency'
                  >
                    <option value='cop'>COP</option>
                    <option value='usd'>USD</option>
                  </select>
                </div>
                }
              />
              <div className='flex justify-end'>
                <Button type='submit' color='primary' className='my-2 p-6 text-md'>Realizar Pago</Button>
              </div>
            </form>

          </div>

        </div>
      </div>
      <div className='bg-white/80'>
        <HomeFooter />
      </div>
    </>
  )
}
