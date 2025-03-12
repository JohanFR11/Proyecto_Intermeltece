const options = {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
}

export const dateFormatter = (date) => {
  const fecha = new Date(date)
  const dateFormatted = fecha.toLocaleDateString('es-CO', options)

  return dateFormatted
}

export const dateTimeFormatted = (date) => {
  const fecha = new Date(date)
  const datetimeFormatted = fecha.toLocaleTimeString('es-CO', options)

  return datetimeFormatted
}
