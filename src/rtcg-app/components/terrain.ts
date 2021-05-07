import * as THREE from "three";
import NoiseGenerator from "../systems/noise";

interface TerrainData {
  width: number;
  height: number;
  widthSegments: number;
  heightSegments: number;
  octaves: number;
  totalHeight: number;
  scale: number;
  exponent: number;
  persistence: number;
  lacunarity: number;
}

class Terrain extends THREE.Mesh {
  constructor(terrainData: TerrainData) {
    const geometry: THREE.PlaneGeometry = Terrain.generateGeometry(terrainData);
    const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
      wireframe: false,
      color: 0x505050,
      side: THREE.DoubleSide,
      vertexColors: true,
    });
    super(geometry, material);
    this.castShadow = true;
    this.receiveShadow = true;
    this.rotation.x = -Math.PI / 2;
  }

  static generateGeometry(terrainData: TerrainData): THREE.PlaneGeometry {
    const geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(
      terrainData.width,
      terrainData.height,
      terrainData.widthSegments,
      terrainData.heightSegments
    );

    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(geometry.attributes.position.count * 3), 3)
    );

    const noise: NoiseGenerator = new NoiseGenerator(
      terrainData.octaves,
      terrainData.scale,
      terrainData.persistence,
      terrainData.lacunarity,
      1
    );

    for (let i: number = 0; i < geometry.attributes.position.count; i++) {
      let x: number = geometry.attributes.position.getX(i);
      let y: number = geometry.attributes.position.getY(i);

      x = x + 0.5;
      y = (y - 0.5) * -1;

      const h: number = noise.getValue(x, y);

      const green: THREE.Color = new THREE.Color(0x46b00c);
      const color: THREE.Color = new THREE.Color(0xffffff);
      color.lerp(green, 1 - h);
      geometry.attributes.color.setXYZ(i, color.r, color.g, color.b);

      geometry.attributes.position.setZ(
        i,
        Math.pow(h, terrainData.exponent) * terrainData.totalHeight
        // h
      );
    }

    return geometry;
  }

  updateGeometry(geometry: THREE.BufferGeometry): void {
    this.geometry.dispose();
    this.geometry = geometry;
  }
}

export default Terrain;
