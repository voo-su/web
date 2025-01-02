// Copyright (c) 2025 Magomedcoder <info@magomedcoder.ru>
// Distributed under the GPL v3 License, see https://github.com/voo-su/web/blob/main/LICENSE

class Publisher {
  private channels: any = {}

  subscribe(channel: string, callback: Function) {
    if (!this.channels[channel]) {
      this.channels[channel] = []
    }

    this.channels[channel].push(callback)
  }

  publish(channel: string, data: any) {
    if (!this.channels[channel]) {
      return
    }

    this.channels[channel].forEach((callback: any) => {
      callback(data)
    })
  }

  unsubscribe(channel: string, callback: Function) {
    if (!this.channels[channel]) {
      this.channels[channel] = []
    }

    for (const index in this.channels[channel]) {
      if (this.channels[channel][index] === callback) {
        this.channels[channel].splice(index, 1)
      }
    }
  }
}

export const publisher = new Publisher()
