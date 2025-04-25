export const STEP_IDS = {
  SET_UP: "set-up",
  CONFIGURE: "configure",
  REVIEW: "review",
} as const;

export const STEP_ORDER = [
  STEP_IDS.SET_UP,
  STEP_IDS.CONFIGURE,
  STEP_IDS.REVIEW,
] as const;

export type StepId = (typeof STEP_ORDER)[number];
