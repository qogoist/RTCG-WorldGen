import { PerspectiveCamera } from "three";

function createCamera(): PerspectiveCamera {
  const camera: PerspectiveCamera = new PerspectiveCamera(35, 1, 0.1, 100);

  camera.position.set(10, 5, 10);
  camera.lookAt(0, 0, 0);
  camera.up.set(0, 1, 0);

  return camera;
}

export default createCamera;
