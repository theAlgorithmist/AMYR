/**
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
 * AMYR Library: A collection of methods for performing simple Bayesian analyses.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
import {FrequencyTable} from "./frequency-table";

export class Bayes
{
  protected _table: FrequencyTable | null;        // reference to frequency table for naive Bayes analysis
  protected _invalidated: boolean;               // true if data invalidated

  constructor()
  {
    this._table = null;

    this._invalidated = false;
  }

  /**
   * Assign a data provider (frequency table) to be used to drive naive Bayes analysis
   *
   * @param {FrequencyTable} freqTable Reference to a frequency table
   */
  public set table(freqTable: FrequencyTable)
  {
    // a valid FrequencyTable should have a validate() method on its prototype chain
    if (freqTable)
    {
      this._table = freqTable.clone();

      this._invalidated = true;
    }
  }

  /**
   * Perform a naive Bayes analysis, i.e. compute P(c|X1...Xk) based on the supplied frequency table or -1 for
   * invalid data.  This result may contain only the numerator of the Bayes equation if the {numeratorOnly} input
   * is {true}.  Note that the data provider or frequency table reference MUST be assigned in advance of performing
   * this analysis.
   *
   * @param {string} className Class (or row) name from the frequency table
   *
   * @param {Array<string>} predictors List of predictor (column labels) variables names from columns in the frequency table
   *
   * @default false
   *
   * @param {boolean} numeratorOnly Optional parameter to evaluate the numerator only in the posterior probability calculation.
   * This is useful for instances where the same predictors are used across two or more classes and comparisons are made across
   * a common denominator
   *
   * @default false
   *
   * @param {boolean} avoidUnderflow Optional parameter to use an alternate computation method to avoid underflow or other
   * numerical issues that result from the multiplication of a large number of very small values.
   *
   * @default false
   *
   * @returns {number} - Posterior probability value contains P(c|X1...Xk) or -1 for invalid data.  This result may contain
   * only the numerator of the Bayes equation if the numeratorOnly input is true.
   */
  public naive( className: string,
                predictors: Array<string>,
                numeratorOnly: boolean = false,
                avoidUnderflow: boolean = false ): number
  {
    // edge cases
    if (!this._table) return -1

    if (!className || !predictors) return -1

    if (predictors.length === 0) return -1

    let i: number;
    let p: number;
    let prob: number;
    let cond: number;

    // total frequency for all classes and the specified class
    const pc: number  = this._table.getClassProb(className);
    const len: number = predictors.length;

    // break out this case for performance reasons
    if (len === 1)
    {
      // prior probability
      p = this._table.getPrior( predictors[0] );

      // conditional probability
      cond = this._table.getConditional( predictors[0], className );

      // result
      prob = numeratorOnly ? cond*pc : (cond*pc)/p;
    }
    else
    {
      cond = 1.0;
      p    = 1.0;

      const g: Array<number> = new Array<number>();

      if (avoidUnderflow)
      {
        for (i = 0; i < len; ++i)
        {
          g.push( this._table.getConditional( predictors[i], className ) );

          cond += Math.log( g[i] );
          p    *= numeratorOnly ? 1.0 : this._table.getPrior( predictors[i] );
        }

        cond += Math.log( pc );
      }
      else
      {
        for (i = 0; i < len; ++i)
        {
          g.push( this._table.getConditional( predictors[i], className ) );

          cond *= g[i];
          p    *= numeratorOnly ? 1.0 : this._table.getPrior( predictors[i] );
        }

        cond *= pc;
      }

      prob = numeratorOnly ? cond : cond/p;
    }

    return prob;
  }

  /**
   * Clear all internal references and prepare the Bayes class to receive new data
   */
  public clear(): void
  {
    this._table = null;

    this._invalidated = false;
  }
}
