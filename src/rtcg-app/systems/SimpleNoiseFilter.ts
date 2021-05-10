import { makeNoise3D, Noise3D } from "open-simplex-noise";
import { Vector3 } from "three";
import INoiseFilter from "./INoiseFilter";

class SimpleNoiseFilter implements INoiseFilter {
  private noise: Noise3D;
  private roughness: number;
  private baseRoughness: number;
  private strength: number;
  private layers: number;
  private persistence: number;
  private minVal: number;

  constructor(
    seed: number,
    roughness: number,
    baseRoughness: number,
    strength: number,
    layers: number,
    persistence: number,
    minVal: number
  ) {
    this.noise = makeNoise3D(seed);
    this.roughness = roughness;
    this.baseRoughness = baseRoughness;
    this.strength = strength;
    this.layers = layers;
    this.persistence = persistence;
    this.minVal = minVal;
  }

  evaluate(point: Vector3): number {
    let value: number = 0;
    let frequency: number = this.baseRoughness;
    let amplitude: number = 1;

    for (let i: number = 0; i < this.layers; i++) {
      let v: number = this.noise(point.x * frequency, point.y * frequency, point.z * frequency);

      value += (v + 1) * 0.5 * amplitude;

      frequency *= this.roughness;
      amplitude *= this.persistence;
    }

    value = Math.max(0, value - this.minVal);

    return value * this.strength;
  }
}

export default SimpleNoiseFilter;
