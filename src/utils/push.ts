export const subscribe = () => {
  navigator.serviceWorker.ready
    .then((registration) => {
      const vapidPublicKey = ''

      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })
    })
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
