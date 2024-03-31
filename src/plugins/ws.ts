const cache = new Set()

class Ws {

  connect = null

  config = {
    heartbeat: {
      setInterval: null,
      pingInterval: 20000,
      pingTimeout: 60000
    },
    reconnect: {
      lockReconnect: false,
      setTimeout: null,
      time: 3000,
      number: 10000000
    }
  }

  lastTime = 0

  onCallBacks = []

  defaultEvent = {
    onError: () => {
    },
    onOpen: () => {
    },
    onClose: () => {
    }
  }

  constructor(urlCallBack, events) {
    this.urlCallBack = urlCallBack
    this.events = Object.assign({}, this.defaultEvent, events)
    this.on('connect', data => {
      this.config.heartbeat.pingInterval = data.ping_interval * 1000
      this.config.heartbeat.pingTimeout = data.ping_timeout * 1000
      this.heartbeat()
      this.connect.send('{"event":"ping"}')
    })
  }

  on(event, callBack) {
    this.onCallBacks[event] = callBack
    return this
  }

  loadSocket() {
    const url = this.urlCallBack()
    const connect = new WebSocket(url)
    connect.onerror = this.onError.bind(this)
    connect.onopen = this.onOpen.bind(this)
    connect.onmessage = this.onMessage.bind(this)
    connect.onclose = this.onClose.bind(this)
    this.connect = connect
  }

  connection() {
    this.connect == null && this.loadSocket()
  }

  reconnect() {
    clearTimeout(this.config.reconnect.setTimeout)
    this.config.reconnect.setTimeout = setTimeout(() => {
      this.connection()
      console.log('Соединение с сетью разорвано, попытка повторного подключения...')
    }, this.config.reconnect.time)
  }

  onParse(evt) {
    const {
      sid,
      event,
      content
    } = JSON.parse(evt.data)
    return {
      sid: sid,
      event: event,
      data: content,
      orginData: evt.data
    }
  }

  onOpen(evt) {
    this.lastTime = new Date().getTime()
    this.events.onOpen(evt)
    this.ping()
  }

  onClose(evt) {
    this.events.onClose(evt)
    this.connect && this.connect.close()
    this.connect = null
    evt.code == 1006 && this.reconnect()
  }

  onError(evt) {
    this.events.onError(evt)
    this.connect.close()
    this.connect = null
    this.reconnect()
  }

  onMessage(evt) {
    this.lastTime = new Date().getTime()
    const result = this.onParse(evt)
    if (result.sid) {
      if (cache.has(result.sid)) return
      cache.add(result.sid)
      this.connect.send(`{"event":"ack","sid":"${result.sid}"}`)
    }
    if (Object.prototype.hasOwnProperty.call(this.onCallBacks, result.event)) {
      this.onCallBacks[result.event](result.data, result.orginData)
    } else {
      console.warn(`Событие сообщения WebSocket ${result.event} не привязано...`)
    }
  }

  heartbeat() {
    this.config.heartbeat.setInterval = setInterval(() => {
      const t = new Date().getTime()
      if (t - this.lastTime > this.config.heartbeat.pingTimeout) {
        if (this.connect) {
          this.connect.close()
        }
        this.reconnect()
      } else {
        this.ping()
      }
    }, this.config.heartbeat.pingInterval)
  }

  ping() {
    this.connect.send('{"event":"ping"}')
  }

  send(mesage) {
    if (typeof mesage == 'string') {
      this.connect.send(mesage)
    } else {
      this.connect.send(JSON.stringify(mesage))
    }
  }

  close() {
    this.connect.close()
  }

  emit(event, data) {
    const content = JSON.stringify({
      event,
      content: data
    })
    if (this.connect && this.connect.readyState === 1) {
      this.connect.send(content)
    } else {
      console.error('Соединение веб-сокет закрыто', this.connect)
    }
  }
}

export default Ws
