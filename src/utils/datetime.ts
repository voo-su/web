import { i18n } from '@/utils/i18n'

export const formatTime = (datetime: string | null): string => {
  if (datetime == null) {
    return ''
  }

  datetime = datetime.replace(/-/g, '/')
  const time = new Date()
  let outTime = new Date(datetime)

  if (/^[1-9]\d*$/.test(datetime)) {
    outTime = new Date(parseInt(datetime) * 1000)
  }

  if (
    time.getTime() < outTime.getTime() ||
    time.getFullYear() !== outTime.getFullYear()
  ) {
    return parseTime(outTime, 'h:i d.m.y')
  }

  if (time.getMonth() !== outTime.getMonth()) {
    return parseTime(outTime, 'h:i d.m')
  }

  if (time.getDate() !== outTime.getDate()) {
    const day = outTime.getDate() - time.getDate()

    if (day === -1) {
      return parseTime(outTime, i18n('yesterday'))
    }

    if (day === -2) {
      return parseTime(outTime, i18n('dayBeforeYesterday'))
    }

    return parseTime(outTime, 'h:i d.m.y')
  }

  const diff = time.getTime() - outTime.getTime()

  if (time.getHours() !== outTime.getHours() || diff > 30 * 60 * 1000) {
    return parseTime(outTime, 'h:i')
  }

  let minutes = outTime.getMinutes() - time.getMinutes()

  if (minutes === 0) {
    return i18n('justNow')
  }

  minutes = Math.abs(minutes)
  return i18n('minutesAgo', { minute: minutes })
}

export const parseTime = (time: any, cFormat?: string): string => {
  if (time.length === 0) {
    return ''
  }

  let date: Date

  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }

    date = new Date(time.replace(/-/g, '/'))
  }

  const formatObj: Record<string, number> = {
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate()
  }

  return (cFormat || 'y-m-d h:i:s').replace(
    /([hisadmy])+/g,
    (result, key) => {
      const value = formatObj[key]

      if (key === 'a') {
        return [i18n('sunday'), i18n('monday'), i18n('tuesday'), i18n('wednesday'), i18n('thursday'), i18n('friday'), i18n('saturday')][value]
      }

      return value.toString().padStart(2, '0')
    }
  )
}

export const beautifyTime = (datetime: string | null): string => {
  if (datetime == null) {
    return ''
  }

  datetime = datetime.replace(/-/g, '/')
  const time = new Date()
  const outTime = new Date(datetime)

  if (/^[1-9]\d*$/.test(datetime)) {
    outTime.setTime(parseInt(datetime) * 1000)
  }

  if (time.getTime() < outTime.getTime()) {
    return parseTime(outTime, '')
  }

  if (time.getFullYear() !== outTime.getFullYear()) {
    return parseTime(outTime, 'd.m.y')
  }

  if (time.getMonth() !== outTime.getMonth()) {
    return parseTime(outTime, 'd.m')
  }

  if (time.getDate() !== outTime.getDate()) {
    const day = outTime.getDate() - time.getDate()

    if (day === -1) {
      return parseTime(outTime, i18n('yesterday'))
    }

    if (day === -2) {
      return parseTime(outTime, i18n('dayBeforeYesterday'))
    }

    return parseTime(outTime, 'd.m')
  }

  if (time.getHours() !== outTime.getHours()) {
    return parseTime(outTime, 'h:i')
  }

  const minutes = Math.abs(outTime.getMinutes() - time.getMinutes())

  if (minutes === 0) {
    return i18n('justNow')
  }

  return i18n('minutesAgo', { minute: minutes })
}
