export type MessageBody = string

const MAX_LENGTH = 248

const buildBody = (body?: MessageBody) => {
  if (!body) {
    return ''
  }

  const lines = body.replace(/\r\n/g, '\n').split(/\n/g)
  const divided = lines.reduce((result: Array<string>, line) => {
    if (line.length <= MAX_LENGTH) {
      result.push(line)
      return result
    }

    const iteration = Math.ceil(line.length / MAX_LENGTH)
    let start = 0
    let end = start + MAX_LENGTH
    for (let i = 0; i < iteration; ++i) {
      result.push(line.substring(start, end))
      start += MAX_LENGTH
      end += MAX_LENGTH
    }
    return result
  }, [])
  return divided.join('\n')
}

export default buildBody
