/* eslint-disable no-undef */
import Modal from '@/Components/Modal'
import { usePage } from '@inertiajs/react'
import { CheckboxGroup, Checkbox } from '@nextui-org/react'
import axios from 'axios'
import { ToastifySuccess } from '@/helpers/toastHelper'

export function ModalPermission ({ modal, closeModal, datamodal = {}, permissions }) {
  const { auth, csrfToken } = usePage().props
  const permissionsView = auth.userPermissions.concat(auth.permissions)
  const handleChange = async (e, id, user) => {
    if (e.target?.checked) {
      try {
        const request = await axios.post(route('api.permission.sync'), {
          user,
          permission: id
        }, {
          headers: {
            'X-CSRF-TOKEN': csrfToken
          }
        })

        if (request.status !== 200) {
          throw new Error('No se pueden guardar los cambios')
        }

        ToastifySuccess({ text: 'Permisos Actualizados' })
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        const request = await axios.post(route('api.permission.revoke'), {
          user,
          permission: id
        }, {
          headers: {
            'X-CSRF-TOKEN': csrfToken
          }
        })

        if (request.status !== 200) {
          throw new Error('No se pueden guardar los cambios')
        }

        ToastifySuccess({ text: 'Permisos Actualizados' })
        console.log(request)
      } catch (error) {
        console.error(error)
      }
    }
  }
  return (
    <Modal show={modal} onClose={closeModal}>
      <div className='p-6'>
        <h2 className='text-lg font-medium text-gray-600 text-center'>{`Agregar permisos para ${datamodal.name}`}</h2>
        <div className='my-6'>
          <CheckboxGroup
            label='Selecciona los Permisos a Autorizar'
            defaultValue={permissionsView}
          >
            {
                permissions.map(({ id, supername, name }) => (
                  <Checkbox key={id} value={name} onChange={(e) => handleChange(e, id, datamodal.id)}>{supername}</Checkbox>
                ))
            }
          </CheckboxGroup>
        </div>
      </div>
    </Modal>
  )
}
