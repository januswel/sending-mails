import { google } from 'googleapis'

import { OAuth2Client } from '../auth'
import encodeBase64Url from '../../util/base64url'

const sendMail = (auth: OAuth2Client, payload: string) => {
  const gmail = google.gmail({ version: 'v1', auth })
  return gmail.users.messages.send({
    auth,
    userId: 'me',
    requestBody: {
      raw: encodeBase64Url(payload),
    },
  })
}
export default sendMail
