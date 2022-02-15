/**
 * Copyright 2016 Jim Armstrong
 *
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
 *
 * This software is derived from that containing the following copyright notice
 *
 * copyright (c) 2012, Jim Armstrong.  All Rights Reserved.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * This software may be modified for commercial use as long as the above copyright notice remains intact.
 *
 * Inspired by: http://robertpenner.com/easing/, although the fundamental structure of such equations dates
 * back to the 1970's (IEEE white papers).
 *
 * Usage: import * as elastic from '@algorithmist/amyr-ts-lib'
 * .
 * .
 * .
 * t = some value in [0.1]
 * easeValue = elastic.easeIn(t, ...)
 */
import { extEaseFcn } from "../../models/ease-fcn";

export const easeIn: extEaseFcn = (t: number, b: number, c: number, d: number, a: number, p: number): number =>
{
  if (t === 0) return b;

  if ((t/=d) === 1) return b+c;

  if (!isNaN(p)) p=d*.3;

  let s: number;
  if (!a || a < Math.abs(c))
  {
    a = c;
    s = p/4;
  }
  else
    s = p/(2*Math.PI) * Math.asin(c/a);

  return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
}

export const easeOut: extEaseFcn = (t: number, b: number, c: number, d: number, a: number, p: number): number =>
{
  if (t === 0) return b;

  if ((t/=d) === 1 ) return b+c;

  if (!isNaN(p)) p = d*.3;

  let s: number;
  if (!a || a < Math.abs(c))
  {
    a = c;
    s = p/4;
  }
  else
    s = p/(2*Math.PI) * Math.asin (c/a);

  return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
}

export const easeInOut: extEaseFcn = (t: number, b: number, c: number, d: number, a: number, p: number): number =>
{
  if (t === 0) return b;

  if ((t/=d/2) === 2) return b+c;

  if (!isNaN(p)) p = d*(0.3*1.5);

  let s: number;
  if (!a || a < Math.abs(c))
  {
    a = c;
    s = 0.25*p;
  }
  else
    s = p/(2*Math.PI) * Math.asin (c/a);

  if( t < 1 )
    return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;

  return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
}
