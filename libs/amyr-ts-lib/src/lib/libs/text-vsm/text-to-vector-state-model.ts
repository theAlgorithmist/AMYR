/**
 * AMYR Library. Parse a collection of small phrases into a keyword-frequency structure that forms a
 * simple VSM (Vector State Model) for keywords
 *
 * @param {string} phrase Delimited phrase of keywords
 *
 * @param {string} delim Delimiter, i.e. comma or space
 *
 * @param {Record<string, boolean>} filterOut Word list to filter out of the input phrase (i.e. not considered for keywords)
 *
 * @param {boolean} toLowerCase True if all keywords are processed to lowercase before adding to the VSM
 * @default true
 *
 * @param {Record<string, boolean> Existing VSM to add to (if defined)
 * @default null
 *
 * @author Jim Armstrong ()
 *
 * @version 1.0
 */
import { VSM_FILTER_WORDS } from "../../models/vsm";

export function textToVSM(
  phrase: string,
  delim: string,
  filterOut: Record<string, boolean> = VSM_FILTER_WORDS,
  toLowerCase: boolean = true,
  vsm: Record<string, number> = {} ): Record<string, number>
{
  const model: Record<string, number> = JSON.parse(JSON.stringify(vsm));

  if (phrase !== undefined && phrase != null && phrase != '' && delim !== undefined && delim.length && delim.length > 0)
  {
    // remove very basic punctuation
    phrase = phrase.replace('.', '');
    phrase = phrase.replace(',', '');
    phrase = phrase.replace(';', '');
    phrase = phrase.replace('&', '');

    const tmp: Array<string> = phrase.split(delim);
    const n: number          = tmp.length;
    let word: string;
    let i: number;

    for (i = 0; i < n; ++i)
    {
      word = toLowerCase ? tmp[i].toLowerCase() : tmp[i];

      // filter out?
      if (filterOut[word] === undefined)
      {
        if (model[word] !== undefined)
        {
          // increment count
          model[word]++;
        }
        else
        {
          // create
          model[word] = 1;
        }
      }
    }
  }

  return model;
}
