import { FractionModel } from "../fraction-model";

export function floatToFrac(value: number): FractionModel
{
  let f: FractionModel;

  // is it a whole number?
  if (Math.floor(value) === value)
  {
    f = new FractionModel();

    f.setFraction(value, 0, 1);
    return f;
  }

  // this is quick-n-dirty - just get x/1 or xy/10 or xyz/100, etc. for the actual fractional part

  // how many digits past the decimal?
  const strVal: string = value.toString();
  const index: number  = strVal.indexOf('.');
  const digits: number = strVal.length - index - 1;

  let whole = 0;

  // extract a whole part
  if (index > 0) whole = parseInt(strVal.substring(0, index));

  const numStr: string = strVal.substring(index + 1, strVal.length);

  const power: number = Math.pow(10, digits);
  const n: number = parseInt(numStr);

  f = new FractionModel();
  f.setFraction(whole, n, power);

  f.mixed = whole !== 0;
  return f;
}
