import * as THREE from 'three'
import GSAP from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'
import ASScroll from '@ashthornton/asscroll'
import Experience from './Experience.js'

export default class Controls {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.sizes = this.experience.sizes
    this.time = this.experience.time
    this.camera = this.experience.camera
    this.actualBike = this.experience.world.bike?.actualBike
    this.bikeChildren = this.experience.world.bike?.bikeChildren
    this.zoom = {
      zoomValue: this.camera.perspectiveCamera.zoom
    }

    GSAP.registerPlugin(ScrollTrigger)

    const pageEl = document.querySelector('.page')
    if (pageEl) {
      pageEl.style.overflow = 'visible'
    }

    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      console.log('desktop')
      this.setSmoothScroll()
    }
    this.setScrollTrigger()
  }

  setupASScroll() {
    const container = document.querySelector('[asscroll]')
    if (!container) {
      console.warn('[Controls] ASScroll container ([asscroll]) not found — skipping smooth scroll')
      return null
    }
    const asscroll = new ASScroll({
      disableRaf: true
    })

    GSAP.ticker.add(asscroll.update)

    ScrollTrigger.defaults({
      scroller: asscroll.containerElement })

    ScrollTrigger.scrollerProxy(asscroll.containerElement, {
      scrollTop(value) {
        if (arguments.length) {
          asscroll.currentPos = value
          return
        }
        return asscroll.currentPos
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      fixedMarkers: true })

    asscroll.on('update', ScrollTrigger.update)
    ScrollTrigger.addEventListener('refresh', asscroll.resize)

    requestAnimationFrame(() => {
      asscroll.enable({
        newScrollElements: document.querySelectorAll('.gsap-marker-start, .gsap-marker-end, [asscroll]')
      })
    })
    return asscroll;
  }

  setSmoothScroll() {
    try {
      this.asscroll = this.setupASScroll()
    } catch (e) {
      console.warn('[Controls] Smooth scroll setup failed:', e.message)
    }
  }

  reset() {
    this.actualBike.scale.set(0.65, 0.65, 0.65)
    this.actualBike.position.set(0, 0, 0)
    this.actualBike.rotation.y = 0
    this.camera.perspectiveCamera.position.x = 0
    this.camera.perspectiveCamera.position.y = 0.5
    this.camera.perspectiveCamera.position.z = 4
    this.camera.perspectiveCamera.zoom = 1
    this.zoom.zoomValue = 1
  }

  resetMobile() {
    this.actualBike.scale.set(0.5, 0.5, 0.5)
    this.actualBike.rotation.set(0, -Math.PI/2 , 0)
    this.actualBike.position.set(0, 0, 0)
    this.camera.perspectiveCamera.position.x = 0
    this.camera.perspectiveCamera.position.y = 0.4
    this.camera.perspectiveCamera.position.z = 4
    this.camera.perspectiveCamera.zoom = 1
    this.zoom.zoomValue = 1
  }

  setScrollTrigger() {
    if (!document.querySelector('.first-move')) {
      console.warn('[Controls] Scroll sections not found in DOM — skipping ScrollTrigger setup')
      return
    }

    ScrollTrigger.matchMedia({
      '(min-width: 969px)': () => {

        this.reset()

        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.first-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        })
        .fromTo(this.actualBike.rotation, {
          y: 0
        },
        {
          y: Math.PI
        }, 'same')
        .fromTo(this.camera.perspectiveCamera.position, {
          x: 0,
          y: 0.5,
          z: 4
        },
        {
          x: () => {
            if(this.sizes.width > 1300 && this.sizes.height < 1000) {
              return -5.2
            } else {
              return -5
            }
          },
          y: 6,
        }, 'same')
        .fromTo(this.camera.perspectiveCamera.rotation, {
          x: 0.0374824366916615,
          y: 0,
          z: -0
        },
        {
          x: -0.81,
          y: -0.5324252706006514,
          z: -0.45011986145587835
        }, 'same')
        .to(this.zoom, {
          zoomValue: 3,
          onUpdate: () => {
            this.camera.perspectiveCamera.zoom = this.zoom.zoomValue
            this.camera.perspectiveCamera.updateProjectionMatrix()
          }
        }, 'same')

        this.secondMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.second-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        .to(this.actualBike.rotation, {
          y: -Math.PI / 4,
        }, 'same')
        .to(this.camera.perspectiveCamera.position, {
          x: () => {
            if(this.sizes.width > 1300 && this.sizes.height < 1000) {
              return -6.7
            } else {
              return -7
            }
          },
          y: 2,
        }, 'same')
        .to(this.camera.perspectiveCamera.rotation, {
          x: -0.3340156231020234,
          y: -1.0505564481189775,
          z: -0.2924724024454449,
        }, 'same')
        .to(this.zoom, {
          zoomValue: 3,
          onUpdate: () => {
            this.camera.perspectiveCamera.zoom = this.zoom.zoomValue;
            this.camera.perspectiveCamera.updateProjectionMatrix();
          },
        }, 'same')

        this.thirdMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          },
        })
        .to(this.actualBike.rotation, {
          y: -Math.PI,
        }, 'same')
        .to(this.camera.perspectiveCamera.position, {
          x: () => {
            if(this.sizes.width > 1300  && this.sizes.height < 1000) {
              return -4.25
            } else {
              return -4.1
            }
          },
          y: 3
        }, 'same')
        .to(this.camera.perspectiveCamera.rotation, {
          x: -0.33669463959268153,
          y: -0.700986700755924,
          z: -0.22203253193071731,
        }, 'same')
        .to(this.zoom, {
          zoomValue: 2.5,
          onUpdate: () => {
            this.camera.perspectiveCamera.zoom = this.zoom.zoomValue
            this.camera.perspectiveCamera.updateProjectionMatrix()
          },
        }, 'same')

        this.fourthMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
              trigger: '.fourth-move',
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.6,
              invalidateOnRefresh: true
          }
        })
        .to(this.actualBike.rotation, {
          y: -Math.PI / 2,
        }, 'same')
        .to(this.camera.perspectiveCamera.position, {
          x: () => {
            if(this.sizes.width > 1300  && this.sizes.height < 1000) {
              return 2.2
            } else {
              return 2
            }
          },
          y: 1,
          z: 4,
        }, 'same')
        .to(this.camera.perspectiveCamera.rotation, {
          x: -0.02845135092188762,
          y: 0.29416856071633857,
          z: 0.008251344278639
        }, 'same')
        .to(this.zoom, {
          zoomValue: 1,
          onUpdate: () => {
            this.camera.perspectiveCamera.zoom = this.zoom.zoomValue
            this.camera.perspectiveCamera.updateProjectionMatrix()
          },
        }, 'same')
      },

      '(max-width: 968px)': () => {

        this.resetMobile()

        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.first-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        })
        .fromTo(this.actualBike.rotation, {
          y: -Math.PI / 2
        },
        {
            y: Math.PI / 1,
        }, 'same')
        .fromTo(this.camera.perspectiveCamera.position, {
          x: 0,
          y: 0.4,
          z: 4,
        },
        {
          x: -4.82,
          y: 3,
          z: 4,
        }, 'same')
        .fromTo(this.camera.perspectiveCamera.rotation, {
          x: 0.0374824366916615,
          y: 0,
          z: -0
        },
        {
          x: -0.4826867099146418,
          y: -0.7487373908008822,
          z: -0.3426445418872183
        }, 'same')
        .to(this.zoom, {
          zoomValue: 2.3,
          onUpdate: () => {
            this.camera.perspectiveCamera.zoom = this.zoom.zoomValue
            this.camera.perspectiveCamera.updateProjectionMatrix()
          }
        }, 'same')

        this.secondMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.second-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        })
        .to(this.actualBike.rotation, {
          y: -Math.PI / 4,
        }, 'same')
        .to(this.camera.perspectiveCamera.position, {
          x: -7,
          y: 2
        }, 'same')
        .to(this.camera.perspectiveCamera.rotation, {
          x: -0.36830437274233147,
          y: -0.975248930241726,
          z: -0.30922701986576173,
        }, 'same')
        .to(this.zoom, {
          zoomValue: 2.5,
          onUpdate: () => {
            this.camera.perspectiveCamera.zoom = this.zoom.zoomValue
            this.camera.perspectiveCamera.updateProjectionMatrix()
          }
        }, 'same')

        this.thirdMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        })
        .to(this.actualBike.rotation, {
          y: -Math.PI,
        }, 'same')
        .to(this.camera.perspectiveCamera.position, {
          x: -4.15,
          y: 1.7,
        }, 'same')
        .to(this.camera.perspectiveCamera.rotation, {
          x: -0.15,
          y: -0.82433683382151,
          z: -0.17595910659449646,
        }, 'same')
        .to(this.zoom, {
          zoomValue: 3.5,
          onUpdate: () => {
            this.camera.perspectiveCamera.zoom = this.zoom.zoomValue
            this.camera.perspectiveCamera.updateProjectionMatrix()
          }
        }, 'same')

        this.fourthMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.fourth-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        })
        .to(this.actualBike.rotation, {
          y: -Math.PI / 1.5,
        }, 'same')
        .to(this.camera.perspectiveCamera.position, {
          x: -4.1,
          y: 0.5,
        }, 'same')
        .to(this.zoom, {
          zoomValue: 1.5,
          onUpdate: () => {
              this.camera.perspectiveCamera.zoom = this.zoom.zoomValue
              this.camera.perspectiveCamera.updateProjectionMatrix()
          }
        }, 'same')
        .to(this.camera.perspectiveCamera.rotation, {
          x: -0.0212333950806064,
          y: -0.81785674319681,
          z: -0.015494714435393457,
        }, 'same')
      },

      'all': () => {
        this.sections = document.querySelectorAll('.section')
        this.sections.forEach(section => {
          this.progressWrapper = section.querySelector('.progress-wrapper')
          this.progressBar = section.querySelector('.progress-bar')

          if(section.classList.contains('right')) {
            GSAP.to(section, {
              borderTopLeftRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top top',
                scrub: 0.6
              }
            })
            GSAP.to(section, {
              borderBottomLeftRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: 'bottom bottom',
                end: 'bottom top',
                scrub: 0.6
              }
            })
          } else {
            GSAP.to(section, {
              borderTopRightRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top top',
                scrub: 0.6
              }
            })
            GSAP.to(section, {
              borderBottomRightRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: 'bottom bottom',
                end: 'bottom top',
                scrub: 0.6
              }
            })
          }

          GSAP.from(this.progressBar, {
            scaleY: 0,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.4,
              pin: this.progressWrapper,
              pinSpacing: false
            }
          })
        })
      }

    });
  }

  resize() {}

  update() {}
}
