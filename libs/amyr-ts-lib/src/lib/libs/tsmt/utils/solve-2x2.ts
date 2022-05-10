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
import { Point } from "../../../models/geometry";

/**
 * Typescript Math Toolkit: Simple 2x2 equation solver using Cramer's rule
 *
 * @param {number} a11 coefficient of x in first equation
 * @param {number} a12 coefficient of y in first equation
 * @param {number} a21 coefficient of x in second equation
 * @param {number} a22 coefficient of y in second equation
 *
 * @param {number} b1 right-hand side value in first equation
 * @param {number} b2 right-hand side value in second equation
 *
 * @param {number} zeroTol optional zero-tolerance for determinant
 * @default 0.00001
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
export function solve2x2(
  a11: number,
  a12: number,
  a21: number,
  a22: number,
  b1: number,
  b2: number,
  zeroTol: number = 0.0001
  ): Point
{
  // determinant of 2x2 coef matrix
  const determinant: number = a11*a22 - a12*a21;

  if (Math.abs(determinant) > zeroTol)
  {
    const solveX: number = (a22*b1 - a12*b2)/determinant;
    const solveY: number = (a11*b2 - a21*b1)/determinant;

    return {x: solveX, y: solveY};
  }

  return {x: 0, y: 0};
};
