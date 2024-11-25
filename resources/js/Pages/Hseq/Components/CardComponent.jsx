/* eslint-disable no-undef */
// import { Link } from '@inertiajs/react'
import { Card, CardFooter, Image } from '@nextui-org/react'
import { ROLES_CONSTANTS } from '@/constants/initialValues'
import DeleteButton from '../Fragments/DeleteButton'
import FailImage from '@/Components/FailImage'
import PreviewButton from '../Fragments/PreviewButton'

export default function CardComponent ({ name, extName ,size, id, user }) {
  return (
    <Card isFooterBlurred radius='lg'  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-none rounded-xl overflow-hidden" >
      <div className="flex justify-center p-3 bg-blue-700 rounded-t-xl">
        <PreviewButton fileId={id} fileName={extName} />
      </div>
      <Image alt='Vista previa del archivo' className='object-cover' height={size} src='/img/pdfImage.jpg' width={size} onError={<FailImage />} />
      <CardFooter className='block before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10'>
        <p className='text-lg text-center text-black'>{name}</p>
        <div className='flex justify-center'>
          <a href={route('resources.hseq.download', id)} className='text-tiny text-white bg-blue-800 px-4 py-2 rounded-full mx-1' color='default' radius='lg' size='sm'>
            Descargar
          </a>
          {
          user === ROLES_CONSTANTS.Admin || user === ROLES_CONSTANTS.Hseq
            ? (
              <DeleteButton id={id} />
              )
            : ''
        }
        </div>
      </CardFooter>
    </Card>
  )
}
