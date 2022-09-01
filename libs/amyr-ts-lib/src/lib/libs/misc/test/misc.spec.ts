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
import { ClockTimeModel       } from "../models/clock-time-model";

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

describe('Clock Time Model', () => {

  const clock: ClockTimeModel = new ClockTimeModel();
  const AM                    = true;
  const PM                    = false;
  const IS_24_HOUR            = true;
  const NOT_24_HOUR           = false;

  it('properly constructs a new Clock Time model', () =>
  {
    expect(clock.value).toEqual(0);
    expect(clock.is24Hour).toBe(true);
    expect(clock.isAM).toBe(true);
  });

  it('is24Hour false, 3:45:02 AM', () =>
  {
    clock.is24Hour = NOT_24_HOUR;
    clock.update(3, 45, 2, AM);

    expect(clock.toString()).toEqual('3:45:02 AM');
  });

  it('is24Hour false, 12:35:52 AM', () =>
  {
    clock.is24Hour = NOT_24_HOUR;
    clock.update(12, 35, 52, AM);

    expect(clock.toString()).toEqual('12:35:52 AM');
  });

  it('is24Hour false, 12:08 PM', () =>
  {
    clock.is24Hour = NOT_24_HOUR;
    clock.update(12, 8, 0, PM);

    expect(clock.toString()).toEqual('12:08 PM');
  });

  it('is24Hour false, 13:35:52 PM -> 1:35:52 PM', () =>
  {
    clock.is24Hour = NOT_24_HOUR;
    clock.update(13, 35, 52, PM);

    expect(clock.toString()).toEqual('1:35:52 PM');
  });

  it('(24-hour format), 3:45:02', () =>
  {
    clock.is24Hour = IS_24_HOUR;
    clock.update(3, 45, 2);

    expect(clock.toString()).toEqual('03:45:02');
  });

  it('(24-hour format), 00:35:07', () =>
  {
    clock.is24Hour = IS_24_HOUR;
    clock.update(0, 35, 7);

    expect(clock.toString()).toEqual('00:35:07');
    expect(clock.value).toEqual(2107);
  });

  it('factory test #1', () =>
  {
    clock.is24Hour = NOT_24_HOUR;

    clock.update(11, 23, 0, AM);

    const clock2: ClockTimeModel = ClockTimeModel.factory(6, 52, 0, NOT_24_HOUR, PM);
    expect(clock.toString()).toEqual('11:23 AM');
    expect(clock2.toString()).toEqual('6:52 PM')

    expect(clock.getElapsedHours(clock2)).toEqual(7);
    expect(clock.getElapsedMinutes(clock2)).toEqual(29);
    expect(clock.getElapsedSeconds(clock2)).toEqual(0);
  });

  it('factory test #2', () =>
  {
    clock.is24Hour = NOT_24_HOUR;

    clock.update(10, 53, 0, AM);

    const clock2: ClockTimeModel = ClockTimeModel.factory(3, 57, 0, NOT_24_HOUR, PM);
    expect(clock.toString()).toEqual('10:53 AM');
    expect(clock2.toString()).toEqual('3:57 PM');

    expect(clock.getElapsedHours(clock2)).toEqual(5);
    expect(clock.getElapsedMinutes(clock2)).toEqual(4);
    expect(clock.getElapsedSeconds(clock2)).toEqual(0);
  });

  it('factory test #3', () =>
  {
    clock.is24Hour = NOT_24_HOUR;

    clock.update(10, 53, 0, AM);

    const clock2: ClockTimeModel = ClockTimeModel.factory(3, 33, 0, NOT_24_HOUR, PM);
    expect(clock.toString()).toEqual('10:53 AM');
    expect(clock2.toString()).toEqual('3:33 PM');

    expect(clock.getElapsedHours(clock2)).toEqual(4);
    expect(clock.getElapsedMinutes(clock2)).toEqual(40);
    expect(clock.getElapsedSeconds(clock2)).toEqual(0);
  });

  it('factory test #4', () =>
  {
    clock.is24Hour = NOT_24_HOUR;

    clock.update(12, 50, 0, AM);

    const clock2: ClockTimeModel = ClockTimeModel.factory(12, 34, 0, NOT_24_HOUR, PM);
    expect(clock.toString()).toEqual('12:50 AM');
    expect(clock2.toString()).toEqual('12:34 PM');

    expect(clock.getElapsedHours(clock2)).toEqual(11);
    expect(clock.getElapsedMinutes(clock2)).toEqual(44);
    expect(clock.getElapsedSeconds(clock2)).toEqual(0);
  });

  it('factory test #5', () =>
  {
    clock.is24Hour = NOT_24_HOUR;

    clock.update(3, 42, 0, PM);

    const clock2: ClockTimeModel = ClockTimeModel.factory(6, 18, 0, NOT_24_HOUR, AM);
    expect(clock.toString()).toEqual('3:42 PM');
    expect(clock2.toString()).toEqual('6:18 AM');

    expect(clock.getElapsedHours(clock2)).toEqual(14);
    expect(clock.getElapsedMinutes(clock2)).toEqual(36);
    expect(clock.getElapsedSeconds(clock2)).toEqual(0);
  });

  it('factory test #6', () =>
  {
    clock.is24Hour = NOT_24_HOUR;

    clock.update(12, 0, 0, PM);

    const clock2: ClockTimeModel = ClockTimeModel.factory(12, 0, 0, NOT_24_HOUR, PM);
    expect(clock.toString()).toEqual('12:00 PM');
    expect(clock2.toString()).toEqual('12:00 PM');

    expect(clock.getElapsedHours(clock2)).toEqual(0);
    expect(clock.getElapsedMinutes(clock2)).toEqual(0);
    expect(clock.getElapsedSeconds(clock2)).toEqual(0);
  });

  it('factory test #7', () =>
  {
    clock.is24Hour = NOT_24_HOUR;

    clock.update(12, 0, 0, PM);

    const clock2: ClockTimeModel = ClockTimeModel.factory(12, 0, 0, NOT_24_HOUR, AM);
    expect(clock.toString()).toEqual('12:00 PM');
    expect(clock2.toString()).toEqual('12:00 AM');

    expect(clock.getElapsedHours(clock2)).toEqual(12);
    expect(clock.getElapsedMinutes(clock2)).toEqual(0);
    expect(clock.getElapsedSeconds(clock2)).toEqual(0);
  });

  it('(24-hour) elapsed time #1', () =>
  {
    clock.is24Hour = IS_24_HOUR;

    clock.update(19, 17, 20);

    const clock2: ClockTimeModel = new ClockTimeModel();
    clock2.is24Hour                   = NOT_24_HOUR;

    clock2.update(22, 31, 0);

    expect(clock.toString()).toEqual('19:17:20');
    expect(clock2.toString()).toEqual('10:31 PM');

    expect(clock.getElapsedHours(clock2)).toEqual(3);
    expect(clock.getElapsedMinutes(clock2)).toEqual(13);
    expect(clock.getElapsedSeconds(clock2)).toEqual(40);
  });

  it('(24-hour) elapsed time #2', () =>
  {
    clock.is24Hour = IS_24_HOUR;

    clock.update(10, 20);

    const clock2: ClockTimeModel = new ClockTimeModel();
    clock2.is24Hour                   = NOT_24_HOUR;

    clock2.update(22, 4, 0);

    expect(clock.toString()).toEqual('10:20:00');
    expect(clock2.toString()).toEqual('10:04 PM');

    expect(clock.getElapsedHours(clock2)).toEqual(11);
    expect(clock.getElapsedMinutes(clock2)).toEqual(44);
    expect(clock.getElapsedSeconds(clock2)).toEqual(0);
  });

  it('addition test #1', () => {
    clock.is24Hour = NOT_24_HOUR;

    clock.update(10, 13, 0, AM);

    const clock2: ClockTimeModel = new ClockTimeModel();
    clock2.is24Hour = IS_24_HOUR;

    clock2.update(2, 11, 0);

    expect(clock.toString()).toEqual('10:13 AM');
    expect(clock2.toString()).toEqual('02:11:00');

    expect(clock.add(clock2).toString()).toEqual('12:24 PM');
  });


  it('addition test #2', () => {
    clock.is24Hour = IS_24_HOUR;

    clock.update(12, 53, 0);

    const clock2: ClockTimeModel = new ClockTimeModel();
    clock2.is24Hour = IS_24_HOUR;

    clock2.update(8, 22, 0);

    expect(clock.toString()).toEqual('12:53:00');
    expect(clock2.toString()).toEqual('08:22:00');

    expect(clock.add(clock2).toString()).toEqual('21:15:00');
  });

  it('addition test #3', () => {
    clock.is24Hour = NOT_24_HOUR;

    clock.update(10, 20, 0, PM);

    const clock2: ClockTimeModel = new ClockTimeModel();
    clock2.is24Hour = IS_24_HOUR;

    clock2.update(6, 18, 0);

    expect(clock.toString()).toEqual('10:20 PM');
    expect(clock2.toString()).toEqual('06:18:00');

    const clock3: ClockTimeModel = clock.add(clock2);
    clock3.is24Hour                   = NOT_24_HOUR;

    expect(clock3.toString()).toEqual('4:38 AM');
  });

  it('addition test #4', () => {
    clock.is24Hour = NOT_24_HOUR;

    clock.update(12, 31, 0, AM);

    const clock2: ClockTimeModel = new ClockTimeModel();
    clock2.is24Hour = IS_24_HOUR;

    clock2.update(1, 29, 0);

    expect(clock.toString()).toEqual('12:31 AM');
    expect(clock2.toString()).toEqual('01:29:00');

    const clock3: ClockTimeModel = clock.add(clock2);
    clock3.is24Hour                   = NOT_24_HOUR;

    expect(clock3.toString()).toEqual('2:00 AM');
  });

  it('addition test #5', () => {
    clock.is24Hour = IS_24_HOUR;

    clock.update(0, 31, 0);

    const clock2: ClockTimeModel = new ClockTimeModel();
    clock2.is24Hour = IS_24_HOUR;

    clock2.update(1, 29, 0);

    expect(clock.toString()).toEqual('00:31:00');
    expect(clock2.toString()).toEqual('01:29:00');

    const clock3: ClockTimeModel = clock.add(clock2);

    expect(clock3.toString()).toEqual('02:00:00');
  });

  it('subtraction test #1', () => {
    clock.is24Hour = NOT_24_HOUR;

    clock.update(6, 31, 0, AM);

    const clock2: ClockTimeModel = new ClockTimeModel();
    clock2.is24Hour = IS_24_HOUR;

    clock2.update(1, 18, 0);

    expect(clock.toString()).toEqual('6:31 AM');
    expect(clock2.toString()).toEqual('01:18:00');

    const clock3: ClockTimeModel = clock.subtract(clock2);
    clock3.is24Hour                   = IS_24_HOUR;

    expect(clock3.toString()).toEqual('05:13:00');
  });

  it('subtraction test #2', () => {
    clock.is24Hour = NOT_24_HOUR;

    clock.update(12, 45, 0, PM);

    const clock2: ClockTimeModel = new ClockTimeModel();
    clock2.is24Hour = NOT_24_HOUR;

    clock2.update(5, 51, 0, AM);

    expect(clock.toString()).toEqual('12:45 PM');
    expect(clock2.toString()).toEqual('5:51 AM');

    const clock3: ClockTimeModel = clock.subtract(clock2);
    clock3.is24Hour                   = IS_24_HOUR;

    expect(clock3.toString()).toEqual('06:54:00');
  });

  it('subtraction test #3', () => {
    clock.is24Hour = NOT_24_HOUR;

    clock.update(5, 51, 0, AM);

    const clock2: ClockTimeModel = new ClockTimeModel();
    clock2.is24Hour = IS_24_HOUR;

    clock2.update(8, 22, 0, AM);

    expect(clock.toString()).toEqual('5:51 AM');
    expect(clock2.toString()).toEqual('08:22:00');

    const clock3: ClockTimeModel = clock.subtract(clock2);
    clock3.is24Hour                   = IS_24_HOUR;

    expect(clock3.toString()).toEqual('21:29:00');
  });

  it('subtractFrom test', () => {
    clock.is24Hour = NOT_24_HOUR;

    clock.update(2, 45, 0, AM);

    const clock2: ClockTimeModel = new ClockTimeModel();
    clock2.is24Hour = IS_24_HOUR;

    clock2.update(1, 0, 0, AM);

    clock.subtractFrom(clock2);

    expect(clock.toString()).toEqual('1:45 AM');
  });


  it('addTo test', () => {
    clock.is24Hour = IS_24_HOUR;

    clock.update(0, 31, 0);

    const clock2: ClockTimeModel = new ClockTimeModel();
    clock2.is24Hour = IS_24_HOUR;

    clock2.update(1, 29, 0);

    expect(clock.toString()).toEqual('00:31:00');
    expect(clock2.toString()).toEqual('01:29:00');

    clock.addTo(clock2);

    expect(clock.toString()).toEqual('02:00:00');
  });

  it('clone test', () => {
    clock.is24Hour = IS_24_HOUR;

    clock.update(0, 31, 0);

    const clock2: ClockTimeModel = new ClockTimeModel();
    clock2.is24Hour = IS_24_HOUR;

    clock2.update(1, 29, 0);

    expect(clock.toString()).toEqual('00:31:00');
    expect(clock2.toString()).toEqual('01:29:00');

    clock.addTo(clock2);

    const clock3: ClockTimeModel = clock.clone();

    expect(clock3.toString()).toEqual('02:00:00');
    expect(clock3.is24Hour).toEqual(clock.is24Hour);
    expect(clock3.isAM).toEqual(clock.isAM);
    expect(clock3.value).toEqual(clock.value);
  });

  it('add seconds test', () =>
  {
    clock.is24Hour = NOT_24_HOUR;

    clock.update( 1, 20, 18, AM);
    clock.addSeconds(10);

    expect(clock.toString()).toEqual('1:20:28 AM')
  });
});



