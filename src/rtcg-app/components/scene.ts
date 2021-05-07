import { Color, Scene } from "three";

function createScene(): Scene {
  const scene: Scene = new Scene();

  scene.background = new Color("skyblue");

  return scene;
}

export default createScene;
