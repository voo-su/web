// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

import { pushInitApi } from '@/api/account'

export const pushInit = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    navigator.serviceWorker.ready
      .then((registration: ServiceWorkerRegistration) => registration.pushManager.getSubscription())
      .then((subscription: PushSubscription) => pushSubscriptionNotify(subscription))
  }
}

const pushSubscriptionNotify = (subscription: PushSubscription) => {
  if (subscription) {
    const subscriptionObj: PushSubscriptionJSON = subscription.toJSON()
    if (
      !subscriptionObj ||
      !subscriptionObj.endpoint ||
      !subscriptionObj.keys ||
      !subscriptionObj.keys.p256dh ||
      !subscriptionObj.keys.auth
    ) {
      console.log('Недействительная push-подписка: ', subscriptionObj)
      return
    }
    pushInitApi({
      subscription: JSON.stringify(subscriptionObj)
    }).then((res: any) => {
      console.log(res)
    })
  } else {
    subscribe()
  }
}

const subscribe = () => {
  navigator.serviceWorker.ready
    .then((registration) => registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
    }))
    .then((subscription) => {
      console.log(JSON.stringify(subscription))
    })
    .catch(err => console.error(err))
}

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}
