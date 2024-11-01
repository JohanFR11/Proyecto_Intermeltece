import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
export const showAlert = ({ title, text, icon, loading }) => {
  return MySwal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    allowOutsideClick: false,
    didClose: () => {
      if (loading) {
        MySwal.showLoading({
          title: 'Generando cotizaciones, por favor espere',
          allowEscapeKey: false,
          allowOutsideClick: false
        })
      }
    }
  })
}

export const handleSwalSuccess = ({ response }) => {
  return MySwal.fire({
    icon: 'success',
    title: '¡Éxito!',
    text: response.data.message
  })
}

export const handleSwalError = () => {
  return MySwal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Hubo un error al crear el Servidor'
  })
}
