const WebNotification = window.Notification
  || window.mozNotification
  || window.webkitNotification

export const applyNotificationAuth = (fn: any) => {
  const notification = WebNotification
  if (notification) {
    notification.requestPermission(result => {
      return fn('granted' === result)
    })
  } else {
    window['$message'].error('Уведомления не поддерживаются в вашем браузере.')
    return fn(false)
  }
}

export const WebNotify = (title = '', options = {}) => {
  const notification = new WebNotification(title, options)
  notification.onclick = function() {
    notification.close()
  }
}
