import Terrain from "./Terrain";
import { Object3D, Vector3 } from "three";
import SimpleNoiseFilter from "../systems/SimpleNoiseFilter";
import RidgeNoiseFilter from "../systems/RidgeNoiseFilter";

class Planet extends Object3D {
  private planetSeed: number;

  constructor(seed: number, size: number) {
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
      const side: Terrain = new Terrain(directions[i], size, 256);
      side.addNoiseFilter(
        new SimpleNoiseFilter(this.planetSeed, 2.34, 1.3, 0.12, 10, 0.37, 0.8),
        true,
        false
      );
      side.addNoiseFilter(new RidgeNoiseFilter(this.planetSeed, 2.4, 1.2, 1.5, 18, 0.89, 0.5));
      side.buildMesh();

      this.attach(side);
    }
  }
}

export default Planet;
