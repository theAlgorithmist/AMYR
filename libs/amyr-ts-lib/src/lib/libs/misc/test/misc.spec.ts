/**
 * Copyright 2016 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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

import { TimeSeriesModel } from "../../../models/time-series";

import { stringEnumerable     } from "../ordered-permutations";
import { orderedPermutations  } from "../ordered-permutations";
import { uuid                 } from "../uuid";
import { intervalsBetweenDays } from "../interval-between-days";
import { DayIterator          } from "../day-iterator";
import { DAY_OF_WEEK          } from "../../../models/day-and-time";
import { dayHourOffset        } from "../day-hour-offset";
import { iterativeMean        } from "../iterative-mean";
import { missingStep          } from "../missing-step";
import { maxDelta             } from "../max-delta";

export function __generateTimeSeries(start: string, intervals: number): TimeSeriesModel {
  let newDate: Date = new Date(start);

  const dates: Date[]    = new Array<Date>();
  const values: number[] = new Array<number>();
  const inc              = 1000 * 3600;

  let i: number;
  for (i = 0; i < intervals; ++i) {
    dates.push(newDate);
    values.push(i);

    newDate = new Date(newDate.getTime() + inc);
  }

  return {
    dates,
    values,
  };
}

describe('Ordered Permutations', () => {

  const tmp: any = null;

  it('returns empty array for empty input', () => {
    const result: Array<Array<object>> = orderedPermutations([], 'width');
    expect(result.length).toBe(0);
  });

  it('returns empty array for bad Object property #1', () => {
    const result: Array<Array<object>> = orderedPermutations([], tmp);
    expect(result.length).toBe(0);
  });

  it('returns empty array for bad Object property #2', () => {
    const result: Array<Array<object>> = orderedPermutations([], '');
    expect(result.length).toBe(0);
  });

  it('returns empty array for non-existing Object property', () => {
    const values: Array<stringEnumerable> = [
      {width: 24, index: 0},
      {width: 18, index: 1},
      {width: 18, index: 2}
    ];

    const result: Array<Array<stringEnumerable>> = orderedPermutations(values, 'letter');

    expect(result).toBeTruthy();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toEqual(0);
  });

  it('works with a singleton input', () => {
    const values: Array<stringEnumerable> = [
      {letter: 'b', value: 1}
    ];

    const result: Array<Array<stringEnumerable>> = orderedPermutations(values, 'letter');

    expect(result.length).toBe(1);

    const row: Array<stringEnumerable> = result[0];
    expect(row.length).toBe(1);
    expect( row[0]['letter']).toBe('b');
  });

  it('permutation test #1', () => {
    const values: Array<stringEnumerable> = [
      {letter: 'b', value: 1},
      {letter: 'c', value: 2},
      {letter: 'a', value: 0}
    ];

    const result: Array<Array<stringEnumerable>> = orderedPermutations(values, 'letter');

    expect(result.length).toBe(6);

    let row: Array<stringEnumerable> = result[0];

    expect(row[0]['letter']).toBe('a');
    expect(row[1]['letter']).toBe('b');
    expect(row[2]['letter']).toBe('c');

    row = result[1];
    expect(row[0]['letter']).toBe('a');
    expect(row[1]['letter']).toBe('c');
    expect(row[2]['letter']).toBe('b');

    row = result[2];
    expect(row[0]['letter']).toBe('b');
    expect(row[1]['letter']).toBe('a');
    expect(row[2]['letter']).toBe('c');

    row = result[3];
    expect(row[0]['letter']).toBe('b');
    expect(row[1]['letter']).toBe('c');
    expect(row[2]['letter']).toBe('a');

    row = result[4];
    expect(row[0]['letter']).toBe('c');
    expect(row[1]['letter']).toBe('a');
    expect(row[2]['letter']).toBe('b');

    row = result[5];
    expect(row[0]['letter']).toBe('c');
    expect(row[1]['letter']).toBe('b');
    expect(row[2]['letter']).toBe('a');
  });

  it('permutation test #2', () => {
    const values: Array<stringEnumerable> = [
      {width: 24, index: 0},
      {width: 18, index: 1},
      {width: 18, index: 2}
    ];

    const result: Array<Array<stringEnumerable>> = orderedPermutations(values, 'width');

    expect(result.length).toBe(3);

    let row: Array<stringEnumerable> = result[0];
    expect(row[0]['width']).toBe(18);
    expect(row[1]['width']).toBe(18);
    expect(row[2]['width']).toBe(24);

    row = result[1];
    expect(row[0]['width']).toBe(18);
    expect(row[1]['width']).toBe(24);
    expect(row[2]['width']).toBe(18);

    row = result[2];
    expect(row[0]['width']).toBe(24);
    expect(row[1]['width']).toBe(18);
    expect(row[2]['width']).toBe(18);
  });

  it('permutation test #3', () => {
    const values: Array<stringEnumerable> = [
      {width: 24, index: 0},
      {width: 24, index: 1},
      {width: 18, index: 2}
    ];

    const result: Array<Array<stringEnumerable>> = orderedPermutations(values, 'width');

    expect(result.length).toBe(3);

    let row: Array<stringEnumerable> = result[0];
    expect(row[0]['width']).toBe(18);
    expect(row[1]['width']).toBe(24);
    expect(row[2]['width']).toBe(24);

    row = result[1];
    expect(row[0]['width']).toBe(24);
    expect(row[1]['width']).toBe(18);
    expect(row[2]['width']).toBe(24);

    row = result[2];
    expect(row[0]['width']).toBe(24);
    expect(row[1]['width']).toBe(24);
    expect(row[2]['width']).toBe(18);
  });
});

describe('UUID', () => {

  it('returns non-null result', () => {
    const result: string = uuid();
    expect(result).not.toEqual('');
    expect(result.length).toBeGreaterThan(0);
  });

  it('result has correct general structure', () => {
    const result: string = uuid();

    let count = 0;
    let i: number;
    for (i = 0; i < result.length; ++i)
    {
      if (result.charAt(i) === '-') {
        count ++;
      }
    }

    expect(count).toBe(4);
  });

  it('low probability of collision', () => {
    const uid1: string = uuid();
    const uid2: string = uuid();

    expect(uid1).not.toEqual(uid2);

    console.log(uid1);
    console.log(uid2);
  });

});

describe('Intervals between days of week', () => {

  const tmp: any = null;

  it('returns 0 for undefined input', function() {
    expect(intervalsBetweenDays(tmp, 0)).toBe(0);
    expect(intervalsBetweenDays(1, tmp)).toBe(0);
  });

  it('returns 0 for out-of-range inputs', function() {
    expect(intervalsBetweenDays(-1, 0)).toBe(0);
    expect(intervalsBetweenDays(4, 8)).toBe(0);
  });

  it('returns 0 for coincident days', function() {
    expect(intervalsBetweenDays(1, 1)).toBe(0);
    expect(intervalsBetweenDays(5, 5)).toBe(0);
  });

  it('forward test #1', function() {
    expect(intervalsBetweenDays(0, 1)).toBe(24);
    expect(intervalsBetweenDays(0, 2)).toBe(48);
    expect(intervalsBetweenDays(0, 3)).toBe(72);
    expect(intervalsBetweenDays(0, 4)).toBe(96);
    expect(intervalsBetweenDays(0, 5)).toBe(120);
    expect(intervalsBetweenDays(0, 6)).toBe(144);
  });

  it('forward test #2', function() {
    expect(intervalsBetweenDays(1, 2)).toBe(24);
    expect(intervalsBetweenDays(1, 3)).toBe(48);
    expect(intervalsBetweenDays(1, 4)).toBe(72);
    expect(intervalsBetweenDays(1, 5)).toBe(96);
    expect(intervalsBetweenDays(1, 6)).toBe(120);
  });

  it('forward test #3', function() {
    expect(intervalsBetweenDays(2, 3)).toBe(24);
    expect(intervalsBetweenDays(2, 4)).toBe(48);
    expect(intervalsBetweenDays(2, 5)).toBe(72);
    expect(intervalsBetweenDays(2, 6)).toBe(96);
  });

  it('forward test #4', function() {
    expect(intervalsBetweenDays(3, 4)).toBe(24);
    expect(intervalsBetweenDays(3, 5)).toBe(48);
    expect(intervalsBetweenDays(3, 6)).toBe(72);
  });

  it('forward test #5', function() {
    expect(intervalsBetweenDays(4, 5)).toBe(24);
    expect(intervalsBetweenDays(4, 6)).toBe(48);
  });

  it('forward test #6', function() {
    expect(intervalsBetweenDays(5, 6)).toBe(24);
  });

  it('circular test #1', function() {
    expect(intervalsBetweenDays(6, 0)).toBe(24);
    expect(intervalsBetweenDays(6, 1)).toBe(48);
    expect(intervalsBetweenDays(6, 2)).toBe(72);
    expect(intervalsBetweenDays(6, 3)).toBe(96);
    expect(intervalsBetweenDays(6, 4)).toBe(120);
    expect(intervalsBetweenDays(6, 5)).toBe(144);
  });

  it('circular test #2', function() {
    expect(intervalsBetweenDays(5, 0)).toBe(48);
    expect(intervalsBetweenDays(5, 1)).toBe(72);
    expect(intervalsBetweenDays(5, 2)).toBe(96);
    expect(intervalsBetweenDays(5, 3)).toBe(120);
    expect(intervalsBetweenDays(5, 4)).toBe(144);
  });

  it('circular test #3', function() {
    expect(intervalsBetweenDays(4, 0)).toBe(72);
    expect(intervalsBetweenDays(4, 1)).toBe(96);
    expect(intervalsBetweenDays(4, 2)).toBe(120);
    expect(intervalsBetweenDays(4, 3)).toBe(144);
  });

  it('circular test #4', function() {
    expect(intervalsBetweenDays(3, 0)).toBe(96);
    expect(intervalsBetweenDays(3, 1)).toBe(120);
    expect(intervalsBetweenDays(3, 2)).toBe(144);
  });

  it('circular test #5', function() {
    expect(intervalsBetweenDays(2, 0)).toBe(120);
    expect(intervalsBetweenDays(2, 1)).toBe(144);
  });

  it('circular test #6', function() {
    expect(intervalsBetweenDays(1, 0)).toBe(144);
  });

  it('backward test #1', function() {
    expect(intervalsBetweenDays(0, 6, false)).toBe(24);
    expect(intervalsBetweenDays(0, 5, false)).toBe(48);
    expect(intervalsBetweenDays(0, 4, false)).toBe(72);
    expect(intervalsBetweenDays(0, 3, false)).toBe(96);
    expect(intervalsBetweenDays(0, 2, false)).toBe(120);
    expect(intervalsBetweenDays(0, 1, false)).toBe(144);
  });

  it('backward test #2', function() {
    expect(intervalsBetweenDays(1, 0, false)).toBe(24);
    expect(intervalsBetweenDays(1, 6, false)).toBe(48);
    expect(intervalsBetweenDays(1, 5, false)).toBe(72);
    expect(intervalsBetweenDays(1, 4, false)).toBe(96);
    expect(intervalsBetweenDays(1, 3, false)).toBe(120);
  });

  it('backward test #3', function() {
    expect(intervalsBetweenDays(2, 1, false)).toBe(24);
    expect(intervalsBetweenDays(2, 0, false)).toBe(48);
    expect(intervalsBetweenDays(2, 6, false)).toBe(72);
    expect(intervalsBetweenDays(2, 5, false)).toBe(96);
  });

  it('backward test #4', function() {
    expect(intervalsBetweenDays(3, 2, false)).toBe(24);
    expect(intervalsBetweenDays(3, 1, false)).toBe(48);
    expect(intervalsBetweenDays(3, 0, false)).toBe(72);
  });

  it('backward test #5', function() {
    expect(intervalsBetweenDays(4, 3, false)).toBe(24);
    expect(intervalsBetweenDays(4, 2, false)).toBe(48);
  });

  it('backward test #6', function() {
    expect(intervalsBetweenDays(5, 4, false)).toBe(24);
    expect(intervalsBetweenDays(6, 5, false)).toBe(24);
  });
});

describe('Day Iterator', () => {

  it('does not accept invalid day', function() {
    DayIterator.day = -1;
    expect(DayIterator.day).toBe(DAY_OF_WEEK.NONE);

    DayIterator.day = 7;
    expect(DayIterator.day).toBe(DAY_OF_WEEK.NONE);
  });

  it('rounds in case of fractional day', function() {
    DayIterator.day = 1.6;
    expect(DayIterator.day).toBe(DAY_OF_WEEK.TUESDAY);

    DayIterator.day = 3.4;
    expect(DayIterator.day).toBe(DAY_OF_WEEK.WEDNESDAY);
  });

  it('forward increment works', function() {
    DayIterator.day = DAY_OF_WEEK.SUNDAY;
    expect(DayIterator.next()).toBe(DAY_OF_WEEK.MONDAY);
    expect(DayIterator.next()).toBe(DAY_OF_WEEK.TUESDAY);
    expect(DayIterator.next()).toBe(DAY_OF_WEEK.WEDNESDAY);
    expect(DayIterator.next()).toBe(DAY_OF_WEEK.THURSDAY);
    expect(DayIterator.next()).toBe(DAY_OF_WEEK.FRIDAY);
    expect(DayIterator.next()).toBe(DAY_OF_WEEK.SATURDAY);
    expect(DayIterator.next()).toBe(DAY_OF_WEEK.SUNDAY);
    expect(DayIterator.next()).toBe(DAY_OF_WEEK.MONDAY);
  });

  it('backward increment works', function() {
    DayIterator.day = DAY_OF_WEEK.SATURDAY;
    expect(DayIterator.prev()).toBe(DAY_OF_WEEK.FRIDAY);
    expect(DayIterator.prev()).toBe(DAY_OF_WEEK.THURSDAY);
    expect(DayIterator.prev()).toBe(DAY_OF_WEEK.WEDNESDAY);
    expect(DayIterator.prev()).toBe(DAY_OF_WEEK.TUESDAY);
    expect(DayIterator.prev()).toBe(DAY_OF_WEEK.MONDAY);
    expect(DayIterator.prev()).toBe(DAY_OF_WEEK.SUNDAY);
    expect(DayIterator.prev()).toBe(DAY_OF_WEEK.SATURDAY);
    expect(DayIterator.prev()).toBe(DAY_OF_WEEK.FRIDAY);
  });

  it('toString works', function() {
    DayIterator.day = DAY_OF_WEEK.SUNDAY;
    expect(DayIterator.toString()).toBe('SU');

    DayIterator.day = DAY_OF_WEEK.MONDAY;
    expect(DayIterator.toString()).toBe('M');

    DayIterator.day = DAY_OF_WEEK.TUESDAY;
    expect(DayIterator.toString()).toBe('TU');

    DayIterator.day = DAY_OF_WEEK.WEDNESDAY;
    expect(DayIterator.toString()).toBe('W');

    DayIterator.day = DAY_OF_WEEK.THURSDAY;
    expect(DayIterator.toString()).toBe('TH');

    DayIterator.day = DAY_OF_WEEK.FRIDAY;
    expect(DayIterator.toString()).toBe('F');

    DayIterator.day = DAY_OF_WEEK.SATURDAY;
    expect(DayIterator.toString()).toBe('SA');
  });

  it('format works', function() {
    expect(DayIterator.format(DAY_OF_WEEK.SUNDAY)).toBe('SU');
    expect(DayIterator.format(DAY_OF_WEEK.MONDAY)).toBe('M');
    expect(DayIterator.format(DAY_OF_WEEK.TUESDAY)).toBe('TU');
    expect(DayIterator.format(DAY_OF_WEEK.WEDNESDAY)).toBe('W');
    expect(DayIterator.format(DAY_OF_WEEK.THURSDAY)).toBe('TH');
    expect(DayIterator.format(DAY_OF_WEEK.FRIDAY)).toBe('F');
    expect(DayIterator.format(DAY_OF_WEEK.SATURDAY)).toBe('SA');
  });
});

describe('Day at end of stream', () => {
  // one-day series
  const oneDay: TimeSeriesModel = __generateTimeSeries('2018-08-01 00:00:00 GMT+0', 24);
  let dayStart: number;
  let dayEnd: number;

  const twoDay: TimeSeriesModel = __generateTimeSeries('2018-08-01 00:00:00 GMT+0', 48);

  it('test #1', function() {
    dayStart = dayHourOffset(oneDay.dates[0], true).dayOfWeek;
    dayEnd   = dayHourOffset(oneDay.dates[23], true).dayOfWeek;

    expect(dayStart).toBe(DAY_OF_WEEK.WEDNESDAY);
    expect(dayEnd).toBe(DAY_OF_WEEK.WEDNESDAY);
  });

  it('test #2', function() {
    dayStart = dayHourOffset(twoDay.dates[0], true).dayOfWeek;
    dayEnd   = dayHourOffset(twoDay.dates[47], true).dayOfWeek;

    expect(dayStart).toBe(DAY_OF_WEEK.WEDNESDAY);
    expect(dayEnd).toBe(DAY_OF_WEEK.THURSDAY);
  });
});

describe('Iterative Mean', () => {

  const tmp: any = undefined;
  it('returns zero for undefined input', function() {
    const result: number = iterativeMean(tmp);

    expect(result).toEqual(0);
  });

  it('returns zero for empty input', function() {
    const result: number = iterativeMean([]);

    expect(result).toEqual(0);
  });

  it('returns correct result for a singleton', function() {
    const result: number = iterativeMean([1]);

    expect(result).toEqual(1);
  });

  it('returns correct result two numbers', function() {
    const result: number = iterativeMean([1, 3]);

    expect(result).toEqual(2);
  });

  it('correct mean test #1', function() {
    const result: number = iterativeMean([89,  73,  84,  91,  87,  77,  94]);

    expect(result).toEqual(85);
  });

  it('correct mean test #2', function() {
    const result: number = iterativeMean([2500, 2700, 2400, 2300, 2550, 2650, 2750, 2450, 2600, 2400]);

    expect(result).toEqual(2530);
  });
});

describe('Missing Step Number', () => {

  const tmp: any  = undefined;
  const tmp1: any = null;
  it('returns zero for undefined input', function() {
    const result: number = missingStep(3, tmp);

    expect(result).toEqual(0);
  });

  it('returns zero for null input', function() {
    const result: number = missingStep(2, tmp1);

    expect(result).toEqual(0);
  });

  it('returns zero for empty input', function() {
    const result: number = missingStep(10,[]);

    expect(result).toEqual(0);
  });

  it('returns one for incorrect singleton input', function() {
    const result: number = missingStep(1,[3]);

    expect(result).toEqual(1);
  });

  it('returns zero for data mismatch', function() {
    const result: number = missingStep(3,[1]);

    expect(result).toEqual(0);
  });

  it('returns correct result for n = 2 (#1)', function() {
    const result: number = missingStep(2,[2]);

    expect(result).toEqual(1);
  });

  it('returns correct result for n = 2 (#2)', function() {
    const result: number = missingStep(2,[1]);

    expect(result).toEqual(2);
  });

  it('general test #1', function() {
    const result: number = missingStep(5,[1, 3, 2, 5]);

    expect(result).toEqual(4);
  });

  it('general test #2', function() {
    const result: number = missingStep(6,[6, 5, 3, 2, 4]);

    expect(result).toEqual(1);
  });
});

describe('Max Delta', () => {

  it('returns zero for empty array', function() {
    const result: number = maxDelta([]);

    expect(result).toEqual(0);
  });

  it('returns zero for singleton array', function() {
    const result: number = maxDelta([1]);

    expect(result).toEqual(0);
  });

  it('returns correct max delta #1', () => {
    const delta: number = maxDelta( [1, 2] );
    expect(delta).toEqual(1);
  });

  it('returns correct max delta #2', () => {
    const delta: number = maxDelta( [3, 3] );
    expect(delta).toEqual(0);
  });

  it('returns correct max delta #3', () => {
    const delta: number = maxDelta( [10, 12, 5, 8, 10, 7, 6, 8, 11, 7] );
    expect(delta).toEqual(6);
  });

  it('returns correct max delta #4', () => {
    const delta: number = maxDelta( [5, 11, 5, 8, 10, 7, 6, 8, 10, 12] );
    expect(delta).toEqual(7);
  });

  it('returns correct max delta #5', () => {
    const delta: number = maxDelta( [12, 11, 5, 8, 10, 7, 6, 8, 10, 5] );
    expect(delta).toEqual(5);
  });

  it('returns correct max delta #6', () => {
    const delta: number = maxDelta( [12, 11, 5, 8, 10, 7, 6, 4, 8, 7, 10, 5, 5, 6, 4, 4] );
    expect(delta).toEqual(6);
  });

  // edge case - values decline monotonically throughout the session - should return minimum loss (negative number)
  it('returns correct max delta #7', () => {
    const delta: number = maxDelta( [100, 98, 96, 94, 93, 90, 87, 85, 80, 75, 70, 60, 50, 45, 40, 37, 35, 30, 26] );
    expect(delta).toEqual(-1);
  });

});


