import request from 'request'

export const winOpportunity = (req, res) => {
  const opportunity = req.query.ObjectID
  if (!opportunity || opportunity === "''") {
    res.status(400).send('Error: ObjectID de la oportunidad es requerido en la solicitud').end()
  }
  const cookies = request.jar()

  request({
    method: 'GET',
    uri: `${process.env.SAP_URL_TEST}sap/byd/odata/cust/v1/khopportunity`,
    jar: cookies,
    headers: {
      Authorization: 'Basic ' + btoa(`${process.env.SAP_USERNAME_TEST}:${process.env.SAP_PASSWORD_TEST}`),
      'Content-Type': 'application/json',
      'x-csrf-token': 'fetch'
    }
  }, (_error, response, body) => {
    try {
      const csrfToken = response.headers['x-csrf-token']

      if (!csrfToken) {
        throw new Error('Error al obtener el Token de Authorizacion CSRF')
      }

      request({
        method: 'POST',
        url: `${process.env.SAP_URL_TEST}sap/byd/odata/cust/v1/khopportunity/Win?ObjectID=${opportunity}`,
        jar: cookies,
        headers: {
          Authorization: 'Basic ' + btoa(`${process.env.SAP_USERNAME_TEST}:${process.env.SAP_PASSWORD_TEST}`),
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'x-csrf-token': csrfToken
        }
      }, (_error, response, body) => {
        const jsonParse = JSON.parse(body)
        try {
          if (response.statusCode !== 200) {
            throw new Error('Error: No se pudo ganar la oportunidad')
          }
          res.setHeader('Content-Type', 'application/json')
          res.status(response.statusCode).json({ message: 'Oportunidad Ganada!!', data: jsonParse.d.results }).end()
        } catch (error) {
          res.setHeader('Content-Type', 'application/json')
          res.status(response.statusCode).send(body).end()
        }
      })
    } catch (error) {
      res.status(response.statusCode).send(body).end()
    }
  })
}

export const loseOpportunity = (req, res) => {
  const opportunity = req.query.ObjectID
  if (!opportunity || opportunity === "''") {
    res.status(400).send('Error: ObjectID de la oportunidad es requerido en la solicitud').end()
  }
  const cookies = request.jar()

  request({
    method: 'GET',
    uri: `${process.env.SAP_URL_TEST}sap/byd/odata/cust/v1/khopportunity`,
    jar: cookies,
    headers: {
      Authorization: 'Basic ' + btoa(`${process.env.SAP_USERNAME_TEST}:${process.env.SAP_PASSWORD_TEST}`),
      'Content-Type': 'application/json',
      'x-csrf-token': 'fetch'
    }
  }, (_error, response, body) => {
    try {
      const csrfToken = response.headers['x-csrf-token']

      if (!csrfToken) {
        throw new Error('Error al obtener el Token de Authorizacion CSRF')
      }

      request({
        method: 'POST',
        url: `${process.env.SAP_URL_TEST}sap/byd/odata/cust/v1/khopportunity/Lose?ObjectID=${opportunity}`,
        jar: cookies,
        headers: {
          Authorization: 'Basic ' + btoa(`${process.env.SAP_USERNAME_TEST}:${process.env.SAP_PASSWORD_TEST}`),
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'x-csrf-token': csrfToken
        }
      }, (_error, response, body) => {
        const jsonParse = JSON.parse(body)
        try {
          if (response.statusCode !== 200) {
            throw new Error('Error: No se pudo ganar la oportunidad')
          }
          res.setHeader('Content-Type', 'application/json')
          res.status(response.statusCode).json({ message: 'Oportunidad Perdida!!', data: jsonParse.d.results }).end()
        } catch (error) {
          res.setHeader('Content-Type', 'application/json')
          res.status(response.statusCode).send(body).end()
        }
      })
    } catch (error) {
      res.status(response.statusCode).send(body).end()
    }
  })
}
