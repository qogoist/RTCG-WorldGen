import { makeNoise3D, Noise3D } from "open-simplex-noise";
import { Vector3 } from "three";

function getNoise(point: Vector3): number {
  const noise: Noise3D = makeNoise3D(100);

  const value: number = (noise(point.x, point.y, point.z) + 1) * 0.5;

  return value;
}

export { getNoise };
