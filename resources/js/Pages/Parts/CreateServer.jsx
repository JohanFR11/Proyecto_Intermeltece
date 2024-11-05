// Layout
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

// Component
import { Head } from '@inertiajs/react'
import { FormCalculator } from './components/FormCalculator'
import { Sumnmary } from './components/Summary'
import { ClientForm } from './components/ClientForm'

// Hooks
import { useLocalStorage } from '@/hooks/useLocalStorage'

// Helpers
import { CLIENT_INITIAL_VALUES, SERVER_INITIAL_VALUES } from '../../constants/initialValues'

// Utilities
import { Accordion, AccordionItem } from '@nextui-org/react'
import { CommentForm } from './components/CommentForm'

export default function CreateServer ({ auth, soParts, parts, unreadNotifications }) {
  const [client, setClient] = useLocalStorage('client', CLIENT_INITIAL_VALUES)
  const [calculator, setCalculator] = useLocalStorage('serverParts', SERVER_INITIAL_VALUES)

  const [total, setTotal] = useLocalStorage('total', 0)

  const handleCalculatorUpdate = (updateCalculator) => {
    setCalculator(updateCalculator)
  }

  const handleClientUpdate = (updateClient) => {
    setClient(updateClient)
  }

  const handleTotalUpdate = (updateTotal) => {
    setTotal(updateTotal)
  }

  return (
    <AuthenticatedLayout
      auth={auth}
      unreadNotifications={unreadNotifications}
      header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>Partes del servidor</h2>}
    >
      <Head title='Partes del servidor' />

      <section className='py-12'>
        <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
          <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
            <div className='grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-0 lg:py-16 lg:grid-cols-12'>
              <div className='mr-auto place-self-center lg:col-span-6'>
                <h2 className='max-w-2xl mb-4 text-2xl text-center font-bold mt-3'>
                  Calculadora de Precios para nuevo Servidor
                </h2>
                <Accordion>
                  <AccordionItem key={1} aria-label='Datos del Cliente' subtitle='Ingreso del cliente' title='Datos del Cliente'>
                    <ClientForm onClientUpdate={handleClientUpdate} />
                  </AccordionItem>
                  <AccordionItem key={2} aria-label='Datos del nuevo Servidor' subtitle='Calculadora del servidor' title='Datos del Servidor'>
                    <FormCalculator soParts={soParts} parts={parts} onCalculateUpdate={handleCalculatorUpdate} onTotalUpdate={handleTotalUpdate} />
                  </AccordionItem>
                  <AccordionItem key={3} aria-label='Comentarios' subtitle='Comentarios Extra Opcionales' title='Comentarios'>
                    <CommentForm />
                  </AccordionItem>
                </Accordion>
              </div>
              <Sumnmary auth={auth} client={client} calculator={calculator} total={total} handleCalculatorUpdate={handleCalculatorUpdate} handleClientUpdate={handleClientUpdate} handleTotalUpdate={handleTotalUpdate} />
            </div>
          </div>
        </div>
      </section>
    </AuthenticatedLayout>
  )
}
