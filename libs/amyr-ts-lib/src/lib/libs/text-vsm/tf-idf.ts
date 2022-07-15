/**
 * Copyright 2018 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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

/**
 * Algorithmist Dev Toolkit - A class library for performing text-frequency and inv. doc. freq. operations.  Each class
 * instance represents a {document} that is a collection of individual phrases, each of which has been processed into
 * a vector state model via {textToVSM}.
 *
 * Lazy validation is used to ensure that internal computations are not performed multiple times in the event nothing
 * has occurred that would change the result of that computation.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
import { vsmNorm } from './vsm-norm';

export class TFIDF
{
  public static readonly GREATEST: string = 'greatest';
  public static readonly LEAST: string    = 'least';

  protected _vsmMatrix: Array<Record<string, number>>;
  protected _tfIdf: Array<Record<string, number>>;
  protected _size: Array<number>;
  protected _freq: Record<string, number>;
  protected _idf: Record<string, number>;
  protected _vocabFreq:Array<Record<string, number>>;

  protected _freqInvalidated = true;
  protected _tfInvalidated   = true;

  /**
   * Construct a new TfIDF class
   */
  constructor()
  {
    this._vsmMatrix = new Array<Record<string, number>>();
    this._vocabFreq = new Array<Record<string, number>>();
    this._tfIdf     = new Array<Record<string, number>>();
    this._size      = new Array<number>();
    this._idf       = {};
    this._freq      = {};
  }

  /**
   * Access the size of the current collection
   */
  public get size(): number
  {
    return this._vsmMatrix.length;
  }

  /**
   * Access the current list of vocabulary words or keywords across all phrases in the document
   */
  public get vocabulary(): Array<string>
  {
    if (this._freqInvalidated) this.computeFreq();

    return Object.keys(this._freq);
  }

  /**
   * Clear the current document and prepare for new input
   */
  public clear(): void
  {
    const n: number = this._vsmMatrix.length;
    let i: number;

    for (i = 0; i < n; ++i)
    {
      this._vsmMatrix[i] = {};
      this._vocabFreq[i] = {};
      this._tfIdf[i]     = {};
    }

    this._vsmMatrix.length = 0;
    this._vocabFreq.length = 0;
    this._size.length      = 0;
    this._tfIdf.length     = 0;
    this._idf              = {};
    this._freq             = {};

    this._freqInvalidated = true;
    this._tfInvalidated   = true;
  }

  /**
   * Add a row or phrase to the current document
   *
   * @param {Record<string, number>} vsm Vector Space Model (typically created with {textToVSM})
   */
  public addRow(vsm: Record<string, number>): void
  {
    if (vsm !== undefined && vsm != null)
    {
      this._vsmMatrix.push(vsm);

      this._size.push(Object.keys(vsm).length);
    }

    this._freqInvalidated = true;
    this._tfInvalidated   = true;
  }

  /**
   * Access the frequency of a word in the current vocabulary or zero if input is invalid
   *
   * @param {string} word keword in the current vocabulary (defined across all phrases in the document)
   */
  public getTF(word: string): number
  {
    if (this._freqInvalidated) this.computeFreq();

    const value: number = this._freq[word];

    return value !== undefined && value != null && !isNaN(value) ? value : 0;
  }

  /**
   * Access the vocabulary frequency in a given phrase
   *
   * @param {number} row Row or phrase number (zero-based index)
   *
   * @param {string} key Keyword in that row
   */
  public getVF(row: number, key: string): number
  {
    if (!isNaN(row) && row >= 0 && row < this._vocabFreq.length)
    {
      row = Math.round(row);
      const vsm: Record<string, number> = this._vocabFreq[row];
      const value: number               = vsm[key];

      return value === undefined ? 0 : value;
    }

    return 0;
  }

  /**
   * Access inverse doc. frequency
   *
   * @param {string} word Desired keyword
   *
   * @returns {number} IDF computation for that word (must first call {computeIDF}
   */
  public getIDF(word: string): number
  {
    if (word !== undefined && word != null && word != '')
    {
      const value: number = this._idf[word];
      return value === undefined ? 0 : value;
    }

    return 0;
  }

  /**
   * Access tf-idf computations for a given row (must first call {tfIDF})
   *
   * @param {number} row Zero-based row number or phrase index
   */
  public getTFIDF(row: number): Record<string, number> | null
  {
    if (this._tfIdf && this._tfIdf.length && this._tfIdf.length > 0)
    {
      row = Math.round(Math.abs(row));

      if (row >= 0 && row < this._tfIdf.length) return JSON.parse(JSON.stringify(this._tfIdf[row]));
    }

    return null;
  }

  /**
   * Compute word frequency across the current document; then use {getFreq} for queries
   */
  public computeFreq(): void
  {
    const n: number = this.size;  // total number of phrases
    let i: number, j: number, k: number, m: number;
    let words: Array<string>, word: string;
    let vsm: Record<string, number>;

    // get number of phrases (matrix rows) in which a keyword occurs
    if (n > 0)
    {
      this._freq = {};

      // first pass sets the initial counts
      vsm   = this._vsmMatrix[0];
      words = Object.keys(vsm);
      k     = words.length;

      for (j = 0; j < k; ++j)
      {
        // for each word, set the count to 1 since all words in this row occur in one phrase
        word            = words[j];
        this._freq[word] = 1;
      }

      // check remaining phrases
      let tmp: number;
      for (i = 1; i < n; ++i)
      {
        vsm   = this._vsmMatrix[i];
        words = Object.keys(vsm);
        k     = words.length;

        for (j = 0; j < k; ++j)
        {
          word = words[j];

          tmp              = this._freq[word];
          this._freq[word] = tmp === undefined ? 1 : tmp+1;
        }

        this._freqInvalidated = false;
      }
    }
  }

  /**
   * Compute frequency values for the input vocabulary; then use {getVF} for queries
   *
   * @param {Array<string>} vocabulary
   */
  public computeVocabFreq(vocabulary: Array<string>): void
  {
    const n: number = this.size;  // total number of phrases to test against
    let i: number, j: number, k: number;
    let word: string;
    let vsm: Record<string, number>, freq: Record<string, number>;

    // get number of phrases (matrix rows) in which a keyword occurs
    if (n > 0)
    {
      this._vocabFreq.length = 0;

      // check all phrases
      k = vocabulary.length;

      for (i = 0; i < n; ++i)
      {
        vsm  = this._vsmMatrix[i];
        freq = {};

        for (j = 0; j < k; ++j)
        {
          word = vocabulary[j];

          if (vsm[word] !== undefined) freq[word] = vsm[word];
        }

        this._vocabFreq.push(freq);
      }
    }
  }

  /**
   * Compute inverse doc. frequency of the current document against a new set of phrases; then use {getIDF} for queries
   *
   * @param {TFIDF} document
   */
  public computeIDF(document: TFIDF): void
  {
    if (!document || document.size === 0) return;

    const d: number                 = document.size;
    const vocabulary: Array<string> = this.vocabulary;
    const n: number                 = vocabulary.length;

    let i: number, j: number, freq: number, tmp: number;
    let word: string;

    this._idf = {};

    // sum the columns and add where there is a nonzero TF in a document phrase
    document.computeVocabFreq(vocabulary);
    for (i = 0; i < n; ++i)
    {
      word = vocabulary[i];

      for (j = 0; j < d; ++j)
      {
        freq = document.getVF(j, word);
        if (freq != 0)
        {
          tmp             = this._idf[word];
          this._idf[word] = tmp == undefined ? 1 : tmp+1;
        }
      }
    }

    // actual IDF computation
    for (i = 0; i < n; ++i)
    {
      word = vocabulary[i];
      freq = this._idf[word];
      freq = freq === undefined ? 0 : freq;

      this._idf[word] = Math.log( d / (1 + freq) );
    }
  }

  /**
   * Compute the full TF-IDF matrix against another document; then use {getTFIDF} for queries
   *
   * @param {TfIDF} document
   */
  public tfIDF(document: TFIDF): void
  {
    if (!document || document.size === 0) return;

    this.computeIDF(document);

    const vocabulary: Array<string> = this.vocabulary;
    const n: number                 = vocabulary.length;
    const d: number                 = document.size;

    let i: number, j: number, tf: number, idf: number, tfidf: number;
    let word: string;

    this._tfIdf = new Array<Record<string, number>>();

    const sums: Array<number> = new Array<number>();

    for (j = 0; j < d; ++j)
    {
      this._tfIdf.push({});
      sums.push(0);
    }

    for (i = 0; i < n; ++i)
    {
      word = vocabulary[i];

      for (j = 0; j < d; ++j)
      {
        tf  = document.getVF(j, word);
        idf = this._idf[word];
        idf = idf === undefined ? 0 : idf;

        tfidf = tf*idf;

        if (Math.abs(tfidf) > 0.000001 )
        {
          this._tfIdf[j][word] = tfidf;
          sums[j]             += tfidf*tfidf;   // for normalization
        }
      }
    }

    // normalize
    let words: Array<string>;
    let k: number, norm: number, vsm: Record<string, number>;

    for (j = 0; j < d; ++j)
    {
      norm  = 1.0/Math.sqrt(sums[j]);
      words = Object.keys(this._tfIdf[j]);
      k     = words.length;
      vsm   = this._tfIdf[j];

      for (i = 0; i < k; ++i)
      {
        word       = words[i];
        vsm[word] *= norm;
      }
    }

    this._tfInvalidated = false;
  }

  /**
   * Determine which phrase (row) in an input document is the most or least similar to the current collection.  Returns
   * the row number of the index (phrase) in the test set with greatest/least similarity to the current document as a
   * whole based on TF-IDF
   *
   * @param {TFIDF} document Input document or set of phrases to test against the current 'training' set
   *
   * @param {string} comparator {TfIDF.GREATEST} for greatest similarity and {TfIDF.LEAST} for least similarity
   */
  public similarityTo(document: TFIDF, comparator: string = TFIDF.GREATEST): number
  {
    if (!document || document.size === 0) return -1;

    const d: number = document.size;

    if (this._tfInvalidated) this.tfIDF(document);

    let value: number;
    let best: number = comparator == TFIDF.GREATEST ? Number.MAX_VALUE : -Number.MAX_VALUE;
    let bestIndex    = -1;

    let i: number, j: number, k: number;
    let keys: Array<string>;
    let vsm: Record<string, number>;

    // current approach is more of a placeholder - look for the smallest sum across the tf-idf for 'greatest' similarity
    // and reverse for opposite; this is equiv to cosineSim of a unit vector that weights each of the terms in the
    // vocabulary equally.
    if (comparator == TFIDF.GREATEST)
    {
      for (i = 0; i < d; ++i)
      {
        value = 0;
        vsm   = this._tfIdf[i];
        keys  = Object.keys(vsm);
        k     = keys.length;

        for (j = 0; j < k; ++j) {
          value += vsm[keys[j]];
        }

        if (value < best)
        {
          best      = value;
          bestIndex = i;
        }
      }
    }
    else
    {
      for (i = 0; i < d; ++i)
      {
        value = 0;
        vsm   = this._tfIdf[i];
        keys  = Object.keys(vsm);
        k     = keys.length;

        for (j = 0; j < k; ++j) {
          value += vsm[keys[j]];
        }

        if (value > best)
        {
          best      = value;
          bestIndex = i;
        }
      }
    }

    return bestIndex;
  }

  /**
   * Compute the greatest or least similarity of one phrase in the current collection against other phrases, starting
   * at a prescribed phrase (index). Returns the of phrase in the current collection having greatest/least similarity
   * based on a combination of most keywords matched and frequency of matched keywords
   *
   * @param {number} row Zero-based row index of comparison phrase
   *
   * @param {string} comparator {TfIDF.GREATEST} for greatest similarity and {TfIDF.LEAST} for least similarity
   *
   * @param {number} startAt Start the comparison at this phrase (or row index)
   */
  public similarity(row: number, comparator: string = TFIDF.GREATEST, startAt: number = 0): number
  {
    if (isNaN(row) || row < 0 || row > this.size-1) return -1;


    const d: number = this.size;
    startAt         = Math.round(Math.abs(startAt));
    startAt         = Math.min(startAt, d-1);

    row = Math.round(row);

    const vsm: Record<string, number> = this._vsmMatrix[row];

    let value: number;
    let best: number = comparator == TFIDF.GREATEST ? -Number.MAX_VALUE : Number.MAX_VALUE;
    let bestIndex    = -1;

    let i: number;

    if (comparator == TFIDF.GREATEST)
    {
      for (i = startAt; i < d && i != row; ++i)
      {
        value = vsmNorm(vsm, this._vsmMatrix[i]);

        if (value > best)
        {
          best      = value;
          bestIndex = i;
        }
      }
    }
    else
    {
      for (i = startAt; i < d && i != row; ++i)
      {
        value = vsmNorm(vsm, this._tfIdf[i]);

        if (value < best)
        {
          best      = value;
          bestIndex = i;
        }
      }
    }

    return bestIndex;
  }
}
