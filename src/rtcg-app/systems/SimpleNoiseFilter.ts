import { makeNoise3D, Noise3D } from "open-simplex-noise";
import { Vector3 } from "three";
import INoiseFilter from "./INoiseFilter";

//A simple noise filter based on the simplex noise algorithm.
//It loops for a number of given layers, increasing the frequency each time by multiplying it with
//a given value (roughness).
//A lower amount of layers leads to smooth and larger surfaces, while more layers add detail.
class SimpleNoiseFilter implements INoiseFilter {
  private noise: Noise3D;
  private roughness: number; // The multiplier of the frequency for each loop.
  private baseRoughness: number; // The base frequency to use when polling the noise function.
  private strength: number; // A final modifier to adjust the overall strength of the effects.
  private layers: number; // The amount of layers (iterations to loop over).
  private persistence: number; // Modifies the influence of each noise layer. (Value should range between 0 and 1 to create a decay in influence). => High/more detailed layers have less impact on the final appearance.
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

    // value = Math.max(0, value - this.minVal);
    value = value - this.minVal;

    return value * this.strength;
  }
}

export default SimpleNoiseFilter;
