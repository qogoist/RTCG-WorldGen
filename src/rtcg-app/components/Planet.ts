import Terrain from "./Terrain";
import { Mesh, Object3D, Vector3 } from "three";

class Planet extends Object3D {
  constructor() {
    super();

    const directions: Vector3[] = [
      new Vector3(1, 0, 0),
      new Vector3(0, 1, 0),
      new Vector3(0, 0, 1),
      new Vector3(-1, 0, 0),
      new Vector3(0, -1, 0),
      new Vector3(0, 0, -1),
    ];

    for (let i: number = 0; i < 6; i++) {
      const side: Mesh = new Terrain(directions[i], 2, 128);

      this.attach(side);
    }
  }
}

export default Planet;
