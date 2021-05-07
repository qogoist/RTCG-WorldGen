import { Mesh, MeshStandardMaterial, PlaneGeometry, Vector3 } from "three";

class Terrain extends Mesh {
  private localUp: Vector3;

  constructor(localUp: Vector3, scale: number, resolution: number) {
    const geometry: PlaneGeometry = new PlaneGeometry(scale, scale, resolution, resolution);
    const material: MeshStandardMaterial = new MeshStandardMaterial({
      color: 0x616161,
      // wireframe: true,
    });

    super(geometry, material);

    this.localUp = localUp;

    this.castShadow = true;
    this.receiveShadow = true;

    this.shapeMesh();
  }

  private shapeMesh(): void {
    this.geometry.lookAt(this.localUp);

    for (let i: number = 0; i < this.geometry.attributes.position.count; i++) {
      const x: number = this.geometry.attributes.position.getX(i) + this.localUp.x;
      const y: number = this.geometry.attributes.position.getY(i) + this.localUp.y;
      const z: number = this.geometry.attributes.position.getZ(i) + this.localUp.z;

      const n: Vector3 = new Vector3(x, y, z).normalize();

      this.geometry.attributes.position.setXYZ(i, n.x, n.y, n.z);
      this.geometry.attributes.normal.setXYZ(i, n.x, n.y, n.z);
    }

    console.log(this.geometry.attributes);
  }
}

export default Terrain;
