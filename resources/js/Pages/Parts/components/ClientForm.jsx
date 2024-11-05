import { Input, Button } from '@nextui-org/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export const ClientForm = ({ onClientUpdate }) => {
  const [client, setClient] = useLocalStorage('client', {
    nameClient: '',
    email: '',
    phone: '',
    identification: ''
  })

  const handleInputText = (e) => {
    const inputName = e.target.name
    const inputValue = e.target.value

    const currentClient = { ...client }
    currentClient[inputName] = inputValue

    setClient(currentClient)
  }

  const handleSubmitClient = (e) => {
    e.preventDefault()
    onClientUpdate(client)
  }

  return (
    <form onSubmit={handleSubmitClient}>

      <div className='flex gap-2'>
        <Input type='text' value={client.nameClient} name='nameClient' label='Nombre del cliente' radius='sm' labelPlacement='inside' isRequired onChange={handleInputText} />
        <Input type='email' name='email' value={client.email} label='Correo electronico del cliente' radius='sm' labelPlacement='inside' isRequired onChange={handleInputText} />
      </div>

      <div className='flex gap-2 py-4'>
        <Input type='tel' name='phone' label='Celular del cliente' value={client.phone} radius='sm' labelPlacement='inside' isRequired onChange={handleInputText} />
        <Input
          type='number' onChange={handleInputText} name='identification' value={client.identification} label='Nùmero de Identificacion' radius='sm' labelPlacement='inside' isRequired startContent={
            <div className='pointer-events-none flex items-center'>
              <span className='text-default-400 text-small'>C.C</span>
            </div>
        }
        />
      </div>
      <Button type='submit'>Continuar</Button>
    </form>
  )
}
