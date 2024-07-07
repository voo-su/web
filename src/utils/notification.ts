import { ElMessage } from 'element-plus'

let _window: any = window
console.log(_window)
const WebNotification = _window.Notification
  || _window.mozNotification
  || _window.webkitNotification

export const applyNotificationAuth = (fn: any) => {
  const notification = WebNotification
  if (notification) {
    notification.requestPermission((result: any) => {
      return fn('granted' === result)
    })
  } else {
    ElMessage.error('Уведомления не поддерживаются в вашем браузере.')
    return fn(false)
  }
}

export const WebNotify = (title = '', options = {}) => {
  const notification = new WebNotification(title, options)
  notification.onclick = function() {
    notification.close()
  }
}
