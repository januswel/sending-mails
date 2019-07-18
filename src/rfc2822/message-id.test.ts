import buildMessageId, { formatDatetime } from './message-id'
describe('message-id', () => {
  describe('buildMessageId', () => {
    it('returns message ids', () => {
      expect(buildMessageId('janus.wel.3@gmail.com')).toMatch(/<\d{17}janus\.wel\.3@gmail\.com>/)
    })
  })

  describe('formatDatetime', () => {
    it('returns 17 digits strings', () => {
      expect(formatDatetime(new Date(2019, 5, 8, 23, 46, 12, 384))).toBe('20190608234612384')
    })
  })
})
