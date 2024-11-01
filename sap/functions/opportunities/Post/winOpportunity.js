/**
 * Funcion de API SAP para metodo POST usando JS
 *
 * @author Nicolas Cuadros <jcuadros@meltec.com.co>
 * @version 2.0.0
 */

import request from 'request'
import { CREDENTIALS } from '../../../constants/constants.js'

/**
 * @async function main() -> La unica funcion, ejecuta el script para crear la Oportunidad mediante Request HTTP
 * La funcion recibe por URL desde HTTP Laravel el body correspondiente en formato json texto
 *
 * @return JSON.stringify
 */

async function main () {
  const data = process.argv.slice(2)
  if (data[0] === '' || data[0] === '[]' || data[0] === '{"ObjectID":null}') {
    const error = { message: 'Error: ObjectID de la oportunidad es requerido en la solicitud', code: 400 }
    console.log(JSON.stringify(error))
  }

  /**
   * Obtener los datos y parsear a JSON
   */

  const dataParsed = JSON.parse(data[0])
  const opportunity = dataParsed.ObjectID
  const cookies = request.jar()

  /**
   * Primera función para obtener el token CSRF valido
   */

  request({
    method: 'GET',
    uri: `${CREDENTIALS.url}sap/byd/odata/cust/v1/cargar_oportunidad`,
    jar: cookies,
    headers: {
      Authorization: 'Basic ' + btoa(`${CREDENTIALS.auth.username}:${CREDENTIALS.auth.password}`),
      'Content-Type': 'application/json',
      'x-csrf-token': 'fetch'
    }
  }, (_error, response, body) => {
    try {
      const csrfToken = response.headers['x-csrf-token']

      /**
       * @return Throw Error: Error al obtener el Token CSRF
       */

      if (!csrfToken) {
        const danger = { message: 'Error al obtener el Token SAP', code: 500 }
        console.log(JSON.stringify(danger))
      }

      /**
       * Realizar el Post
       */

      request({
        method: 'POST',
        url: `${CREDENTIALS.url}sap/byd/odata/cust/v1/cargar_oportunidad/OpportunityWin?ObjectID='${opportunity}'`,
        jar: cookies,
        headers: {
          Authorization: 'Basic ' + btoa(`${CREDENTIALS.auth.username}:${CREDENTIALS.auth.password}`),
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'x-csrf-token': csrfToken
        }
      }, (_error, response, body) => {
        const jsonBody = JSON.parse(body)
        try {
          if (response.statusCode !== 200) {
            throw new Error('Error: No se pudo ganar la oportunidad')
          }
          const result = { code: 200, message: 'Oportunidad Ganada!!', result: jsonBody.d.results }
          /**
           * @return JSON.stringify de la respuesta de SAP
           */
          console.log(JSON.stringify(result))
        } catch (error) {
          const danger = { code: response.statusCode, message: 'Error al generar el WIN de la oportunidad en SAP', data: jsonBody }
          console.log(JSON.stringify(danger))
        }
      })
    } catch (error) {
      /**
       * @returs Errores de Post en SAP
       */
      const danger = { message: 'Hubo un error al generar la solicitud', code: response.statusCode }
      console.log(JSON.stringify(danger))
    }
  })
}

main()
