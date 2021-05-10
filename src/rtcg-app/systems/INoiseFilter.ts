import { Vector3 } from "three";

interface INoiseFilter {
  evaluate(point: Vector3): number;
}

enum NOISEFILTERS {
  Simple,
}

export default INoiseFilter;
export { NOISEFILTERS };
