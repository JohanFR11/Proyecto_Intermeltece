import { Link } from '@inertiajs/react'

export default function Subheader ({ subroutes }) {
  return (
    <div className='flex justify-start p-4 bg-white rounded-md'>
      {subroutes.map(({ name, route }, index) => (
        <Link key={index} href={route} className='py-2 px-4 mx-2 border-none rounded transition-all hover:bg-indigo-800 hover:text-white'>{name}</Link>
      ))}
    </div>
  )
}
