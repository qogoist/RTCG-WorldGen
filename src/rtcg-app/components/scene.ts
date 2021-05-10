import { Color, Scene } from "three";

function createScene(): Scene {
  const scene: Scene = new Scene();

  scene.background = new Color(0x000000);

  return scene;
}

export default createScene;
