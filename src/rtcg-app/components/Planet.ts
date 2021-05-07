// import Terrain from "./Terrain";
import { Mesh, Object3D, Vector3 } from "three";
import createPlane from "./plane";

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
      const side: Mesh = createPlane(2, 2);

      side.lookAt(directions[i]);
      side.position.add(directions[i]);

      this.attach(side);
    }

    this.position.x = -4;
    this.position.y = 1;
  }
}

export default Planet;
