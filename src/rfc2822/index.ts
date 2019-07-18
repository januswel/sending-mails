import buildHeaders, { HeaderOptions } from './headers'
import buildBody, { MessageBody } from './body'

type Message = string
export interface MessageOptions {
  headers: HeaderOptions
  body?: MessageBody
}
const buildMessage = (options: MessageOptions): Message => {
  const headers = buildHeaders(options.headers)
  const body = buildBody(options.body)

  return [headers, '', body]
    .join('\n')
    .replace(/\r\n/g, '\n')
    .replace(/\n/g, '\r\n')
}

export default buildMessage
