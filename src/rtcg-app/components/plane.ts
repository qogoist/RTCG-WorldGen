import { PlaneGeometry, Mesh, MeshStandardMaterial } from "three";

function createPlane(x: number, y: number, xs?: number, ys?: number): Mesh {
  const geometry: PlaneGeometry = new PlaneGeometry(x, y, xs, ys);
  const material: MeshStandardMaterial = new MeshStandardMaterial({
    color: 0x616161,
    wireframe: true,
  });

  const plane: Mesh = new Mesh(geometry, material);

  plane.castShadow = true;
  plane.receiveShadow = true;

  // plane.rotateX(-Math.PI / 2);

  return plane;
}

export default createPlane;
