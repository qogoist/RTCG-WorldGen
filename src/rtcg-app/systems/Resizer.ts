import { PerspectiveCamera, WebGLRenderer } from "three";

class Resizer {
  private container: HTMLElement;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;

  constructor(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
    this.container = container;
    this.camera = camera;
    this.renderer = renderer;

    this.update();
  }

  activate(): void {
    window.addEventListener("resize", () => {
      this.update();
    });
  }

  update(): void {
    // console.log(`Updating Ratio: ${this.container.clientWidth / this.container.clientHeight}`);
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.renderer.setPixelRatio(window.devicePixelRatio);
  }
}

export default Resizer;
