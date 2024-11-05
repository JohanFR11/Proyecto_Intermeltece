/* eslint-disable no-undef */
// import { Link } from '@inertiajs/react'
import { Card, CardFooter, Image } from '@nextui-org/react'
import { ROLES_CONSTANTS } from '@/constants/initialValues'
import DeleteButton from '../Fragments/DeleteButton'
import FailImage from '@/Components/FailImage'

export default function CardComponent ({ name, size, id, user }) {
  return (
    <Card isFooterBlurred radius='lg' className='border-none'>
      <Image alt='Woman listing to music' className='object-cover' height={size} src='/img/pdfImage.jpg' width={size} onError={<FailImage />} />
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
