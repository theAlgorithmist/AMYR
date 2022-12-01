import {
  leftTrim,
  rightTrim,
  trim
} from '../../../tsmt/utils/string-utils';

import { FractionModel } from "../fraction-model";

export function strToFrac(value: string): FractionModel
{
  const f: FractionModel = new FractionModel();

  let whole = 0;

  let num: number = 0;
  let den: number = 1;

  let fracPart = '';

  const trimmedLeft: string = leftTrim(value);
  const finalStr: string    = rightTrim(trimmedLeft);
  const slash: number       = finalStr.indexOf('/');

  if (slash !== -1)
  {
    const space: number = finalStr.indexOf(' ');
    if (space !== -1 && space < slash)
    {
      const first: string  = finalStr.substring(0, slash-1);
      const second: string = finalStr.substring(slash-1, finalStr.length);

      whole = !isNaN(+first) ? +first : whole;
      fracPart = second;
    }
    else
    {
      fracPart = finalStr;
    }

    const fraction: string            = trim(fracPart);
    const constituents: Array<string> = fraction.split('/');

    num = !isNaN(+constituents[0]) ? +constituents[0] : num;
    den = !isNaN(+constituents[1]) ? +constituents[1] : den;
  }

  f.setFraction(whole, num, den);

  f.mixed = whole !== 0;
  return f;
}
