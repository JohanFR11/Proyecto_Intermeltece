export default function SubSideBar ({ children }) {
  return (
    <div className='absolute transition-all translate-x-40 mb-24 active:ml-6 duration-300 ease-in-out bg-white rounded px-2 py-1 ml-6 z-10'>
      <ul className='flex-1 px-3'>
        {children}
      </ul>
    </div>
  )
}
