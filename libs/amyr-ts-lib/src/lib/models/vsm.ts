export interface WordVector
{
  word: string;
  value: number;
}

export enum VSM_OP
{
  OFFSET,
  SCALE
}

// these words are generally not important in discerning intent or are not considered to be keywords. they might
// be used in a pre-processing context, however.
export const VSM_FILTER_WORDS: Record<string, boolean> = {
  '': true,
  ' ': true,
  'if': true,
  'and': true,
  'but': true,
  'a': true,
  'the': true,
  'i': true,
  'of': true,
  'above': true,
  'at': true,
  'around': true,
  'to': true,
  'for': true,
  'into': true,
  'onto': true,
  'off': true,
  'on': true,
  'by': true,
  'with': true,
  'or': true,
  'all': true,
  'is': true,
  'it': true,
  'was': true,
  'after': true,
  'in': true,
  'an': true,
  'not': true,
  'yes': true,
  'no': true,
  'still': true
};
