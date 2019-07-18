import buildHeaders, { serializeMailBox, serializeMailBoxes } from './headers'

describe('headers', () => {
  describe('buildHeaders', () => {
    it('returns serialized headers', () => {
      const actual = buildHeaders({
        from: {
          displayName: 'januswel',
          mailAddress: 'janus.wel.3@gmail.com',
        },
        to: [
          {
            displayName: 'foo',
            mailAddress: 'foo@example.com',
          },
          {
            displayName: 'bar',
            mailAddress: 'bar@example.com',
          },
        ],
      })
      expect(actual).toMatch(/Date:/)
      expect(actual).toMatch(/Message-ID:/)
      expect(actual).toMatch(/From:/)
      expect(actual).toMatch(/To:/)
    })
    it('throws error when any to/cc/bcc are not specified', () => {
      expect(() => {
        buildHeaders({
          from: 'janus.wel.3@gmail.com',
        })
      }).toThrow()
    })
  })

  describe('serializeMailBox', () => {
    it('returns string', () => {
      expect(serializeMailBox('janus.wel.3@gmail.com')).toBe('janus.wel.3@gmail.com')
      expect(
        serializeMailBox({
          displayName: 'januswel',
          mailAddress: 'janus.wel.3@gmail.com',
        }),
      ).toBe('=?UTF-8?B?amFudXN3ZWw=?= <janus.wel.3@gmail.com>')
    })
  })

  describe('serializeMailBoxes', () => {
    it('returns string', () => {
      expect(
        serializeMailBoxes([
          'janus.wel.3@gmail.com',
          {
            displayName: 'januswel',
            mailAddress: 'janus.wel.3@gmail.com',
          },
        ]),
      ).toBe(`janus.wel.3@gmail.com,
 =?UTF-8?B?amFudXN3ZWw=?= <janus.wel.3@gmail.com>`)
    })
  })
})
