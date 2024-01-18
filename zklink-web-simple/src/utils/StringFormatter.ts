import { lowerCase, startCase } from 'lodash'

export class StringFormatter {
  static numberSign(value: number | string) {
    const number = parseFloat(String(value))
    if (isNaN(number)) return String(value)
    if (number > 0) {
      return `+${value}`
    } else {
      return `${value}`
    }
  }

  static startCase(string: string) {
    if (!string) return ''
    return startCase(lowerCase(string))
  }
}
