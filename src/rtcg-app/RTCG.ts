import type * as THREE from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import createRenderer from "./systems/renderer";
import Resizer from "./systems/Resizer";
import Animator from "./systems/Animator";
import createOrbitControls from "./systems/controls";

import createScene from "./components/scene";
import createCamera from "./components/camera";
import { createAmbientLight, createPointLight } from "./components/light";
import createBox from "./components/box";
// import createPlane from "./components/plane";
import createSphere from "./components/sphere";
// import Terrain from "./components/Terrain";
import Planet from "./components/Planet";

class RTCG {
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private animator: Animator;
  private controls?: OrbitControls;

  constructor(container: HTMLElement) {
    this.camera = createCamera();
    this.renderer = createRenderer();
    this.scene = createScene();
    this.controls = createOrbitControls(this.camera, this.renderer.domElement);
    this.animator = new Animator(this.renderer, this.scene, this.camera, this.controls);

    const ambientLight: THREE.AmbientLight = createAmbientLight();
    const pointLight: THREE.PointLight = createPointLight();
    this.scene.add(ambientLight);
    this.scene.add(pointLight);

    // const floor: THREE.Mesh = createPlane(10, 10);
    // const floor: THREE.Mesh = new Terrain({
    //   width: 10,
    //   height: 10,
    //   widthSegments: 128,
    //   heightSegments: 128,
    //   octaves: 8,
    //   totalHeight: 10,
    //   scale: 5,
    //   exponent: 4,
    //   persistence: 0.5,
    //   lacunarity: 1.8,
    // });
    const floor: Planet = new Planet();
    this.scene.add(floor);

    const box: THREE.Mesh = createBox(2, 2, 2);
    this.scene.add(box);

    const box2: THREE.Mesh = createBox(1, 0.2, 0.5);
    box2.translateX(2);
    this.scene.add(box2);

    const sphere: THREE.Mesh = createSphere(1, 10, 10);
    sphere.translateX(-3);
    sphere.translateZ(3);
    this.scene.add(sphere);

    const resizer: Resizer = new Resizer(container, this.camera, this.renderer);
    resizer.activate();

    this.animator.addAnimObject({
      object: sphere,
      tick: function (delta: number, time: number): void {
        const angle: number = time * 1;
        const radius: number = 4;

        this.object.position.x = Math.cos(angle) * radius;
        this.object.position.z = Math.sin(angle) * radius;

        this.object.rotation.y += 5 * delta;
      },
    });

    container.append(this.renderer.domElement);
  }

  renderFrame(): void {
    this.renderer.render(this.scene, this.camera);
  }

  startLoop(): void {
    this.animator.start();
  }

  stopLoop(): void {
    this.animator.stop();
  }
}

export default RTCG;
