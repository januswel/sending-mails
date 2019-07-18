import padZeros from './pad-zeros'

type Rfc2822DateTime = string

const MONTH_NAME = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const buildDate = (): Rfc2822DateTime => {
  const now = new Date()
  return formatDatetime(now)
}
export default buildDate

export const formatDatetime = (date: Date): Rfc2822DateTime => {
  const day = date.getDate()
  const month = MONTH_NAME[date.getMonth()]
  const year = date.getFullYear()
  const hour = padZeros(date.getHours())
  const minute = padZeros(date.getMinutes())
  const second = padZeros(date.getSeconds())
  const zone = buildZone(date.getTimezoneOffset())
  return `${day} ${month} ${year} ${hour}:${minute}:${second} ${zone}`
}

type Zone = string
export const buildZone = (offset: number): Zone => {
  const offsetDirection = 0 <= offset ? '-' : '+'
  const offsetHour = padZeros(Math.floor(Math.abs(offset) / 60))
  const offsetMinute = padZeros(Math.abs(offset) % 60)

  return `${offsetDirection}${offsetHour}${offsetMinute}`
}
