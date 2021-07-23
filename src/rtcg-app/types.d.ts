export type GradientColor = {
  stop: number;
  color: Color;
};

export type NoiseFilterLayer = {
  filter: INoiseFilter;
  isMask: boolean;
  useMask: boolean;
};
