import { BasicMathType } from "./basic-math-type";

// Fraction Type
export interface FractionType extends BasicMathType
{
  // is this a mixed number?
  get mixed(): boolean

  // designate this as a mixed number
  set mixed(pIsMixed: boolean);

  // access the whole part of a mixed number
  get whole(): number;

  // assign the whole number
  set whole(value: number);

  // access the raw numerator value without taking into account mixed numbers
  get numerator(): number;

  // assign the numerator
  set numerator(value: number);

  // access the computed numerator with whole part represented in the numerator
  get computedNumerator(): number;

  // access the denominator
  get denominator(): number;

  // assign the denominator
  set denominator(value: number);

  // access the unknown part
  get unknownPart(): string;

  // assign the unknown part of the fraction
  set unknownPart(part: string);

  // is the fraction currently in reduced form?
  get reduced(): boolean;

  // assign or mark future updates to be in reduced form or not
  set reduced(value: boolean);

  // clear or reset the fraction to 0 0/1 and mixed = false, reduced = false
  clear(): void;

  // preferred method to assign a completely new fraction
  setFraction(whole: number, numerator: number, denominator: number):void;

  // convert the internal fraction representation to reduced form and simulateously indicate that future changes should
  // be converted to reduced form
  reduce():void;

  // least common denominator of the current and another fraction
  leastCommonDenominator(fraction: FractionType): number;

  // greatest common divisor of the current and another fraction
  greatestCommonDivisor(fraction: FractionType): number;
}
