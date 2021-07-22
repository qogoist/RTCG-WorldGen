import { WebGLRenderer } from "three";

function createRenderer(): WebGLRenderer {
  const renderer: WebGLRenderer = new WebGLRenderer({ antialias: true, alpha: true });

  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;
  renderer.xr.enabled = true;

  return renderer;
}

export default createRenderer;
