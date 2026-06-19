import * as THREE from 'three'
import Experience from "../Experience.js"
import { EventEmitter } from 'events'
import Environment from './Environment.js'
import Bike from './Bike.js'
import Floor from './Floor.js'

export default class World extends EventEmitter {
  constructor() {
    super()
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.camera = this.experience.camera
    this.resources = this.experience.resources
    this.theme = this.experience.theme

    this.resources.on('ready', () => {
      if (this.experience !== Experience.instance) return
      this.environment = new Environment(this.resources.items.environmentMapTexture)
      this.floor = new Floor()
      this.bike = new Bike(this.resources.items.bike)
      this.emit('worldready')
    })

    this.theme.on('switch', (theme) => {
      theme = this.theme.theme
      this.switchTheme(theme)
    })
  }

  switchTheme(theme) {
    if(this.environment) {
      this.environment.switchTheme(theme)
    }
    if(this.bike) {
      this.bike.switchTheme(theme)
    }
    if(this.floor) {
      this.floor.switchTheme(theme)
    }
  }

  resize() {

  }

  update() {
    if(this.bike) {
      this.bike.update()
    }

    if(this.controls) {
      this.controls.update()
    }
  }
}
