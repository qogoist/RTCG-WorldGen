import { PerspectiveCamera } from "three";

function createCamera(): PerspectiveCamera {
  const camera: PerspectiveCamera = new PerspectiveCamera(35, 1, 0.1, 100);

  camera.position.set(0, 0, 0);
  camera.lookAt(0, 0, -10);
  camera.up.set(0, 1, 0);

  return camera;
}

export default createCamera;
