import { MailAddress } from './mail-address'
import buildMessageId from './message-id'
import buildDate from './date'

type MailBox =
  | MailAddress
  | {
      displayName: string
      mailAddress: MailAddress
    }

export interface HeaderOptions {
  from: MailBox
  to?: Array<MailBox>
  cc?: Array<MailBox>
  bcc?: Array<MailBox>
  replyTo?: Array<MailBox>
  subject?: string
}

interface Rfc2822Headers {
  [key: string]: string
}
const buildHeaders = ({ from, to, cc, bcc, replyTo, subject }: HeaderOptions) => {
  if (!to && !cc && !bcc) {
    throw new Error('Specify To / Cc / Bcc')
  }

  const headers: Rfc2822Headers = {
    Date: buildDate(),
    'Message-ID': buildMessageId(typeof from === 'string' ? from : from.mailAddress),
    From: serializeMailBox(from),
  }

  if (to) {
    headers.To = serializeMailBoxes(to)
  }
  if (cc) {
    headers.Cc = serializeMailBoxes(cc)
  }
  if (bcc) {
    headers.Bcc = serializeMailBoxes(bcc)
  }
  if (replyTo) {
    headers['Reply-To'] = serializeMailBoxes(replyTo)
  }
  if (subject) {
    headers.Subject = encodeUtf8(subject)
  }

  return Object.keys(headers)
    .map(key => `${key}:${headers[key]}`)
    .join('\n')
}
export default buildHeaders

export const serializeMailBox = (mailBox: MailBox) => {
  if (typeof mailBox === 'string') {
    return mailBox
  }
  const encodedDisplayName = encodeUtf8(mailBox.displayName)
  return `${encodedDisplayName} <${mailBox.mailAddress}>`
}

const encodeUtf8 = (src: string) => {
  const base64 = Buffer.from(src).toString('base64')
  return `=?UTF-8?B?${base64}?=`
}

export const serializeMailBoxes = (mailBoxes: Array<MailBox>) =>
  mailBoxes.map(mailBox => serializeMailBox(mailBox)).join(',\n ')
