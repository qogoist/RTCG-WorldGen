import { BufferAttribute, Color, Mesh, PlaneGeometry, MeshStandardMaterial, Vector3 } from "three";
import INoiseFilter from "../systems/INoiseFilter";

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
      // wireframe: true,
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

  public addNoiseFilter(
    filter: INoiseFilter,
    isMask: boolean = false,
    useMask: boolean = true
  ): void {
    this.noiseFilters.push({ filter, isMask, useMask });
  }

  public createVertexColors(planetMin: number, planetMax: number): void {
    for (let i: number = 0; i < this.geometry.attributes.position.count; i++) {
      const x: number = this.geometry.attributes.position.getX(i);
      const y: number = this.geometry.attributes.position.getY(i);
      const z: number = this.geometry.attributes.position.getZ(i);

      const distance: number = new Vector3(x, y, z).distanceTo(new Vector3(0, 0, 0));

      const value: number = (distance - planetMin) / (planetMax - planetMin);

      const green: Color = new Color(0x46b00c);
      let color: Color = new Color(0xffffff);
      color.lerp(green, 1 - value);

      if (distance <= this.size + 0.0000001) color = new Color(0x0000ff);

      this.geometry.attributes.color.setXYZ(i, color.r, color.g, color.b);
    }
  }
}

type NoiseFilterLayer = {
  filter: INoiseFilter;
  isMask: boolean;
  useMask: boolean;
};

export default Terrain;
