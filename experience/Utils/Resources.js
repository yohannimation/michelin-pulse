import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { EventEmitter } from 'events'
import Experience from "../Experience.js"

export default class Resources extends EventEmitter {
  constructor(assets) {
    super()
    this.experience = new Experience()
    this.renderer = this.experience.renderer

    this.assets = assets

    this.items = {}
    this.queue = this.assets.length
    this.loaded = 0
    this.readyEmitted = false

    this.setLoaders()
    this.startLoading()
  }

  setLoaders() {
    this.loaders = {}
    this.loaders.gltfLoader = new GLTFLoader()
    this.loaders.dracoLoader = new DRACOLoader()
    this.loaders.dracoLoader.setDecoderPath("/draco/")
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
  }

  startLoading() {
    if (this.queue === 0) {
      this.emitReady()
      return
    }

    for(const asset of this.assets) {
      if (asset.type === 'glbModel') {
        this.loaders.gltfLoader.load(asset.path, (file) => {
          this.singleAssetLoaded(asset, file)
        }, undefined, (err) => {
          console.error(`[Resources] Failed to load ${asset.path}:`, err)
          this.singleAssetLoaded(asset, null)
        })
      } else if (asset.type === 'cubeTexture') {
        this.loaders.cubeTextureLoader.load(
          asset.path,
          (file) => {
            this.singleAssetLoaded(asset, file)
          },
          undefined,
          (err) => {
            console.error(`[Resources] Failed to load ${asset.path}:`, err)
            this.singleAssetLoaded(asset, null)
          },
        )
      } else {
        console.warn(`[Resources] Unsupported asset type for ${asset.name}: ${asset.type}`)
        this.singleAssetLoaded(asset, null)
      }
    }
  }

  singleAssetLoaded(asset, file) {
    this.items[asset.name] = file
    this.loaded++

    this.emitReady()
  }

  emitReady() {
    if (!this.readyEmitted && this.loaded >= this.queue) {
      this.readyEmitted = true
      this.emit('ready')
    }
  }
}
