export interface LLSQResult
{
  a: number;     // fit model is ax + b

  b: number;     // fit model is ax + b

  siga: number;  // measure of uncertainty in the a-parameter  'r' is the square (R^2) of the

  sigb: number;  // measure of uncertainty in the b-parameter.

  chi2: number;  // chi-squared parameter for the fit

  r: number;     // square (R^2) of the correlation coefficient.
}

export interface PolyLLSQResult
{
  coef: Array<number>;

  rms: number;
}

export interface Samples
{
  x: Array<number>;
  y: Array<number>;
}

export interface BagggedLinearFit
{
  a: number;

  b: number;

  fits: Array<LLSQResult>
}

