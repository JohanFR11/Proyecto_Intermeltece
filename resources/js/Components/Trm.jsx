import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export function TrmTable ({ valores }) {
  return (
    <section className='py-12'>
      <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
        <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
          <h2 className='text-center font-bold text-xl mt-3'>TRM</h2>
          <table>
            <thead>
              <tr>
                <th>Valor</th>
                <th>Vigencia Hasta</th>
              </tr>
            </thead>
            <tbody>
              {valores.map((valor, index) => (
                <tr key={index}>
                  <td>{valor.valor}</td>
                  <td>{valor.vigenciahasta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export function TrmGraph ({ valores, trmInCop }) {
  const labels = valores.map((item) => item.vigenciahasta.split('T')[0])
  const values = valores.map((item) => parseFloat(item.valor))
  const midata = {
    labels,
    datasets: [
      {
        label: 'TRM Dia',
        data: values,
        tension: 0.2,
        fill: true,
        borderColor: 'rgb(57, 81, 129)',
        backgroundColor: 'rgba(57, 81, 129, 0.5)',
        pointRadius: 1
      }
    ]
  }

  const misOpciones = {
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (value) {
            return value.toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP'
            })
          }
        }
      }
    }
  }
  return (
    <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>
      <div className='p-10'>
        <h2 className='text-center font-bold text-xl mt-3'>Precio del dolar del dia de hoy: {trmInCop}</h2>
        <Line data={midata} options={misOpciones} />
      </div>
    </div>
  )
}

export function NoTrmResult () {
  return <p> No se encontraron datos de TRM</p>
}

export function Trm ({ valores }) {
  const hasTrm = valores?.length > 0

  return hasTrm ? <TrmTable valores={valores} /> : <NoTrmResult />
}
