import axios from 'axios'
import { CREDENTIALS } from '../../../constants/constants.js'

async function main () {
  let url = ''
  const data = process.argv.slice(2)
  const dataParsed = JSON.parse(data[0])
  if (dataParsed.length === 0) {
    url = `${CREDENTIALS.url}sap/byd/odata/cust/v1/clientesv3/CustomerCollection?$format=json&$select=ObjectID,NombreCliente,CorreoCliente,FirstLineName,Direccion,TelefonoContacto,InternalID,Relationship&$filter=LifeCycleStatusCode eq '2'&$top=100000&$expand=Relationship`
  } else {
    url = `${CREDENTIALS.url}sap/byd/odata/cust/v1/clientesv3/CustomerCollection?$format=json&$select=ObjectID,NombreCliente,CorreoCliente,FirstLineName,Direccion,TelefonoContacto,InternalID,Relationship&$filter=${Object.keys(dataParsed)[0]} eq '${dataParsed.NombreCliente}'&$expand=Relationship`
  }

  try {
    const urlSAP = url

    const res = await axios(urlSAP, {
      auth: CREDENTIALS.auth
    })

    try {
      if (dataParsed.length === 0) {
        const data = res.data.d.results
        console.log(JSON.stringify(data))
      } else {
        const data = res.data.d.results
        console.log(JSON.stringify(data[0]))
      }
    } catch (error) {
      const errorJSon = { message: 'Error al traer los resultados', errorData: error, code: 400 }
      console.log(JSON.stringify(errorJSon))
    }
  } catch (error) {
    const errorJSon = { message: 'Error al traer los resultados', errorData: error, code: 400 }
    console.log(JSON.stringify(errorJSon))
  }
}

main()
