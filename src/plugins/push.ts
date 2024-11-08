import type { App } from 'vue'
import { subscribe } from '@/utils/push'

export const setPush = (app: App) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    navigator.serviceWorker.ready
      .then((registration) => {
        return registration.pushManager.getSubscription()
      })
      .then((subscription) => {
        if (!subscription) {
          subscribe()
        } else {
          console.log(JSON.stringify(subscription))
        }
      })
  }
}
