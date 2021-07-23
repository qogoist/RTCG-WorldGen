import type { GradientColor } from "../types";

import Terrain from "./Terrain";
import { Object3D, Vector3, Color } from "three";
import SimpleNoiseFilter from "../systems/SimpleNoiseFilter";
import RidgeNoiseFilter from "../systems/RidgeNoiseFilter";

//Planet creates a sphere from 6 different planes and warps them with random noise.
class Planet extends Object3D {
  private planetSeed: number;
  private minHeight: number;
  private maxHeight: number;

  constructor(seed: number, size: number) {
    super();

    this.planetSeed = seed;
    this.minHeight = Infinity;
    this.maxHeight = -Infinity;

    //A dictionary containing the up vectors for the respective planes.
    const directions: Vector3[] = [
      new Vector3(1, 0, 0),
      new Vector3(0, 1, 0),
      new Vector3(0, 0, 1),
      new Vector3(-1, 0, 0),
      new Vector3(0, -1, 0),
      new Vector3(0, 0, -1),
    ];

    const landColors: GradientColor[] = [
      {
        stop: 0,
        color: new Color(0xc2b280), //Sand
      },
      {
        stop: 0.25,
        color: new Color(0x46b00c), //Green
      },
      {
        stop: 0.5,
        color: new Color(0x888c8d), //Stone
      },
      {
        stop: 1,
        color: new Color(0xffffffc), //White
      },
    ];

    const oceanColors: GradientColor[] = [
      {
        stop: 0,
        color: new Color(0x00000f), //Dark Blue
      },
      {
        stop: 0.7,
        color: new Color(0x0000ff), //Medium Blue
      },
      {
        stop: 1,
        color: new Color(0x2bd5f0), //Teal
      },
    ];

    //Loops over the different sides and creates a new obeject of type Terrain for each side.
    //These are then modified by several noise filters and finally attached to the mesh.
    //Height min and max for the planet are then updated to later on calculate vertex colors based on height.
    for (let i: number = 0; i < 6; i++) {
      const side: Terrain = new Terrain(directions[i], size, 128);
      side.addNoiseFilter(
        new SimpleNoiseFilter(this.planetSeed, 2.34, 1.3, 0.1, 8, 0.37, 0.8),
        true,
        false
      );
      side.addNoiseFilter(new RidgeNoiseFilter(this.planetSeed, 2.1, 1.2, 1.2, 15, 0.89, 0.5));
      side.buildMesh();

      this.attach(side);
      this.updateHeights(side);
    }

    //Loops over the sides and adjusts vertex colors.
    for (const side of this.children as Terrain[]) {
      side.createVertexColors(this.minHeight, this.maxHeight, oceanColors, landColors);
    }
  }

  private updateHeights(side: Terrain): void {
    this.maxHeight = Math.max(this.maxHeight, side.max);
    this.minHeight = Math.min(this.minHeight, side.min);
  }
}

export default Planet;
