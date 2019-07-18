const encodeBase64Url = (src: string) =>
  Buffer.from(src)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

export default encodeBase64Url
