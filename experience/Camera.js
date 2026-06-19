import * as THREE from 'three'
import Experience from './Experience.js'

export default class Camera {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.debug = this.experience.debug

    if(this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('camera')
    }

    this.createPerspectiveCamera()
    this.createOrthographicCamera()
  }

  createPerspectiveCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      35,
      this.sizes.aspect,
      0.1,
      1000
    )
    this.scene.add(this.perspectiveCamera)

    this.perspectiveCamera.position.y = 0.5
    this.perspectiveCamera.position.z = 4
    this.perspectiveCamera.lookAt(0, 0.65, 0);

    if(this.debug.active) {
      this.debugFolder
        .add(this.perspectiveCamera.position, 'x')
        .name('camPosX')
        .min(-30)
        .max(30)
        .step(0.001)

      this.debugFolder
        .add(this.perspectiveCamera.position, 'y')
        .name('camPosY')
        .min(-30)
        .max(30)
        .step(0.001)

      this.debugFolder
        .add(this.perspectiveCamera.position, 'z')
        .name('camPosZ')
        .min(-30)
        .max(30)
        .step(0.001)
    }
  }

  createOrthographicCamera() {
    this.orthographicCamera = new THREE.OrthographicCamera(
      (-this.sizes.aspect * this.sizes.frustum) / 2,
      (this.sizes.aspect * this.sizes.frustum) / 2,
      this.sizes.frustum  / 2,
      -this.sizes.frustum  / 2,
      -10,
      10
    )

    this.orthographicCamera.position.y = 1.25
    this.orthographicCamera.rotation.x = -Math.PI / 24

    this.scene.add(this.orthographicCamera)
  }

  resize() {
    this.perspectiveCamera.aspect = this.sizes.aspect
    this.perspectiveCamera.updateProjectionMatrix()

    this.orthographicCamera.left = (-this.sizes.aspect * this.sizes.frustum) / 2
    this.orthographicCamera.right = (this.sizes.aspect * this.sizes.frustum) / 2
    this.orthographicCamera.top = this.sizes.frustum / 2
    this.orthographicCamera.bottom = -this.sizes.frustum / 2
    this.orthographicCamera.updateProjectionMatrix()
  }

  update() {}
}
