import { EventEmitter } from 'events'

export default class Sizes extends EventEmitter {
  constructor(container) {
    super()
    this.container = container
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    this.frustum = 5
    this.update()

    if (this.container) {
      this.resizeObserver = new ResizeObserver(() => this.update())
      this.resizeObserver.observe(this.container)
    }
  }

  update() {
    if (this.container) {
      this.width = this.container.clientWidth
      this.height = this.container.clientHeight
    } else {
      this.width = window.innerWidth
      this.height = window.innerHeight
    }
    this.aspect = this.width / this.height
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    if(this.width < 968 && this.device !== 'mobile') {
      this.device = 'mobile'
      this.emit('switchdevice', this.device)
    } else if (this.width >= 968 && this.device !== 'desktop') {
      this.device = 'desktop'
      this.emit('switchdevice', this.device)
    }

    this.emit('resize')
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
    this.removeAllListeners()
  }
}
