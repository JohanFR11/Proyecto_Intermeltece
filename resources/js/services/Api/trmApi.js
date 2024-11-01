export const trmApi = async () => {
  try {
    const request = await fetch(
      'https://www.datos.gov.co/resource/32sa-8pi3.json'
    )
    const valores = await request.json()

    return { valores }
  } catch (error) {
    throw new Error(`Error al obtener los datos de TRM: ${error}`)
  }
}
