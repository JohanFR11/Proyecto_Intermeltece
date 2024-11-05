import axios from 'axios'
import { CREDENTIALS } from '../../../../sap/constants/constants.js'
export const todaySales = () => {
  try {
    const url = `${CREDENTIALS.url}sap/byd/odata/analytics/kpi/Kpi.svc/Kpi('Z06B490E4B983CB96DD195ADF')/Value?$format=json`
    const request = axios(url, {
      auth: CREDENTIALS.auth
    })
    console.log(request)
  } catch (error) {
    console.error(error)
  }
}
