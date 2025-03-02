import { ElMessage } from 'element-plus'
import { i18n } from '@/utils/i18n'

let _window: any = window

const WebNotification = _window.Notification
  || _window.mozNotification
  || _window.webkitNotification

export const applyNotificationAuth = (fn: any) => {
  const notification = WebNotification
  if (notification) {
    notification.requestPermission((result: any) => fn('granted' === result))
  } else {
    ElMessage.error(i18n('notificationsNotSupported'))
    return fn(false)
  }
}

export const WebNotify = (title: string = '', options: any = {}) => {
  const notification = new WebNotification(title, options)
  notification.onclick = function () {
    notification.close()
  }
}
