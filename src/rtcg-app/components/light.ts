import { AmbientLight, PointLight, Vector2 } from "three";

function createPointLight(): PointLight {
  const light: PointLight = new PointLight(0xffffff, 2, 100, 0);
  light.position.set(-1, 5, 10);
  light.castShadow = true;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 200;
  // light.shadow.bias = 0.0015;
  light.shadow.mapSize = new Vector2(2048, 2048);

  return light;
}

function createAmbientLight(): AmbientLight {
  const light: AmbientLight = new AmbientLight(0xededed);

  return light;
}

export { createAmbientLight, createPointLight };
