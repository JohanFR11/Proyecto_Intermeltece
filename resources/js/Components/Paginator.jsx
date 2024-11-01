import { Link } from '@inertiajs/react'

export default function Paginator ({ paginate }) {
  const getClassName = (active) => {
    if (active) {
      return 'mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-primary focus:text-primary bg-blue-700 text-white'
    } else {
      return 'mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-primary focus:text-primary'
    }
  }

  return (
    <div className='flex w-full justify-center'>
      {
        paginate.map((page, index) => (
          page.url === null
            ? (
              <div
                key={index}
                className='mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded'
              ><p dangerouslySetInnerHTML={{ __html: page.label }} />
              </div>
              )
            : (
              <Link
                key={index}
                className={getClassName(page.active)}
                href={page.url}
              ><p dangerouslySetInnerHTML={{ __html: page.label }} />
              </Link>
              )
        ))
      }

    </div>
  )
}
