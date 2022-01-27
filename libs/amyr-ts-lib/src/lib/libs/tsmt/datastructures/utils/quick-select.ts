/**
 * Copyright 2021 Jim Armstrong (www.algorithmist.net)
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
 * Typescript implementation of the Javascript quick-select, https://www.npmjs.com/package/quickselect
 *
 * @author Jim Armstrong
 *
 * @version 1.0
 */

export function quickSelect<T>(
  arr: Array<T>,
  k: number,
  left: number,
  right: number,
  compare: (a: T, b: T) => number): void
{
  while (right > left)
  {
    if (right - left > 600)
    {
      const n: number        = right - left + 1;
      const m: number        = k - left + 1;
      const z: number        = Math.log(n);
      const s: number        = 0.5 * Math.exp(2 * z / 3);
      const sd: number       = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
      const newLeft: number  = Math.max(left, Math.floor(k - m * s / n + sd));
      const newRight: number = Math.min(right, Math.floor(k + (n - m) * s / n + sd));

      quickSelect(arr, k, newLeft, newRight, compare);
    }

    const t: T    = arr[k];
    let i: number = left;
    let j: number = right;

    swap(arr, left, k);

    if (compare(arr[right], t) > 0) {
      swap(arr, left, right);
    }

    while (i < j)
    {
      swap(arr, i, j);
      i++;
      j--;

      while (compare(arr[i], t) < 0) {
        i++;
      }

      while (compare(arr[j], t) > 0) {
        j--;
      }
    }

    if (compare(arr[left], t) === 0)
    {
      swap(arr, left, j);
    }
    else
    {
      j++;
      swap(arr, j, right);
    }

    if (j <= k) {
      left = j + 1;
    }

    if (k <= j) {
      right = j - 1;
    }
  }
}

function swap<T>(arr: Array<T>, i: number, j: number): void
{
  const tmp: T = arr[i];

  arr[i] = arr[j];
  arr[j] = tmp;
}