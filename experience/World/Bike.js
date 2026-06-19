import * as THREE from 'three'
import GSAP from 'gsap'
import Experience from '../Experience.js'
import { TIRE_MODELS, TIRE_PATTERNS, TIRE_COLORS, drawTireTexture, getTireModelById } from './TireCatalog.js'

export default class Bike {
  constructor(bikeModel) {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.debug = this.experience.debug
    this.bike = bikeModel
    this.lerp = { current: 0, target: 0, ease: 0.1 }
    this.bikeChildren = {}
    this.tireMeshes = {}
    this.isDragging = false
    this.lastPointerX = 0
    this.dragSensitivity = 0.01

    if (!this.bike) {
      console.error('[Bike] model not available')
      return
    }

    this.actualBike = this.bike.scene

    if(this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('bike')
    }

    this.setBikeModel()
    this.setInteraction()
    this.setBikeGroup()
  }

  setBikeModel() {
    this.actualBike.scale.set(0.5, 0.5, 0.5)
    this.actualBike.position.set(0, 0, 0)

    // Recenter the imported model so camera framing remains reliable
    const bounds = new THREE.Box3().setFromObject(this.actualBike)
    if (!bounds.isEmpty()) {
      const center = new THREE.Vector3()
      bounds.getCenter(center)
      this.actualBike.position.sub(center)
      this.actualBike.position.y += 0.75
    }

    this.actualBike.traverse((child) => {
      if(child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true

        this.bikeMaterial = new THREE.MeshStandardMaterial({
          color: 0xd7d8d9,
          envMapIntensity: 0.1
        })
        child.material = this.bikeMaterial
      }

      if(child.name === 'BoxFace1') {
        child.material.side = THREE.BackSide
        child.material.color.set(0x111111)
      }
      if(child.name === 'BoxFace2') {
        child.material.side = THREE.BackSide
        child.material.color.set(0x111111)
      }
      if(child.name === 'BoxFace3') {
        child.material.side = THREE.BackSide
        child.material.color.set(0x111111)
      }
      if(child.name === 'BoxFace4') {
        child.material.side = THREE.BackSide
        child.material.color.set(0x111111)
      }

      if(child.name === 'BrakeF') {
        child.material.color.set(0x050505)
      }

      if(child.name === 'BrakeB') {
        child.material.color.set(0x050505)
      }

      if(child.name === 'BrakePadsF') {
        child.material.color.set(0x050505)
      }

      if(child.name === 'BrakePadsB') {
        child.material.color.set(0x050505)
      }

      if(child.name === 'BrakeCableF') {
        child.material.color.set(0x005BBB)
      }

      if(child.name === 'BrakeCableB') {
        child.material.color.set(0x005BBB)
      }

      if(child.name === 'BrakeDetailF') {
        child.material.color.set(0x005BBB)
      }

      if(child.name === 'BrakeDetailB') {
        child.material.color.set(0x005BBB)
      }

      if(child.name === 'Frame') {
        child.material.metalness = 0.9
        child.material.roughness = 0
      }

      if(child.name === 'Chain1') {
        child.material.color.set(0x050505)
        child.material.metalness = 0.9
        child.material.roughness = 0
      }

      if(child.name === 'Chain2') {
        child.material.color.set(0x050505)
        child.material.metalness = 0.9
        child.material.roughness = 0
      }

      if(child.name === 'ChainringsCover') {
        child.material.color.set(0x050505)
        child.material.metalness = 0.9
        child.material.roughness = 0
      }

      if(child.name === 'CrankArm') {
        child.material.metalness = 0.9
        child.material.roughness = 0
      }

      if(child.name === 'Cassette') {
        child.material.metalness = 0.9
        child.material.roughness = 0
      }

      if(child.name === 'PedalL') {
        child.material.color.set(0x050505)
      }

      if(child.name === 'PedalR') {
        child.material.color.set(0x050505)
      }

      if(child.name === 'PedalGripL') {
        child.material.color.set(0x050505)
      }

      if(child.name === 'PedalGripR') {
        child.material.color.set(0x050505)
      }

      if(child.name === 'CockpitStem') {
        child.material.color.set(0x050505)
        child.material.metalness = 0.5
        child.material.roughness = 0
      }

      if(child.name === 'CockpitHandlebar') {
        child.material.color.set(0x050505)
        child.material.roughness = 1
      }

      if(child.name === 'TireF') {
        this.tireMeshes.TireF = child
      }

      if(child.name === 'TireB') {
        this.tireMeshes.TireB = child
      }

      if(child.name === 'RimF') {
        child.material.metalness = 0.5
        child.material.roughness = 0
      }

      if(child.name === 'RimB') {
        child.material.metalness = 0.5
        child.material.roughness = 0
      }

      if(child.name === 'RimInnerF') {
        child.material.color.set(0xFFD700)
        child.material.roughness = 0
      }

      if(child.name === 'RimInnerB') {
        child.material.color.set(0xFFD700)
        child.material.roughness = 0
      }

      if(child.name === 'SpokesF') {
        child.material.metalness = 0.9
        child.material.roughness = 0
      }

      if(child.name === 'SpokesB') {
        child.material.metalness = 0.9
        child.material.roughness = 0
      }

      if(child.name === 'FasteningF') {
        child.material.color.set(0x050505)
        child.material.metalness = 0.5
        child.material.roughness = 0
      }

      if(child.name === 'FasteningB') {
        child.material.color.set(0x050505)
        child.material.metalness = 0.5
        child.material.roughness = 0
      }

      if(child.name === 'HubF') {
        child.material.color.set(0x050505)
        child.material.metalness = 0.5
        child.material.roughness = 0
      }

      if(child.name === 'HubB') {
        child.material.color.set(0x050505)
        child.material.metalness = 0.5
        child.material.roughness = 0
      }

      if(child.name === 'Seat') {
        child.material.color.set(0x050505)
        child.material.roughness = 1
      }

      this.bikeChildren[child.name.toLowerCase()] = child
    })

    this.applyTireModel(0)
  }

  generateTireTexture(type) {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    drawTireTexture(type, ctx, 512, 512)
    return new THREE.CanvasTexture(canvas)
  }

  applyTireModel(index) {
    if (!TIRE_MODELS[index]) return
    const model = TIRE_MODELS[index]
    this.applyTireVariant(model.id, model.color)
  }

  applyTireVariant(id, colorOverride) {
    const model = getTireModelById(id)
    this.activeTireModelId = model.id
    this.setTireTexture(model.textureType)
    this.setTireColor(colorOverride || model.color)
    this.setTireRoughness(model.roughness)
    this.setTireMetalness(model.metalness)
  }

  setTireTexture(type) {
    const texture = this.generateTireTexture(type)
    const fn = (mesh) => {
      if (!mesh) return
      mesh.material.map = texture
      mesh.material.needsUpdate = true
    }
    fn(this.tireMeshes.TireF)
    fn(this.tireMeshes.TireB)
  }

  setTireColor(color) {
    const c = new THREE.Color(color)
    const fn = (mesh) => {
      if (!mesh) return
      mesh.material.color.copy(c)
    }
    fn(this.tireMeshes.TireF)
    fn(this.tireMeshes.TireB)
  }

  setTireRoughness(val) {
    const fn = (mesh) => {
      if (!mesh) return
      mesh.material.roughness = val
    }
    fn(this.tireMeshes.TireF)
    fn(this.tireMeshes.TireB)
  }

  setTireMetalness(val) {
    const fn = (mesh) => {
      if (!mesh) return
      mesh.material.metalness = val
    }
    fn(this.tireMeshes.TireF)
    fn(this.tireMeshes.TireB)
  }

  switchTheme(theme) {
    if(theme === 'dark') {
      this.toDarkTimeline = new GSAP.timeline()

      this.actualBike.traverse((child) => {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          this.toDarkTimeline.to(child.material, {
            envMapIntensity: 0.1
          }, 'same')
        }

        if(child.name === 'BoxFace1') {
          child.material.color.set(0x111111)
        } else if (child.name === 'BoxFace2') {
          child.material.color.set(0x111111)
        } else if (child.name === 'BoxFace3') {
          child.material.color.set(0x111111)
        } else if (child.name === 'BoxFace4') {
          child.material.color.set(0x111111)
        }
      })
    } else {
      this.toLightTimeline = new GSAP.timeline()

      this.actualBike.traverse((child) => {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          this.toLightTimeline.to(child.material, {
            envMapIntensity: 1
          }, 'same')
        }

        if(child.name === 'BoxFace1') {
          child.material.color.set(0xd7d8d9)
        } else if (child.name === 'BoxFace2') {
          child.material.color.set(0xd7d8d9)
        } else if (child.name === 'BoxFace3') {
          child.material.color.set(0xd7d8d9)
        } else if (child.name === 'BoxFace4') {
          child.material.color.set(0xd7d8d9)
        }
      })
    }
  }

  setInteraction() {
    if (!this.canvas) return

    this.onPointerDown = (e) => {
      this.isDragging = true
      this.lastPointerX = e.clientX
      this.canvas.setPointerCapture?.(e.pointerId)
    }

    this.onPointerMove = (e) => {
      if (!this.isDragging) return
      const deltaX = e.clientX - this.lastPointerX
      this.lastPointerX = e.clientX
      this.lerp.target += deltaX * this.dragSensitivity
    }

    this.onPointerUp = (e) => {
      this.isDragging = false
      this.canvas.releasePointerCapture?.(e.pointerId)
    }

    this.canvas.addEventListener('pointerdown', this.onPointerDown)
    this.canvas.addEventListener('pointermove', this.onPointerMove)
    this.canvas.addEventListener('pointerup', this.onPointerUp)
    this.canvas.addEventListener('pointercancel', this.onPointerUp)
    this.canvas.addEventListener('pointerleave', this.onPointerUp)
  }

  setBikeGroup() {
    this.group = new THREE.Group()
    this.group.add(this.actualBike)
    this.group.position.set(0, 0, 0)
    this.scene.add(this.group)
  }

  resize() {}

  update() {
    if (!this.lerp || !this.group) return

    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    )

    this.group.rotation.y = this.lerp.current
  }
}
