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
 * Minimal methods that must be implemented by a (Canvas) Graphics context (suitable for use by either
 * EaselJS or PIXI JS)
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
export interface IGraphics
{
  interactive: boolean;

  rotation: number;

  x: number;

  y: number;

  clear(): void;

  moveTo(x: number, y: number): void;

  lineTo(x: number, y: number): void;

  curveTo(cx: number, cy: number, x1: number, y1: number): void;

  drawCircle(x: number, y: number, r: number): void;

  endStroke(): void;

  setStrokeStyle( stroke: any, caps?: any, joints?: any, mitreLimit?: any, ignoreScale?: boolean): void;

  lineStyle(strokeWidth: number, strokeColor: string, alpha?: number): void;

  beginStroke(color: string): void;

  beginFill(color: string): void;

  endFill(): void;

  drawRect(x: number, y: number, width: number, height: number): void;

  on(event: string, f: (evt: any) => void): void;

  off(event: string, f: (evt: any) => void): void;

  bezierCurveTo(cx: number, cy: number, cx1: number, cy1: number, x1: number, y1: number): void;

  quadraticCurveTo(cx: number, cy: number, x1: number, y1: number): void;
}
