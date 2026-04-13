/** منحنى ناعم موحّد لحركات التمرير */
export const scrollEase = [0.22, 1, 0.36, 1] as const;

export const scrollTransition = {
  duration: 0.62,
  ease: scrollEase,
} as const;

export const scrollViewport = {
  once: true as const,
  margin: "-10% 0px -6% 0px" as const,
  amount: 0.2 as const,
};
