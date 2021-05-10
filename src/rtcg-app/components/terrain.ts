import { Mesh, MeshStandardMaterial, PlaneGeometry, Vector3 } from "three";
import INoiseFilter from "../systems/INoiseFilter";

class Terrain extends Mesh {
  private localUp: Vector3;
  private size: number;
  private noiseFilters: { filter: INoiseFilter; isMask: boolean; useMask: boolean }[];

  constructor(localUp: Vector3, scale: number, resolution: number) {
    const geometry: PlaneGeometry = new PlaneGeometry(2, 2, resolution, resolution);
    const material: MeshStandardMaterial = new MeshStandardMaterial({
      color: 0x616161,
      // wireframe: true,
      flatShading: true,
    });

    super(geometry, material);

    this.localUp = localUp;
    this.size = scale;
    this.noiseFilters = [];

    this.castShadow = true;
    this.receiveShadow = true;
  }

  public buildMesh(): void {
    this.geometry.lookAt(this.localUp);

    for (let i: number = 0; i < this.geometry.attributes.position.count; i++) {
      const x: number = this.geometry.attributes.position.getX(i) + this.localUp.x;
      const y: number = this.geometry.attributes.position.getY(i) + this.localUp.y;
      const z: number = this.geometry.attributes.position.getZ(i) + this.localUp.z;

      const n: Vector3 = new Vector3(x, y, z).normalize();

      let elevation: number = 0;
      let maskValue: number = 0;

      for (const filter of this.noiseFilters) {
        if (filter.isMask) maskValue += filter.filter.evaluate(n);
      }

      for (const filter of this.noiseFilters) {
        const mask: number = filter.useMask ? maskValue : 1;

        elevation += filter.filter.evaluate(n) * mask;
      }

      n.multiplyScalar(this.size * (1 + elevation));

      this.geometry.attributes.position.setXYZ(i, n.x, n.y, n.z);
      this.geometry.attributes.normal.setXYZ(i, n.x, n.y, n.z);
    }
  }

  public addNoiseFilter(
    filter: INoiseFilter,
    isMask: boolean = false,
    useMask: boolean = true
  ): void {
    this.noiseFilters.push({ filter, isMask, useMask });
  }
}

export default Terrain;
