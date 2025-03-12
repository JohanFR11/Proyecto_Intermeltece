// import Echo from 'laravel-echo'
// import { useEffect } from 'react'
// import { toast, ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

// export function RealTimeNotification ({ event }) {
//   const options = {
//     broadcaster: 'pusher',
//     key: import.meta.env.VITE_PUSHER_APP_KEY,
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
//     wsHost: import.meta.env.VITE_PUSHER_HOST ? import.meta.env.VITE_PUSHER_HOST : `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
//     wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
//     wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
//     forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
//     enabledTransports: ['ws', 'wss']
//   }

//   useEffect(() => {
//     // eslint-disable-next-line no-undef
//     const echo = new Echo(options)
//     echo.private(event)
//       .notification((notification) => {
//         toast.info(notification.message)
//       })

//     return () => {
//       echo.leave(event)
//     }
//   }, [])

//   return (
//     <ToastContainer autoClose={5000} />
//   )
// }
