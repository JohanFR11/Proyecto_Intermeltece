import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'
import { useForm, usePage } from '@inertiajs/react'

export default function UpdateProfileInformation ({
  className = ''
}) {
  const user = usePage().props.auth.user

  const { data, setData, errors } =
        useForm({
          name: user.name,
          email: user.email
        })

  return (
    <section className={className}>
      <header>
        <h2 className='text-lg font-medium text-gray-900'>
          Información de tu Perfil
        </h2>
      </header>

      <div className='mt-6 space-y-6'>
        <div>
          <InputLabel htmlFor='name' value='Tu Nombre' />

          <TextInput
            id='name'
            className='mt-1 block w-full'
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            required
            isFocused
            autoComplete='name'
            disabled
          />

          <InputError className='mt-2' message={errors.name} />
        </div>

        <div>
          <InputLabel htmlFor='email' value='Tu correo Electronico' />

          <TextInput
            id='email'
            type='email'
            className='mt-1 block w-full'
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            required
            autoComplete='username'
            disabled
          />

          <InputError className='mt-2' message={errors.email} />
        </div>
      </div>
    </section>
  )
}
