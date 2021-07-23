import { Camera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function createOrbitControls(camera: Camera, canvas: HTMLCanvasElement): OrbitControls {
  const controls: OrbitControls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  controls.target.add(new Vector3(0, 0, -10));

  return controls;
}

export default createOrbitControls;
