import { MailAddress } from './mail-address'
import padZeros from './pad-zeros'

const buildMessageId = (from: MailAddress) => {
  const now = new Date()
  return `<${formatDatetime(now)}${from}>`
}
export default buildMessageId

export const formatDatetime = (datetime: Date) => {
  const year = datetime.getFullYear()
  const month = padZeros(datetime.getMonth() + 1)
  const date = padZeros(datetime.getDate())
  const hour = padZeros(datetime.getHours())
  const minute = padZeros(datetime.getMinutes())
  const second = padZeros(datetime.getSeconds())
  const millisecond = padZeros(datetime.getMilliseconds(), 3)
  return `${year}${month}${date}${hour}${minute}${second}${millisecond}`
}
