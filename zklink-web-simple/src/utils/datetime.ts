import dayjs from 'dayjs'
import { Timestamp } from '../types'

export class DateFormatter {
  static toUSDateTime(timestamp: Timestamp) {
    return dayjs(this.toMilliseconds(timestamp)).format('MM/DD/YYYY hh:mm:ss A')
  }
  static toUSDate(timestamp: Timestamp) {
    return dayjs(this.toMilliseconds(timestamp)).format('MM/DD/YYYY')
  }
  static toISODateTime(timestamp: Timestamp) {
    return dayjs(this.toMilliseconds(timestamp)).format('YYYY-MM-DD hh:mm:ss')
  }

  static toUnixSeconds(timestamp: Timestamp) {
    if (this.isMilliseconds(timestamp)) {
      timestamp = Number(timestamp) / 1000
    } else if (this.isMicroseconds(timestamp)) {
      timestamp = Number(timestamp) / 1000 / 1000
    }
    return Math.floor(Number(timestamp))
  }
  static toMilliseconds(timestamp: Timestamp) {
    if (this.isMicroseconds(timestamp)) {
      timestamp = Number(timestamp) / 1000
    } else if (this.isUnixSeconds(timestamp)) {
      timestamp = Number(timestamp) * 1000
    }
    return Math.floor(Number(timestamp))
  }

  static isMicroseconds(timestamp: Timestamp) {
    if (typeof timestamp !== 'number') {
      timestamp = Number(timestamp)
    }
    if (isNaN(timestamp)) {
      return false
    }
    return String(timestamp).length === 16
  }

  static isMilliseconds(timestamp: Timestamp) {
    if (typeof timestamp !== 'number') {
      timestamp = Number(timestamp)
    }
    if (isNaN(timestamp)) {
      return false
    }
    return String(timestamp).length === 13
  }

  static isUnixSeconds(timestamp: Timestamp) {
    if (typeof timestamp !== 'number') {
      timestamp = Number(timestamp)
    }
    if (isNaN(timestamp)) {
      return false
    }

    return String(timestamp).length === 10
  }
}
