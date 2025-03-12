import '../../css/sapLoader.css'

export default function SapLoader ({ message = 'Cargando datos, por favor espere' }) {
  return (
    <>
      <div className='flex justify-center my-10 content-center '>
        <div className='loader'>
          <div className='cell d-0' />
          <div className='cell d-1' />
          <div className='cell d-2' />

          <div className='cell d-1' />
          <div className='cell d-2' />

          <div className='cell d-2' />
          <div className='cell d-3' />

          <div className='cell d-3' />
          <div className='cell d-4' />

        </div>
      </div>

      <p className='text-center font-bold my-10 text-xl'>{message}</p>
    </>
  )
}
