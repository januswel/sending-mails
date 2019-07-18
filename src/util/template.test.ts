import generateBody from './template'

describe('template', () => {
  describe('generateBody', () => {
    it('returns text from template and parameters', () => {
      const template = 'This is template: ${foo} ${bar}'
      const actual = generateBody(template, {
        foo: 1234,
        bar: 'ああああ',
      })
      expect(actual).toBe('This is template: 1234 ああああ')
    })
  })
})
