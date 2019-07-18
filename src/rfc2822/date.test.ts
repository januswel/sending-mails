import { formatDatetime, buildZone } from './date'

describe('date', () => {
  describe('formatDatetime', () => {
    it('returns formatted datetime in RFC2822', () => {
      expect(formatDatetime(new Date(2019, 5, 8, 22, 36, 38))).toBe('8 Jun 2019 22:36:38 +0900')
      expect(formatDatetime(new Date(2019, 5, 9, 0, 25, 8))).toBe('9 Jun 2019 00:25:08 +0900')
    })
  })

  describe('buildZone', () => {
    it('returns zone string in RFC2822', () => {
      expect(buildZone(-540)).toBe('+0900') // Japan
      expect(buildZone(-345)).toBe('+0545') // Nepal
      expect(buildZone(210)).toBe('-0330') // Canada Newfoundland
    })
  })
})
