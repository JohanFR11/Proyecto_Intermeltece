import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import UpdatePasswordForm from './Partials/UpdatePasswordForm'
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm'
import { Head } from '@inertiajs/react'
import TokensFragment from './Partials/TokensFragment'
import { ROLES_CONSTANTS } from '@/constants/initialValues'

export default function Edit ({ auth, mustVerifyEmail, status }) {
  const roleName = auth.user.roles[0].name
  return (
    <AuthenticatedLayout
      auth={auth}
      header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>Perfil de {auth.user.name}</h2>}
    >
      <Head title='Perfil de usuario' />

      <div className='py-12'>
        <div className='max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6'>
          <div className='p-4 sm:p-8 bg-white shadow sm:rounded-lg'>
            <UpdateProfileInformationForm
              mustVerifyEmail={mustVerifyEmail}
              status={status}
              className='max-w-xl'
            />
          </div>

          <div className='p-4 sm:p-8 bg-white shadow sm:rounded-lg'>
            <UpdatePasswordForm className='max-w-xl' />
          </div>
          {
            roleName.includes(ROLES_CONSTANTS.Admin)
              ? (
                <div className='p-4 sm:p-8 bg-white shadow sm:rounded-lg'>
                  <TokensFragment />
                </div>
                )
              : ('')
          }

        </div>
      </div>
    </AuthenticatedLayout>
  )
}
