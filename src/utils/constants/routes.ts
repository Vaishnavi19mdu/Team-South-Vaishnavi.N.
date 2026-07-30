export const ROUTES = {
  LANDING: 'landing',
  LOGIN: 'login',
  ROLE_SELECTION: 'role-selection',
  SIGNUP_STEP_1: 'signup-step-1',
  SIGNUP_STEP_2: 'signup-step-2',
  PENDING_APPROVAL: 'pending-approval',
} as const;

export type RouteKey = typeof ROUTES[keyof typeof ROUTES];
