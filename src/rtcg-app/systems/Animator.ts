import { Camera, Clock, Mesh, Object3D, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface IAnimationObject {
  object: Mesh;
  tick: (delta: number, time: number) => void;
}

class Animator {
  private objects: IAnimationObject[];
  private renderer: WebGLRenderer;
  private scene: Object3D;
  private camera: Camera;
  private clock: Clock;
  private controls: OrbitControls;

  constructor(renderer: WebGLRenderer, scene: Object3D, camera: Camera, controls: OrbitControls) {
    this.objects = [];
    this.clock = new Clock();
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
  }
  start(): void {
    this.renderer.setAnimationLoop(() => {
      this.tick();
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop(): void {
    this.renderer.setAnimationLoop(null);
  }

  tick(): void {
    const delta: number = this.clock.getDelta();
    const time: number = this.clock.getElapsedTime();

    this.objects.forEach(object => {
      object.tick(delta, time);
    });
  }

  addAnimObject(object: IAnimationObject): void {
    this.objects.push(object);
  }

  removeAnimObject(object: IAnimationObject): void {
    const index: number = this.objects.findIndex(element => element === object);
    this.objects.splice(index, 1);
  }
}

export default Animator;
