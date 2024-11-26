import { usePage   } from '@inertiajs/react'
import CardComponent from '../Components/CardComponent'
import Paginator from '@/Components/Paginator'

export default function CardList ({ user }) {
  const { documents } = usePage().props
  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 m-5 gap-5'>
        {documents.data.length !== 0
          ? documents.data.map(({ id, hseqFilename, filename }) => (
            <CardComponent key={id} name={hseqFilename} extName={filename}size={800} id={id} user={user} />
          ))
          : <p> No hay datos para mostrar </p>}
      </div>

      <Paginator paginate={documents.links} />
    </>
  )
}
