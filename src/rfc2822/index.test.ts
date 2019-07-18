import buildMessage from './index'

describe('buildMessage', () => {
  it('returns messages', () => {
    const actual = buildMessage({
      headers: {
        from: 'janus.wel.3@gmail.com',
        to: ['foo@example.com'],
      },
      body: `Hi foo

Write tests.

Regards`,
    })
    expect(actual).toMatch(/Hi/)
    console.log(actual)
  })
})
