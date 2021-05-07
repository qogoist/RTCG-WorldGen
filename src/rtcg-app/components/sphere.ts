import { Mesh, MeshStandardMaterial, SphereGeometry } from "three";

function createSphere(radius: number, ws?: number, hs?: number): Mesh {
  const geometry: SphereGeometry = new SphereGeometry(radius, ws, hs);
  const material: MeshStandardMaterial = new MeshStandardMaterial();

  const sphere: Mesh = new Mesh(geometry, material);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  sphere.translateY(radius);

  return sphere;
}

export default createSphere;
