import type * as THREE from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// import { ARButton } from "three/examples/jsm/webxr/ARButton";

import createRenderer from "./systems/renderer";
import Resizer from "./systems/Resizer";
import Animator from "./systems/Animator";
import createOrbitControls from "./systems/controls";

import createScene from "./components/scene";
import createCamera from "./components/camera";
import { createAmbientLight, createPointLight } from "./components/light";
import Planet from "./components/Planet";

class RTCG {
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private animator: Animator;
  private controls: OrbitControls;

  constructor(container: HTMLElement) {
    this.camera = createCamera();
    this.renderer = createRenderer();
    this.scene = createScene();
    this.controls = createOrbitControls(this.camera, this.renderer.domElement);
    this.animator = new Animator(this.renderer, this.scene, this.camera);
    this.activateControls();

    const ambientLight: THREE.AmbientLight = createAmbientLight();
    const pointLight: THREE.PointLight = createPointLight();
    this.scene.add(ambientLight);
    this.scene.add(pointLight);

    const planet: Planet = new Planet(42, 2);
    this.scene.add(planet);

    const planet2: Planet = new Planet(69, 1);
    this.scene.add(planet2);

    this.animator.addAnimObject({
      object: planet2,
      tick: function (delta: number, time: number): void {
        const x: number = Math.cos(time) * 5;
        const z: number = Math.sin(time) * 5;

        this.object.position.x = x;
        this.object.position.z = z;

        this.object.rotation.y += delta;
      },
    });

    this.animator.addAnimObject({
      object: planet,
      tick: function (delta: number): void {
        this.object.rotation.y += delta * 0.5;
      },
    });

    const resizer: Resizer = new Resizer(container, this.camera, this.renderer);
    resizer.activate();

    container.appendChild(this.renderer.domElement);

    // document.body.appendChild(ARButton.createButton(this.renderer));

    // const onSelect: () => void = (): void => {
    //   const planet: Planet = new Planet(42, 0.05);

    //   planet.position.set(0, 0, -0.3).applyMatrix4(arController.matrixWorld);
    //   planet.quaternion.setFromRotationMatrix(arController.matrixWorld);

    //   this.scene.add(planet);
    // };

    // const arController: THREE.Group = this.renderer.xr.getController(0);

    // arController.addEventListener("select", onSelect);

    // this.scene.add(arController);
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

  private activateControls(): void {
    this.animator.addAnimObject({
      object: this.controls,
      tick: function (): void {
        this.object.update();
      },
    });
  }
}

export default RTCG;
