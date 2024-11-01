/* eslint-disable no-undef */
import { handleSwalError, handleSwalSuccess } from '@/helpers/swalHelper'
import { usePage } from '@inertiajs/react'
import { useDisclosure, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, CheckboxGroup, Checkbox, Select, SelectItem } from '@nextui-org/react'
import axios from 'axios'
import { useState } from 'react'

export default function KpiModalFragment () {
  const { roles, categories } = usePage().props
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [data, setData] = useState({
    reportName: '',
    urlData: {
      data: ''
    },
    roles: [],
    category: ''
  })
  const [selected, setSelected] = useState([])

  const handleInputChange = (e) => setData((prevData) => ({ ...prevData, reportName: e.target.value }))
  const handleUrlChange = (e) => {
    const jsonData = { data: e.target.value }
    setData((prevData) => ({ ...prevData, urlData: jsonData }))
  }

  const handleSelectChange = (e) => {
    setData((prevData) => ({ ...prevData, category: e.target.value }))
  }

  const handleSelected = (e) => {
    let updateList = [...selected]
    if (e.target.checked) {
      updateList = [...selected, e.target.value]
    } else {
      const indexToRemove = updateList.indexOf(e.target.value)
      if (indexToRemove !== -1) {
        updateList.splice(indexToRemove, 1)
      }
    }
    setSelected(updateList)

    setData((prevData) => ({ ...prevData, roles: updateList }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const request = await axios.post(route('kpi.reports.store'), data)

      if (request.status !== 201) {
        throw new Error('Error al crear el Kpi')
      }

      handleSwalSuccess({ message: request.data.message }).then((result) => { if (result.isConfirmed) { window.location.reload() } })

      console.log(request)
    } catch (error) {
      handleSwalError({ message: error.message })
    }
  }

  return (
    <>
      <Button color='primary' onPress={onOpen}>Nuevo KPI</Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center' backdrop='blur'>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className='flex flex-col gap-1'>Insertar Nuevo Informe</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label='Nombre del informe'
                  name='reportName'
                  placeholder='Ejm: Reporte de Ventas'
                  variant='bordered'
                  required
                  onChange={handleInputChange}
                />
                <Input
                  autoFocus
                  label='Url'
                  name='urlData'
                  placeholder='Ejm :  <iframe src="urldelinformedePowerby" ... />'
                  variant='bordered'
                  required
                  onChange={handleUrlChange}
                />

                <Select label='Seleccione la categoria del KPI' className='max-w' onChange={handleSelectChange}>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.category}</SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <CheckboxGroup label='Seleccione los roles que deseen ver este Informe' color='primary' className='mx-8'>
                {roles.map(({ id, name }) => (
                  <Checkbox key={id} value={id} onChange={handleSelected}>{name}</Checkbox>
                ))}
              </CheckboxGroup>
              <ModalFooter>
                <Button color='danger' variant='flat' onPress={onClose}>
                  Cerrar
                </Button>
                <Button color='primary' onPress={onClose} type='submit'>
                  Mostrar
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
