import * as fs from 'fs'
import { google } from 'googleapis'
import { OAuth2Client, Credentials } from 'google-auth-library'

import getQuestion from '../../util/question'

interface OAuth2ClientOptions {
  installed: {
    client_secret: string
    client_id: string
    redirect_uris: Array<string>
  }
}
type Scopes = Array<string>

const TOKEN_PATH = 'token.json'
const CREDENTIALS_PATH = 'credentials.json'

const loadCredentials = () => JSON.parse(fs.readFileSync(CREDENTIALS_PATH).toString())
const buildClient = (credentials: OAuth2ClientOptions) => {
  const {
    client_secret,
    client_id,
    redirect_uris: [redirect_uri],
  } = credentials.installed

  return new google.auth.OAuth2(client_id, client_secret, redirect_uri)
}
const getNewToken = (oAuth2Client: OAuth2Client, scopes: Scopes) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  })
  console.log('Authorize this app by visiting this url:', authUrl)

  const question = getQuestion()
  return question('Enter the code from that page here: ').then((code: string) =>
    oAuth2Client
      .getToken(code)
      .then(response => {
        const { tokens } = response
        if (!tokens) {
          throw new Error('Error retrieving access token')
        }

        return tokens
      })
      .catch(err => {
        throw err
      }),
  )
}
const loadToken = () => JSON.parse(fs.readFileSync(TOKEN_PATH).toString())
const getToken = (client: OAuth2Client, scopes: Scopes) =>
  new Promise<Credentials>(resolve => {
    const token = loadToken()
    resolve(token)
  }).catch(() => {
    return getNewToken(client, scopes).then(token => {
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token))
      console.log('Token stored to', TOKEN_PATH)

      return token
    })
  })

const authorize = (scopes: Scopes) => {
  const credentials = loadCredentials()
  const client = buildClient(credentials)
  return getToken(client, scopes).then(token => {
    client.setCredentials(token)
    return client
  })
}

export default authorize
export { OAuth2Client }
