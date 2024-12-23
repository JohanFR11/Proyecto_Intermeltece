import { priceFormatted } from '@/helpers/priceHelper'
import { Slider } from '@nextui-org/react'

export default function SidebarMeta ({ kpi, totalRevenue}) {
  const { TargetDeltaPct, CurrentValue ,TargetValue, CurrentValueText, Name, TargetDeltaAbs } = kpi
  const marks = [
    {
      value: 0,
      label: '0%'
    },
    {
      value: parseFloat(TargetValue) * 0.2,
      label: '20%'
    },
    {
      value: parseFloat(TargetValue) / 2,
      label: '50%'
    },
    {
      value: parseFloat(TargetValue) * 0.8,
      label: '80%'
    },
    {
      value: parseFloat(TargetValue),
      label: '100%'
    }
  ]
  const valueMax = parseFloat(TargetValue)

  const valueSlider = (100 + parseFloat(TargetDeltaPct)) / 100
  const colorSlider = (valueSlider * 100) >= 50 ? 'warning' : (valueSlider * 100) >= 80 ? 'success' : 'danger'

  const Resultadofinal = (totalRevenue - TargetValue)

  return (
    <>
      <Slider isDisabled size='lg' maxValue={valueMax} minValue={0} aria-label='Meta 2023' defaultValue={parseFloat(totalRevenue)} marks={marks} css={{
          '& .nextui-slider-bar': {
            backgroundColor: 'rgb(57, 81, 129)', // Cambiar el color de la barra
          },
          '& .nextui-slider-thumb': {
            backgroundColor: 'rgb(57, 81, 129)', // Cambiar el color del thumb
            borderColor: '#395181', // Cambiar el borde del thumb
          }
        }} label={[CurrentValueText, " || " , " Meta propuesta: " ,  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(TargetValue)]} formatOptions={{ style: 'currency', currency: 'COP', minimumFractionDigits: 0 }} />
      <h3 className='p-6 text-right'>Faltan: <span className='font-semibold text-red-600'> {priceFormatted({ price: Math.abs(Resultadofinal), currency: 'COP', fractionDigits: 0 })} </span> Para llegar a la meta del año {new Date().getFullYear()}</h3>
    </>
  )
}
