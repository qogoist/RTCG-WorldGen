import Terrain from "./Terrain";
import { Object3D, Vector3 } from "three";
import SimpleNoiseFilter from "../systems/SimpleNoiseFilter";
import RidgeNoiseFilter from "../systems/RidgeNoiseFilter";

class Planet extends Object3D {
  private planetSeed: number;

  constructor(seed: number) {
    super();

    this.planetSeed = seed;

    const directions: Vector3[] = [
      new Vector3(1, 0, 0),
      new Vector3(0, 1, 0),
      new Vector3(0, 0, 1),
      new Vector3(-1, 0, 0),
      new Vector3(0, -1, 0),
      new Vector3(0, 0, -1),
    ];

    for (let i: number = 0; i < 6; i++) {
      const side: Terrain = new Terrain(directions[i], 1, 256);
      side.addNoiseFilter(
        new SimpleNoiseFilter(this.planetSeed, 1.83, 0.71, 0.21, 5, 0.54, 1.1),
        true
      );
      side.addNoiseFilter(new RidgeNoiseFilter(this.planetSeed, 2.4, 1.2, 0.05, 6, 0.72, 1.1));
      side.buildMesh();

      this.attach(side);
    }
  }
}

export default Planet;
