/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * AMYR Library: A collection of special functions, often used in evaluation of statistical functions, mostly
 * taken from published sources, Numerical Recipes, and private communications.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

import {
  EPSILON,
  FPMIN,
  TWO_PI,
  ZERO_TOL
} from "../../../models/constants";

// TODO Need to overhaul documentation
const __S0: number = 1 / 12;
const __S1: number = 1 / 360;
const __S2: number = 1 / 1260;
const __S3: number = 1 / 1680;
const __S4: number = 1 / 1188;

const __sfe: Array<number> = [
    0,
    0.08106146679532758,
    0.04134069595440929,
    0.02767792568499833,
    0.02079067210376509,
    0.01664469118982119,
    0.01387612882307074,
    0.01189670994589177,
    0.01041126526197209,
    0.00925546218271273,
    0.00833056343336287,
    0.00757367548795184,
    0.00694284010720952,
    0.00640899418800421,
    0.00595137011275885,
    0.00555473355196280
  ];

const __w: Array<number> = [
    0.0055657196642445571,
    0.012915947284065419,
    0.020181515297735382,
    0.027298621498568734,
    0.034213810770299537,
    0.040875750923643261,
    0.047235083490265582,
    0.053244713977759692,
    0.058860144245324798,
    0.064039797355015485,
    0.068745323835736408,
    0.072941885005653087,
    0.076598410645870640,
    0.079687828912071670,
    0.082187266704339706,
    0.084078218979661945,
    0.085346685739338721,
    0.085983275670394821
  ];

const __y: Array<number> = [
    0.0021695375159141994,
    0.011413521097787704,
    0.027972308950302116,
    0.051727015600492421,
    0.082502225484340941,
    0.12007019910960293,
    0.16415283300752470,
    0.21442376986779355,
    0.27051082840644336,
    0.33199876341447887,
    0.39843234186401943,
    0.46931971407375483,
    0.54413605556657973,
    0.62232745288031077,
    0.70331500465597174,
    0.78649910768313447,
    0.87126389619061517,
    0.95698180152629142
  ];

const __c: Array<number> = [
    57.15623566586292,
    -59.59796035547549,
    14.13609797474175,
    -0.4919138160976202,
    0.339946499848119e-4,
    0.4652362892704858e-4,
    -0.983744753048796e-4,
    0.1580887032249125e-3,
    -0.2102644417241049e-3,
    0.2174396181152126e-3,
    -0.16431810653676389e-3,
    0.8441822398385274e-4,
    -0.2619083840158141e-4,
    0.3689918265953162e-5
  ];


// regularized beta function (x in [0,1] not fully enforced)
export function incompleteBeta(a: number, b: number, x: number): number
{
  if (Math.abs(x) < ZERO_TOL || Math.abs(x - 1.0) < ZERO_TOL) return x;

  if (a > 3000 && b > 3000) return betaiapprox(a, b, x);

  const bt:number = Math.exp(gammaln(a + b) - gammaln(a) - gammaln(b) + a * Math.log(x) + b * Math.log(1.0 - x));

  if (x < (a + 1.0) / (a + b + 2.0))
    return bt * betacf(a, b, x) / a;
  else
    return 1.0 - bt * betacf(b, a, 1.0 - x) / b;
}

// beta CF
export function betacf(a: number, b: number, x:number ): number
{
  const qab:number = a + b;
  const qap:number = a + 1.0;
  const qam:number = a - 1.0;

  let c        = 1.0;
  let d:number = 1.0 - qab * x / qap;

  if (Math.abs(d) < FPMIN) d = FPMIN;

  d             = 1.0 / d;
  let h: number = d;

  let m: number;
  let m2: number;
  let del: number;
  let dc: number;
  let aa: number;

  for (m = 1; m < 10000; m++)
  {
    m2 = m + m;
    aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1.0 + aa * d;

    if (Math.abs(d) < FPMIN) d = FPMIN;

    c = 1.0 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;

    d  = 1.0 / d;
    h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d  = 1.0 + aa * d;

    if (Math.abs(d) < FPMIN) d = FPMIN;

    c = 1.0 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;

    d   = 1.0 / d;
    del = d * c;
    h  *= del;

    if (Math.abs(del - 1.0) <= EPSILON) break;
  }

  return h;
}

// inverse beta approximation
export function betaiapprox(a: number, b: number, x: number): number
{
  let j: number;
  let xu: number;

  const a1: number    = a - 1.0;
  const b1: number    = b - 1.0;
  const ab: number    = a + b;
  const abSq: number  = ab * ab;
  const mu: number    = a / ab;
  const lnmu: number  = Math.log(mu);
  const lnmuc: number = Math.log(1.0 - mu);

  let t: number = Math.sqrt(a * b / (abSq * (ab + 1.0)));

  if (x > a / ab)
  {
    if (x >= 1.0) return 1.0;

    xu = Math.min(1.0, Math.max(mu + 10.0 * t, x + 5.0 * t));
  }
  else
  {
    if (x <= 0.0) return 0.0;

    xu = Math.max(0.0, Math.min(mu - 10.0 * t, x - 5.0 * t));
  }

  let sum = 0;
  for (j = 0; j < 18; j++)
  {
    t = x + (xu - x) * __y[j];
    sum += __w[j] * Math.exp(a1 * (Math.log(t) - lnmu) + b1 * (Math.log(1 - t) - lnmuc));
  }

  const ans: number = sum * (xu - x) * Math.exp(a1 * lnmu - gammaln(a) + b1 * lnmuc - gammaln(b) + gammaln(ab));

  return ans > 0.0 ? 1.0 - ans : -ans;
}

// ln(gamma) approximation
export function gammaln(_x: number): number
{
  let j: number;
  let y: number   = _x;
  const x: number = _x;

  let tmp: number = x + 5.24218750000000000;
  tmp             = (x + 0.5) * Math.log(tmp) - tmp;
  let s           = 0.9999999999999979;

  for (j = 0; j < 14; j++) {
    s += __c[j] / ++y;
  }

  return tmp + Math.log(2.506628274631001 * s / x);
}

export function gammp(a: number, x: number): number
{
  if (Math.abs(x) < ZERO_TOL) return 0.0;

  if (Math.floor(a) >= 100) return gammapapprox(a, x, 1);

  if (x < a + 1.0)
    return gser(a, x);
  else
    return 1.0 - gcf(a, x);
}

export function gammaq(a: number, x: number)
{
  if (Math.floor(a) >= 100) return gammapapprox(a, x, 0);

  if (x < a + 1.0)
    return 1.0 - gser(a, x);
  else
    return gcf(a, x);
}

export function gammapapprox(a: number, x: number, psig: number): number
{
  const a1: number     = a - 1.0;
  const lna1: number   = Math.log(a1);
  const sqrta1: number = Math.sqrt(a1);
  const gln: number    = gammaln(a);

  let xu: number;
  if (x > a1)
    xu = Math.max(a1 + 11.5 * sqrta1, x + 6.0 * sqrta1);
  else
    xu = Math.max(0.0, Math.min(a1 - 7.5 * sqrta1, x - 5.0 * sqrta1));

  let j: number;
  let t: number;
  let sum = 0;

  for (j = 0; j < 18; j++)
  {
    t    = x + (xu - x) * __y[j];
    sum += __w[j] * Math.exp(-(t - a1) + a1 * (Math.log(t) - lna1));
  }

  const ans = sum * (xu - x) * Math.exp(a1 * (lna1 - 1.0) - gln);

  return (psig ? (x > a1 ? 1.0 - ans : -ans) : (x > a1 ? ans : 1.0 + ans));
}

export function gser(a: number, x: number): number
{
  const gln: number = gammaln(a);

  let ap: number  = a;
  let sum: number = 1.0 / a;
  let del: number = sum;

  for (; ;)
  {
    ++ap;
    del *= x / ap;
    sum += del;

    if (Math.abs(del) < Math.abs(sum) * EPSILON) return sum * Math.exp(-x + a * Math.log(x) - gln);
  }
}

export function gcf(a: number, x: number): number
{
  const gln: number = gammaln(a);

  let b: number = x + 1.0 - a;
  let c: number = 1.0 / FPMIN;
  let d: number = 1.0 / b;
  let h: number = d;

  let i: number;
  let del: number;
  let an: number;

  // TODO Add iter limit to handle non-convergance due to bad inputs and while loop
  for (i = 1; ; i++)
  {
    an = -i * (i - a);
    b += 2.0;
    d  = an * d + b;

    if (Math.abs(d) < FPMIN) d = FPMIN;

    c = b + an / c;

    if (Math.abs(c) < FPMIN) c = FPMIN;

    d   = 1.0 / d;
    del = d * c;
    h  *= del;

    if (Math.abs(del - 1.0) <= EPSILON) break;
  }

  return Math.exp(-x + a * Math.log(x) - gln) * h;
}

export function invgammp(p: number, a: number): number
{
  let j: number;
  let x: number;
  let err: number;
  let t: number;
  let u: number;
  let pp: number;

  let lna1 = 0;
  let afac = 0;

  const a1 = a - 1.0;
  const gln = gammaln(a);

  // out-of-range p ignored for internal method (args checked in advance of call)
  if (a > 1.0)
  {
    lna1 = Math.log(a1);
    afac = Math.exp(a1 * (lna1 - 1.) - gln);
    pp   = (p < 0.5) ? p : 1.0 - p;
    t    = Math.sqrt(-2.0 * Math.log(pp));
    x    = (2.30753 + t * 0.27061) / (1.0 + t * (0.99229 + t * 0.04481)) - t;

    if (p < 0.5) {
      x = -x;
    }

    x = Math.max(1.e-3, a * Math.pow(1.0 - 1.0 / (9. * a) - x / (3.0 * Math.sqrt(a)), 3));
  }
  else
  {
    t = 1.0 - a * (0.253 + a * 0.12);
    x = (p < t) ? Math.pow(p / t, 1. / a) : 1.0 - Math.log(1.0 - (p - t) / (1.0 - t));
  }

  for (j = 0; j < 12; ++j)
  {
    if (x <= 0.0) return 0.0;

    err = gammp(a, x) - p;

    t = (a > 1.0) ? afac * Math.exp(-(x - a1) + a1 * (Math.log(x) - lna1)) : Math.exp(-x + a1 * Math.log(x) - gln);

    u  = err / t;
    x -= (t = u / (1. - 0.5 * Math.min(1.0, u * ((a - 1.0) / x - 1))));

    if (x <= 0.0) {
      x = 0.5 * (x + t);
    }

    if (Math.abs(t) < EPSILON * x) break;
  }

  return x;
}

// stirling err fcn.
export function __stirlerr(n: number): number
{
  if (n < 16) return __sfe[n];

  const nSq: number = n * n;
  if (n > 500) return ((__S0 - __S1 / nSq) / n);

  if (n > 80) return ((__S0 - (__S1 - __S2 / nSq) / nSq) / n);

  if (n > 35) return ((__S0 - (__S1 - (__S2 - __S3 / nSq) / nSq) / nSq) / n);

  return ((__S0 - (__S1 - (__S2 - (__S3 - __S4 / nSq) / nSq) / nSq) / nSq) / n);
}

export function __dev(x: number, np: number): number
{
  let j: number;
  let s: number;
  let s1: number;
  let v: number;
  let ej: number;

  const xmnp: number = x - np;
  const xpnp: number = x + np;

  if (Math.abs(xmnp) < 0.1 * xpnp)
  {
    s  = xmnp * xmnp / xpnp;
    v  = xmnp / xpnp;
    ej = 2 * x * v;
    j  = 1;

    const finished = false;

    // TODO Add iter limit to support non-convergence from bad inputs
    while (!finished)
    {
      ej *= v * v;
      s1 = s + ej / (2 * j + 1);

      if (Math.abs((s1 - s) / s) < 0.01) {
        return s1;
      }

      s = s1;
      j++;
    }
  }

  return x * Math.log(x / np) + np - x;
}
