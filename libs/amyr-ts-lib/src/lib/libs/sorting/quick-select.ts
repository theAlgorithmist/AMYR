/**
 * Straightforward implementation of the Quick Select algorithm to select the k-th smallest element of
 * a numeric array.  The index is also returned, which allows the input array to be a list of value metrics
 * from a more complex object.  This algorithm has very good average-case complexity, but poor worst-case
 * complexity.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
export interface QuickSelectResult
{
  k: number;
  value: number;
}

export const pivot = (values: Array<number>, low: number, high: number): number =>
{
  const pivotHigh: number = values[high];
  let pivotLow: number    = low;
  let i: number;
  let hold: number;

  for (i = low; i <= high; ++i)
  {
    if (values[i] < pivotHigh)
    {
      hold             = values[i];
      values[i]        = values[pivotLow];
      values[pivotLow] = hold;

      pivotLow++;
    }
  }

  hold             = values[high];
  values[high]     = values[pivotLow];
  values[pivotLow] = hold;

  return pivotLow;
};

export const kSmallest = (values: Array<number>, low: number, high: number, k: number): number | QuickSelectResult =>
{
  const pivotValue: number = pivot(values, low, high);

  if (pivotValue === k) {
    return {k: k, value: values[k]};
  }

  return pivotValue < k
    ? kSmallest(values, pivotValue + 1, high, k)
    : kSmallest(values, low, pivotValue - 1, k);
};

export const quickSelect = (values: Array<number>, k: number): QuickSelectResult | null =>
{
  if (values === undefined || values == null || !Array.isArray(values)) {
    return null;
  }

  // Outlier
  const n: number = values.length;
  if (n === 0) {
    return {k: 0, value: 0};
  }

  // Coercion will be correct on last pass
  return kSmallest(values, 0, n-1, k) as QuickSelectResult;
};
