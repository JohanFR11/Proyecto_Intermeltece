import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
export const showAlert = ({ title, text, icon, ...props }) => {
  return MySwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    allowOutsideClick: false,
    ...props
  })
}

export const handleSwalSuccess = ({ message, ...options }) => {
  return MySwal.fire({
    icon: 'success',
    title: '¡Éxito!',
    text: message,
    ...options
  })
}

export const handleSwalError = ({ message, ...options }) => {
  return MySwal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    ...options
  })
}

export const mixinSwal = async ({ title, text, icon, ...options }) => {
  return await MySwal.fire({
    toast: true,
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    ...options
  })
}
