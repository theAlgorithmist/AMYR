export const SQRT_2: number    = Math.sqrt(2);
export const SQRT_2_PI: number = Math.sqrt(Math.PI + Math.PI);
export const TWO_PI: number    = Math.PI + Math.PI;
export const PI_2: number      = 0.5 * Math.PI;
export const ZERO_TOL          = 0.00000001;   // an extended zero tolerance
export const EPSILON           = 2.220446049250313e-16;  // mach. eps. * 2.0
export const FPMIN: number     = Number.MIN_VALUE / 2.220446049250313e-16;
export const NM_EPSILON        = 1.0e-7;

// for deviates of various distributions
export const IA          = 16807;
export const IM         = 2147483647;
export const AM: number = 1.0 / IM;
export const IQ         = 127773;
export const IR         = 2836;
export const NTAB       = 32;
export const NDIV       = (1 + (IM-1) / NTAB);
export const EPS        = 1.2e-7;
export const RNMX       = 1.0 - EPS;
