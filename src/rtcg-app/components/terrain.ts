import type { GradientColor, NoiseFilterLayer } from "../types";

import { BufferAttribute, Color, Mesh, PlaneGeometry, MeshStandardMaterial, Vector3 } from "three";
import INoiseFilter from "../systems/INoiseFilter";

//Creates a side of terrain of the planet.
class Terrain extends Mesh {
  public min: number;
  public max: number;

  private localUp: Vector3;
  private size: number;
  private noiseFilters: NoiseFilterLayer[];

  constructor(localUp: Vector3, scale: number, resolution: number) {
    const geometry: PlaneGeometry = new PlaneGeometry(2, 2, resolution, resolution);
    const material: MeshStandardMaterial = new MeshStandardMaterial({
      color: 0x616161,
      flatShading: true,
      vertexColors: true,
    });

    geometry.setAttribute(
      "color",
      new BufferAttribute(new Float32Array(geometry.attributes.position.count * 3), 3)
    );

    super(geometry, material);

    this.localUp = localUp;
    this.size = scale;
    this.noiseFilters = [];
    this.min = Infinity;
    this.max = -Infinity;

    this.castShadow = true;
    this.receiveShadow = true;
  }

  //Turns the geometry to look in the direction of the localUp-vector, then loops over all the vertices.
  //Forces all vertices on a unit sphere around the planet via normalization.
  //Then loops over all the noise filters in the library and modifies the vector n accordingly.
  //Finally sets the position of the vertices, as well as the normal (to avoid shading issues).
  public buildMesh(): void {
    this.geometry.lookAt(this.localUp);

    for (let i: number = 0; i < this.geometry.attributes.position.count; i++) {
      const x: number = this.geometry.attributes.position.getX(i) + this.localUp.x;
      const y: number = this.geometry.attributes.position.getY(i) + this.localUp.y;
      const z: number = this.geometry.attributes.position.getZ(i) + this.localUp.z;

      const n: Vector3 = new Vector3(x, y, z).normalize();

      let elevation: number = 0;
      let maskValue: number = 0;
      let nonMaskFilters: NoiseFilterLayer[] = [];

      for (const filter of this.noiseFilters) {
        if (filter.isMask) {
          const value: number = filter.filter.evaluate(n);

          maskValue += value;
          elevation += value;
        } else nonMaskFilters.push(filter);
      }

      for (const filter of nonMaskFilters) {
        const mask: number = filter.useMask ? maskValue : 1;

        elevation += filter.filter.evaluate(n) * mask;
      }

      n.multiplyScalar(this.size * (1 + elevation));

      const d: number = n.distanceTo(new Vector3(0, 0, 0));
      this.min = Math.min(this.min, d);
      this.max = Math.max(this.max, d);

      this.geometry.attributes.position.setXYZ(i, n.x, n.y, n.z);
      this.geometry.attributes.normal.setXYZ(i, n.x, n.y, n.z);
    }
  }

  //Adds a noise filter to the library.
  public addNoiseFilter(
    filter: INoiseFilter,
    isMask: boolean = false,
    useMask: boolean = true
  ): void {
    this.noiseFilters.push({ filter, isMask, useMask });
  }

  //Loops over the vertices and adjusts their color according to the height (distance to (0,0,0)).
  public createVertexColors(
    planetMin: number,
    planetMax: number,
    oceanColors: GradientColor[],
    landColors: GradientColor[]
  ): void {
    for (let i: number = 0; i < this.geometry.attributes.position.count; i++) {
      const x: number = this.geometry.attributes.position.getX(i);
      const y: number = this.geometry.attributes.position.getY(i);
      const z: number = this.geometry.attributes.position.getZ(i);

      const distance: number = new Vector3(x, y, z).distanceTo(new Vector3(0, 0, 0));

      let vertexColor: Color = new Color();

      if (distance <= this.size)
        vertexColor = getColor(distance, planetMin, this.size, oceanColors);
      else vertexColor = getColor(distance, this.size, planetMax, landColors);

      this.geometry.attributes.color.setXYZ(i, vertexColor.r, vertexColor.g, vertexColor.b);
    }
  }
}

//Gets the color on a  color-gradient according to the given value.
function getColor(value: number, min: number, max: number, gradient: GradientColor[]): Color {
  function normalize(v: number, vMin: number, vMax: number): number {
    return (v - vMin) / (vMax - vMin);
  }

  const normValue: number = normalize(value, min, max);
  let color: Color = new Color();

  for (let i: number = 1; i < gradient.length; i++) {
    let currentColor: GradientColor = gradient[i - 1];
    let nextColor: GradientColor = gradient[i];

    if (normValue < nextColor.stop || nextColor.stop === 1) {
      color.lerpColors(
        currentColor.color,
        nextColor.color,
        normalize(normValue, currentColor.stop, nextColor.stop)
      );
      break;
    }
  }

  return color;
}

export default Terrain;
