// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

const getVersionNumber = (userAgent: string, regex: RegExp) => {
  const matches = userAgent.match(regex)
  return matches && matches.length > 1 ? matches[1] : ''
}

export const getOSType = (userAgent: string = ''): string => {
  const lowerUserAgent = userAgent.toLowerCase()
  if (/windows/.test(lowerUserAgent)) {
    return `Windows ${getVersionNumber(lowerUserAgent, /windows\snt\s(\d+(\.\d+)*)/)}`
  } else if (/iphone|ipad|ipod/.test(lowerUserAgent)) {
    return `iOS ${getVersionNumber(lowerUserAgent, /os\s(\d+([_\s]\d+)?([_\s]\d+)?)/).replace(/[_\s]/g, '.')}`
  } else if (/android/.test(lowerUserAgent)) {
    return `Android ${getVersionNumber(lowerUserAgent, /android\s(\d+(\.\d+)*)/)}`
  } else if (/mac/.test(lowerUserAgent)) {
    return `Mac OS ${getVersionNumber(lowerUserAgent, /mac\sos\sx\s(\d+([_\s]\d+)?([_\s]\d+)?)/).replace(/[_\s]/g, '.')}`
  } else if (/linux/.test(lowerUserAgent)) {
    return 'Linux'
  } else if (/cros/.test(lowerUserAgent)) {
    return 'Chrome OS'
  } else {
    return 'Неизвестная'
  }
}

export const getBrowserType = (userAgent: string = ''): string => {
  const lowerUserAgent = userAgent.toLowerCase()
  if (lowerUserAgent.includes('opr') || lowerUserAgent.includes('opera')) {
    return `Opera ${getVersionNumber(lowerUserAgent, /(opr|opera)[\s\/](\d+(\.\d+)*)/)}`
  } else if (lowerUserAgent.includes('msie') || lowerUserAgent.includes('trident')) {
    return `IE ${getVersionNumber(lowerUserAgent, /(msie\s|trident\/7)([\d\.]+)/)}`
  } else if (lowerUserAgent.includes('edge')) {
    return `Edge ${getVersionNumber(lowerUserAgent, /edge\/(\d+(\.\d+)*)/)}`
  } else if (lowerUserAgent.includes('firefox')) {
    return `Firefox ${getVersionNumber(lowerUserAgent, /firefox\/(\d+(\.\d+)*)/)}`
  } else if (lowerUserAgent.includes('safari') && !lowerUserAgent.includes('chrome')) {
    return `Safari ${getVersionNumber(lowerUserAgent, /version\/(\d+(\.\d+)*)/)}`
  } else if (lowerUserAgent.includes('chrome')) {
    return `Chrome ${getVersionNumber(lowerUserAgent, /chrome\/(\d+(\.\d+)*)/)}`
  } else {
    return 'Неизвестная'
  }
}

export const getName = (data: { username: string; name?: string; surname?: string }): string => {
  const { name, surname, username } = data
  if (name && name.length >= 1) {
    return surname && surname.length >= 1 ? `${name} ${surname}` : name
  }

  return username || 'Неизвестная'
}
