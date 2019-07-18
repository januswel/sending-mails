interface TemplateParameters {
  [key: string]: number | string
}

const generateBody = (template: string, params: TemplateParameters) => {
  let result = (' ' + template).substring(1)
  Object.keys(params).forEach(key => {
    result = result.replace('${' + key + '}', params[key].toString())
  })
  return result
}

export default generateBody
