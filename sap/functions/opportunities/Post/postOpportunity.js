import request from 'request'
import { CREDENTIALS } from '../../../constants/constants.js'
import { dateFormatted } from '../../../constants/dateFormatted.js'

async function main () {
  const data = process.argv.slice(2)
  const dataParsed = JSON.parse(data[0])

  const cookies = request.jar()

  try {
    request({
      method: 'GET',
      uri: `${CREDENTIALS.url}sap/byd/odata/cust/v1/cargar_oportunidad`,
      jar: cookies,
      headers: {
        Authorization: 'Basic ' + btoa(`${CREDENTIALS.auth.username}:${CREDENTIALS.auth.password}`),
        'Content-Type': 'application/json',
        'x-csrf-token': 'fetch'
      }
    }, (error, response, body) => {
      if (!error) {
        const csrfToken = response.headers['x-csrf-token']
        const dataSend = dataParsed
        dataSend.StartDate = `/Date(${dateFormatted(dataParsed.StartDate)})/`
        dataSend.EndDate = `/Date(${dateFormatted(dataParsed.EndDate)})/`
        request({
          method: 'POST',
          url: `${CREDENTIALS.url}sap/byd/odata/cust/v1/cargar_oportunidad/OpportunityCollection`,
          jar: cookies,
          headers: {
            Authorization: 'Basic ' + btoa(`${CREDENTIALS.auth.username}:${CREDENTIALS.auth.password}`),
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
          },
          json: dataSend
        }, async (_error, response, body) => {
          try {
            if (response.statusCode !== 201) {
              throw new Error('Error al enviar la solicitud')
            } else {
              const message = { code: response.statusCode, message: 'Oportunidad Creada', opportunity: body.d.results, opportunityObjectId: body.d.results.ObjectID, opportunityID: body.d.results.ID }
              const resutls = JSON.stringify(message)
              console.log(resutls)
            }
          } catch (err) {
            const bodyError = { code: response.statusCode, message: body }
            console.log(JSON.stringify(bodyError))
          }
        })
      } else {
        const bodyError = { code: response.statusCode, message: body.error }
        console.log(JSON.stringify(bodyError))
        // res.status(response.statusCode).send(body.error.message.value).end()
      }
    })
  } catch (error) {
    console.error(JSON.stringify(error))
  }
}

main()
