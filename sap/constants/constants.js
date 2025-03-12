import 'dotenv/config'

export const CREDENTIALS = {
  url: process.env.SAP_URL_PRODUCCTION,
  auth: {
    username: process.env.SAP_USERNAME_PRODUCTION,
    password: process.env.SAP_PASSWORD_PRODUCTION
  },
  urlTest: process.env.SAP_URL_TEST,
  authTest: {
    username: process.env.SAP_USERNAME_TEST,
    password: process.env.SAP_PASSWORD_TEST
  }
}
