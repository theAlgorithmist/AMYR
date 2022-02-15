// Specs for sort functions
import { sortOn       } from '../sort-on';
import { countingSort } from '../counting-sort';
import {
  quickSelect,
  QuickSelectResult
} from '../quick-select';

export type PointLike = {x: number, y: number};

// Test Suites
describe('SortOn', () => {

  it('does nothing for empty input', function() {
    const data: Array<PointLike> = [];
    sortOn(data, ['']);

    expect(data.length).toBe(0);
  });

  it('does nothing for empty sort properties', function() {
    const data: Array<PointLike> = [
      {x: 10, y: -2},
      {x: 5, y: 0},
      {x: -1, y: 0},
      {x: 2, y: 3}
    ];

    sortOn(data, ['']);

    expect(data[0].x).toBe(10);
    expect(data[3].x).toBe(2);
  });

  it('sorts correctly on a single property #1', function() {
    const data: Array<PointLike> = [
      {x: 10, y: -2},
      {x: 5, y: 0},
      {x: -1, y: 0},
      {x: 2, y: 3},
      {x: 0, y: 10}
    ];

    sortOn(data, ['x']);

    expect(data[0].x).toBe(-1);
    expect(data[4].x).toBe(10);
  });

  it('sorts correctly on a single property #2', function() {
    const data: Array<PointLike> = [
      {x: 10, y: -2},
      {x: 5, y: 0},
      {x: -1, y: 0},
      {x: 2, y: 3},
      {x: 0, y: 10}
    ];

    sortOn(data, ['y']);

    expect(data[0].y).toBe(-2);
    expect(data[4].y).toBe(10);
  });

  it('sorts correctly on multiple properties', function() {
    const data: Array<PointLike> = [
      {x: 10, y: -2},
      {x: 5, y: 0},
      {x: -1, y: 0},
      {x: 2, y: 3},
      {x: 0, y: 10},
      {x: 1, y: 1},
      {x: 2, y: 0},
      {x: 1, y: 3}
    ];

    sortOn(data, ['x', 'y']);

    expect(data[0].x).toBe(-1);
    expect(data[0].y).toBe(0);

    expect(data[1].x).toBe(0);
    expect(data[1].y).toBe(10);

    expect(data[2].x).toBe(1);
    expect(data[2].y).toBe(1);

    expect(data[3].x).toBe(1);
    expect(data[3].y).toBe(3);

    expect(data[4].x).toBe(2);
    expect(data[4].y).toBe(0);

    expect(data[5].x).toBe(2);
    expect(data[5].y).toBe(3);

    expect(data[6].x).toBe(5);
    expect(data[6].y).toBe(0);

    expect(data[7].x).toBe(10);
    expect(data[7].y).toBe(-2);
  });

});

describe('Counting Sort', () => {

  const tmp: any = null;
  it('returns empty array for invalid input', () => {
    expect(countingSort(tmp).length).toBe(0);
  });

  it('returns empty array for empty input', () => {
    expect(countingSort([]).length).toBe(0);
  });

  it('returns singleton array for singleton input', () => {
    const result: Array<number> = countingSort([1]);

    expect(result.length).toBe(1);
    expect(result[0]).toBe(1);
  });

  it('2-element test #1', () => {
    const result: Array<number> = countingSort([1, 2]);

    expect(result.length).toBe(2);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
  });

  it('2-element test #2', () => {
    const result: Array<number> = countingSort([2, 1]);

    expect(result.length).toBe(2);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
  });

  it('2-element test #3 (higher upper bound)', () => {
    const result: Array<number> = countingSort([2, 1], 0, 5);

    expect(result.length).toBe(2);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
  });

  it('multi-element test #1', () => {
    const result: Array<number> = countingSort([2, 1, 0, 5, 10, 8, 7]);

    expect(result.length).toBe(7);
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(1);
    expect(result[2]).toBe(2);
    expect(result[3]).toBe(5);
    expect(result[4]).toBe(7);
    expect(result[5]).toBe(8);
    expect(result[6]).toBe(10);
  });

  it('multi-element test #2', () => {
    const result: Array<number> = countingSort([2, 1, 0, 5, 10, 8, 7], 0, 10);

    expect(result.length).toBe(7);
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(1);
    expect(result[2]).toBe(2);
    expect(result[3]).toBe(5);
    expect(result[4]).toBe(7);
    expect(result[5]).toBe(8);
    expect(result[6]).toBe(10);
  });

  it('multi-element test #3', () => {
    const result: Array<number> = countingSort([2, 1, 0, 5, 0, 10, 8, 1, 7, 0, 18]);

    expect(result.length).toBe(11);
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(0);
    expect(result[2]).toBe(0);
    expect(result[3]).toBe(1);
    expect(result[4]).toBe(1);
    expect(result[5]).toBe(2);
    expect(result[6]).toBe(5);
    expect(result[7]).toBe(7);
    expect(result[8]).toBe(8);
    expect(result[9]).toBe(10);
    expect(result[10]).toBe(18);
  });

  it('multi-element test #4', () => {
    const result: Array<number> = countingSort([2, 1, 0, 5, 0, 10, 8, 1, 7, 0, 18], 0, 50);

    expect(result.length).toBe(11);
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(0);
    expect(result[2]).toBe(0);
    expect(result[3]).toBe(1);
    expect(result[4]).toBe(1);
    expect(result[5]).toBe(2);
    expect(result[6]).toBe(5);
    expect(result[7]).toBe(7);
    expect(result[8]).toBe(8);
    expect(result[9]).toBe(10);
    expect(result[10]).toBe(18);
  });
});

describe('Quick Select', () => {

  const tmp: any = null;
  it('returns null for null input', () => {
    const result: QuickSelectResult | null = quickSelect(tmp, 2);

    expect(result).toBe(null);
  });
});

