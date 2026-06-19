import { EventEmitter } from 'events'

export default class Theme extends EventEmitter {
  constructor() {
    super()

    this.theme = 'dark'

    this.toggleButton = document.querySelector('.toggle-button')
    this.toggleCircle = document.querySelector('.toggle-circle')

    this.applyThemeClass()

    this.setEventListeners()
  }

  applyThemeClass() {
    document.body.classList.remove('light-theme')
    document.body.classList.add('dark-theme')
  }

  setEventListeners() {
    if (!this.toggleButton || !this.toggleCircle) {
      return
    }

    this.toggleButton.addEventListener('click', () => {
      this.toggleCircle.classList.toggle('slide')
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      document.body.classList.toggle('dark-theme')
      document.body.classList.toggle('light-theme')

      this.emit('switch', this.theme)
    })
  }
}
