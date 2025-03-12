export const HomeFooter = () => {
  return (
    <div className='flex justify-center p-6 sm:items-center sm:justify-between'>
      <div className='text-center text-sm text-gray-500 dark:text-gray-400 sm:text-left m-auto'>
        <div className='flex items-center gap-4'>
          <p>Sitio web de Meltec en Desarrollo </p>
          <a className='hover:text-red-400' href='mailto:jcuadros@meltec.com.co' target='_blank' rel='noreferrer'><p>Version <span className='font-extrabold'> Beta V 0.5 </span> - Github </p></a>
        </div>
      </div>
    </div>
  )
}
