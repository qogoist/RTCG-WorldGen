import { makeNoise2D, Noise2D } from "open-simplex-noise";

class NoiseGenerator {
  private noise: Noise2D;
  private octaves: number;
  private scale: number;
  private persistence: number; //Controls the amplitude of each frequency (0 - 1)
  private lacunarity: number; //Controls the frequency dependant on number of octaves

  constructor(
    octaves: number,
    scale: number,
    persistence: number,
    lacunarity: number,
    seed?: number
  ) {
    if (seed) this.noise = makeNoise2D(seed);
    else this.noise = makeNoise2D(Date.now());

    this.octaves = octaves;
    this.scale = scale;
    this.persistence = persistence;
    this.lacunarity = lacunarity;
  }

  getValue(x: number, y: number): number {
    const x0: number = x / this.scale;
    const y0: number = y / this.scale;

    let total: number = 0;
    let n: number = 0;
    let f: number = 1;
    let amplitude: number = 1;

    for (let i: number = 0; i < this.octaves; i++) {
      f = Math.pow(this.lacunarity, i);
      amplitude = Math.pow(this.persistence, i);

      const noiseVal: number = this.getNoise(x0 * f, y0 * f);

      total += noiseVal * amplitude;
      n += amplitude;
    }

    return (total /= n);
  }

  private getNoise(x: number, y: number): number {
    return this.noise(x, y) / 2 + 0.5;
  }
}

export default NoiseGenerator;
