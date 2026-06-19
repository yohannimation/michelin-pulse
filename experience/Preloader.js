import * as THREE from 'three'
import GSAP from 'gsap'
import { EventEmitter } from 'events'
import convert from './Utils/convertDivsToSpans'
import Experience from "./Experience"

export default class Preloader extends EventEmitter {
  constructor() {
    super()
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.sizes = this.experience.sizes
    this.camera = this.experience.camera
    this.world = this.experience.world
    this.device = this.sizes.device

    this.sizes.on('switchdevice', (device) => {
      this.device = device
    })

    this.world.on('worldready', () => {
      this.setAssets()
      this.playIntro()
    })
  }

  setAssets() {
    const introSelectors = [
      '.intro-text',
      '.hero-main-title',
      '.hero-main-description',
      '.hero-second-subheading',
      '.second-sub',
    ]

    const legacyIntro = introSelectors.every((selector) => document.querySelector(selector))

    if (legacyIntro) {
      introSelectors.forEach((selector) => {
        convert(document.querySelector(selector))
      })
    }

    this.legacyIntro = legacyIntro
    this.group = this.experience.world.bike?.group
    this.actualBike = this.experience.world.bike?.actualBike
    this.bikeChildren = this.experience.world.bike?.bikeChildren
  }

  firstIntro() {
    return new Promise((resolve) => {
      if (!this.legacyIntro) {
        resolve()
        return
      }

      this.timeline = new GSAP.timeline()
      this.timeline.set('.animatethis', { y: 0, yPercent: 100 })
      this.timeline.to('.preloader', {
        opacity: 0,
        delay: 1,
        onComplete: () => {
          document.querySelector('.preloader').classList.add('hidden')
        }
      })

      if (this.device === 'desktop' && this.actualBike) {
        this.timeline.to(this.actualBike.scale, {
          x: 0.5,
          y: 0.5,
          z: 0.5,
          ease: 'back.out(1.5)',
          duration: 0.7
        })
      } else if (this.actualBike) {
        this.timeline.to(this.actualBike.scale, {
          x: 0.175,
          y: 0.175,
          z: 0.175,
          ease: 'back.out(2.5)',
          duration: 0.7
        }, 'same')
        .to(this.camera.perspectiveCamera.position, {
          y: 0.1
        }, 'same')
      }

      this.timeline.to('.intro-text .animatethis', {
        yPercent: 0,
        stagger: 0.04,
        ease: 'back.out(1.5)',
        onComplete: resolve
      })
      .to('.arrow-svg-wrapper', {
        opacity: 1
      }, 'fadein')
      .to('.navbar', {
        opacity: 1,
        onComplete: resolve
      }, 'fadein')
    })
  }

  secondIntro() {
    return new Promise((resolve) => {
      if (!this.legacyIntro) {
        resolve()
        return
      }

      this.secondTimeline = new GSAP.timeline()
      const introTimeline = this.secondTimeline

      introTimeline.to('.intro-text .animatethis', {
        yPercent: 100,
        stagger: 0.04,
        ease: 'back.in(1.5)'
      }, 'fadeout')
      .to('.arrow-svg-wrapper', {
        opacity: 0
      }, 'fadeout')

      if (this.device === 'desktop' && this.actualBike) {
        introTimeline.to(this.actualBike.scale, {
          x: 0.65,
          y: 0.65,
          z: 0.65,
          stagger: 2,
          ease: 'power1.out'
        }, 'introtext')
      } else if (this.actualBike) {
        introTimeline.to(this.actualBike.scale, {
          x: 0.50,
          y: 0.50,
          z: 0.50,
          stagger: 1,
          ease: 'power1.out'
        }, 'introtext')
        .to(this.actualBike.rotation, {
          y: -Math.PI * 0.5
        }, 'introtext')
        .to(this.camera.perspectiveCamera.position, {
          y: 0.4
        }, 'introtext')
      }

      if (this.bikeChildren) {
        introTimeline.to(this.bikeChildren.boxface1.rotation, {
          x: 0,
          y: 0,
          z: -Math.PI,
          duration: 2
        }, 'introtext')
        .to(this.bikeChildren.boxface2.rotation, {
          x: -Math.PI,
          y: 0,
          z: 0,
          duration: 2
        }, 'introtext')
        .to(this.bikeChildren.boxface3.rotation, {
          x: Math.PI,
          y: 0,
          z: 0,
          duration: 2
        }, 'introtext')
        .to(this.bikeChildren.boxface4.rotation, {
          x: 0,
          y: 0,
          z: Math.PI,
          duration: 2
        }, 'introtext')
      }
      introTimeline.to('.hero-main-title .animatethis', {
        yPercent: 0,
        stagger: 0.02,
        ease: 'back.out(1.5)'
      }, 'introtext')
      .to('.hero-main-description .animatethis', {
        yPercent: 0,
        stagger: 0.02,
        ease: 'back.out(1.5)'
      }, 'introtext')
      .to('.first-sub .animatethis', {
        yPercent: 0,
        stagger: 0.02,
        ease: 'back.out(1.5)'
      }, 'introtext')
      .to('.second-sub .animatethis', {
        yPercent: 0,
        stagger: 0.02,
        ease: 'back.out(1.5)'
      }, 'introtext')
      .to('.arrow-svg-wrapper', {
        opacity: 1,
        onComplete: resolve
      })
    })
  }

  onScroll(e) {
    if(e.deltaY > 0) {
      this.removeEventListeners()
      this.playSecondIntro()
    }
  }

  onTouch(e) {
    this.initialY = e.touches[0].clientY
  }

  onTouchMove(e) {
    let currentY = e.touches[0].clientY
    let difference = this.initialY - currentY
    if(difference > 0) {
      console.log('swipped up')
      this.removeEventListeners()
      this.playSecondIntro()
    }
    this.initialY = null
  }

  removeEventListeners() {
    window.removeEventListener('wheel', this.scrollOnceEvent)
    window.removeEventListener('touchstart', this.touchStart)
    window.removeEventListener('touchmove', this.touchMove)
  }

  async playIntro() {
    await this.firstIntro()
    this.moveFlag = true

    if (!this.legacyIntro) {
      const preloader = document.querySelector('.preloader')
      if (preloader) {
        preloader.classList.add('hidden')
      }

      // The redesigned page skips the scroll-based second intro,
      // so open the bike transport box immediately.
      if (this.bikeChildren) {
        if (this.bikeChildren.boxface1) this.bikeChildren.boxface1.rotation.set(0, 0, -Math.PI)
        if (this.bikeChildren.boxface2) this.bikeChildren.boxface2.rotation.set(-Math.PI, 0, 0)
        if (this.bikeChildren.boxface3) this.bikeChildren.boxface3.rotation.set(Math.PI, 0, 0)
        if (this.bikeChildren.boxface4) this.bikeChildren.boxface4.rotation.set(0, 0, Math.PI)
      }

      this.emit('enableControls')
      return
    }

    this.scrollOnceEvent = this.onScroll.bind(this)
    this.touchStart = this.onTouch.bind(this)
    this.touchMove = this.onTouchMove.bind(this)

    window.addEventListener('wheel', this.scrollOnceEvent)
    window.addEventListener('touchstart', this.touchStart)
    window.addEventListener('touchmove', this.touchMove)
  }

  async playSecondIntro() {
    this.moveFlag = false
    this.scaleFlag = true

    await this.secondIntro()
    this.scaleFlag = false
    this.emit('enableControls')
  }

  move() {
    if(this.group && this.device === 'desktop') {
      this.group.position.set(0, 0, 0)
    } else if (this.group) {
      this.group.position.set(0, 0, 0)
    }
  }

  scale() {
    if(this.group && this.device === 'desktop') {
      this.group.scale.set(1, 1, 1)
    } else if (this.group) {
      this.group.scale.set(1, 1, 1)
    }
  }

  update() {
    if(this.moveFlag) {
      this.move()
    }
    if(this.scaleFlag) {
      this.scale()
    }
  }
}
