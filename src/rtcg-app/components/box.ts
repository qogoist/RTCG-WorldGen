import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";

function createBox(x: number, y: number, z: number): Mesh {
  const geometry: BoxGeometry = new BoxGeometry(x, y, z);
  const material: MeshStandardMaterial = new MeshStandardMaterial();

  const cube: Mesh = new Mesh(geometry, material);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.translateY(y / 2);

  return cube;
}

export default createBox;
