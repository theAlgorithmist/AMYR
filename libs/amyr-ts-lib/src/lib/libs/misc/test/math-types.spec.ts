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
import { RealModel       } from "../models/real-model";
import { IntegerModel    } from "../models/integer-model";
import { WholeModel      } from "../models/whole-model";
import { BasicMathType   } from "../../../models/math/basic-math-type"
import { MathTypeEnum    } from "../../../models/math/math-type-enum";

describe('Fraction Model', () => {

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

describe('Real Model', () =>
{
  const tmp: any = null;

  it('properly constructs a real model', () =>
  {
    const real: RealModel = new RealModel();

    expect(real.value).toEqual(0);
    expect(real.isUnknown).toBe(false);
  });

  it('properly sets internal value from number', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.0;

    expect(real.value).toEqual(1.0);
  });

  it('toString formats correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = -1.65;

    expect(real.value).toEqual(-1.65);
    expect(real.toString()).toEqual('-1.65');
  });

  it('value remains unchanged on null input', () =>
  {
    const real: RealModel = new RealModel();

    real.value = -1.5;
    real.value = tmp;

    expect(real.value).toEqual(-1.5);
  });

  it('value is coerced to zero on non-numeric input', () =>
  {
    const real: RealModel = new RealModel();

    real.value = -1.5;
    real.value = 'a';

    expect(real.value).toEqual(0);
  });

  it('value can be set from another math type', () =>
  {
    const real: RealModel = new RealModel();
    const frac: FractionModel = new FractionModel();

    frac.setFraction(1, 3, 4);

    real.value = frac;

    expect(real.value).toEqual(1.75);
  });

  it('fraction value can be set from another math type', () =>
  {
    const real: RealModel = new RealModel();
    const frac: FractionModel = new FractionModel();
    frac.reduced = true;

    real.value = 1.75;
    frac.value = real;

    expect(frac.whole).toEqual(1);
    expect(frac.numerator).toEqual(3);
    expect(frac.denominator).toEqual(4);
  });

  it('adding real models works correctly', () =>
  {
    const real: RealModel = new RealModel();
    const real2: RealModel = new RealModel();

    real.value = 1.85;
    real2.value = -1.85;

    const result: RealModel = real.add(real2) as RealModel;

    expect(result.value).toEqual(0);
  });

  it('adding real model to string works correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    const result: RealModel = real.add("1.0") as RealModel;

    expect(result.value).toEqual(2.25);
  });

  it('adding real model to string handles incorrect input', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    const result: RealModel = real.add("a") as RealModel;

    expect(result.value).toEqual(1.25);
  });

  it('adding real model to number works correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    const result: RealModel = real.add(1.75) as RealModel;

    expect(result.value).toEqual(3);
  });

  it('adding real model to number handles incorrect input', () =>
  {
    const real: RealModel = new RealModel();
    const tmp: any = NaN;

    real.value = 1.25;

    const result: RealModel = real.add(tmp) as RealModel;

    expect(result.value).toEqual(1.25);
  });

// -----
  it('subtracting real models works correctly', () =>
  {
    const real: RealModel = new RealModel();
    const real2: RealModel = new RealModel();

    real.value = 1.85;
    real2.value = 1.85;

    const result: RealModel = real.subtract(real2) as RealModel;

    expect(result.value).toEqual(0);
  });

  it('subtracting string from real model works correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    const result: RealModel = real.subtract("1.0") as RealModel;

    expect(result.value).toEqual(0.25);
  });

  it('subtracting string from real model handles incorrect input', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    const result: RealModel = real.subtract("a") as RealModel;

    expect(result.value).toEqual(1.25);
  });

  it('subtracting number from real model works correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    const result: RealModel = real.subtract(0.75) as RealModel;

    expect(result.value).toEqual(0.5);
  });

  it('subtracting number from real model handles incorrect input', () =>
  {
    const real: RealModel = new RealModel();
    const tmp: any = NaN;

    real.value = 1.25;

    const result: RealModel = real.subtract(tmp) as RealModel;

    expect(result.value).toEqual(1.25);
  });

// -----
  it('multiplying real models works correctly', () =>
  {
    const real: RealModel = new RealModel();
    const real2: RealModel = new RealModel();

    real.value = 1.2;
    real2.value = -0.5;

    const result: RealModel = real.multiply(real2) as RealModel;

    expect(result.value).toEqual(-0.6);
  });

  it('multiplying string from real model works correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    const result: RealModel = real.multiply("2.0") as RealModel;

    expect(result.value).toEqual(2.5);
  });

  it('multiplying string from real model handles incorrect input', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    const result: RealModel = real.multiply("a") as RealModel;

    expect(result.value).toEqual(0);
  });

  it('multiplying number by real model works correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    const result: RealModel = real.multiply(2) as RealModel;

    expect(result.value).toEqual(2.5);
  });

  it('multiplying number into real model handles incorrect input', () =>
  {
    const real: RealModel = new RealModel();
    const tmp: any = NaN;

    real.value = 1.25;

    const result: RealModel = real.multiply(tmp) as RealModel;

    expect(result.value).toEqual(0);
  });

// -----
  it('division of real models works correctly', () =>
  {
    const real: RealModel = new RealModel();
    const real2: RealModel = new RealModel();

    real.value = 6.0;
    real2.value = 3.0;

    const result: RealModel = real.divide(real2) as RealModel;

    expect(result.value).toEqual(2.0);
  });

  it('dividing string into real model works correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 6.0;

    const result: RealModel = real.divide("-2.0") as RealModel;

    expect(result.value).toEqual(-3.0);
  });

  it('dividing string into real model handles incorrect input', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    const result: RealModel = real.divide("a") as RealModel;

    expect(result.value).toEqual(1.25);
  });

  it('dividing number into real model works correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 2.0;

    const result: RealModel = real.divide(-0.5) as RealModel;

    expect(result.value).toEqual(-4.0);
  });

  it('dividing number into real model handles incorrect input', () =>
  {
    const real: RealModel = new RealModel();
    const tmp: any = NaN;

    real.value = 1.25;

    const result: RealModel = real.divide(tmp) as RealModel;

    expect(result.value).toEqual(1.25);
  });

// -----
  it('add into real models works correctly', () =>
  {
    const real: RealModel = new RealModel();
    const real2: RealModel = new RealModel();

    real.value = 1.85;
    real2.value = -1.85;

    real.addAndReplace(real2);

    expect(real.value).toEqual(0);
  });

  it('adding into real model with string works correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    real.addAndReplace("1.0");

    expect(real.value).toEqual(2.25);
  });

  it('adding into real model with string handles incorrect input', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    real.addAndReplace("a");

    expect(real.value).toEqual(1.25);
  });

  it('adding into real model with number works correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    real.addAndReplace(1.75);

    expect(real.value).toEqual(3);
  });

  it('adding into real model with number handles incorrect input', () =>
  {
    const real: RealModel = new RealModel();
    const tmp: any = NaN;

    real.value = 1.25;

    real.addAndReplace(tmp);

    expect(real.value).toEqual(1.25);
  });

//-----
  it('subtract and replace with real models works correctly', () =>
  {
    const real: RealModel = new RealModel();
    const real2: RealModel = new RealModel();

    real.value = 1.85;
    real2.value = 1.85;

    real.subtractAndReplace(real2);

    expect(real.value).toEqual(0);
  });

  it('subtracting and replace string from real model works correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    real.subtractAndReplace("1.0");

    expect(real.value).toEqual(0.25);
  });

  it('subtract and replace string from real model handles incorrect input', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    real.subtractAndReplace("a");

    expect(real.value).toEqual(1.25);
  });

  it('subtract and replace number from real model works correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    real.subtractAndReplace(0.75);

    expect(real.value).toEqual(0.5);
  });

  it('subtract and replace number from real model handles incorrect input', () =>
  {
    const real: RealModel = new RealModel();
    const tmp: any = NaN;

    real.value = 1.25;

    real.subtractAndReplace(tmp);

    expect(real.value).toEqual(1.25);
  });

// -----
  it('multiply and replace by real models works correctly', () =>
  {
    const real: RealModel  = new RealModel();
    const real2: RealModel = new RealModel();

    real.value = 1.2;
    real2.value = -0.5;

    real.multiplyAndReplace(real2);

    expect(real.value).toEqual(-0.6);
  });

  it('multiply and replace string by real model works correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    real.multiplyAndReplace("2.0");

    expect(real.value).toEqual(2.5);
  });

  it('multiply and replace string by real model handles incorrect input', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    real.multiplyAndReplace("a");

    expect(real.value).toEqual(0);
  });

  it('multiply and replace number by real model works correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    real.multiplyAndReplace(2);

    expect(real.value).toEqual(2.5);
  });

  it('multiply and replace number by real model handles incorrect input', () =>
  {
    const real: RealModel = new RealModel();
    const tmp: any = NaN;

    real.value = 1.25;

    real.multiplyAndReplace(tmp);

    expect(real.value).toEqual(0);
  });

// -----
  it('divide and replace with real models works correctly', () =>
  {
    const real: RealModel = new RealModel();
    const real2: RealModel = new RealModel();

    real.value = 6.0;
    real2.value = 3.0;

    real.divideAndReplace(real2);

    expect(real.value).toEqual(2.0);
  });

  it('divide and replace string into real model works correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 6.0;

    const result: RealModel = real.divide("-2.0") as RealModel;

    expect(result.value).toEqual(-3.0);
  });

  it('divide and replace string into real model handles incorrect input', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 1.25;

    const result: RealModel = real.divide("a") as RealModel;

    expect(result.value).toEqual(1.25);
  });

  it('divide and replace number into real model works correctly', () =>
  {
    const real: RealModel = new RealModel();

    real.value = 2.0;

    const result: RealModel = real.divide(-0.5) as RealModel;

    expect(result.value).toEqual(-4.0);
  });

  it('divide and replace number into real model handles incorrect input', () =>
  {
    const real: RealModel = new RealModel();
    const tmp: any = NaN;

    real.value = 1.25;

    const result: RealModel = real.divide(tmp) as RealModel;

    expect(result.value).toEqual(1.25);
  });

  it('real model clones correctly', () =>
  {
    const real: RealModel = new RealModel();
    real.value = 1.25;

    const real2: RealModel = real.clone() as RealModel;
    real.value = 0;

    expect(real2.value).toEqual(1.25);
    expect(real.value).toEqual(0);
  });

  it('real model clears correctly', () =>
  {
    const real: RealModel = new RealModel();
    real.value = 1.25;

    expect(real.value).toEqual(1.25);

    real.clear();
    expect(real.value).toEqual(0);
  });

});

describe('Integer Model', () =>
{
  const tmp: any = null;

  it('properly constructs an integer model', () => {
    const int: IntegerModel = new IntegerModel();

    expect(int.value).toEqual(0);
  });

  it('value mutator correctly rounds', () => {
    const int: IntegerModel = new IntegerModel();

    int.value = 1.75;

    expect(int.value).toEqual(2);

    int.value = 1.1275;
    expect(int.value).toEqual(1);

    int.value = -1.042;
    expect(int.value).toEqual(-1);
  });

  it('fraction model can be assinged to integer model', () => {
    const int: IntegerModel   = new IntegerModel();
    const frac: FractionModel = new FractionModel();

    frac.setFraction(1, 3,4);

    int.value = frac;
    expect(int.value).toEqual(2);
  });

  it('real model can be assinged to integer model', () => {
    const int: IntegerModel = new IntegerModel();
    const real: RealModel   = new RealModel();

    real.value = 5.0562;

    int.value = real;
    expect(int.value).toEqual(5);
  });

  it('integer model compares correctly', () => {
    const int: IntegerModel = new IntegerModel();
    const real: RealModel   = new RealModel();

    int.value  = 5;
    real.value = 5.0562;

    expect(int.compare(real)).toEqual(false);

    real.value = 5.00000000000008;
    expect(int.compare(real)).toEqual(true);
  });

  it('integer model clones correctly', () => {
    const int: IntegerModel = new IntegerModel();

    int.value = -7;

    const int2:IntegerModel = int.clone() as IntegerModel;
    int.value               = 1;

    expect(int2.value).toEqual(-7);
  });

  it('adding integer models works correctly', () =>
  {
    const int: IntegerModel  = new IntegerModel();
    const int2: IntegerModel = new IntegerModel();

    int.value  = 1;
    int2.value = -1.85;

    const result: IntegerModel = int.add(int2) as IntegerModel;

    expect(result.value).toEqual(-1);
  });

  it('adding integer model to string works correctly', () =>
  {
    const int: IntegerModel  = new IntegerModel();

    int.value = 1.25;

    const result: IntegerModel = int.add("1") as IntegerModel;

    expect(result.value).toEqual(2);
  });

  it('adding integer model to string handles incorrect input', () =>
  {
    const int: IntegerModel  = new IntegerModel();

    int.value = 1.25;

    const result: IntegerModel = int.add("a") as IntegerModel;

    expect(result.value).toEqual(1);
  });

  it('adding integer model to number works correctly', () =>
  {
    const int: IntegerModel  = new IntegerModel();

    int.value = 1.25;

    const result: IntegerModel = int.add(1.75) as IntegerModel;

    expect(result.value).toEqual(3);
  });

  it('adding integer model to number handles incorrect input', () =>
  {
    const int: IntegerModel  = new IntegerModel();
    const tmp: any         = NaN;

    int.value = 1.25;

    const result: IntegerModel = int.add(tmp) as IntegerModel;

    expect(result.value).toEqual(1);
  });

// // -----
  it('subtracting integer models works correctly', () =>
  {
    const int: IntegerModel  = new IntegerModel();
    const int2: IntegerModel = new IntegerModel();

    int.value  = 1.85;
    int2.value = 1.05;

    const result: IntegerModel = int.subtract(int2) as IntegerModel;

    expect(result.value).toEqual(1);
  });

  it('subtracting string from real model works correctly', () =>
  {
    const int: IntegerModel  = new IntegerModel();

    int.value = 1.25;

    const result: IntegerModel = int.subtract("1.0") as IntegerModel;

    expect(result.value).toEqual(0);
  });

  it('subtracting string from real model handles incorrect input', () =>
  {
    const int: IntegerModel  = new IntegerModel();

    int.value = 1.25;

    const result: IntegerModel = int.subtract("a") as IntegerModel;

    expect(result.value).toEqual(1);
  });

  it('subtracting number from integer model works correctly', () =>
  {
    const real: IntegerModel  = new IntegerModel();

    real.value = 1.25;

    const result: IntegerModel = real.subtract(0.75) as IntegerModel;

    expect(result.value).toEqual(0);
  });

  it('subtracting number from integer model handles incorrect input', () =>
  {
    const int: IntegerModel = new IntegerModel();
    const tmp: any          = NaN;

    int.value = 4.875;

    const result: IntegerModel = int.subtract(tmp) as IntegerModel;

    expect(result.value).toEqual(5);
  });

// -----
  it('multiplying integer models works correctly', () =>
  {
    const int: IntegerModel  = new IntegerModel();
    const int2: IntegerModel = new IntegerModel();

    int.value  = 1.2;

    int2.value = -1.55;
    let result: IntegerModel = int.multiply(int2) as IntegerModel;

    int2.value = -1.5;
    result = int.multiply(int2) as IntegerModel;

    expect(result.value).toEqual(-1);
  });

  it('multiplying string and real model works correctly', () =>
  {
    const int: IntegerModel = new IntegerModel();

    int.value = 1.25;

    const result: IntegerModel = int.multiply("2.0") as IntegerModel;

    expect(result.value).toEqual(2);
  });

  it('multiplying string and real model handles incorrect input', () =>
  {
    const int: IntegerModel  = new IntegerModel();

    int.value = 1.25;

    const result: IntegerModel = int.multiply("a") as IntegerModel;

    expect(result.value).toEqual(0);
  });

  it('multiplying number by integer model works correctly', () =>
  {
    const int: IntegerModel  = new IntegerModel();

    int.value = 1.25;

    const result: IntegerModel = int.multiply(2) as IntegerModel;

    expect(result.value).toEqual(2);
  });

  it('multiplying number into integer model handles incorrect input', () =>
  {
    const int: IntegerModel = new IntegerModel();
    const tmp: any          = NaN;

    int.value = 1.25;

    const result: IntegerModel = int.multiply(tmp) as IntegerModel;

    expect(result.value).toEqual(0);
  });

// -----
  it('division of integer models works correctly', () =>
  {
    const int: IntegerModel  = new IntegerModel();
    const int2: IntegerModel = new IntegerModel();

    int.value  = 6.1;
    int2.value = 3.25;

    const result: IntegerModel = int.divide(int2) as IntegerModel;

    expect(result.value).toEqual(2);
  });

  it('dividing string into integer model works correctly', () =>
  {
    const int: IntegerModel = new IntegerModel();

    int.value = 6.0;

    const result: IntegerModel = int.divide("-2.0") as IntegerModel;

    expect(result.value).toEqual(-3);
  });

  it('dividing string into integer model handles incorrect input', () =>
  {
    const int: IntegerModel  = new IntegerModel();

    int.value = 1.25;

    const result: IntegerModel = int.divide("a") as IntegerModel;

    expect(result.value).toEqual(1);
  });

  it('dividing number into integer model works correctly', () =>
  {
    const int: IntegerModel  = new IntegerModel();

    int.value = 12.0;

    let result: IntegerModel = int.divide(-3.1) as IntegerModel;
    expect(result.value).toEqual(-4.0);

    // this would result in a divide by zero
    result = int.divide(-0.5) as IntegerModel;
    expect(result.value).toEqual(12);
  });

  it('dividing number into integer model handles incorrect input', () =>
  {
    const int: IntegerModel = new IntegerModel();
    const tmp: any           = NaN;

    int.value = 1.25;

    const result: RealModel = int.divide(tmp) as RealModel;

    expect(result.value).toEqual(1);
  });

// -----
  it('add into integer models works correctly', () =>
  {
    const int: IntegerModel  = new IntegerModel();
    const int2: IntegerModel = new IntegerModel();

    int.value  = 1.85;
    int2.value = -1.85;

    int.addAndReplace(int2);

    expect(int.value).toEqual(0);
  });

  it('adding into integer model with string works correctly', () =>
  {
    const int: IntegerModel  = new IntegerModel();

    int.value = 1.25;

    int.addAndReplace("1.0");

    expect(int.value).toEqual(2);
  });

  it('adding into integer model with string handles incorrect input', () =>
  {
    const int: IntegerModel = new IntegerModel();

    int.value = 1.75;

    int.addAndReplace("a");

    expect(int.value).toEqual(2);
  });

  it('adding into integer model with number works correctly', () =>
  {
    const int: IntegerModel = new IntegerModel();

    int.value = 1.25;

    int.addAndReplace(1.75);

    expect(int.value).toEqual(3);
  });

  it('adding into integer model with number handles incorrect input', () =>
  {
    const int: IntegerModel = new IntegerModel();
    const tmp: any          = NaN;

    int.value = 1.25;

    int.addAndReplace(tmp);

    expect(int.value).toEqual(1);
  });

//-----
  it('subtract and replace with integer models works correctly', () =>
  {
    const int: IntegerModel  = new IntegerModel();
    const int2: IntegerModel = new IntegerModel();

    int.value  = 1.85;
    int2.value = 1.35;

    int.subtractAndReplace(int2);

    expect(int.value).toEqual(1);
  });

  it('subtracting and replace string from integer model works correctly', () =>
  {
    const int: IntegerModel = new IntegerModel();

    int.value = 1.25;

    int.subtractAndReplace("1.0");

    expect(int.value).toEqual(0);
  });

  it('subtract and replace string from integer model handles incorrect input', () =>
  {
    const int: IntegerModel = new IntegerModel();

    int.value = 1.25;

    int.subtractAndReplace("a");

    expect(int.value).toEqual(1);
  });

  it('subtract and replace number from integer model works correctly', () =>
  {
    const int: IntegerModel = new IntegerModel();

    int.value = 1.25;

    int.subtractAndReplace(0.75);

    expect(int.value).toEqual(0);
  });

  it('subtract and replace number from integer model handles incorrect input', () =>
  {
    const int: IntegerModel = new IntegerModel();
    const tmp: any          = NaN;

    int.value = 1.25;

    int.subtractAndReplace(tmp);

    expect(int.value).toEqual(1);
  });

// -----
  it('multiply and replace with integer models works correctly', () =>
  {
    const int: IntegerModel  = new IntegerModel();
    const int2: IntegerModel = new IntegerModel();

    int.value  = 1.2;
    int2.value = -0.5;

    int.multiplyAndReplace(int2);

    expect(int.value).toEqual(-0);
  });

  it('multiply and replace string by integer model works correctly', () =>
  {
    const int: IntegerModel = new IntegerModel();

    int.value = 1.25;

    int.multiplyAndReplace("2.0");

    expect(int.value).toEqual(2);
  });

  it('multiply and replace string by integer model handles incorrect input', () =>
  {
    const int: IntegerModel = new IntegerModel();

    int.value = 1.25;

    int.multiplyAndReplace("a");

    expect(int.value).toEqual(0);
  });

  it('multiply and replace number by integer model works correctly', () =>
  {
    const int: IntegerModel = new IntegerModel();

    int.value = 1.25;

    int.multiplyAndReplace(2);

    expect(int.value).toEqual(2);
  });

  it('multiply and replace number by integer model handles incorrect input', () =>
  {
    const int: IntegerModel = new IntegerModel();
    const tmp: any          = NaN;

    int.value = 1.25;

    int.multiplyAndReplace(tmp);

    expect(int.value).toEqual(0);
  });

// -----
  it('divide and replace with real models works correctly', () =>
  {
    const int: IntegerModel  = new IntegerModel();
    const int2: IntegerModel = new IntegerModel();

    int.value  = 6.0;
    int2.value = 3.0;

    int.divideAndReplace(int2);

    expect(int.value).toEqual(2);
  });

  it('divide and replace string by integer model works correctly', () =>
  {
    const int: IntegerModel = new IntegerModel();

    int.value = 6.0;

    const result: IntegerModel = int.divide("-2.0") as IntegerModel;

    expect(result.value).toEqual(-3.0);
  });

  it('divide and replace string by real integer handles incorrect input', () =>
  {
    const int: IntegerModel = new IntegerModel();

    int.value = 3.25;

    const result: RealModel = int.divide("a") as RealModel;

    expect(result.value).toEqual(3);
  });

  it('divide and replace number by integer model works correctly', () =>
  {
    const int: IntegerModel = new IntegerModel();

    int.value = 3.0;

    const result: IntegerModel = int.divide(-4) as IntegerModel;

    expect(result.value).toEqual(-1);
  });

  it('divide and replace number into real model handles incorrect input', () =>
  {
    const int: IntegerModel = new IntegerModel();
    const tmp: any         = NaN;

    int.value = 1.25;

    const result: IntegerModel = int.divide(tmp) as IntegerModel;

    expect(result.value).toEqual(1);
  });
});

describe('Whole Model', () =>
{
  const tmp: any = null;

  it('properly constructs a whole model', () => {
    const whole: WholeModel = new WholeModel();

    expect(whole.value).toEqual(0);
    expect(whole.type).toEqual(MathTypeEnum.WHOLE)
  });

  it('value mutator works correctly', () => {
    const whole: WholeModel = new WholeModel();

    whole.value = 1.75;

    expect(whole.value).toEqual(2);

    whole.value = 1.1275;
    expect(whole.value).toEqual(1);

    whole.value = -1.042;
    expect(whole.value).toEqual(0);
  });

  it('fraction model can be assinged to whole model', () => {
    const whole: WholeModel     = new WholeModel();
    const frac: FractionModel = new FractionModel();

    frac.setFraction(1, 3,4);

    whole.value = frac;
    expect(whole.value).toEqual(2);

    frac.setFraction(-1, 2,3);

    whole.value = frac;
    expect(whole.value).toEqual(0);
  });

  it('real model can be assinged to whole model', () => {
    const whole: WholeModel = new WholeModel();
    const real: RealModel = new RealModel();

    real.value = 5.0562;

    whole.value = real;
    expect(whole.value).toEqual(5);
  });

  it('integer model can be assinged to whole model', () => {
    const whole: WholeModel = new WholeModel();
    const int: IntegerModel = new IntegerModel();

    int.value = -5.0562;

    whole.value = int;
    expect(whole.value).toEqual(0);
  });

  it('whole model compares correctly', () => {
    const whole: WholeModel = new WholeModel();
    const real: RealModel = new RealModel();

    whole.value  = 5;
    real.value = 5.0562;

    expect(whole.compare(real)).toEqual(false);

    real.value = 5.00000000000008;
    expect(whole.compare(real)).toEqual(true);
  });

  it('whole model clones correctly', () => {
    const whole: WholeModel = new WholeModel();

    whole.value = -7;

    const whole2: WholeModel = whole.clone() as WholeModel;
    whole.value             = 1;

    expect(whole2.value).toEqual(0);
  });

  it('adding whole models works correctly', () =>
  {
    const whole: WholeModel  = new WholeModel();
    const whole2: WholeModel = new WholeModel();

    whole.value  = 1.4;
    whole2.value = -1.85;

    const result: WholeModel = whole.add(whole2) as WholeModel;

    expect(result.value).toEqual(1);
  });

  it('adding whole model to string works correctly', () =>
  {
    const whole: WholeModel = new WholeModel();

    whole.value = 1;

    const result: WholeModel = whole.add("1") as WholeModel;

    expect(result.value).toEqual(2);
  });

  it('adding whole model to string handles incorrect input', () =>
  {
    const whole: WholeModel = new WholeModel();

    whole.value = 1.25;

    const result: WholeModel = whole.add("a") as WholeModel;

    expect(result.value).toEqual(1);
  });

  it('adding whole model to integer model works correctly', () =>
  {
    const int: IntegerModel = new IntegerModel();

    int.value = 1.25;

    const whole: WholeModel = new WholeModel();
    whole.value             = 2;

    const result: WholeModel = whole.add(int) as WholeModel;

    expect(result.value).toEqual(3);
  });

  it('adding whole model to number works correctly', () =>
  {
    const whole: WholeModel  = new WholeModel();

    whole.value = 1.25;

    const result: WholeModel = whole.add(1.75) as WholeModel;

    expect(result.value).toEqual(3);
  });

  it('assigning fraction to whole model works correctly', () =>
  {
    const frac: FractionModel = new FractionModel();

    frac.setFraction(2, 1, 3)

    const whole: WholeModel  = new WholeModel();

    whole.value = frac;

    expect(whole.value).toEqual(2);
  });

  it('adding whole model to number handles incorrect input', () =>
  {
    const whole: WholeModel  = new WholeModel();
    const tmp: any           = NaN;

    whole.value = 1.25;

    const result: WholeModel = whole.add(tmp) as WholeModel;

    expect(result.value).toEqual(1);
  });

// -----
  it('subtracting whole models works correctly', () =>
  {
    const whole: WholeModel  = new WholeModel();
    const whole2: WholeModel = new WholeModel();

    whole.value  = 1.85;
    whole2.value = 1.05;

    const result: IntegerModel = whole.subtract(whole2) as IntegerModel;

    expect(result.value).toEqual(1);
  });

  it('subtracting string from whole model works correctly', () =>
  {
    const whole: WholeModel = new WholeModel();

    whole.value = 1.25;

    const result: WholeModel = whole.subtract("1.0") as WholeModel;

    expect(result.value).toEqual(0);
  });

  it('subtracting string from whole model handles incorrect input', () =>
  {
    const whole: WholeModel  = new WholeModel();

    whole.value = 1.25;

    const result: WholeModel = whole.subtract("a") as WholeModel;

    expect(result.value).toEqual(1);
  });

  it('subtracting number from whole model works correctly', () =>
  {
    const whole: WholeModel  = new WholeModel();

    whole.value = 1.25;

    const result: BasicMathType    = whole.subtract(3);
    const resultType: MathTypeEnum = result.type;

    expect(resultType).toEqual(MathTypeEnum.INTEGER);
    expect(result.value).toEqual(-2);
  });

  it('subtracting number from whole model handles incorrect input', () =>
  {
    const whole: WholeModel = new WholeModel();
    const tmp: any          = NaN;

    whole.value = 4.875;

    const result: WholeModel = whole.subtract(tmp) as WholeModel;

    expect(result.value).toEqual(5);
  });

// -----
  it('multiplying whole models works correctly', () =>
  {
    const whole: WholeModel  = new WholeModel();
    const whole2: WholeModel = new WholeModel();

    whole.value  = 1.2;
    whole2.value = -1.55;

    let result: WholeModel = whole.multiply(whole2) as WholeModel;
    expect(result.value).toEqual(0);

    whole.value  = 2;
    whole2.value = 1.75;
    result       = whole.multiply(whole2) as WholeModel;

    expect(result.value).toEqual(4);
  });

  it('multiplying whole by integer model works correctly', () =>
  {
    const whole: WholeModel = new WholeModel();
    const int: IntegerModel = new IntegerModel();

    whole.value = 1.2;
    int.value   = -1.65;

    const result: BasicMathType = whole.multiply(int);
    expect(result.type).toEqual(MathTypeEnum.INTEGER);
    expect(result.value).toEqual(-2);
  });

  it('multiplying string and whole model works correctly', () =>
  {
    const whole: WholeModel = new WholeModel();

    whole.value = 1.25;

    const result: WholeModel = whole.multiply("2.0") as WholeModel;

    expect(result.value).toEqual(2);
  });

  it('multiplying string and whole model handles incorrect input', () =>
  {
    const whole: WholeModel  = new WholeModel();

    whole.value = 1.25;

    const result: WholeModel = whole.multiply("a") as WholeModel;

    expect(result.value).toEqual(0);
  });

  it('multiplying number by whole model works correctly', () =>
  {
    const whole: WholeModel  = new WholeModel();

    whole.value = 1.25;

    const result: WholeModel = whole.multiply(2) as WholeModel;

    expect(result.value).toEqual(2);
  });

  it('multiplying number into whole model handles incorrect input', () =>
  {
    const whole: WholeModel = new WholeModel();
    const tmp: any          = NaN;

    whole.value = 1.25;

    const result: WholeModel = whole.multiply(tmp) as WholeModel;

    expect(result.value).toEqual(0);
  });

// -----
  it('division of whole models works correctly', () =>
  {
    const whole: WholeModel  = new WholeModel();
    const whole2: WholeModel = new WholeModel();

    whole.value  = 6.1;
    whole2.value = 3.25;

    const result: WholeModel = whole.divide(whole2) as WholeModel;

    expect(result.value).toEqual(2);
  });

  it('division of whole models works correctly #2', () =>
  {
    const whole: WholeModel  = new WholeModel();
    const whole2: WholeModel = new WholeModel();

    whole.value  = -6.1;
    whole2.value = 3.25;

    const result: WholeModel = whole.divide(whole2) as WholeModel;

    expect(result.value).toEqual(0);
  });

  it('dividing string into whole model works correctly', () =>
  {
    const whole: WholeModel = new WholeModel();

    whole.value = 6.0;

    const result: BasicMathType = whole.divide("-2.0");

    expect(result.type).toEqual(MathTypeEnum.INTEGER);
    expect(result.value).toEqual(-3);
  });

  it('dividing string into whole model handles incorrect input', () =>
  {
    const whole: WholeModel  = new WholeModel();

    whole.value = 1.25;

    const result: WholeModel = whole.divide("a") as WholeModel;

    expect(result.value).toEqual(1);
  });

  it('dividing number into whole model works correctly', () =>
  {
    const whole: WholeModel = new WholeModel();

    whole.value = 12.0;

    let result: WholeModel = whole.divide(3.1) as WholeModel;
    expect(result.value).toEqual(4.0);

    // this would result in a divide by zero
    result = whole.divide(-0.5) as WholeModel;
    expect(result.value).toEqual(12);
  });

  it('dividing number into whole model handles incorrect input', () =>
  {
    const whole: WholeModel = new WholeModel();
    const tmp: any          = NaN;

    whole.value = 1.25;

    const result: RealModel = whole.divide(tmp) as RealModel;

    expect(result.value).toEqual(1);
  });

// -----
  it('add into whole models works correctly', () =>
  {
    const whole: WholeModel  = new WholeModel();
    const whole2: WholeModel = new WholeModel();

    whole.value  = 1.85;
    whole2.value = -1.85;

    whole.addAndReplace(whole2);

    expect(whole.value).toEqual(2);
  });

  it('adding into whole model with string works correctly', () =>
  {
    const whole: WholeModel  = new WholeModel();

    whole.value = 1.25;

    whole.addAndReplace("1.0");

    expect(whole.value).toEqual(2);
  });

  it('adding into whole model with string handles incorrect input', () =>
  {
    const whole: WholeModel = new WholeModel();

    whole.value = 1.75;

    whole.addAndReplace("a");

    expect(whole.value).toEqual(2);
  });

  it('adding into whole model with number works correctly', () =>
  {
    const whole: WholeModel = new WholeModel();

    whole.value = 1.25;

    whole.addAndReplace(1.75);

    expect(whole.value).toEqual(3);
  });

  it('adding into whole model with number handles incorrect input', () =>
  {
    const whole: WholeModel = new WholeModel();
    const tmp: any          = NaN;

    whole.value = 1.25;

    whole.addAndReplace(tmp);

    expect(whole.value).toEqual(1);
  });

  it('adding into whole model with fraction works correctly', () =>
  {
    const whole: WholeModel   = new WholeModel();
    const frac: FractionModel = new FractionModel();

    frac.setFraction(1, 2,3)

    whole.value = 2.25;

    whole.addAndReplace(frac);

    expect(whole.value).toEqual(4);
  });

//-----
  it('subtract and replace whole models works correctly', () =>
  {
    const whole: WholeModel  = new WholeModel();
    const whole2: WholeModel = new WholeModel();

    whole.value  = 1.85;
    whole2.value = 1.35;

    whole.subtractAndReplace(whole2);

    expect(whole.value).toEqual(1);
  });

  it('subtracting and replace string from whole model works correctly', () =>
  {
    const whole: WholeModel = new WholeModel();

    whole.value = 1.25;

    whole.subtractAndReplace("1.0");

    expect(whole.value).toEqual(0);
  });

  it('subtract and replace string from whole model handles incorrect input', () =>
  {
    const whole: WholeModel = new WholeModel();

    whole.value = 1.25;

    whole.subtractAndReplace("a");

    expect(whole.value).toEqual(1);
  });

  it('subtract and replace number from whole model works correctly', () =>
  {
    const whole: WholeModel = new WholeModel();

    whole.value = 1.25;

    whole.subtractAndReplace(0.75);

    expect(whole.value).toEqual(0);
  });

  it('subtract and replace number from whole model handles incorrect input', () =>
  {
    const whole: WholeModel = new WholeModel();
    const tmp: any          = NaN;

    whole.value = 1.25;

    whole.subtractAndReplace(tmp);

    expect(whole.value).toEqual(1);
  });

  it('subtract and replace fraction from whole model works correctly', () =>
  {
    const whole: WholeModel = new WholeModel();
    const frac: FractionModel = new FractionModel();

    frac.setFraction(2, 1, 3);

    whole.value = 1.25;

    // result must be whole number
    whole.subtractAndReplace(frac);

    expect(whole.value).toEqual(0);

    whole.value = 10;
    whole.subtractAndReplace(frac);

    expect(whole.value).toEqual(8);
  });

// -----
  it('multiply and replace with whole models works correctly', () =>
  {
    const whole: WholeModel  = new WholeModel();
    const whole2: WholeModel = new WholeModel();

    whole.value  = 1.2;
    whole2.value = -0.5;

    whole.multiplyAndReplace(whole2);

    expect(whole.value).toEqual(0);
  });

  it('multiply and replace string by whole model works correctly', () =>
  {
    const whole: WholeModel = new WholeModel();

    whole.value = 1.25;

    whole.multiplyAndReplace("2.0");

    expect(whole.value).toEqual(2);
  });

  it('multiply and replace string by whole model handles incorrect input', () =>
  {
    const whole: WholeModel = new WholeModel();

    whole.value = 1.25;

    whole.multiplyAndReplace("a");  // coerced internally to whole model w/zero value

    expect(whole.value).toEqual(0);
  });

  it('multiply and replace number by whole model works correctly', () =>
  {
    const whole: WholeModel = new WholeModel();

    whole.value = 1.25;

    whole.multiplyAndReplace(2);

    expect(whole.value).toEqual(2);
  });

  it('multiply and replace number by whole model handles incorrect input', () =>
  {
    const whole: WholeModel = new WholeModel();
    const tmp: any          = NaN;

    whole.value = 1.25;

    whole.multiplyAndReplace(tmp);

    expect(whole.value).toEqual(0);
  });

// -----
  it('divide and replace with whole models works correctly', () =>
  {
    const whole: WholeModel  = new WholeModel();
    const whole2: WholeModel = new WholeModel();

    whole.value  = 6.0;
    whole2.value = 3.0;

    whole.divideAndReplace(whole2);

    expect(whole.value).toEqual(2);
  });

  it('divide and replace string by whole model works correctly', () =>
  {
    const int: WholeModel = new WholeModel();

    int.value = 6.0;

    const result: BasicMathType = int.divide("-2.0");

    expect(result.type).toEqual(MathTypeEnum.INTEGER);
    expect(result.value).toEqual(-3.0);
  });

  it('divide and replace string by whole model handles incorrect input', () =>
  {
    const int: WholeModel = new WholeModel();

    int.value = 3.25;

    const result: WholeModel = int.divide("a") as WholeModel;

    expect(result.value).toEqual(3);
  });

  it('divide and replace number by whole model works correctly', () =>
  {
    const int: WholeModel = new WholeModel();

    int.value = 3.0;

    const result: BasicMathType = int.divide(-4);

    expect(result.type).toEqual(MathTypeEnum.INTEGER);
    expect(result.value).toEqual(-1);
  });

  it('divide and replace number into whole model handles incorrect input', () =>
  {
    const whole: WholeModel = new WholeModel();
    const tmp: any           = NaN;

    whole.value = 1.25;

    const result: WholeModel = whole.divide(tmp) as WholeModel;

    expect(result.value).toEqual(1);
  });
});
