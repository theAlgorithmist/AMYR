/** Copyright 2016 Jim Armstrong (www.algorithmist.net)
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

// Geometry Specs (todo: complete specs)
import { Polygon } from "../../geometry/polygon";
import { NEWS    } from "../../../../models/geometry";

import { PolygonUtils } from "../../utils/polygon-utils";

import { ProjectFromTo } from "../../../../models/geometry";

// compare two vectors (array of numbers) against the specified relative error
const __vectorCompare = (vector1:Array<number>, vector2:Array<number>, epsilon:number=0.01): boolean =>
{
  const n1:number = vector1.length;
  const n2:number = vector2.length;

  if (n1 != n2) return false;

  let i:number;
  let v:number;

  for (i=0; i<n1; ++i )
  {
    v = Math.abs( (vector1[i]-vector2[i])/vector1[i] );
    if( v > epsilon ) return false;
  }

  return true;
};

// Test Suites
describe('Polygon', () => {

  it('properly constructs a new default Polygon', function() {
    const poly: Polygon = new Polygon();

    expect(poly.area).toEqual(0);
    expect(poly.centroid.x).toEqual(0);
    expect(poly.centroid.y).toEqual(0);
    expect(poly.vertexCount).toEqual(0);
    expect(poly.xcoordinates).toBeTruthy();
    expect(poly.ycoordinates).toBeTruthy();
    expect(poly.xcoordinates.length).toEqual(0);
    expect(poly.ycoordinates.length).toEqual(0);
  });

  // remainder of specs to be filled in
});

describe('Polygon NEWS Separations', () => {

  const polyUtils: PolygonUtils = new PolygonUtils();

  const outer: Polygon = new Polygon();
  outer.xcoordinates   = [0, 0, 12, 20, 20, 0];
  outer.ycoordinates   = [0, 10, 18, 18, 0, 0];

  const inner: Polygon = new Polygon();
  inner.xcoordinates   = [0, 0, 6, 6, 0];
  inner.ycoordinates   = [0, 6, 6, 0, 0];

  it('returns null for null input', () => {
    inner.translate(1, 1);

    const tmp: any = null
    let news: NEWS | null = polyUtils.separations(inner, tmp);
    expect(news).toBe(null);

    news = polyUtils.separations(tmp, outer);
    expect(news).toBe(null);
  });

  it('separation test #1', () => {
    const news: NEWS = polyUtils.separations(inner, outer) as NEWS;

    expect(news.w).toBe(1);
    expect(news.w1.x).toBe(1);
    expect(news.w1.y).toBe(4);
    expect(news.w2.x).toBe(0);
    expect(news.w2.y).toBe(4);

    expect(news.e).toBe(13);
    expect(news.e1.x).toBe(7);
    expect(news.e1.y).toBe(4);
    expect(news.e2.x).toBe(20);
    expect(news.e2.y).toBe(4);

    expect(Math.abs(news.n-3.667) < 0.001).toBe(true);
    expect(news.n1.x).toBe(1);
    expect(news.n1.y).toBe(7);
    expect(news.n2.x).toBe(1);
    expect(Math.abs(news.n2.y-10.667) < 0.001).toBe(true);

    expect(news.s).toBe(1);
    expect(news.s1.x).toBe(1);
    expect(news.s1.y).toBe(1);
    expect(news.s2.x).toBe(1);
    expect(news.s2.y).toBe(0);
  });

  it('separation test #2', () => {
    const p: ProjectFromTo | null= polyUtils.minSeparation(inner, outer);

    expect(p?.d).toBe(1);
    expect(p?.x).toBe(0);
    expect(p?.y).toBe(1);
    expect(p?.fromX).toBe(1);
    expect(p?.fromY).toBe(1);
  });
});
