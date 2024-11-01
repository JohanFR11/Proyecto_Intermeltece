import { Input, Select, SelectItem, Checkbox, Button } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { calculateTotal } from '../logic/calculatedTotal'
import { partsPrice } from '../logic/partsPrice'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { SERVER_INITIAL_VALUES } from '../../../constants/initialValues'

export const FormCalculator = ({ soParts, parts, onCalculateUpdate, onTotalUpdate }) => {
  const [total, setTotal] = useLocalStorage('total', 0)
  const [selectedValues, setSelectedValues] = useLocalStorage('serverParts', SERVER_INITIAL_VALUES)
  const [isChecked, setIsChecked] = useState(false)
  const setPartsPrice = partsPrice({ parts })
  useEffect(() => {
    const newTotalPrice = calculateTotal({ selectedValues, setPartsPrice })
    setTotal(newTotalPrice)
  }, [selectedValues])

  const handleInput = (e, field) => {
    let value = e.target.value ? e.target.value : 0

    if (field === 'so') {
      value = parseInt(value) ? parseInt(value) : 4
      value = parseFloat(parts.find(part => part.id === value).usdPrice)
    } else if (field === 'sql2core' || field === 'rdp' || field === 'ip') {
      value = e.target.checked ? selectedValues[field] = 1 : 0
    } else {
      value = parseInt(value)
    }

    const newValues = { ...selectedValues }
    newValues[field] = value

    setSelectedValues(newValues)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSelectedValues(selectedValues)
    onCalculateUpdate(selectedValues)
    onTotalUpdate(total)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex gap-2'>
        <Input
          type='number' label='Nucleos de CPU' value={selectedValues.cpuCores} radius='sm' labelPlacement='inside' isRequired description='Procesador' min={1} onChange={(e) => handleInput(e, 'cpuCores')} endContent={
            <div className='pointer-events-none flex items-center'>
              <span className='text-default-400 text-small'>Nucleos</span>
            </div>
                      }
        />
        <Input
          type='number' label='Memoria RAM' value={selectedValues.ram} isRequired min={1} radius='sm' labelPlacement='inside' description='Memoria RAM' max={64} onChange={(e) => handleInput(e, 'ram')} endContent={
            <div className='pointer-events-none flex items-center'>
              <span className='text-default-400 text-small'>GB</span>
            </div>
                      }
        />
      </div>
      <div className='flex gap-2'>
        <Input
          type='number' label='Almacenamiento' value={selectedValues.storage} isRequired radius='sm' labelPlacement='inside' description='Almacenamiento' max={250} min={1} onChange={(e) => handleInput(e, 'storage')} endContent={
            <div className='pointer-events-none flex items-center'>
              <span className='text-default-400 text-small'>GB</span>
            </div>
                      }
        />
        <Input
          type='number' label='Ancho de Banda' value={selectedValues.bandwidth} isRequired radius='sm' labelPlacement='inside' description='Ancho de Banda' min={1} onChange={(e) => handleInput(e, 'bandwidth')} endContent={
            <div className='pointer-events-none flex items-center'>
              <span className='text-default-400 text-small'>Mb/s</span>
            </div>
                      }
        />
      </div>
      <div className='flex my-2 gap-2 '>
        <Select label='Sistema Operativo S.O' className='max-w-xs text-black' onChange={(e) => handleInput(e, 'so')} isRequired defaultValue={0}>
          {soParts.map(({ id, product, usdPrice }) => (
            <SelectItem key={id} value={usdPrice} textValue={product}> {product} </SelectItem>
          ))}
        </Select>
      </div>
      <div className='flex gap-2'>
        <Checkbox onChange={() => {
          setIsChecked(!isChecked)
        }}
        >¿Desea Añadir adicionales?
        </Checkbox>
      </div>
      {isChecked && (
        <div className='grid gap-2 my-6'>
          <Checkbox onChange={(e) => handleInput(e, 'sql2core')}>Licencia SQL 2 CORE</Checkbox>
          <Checkbox onChange={(e) => handleInput(e, 'rdp')}>Licencia RDP SPLA</Checkbox>
          <Checkbox onChange={(e) => handleInput(e, 'ip')}>IP Publica</Checkbox>
          <Input
            type='number' label='Usuarios Extra de SQL 2 Server' radius='sm' labelPlacement='inside' description='Usuarios Extra de SQL 2 Server' min={0} onChange={(e) => handleInput(e, 'sql2extra')} endContent={
              <div className='pointer-events-none flex items-center'>
                <span className='text-default-400 text-small'>Usuarios</span>
              </div>
                      }
          />
          <Input
            type='number' label='Usuarios Extra RDP SPLA' radius='sm' labelPlacement='inside' description='Usuarios Extra RDP SPLA' min={0} onChange={(e) => handleInput(e, 'rdpExtra')} endContent={
              <div className='pointer-events-none flex items-center'>
                <span className='text-default-400 text-small'>Usuarios</span>
              </div>
                      }
          />
        </div>
      )}
      <div className='py-2 flex justify-center'>
        <h2 className='text-2xl'>Total del Servidor: </h2>
        <p className='text-2xl font-bold ml-2'> ${parseFloat(total).toFixed(2)} USD </p>
      </div>
      <div className='py-2 flex justify-end gap-2'>
        <Button type='submit'>Continuar</Button>
      </div>
    </form>
  )
}
