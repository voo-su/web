// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { ElMessage } from 'element-plus'
import { i18n } from '@/utils/i18n'

const t = i18n()

let _window: any = window

const WebNotification = _window.Notification
  || _window.mozNotification
  || _window.webkitNotification

export const applyNotificationAuth = (fn: any) => {
  const notification = WebNotification
  if (notification) {
    notification.requestPermission((result: any) => fn('granted' === result))
  } else {
    ElMessage.error(t('notificationsNotSupported'))
    return fn(false)
  }
}

export const WebNotify = (title: string = '', options: any = {}) => {
  const notification = new WebNotification(title, options)
  notification.onclick = function () {
    notification.close()
  }
}
