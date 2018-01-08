/* eslint-env worker, serviceworker */

if (Notification.permission !== 'granted') {
  Notification.requestPermission()
    .then(permission => {
      if (permission === 'denied') return
      if (permission === 'default') return
    })
}

// 推送监听
self.addEventListener('push', event => {
  console.log('[service worker] Pushed', event.data.text())

  let title, options

  (() => {
    try {
      const json = JSON.parse(event.data.text())
      title = json.title
      options = {
        body: json.body,
        data: {
          url: json.data.url
        },
        icon: 'static/logo.jpg'
      }
    } catch (e) {
      title = event.data.text()
    }
  })()

  event.waitUntil(self.registration.showNotification(title, options))
})

// 通知窗口点击
self.addEventListener('notificationclick', event => {
  console.log('[service worker] Notification clicked')
  const notification = event.notification
  event.waitUntil(clients.openWindow(notification.data.url))
})
