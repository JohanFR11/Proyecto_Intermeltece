import { useState } from 'react'
import { useForm } from '@inertiajs/react'

import { Input, Checkbox, CheckboxGroup } from '@nextui-org/react'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import InputError from '@/Components/InputError'

export const RoleForm = ({ closeModal, showPermissions, operation }) => {
  const [checked, setChecked] = useState([])
  const { data, setData, post, processing, errors, reset } = useForm({ nameRol: '', permissions: [] })

  const handleInputChange = (e) => {
    let updateList = [...checked]
    if (e.target.checked) {
      updateList = [...checked, e.target.value]
    } else {
      updateList.splice(checked.indexOf(e.target.value))
    }
    setChecked(updateList)

    setData({ ...data, permissions: updateList })
  }

  const handelNewText = (e) => {
    setData({ ...data, nameRol: e.target.value })
  }

  const save = (e) => {
    e.preventDefault()
    post('/rols', data)
    reset()
    closeModal()
  }

  return (
    <>
      {operation === 1
        ? (<h1>Hola desde op 1</h1>)
        : (
          <form onSubmit={save}>
            <div className='my-6'>
              <Input type='text' onChange={handelNewText} value={data.nameRol} label='Nombre de Rol a Crear' isRequired radius='sm' />
            </div>
            <InputError message={errors.nameRol} className='mt-2' />
            <CheckboxGroup label='Selecciona los permisos'>
              {showPermissions.map(({ id, supername }) => (
                <Checkbox key={id} type='checkbox' value={id} onChange={handleInputChange}>{supername}</Checkbox>
              ))}
            </CheckboxGroup>
            <div className='mt-6 flex justify-end gap-6'>
              {operation === 2 ? <PrimaryButton type='submit' disabled={processing}>Crear</PrimaryButton> : ''}
              <SecondaryButton onClick={closeModal}>Cerrar</SecondaryButton>
            </div>
          </form>
          )}
    </>

  )
}
