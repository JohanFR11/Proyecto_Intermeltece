import axios from 'axios'

import { CREDENTIALS } from '../../../constants/constants.js'

async function main () {
  try {
    const url = `${CREDENTIALS.url}sap/byd/odata/cust/v1/khopportunity/OpportunityCollection?$format=json&$expand=DocumentReference,EmployeeResponsible/EmployeeResponsibleName,ProspectParty/ProspectPartyName,SalesBusinessArea,SalesUnit/SalesUnitName,Text,Item`
    const res = await axios.get(url, {
      auth: CREDENTIALS.auth
    })

    try {
      const data = res.data.d.results
      const results = { result: data, code: 200 }
      console.log(JSON.stringify(results))
    } catch (error) {
      const errorJson = { message: 'Error al traer los resultados', errorData: error, code: 400 }
      console.log(JSON.stringify(errorJson))
    }
  } catch (error) {
    const errorJson = { message: 'Error al traer los resultados', errorData: error, code: 400 }
    console.log(JSON.stringify(errorJson))
  }
}

main()
