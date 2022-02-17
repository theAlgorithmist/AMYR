/**
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
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
 */

/**
 * AMYR Library, Typescript Math Toolkit: Methods for defining and operating on Quaternions.  This is one of the few classes that
 * deals with three-dimensional coordinates, so it may be used in games where simple (drawn) objects are manipulated
 * with 3D transforms.
 *
 * Note that the presumed Quaternion form is q[0] + q[1]i + q[2]j + q[3]k or (real, img).
 *
 * A unit Quaternion is defined on initialization.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

export type Quaterion = {w: number, i: number, j: number, k: number};

export class TSMT$Quaternion
{
  protected PI_2: number;       // PI / 2
  protected _q: Array<number>;  // internal representation of quaternion (4-tuple of w, i, j, k)

  // TODO allow w, i, j, k to be passed into constructor
  constructor()
  {
    this.PI_2 = 0.5*Math.PI;
    this._q   = [1, 0, 0, 0];
  }

  /**
   * Access real value
   */
  public get w(): number
  {
    return this._q[0];
  }

  /**
   * Access {i} value
   */
  public get i(): number
  {
    return this._q[1];
  }

  /**
   * Access {j} value
   */
  public get j(): number
  {
    return this._q[2];
  }

  /**
   * Access {k} value
   */
  public get k(): number
  {
    return this._q[3];
  }

  /**
   * Access the Quaternion values; returns a four-element array containing a copy of the Quaternion values
   */
  public get values(): Array<number>
  {
    return this._q.slice();
  }

  /**
   * Create a new Quaternion from an array of numbers
   *
   * @param {Array<number>} values A three- or four-tuple if numbers, x, y, z, w values - three inputs cause the real
   * value in the Quaterion to be set to unity
   */
  public fromArray(... values: Array<number>): void
  {
    if (!values || values.length < 3) return;

    if (values.length === 3)
    {
      this._q[1] = values[0];
      this._q[2] = values[1];
      this._q[3] = values[2];

      this._q[0] = 1.0;
    }
    else
    {
      this._q[0] = values[0];
      this._q[1] = values[1];
      this._q[2] = values[2];
      this._q[3] = values[3];
    }
  }

  /**
   * Create a new Quaternion from an data object
   *
   * @param {Quaterion} q Quaternaion
   */
  public fromObject(q: Quaterion): void
  {
    // remember that JS loves to coerce object values to strings
    if (q.w !== undefined) this._q[0] = isNaN(q.w) ? this._q[0] : +q.w;

    if (q.i !== undefined) this._q[1] = isNaN(q.i) ? this._q[1] : +q.i;

    if (q.j !== undefined) this._q[2] = isNaN(q.j) ? this._q[2] : +q.j;

    if (q.k !== undefined) this._q[3] = isNaN(q.k) ? this._q[3] : +q.k;
  }

  /**
   * Return a {Quaternion} representation of this quaternion
   */
  public toObject(): Quaterion
  {
    return { w: this._q[0], i: this._q[1], j: this._q[2], k: this._q[3] };
  }

  /**
   * Return current Quaternion values as an array of numbers, w, x, y, and z, in that order
   */
  public toArray(): Array<number>
  {
    return this._q.slice();
  }

  /**
   * Create a Quaternion that has the specified x-axis rotation
   *
   * @param {number} angle x-axis rotation value in radians
   */
  public fromXRotation(angle: number): void
  {
    const a: number = isNaN(angle) ? 0.0 : 0.5*angle;
    this._q[0]      = Math.sin(a);
    this._q[1]      = 0;
    this._q[2]      = 0;
    this._q[3]      = Math.cos(a);
  }

  /**
   * Create a Quaternion that has the specified y-axis rotation
   *
   * @param {number} angle y-axis rotation value in radians
   *
   *
   */
  public fromYRotation(angle: number): void
  {
    const a: number = isNaN(angle) ? 0.0 : 0.5*angle;
    this._q[0]      = 0;
    this._q[1]      = Math.sin(a);
    this._q[2]      = 0;
    this._q[3]      = Math.cos(a);
  }

  /**
   * Create a Quaternion that has the specified z-axis rotation
   *
   * @param {number} angle z-axis rotation value in radians
   */
  public fromZRotation(angle: number): void
  {
    const a: number = isNaN(angle) ? 0.0 : 0.5*angle;
    this._q[0]      = 0;
    this._q[1]      = 0;
    this._q[2]      = Math.sin(a);
    this._q[3]      = Math.cos(a);
  }

  /**
   * Create a Quaternion that has the specified rotation about the specified axis
   *
   * @param {Array<number>} axis 3D vector from origin to point in 3-space that defines a rotation axis
   *
   * @param {number} angle Rotation angle in degrees
   */
  public fromAxisRotation(axis: Array<number>, angle: number): void
  {
    const l: number = axis.length == 3 ? Math.sqrt( axis[0]*axis[0] + axis[1]*axis[1] + axis[2]*axis[2] ) : 0.0;
    const d: number = Math.abs(l) < 0.0000000001 ? 100000 : 1/l;

    const a: number = 0.5*angle;
    const c: number = Math.cos(a);
    const s: number = Math.sin(a)*d;

    this._q[0] = c;
    this._q[1] = s*axis[0];
    this._q[2] = s*axis[1];
    this._q[3] = s*axis[2];
  }

  /**
   * Compute the current Quaternion that is equivalent to the supplied 3x3 rotation matrix
   *
   * @param {Array<Array<number>>} m Array of arrays that represents a 3x3 rotation matrix
   */
  public fromRotationMatrix(m: Array< Array<number> >): void
  {
    if (m.length != 3) return;

    // TODO - check trace of rotation matrix
    let u: number;
    let v: number;
    let w: number;

    // u, v, and w are chosen so that u is the index of max. diagonal of m.  u v w are an even permutation of 0, 1, 2.
    if( m[0][0] > m[1][1] && m[0][0] > m[2][2] )
    {
      u = 0;
      v = 1;
      w = 2;
    }
    else if( m[1][1] > m[0][0] && m[1][1] > m[2][2] )
    {
      u = 1;
      v = 2;
      w = 0;
    }
    else
    {
      u = 2;
      v = 0;
      w = 1;
    }

    let r: number = Math.sqrt(1 + m[u][u] - m[v][v] - m[w][w]);
    this._q[u]    = 0.5*r;

    r          = 0.5/r;
    this._q[v] = r*(m[v][u] + m[u][v]);
    this._q[w] = r*(m[u][w] + m[w][u]);
    this._q[3] = r*(m[v][w] - m[w][v]);
  }

  /**
   * Computes a 3 x 3 Euler rotation matrix from the current Quaternion
   */
  public toRotationMatrix(): Array< Array<number> >
  {
    const qW: number = this._q[0];
    const qX: number = this._q[1];
    const qY: number = this._q[2];
    const qZ: number = this._q[3];

    const qWqW: number = qW*qW;
    const qWqX: number = qW*qX;
    const qWqY: number = qW*qY;
    const qWqZ: number = qW*qZ;
    const qXqW: number = qX*qW;
    const qXqX: number = qX*qX;
    const qXqY: number = qX*qY;
    const qXqZ: number = qX*qZ;
    const qYqW: number = qY*qW;
    const qYqX: number = qY*qX;
    const qYqY: number = qY*qY;
    const qYqZ: number = qY*qZ;
    const qZqW: number = qZ*qW;
    const qZqX: number = qZ*qX;
    const qZqY: number = qZ*qY;
    const qZqZ: number = qZ*qZ;

    const r: Array< Array<number> > = new Array< Array<number> >();

    let d: number = qWqW + qXqX + qYqY + qZqZ;

    if( Math.abs(d) > 0.0000000001 )
    {
      d                = 1/d;
      const d2: number = d+d;

      r.push( [ d*(qWqW + qXqX - qYqY - qZqZ), d2*(qWqZ + qXqY), d2*(qXqZ - qWqY)] );
      r.push( [ d2*(qXqY - qWqZ), d*(qWqW - qXqX + qYqY - qZqZ), d2*(qWqX + qYqZ)] );
      r.push( [ d2*(qWqY + qXqZ), d2*(qYqZ - qWqX), d*(qWqW - qXqX - qYqY + qZqZ)] );
    }

    return r;
  }

  /**
   * Clone the current Quaternion
   */
  public clone(): TSMT$Quaternion
  {
    const q: TSMT$Quaternion = new TSMT$Quaternion();
    q.fromArray(this._q[0], this._q[1], this._q[2], this._q[3]);

    return q;
  }

  /**
   * Compute the length of the current Quaternion,
   */
  public length(): number
  {
    return Math.sqrt( this._q[0]*this._q[0] + this._q[1]*this._q[1] + this._q[2]*this._q[2] + this._q[3]*this._q[3] );
  }

  /**
   * Normalize the current Quaternion
   */
  public normalize(): void
  {
    const l:number = this.length();
    const d:number = Math.abs(l) < 0.0000000001 ? 1.0 : 1.0 / l;

    this._q[0] *= d;
    this._q[1] *= d;
    this._q[2] *= d;
    this._q[3] *= d;
  }

  /**
   * Add a Quaternion to the current Quaternion and overwrite the current Quaternion
   *
   * @param {TSMT$Quaternion} q TMST Quaternion
   */
  public add(q: TSMT$Quaternion): void
  {
    const t: Array<number> = q.values;

    this._q[0] += t[0];
    this._q[1] += t[1];
    this._q[2] += t[2];
    this._q[3] += t[3];
  }

  /**
   * Add a Quaternion to the current Quaternion and return the result in a new Quaternion
   *
   * @param {TSMT$Quaternion} q TMST Quaternion
   */
  public addTo(q: TSMT$Quaternion): TSMT$Quaternion
  {
    const s:TSMT$Quaternion = this.clone();

    s.add(q);

    return s;
  }

  /**
   * Add a scalar to the current Quaternion and overwrite the current Quaternion
   *
   * @param {number} a Scalar value
   */
  public addScalar(a: number): void
  {
    if (!isNaN(a) && isFinite(a)) this._q[0] += a;
  }

  /**
   * Add a scalar to the current Quaternion and return the result in a new Quaternion
   *
   * @param {number} a Scalar value
   */
  public addScalarTo(a: number): TSMT$Quaternion
  {
    const s: TSMT$Quaternion = this.clone();

    if (!isNaN(a) && isFinite(a)) s.addScalar(a);

    return s;
  }

  /**
   * Subtract a Quaternion from the current Quaternion and overwrite the current Quaternion
   *
   * @param {TSMT$Quaternion} q TSMT Quaternion
   */
  public subtract(q: TSMT$Quaternion)
  {
    const t:Array<number> = q.values;

    this._q[0] -= t[0];
    this._q[1] -= t[1];
    this._q[2] -= t[2];
    this._q[3] -= t[3];
  }

  /**
   * Subtract a Quaternion from the current Quaternion and return the result in a new Quaternion
   *
   * @param {TSMT$Quaterion} q TSMT Quaternion
   */
  public subtractFrom(q: TSMT$Quaternion): TSMT$Quaternion
  {
    const s: TSMT$Quaternion = this.clone();
    s.subtract(q);

    return s;
  }

  /**
   * Subtract a scalar from the current Quaternion and overwrite the current Quaternion with the result
   *
   * @param {number} a Scalar value
   *
   * @returns {nothing} The current Quaternion, q, is overwritten by q - a
   */
  public subtractScalar(a: number): void
  {
    if (!isNaN(a) && isFinite(a)) this._q[0] -= a;
  }

  /**
   * Subtract a scalar from the current Quaternion and return the result in a new Quaternion
   *
   * @param {number} a Scalar value
   */
  public subractScalarFrom(a: number): TSMT$Quaternion
  {
    const s:TSMT$Quaternion = this.clone();
    s.subtractScalar(a);

    return s;
  }

  /**
   * Multiply the current Quaternion by another Quaternion and overwrite the current Quaternion with the result
   *
   * @param {TSMT$Quaterion} q TSMT Quaternion
   */
  public multiply(q:TSMT$Quaternion): void
  {
    const b:Array<number> = q.values;

    // this will make it look closer to a textbook formula
    const aW: number = this._q[0];
    const aX: number = this._q[1];
    const aY: number = this._q[2];
    const aZ: number = this._q[3];
    const bW: number = b[0];
    const bX: number = b[1];
    const bY: number = b[2];
    const bZ: number = b[3];

    this._q[0] = aW*bW - aX*bX - aY*bY - aZ*bZ;
    this._q[1] = aW*bX + aX*bW + aY*bZ - aZ*bY;
    this._q[2] = aW*bY - aX*bZ + aY*bW + aZ*bX;
    this._q[3] = aW*bZ + aX*bY - aY*bX + aZ*bW;
  }

  /**
   * Multiply the current Quaternion by another Quaternion and return the result in a new Quaternion
   *
   * @param {TSMT$Quaterion} q TSMT$Quaternion
   */
  public multiplyInto(q: TSMT$Quaternion): TSMT$Quaternion
  {
    const s: TSMT$Quaternion = this.clone();
    s.multiply(q);

    return s;
  }

  /**
   * Multiply the current Quaternion by a scalar and overwrite the current Quaternion with the result
   *
   * @param {number} a Scalar value
   */
  public multiplyByScalar(a: number): void
  {
    this._q[0] *= a;
    this._q[1] *= a;
    this._q[2] *= a;
    this._q[3] *= a;
  }

  /**
   * Multiply the current Quaternion by a scalar and return the result in a new Quaternion
   *
   * @param {number} a Scalar value
   */
  public multiplyByScalarInto(a: number): TSMT$Quaternion
  {
    const s:TSMT$Quaternion = this.clone();
    s.multiplyByScalar(a);

    return s;
  }

  /**
   * Divide the current Quaternion by another Quaternion and overwrite the current Quaternion with the result
   *
   * @param {TSMT$Quaterion} q TSMT Quaterion
   */
  public divide(q:TSMT$Quaternion): void
  {
    const q1: TSMT$Quaternion = q.clone();
    q1.invert();

    this.multiply(q1);
  }

  /**
   * Divide the current Quaternion by another Quaternion and return the result in a new Quaternion
   *
   * @param {TSMT$Quaterionn} q TMST Quaternion
   */
  public divideInto(q: TSMT$Quaternion): TSMT$Quaternion
  {
    const s: TSMT$Quaternion = this.clone();
    s.divide(q);

    return s;
  }

  /**
   * Divide the current Quaternion by a scalar and overwrite the current Quaternion
   *
   * @param {number} a Scalar value - must be nonzero
   */
  public divideByScalar(a: number): void
  {
    const k: number = Math.abs(a) < 0.0000000001 ? 1.0 : 1/a;

    this._q[0] *= k;
    this._q[1] *= k;
    this._q[2] *= k;
    this._q[3] *= k;
  }

  /**
   * Divide the current Quaternion by a scalar and return the result in a new Quaternion
   *
   * @param {number} a Scalar value - must be nonzero
   */
  public divideByScalarInto(a:number): TSMT$Quaternion
  {
    const s: TSMT$Quaternion = this.clone();
    s.divideByScalar(a);

    return s;
  }

  /**
   * Divide a scalar by the current Quaternion and overwrite the current Quaternion with the result
   *
   * @param {number} a Scalar value
   */
  public divideScalarBy(a: number): void
  {
    const q0: number = this._q[0];
    const q1: number = this._q[1];
    const q2: number = this._q[2];
    const q3: number = this._q[3];

    const l: number = q0*q0 + q1*q1 + q2*q2 + q3*q3;
    const d: number = Math.abs(l) < 0.0000000001 ? 1 : 1/l;

    this._q[0] = -a*q0*d;
    this._q[1] = -a*q1*d;
    this._q[2] = -a*q2*d;
    this._q[3] = a*q3*d;
  }

  /**
   * Invert the current Quaternion
   */
  public invert(): void
  {
    const q0: number = this._q[0];
    const q1: number = this._q[1];
    const q2: number = this._q[2];
    const q3: number = this._q[3];

    const l: number = q0*q0 + q1*q1 + q2*q2 + q3*q3;
    const d: number = Math.abs(l) < 0.0000000001 ? 1 : 1/l;

    this._q[0] = -q0*d;
    this._q[1] = -q1*d;
    this._q[2] = -q2*d;
    this._q[3] = q3*d;
  }

  /**
   * Invert the current Quaternion and return the result in a new Quaternion
   */
  public inverse(): TSMT$Quaternion
  {
    const q: TSMT$Quaternion = this.clone();
    q.invert();

    return q;
  }

  /**
   * Compute the dot or inner product with another quaternion
   *
   * @param {TSMT$Quaternion} q TSMT Quaternion
   */
  public dot(q: TSMT$Quaternion): number
  {
    const a: Array<number> = q.values;

    return a[0]*this._q[0] + a[1]*this._q[1] + a[2]*this._q[2] + a[3]*this._q[3];
  }

  /**
   * Spherical Linear Interpolation between the current Quaternion and an input Quaternion.  Returns
   * Slerp from current Quaternion, qa to input Quaternion, qb.
   *
   * @param {TSMT$Quaternion} q TSMT Quaternion
   *
   * @param {number} t Interpolation parameter in [0,1]
   */
  public slerp( q: TSMT$Quaternion, _t: number ): TSMT$Quaternion
  {
    let t: number = Math.max(0.0,_t);
    t             = Math.min(t,1.0);

    const qt: TSMT$Quaternion = this.clone();

    // make it look more like a formula you've seen in a book or online
    const qaw: number = this._q[0];
    const qax: number = this._q[2];
    const qay: number = this._q[2];
    const qaz: number = this._q[3];

    const b: Array<number> = q.values;
    let qbw: number        = b[0];
    let qbx: number        = b[1];
    let qby: number        = b[2];
    let qbz: number        = b[3];

    // cos of half-angle betwen quaternions
    let ctheta: number = qax*qbx + qay*qby + qaz*qbz + qaw*qaw;

    if (Math.abs(ctheta) >= 1.0)
    {
      qt.fromArray( qax, qay, qaz, qaw );
      return qt;
    }
    else if (ctheta < 0)
    {
      // avoid the 'long' route :)
      qbx = -qbx;
      qby = -qby;
      qbz = -qbz;
      qbw = -qbw;

      ctheta = -ctheta;
    }

    const halfTheta: number    = Math.acos(ctheta);
    const sinHalfTheta: number = Math.sqrt(1.0 - ctheta*ctheta);

    if( Math.abs(sinHalfTheta) < 0.001 )
      qt.fromArray( qax*0.5 + qbx*0.5, qay*0.5 + qby*0.5, qaz*0.5 + qbz*0.5, qaw*0.5 + qbw*0.5 );
    else
    {
      const rA: number = Math.sin((1.0 - t)*halfTheta) / sinHalfTheta;
      const rB: number = Math.sin(t*halfTheta) / sinHalfTheta;

      qt.fromArray( qax*rA + qbx*rB, qay*rA + qby*rB, qaz*rA + qbz*rB, qaw*rA + qbw*rB );
    }

    return qt;
  }

  /**
   * Normalized linear interpolation between the current and an input quaternion.  Returns normalized, interpolated
   * quaternion at t-parameter; note that NLERP does not preserve constant velocity, but is computationally simpler
   * as well as commutative and torque-minimal.
   *
   * @param {TSMT$Quaterion} q TSMT Quaternion
   *
   * @param {number} t Interpolation parameter in [0,1].
   */
  public nlerp( q: TSMT$Quaternion, _t: number ): TSMT$Quaternion
  {
    let t: number = Math.max(0.0,_t);
    t             = Math.min(t,1.0);

    const qt: TSMT$Quaternion = this.clone();

    const t1: number = 1.0 - t;

    if (this.dot(q) < 0.0) t = -t;

    qt.multiplyByScalar(t1);
    q.multiplyByScalar(t);

    qt.add(q);
    qt.normalize();

    return qt;
  }
}
