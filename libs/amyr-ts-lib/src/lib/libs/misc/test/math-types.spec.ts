/**
 * Copyright 2022 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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

import { FractionType    } from "../../../models/math/fraction-type";
import { FractionModel   } from "../models/fraction-model";
import { UnknownPartEnum } from "../../../models/math/unknown-part-enum";

describe('Fraction Type', () => {

  const tmp: any = null;

  it('properly constructs a fraction model', () => {
    const frac: FractionModel = new FractionModel();

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(0);
    expect(frac.denominator).toEqual(1);

    expect(frac.isUnknown).toBe(false);
    expect(frac.reduced).toBe(false);
    expect(frac.unknownPart).toEqual(UnknownPartEnum.NONE);
  });

  it('properly accepts individual fraction inputs', () => {
    const frac: FractionModel = new FractionModel();

    frac.setFraction(1, 2, 3);

    expect(frac.whole).toEqual(1);
    expect(frac.numerator).toEqual(2);
    expect(frac.denominator).toEqual(3);
  });

  it('properly compensates for incorrect fraction inputs', () => {
    const frac: FractionModel = new FractionModel();

    frac.setFraction(1.1, 2.6, 3.35);

    expect(frac.whole).toEqual(1);
    expect(frac.numerator).toEqual(3);
    expect(frac.denominator).toEqual(3);
  });

  it('properly compensates for incorrect fraction inputs #2', () => {
    const frac: FractionModel = new FractionModel();

    const tmp1: any = null;
    const tmp2: any = 'a';
    const tmp3: any = undefined;

    frac.setFraction(tmp1, tmp2, tmp3);

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(0);
    expect(frac.denominator).toEqual(1);
  });

  it('properly compensates for incorrect fraction inputs #3', () => {
    const frac: FractionModel = new FractionModel();

    const tmp1: any = null;
    const tmp2: any = 'a';
    const tmp3: any = undefined;

    frac.numerator   = tmp1;
    frac.denominator = tmp2;
    frac.whole       = tmp3;

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(0);
    expect(frac.denominator).toEqual(1);
  });

  it('properly accepts individual fraction inputs with reduction', () => {
    const frac: FractionModel = new FractionModel();
    frac.reduced              = true;

    frac.setFraction(0, 3, 6);

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(2);
  });

  it('properly accepts individual fraction inputs with reduction #2', () => {
    const frac: FractionModel = new FractionModel();
    frac.reduced              = true;

    frac.whole       = 0;
    frac.numerator   = 3;
    frac.denominator = 6;

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(2);
  });

  it('computed numerator works correctly', () => {
    const frac: FractionModel = new FractionModel();
    frac.reduced              = true;

    expect(frac.computedNumerator).toEqual(0);

    frac.whole       = 1;
    frac.numerator   = 3;
    frac.denominator = 6;

    expect(frac.computedNumerator).toEqual(3);
  });

  it('returns correct value', () => {
    const frac: FractionModel = new FractionModel();
    frac.reduced              = true;

    expect(frac.computedNumerator).toEqual(0);

    frac.whole       = 1;
    frac.numerator   = 3;
    frac.denominator = 6;

    expect(frac.value).toEqual(1.5);
  });

  it('properly handles negative inputs', () => {
    const frac: FractionModel = new FractionModel();

    frac.numerator   = -3;
    frac.denominator = 6;

    expect(frac.numerator).toEqual(-3);
    expect(frac.denominator).toEqual(6);

    frac.numerator   = 3;
    frac.denominator = -6;

    expect(frac.numerator).toEqual(-3);
    expect(frac.denominator).toEqual(6);
  });

  it('properly handles switching to mixed number and clearing', () => {
    const frac: FractionModel = new FractionModel();

    frac.numerator   = 5;
    frac.denominator = 3;

    frac.mixed = true;

    expect(frac.whole).toEqual(1)
    expect(frac.numerator).toEqual(2);
    expect(frac.denominator).toEqual(3);

    frac.clear();
    frac.numerator   = 5;
    frac.denominator = -3;

    frac.mixed = true;

    expect(frac.whole).toEqual(-1)
    expect(frac.numerator).toEqual(2);
    expect(frac.denominator).toEqual(3);
  });

  it('properly handles mixed to non-mixed', () => {
    const frac: FractionModel = new FractionModel();

    frac.mixed = true;

    frac.setFraction(0, 5,3);

    expect(frac.whole).toEqual(1);
    expect(frac.numerator).toEqual(2);
    expect(frac.denominator).toEqual(3);

    frac.mixed = false;

    expect(frac.whole).toEqual(0)
    expect(frac.numerator).toEqual(5);
    expect(frac.denominator).toEqual(3);
  });

  it('properly clones a fraction', () => {
    const frac: FractionModel = new FractionModel();

    frac.mixed = true;

    frac.setFraction(0, 5,3);

    expect(frac.whole).toEqual(1);
    expect(frac.numerator).toEqual(2);
    expect(frac.denominator).toEqual(3);

    const frac2: FractionModel = frac.clone() as FractionModel;

    frac2.mixed = false;
    frac.clear();

    expect(frac2.whole).toEqual(0)
    expect(frac2.numerator).toEqual(5);
    expect(frac2.denominator).toEqual(3);

    expect(frac.whole).toEqual(0)
    expect(frac.numerator).toEqual(0);
    expect(frac.denominator).toEqual(1);
    expect(frac.mixed).toBe(false);
  });

  it('reduction works without altering reduced property', () => {
    const frac: FractionModel = new FractionModel();

    frac.setFraction(0, 3,6);

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(3);
    expect(frac.denominator).toEqual(6);

    frac.reduce();

    expect(frac.whole).toEqual(0)
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(2);

    frac.setFraction(0, 3, 12)
    expect(frac.whole).toEqual(0)
    expect(frac.numerator).toEqual(3);
    expect(frac.denominator).toEqual(12);
    expect(frac.reduced).toBe(false);
  });

  it('assigns a fraction from a number', () => {
    const frac: FractionModel = new FractionModel();

    frac.value = 0.5;

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(5);
    expect(frac.denominator).toEqual(10);

    frac.value = 2.0;

    expect(frac.whole).toEqual(2);
    expect(frac.numerator).toEqual(0);
    expect(frac.denominator).toEqual(1);

    frac.value   = 1.25;
    frac.reduced = true;

    expect(frac.whole).toEqual(1);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(4);
  });

  it('assigns a fraction from a number represented as a string', () => {
    const frac: FractionModel = new FractionModel();

    frac.value   = "0.5";
    frac.reduced = true;

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(2);
  });

  it('assigns a fraction from a natural string representation (invalid inputs)', () => {
    const frac: FractionModel = new FractionModel();

    frac.value = "";
    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(0);
    expect(frac.denominator).toEqual(1);

    frac.value = ' ';
    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(0);
    expect(frac.denominator).toEqual(1);

    frac.value = 'a';
    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(0);
    expect(frac.denominator).toEqual(1);

    frac.value = '/';
    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(0);
    expect(frac.denominator).toEqual(1);

    frac.value = '.';
    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(0);
    expect(frac.denominator).toEqual(1);
  });

  it('assigns a fraction from a natural string representation', () => {
    const frac: FractionModel = new FractionModel();

    frac.value = "1/2";

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(2);

    frac.value = "  1/2  "

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(2);
    expect(frac.mixed).toBe(false);

    frac.value = "  1 /2  ";

    // this is from coercing the space to a zero - may change this allowance in the future
    expect(frac.whole).toEqual(1);
    expect(frac.numerator).toEqual(0);
    expect(frac.denominator).toEqual(2);

    frac.value = "  1/ 2  "

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(2);

    frac.value = " 1  7/ 8   ";
    expect(frac.whole).toEqual(1);
    expect(frac.numerator).toEqual(7);
    expect(frac.denominator).toEqual(8);
    expect(frac.mixed).toBe(true);
  });

  it('LCD tests', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 1, 6);

    let lcd: number = frac2.leastCommonDenominator(frac);
    expect(lcd).toEqual(6);

    lcd = frac.leastCommonDenominator(frac2);
    expect(lcd).toEqual(6);

    frac.setFraction(0,3,8);
    frac2.setFraction(0,5,12);
    lcd = frac.leastCommonDenominator(frac2);

    expect(lcd).toEqual(24);
  });

  it('toString() works correctly', () =>
  {
    let frac: FractionModel = new FractionModel();
    expect(frac.toString()).toEqual("0");

    frac.setFraction(0, 2, 1);
    expect(frac.toString()).toEqual('2');

    frac = new FractionModel();
    frac.setFraction(0, 1, 3);

    expect(frac.toString()).toEqual("1/3");

    frac.setFraction(2, 1, 8);
    expect(frac.toString()).toEqual("2 1/8");
  });

  it('Fraction types add correctly', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 1, 6);

    const result: FractionType = frac.add(frac2) as FractionType;

    expect(result.numerator).toEqual(3);
    expect(result.denominator).toEqual(6);
  });

  it('Fraction types add correctly into reduced result', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 1, 6);

    const result: FractionType = frac.add(frac2) as FractionType;
    result.reduced             = true;

    expect(result.numerator).toEqual(1);
    expect(result.denominator).toEqual(2);
  });

  it('Fraction types add correctly #2', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 1, 5);

    const result: FractionType = frac.add(frac2) as FractionType;

    expect(result.numerator).toEqual(8);
    expect(result.denominator).toEqual(15);
  });

  it('mixed numbers add correctly', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(3, 1, 2);

    const result: FractionType = frac.add(frac2) as FractionType;

    expect(result.whole).toEqual(6);
    expect(result.numerator).toEqual(1);
    expect(result.denominator).toEqual(4);
  });

  it('string adds to fraction', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    const result: FractionType = frac.add("1/2") as FractionType;

    expect(result.whole).toEqual(3);
    expect(result.numerator).toEqual(1);
    expect(result.denominator).toEqual(4);
  });

  it('number adds to fraction', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    const result: FractionType = frac.add(0.5) as FractionType;
    result.reduced             = true;

    expect(result.whole).toEqual(3);
    expect(result.numerator).toEqual(1);
    expect(result.denominator).toEqual(4);
  });

  it('Fraction types subtract correctly', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 2, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 1, 3);

    const result: FractionType = frac.subtract(frac2) as FractionType;

    expect(result.numerator).toEqual(1);
    expect(result.denominator).toEqual(3);
  });

  it('Fraction types subtract correctly #2', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, -2, 3);

    const result: FractionType = frac.subtract(frac2) as FractionType;

    expect(result.numerator).toEqual(3);
    expect(result.denominator).toEqual(3);
  });

  it('Fraction types subtract correctly #3', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 2, 3);

    const result: FractionType = frac.subtract(frac2) as FractionType;

    expect(result.whole).toEqual(0);
    expect(result.numerator).toEqual(-1);
    expect(result.denominator).toEqual(3);
  });

  it('Fraction types subtract correctly #3', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 11, 6);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 22, 12);

    const result: FractionType = frac.subtract(frac2) as FractionType;

    expect(result.whole).toEqual(0);
    expect(result.numerator).toEqual(0);
    expect(result.denominator).toEqual(12);
    expect(result.value).toEqual(0);
  });

  it('mixed numbers subtract correctly', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(1, 1, 4);

    const result: FractionType = frac.subtract(frac2) as FractionType;
    result.reduced             = true;

    expect(result.whole).toEqual(1);
    expect(result.numerator).toEqual(1);
    expect(result.denominator).toEqual(2);
  });

  it('mixed numbers subtract correctly #2', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(3, 1, 2);

    const result: FractionType = frac.subtract(frac2) as FractionType;

    expect(result.whole).toEqual(0);
    expect(result.numerator).toEqual(-3);
    expect(result.denominator).toEqual(4);
  });

  it('string subtracts from fraction', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    const result: FractionType = frac.subtract("1/2") as FractionType;

    expect(result.whole).toEqual(2);
    expect(result.numerator).toEqual(1);
    expect(result.denominator).toEqual(4);
  });

  it('number subtracts from fraction', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    const result: FractionType = frac.subtract(0.5) as FractionType;
    result.reduced             = true;

    expect(result.whole).toEqual(2);
    expect(result.numerator).toEqual(1);
    expect(result.denominator).toEqual(4);
  });

  it('Fraction types multiply correctly', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 3, 2);

    const result: FractionType = frac.multiply(frac2) as FractionType;

    expect(result.numerator).toEqual(3);
    expect(result.denominator).toEqual(6);
  });

  it('Fraction types multiply correctly into reduced result', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 3, 2);

    const result: FractionType = frac.multiply(frac2) as FractionType;
    result.reduced             = true;

    expect(result.numerator).toEqual(1);
    expect(result.denominator).toEqual(2);
  });

  it('mixed numbers multiply correctly', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(1, 1, 2);

    const result: FractionType = frac.multiply(frac2) as FractionType;

    expect(result.whole).toEqual(4);
    expect(result.numerator).toEqual(1);
    expect(result.denominator).toEqual(8);
  });

  it('string multiplies fraction', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    const result: FractionType = frac.multiply("1 1/2") as FractionType;

    expect(result.whole).toEqual(4);
    expect(result.numerator).toEqual(1);
    expect(result.denominator).toEqual(8);
  });

  it('number multiplies fraction', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    const result: FractionType = frac.multiply(1.5) as FractionType;
    result.reduced             = true;

    expect(result.whole).toEqual(4);
    expect(result.numerator).toEqual(1);
    expect(result.denominator).toEqual(8);
  });

  it('Divide by zero returns default 0/1 result', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();

    const result: FractionType = frac.divide(frac2) as FractionType;

    expect(result.whole).toEqual(0);
    expect(result.numerator).toEqual(0);
    expect(result.denominator).toEqual(1);
  });

  it('Fractions divide correctly', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0,2,5);

    const result: FractionType = frac.divide(frac2) as FractionType;

    expect(result.whole).toEqual(0);
    expect(result.numerator).toEqual(5);
    expect(result.denominator).toEqual(6);
  });

  it('Fractions divide correctly #2', () =>
  {
    const frac: FractionModel = new FractionModel();

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0,6,7);

    const result: FractionType = frac.divide(frac2) as FractionType;

    expect(result.whole).toEqual(0);
    expect(result.numerator).toEqual(0);
    expect(result.denominator).toEqual(6);
    expect(result.value).toEqual(0);
  });

  it('mixed numbers divide correctly', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(3, 2, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(2,1,4);

    const result: FractionType = frac.divide(frac2) as FractionType;

    expect(result.whole).toEqual(1);
    expect(result.numerator).toEqual(17);
    expect(result.denominator).toEqual(27);
  });

  it('mixed numbers divide correctly #2', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 2, 5);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0,3,7);

    const result: FractionType = frac.divide(frac2) as FractionType;
    result.reduced             = true;

    expect(result.whole).toEqual(5);
    expect(result.numerator).toEqual(3);
    expect(result.denominator).toEqual(5);
  });

  it('string divides into fraction', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 2, 5);

    const result: FractionType = frac.divide("3/7") as FractionType;
    result.reduced             = true;

    expect(result.whole).toEqual(5);
    expect(result.numerator).toEqual(3);
    expect(result.denominator).toEqual(5);
  });

  it('Fraction types add into correctly', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 1, 6);

    frac.addAndReplace(frac2);

    expect(frac.numerator).toEqual(3);
    expect(frac.denominator).toEqual(6);
  });

  it('Fraction types add into correctly into reduced result', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 1, 6);

    frac.addAndReplace(frac2);
    frac.reduced = true;

    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(2);
  });

  it('Fraction types into add correctly #2', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 1, 5);

    frac.addAndReplace(frac2);

    expect(frac.numerator).toEqual(8);
    expect(frac.denominator).toEqual(15);
  });

  it('mixed numbers add into correctly', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(3, 1, 2);

    frac.addAndReplace(frac2);

    expect(frac.whole).toEqual(6);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(4);
  });

  it('string adds into fraction', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    frac.addAndReplace("1/2");

    expect(frac.whole).toEqual(3);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(4);
  });

  it('number adds into fraction', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    frac.addAndReplace(0.5);
    frac.reduced = true;

    expect(frac.whole).toEqual(3);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(4);
  });

  it('Fraction types subtract into correctly', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 2, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 1, 3);

    frac.subtractAndReplace(frac2);

    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(3);
  });

  it('Fraction types subtract into correctly #2', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, -2, 3);

    frac.subtractAndReplace(frac2);

    expect(frac.numerator).toEqual(3);
    expect(frac.denominator).toEqual(3);
  });

  it('Fraction types subtract into correctly #3', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 2, 3);

    frac.subtractAndReplace(frac2);

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(-1);
    expect(frac.denominator).toEqual(3);
  });

  it('Fraction types subtract into correctly #3', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 11, 6);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 22, 12);

    frac.subtractAndReplace(frac2);

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(0);
    expect(frac.denominator).toEqual(12);
    expect(frac.value).toEqual(0);
  });

  it('mixed numbers subtract into correctly', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(1, 1, 4);

    frac.subtractAndReplace(frac2);
    frac.reduced = true;

    expect(frac.whole).toEqual(1);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(2);
  });

  it('mixed numbers subtract into correctly #2', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(3, 1, 2);

    frac.subtractAndReplace(frac2);

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(-3);
    expect(frac.denominator).toEqual(4);
  });

  it('string subtracts from fraction with replace', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    frac.subtractAndReplace("1/2");

    expect(frac.whole).toEqual(2);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(4);
  });

  it('number subtracts from fraction with replace', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    frac.subtractAndReplace(0.5);
    frac.reduced = true;

    expect(frac.whole).toEqual(2);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(4);
  });


  it('Fraction types multiply into correctly', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 3, 2);

    frac.multiplyAndReplace(frac2);

    expect(frac.numerator).toEqual(3);
    expect(frac.denominator).toEqual(6);
  });

  it('Fraction types multiply into correctly into reduced result', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0, 3, 2);

    frac.multiplyAndReplace(frac2);
    frac.reduced = true;

    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(2);
  });

  it('mixed numbers multiply into correctly', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(1, 1, 2);

    frac.multiplyAndReplace(frac2);

    expect(frac.whole).toEqual(4);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(8);
  });

  it('string multiplies into fraction', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    frac.multiplyAndReplace("1 1/2");

    expect(frac.whole).toEqual(4);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(8);
  });

  it('number multiplies into fraction', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 3, 4);

    frac.multiplyAndReplace(1.5);
    frac.reduced             = true;

    expect(frac.whole).toEqual(4);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(8);
  });


  it('Divide into by zero results in no change to currentfraction', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();

    frac.divideAndReplace(frac2);

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(1);
    expect(frac.denominator).toEqual(3);
  });

  it('Fractions divide into correctly', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(0, 1, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0,2,5);

    frac.divideAndReplace(frac2);

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(5);
    expect(frac.denominator).toEqual(6);
  });

  it('Fractions divide into correctly #2', () =>
  {
    const frac: FractionModel = new FractionModel();

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0,6,7);

    frac.divideAndReplace(frac2);

    expect(frac.whole).toEqual(0);
    expect(frac.numerator).toEqual(0);
    expect(frac.denominator).toEqual(6);
    expect(frac.value).toEqual(0);
  });

  it('mixed numbers divide ibto correctly', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(3, 2, 3);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(2,1,4);

    frac.divideAndReplace(frac2);

    expect(frac.whole).toEqual(1);
    expect(frac.numerator).toEqual(17);
    expect(frac.denominator).toEqual(27);
  });

  it('mixed numbers divide into correctly #2', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 2, 5);

    const frac2: FractionModel = new FractionModel();
    frac2.setFraction(0,3,7);

    frac.divideAndReplace(frac2);
    frac.reduced = true;

    expect(frac.whole).toEqual(5);
    expect(frac.numerator).toEqual(3);
    expect(frac.denominator).toEqual(5);
  });

  it('string divides (and replace) into fraction', () =>
  {
    const frac: FractionModel = new FractionModel();
    frac.setFraction(2, 2, 5);

    frac.divideAndReplace("3/7");
    frac.reduced = true;

    expect(frac.whole).toEqual(5);
    expect(frac.numerator).toEqual(3);
    expect(frac.denominator).toEqual(5);
  });

});



